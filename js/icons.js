/* ============================================================
   THE CHEMICAL FACTORY — animated icon library
   CSS ports of lucide-animated icons. Triggered by hover on the
   .ani wrapper or any interactive ancestor (see styles.css).
   Usage: ICON('map-pin') → '<span class="ani ani--map-pin">…svg…</span>'
   Static pages: <span data-icon="map-pin"></span> (auto-filled).
   ============================================================ */
(function () {
  'use strict';

  function svg(inner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }

  var ICONS = {
    home:
      '<path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'
      + '<path class="b-draw" pathLength="1" d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>',

    'arrow-right':
      '<path class="p1" d="M5 12h14"/>'
      + '<path class="p2 b-shift-x" d="m12 5 7 7-7 7"/>',

    'arrow-up-right':
      '<g class="g1 b-nudge-ur"><path d="M7 7H17"/><path d="M17 7V17"/><path d="M7 17 17 7"/></g>',

    'arrow-down':
      '<path class="p1 b-sink" d="m19 12-7 7-7-7"/>'
      + '<path class="p2" d="M12 5v14"/>',

    'chevron-down':
      '<path class="b-hop" d="m6 9 6 6 6-6"/>',

    plus:
      '<path d="M5 12h14"/><path d="M12 5v14"/>',

    x:
      '<path class="b-draw" pathLength="1" d="M18 6 6 18"/>'
      + '<path class="b-draw2" pathLength="1" d="m6 6 12 12"/>',

    search:
      '<circle cx="11" cy="11" r="8"/>'
      + '<path d="m21 21-4.3-4.3"/>',

    download:
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>'
      + '<g class="g1 b-sink"><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></g>',

    eye:
      '<path class="b-blinkx" d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>'
      + '<circle class="b-blinkx c" cx="12" cy="12" r="3"/>',

    play:
      '<polygon class="b-wiggle" points="6 3 20 12 6 21 6 3"/>',

    send:
      '<g class="g1 b-fly"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></g>'
      + '<path class="b-draw trail" pathLength="1" d="M2.5 21.5c2.5-1 5.5-4 7.5-7"/>',

    'message-circle':
      '<path class="b-wiggle b-pop" d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',

    sparkles:
      '<path class="p1 b-pop" d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>'
      + '<path class="s1 b-blink" d="M20 3v4"/>'
      + '<path class="s2 b-blink" d="M22 5h-4"/>'
      + '<path class="s3 b-blink" d="M4 17v2"/>'
      + '<path class="s4 b-blink" d="M5 18H3"/>',

    zap:
      '<path class="b-draw" pathLength="1" d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',

    'shield-check':
      '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>'
      + '<path class="b-draw b-pop" pathLength="1" d="m9 12 2 2 4-4"/>',

    'circle-check':
      '<circle cx="12" cy="12" r="10"/>'
      + '<path class="b-draw" pathLength="1" d="m9 12 2 2 4-4"/>',

    check:
      '<path class="b-draw b-pop" pathLength="1" d="M4 12 9 17 20 6"/>',

    activity:
      '<path class="b-draw" pathLength="1" d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',

    layers:
      '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>'
      + '<path class="l1" d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>'
      + '<path class="l2" d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',

    'clipboard-check':
      '<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/>'
      + '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>'
      + '<path class="b-draw" pathLength="1" d="m9 14 2 2 4-4"/>',

    flask:
      '<g class="b-wiggle">'
      + '<path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/>'
      + '<path d="M8.5 2h7"/><path d="M7 16h10"/>'
      + '</g>',

    'layout-grid':
      '<rect class="r1" width="7" height="7" x="3" y="3" rx="1"/>'
      + '<rect class="r2" width="7" height="7" x="14" y="3" rx="1"/>'
      + '<rect class="r3" width="7" height="7" x="14" y="14" rx="1"/>'
      + '<rect class="r4" width="7" height="7" x="3" y="14" rx="1"/>',

    'circle-dollar-sign':
      '<circle cx="12" cy="12" r="10"/>'
      + '<path class="b-draw" pathLength="1" d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>'
      + '<path class="b-draw2" pathLength="1" d="M12 18V6"/>',

    droplet:
      '<path class="b-draw" pathLength="1" d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',

    'spray-can':
      '<rect width="4" height="4" x="15" y="5"/>'
      + '<path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2"/>'
      + '<path d="m13 14 8-2"/>'
      + '<path d="m13 19 8-2"/>'
      + '<g class="dots"><path class="d1" d="M11 7h.01"/><path class="d2" d="M7 5h.01"/><path class="d3" d="M7 9h.01"/><path class="d4" d="M3 3h.01"/><path class="d5" d="M3 7h.01"/><path class="d6" d="M3 11h.01"/></g>',

    hammer:
      '<g class="b-swing">'
      + '<path d="m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9"/>'
      + '<path d="m18 15 4-4"/>'
      + '<path d="m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5"/>'
      + '</g>',

    wrench:
      '<g class="b-wiggle">'
      + '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>'
      + '</g>',

    compass:
      '<circle cx="12" cy="12" r="10"/>'
      + '<polygon class="needle b-spin" points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',

    stamp:
      '<g class="b-pop">'
      + '<path d="M5 22h14"/>'
      + '<path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z"/>'
      + '<path d="M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13"/>'
      + '</g>',

    'at-sign':
      '<circle class="b-draw" pathLength="1" cx="12" cy="12" r="4"/>'
      + '<path class="b-draw2" pathLength="1" d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',

    clock:
      '<circle cx="12" cy="12" r="10"/>'
      + '<line class="h1" x1="12" x2="12" y1="12" y2="6"/>'
      + '<line class="h2" x1="12" x2="16" y1="12" y2="12"/>',

    'map-pin':
      '<path class="b-hop" d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>'
      + '<circle class="c1 b-draw2" pathLength="1" cx="12" cy="10" r="3"/>',

    phone:
      '<path class="b-wiggle" d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/>',

    users:
      '<g class="b-pop">'
      + '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>'
      + '<circle cx="9" cy="7" r="4"/>'
      + '<path d="M22 21v-2a4 4 0 0 0-3-3.87"/>'
      + '<path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
      + '</g>',

    box:
      '<g class="b-pop">'
      + '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>'
      + '<path d="m3.3 7 8.7 5 8.7-5"/>'
      + '<path d="M12 22V12"/>'
      + '</g>',

    'heart-pulse':
      '<g class="b-pulse">'
      + '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'
      + '<path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>'
      + '</g>',

    flame:
      '<path class="b-flicker" d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',

    gauge:
      '<g class="b-wiggle">'
      + '<path d="m12 14 4-4"/>'
      + '<path d="M3.34 19a10 10 0 1 1 17.32 0"/>'
      + '</g>',

    construction:
      '<g class="b-wiggle">'
      + '<rect x="2" y="6" width="20" height="8" rx="1"/>'
      + '<path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/>'
      + '<path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/><path d="m8 6 8 8"/>'
      + '</g>',

    'file-check':
      '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>'
      + '<path d="M14 2v4a2 2 0 0 0 2 2h4"/>'
      + '<path class="b-draw" pathLength="1" d="m9 15 2 2 4-4"/>',

    'file-text':
      '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>'
      + '<path d="M14 2v4a2 2 0 0 0 2 2h4"/>'
      + '<path class="b-draw" pathLength="1" d="M10 9H8"/>'
      + '<path class="b-draw2" pathLength="1" d="M16 13H8"/>'
      + '<path class="b-draw3" pathLength="1" d="M16 17H8"/>',

    instagram:
      '<g class="b-pop">'
      + '<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>'
      + '<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>'
      + '<line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>'
      + '</g>',

    facebook:
      '<g class="b-pop"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></g>',

    linkedin:
      '<g class="b-pop">'
      + '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4V8h4v2.5A6 6 0 0 1 16 8z"/>'
      + '<rect width="4" height="12" x="2" y="9"/>'
      + '<circle cx="4" cy="4" r="2"/>'
      + '</g>',

    twitter:
      '<g class="b-pop"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></g>'
  };

  function icon(name, className) {
    var inner = ICONS[name];
    if (!inner) return '';
    return '<span class="ani ani--' + name + (className ? ' ' + className : '') + '" aria-hidden="true">' + svg(inner) + '</span>';
  }

  function fill() {
    var els = document.querySelectorAll('[data-icon]');
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      el.outerHTML = icon(el.getAttribute('data-icon'), el.getAttribute('data-class') || '');
    }
  }

  window.ICON = icon;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fill);
  } else {
    fill();
  }
})();
