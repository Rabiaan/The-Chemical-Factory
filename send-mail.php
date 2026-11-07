<?php
/**
 * THE CHEMICAL FACTORY — contact / quote form endpoint.
 *
 * Receives JSON from js/forms.js (fetch, same-origin) and emails the
 * enquiry to the monitored sales inbox. No third-party service.
 *
 * Host requirements: PHP 7+ with the mail() function enabled (standard
 * on cPanel / shared Apache hosting).
 *
 * Security notes:
 *  - POST only.
 *  - The request body and every visitor field are length-bounded; CR/LF is
 *    stripped before input is placed in mail headers or the message body.
 *  - Reply-To is only set when the input looks like an email address.
 *  - A per-IP rolling-window limit applies before sending mail.
 *  - From uses the fixed site domain, never request headers or visitor input.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

const TO_ADDRESS   = 'dechemicalfactory@gmail.com';
const MAX_FIELD    = 2000;   /* hard cap per field, server-side */
const MAX_REQUEST  = 16384;  /* bound raw request memory use */
const ALLOWED_FORM = ['contact', 'quote'];
const RATE_WINDOW  = 900;    /* seconds */
const RATE_LIMIT   = 5;      /* accepted submissions per IP per window */

function respond(int $status, string $statusMessage, array $extra = []): void {
    http_response_code($status);
    echo json_encode(array_merge(
        ['ok' => $status < 400, 'status' => $statusMessage],
        $extra
    ));
    exit;
}

/** Trim, strip control chars / newlines, bound length. */
function clean($value): string {
    if (!is_scalar($value)) {
        return '';
    }
    $value = (string) $value;
    $value = preg_replace('/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/u', '', $value) ?? '';
    $value = str_replace(["\r", "\n"], ' ', $value);
    $value = trim($value);
    if (strlen($value) > MAX_FIELD) {
        $value = substr($value, 0, MAX_FIELD);
    }
    return $value;
}

/** Rolling-window limiter stored outside the document root, keyed by peer IP.
 * Returns 0 when allowed, 1 when over quota, and -1 if storage failed. */
function rateLimitStatus(string $ip): int {
    $path = dirname(__DIR__) . DIRECTORY_SEPARATOR . '.tcf-mail-rate-limit.json';
    $file = @fopen($path, 'c+');
    if ($file === false) {
        /* Fail closed: do not send mail when abuse controls cannot run. */
        return -1;
    }
    @chmod($path, 0600);
    if (!flock($file, LOCK_EX)) {
        fclose($file);
        return -1;
    }

    rewind($file);
    $raw = stream_get_contents($file, 1048577);
    if ($raw === false || strlen($raw) > 1048576) {
        flock($file, LOCK_UN);
        fclose($file);
        return -1;
    }
    $state = $raw === '' ? [] : json_decode($raw, true);
    if (!is_array($state)) {
        flock($file, LOCK_UN);
        fclose($file);
        return -1;
    }

    $now = time();
    foreach ($state as $key => $timestamps) {
        if (!is_array($timestamps)) {
            unset($state[$key]);
            continue;
        }
        $state[$key] = array_values(array_filter($timestamps, function ($stamp) use ($now) {
            return is_int($stamp) && $stamp > $now - RATE_WINDOW;
        }));
        if (!$state[$key]) unset($state[$key]);
    }

    $key = hash('sha256', $ip);
    $timestamps = $state[$key] ?? [];
    if (count($timestamps) >= RATE_LIMIT) {
        flock($file, LOCK_UN);
        fclose($file);
        return 1;
    }
    $state[$key][] = $now;

    /* Bound persistent state if many unique source addresses appear. */
    if (count($state) > 10000) {
        uasort($state, function ($a, $b) { return end($a) <=> end($b); });
        $state = array_slice($state, -10000, null, true);
    }
    $encoded = json_encode($state);
    if ($encoded === false || strlen($encoded) > 1048576) {
        flock($file, LOCK_UN);
        fclose($file);
        return -1;
    }
    rewind($file);
    if (!ftruncate($file, 0) || fwrite($file, $encoded) !== strlen($encoded)) {
        flock($file, LOCK_UN);
        fclose($file);
        return -1;
    }
    fflush($file);
    flock($file, LOCK_UN);
    fclose($file);
    return 0;
}

