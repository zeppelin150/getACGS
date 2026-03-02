// js/planet.js — Invisible expanding wrapper reveals planet on scroll
(function () {
  'use strict';

  var img = document.getElementById('neptune-img');
  if (!img) return;

  var track = document.querySelector('.hero-track');
  var heroContent = document.querySelector('.hero-content');
  var planetContainer = document.querySelector('.planet-container');
  var targetMX = 0, targetMY = 0;
  var currentMX = 0, currentMY = 0;
  var scrollProgress = 0;
  var running = true;
  var raf;

  // Invisible clip expansion (GPU-accelerated, no layout reflow)
  var START_INSET = 18;           // % cropped each side at scroll=0

  // Parallax + ambient
  var PARALLAX_BASE = 18;
  var PARALLAX_Y_BASE = 12;
  var GLOW_MIN = 0.35;
  var GLOW_MAX = 0.65;
  var FLOAT_AMPLITUDE = 8;
  var FLOAT_PERIOD = 8000;
  var TEXT_FADE_END = 0.25;

  // Scroll handler
  window.addEventListener('scroll', function () {
    if (!track) return;
    var rect = track.getBoundingClientRect();
    var scrollRoom = rect.height - window.innerHeight;
    if (scrollRoom <= 0) return;
    var p = Math.max(0, Math.min(1, -rect.top / scrollRoom));

    scrollProgress = p;

    // Expand invisible clip (GPU-only, no layout)
    if (planetContainer) {
      var inset = START_INSET * (1 - p);
      planetContainer.style.clipPath = 'inset(0 ' + inset + '% 0 ' + inset + '%)';
    }

    // Fade hero text
    if (heroContent) {
      var textOpacity = Math.max(0, 1 - (p / TEXT_FADE_END));
      var textTranslate = Math.min(p / TEXT_FADE_END, 1) * -60;
      heroContent.style.opacity = textOpacity;
      heroContent.style.transform = 'translateY(' + textTranslate + 'px)';
    }
  }, { passive: true });

  // Mouse parallax
  document.addEventListener('mousemove', function (e) {
    var dampening = 1 - (scrollProgress * 0.6);
    targetMX = (e.clientX / window.innerWidth - 0.5) * PARALLAX_BASE * dampening;
    targetMY = (e.clientY / window.innerHeight - 0.5) * PARALLAX_Y_BASE * dampening;
  });

  // Pause off-screen
  if (track && typeof IntersectionObserver !== 'undefined') {
    var io = new IntersectionObserver(function (entries) {
      running = entries[0].isIntersecting;
      if (running && !raf) tick();
    }, { threshold: 0 });
    io.observe(track);
  }

  function tick() {
    if (!running) { raf = null; return; }

    currentMX += (targetMX - currentMX) * 0.05;
    currentMY += (targetMY - currentMY) * 0.05;

    var t = (performance.now() % FLOAT_PERIOD) / FLOAT_PERIOD;
    var floatOffset = (Math.cos(t * Math.PI * 2) - 1) * 0.5 * FLOAT_AMPLITUDE;

    img.style.setProperty('--planet-tx', currentMX + 'px');
    img.style.setProperty('--planet-ty', (currentMY + floatOffset) + 'px');

    var glowLevel = GLOW_MIN + scrollProgress * (GLOW_MAX - GLOW_MIN);
    img.style.setProperty('--planet-glow', glowLevel);

    raf = requestAnimationFrame(tick);
  }

  tick();
})();
