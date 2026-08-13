/* ===================================================================
   CONC DAIRY FARM – script.js  (v3 – GIMC-inspired redesign)
   =================================================================== */
'use strict';

/* ── Carousel ── */
(function () {
  const slides = document.querySelectorAll('.c-slide');
  const dots   = document.querySelectorAll('.c-dot');
  const prev   = document.getElementById('c-prev');
  const next   = document.getElementById('c-next');
  if (!slides.length) return;

  let cur = 0, timer = null;
  const DELAY = 5500;

  function goTo(idx) {
    slides[cur].classList.remove('active');
    slides[cur].classList.add('out');
    dots[cur].classList.remove('active');
    const old = cur;
    cur = (idx + slides.length) % slides.length;
    slides[cur].classList.add('active');
    slides[cur].classList.remove('out');
    dots[cur].classList.add('active');
    setTimeout(() => slides[old].classList.remove('out'), 1100);
  }

  function go(dir) { goTo(cur + dir); resetTimer(); }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(cur + 1), DELAY);
  }

  if (prev) prev.addEventListener('click', () => go(-1));
  if (next) next.addEventListener('click', () => go( 1));

  dots.forEach(d => d.addEventListener('click', () => { goTo(+d.dataset.idx); resetTimer(); }));

  // Touch swipe
  let sx = 0;
  const wrap = document.querySelector('.hero');
  if (wrap) {
    wrap.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    wrap.addEventListener('touchend',   e => {
      const diff = sx - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 45) go(diff > 0 ? 1 : -1);
    }, { passive: true });
  }

  resetTimer();
})();


/* ── Navbar ── */
(function () {
  const bar = document.getElementById('navbar');
  if (!bar) return;
  const fn = () => bar.classList.toggle('scrolled', scrollY > 55);
  addEventListener('scroll', fn, { passive: true });
  fn();
})();


/* ── Mobile menu ── */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('nav-menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();


/* ── Stat counters ── */
(function () {
  const nums = document.querySelectorAll('.stat-num');
  if (!nums.length) return;

  function run(el) {
    const target = +el.dataset.target;
    const step   = target / 80;
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur);
      if (cur >= target) clearInterval(t);
    }, 18);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.5 });

  nums.forEach(n => io.observe(n));
})();


/* ── Scroll reveal ── */
(function () {
  const els = document.querySelectorAll('.fade-in, .slide-left, .slide-right');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();


/* ── Back to top ── */
(function () {
  const btn = document.getElementById('btt');
  if (!btn) return;
  addEventListener('scroll', () => btn.classList.toggle('show', scrollY > 380), { passive: true });
  btn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
})();


/* ── Contact form ── */
(function () {
  const form = document.getElementById('contact-form');
  const ok   = document.getElementById('form-success');
  if (!form || !ok) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fname   = form.querySelector('#fname');
    const email   = form.querySelector('#email');
    const message = form.querySelector('#message');
    let valid = true;

    [fname, email, message].forEach(f => {
      if (!f.value.trim()) { f.style.borderColor = 'rgba(231,76,60,0.6)'; valid = false; }
      else f.style.borderColor = '';
    });
    if (!valid) return;

    const sbtn = document.getElementById('form-submit-btn');
    sbtn.textContent = 'Sending…';
    sbtn.disabled = true;

    setTimeout(() => {
      sbtn.textContent = 'Send Message ✉️';
      sbtn.disabled = false;
      form.reset();
      ok.classList.add('show');
      setTimeout(() => ok.classList.remove('show'), 5000);
    }, 1500);
  });
})();


/* ── Parallax SACCO bg ── */
(function () {
  const img = document.getElementById('sacco-parallax');
  if (!img) return;
  const fn = () => {
    const sec  = img.closest('.sacco-sec');
    if (!sec) return;
    const rect = sec.getBoundingClientRect();
    const pct  = rect.top / innerHeight;
    img.style.transform = `translateY(${pct * -22}px)`;
  };
  addEventListener('scroll', fn, { passive: true });
})();


/* ── Active nav link highlighting on scroll ── */
(function () {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
})();
