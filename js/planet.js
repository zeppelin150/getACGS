// js/planet.js — Iris-frame scroll effect on planet container only (text unaffected)
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
  var scrollScale = 1;
  var running = true;
  var raf;

  // Configuration
  var MIN_SCALE = 1;
  var MAX_SCALE = 1.12;          // planet barely grows — the iris does the work
  var IRIS_START = 18;            // % inset from each side at scroll=0
  var IRIS_END = 0;               // fully revealed at scroll=1
  var PARALLAX_BASE = 24;
  var PARALLAX_Y_BASE = 16;
  var GLOW_MIN = 0.35;
  var GLOW_MAX = 0.75;
  var FLOAT_AMPLITUDE = 10;       // px
  var FLOAT_PERIOD = 8000;        // ms
  var TEXT_FADE_END = 0.2;        // text fully gone by 20% of scroll

  // Scroll-driven iris on planet container only
  window.addEventListener('scroll', function () {
    if (!track) return;
    var rect = track.getBoundingClientRect();
    var scrollRoom = rect.height - window.innerHeight;
    if (scrollRoom <= 0) return;
    var p = Math.max(0, Math.min(1, -rect.top / scrollRoom));

    scrollProgress = p;

    // Linear planet scale: barely noticeable
    scrollScale = MIN_SCALE + p * (MAX_SCALE - MIN_SCALE);

    // Iris: clip-path on planet container shrinks from IRIS_START% → IRIS_END%
    var inset = IRIS_START - p * (IRIS_START - IRIS_END);
    if (planetContainer) {
      planetContainer.style.clipPath = 'inset(0 ' + inset + '% 0 ' + inset + '%)';
    }

    // Fade hero text out in first 20% of scroll
    if (heroContent) {
      var textOpacity = Math.max(0, 1 - (p / TEXT_FADE_END));
      var textTranslate = Math.min(p / TEXT_FADE_END, 1) * -80;
      heroContent.style.opacity = textOpacity;
      heroContent.style.transform = 'translateY(' + textTranslate + 'px)';
    }
  }, { passive: true });

  // Mouse parallax — reduced as iris opens
  document.addEventListener('mousemove', function (e) {
    var dampening = 1 - (scrollProgress * 0.8);
    targetMX = (e.clientX / window.innerWidth - 0.5) * PARALLAX_BASE * dampening;
    targetMY = (e.clientY / window.innerHeight - 0.5) * PARALLAX_Y_BASE * dampening;
  });

  // Pause when hero track is not visible
  if (track && typeof IntersectionObserver !== 'undefined') {
    var io = new IntersectionObserver(function (entries) {
      running = entries[0].isIntersecting;
      if (running && !raf) tick();
    }, { threshold: 0 });
    io.observe(track);
  }

  function tick() {
    if (!running) { raf = null; return; }

    // Smooth mouse lerp
    currentMX += (targetMX - currentMX) * 0.05;
    currentMY += (targetMY - currentMY) * 0.05;

    // Float oscillation
    var t = (performance.now() % FLOAT_PERIOD) / FLOAT_PERIOD;
    var floatOffset = (Math.cos(t * Math.PI * 2) - 1) * 0.5 * FLOAT_AMPLITUDE;

    img.style.setProperty('--planet-scale', scrollScale);
    img.style.setProperty('--planet-tx', currentMX + 'px');
    img.style.setProperty('--planet-ty', (currentMY + floatOffset) + 'px');

    // Dynamic glow
    var glowLevel = GLOW_MIN + scrollProgress * (GLOW_MAX - GLOW_MIN);
    img.style.setProperty('--planet-glow', glowLevel);

    raf = requestAnimationFrame(tick);
  }

  tick();
})();
