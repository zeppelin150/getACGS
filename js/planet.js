// js/planet.js — Scroll expansion + mouse parallax for Neptune image
(function () {
  'use strict';

  var img = document.getElementById('neptune-img');
  if (!img) return;

  var hero = document.querySelector('.hero');
  var targetMX = 0, targetMY = 0;
  var currentMX = 0, currentMY = 0;
  var scrollScale = 1;
  var running = true;
  var raf;

  // Scroll-driven expansion
  window.addEventListener('scroll', function () {
    if (!hero) return;
    var rect = hero.getBoundingClientRect();
    var p = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.55)));
    scrollScale = 1 + p * 0.5;
  }, { passive: true });

  // Mouse parallax
  document.addEventListener('mousemove', function (e) {
    targetMX = (e.clientX / window.innerWidth - 0.5) * 24;
    targetMY = (e.clientY / window.innerHeight - 0.5) * 16;
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

    raf = requestAnimationFrame(tick);
  }

  tick();
})();