function looksLikeEmail(string $value): bool {
    return (bool) filter_var($value, FILTER_VALIDATE_EMAIL);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, 'method_not_allowed');
}

$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > MAX_REQUEST) {
    header('Connection: close');
    respond(413, 'request_too_large');
}
$input = fopen('php://input', 'rb');
$raw = $input ? stream_get_contents($input, MAX_REQUEST + 1) : false;
if ($input) fclose($input);
if ($raw === false || strlen($raw) > MAX_REQUEST) {
    respond(413, 'request_too_large');
}
$data = json_decode($raw, true);
if (!is_array($data)) {
    /* Also accept a normal form POST (defensive; JS sends JSON). */
    $data = $_POST;
}
if (!is_array($data)) {
    respond(400, 'bad_request');
}

$formType = clean($data['form'] ?? 'contact');
if (!in_array($formType, ALLOWED_FORM, true)) {
    $formType = 'contact';
}

$name    = clean($data['name'] ?? '');
$phone   = clean($data['phone'] ?? '');
$email   = clean($data['email'] ?? '');
$subject = clean($data['subject'] ?? '');
$message = clean($data['message'] ?? '');

if ($name === '' || $phone === '') {
    respond(422, 'missing_required_fields');
}

$limitStatus = rateLimitStatus((string) ($_SERVER['REMOTE_ADDR'] ?? ''));
if ($limitStatus < 0) {
    respond(503, 'rate_limit_unavailable');
}
if ($limitStatus > 0) {
    header('Retry-After: ' . RATE_WINDOW);
    respond(429, 'rate_limited');
}

if ($formType === 'quote') {
    $lines = [
        'Quote request from thechemicalfactory.com',
        '',
        'Name: '            . $name,
        'Phone: '           . $phone,
        'Email: '           . ($email !== '' ? $email : '(not provided)'),
        'City: '            . clean($data['city'] ?? ''),
        'Area type: '       . clean($data['areaType'] ?? ''),
        'System: '          . clean($data['system'] ?? ''),
        'Estimated area: '  . clean($data['sqft'] ?? ''),
        'Indicative range: '. clean($data['price'] ?? ''),
        'Observed symptoms: '. clean($data['symptoms'] ?? ''),
        '',
        'Project notes:',
        $message !== '' ? $message : '(none)',
    ];
    $mailSubject = 'Quote request: ' . ($subject !== '' ? $subject : 'General');
} else {
    $lines = [
        'Website enquiry from thechemicalfactory.com',
        '',
        'Name: '    . $name,
        'Phone: '   . $phone,
        'Email: '   . ($email !== '' ? $email : '(not provided)'),
        'Subject: ' . ($subject !== '' ? $subject : 'General'),
        '',
        'Project details:',
        $message !== '' ? $message : '(none)',
    ];
    $mailSubject = 'Website enquiry: ' . ($subject !== '' ? $subject : 'General');
}

$body = implode("\n", $lines) . "\n";

/* Use a fixed sender domain; HTTP_HOST is controlled by the requester. */
$fromAddress = 'website-no-reply@thechemicalfactory.com';

$headers = [
    'From: The Chemical Factory Website <' . $fromAddress . '>',
    'Reply-To: ' . TO_ADDRESS,
    'X-Mailer: PHP/' . PHP_VERSION,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
];
if (looksLikeEmail($email)) {
    $headers[1] = 'Reply-To: ' . $email;
}

$headersLine = implode("\r\n", $headers);

/* sendmail_path may be empty on local/dev machines; that is a host config
   issue, reported honestly as an error so the UI can offer the mailto: fallback. */
$sendmail = (string) ini_get('sendmail_path');
if (trim($sendmail) === '') {
    respond(503, 'mail_unavailable', ['detail' => 'sendmail_path not configured on this host']);
}

$sent = mail(TO_ADDRESS, $mailSubject, $body, $headersLine);

if (!$sent) {
    respond(502, 'mail_failed');
}

respond(200, 'sent', ['to' => TO_ADDRESS]);
