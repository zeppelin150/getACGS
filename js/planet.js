// js/planet.js — Anthropic-style scroll-through: text fades, planet grows, sticky hero
(function () {
  'use strict';

  var img = document.getElementById('neptune-img');
  if (!img) return;

  var track = document.querySelector('.hero-track');
  var hero = document.querySelector('.hero');
  var heroContent = document.querySelector('.hero-content');
  var targetMX = 0, targetMY = 0;
  var currentMX = 0, currentMY = 0;
  var scrollScale = 1;
  var scrollProgress = 0;
  var running = true;
  var raf;

  // Configuration
  var MIN_SCALE = 1;
  var MAX_SCALE = 2.4;
  var PARALLAX_BASE = 24;
  var PARALLAX_Y_BASE = 16;
  var GLOW_MIN = 0.35;
  var GLOW_MAX = 0.85;
  var FLOAT_AMPLITUDE = 10;   // px
  var FLOAT_PERIOD = 8000;    // ms
  var TEXT_FADE_END = 0.35;   // text fully gone by 35% of scroll progress

  // Scroll-driven expansion — uses .hero-track as the scroll runway
  window.addEventListener('scroll', function () {
    if (!track) return;
    var rect = track.getBoundingClientRect();
    var scrollRoom = rect.height - window.innerHeight;
    if (scrollRoom <= 0) return;
    var p = Math.max(0, Math.min(1, -rect.top / scrollRoom));

    // Gentle ease-out: every scroll tick produces visible, proportional growth
    var eased = 1 - (1 - p) * (1 - p);

    scrollScale = MIN_SCALE + eased * (MAX_SCALE - MIN_SCALE);
    scrollProgress = p;

    // Fade hero text out in first 40% of scroll
    if (heroContent) {
      var textOpacity = Math.max(0, 1 - (p / TEXT_FADE_END));
      var textTranslate = Math.min(p / TEXT_FADE_END, 1) * -80;
      heroContent.style.opacity = textOpacity;
      heroContent.style.transform = 'translateY(' + textTranslate + 'px)';
    }
  }, { passive: true });

  // Mouse parallax — reduced at larger scales
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

    // Dynamic glow: intensifies as planet grows
    var glowLevel = GLOW_MIN + scrollProgress * (GLOW_MAX - GLOW_MIN);
    img.style.setProperty('--planet-glow', glowLevel);

    raf = requestAnimationFrame(tick);
  }

  tick();
})();
