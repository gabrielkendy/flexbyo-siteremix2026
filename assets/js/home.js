/* ============================================================
   HOME.JS — Homepage-specific behaviours
   (hero parallax, manifesto parallax, benefits cards,
    testimonials slider, form handler)
   ============================================================ */

/* ---------- Hero + Manifesto parallax ---------- */
window.addEventListener('scroll', () => {
  const y = window.scrollY;

  // Hero background parallax
  const hb = document.getElementById('hero-bg');
  if (hb && y < window.innerHeight * 1.2) {
    hb.style.transform = `translateY(${y * 0.25}px) scale(${1 + y * 0.0002})`;
  }

  // Manifesto studio image parallax
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const progress = (window.innerHeight - r.top) / (window.innerHeight + r.height);
    const shift = (progress - 0.5) * 60;
    const img = el.querySelector('img');
    if (img) img.style.transform = `translateY(${shift}px) scale(1.08)`;
  });
}, { passive: true });

/* ---------- Benefits cards: reveal on scroll ---------- */
const bnIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      bnIO.unobserve(e.target);
    }
  });
}, { threshold: .2 });
document.querySelectorAll('.bn-card').forEach(el => bnIO.observe(el));

/* ---------- Testimonials slider ---------- */
(function () {
  const slides = document.querySelectorAll('.quotes .slide');
  if (!slides.length) return;
  let qIdx = 0;
  const qNum = document.getElementById('q-num');
  const qTotal = document.getElementById('q-total');
  const prevBtn = document.getElementById('q-prev');
  const nextBtn = document.getElementById('q-next');

  if (qTotal) qTotal.textContent = String(slides.length).padStart(2, '0');

  function showQ(i) {
    qIdx = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === qIdx));
    if (qNum) qNum.textContent = String(qIdx + 1).padStart(2, '0');
  }

  if (prevBtn) prevBtn.addEventListener('click', () => showQ(qIdx - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => showQ(qIdx + 1));
  setInterval(() => showQ(qIdx + 1), 7000);
})();

/* ---------- Form submit (placeholder) ---------- */
(function () {
  const form = document.getElementById('flex-form');
  if (!form) return;
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    const btn = form.querySelector('.submit');
    if (!btn) return;
    const original = btn.innerHTML;
    btn.innerHTML = '<span>Enviado \u2713</span><span class="arrow">\u2713</span>';
    btn.style.background = 'var(--gold)';
    setTimeout(() => {
      form.reset();
      btn.innerHTML = original;
      btn.style.background = '';
    }, 2200);
  });
})();
