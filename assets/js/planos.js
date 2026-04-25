/* ==========================================================================
   FLEXBYO ACADEMY® - PLANOS JS
   Hidrata planos via API, anima precos, FAQ e navegacao interna
   ========================================================================== */

(function() {
  'use strict';

  window.__DARK_SECTIONS__ = ['01', '03', '06', '09'];

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  function fmt(n) {
    return Number(n).toLocaleString('pt-BR');
  }

  function fmtBRL(cents) {
    return (Number(cents) / 100).toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function setText(root, selector, value) {
    const el = root.querySelector(selector);
    if (el && value !== undefined && value !== null) el.textContent = value;
  }

  function setTarget(el, value) {
    if (!el) return;
    const numeric = Math.floor(Number(value) / 100);
    el.dataset.target = String(numeric);
    el.textContent = fmt(numeric);
  }

  async function fetchPlans() {
    try {
      const res = await fetch('/api/plans', { headers: { 'Accept': 'application/json' } });
      if (!res.ok) throw new Error('plans api ' + res.status);
      const json = await res.json();
      return Array.isArray(json.plans) ? json.plans : [];
    } catch (apiErr) {
      try {
        const fallback = await fetch('/assets/data/plans.fallback.json', { headers: { 'Accept': 'application/json' } });
        if (!fallback.ok) throw apiErr;
        return await fallback.json();
      } catch {
        console.warn('[plans] using static HTML fallback:', apiErr);
        return [];
      }
    }
  }

  async function hydratePlans() {
    if (!document.body.matches('[data-page="planos"]')) return;

    const plans = await fetchPlans();
    if (!plans.length) return;

    const bySlug = Object.fromEntries(plans.map((plan) => [plan.slug, plan]));

    if (bySlug.restart) hydrateRestart(bySlug.restart);
    ['avulso', '10cred', '20cred', '30cred', '40cred'].forEach((slug) => {
      if (bySlug[slug]) hydrateCredito(slug, bySlug[slug]);
    });
    ['flex8_mensal', 'flex8_semestral', 'flex8_anual'].forEach((slug) => {
      if (bySlug[slug]) hydrateFlex8(slug, bySlug[slug]);
    });
  }

  function hydrateRestart(plan) {
    const card = document.querySelector('[data-plan-id="restart"]');
    if (!card) return;

    setText(card, '[data-plan-field="subtitle"]', plan.subtitle);
    setText(card, '[data-plan-field="description"]', plan.description);

    const major = card.querySelector('[data-plan-field="price-major"]');
    const cents = card.querySelector('[data-plan-field="price-cents"]');
    setTarget(major, plan.unit_amount_cents);
    if (cents) cents.textContent = ',' + String(plan.unit_amount_cents % 100).padStart(2, '0');

    const cta = card.querySelector('[data-plan-field="cta"]');
    if (cta && plan.cta_target_url) cta.href = plan.cta_target_url;
    setText(card, '[data-plan-field="cta-label"]', plan.cta_label);
  }

  function hydrateCredito(slug, plan) {
    const card = document.querySelector(`[data-plan-id="${slug}"]`);
    if (!card) return;

    setTarget(card.querySelector('[data-plan-field="price"]'), plan.unit_amount_cents);

    const details = card.querySelectorAll('.details li b');
    if (details[0] && plan.validity_days) details[0].textContent = `${plan.validity_days} dias`;
    if (details[1] && plan.credits) details[1].textContent = `${plan.credits} ${plan.credits === 1 ? 'aula' : 'aulas'}`;

    if (plan.credits) {
      const perClass = Math.round(plan.unit_amount_cents / plan.credits);
      setText(card, '[data-plan-field="per-class"]', `R$ ${fmtBRL(perClass)}`);
    }

    const badge = card.querySelector('[data-plan-field="badge"]');
    if (badge && plan.badge) badge.textContent = plan.badge;

    const cta = card.querySelector('[data-plan-field="cta"]');
    if (cta && plan.cta_target_url) cta.href = plan.cta_target_url;
    setText(card, '[data-plan-field="cta-label"]', plan.cta_label);
  }

  function hydrateFlex8(slug, plan) {
    const card = document.querySelector(`[data-plan-id="${slug}"]`);
    if (!card) return;

    setText(card, '[data-plan-field="subtitle"]', plan.subtitle);
    setText(card, '[data-plan-field="description"]', plan.description);
    setTarget(card.querySelector('[data-plan-field="price"]'), plan.unit_amount_cents);

    const cta = card.querySelector('[data-plan-field="cta"]');
    if (cta && plan.cta_target_url) cta.href = plan.cta_target_url;
    setText(card, '[data-plan-field="cta-label"]', plan.cta_label);
  }

  function initPriceCounters() {
    const targets = document.querySelectorAll('[data-target]');
    if (!targets.length) return;

    const priceIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const tgt = parseInt(el.dataset.target, 10);
        if (isNaN(tgt)) return;

        const dur = tgt > 1000 ? 1800 : tgt > 100 ? 1400 : 1000;
        const start = performance.now();

        const tick = (t) => {
          const p = Math.min(1, (t - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(Math.round(tgt * eased));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        priceIO.unobserve(el);
      });
    }, { threshold: .4 });

    targets.forEach(el => priceIO.observe(el));
  }

  function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      item.addEventListener('toggle', () => {
        if (!item.open) return;
        faqItems.forEach(other => {
          if (other !== item && other.open) other.open = false;
        });

        setTimeout(() => {
          const rect = item.getBoundingClientRect();
          if (rect.top < 100) {
            window.scrollTo({
              top: window.scrollY + rect.top - 120,
              behavior: 'smooth'
            });
          }
        }, 50);
      });
    });
  }

  function initSmoothScroll() {
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
  }

  function initDeepLink() {
    if (!window.location.hash) return;
    const target = document.querySelector(window.location.hash);
    if (!target) return;
    setTimeout(() => {
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'auto' });
    }, 100);
  }

  ready(async function() {
    await hydratePlans();
    initPriceCounters();
    initFaq();
    initSmoothScroll();
    initDeepLink();
  });
})();
