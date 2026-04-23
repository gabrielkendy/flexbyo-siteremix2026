/* ==========================================================================
   FLEXBYO ACADEMY® — MODALIDADES JS
   Sidebar sticky sync + smooth scroll + parallax sutil
   ========================================================================== */

(function() {
  'use strict';

  window.__DARK_SECTIONS__ = ['01', '11'];

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function() {

    // SIDEBAR SYNC COM INTERSECTIONOBSERVER
    var modalidades = document.querySelectorAll('.modalidade[id]');
    var menuLinks = document.querySelectorAll('#mods-menu a[data-target]');

    if (modalidades.length && menuLinks.length) {
      var currentActive = null;

      function setActive(id) {
        if (currentActive === id) return;
        currentActive = id;
        menuLinks.forEach(function(link) {
          var isMatch = link.dataset.target === id;
          link.classList.toggle('active', isMatch);
          if (isMatch && window.innerWidth <= 960) {
            link.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }
        });
      }

      var modalidadesIO = new IntersectionObserver(function(entries) {
        var best = null;
        var bestRatio = 0;
        entries.forEach(function(entry) {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            best = entry;
            bestRatio = entry.intersectionRatio;
          }
        });
        if (best) setActive(best.target.id);
      }, {
        threshold: [0.3, 0.5, 0.7],
        rootMargin: '-20% 0px -30% 0px'
      });

      modalidades.forEach(function(m) { modalidadesIO.observe(m); });
      if (modalidades[0]) setActive(modalidades[0].id);
    }

    // SMOOTH SCROLL
    document.querySelectorAll('#mods-menu a[data-target]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var targetId = link.dataset.target;
        var target = document.getElementById(targetId);
        if (!target) return;
        e.preventDefault();
        var navHeight = window.innerWidth <= 960 ? 130 : 80;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: top, behavior: 'smooth' });
        history.replaceState(null, '', '#' + targetId);
      });
    });

    // DEEP LINK
    if (window.location.hash) {
      var targetId = window.location.hash.replace('#', '');
      var target = document.getElementById(targetId);
      if (target && target.classList.contains('modalidade')) {
        setTimeout(function() {
          var navHeight = window.innerWidth <= 960 ? 130 : 80;
          var top = target.getBoundingClientRect().top + window.scrollY - navHeight;
          window.scrollTo({ top: top, behavior: 'auto' });
        }, 100);
      }
    }

    // COMO ESCOLHER smooth scroll
    var guiaLink = document.querySelector('.mods-nav .foot a[href="#como-escolher"]');
    if (guiaLink) {
      guiaLink.addEventListener('click', function(e) {
        var target = document.getElementById('como-escolher');
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
      });
    }

  });
})();
