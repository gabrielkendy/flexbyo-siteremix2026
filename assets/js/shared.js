/* ============================================================
   SHARED.JS — Shared behaviours across all pages
   (reveals, scroll progress, nav, cursor, magnetic, counter)
   ============================================================ */

/* ---------- Intersection Observer: Reveals ---------- */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: .15, rootMargin: '-5% 0px' });
document.querySelectorAll('.reveal, .maskline').forEach(el => revealIO.observe(el));

/* ---------- Scroll: progress bar + nav .scrolled ---------- */
const topNav = document.getElementById('top-nav');

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  // Nav compact on scroll
  if (topNav) topNav.classList.toggle('scrolled', y > 80);

  // Scroll progress bar
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docH > 0 ? (y / docH) * 100 : 0;
  const bar = document.getElementById('scroll-progress');
  if (bar) bar.style.setProperty('--sp', pct + '%');

  // Section counter
  const sections = document.querySelectorAll('[data-sec]');
  const counterNum = document.getElementById('counter-num');
  const counterEl = document.getElementById('counter');
  if (sections.length && counterNum && counterEl) {
    let cur = sections[0];
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= window.innerHeight * 0.35) cur = s;
    }
    const n = cur.dataset.sec;
    counterNum.textContent = n;
    const dark = ['01', '05', '08', '09'].includes(n);
    counterEl.classList.toggle('light', dark);
  }
}, { passive: true });

/* ---------- Magnetic buttons ---------- */
document.querySelectorAll('.magnetic').forEach(btn => {
  const strength = 0.40;
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * strength;
    const y = (e.clientY - r.top - r.height / 2) * strength;
    const rz = ((e.clientX - r.left - r.width / 2) / r.width) * 4;
    btn.style.transform = `translate(${x}px, ${y}px) rotate(${rz}deg)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
});

/* ---------- Custom cursor (desktop only) ---------- */
(function () {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const ring = document.getElementById('cursor-ring');
  if (!ring) return;
  document.body.classList.add('has-cursor');
  let tx = 0, ty = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  document.addEventListener('mouseleave', () => ring.classList.add('hide'));
  document.addEventListener('mouseenter', () => ring.classList.remove('hide'));
  function tick() {
    cx += (tx - cx) * 0.22;
    cy += (ty - cy) * 0.22;
    ring.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(tick);
  }
  tick();
  const growSel = 'a, button, .btn, .mcard, .chip, .sw, input, label, .plan-cta, .store, .link-arrow';
  document.querySelectorAll(growSel).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('grow'));
    el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
  });
})();

/* ---------- Mobile nav drawer ---------- */
(function () {
  const toggle = document.getElementById('nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  if (!toggle || !drawer) return;

  function openDrawer() {
    toggle.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    toggle.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    if (drawer.classList.contains('open')) closeDrawer();
    else openDrawer();
  });

  // Close on link click
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeDrawer);
  });

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });
})();
