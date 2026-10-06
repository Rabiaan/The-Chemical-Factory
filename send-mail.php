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
 *  - All visitor input is length-bounded and stripped of CR/LF before it
 *    is placed in headers or body (blocks header injection).
 *  - Reply-To is only set when the input looks like an email address.
 *  - From is derived from the site host, never from visitor input.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

const TO_ADDRESS   = 'dechemicalfactory@gmail.com';
const MAX_FIELD    = 2000;   /* hard cap per field, server-side */
const ALLOWED_FORM = ['contact', 'quote'];

function respond(int $status, string $statusMessage, array $extra = []): void {
    http_response_code($status);
    echo json_encode(array_merge(
        ['ok' => $status < 400, 'status' => $statusMessage],
        $extra
    ));
    exit;
}

/** Trim, strip control chars / newlines, bound length. */
function clean(?string $value): string {
    if ($value === null) {
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

function looksLikeEmail(string $value): bool {
    return (bool) filter_var($value, FILTER_VALIDATE_EMAIL);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, 'method_not_allowed');
}

$raw = file_get_contents('php://input') ?: '';
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

/* Headers: never echo visitor input into From. Reply-To only if valid. */
$host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? 'thechemicalfactory'));
$host = preg_replace('/[^a-z0-9.\-]/', '', $host) ?: 'thechemicalfactory';
$fromAddress = 'website-no-reply@' . $host;

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
