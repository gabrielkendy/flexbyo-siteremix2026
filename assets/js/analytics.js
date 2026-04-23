/* ==========================================================================
   FLEXBYO ACADEMY® — ANALYTICS & CONSENT
   Google Analytics 4 com Consent Mode v2 (LGPD Brasil compliant)
   ========================================================================== */

(function() {
  'use strict';

  // ==========================================================
  // CONFIGURAÇÃO — TODO: trocar pelos IDs reais
  // ==========================================================
  var GA_ID = 'G-XXXXXXXXXX';
  var CONSENT_KEY = 'flexbyo-consent';
  var CONSENT_VERSION = '1.0';
  var ENABLE_META_PIXEL = false;
  var META_PIXEL_ID = '';

  // ==========================================================
  // CONSENT MODE v2
  // ==========================================================
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'ad_user_data': 'denied',
    'ad_personalization': 'denied',
    'analytics_storage': 'denied',
    'functionality_storage': 'granted',
    'security_storage': 'granted',
    'wait_for_update': 500
  });

  gtag('js', new Date());

  // ==========================================================
  // CONSENT STATE
  // ==========================================================
  function getConsent() {
    try {
      var raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed.version !== CONSENT_VERSION) {
        localStorage.removeItem(CONSENT_KEY);
        return null;
      }
      return parsed.value;
    } catch (e) {
      return null;
    }
  }

  function saveConsent(value) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        value: value,
        version: CONSENT_VERSION,
        timestamp: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('Consent: localStorage indisponivel', e);
    }
  }

  function applyConsent(value) {
    if (value === 'granted') {
      gtag('consent', 'update', {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted'
      });
      loadAnalytics();
      loadMetaPixel();
    } else {
      gtag('consent', 'update', {
        'ad_storage': 'denied',
        'ad_user_data': 'denied',
        'ad_personalization': 'denied',
        'analytics_storage': 'denied'
      });
    }
  }

  // ==========================================================
  // CARREGAR GA4
  // ==========================================================
  var gaLoaded = false;
  function loadAnalytics() {
    if (gaLoaded) return;
    if (GA_ID === 'G-XXXXXXXXXX') {
      console.warn('Analytics: GA_ID ainda e placeholder. Troque em analytics.js');
      return;
    }

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);

    gtag('config', GA_ID, {
      'anonymize_ip': true,
      'cookie_flags': 'SameSite=None;Secure',
      'page_path': window.location.pathname
    });

    gaLoaded = true;
  }

  // ==========================================================
  // META PIXEL (preparado, inativo)
  // ==========================================================
  var metaPixelLoaded = false;
  function loadMetaPixel() {
    if (metaPixelLoaded || !ENABLE_META_PIXEL || !META_PIXEL_ID) return;

    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
    metaPixelLoaded = true;
  }

  // ==========================================================
  // API PUBLICA
  // ==========================================================
  window.flexTrack = function(eventName, params) {
    params = params || {};
    if (getConsent() !== 'granted') return;

    gtag('event', eventName, {
      page_path: window.location.pathname,
      page_title: document.title,
      event_category: params.context || 'engagement',
      event_label: params.button_text || params.plan_name || params.question || ''
    });

    if (metaPixelLoaded && window.fbq) {
      var metaEventMap = {
        'click_whatsapp': 'Contact',
        'form_submit': 'Lead',
        'click_plano_featured': 'InitiateCheckout'
      };
      if (metaEventMap[eventName]) {
        fbq('track', metaEventMap[eventName], params);
      }
    }
  };

  // ==========================================================
  // BANNER UI
  // ==========================================================
  function createBanner() {
    if (document.getElementById('consent-banner')) return;

    var banner = document.createElement('div');
    banner.className = 'consent-banner';
    banner.id = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consentimento de cookies');
    banner.innerHTML =
      '<div class="consent-head">' +
        '<div style="flex:1;"><h3>Um <em>instante</em> antes de come\u00E7ar</h3></div>' +
        '<div class="consent-icon" aria-hidden="true">\uD83C\uDF6A</div>' +
      '</div>' +
      '<p>Usamos cookies pra entender como voc\u00EA navega pelo site e melhorar sua ' +
      'experi\u00EAncia. Nada de dados pessoais sem sua autoriza\u00E7\u00E3o. ' +
      '<a href="/privacidade.html">Saiba mais na pol\u00EDtica de privacidade</a>.</p>' +
      '<div class="consent-actions">' +
        '<button type="button" class="consent-btn ghost" data-action="reject">S\u00F3 essencial</button>' +
        '<button type="button" class="consent-btn primary" data-action="accept">Aceitar todos</button>' +
      '</div>';
    document.body.appendChild(banner);

    banner.querySelector('[data-action="accept"]').addEventListener('click', function() {
      saveConsent('granted');
      applyConsent('granted');
      hideBanner();
      showPrefsButton();
      if (window.flexTrack) window.flexTrack('consent_granted');
    });

    banner.querySelector('[data-action="reject"]').addEventListener('click', function() {
      saveConsent('denied');
      applyConsent('denied');
      hideBanner();
      showPrefsButton();
    });

    setTimeout(function() { banner.classList.add('show'); }, 1500);
  }

  function hideBanner() {
    var banner = document.getElementById('consent-banner');
    if (banner) {
      banner.classList.remove('show');
      setTimeout(function() { banner.remove(); }, 500);
    }
  }

  function showPrefsButton() {
    if (document.getElementById('consent-prefs-btn')) return;
    var btn = document.createElement('button');
    btn.id = 'consent-prefs-btn';
    btn.className = 'consent-preferences show';
    btn.setAttribute('aria-label', 'Prefer\u00EAncias de cookies');
    btn.innerHTML = '\uD83C\uDF6A';
    btn.addEventListener('click', function() {
      localStorage.removeItem(CONSENT_KEY);
      btn.remove();
      createBanner();
    });
    document.body.appendChild(btn);
  }

  // ==========================================================
  // INIT
  // ==========================================================
  function init() {
    var consent = getConsent();
    if (consent === null) {
      createBanner();
    } else {
      applyConsent(consent);
      showPrefsButton();
    }
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);

})();
