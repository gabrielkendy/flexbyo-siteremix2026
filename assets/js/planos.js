/* ==========================================================================
   FLEXBYO ACADEMY® — PLANOS JS
   Contadores animados dos preços + FAQ accordion com close-others
   ========================================================================== */

(function() {
  'use strict';

  // Seções escuras desta página: 01 (hero), 03 (restart), 06 (incluso), 09 (cta)
  window.__DARK_SECTIONS__ = ['01', '03', '06', '09'];

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  // Formata número pt-BR (1998 → "1.998", 29 → "29")
  function fmt(n) {
    return n.toLocaleString('pt-BR');
  }

  ready(function() {

    // ==========================================================
    // CONTADORES ANIMADOS DE PREÇOS
    // Anima qualquer elemento com atributo data-target
    // ==========================================================
    const targets = document.querySelectorAll('[data-target]');
    if (targets.length) {
      const priceIO = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const tgt = parseInt(el.dataset.target, 10);
          if (isNaN(tgt)) return;

          // Ajusta duração conforme magnitude do número
          const dur = tgt > 1000 ? 1800 : tgt > 100 ? 1400 : 1000;
          const start = performance.now();

          const tick = (t) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            const v = Math.round(tgt * eased);
            el.textContent = fmt(v);
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          priceIO.unobserve(el);
        });
      }, { threshold: .4 });

      targets.forEach(el => priceIO.observe(el));
    }

    // ==========================================================
    // FAQ ACCORDION — fecha outros ao abrir um
    // ==========================================================
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          faqItems.forEach(other => {
            if (other !== item && other.open) {
              other.open = false;
            }
          });

          // Scroll suave pra garantir que o item fica visível
          setTimeout(() => {
            const rect = item.getBoundingClientRect();
            if (rect.top < 100) {
              window.scrollTo({
                top: window.scrollY + rect.top - 120,
                behavior: 'smooth'
              });
            }
          }, 50);
        }
      });
    });

    // ==========================================================
    // SCROLL SUAVE NOS LINKS DE NAVEGAÇÃO INTERNA
    // (#restart, #creditos, #flex8)
    // ==========================================================
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' || href.length < 2) return;

      link.addEventListener('click', (e) => {
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
        history.replaceState(null, '', href);
      });
    });

    // ==========================================================
    // DEEP LINK: /planos.html#restart abre direto na seção
    // ==========================================================
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(() => {
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: 'auto' });
        }, 100);
      }
    }

  }); // end ready()
})();
