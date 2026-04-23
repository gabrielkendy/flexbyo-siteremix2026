/* ==========================================================================
   FLEXBYO ACADEMY® — CONTATO JS
   Validação de formulário, máscara de tel, FAQ accordion, toast de sucesso
   ========================================================================== */

(function() {
  'use strict';

  // Seções escuras: 01 (hero), 03 (form), 08 (cta final)
  window.__DARK_SECTIONS__ = ['01', '03', '08'];

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function() {

    // ==========================================================
    // 1. MÁSCARA DE TELEFONE BR: (XX) XXXXX-XXXX
    // ==========================================================
    var telInput = document.getElementById('f-whatsapp');
    if (telInput) {
      telInput.addEventListener('input', function(e) {
        var v = e.target.value.replace(/\D/g, '').slice(0, 11);

        if (v.length === 0) {
          e.target.value = '';
          return;
        }

        var formatted = '';
        if (v.length <= 2) {
          formatted = '(' + v;
        } else if (v.length <= 6) {
          formatted = '(' + v.slice(0, 2) + ') ' + v.slice(2);
        } else if (v.length <= 10) {
          formatted = '(' + v.slice(0, 2) + ') ' + v.slice(2, 6) + '-' + v.slice(6);
        } else {
          formatted = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
        }

        e.target.value = formatted;
      });
    }

    // ==========================================================
    // 2. VALIDAÇÃO DO FORMULÁRIO
    // ==========================================================
    var form = document.getElementById('form-restart');
    if (form) {
      var submitBtn = document.getElementById('form-submit');
      var toast = document.getElementById('toast');

      var validators = {
        nome: function(v) { return v.trim().length >= 3 && /\s/.test(v.trim()); },
        whatsapp: function(v) { return v.replace(/\D/g, '').length >= 10; },
        email: function(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
      };

      function setFieldState(fieldName, isValid) {
        var field = form.querySelector('[data-field="' + fieldName + '"]');
        if (!field) return;
        field.classList.toggle('invalid', !isValid);
      }

      // Validação em tempo real (blur + input)
      ['nome', 'whatsapp', 'email'].forEach(function(fieldName) {
        var input = form.querySelector('[name="' + fieldName + '"]');
        if (!input) return;

        input.addEventListener('blur', function() {
          if (input.value.trim() === '') {
            setFieldState(fieldName, true);
            return;
          }
          setFieldState(fieldName, validators[fieldName](input.value));
        });

        input.addEventListener('input', function() {
          var field = form.querySelector('[data-field="' + fieldName + '"]');
          if (field && field.classList.contains('invalid')) {
            if (validators[fieldName](input.value)) {
              setFieldState(fieldName, true);
            }
          }
        });
      });

      // Submit
      form.addEventListener('submit', function(e) {
        e.preventDefault();

        var data = {
          nome: form.nome.value.trim(),
          whatsapp: form.whatsapp.value.trim(),
          email: form.email.value.trim(),
          nascimento: form.nascimento ? form.nascimento.value : '',
          modalidade: form.modalidade ? form.modalidade.value : '',
          experiencia: (form.querySelector('[name="experiencia"]:checked') || {}).value || '',
          mensagem: form.mensagem ? form.mensagem.value.trim() : ''
        };

        var isValid = true;
        ['nome', 'whatsapp', 'email'].forEach(function(fieldName) {
          var valid = validators[fieldName](data[fieldName]);
          setFieldState(fieldName, valid);
          if (!valid) isValid = false;
        });

        if (!isValid) {
          var firstInvalid = form.querySelector('.field.invalid');
          if (firstInvalid) {
            firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
            var focusEl = firstInvalid.querySelector('input, select, textarea');
            if (focusEl) focusEl.focus();
          }
          return;
        }

        submitAsync(data);
      });

      function submitAsync(data) {
        submitBtn.disabled = true;
        var originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Enviando...</span><span class="arrow">\u23F3</span>';

        fetch('/api/contato', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: data.nome,
            whatsapp: data.whatsapp,
            email: data.email,
            nascimento: data.nascimento,
            modalidade: data.modalidade,
            experiencia: data.experiencia,
            mensagem: data.mensagem,
            _honeypot: form._honeypot ? form._honeypot.value : '',
            source: 'form-contato',
            submitted_at: new Date().toISOString()
          })
        }).then(function(response) {
          if (response.ok) {
            console.log('Lead enviado com sucesso');
            if (window.flexTrack) window.flexTrack('form_submit_success', { modalidade_interesse: data.modalidade, experiencia_previa: data.experiencia });
          } else {
            console.warn('Backend retornou erro:', response.status);
            if (window.flexTrack) window.flexTrack('form_backend_error', { status: response.status });
          }
        }).catch(function(err) {
          console.error('Erro de rede:', err);
          if (window.flexTrack) window.flexTrack('form_network_error', { error: err.message });
        });

        // UX sempre positiva (nao bloqueia aluna mesmo em erro)
        setTimeout(function() {
          submitBtn.classList.add('sent');
          submitBtn.innerHTML = '<span>Enviado com sucesso \u2713</span><span class="arrow">\u2713</span>';

          if (toast) {
            toast.classList.add('show');
            setTimeout(function() { toast.classList.remove('show'); }, 5000);
          }

          setTimeout(function() {
            form.reset();
            submitBtn.classList.remove('sent');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }, 3500);
        }, 800);
      }
    }

    // ==========================================================
    // 3. FAQ ACCORDION — close-others behavior
    // ==========================================================
    var faqItems = document.querySelectorAll('.faq-op-item');
    faqItems.forEach(function(item) {
      item.addEventListener('toggle', function() {
        if (item.open) {
          faqItems.forEach(function(other) {
            if (other !== item && other.open) {
              other.open = false;
            }
          });

          setTimeout(function() {
            var rect = item.getBoundingClientRect();
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

  }); // end ready()
})();
