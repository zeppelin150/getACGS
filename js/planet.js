// js/planet.js — High-quality Neptune canvas renderer with orbit + scroll expansion
(function () {
  'use strict';

  var canvas = document.getElementById('neptune-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var hero = document.querySelector('.hero');

  // --- State ---
  var w, h, dpr, baseRadius;
  var rotation = 0;
  var scrollProgress = 0;
  var mouseX = 0, mouseY = 0;
  var targetMX = 0, targetMY = 0;
  var running = true;
  var noiseImg = null;

  // --- Initialize ---
  function init() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    resize();
    generateNoise();
    bindEvents();
    animate();
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    baseRadius = Math.min(w, h) * 0.38;
  }

  // --- Noise texture (atmospheric turbulence) ---
  function generateNoise() {
    var size = 512;
    var c = document.createElement('canvas');
    c.width = size; c.height = size;
    var nc = c.getContext('2d');
    var id = nc.createImageData(size, size);
    var d = id.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = Math.random() * 255;
      d[i] = v; d[i + 1] = v; d[i + 2] = v;
      d[i + 3] = 20;
    }
    nc.putImageData(id, 0, 0);
    noiseImg = c;
  }

  // --- Events ---
  function bindEvents() {
    window.addEventListener('resize', resize);

    window.addEventListener('scroll', function () {
      if (!hero) return;
      var rect = hero.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.55)));
      scrollProgress = p;
    }, { passive: true });

    document.addEventListener('mousemove', function (e) {
      targetMX = (e.clientX / window.innerWidth - 0.5) * 30;
      targetMY = (e.clientY / window.innerHeight - 0.5) * 20;
    });

    // Pause when hero is out of view
    if (hero && typeof IntersectionObserver !== 'undefined') {
      var io = new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
        if (running) animate();
      }, { threshold: 0 });
      io.observe(hero);
    }
  }

  // --- Animation loop ---
  function animate() {
    if (!running) return;
    rotation += 0.0006;

    // Smooth mouse lerp
    mouseX += (targetMX - mouseX) * 0.04;
    mouseY += (targetMY - mouseY) * 0.04;

    draw();
    requestAnimationFrame(animate);
  }

  // --- Main draw ---
  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var cx = w / 2 + mouseX;
    var cy = h / 2 + mouseY;

    // Float bob
    var bob = Math.sin(Date.now() * 0.0004) * 4;
    cy += bob;

    var r = baseRadius * (1 + scrollProgress * 0.5);

    drawGlow(cx, cy, r);

    // Clip sphere
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    drawBase(cx, cy, r);
    drawBands(cx, cy, r);
    drawStorms(cx, cy, r);
    drawClouds(cx, cy, r);
    drawAtmosphereNoise(cx, cy, r);
    drawLimb(cx, cy, r);
    drawSpecular(cx, cy, r);

    ctx.restore();

    // Atmosphere rim (outside clip)
    drawRim(cx, cy, r);
  }

  // --- Outer glow ---
  function drawGlow(cx, cy, r) {
    var g = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.7);
    g.addColorStop(0, 'rgba(60, 100, 230, 0.10)');
    g.addColorStop(0.35, 'rgba(80, 120, 240, 0.04)');
    g.addColorStop(0.65, 'rgba(100, 140, 250, 0.015)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.7, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- Base sphere ---
  function drawBase(cx, cy, r) {
    // Off-center light source for 3D effect
    var g = ctx.createRadialGradient(cx - r * 0.28, cy - r * 0.22, r * 0.02, cx + r * 0.05, cy + r * 0.05, r);
    g.addColorStop(0, '#5a8ef0');
    g.addColorStop(0.10, '#4a7ce0');
    g.addColorStop(0.25, '#3968cc');
    g.addColorStop(0.42, '#2d52aa');
    g.addColorStop(0.58, '#1f3d88');
    g.addColorStop(0.74, '#152c6e');
    g.addColorStop(0.88, '#0e2058');
    g.addColorStop(1, '#081545');
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    // Subtle secondary light from below-right (subsurface scatter)
    var g2 = ctx.createRadialGradient(cx + r * 0.4, cy + r * 0.4, 0, cx + r * 0.4, cy + r * 0.4, r * 0.7);
    g2.addColorStop(0, 'rgba(40, 80, 180, 0.08)');
    g2.addColorStop(0.5, 'rgba(30, 60, 150, 0.03)');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }

  // --- Atmospheric bands ---
  function drawBands(cx, cy, r) {
    var bands = [
      { lat: -0.72, w: 0.05, a: 0.10, c: [90, 150, 240] },
      { lat: -0.58, w: 0.07, a: 0.15, c: [60, 120, 220] },
      { lat: -0.40, w: 0.10, a: 0.20, c: [50, 100, 210] },
      { lat: -0.22, w: 0.08, a: 0.14, c: [70, 130, 230] },
      { lat: -0.05, w: 0.11, a: 0.18, c: [45, 95, 200] },
      { lat: 0.12, w: 0.09, a: 0.22, c: [55, 110, 215] },
      { lat: 0.28, w: 0.07, a: 0.16, c: [65, 120, 225] },
      { lat: 0.42, w: 0.10, a: 0.20, c: [48, 100, 205] },
      { lat: 0.58, w: 0.06, a: 0.13, c: [75, 135, 230] },
      { lat: 0.72, w: 0.05, a: 0.10, c: [55, 110, 215] },
    ];

    for (var i = 0; i < bands.length; i++) {
      var b = bands[i];
      var by = cy + r * b.lat;
      var bh = r * b.w;
      var shift = Math.sin(rotation * 3 + b.lat * 5) * r * 0.015;

      // Horizontal gradient for band (fades at sphere edges naturally via clip)
      var cr = b.c[0], cg = b.c[1], cb = b.c[2];
      ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + b.a + ')';
      ctx.fillRect(cx - r + shift, by - bh / 2, r * 2, bh);

      // Slight brightening at center of band
      var g = ctx.createRadialGradient(cx, by, 0, cx, by, r * 0.8);
      g.addColorStop(0, 'rgba(' + Math.min(255, cr + 30) + ',' + Math.min(255, cg + 30) + ',' + Math.min(255, cb + 20) + ',' + (b.a * 0.3) + ')');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(cx - r, by - bh / 2, r * 2, bh);
    }
  }

  // --- Great Dark Spot + companion storms ---
  function drawStorms(cx, cy, r) {
    // Great Dark Spot
    var spotX = cx + Math.sin(rotation * 0.8) * r * 0.35;
    var spotY = cy + r * 0.18;
    drawEllipse(spotX, spotY, r * 0.16, r * 0.10, -0.12,
      'rgba(6, 12, 45, 0.45)', 'rgba(10, 18, 55, 0.2)');

    // Small companion storm
    var s2x = spotX + r * 0.22;
    var s2y = spotY - r * 0.08;
    drawEllipse(s2x, s2y, r * 0.06, r * 0.04, 0.1,
      'rgba(8, 15, 50, 0.3)', 'rgba(12, 22, 60, 0.1)');
  }

  function drawEllipse(ex, ey, rw, rh, angle, coreColor, edgeColor) {
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(angle);
    ctx.scale(1, rh / rw);

    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, rw);
    g.addColorStop(0, coreColor);
    g.addColorStop(0.6, edgeColor);
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, rw, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --- Bright cloud features (methane ice) ---
  function drawClouds(cx, cy, r) {
    var clouds = [
      { x: 0.18, y: 0.12, w: 0.10, h: 0.018, a: 0.28 },
      { x: 0.28, y: 0.22, w: 0.07, h: 0.012, a: 0.20 },
      { x: -0.12, y: -0.32, w: 0.09, h: 0.015, a: 0.22 },
      { x: 0.35, y: -0.48, w: 0.06, h: 0.010, a: 0.18 },
      { x: -0.30, y: 0.48, w: 0.11, h: 0.016, a: 0.24 },
      { x: 0.08, y: 0.58, w: 0.07, h: 0.012, a: 0.16 },
      { x: -0.40, y: -0.15, w: 0.05, h: 0.008, a: 0.14 },
      { x: 0.45, y: 0.35, w: 0.04, h: 0.007, a: 0.12 },
    ];

    for (var i = 0; i < clouds.length; i++) {
      var c = clouds[i];
      var cloudX = cx + r * c.x + Math.sin(rotation * 2 + c.y * 4) * r * 0.18;
      var cloudY = cy + r * c.y;
      var cloudW = r * c.w;
      var cloudH = r * c.h;

      ctx.save();
      ctx.translate(cloudX, cloudY);
      ctx.scale(1, cloudH / cloudW);

      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, cloudW);
      g.addColorStop(0, 'rgba(210, 225, 255,' + c.a + ')');
      g.addColorStop(0.4, 'rgba(185, 205, 245,' + (c.a * 0.6) + ')');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, cloudW, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // --- Atmospheric noise texture ---
  function drawAtmosphereNoise(cx, cy, r) {
    if (!noiseImg) return;
    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.globalCompositeOperation = 'overlay';
    ctx.drawImage(noiseImg, cx - r, cy - r, r * 2, r * 2);
    ctx.restore();
  }

  // --- Limb darkening ---
  function drawLimb(cx, cy, r) {
    var g = ctx.createRadialGradient(cx, cy, r * 0.45, cx, cy, r);
    g.addColorStop(0, 'transparent');
    g.addColorStop(0.60, 'transparent');
    g.addColorStop(0.78, 'rgba(4, 8, 30, 0.20)');
    g.addColorStop(0.88, 'rgba(3, 6, 25, 0.40)');
    g.addColorStop(0.96, 'rgba(2, 4, 18, 0.65)');
    g.addColorStop(1, 'rgba(1, 2, 12, 0.80)');
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }

  // --- Specular highlight ---
  function drawSpecular(cx, cy, r) {
    var sx = cx - r * 0.32;
    var sy = cy - r * 0.28;
    var g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 0.55);
    g.addColorStop(0, 'rgba(200, 220, 255, 0.10)');
    g.addColorStop(0.25, 'rgba(160, 190, 250, 0.05)');
    g.addColorStop(0.5, 'rgba(140, 170, 240, 0.02)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  }

  // --- Thin atmosphere rim (outside sphere clip) ---
  function drawRim(cx, cy, r) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Inner arc glow
    var g = ctx.createRadialGradient(cx, cy, r * 0.96, cx, cy, r * 1.06);
    g.addColorStop(0, 'rgba(100, 160, 255, 0.12)');
    g.addColorStop(0.5, 'rgba(80, 140, 240, 0.05)');
    g.addColorStop(1, 'transparent');

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.06, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();

    ctx.restore();
  }

  // --- Start ---
  init();
})();
