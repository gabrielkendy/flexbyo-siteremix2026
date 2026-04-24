/* ==========================================================================
   FLEXBYO ACADEMY® — TRACKING DE EVENTOS CUSTOMIZADOS
   Depende de analytics.js (window.flexTrack)
   ========================================================================== */

(function() {
  'use strict';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function track(name, params) {
    if (window.flexTrack) window.flexTrack(name, params || {});
  }

  function getPageContext() {
    return document.body.dataset.page || 'unknown';
  }

  ready(function() {

    // 1. CLIQUES EM WHATSAPP
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href*="wa.me"], a[href*="whatsapp"]');
      if (!link) return;

      var context = 'generic';
      if (link.closest('.hero, .page-hero')) context = 'hero';
      else if (link.closest('.restart-card')) context = 'restart_card';
      else if (link.closest('.plan--featured, .credito-card.featured, .flex8-card.recommended')) context = 'plan_featured';
      else if (link.closest('.plan, .credito-card, .flex8-card')) context = 'plan_card';
      else if (link.closest('.canal-card.primary')) context = 'contact_whatsapp_primary';
      else if (link.closest('.canal-card')) context = 'contact_card';
      else if (link.closest('.cta-final')) context = 'cta_final';
      else if (link.closest('footer')) context = 'footer';
      else if (link.closest('.wa')) context = 'float_button';
      else if (link.closest('nav.top')) context = 'nav';

      track('click_whatsapp', {
        page: getPageContext(),
        context: context,
        button_text: (link.textContent || '').trim().slice(0, 50)
      });
    });

    // 2. CLIQUES EM PLANOS
    document.querySelectorAll('.credito-card .buy, .flex8-card .cta, .plan-cta').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var card = btn.closest('.credito-card, .flex8-card, .plan');
        if (!card) return;
        var nameEl = card.querySelector('.pack-name, .plan-name');
        var planName = nameEl ? nameEl.textContent.trim() : 'unknown';
        var isFeatured = card.classList.contains('featured') || card.classList.contains('recommended') || card.classList.contains('plan--featured');

        track(isFeatured ? 'click_plano_featured' : 'click_plano', {
          page: getPageContext(),
          plan_name: planName,
          featured: isFeatured
        });
      });
    });

    // 3. CLIQUES EM MODALIDADES
    document.querySelectorAll('.mcard').forEach(function(el) {
      el.addEventListener('click', function() {
        var h3 = el.querySelector('h3');
        track('click_modalidade', {
          page: getPageContext(),
          modalidade: h3 ? h3.textContent.trim() : 'unknown'
        });
      });
    });

    // 4. FORMULARIO DE CONTATO
    var form = document.getElementById('form-restart');
    if (form) {
      var formStarted = false;

      form.addEventListener('focusin', function() {
        if (formStarted) return;
        formStarted = true;
        track('form_started', { page: getPageContext() });
      });

      form.addEventListener('submit', function() {
        var nome = (form.nome && form.nome.value) ? form.nome.value.trim() : '';
        var whatsapp = (form.whatsapp && form.whatsapp.value) ? form.whatsapp.value.trim() : '';
        var email = (form.email && form.email.value) ? form.email.value.trim() : '';

        if (nome.length >= 3 && whatsapp.replace(/\D/g, '').length >= 10 && /@/.test(email)) {
          track('form_submit', {
            page: getPageContext(),
            modalidade_interesse: (form.modalidade && form.modalidade.value) || 'nao_especificada',
            experiencia_previa: (form.querySelector('[name="experiencia"]:checked') || {}).value || 'nao_respondido'
          });
        }
      });
    }

    // 5. FAQ ABERTO
    document.querySelectorAll('.faq-item, .faq-op-item').forEach(function(item) {
      item.addEventListener('toggle', function() {
        if (!item.open) return;
        var summary = item.querySelector('summary');
        track('faq_open', {
          page: getPageContext(),
          question: summary ? summary.textContent.trim().slice(0, 80) : 'unknown'
        });
      });
    });

    // 6. SCROLL DEPTH
    var thresholds = [25, 50, 75, 100];
    var fired = {};
    var rafPending = false;

    function checkScrollDepth() {
      rafPending = false;
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      thresholds.forEach(function(t) {
        if (pct >= t && !fired[t]) {
          fired[t] = true;
          track('scroll_depth', { page: getPageContext(), depth: t });
        }
      });
    }

    window.addEventListener('scroll', function() {
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(checkScrollDepth);
    }, { passive: true });

    // 7. CLIQUES NO MENU
    document.querySelectorAll('nav.top a, .nav-drawer a').forEach(function(link) {
      link.addEventListener('click', function() {
        track('nav_click', {
          page: getPageContext(),
          target: link.textContent.trim()
        });
      });
    });

    // 8. CLIQUES EM REDES SOCIAIS
    document.addEventListener('click', function(e) {
      var link = e.target.closest('a[href*="instagram.com"]');
      if (!link) return;
      track('click_social', { page: getPageContext(), platform: 'instagram' });
    });

    // 9. WHATSAPP FLOAT
    var waFloat = document.querySelector('[data-wa-float]');
    if (waFloat) {
      waFloat.addEventListener('click', function() {
        track('click_whatsapp_float', { page: getPageContext() });
      });
    }

  });
})();
