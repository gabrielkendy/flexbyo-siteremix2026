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

  }); // end ready()
})();
