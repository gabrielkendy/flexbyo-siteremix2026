/* ==========================================================================
   FLEXBYO ACADEMY® — SOBRE JS
   Lógica específica da página /sobre.html
   ========================================================================== */

(function() {
  'use strict';

  // Seções escuras desta página (pro counter usar classe .light)
  // data-sec: 01 (hero), 05 (números), 07 (valores), 08 (cta final)
  window.__DARK_SECTIONS__ = ['01', '05', '07', '08'];

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function() {

    // ==========================================================
    // CONTADOR ANIMADO DOS STATS (seção 05 — Números)
    // ==========================================================
    const statEls = document.querySelectorAll('.numeros .n[data-target]');
    if (statEls.length) {
      const statIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const tgt = parseInt(el.dataset.target, 10);
          if (isNaN(tgt)) return;

          const dur = 1600;
          const start = performance.now();
          const em = el.querySelector('em');
          const suffix = em ? em.outerHTML : '';

          const tick = (t) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const v = Math.round(tgt * eased);
            el.innerHTML = v + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          statIO.unobserve(el);
        });
      }, { threshold: .5 });

      statEls.forEach(el => statIO.observe(el));
    }

    // ==========================================================
    // PARALLAX SUTIL DA IMAGEM DO ESTÚDIO (seção 02)
    // Nota: shared.js já trata elementos com [data-parallax].
    // ==========================================================

    // ==========================================================
    // HOVER 3D SUTIL NOS CARDS DE EQUIPE (bônus visual)
    // ==========================================================
    document.querySelectorAll('.equipe-card').forEach(card => {
      const photo = card.querySelector('.photo');
      if (!photo) return;

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 8;
        const y = ((e.clientY - r.top) / r.height - 0.5) * 8;
        photo.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        photo.style.transform = '';
      });
    });

    // ==========================================================
    // CARROSSEL DO STUDIO
    // ==========================================================
    (function() {
      var carousel = document.querySelector('[data-carousel]');
      if (!carousel) return;

      var track = carousel.querySelector('[data-track]');
      var slides = carousel.querySelectorAll('.carousel-slide');
      var dotsContainer = carousel.querySelector('[data-dots]');
      var prevBtn = carousel.querySelector('.carousel-prev');
      var nextBtn = carousel.querySelector('.carousel-next');

      if (!track || slides.length === 0) return;

      var total = slides.length;
      var current = 0;
      var autoplayTimer = null;

      // Gera dots
      for (var i = 0; i < total; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Ir para foto ' + (i+1));
        dot.dataset.dot = i;
        (function(idx) { dot.addEventListener('click', function() { goTo(idx); }); })(i);
        dotsContainer.appendChild(dot);
      }

      var dots = dotsContainer.querySelectorAll('.carousel-dot');

      function updateUI(idx) {
        dots.forEach(function(d, j) { d.classList.toggle('active', j === idx); });
        slides.forEach(function(s, j) { s.classList.toggle('active', j === idx); });
        current = idx;
      }

      function goTo(idx) {
        if (idx < 0) idx = total - 1;
        if (idx >= total) idx = 0;
        track.scrollTo({ left: slides[idx].offsetLeft, behavior: 'smooth' });
        updateUI(idx);
        resetAutoplay();
      }

      function startAutoplay() { stopAutoplay(); autoplayTimer = setInterval(function() { goTo(current + 1); }, 5000); }
      function stopAutoplay() { if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }
      function resetAutoplay() { stopAutoplay(); startAutoplay(); }

      var scrollTimeout;
      track.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
          var idx = Math.round(track.scrollLeft / track.clientWidth);
          if (idx !== current) { updateUI(idx); resetAutoplay(); }
        }, 100);
      }, { passive: true });

      if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
      if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });

      carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
      });

      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);

      var io = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) startAutoplay();
          else stopAutoplay();
        });
      }, { threshold: 0.3 });
      io.observe(carousel);

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      updateUI(0);
      startAutoplay();
      carousel.tabIndex = 0;
    })();

  }); // end ready()
})();
