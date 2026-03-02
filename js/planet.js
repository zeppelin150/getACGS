// js/planet.js — Dramatic scroll expansion + mouse parallax for Neptune image
(function () {
  'use strict';

  var img = document.getElementById('neptune-img');
  if (!img) return;

  var hero = document.querySelector('.hero');
  var targetMX = 0, targetMY = 0;
  var currentMX = 0, currentMY = 0;
  var scrollScale = 1;
  var scrollProgress = 0;
  var running = true;
  var raf;

  // Configuration
  var MIN_SCALE = 1;
  var MAX_SCALE = 3.8;
  var PARALLAX_BASE = 24;
  var PARALLAX_Y_BASE = 16;
  var GLOW_MIN = 0.35;
  var GLOW_MAX = 0.85;

  // Scroll-driven expansion — dramatic Anthropic-style
  window.addEventListener('scroll', function () {
    if (!hero) return;
    var rect = hero.getBoundingClientRect();
    var p = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.7)));

    // Smoothstep easing for dramatic acceleration
    var eased = p * p * (3 - 2 * p);

    scrollScale = MIN_SCALE + eased * (MAX_SCALE - MIN_SCALE);
    scrollProgress = p;
  }, { passive: true });

  // Mouse parallax — reduced at larger scales
  document.addEventListener('mousemove', function (e) {
    var dampening = 1 - (scrollProgress * 0.8);
    targetMX = (e.clientX / window.innerWidth - 0.5) * PARALLAX_BASE * dampening;
    targetMY = (e.clientY / window.innerHeight - 0.5) * PARALLAX_Y_BASE * dampening;
  });

  // Pause when hero is not visible
  if (hero && typeof IntersectionObserver !== 'undefined') {
    var io = new IntersectionObserver(function (entries) {
      running = entries[0].isIntersecting;
      if (running && !raf) tick();
    }, { threshold: 0 });
    io.observe(hero);
  }

  function tick() {
    if (!running) { raf = null; return; }

    // Smooth mouse lerp
    currentMX += (targetMX - currentMX) * 0.05;
    currentMY += (targetMY - currentMY) * 0.05;

    img.style.setProperty('--planet-scale', scrollScale);
    img.style.setProperty('--planet-tx', currentMX + 'px');
    img.style.setProperty('--planet-ty', currentMY + 'px');

    // Dynamic glow: intensifies as planet grows
    var glowLevel = GLOW_MIN + scrollProgress * (GLOW_MAX - GLOW_MIN);
    img.style.setProperty('--planet-glow', glowLevel);

    raf = requestAnimationFrame(tick);
  }

  tick();
})();
