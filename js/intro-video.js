/* ============================================================
   INTRODUCTION VIDEO — poster → video swap with IntersectionObserver
   ============================================================ */

(function () {
  const frameSelector = '.intro__video-frame';
  const posterSelector = '.intro__poster';
  const playSelector = '.intro__play';
  const videoSources = [
    { src: 'videos/intro.webm', type: 'video/webm' },
    { src: 'videos/intro.mp4', type: 'video/mp4' }
  ];

  function swapToVideo(frame) {
    if (frame.dataset.swapped === 'true') return;

    const poster = frame.querySelector(posterSelector);
    const playBtn = frame.querySelector(playSelector);

    const video = document.createElement('video');
    video.controls = true;
    video.playsInline = true;
    video.autoPlay = true;
    video.preload = 'none';
    video.poster = poster ? poster.src : '';
    video.className = 'intro__video-frame-video';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.objectFit = 'cover';
    video.style.display = 'block';

    videoSources.forEach(function (source) {
      var sourceEl = document.createElement('source');
      sourceEl.src = source.src;
      sourceEl.type = source.type;
      video.appendChild(sourceEl);
    });

    if (poster) poster.remove();
    if (playBtn) playBtn.remove();

    frame.appendChild(video);
    frame.dataset.swapped = 'true';
  }

  function setupPlayButton(frame) {
    var playBtn = frame.querySelector(playSelector);
    if (!playBtn) return;

    playBtn.addEventListener('click', function () {
      swapToVideo(frame);
    });
  }

  function init() {
    var frames = document.querySelectorAll(frameSelector);
    frames.forEach(function (frame) {
      setupPlayButton(frame);
    });

    // Pause video when section scrolls out of view
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) {
          var video = entry.target.querySelector('video');
          if (video) video.pause();
        }
      });
    }, { threshold: 0 });

    frames.forEach(function (frame) {
      observer.observe(frame);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
