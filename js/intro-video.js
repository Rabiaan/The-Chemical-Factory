// Intro video: custom controls, click-to-load, pauses when scrolled away.
// Load with <script src="js/intro-video.js" defer></script> on index.html only.
(function () {
  var stage = document.getElementById('ivid-stage');
  if (!stage) return;

  var video = document.getElementById('ivid-video');
  var playBtn = document.getElementById('ivid-play');
  var toggleBtn = document.getElementById('ivid-toggle');
  var muteBtn = document.getElementById('ivid-mute');
  var progress = document.getElementById('ivid-progress');
  var fill = document.getElementById('ivid-fill');

  function play() {
    stage.classList.add('has-started');
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  }
  function toggle() { video.paused ? play() : video.pause(); }

  playBtn.addEventListener('click', function () { video.muted = false; stage.classList.remove('is-muted'); play(); });
  toggleBtn.addEventListener('click', toggle);
  video.addEventListener('click', toggle);

  muteBtn.addEventListener('click', function () {
    video.muted = !video.muted;
    stage.classList.toggle('is-muted', video.muted);
    muteBtn.setAttribute('aria-label', video.muted ? 'Unmute video' : 'Mute video');
  });

  video.addEventListener('play', function () {
    stage.classList.add('is-playing');
    toggleBtn.setAttribute('aria-label', 'Pause video');
  });
  video.addEventListener('pause', function () {
    stage.classList.remove('is-playing');
    toggleBtn.setAttribute('aria-label', 'Play video');
  });
  video.addEventListener('ended', function () {
    video.currentTime = 0;
    stage.classList.remove('is-playing', 'has-started');
    fill.style.width = '0%';
    progress.setAttribute('aria-valuenow', '0');
  });
  video.addEventListener('timeupdate', function () {
    if (!video.duration) return;
    var pct = (video.currentTime / video.duration) * 100;
    fill.style.width = pct + '%';
    progress.setAttribute('aria-valuenow', String(Math.round(pct)));
  });

  // seek: click / tap
  progress.addEventListener('click', function (e) {
    if (!video.duration) return;
    var r = progress.getBoundingClientRect();
    video.currentTime = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1) * video.duration;
  });
  // seek: keyboard
  progress.addEventListener('keydown', function (e) {
    if (!video.duration) return;
    if (e.key === 'ArrowRight') { video.currentTime = Math.min(video.currentTime + 5, video.duration); e.preventDefault(); }
    if (e.key === 'ArrowLeft')  { video.currentTime = Math.max(video.currentTime - 5, 0); e.preventDefault(); }
  });

  // pause when the section leaves the screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (!en.isIntersecting && !video.paused) video.pause(); });
    }, { threshold: 0.25 }).observe(stage);
  }
})();
