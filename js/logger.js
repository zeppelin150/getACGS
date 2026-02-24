// js/logger.js
window.Logger = (function () {
  const levels = { error: 0, warn: 1, info: 2, debug: 3 };
  const qs = new URLSearchParams(location.search);
  const dbg = qs.has('debug') ? 'debug' : (localStorage.getItem('logLevel') || 'info');
  let level = levels[dbg] ?? 2;

  const setLevel = (name) => { level = levels[name] ?? level; localStorage.setItem('logLevel', name); };
  const emit = (name, args) => {
    if ((levels[name] ?? 99) <= level) console[name === 'debug' ? 'log' : name](`[${name.toUpperCase()}]`, ...args);
  };

  return {
    setLevel,
    error: (...a) => emit('error', a),
    warn: (...a) => emit('warn', a),
    info: (...a) => emit('info', a),
    debug: (...a) => emit('debug', a),
  };
})();