// js/utils.js
window.$ = (sel, ctx=document) => ctx.querySelector(sel);
window.$$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
window.on = (el, evt, fn) => el.addEventListener(evt, fn);
window.ready = (fn) => document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);

window.UI = {
  setYear: () => { $$('#year').forEach(n => n.textContent = new Date().getFullYear()); },
  toggleNav: () => {
    const btn = $('.nav-toggle'); const menu = $('#navMenu');
    if (!btn || !menu) return;
    on(btn, 'click', () => {
      const open = menu.classList.toggle('show');
      btn.setAttribute('aria-expanded', String(open));
    });
  },
  dropdownNav: () => {
    $$('.nav-dropdown > a').forEach(a => {
      on(a, 'click', (e) => {
        if (window.innerWidth <= 860) {
          e.preventDefault();
          a.closest('.nav-dropdown').classList.toggle('open');
        }
      });
    });
  },
  ioReveal: () => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    $$('.reveal').forEach(el => io.observe(el));
  },
  outbound: (href) => { try { window?.plausible?.('Outbound', { props: { href } }); } catch (e) {} }
};
