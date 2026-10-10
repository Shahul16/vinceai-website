/*!
 * Vince AI Ltd — main.js
 * Vanilla JS. No dependencies. Progressive enhancement.
 */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------
   * 1. Sticky header shadow on scroll
   * ------------------------------------------------------------- */
  var header = $('.site-header');
  if (header) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        header.classList.toggle('is-scrolled', window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------------
   * 2. Mobile navigation
   * ------------------------------------------------------------- */
  var toggle = $('.nav-toggle');
  var mobileNav = $('.mobile-nav');

  if (toggle && mobileNav) {
    var setNav = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      mobileNav.classList.toggle('is-open', open);
    };

    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });

    $$('a', mobileNav).forEach(function (link) {
      link.addEventListener('click', function () { setNav(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) setNav(false);
    });
  }

  /* ---------------------------------------------------------------
   * 3. Scroll reveal (graceful fallback if unsupported)
   * ------------------------------------------------------------- */
  var revealables = $$('.reveal');
  if (revealables.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
      revealables.forEach(function (el) { io.observe(el); });
    } else {
      revealables.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---------------------------------------------------------------
   * 4. Smooth scroll for in-page anchors
   * ------------------------------------------------------------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  /* ---------------------------------------------------------------
   * 5. Contact form validation
   * ------------------------------------------------------------- */
  var form = $('form[data-validate]');
  if (form) {
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    var showError = function (field, message) {
      var box = field.parentNode.querySelector('.field__error');
      field.setAttribute('aria-invalid', 'true');
      if (box) { box.textContent = message; box.classList.add('is-visible'); }
    };

    var clearError = function (field) {
      var box = field.parentNode.querySelector('.field__error');
      field.removeAttribute('aria-invalid');
      if (box) { box.textContent = ''; box.classList.remove('is-visible'); }
    };

    var validateField = function (field) {
      var value = (field.value || '').trim();
      if (field.hasAttribute('required') && !value) {
        showError(field, 'This field is required.');
        return false;
      }
      if (field.type === 'email' && value && !EMAIL.test(value)) {
        showError(field, 'Please enter a valid email address.');
        return false;
      }
      clearError(field);
      return true;
    };

    var fields = $$('input, textarea, select', form).filter(function (f) {
      return f.type !== 'submit' && f.type !== 'hidden';
    });

    fields.forEach(function (field) {
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstInvalid = null;
      fields.forEach(function (field) {
        if (!validateField(field) && !firstInvalid) firstInvalid = field;
      });
      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // All fields valid — submit via fetch to Web3Forms
      var btn = form.querySelector('button[type="submit"]');
      var globalErr = form.querySelector('#form-global-error');
      var origLabel = btn ? btn.innerHTML : '';

      if (btn) { btn.disabled = true; btn.textContent = 'Sending\u2026'; }
      if (globalErr) { globalErr.textContent = ''; globalErr.classList.remove('is-visible'); }

      var formData = new FormData(form);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          // Fire GA4 conversion event before redirect
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'enquiry_submitted', {
              enquiry_type: (document.querySelector('#enquiry-type') || {}).value || 'unknown',
              service: (document.querySelector('#service') || {}).value || 'unspecified'
            });
          }
          // Redirect to thank-you page
          var redirect = form.querySelector('[name="redirect"]');
          window.location.href = redirect ? redirect.value : 'thank-you.html';
        } else {
          throw new Error(data.message || 'Submission failed');
        }
      })
      .catch(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = origLabel; }
        var msg = 'Something went wrong — please try again or email us directly at hello@vinceai.co.uk';
        if (globalErr) {
          globalErr.textContent = msg;
          globalErr.classList.add('is-visible');
        } else {
          window.alert(msg);
        }
      });
    });
  }

  /* ---------------------------------------------------------------
   * 6. Current year in footer
   * ------------------------------------------------------------- */
  $$('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();

/*!
 * Cookie consent — Google Analytics is loaded ONLY after explicit opt-in.
 * Nothing is set before a choice is made. Choice is stored in localStorage.
 */
(function () {
  'use strict';

  var KEY = 'vinceai-consent';
  var GA_ID = 'G-FGQB55TYJV';   // Google Analytics 4 Measurement ID

  var banner  = document.querySelector('.cookie-banner');
  var accept  = document.querySelector('[data-consent="accept"]');
  var reject  = document.querySelector('[data-consent="reject"]');
  var manage  = document.querySelectorAll('[data-consent="manage"]');

  function read() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { window.localStorage.setItem(KEY, v); } catch (e) {}
  }

  function loadAnalytics() {
    if (!GA_ID || window.__vinceGaLoaded) return;
    window.__vinceGaLoaded = true;

    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }

  function show() { if (banner) banner.classList.add('is-open'); }
  function hide() { if (banner) banner.classList.remove('is-open'); }

  if (accept) {
    accept.addEventListener('click', function () {
      write('granted'); hide(); loadAnalytics();
    });
  }
  if (reject) {
    reject.addEventListener('click', function () { write('denied'); hide(); });
  }
  Array.prototype.forEach.call(manage, function (btn) {
    btn.addEventListener('click', function (e) { e.preventDefault(); show(); });
  });

  var choice = read();
  if (choice === 'granted') loadAnalytics();
  else if (choice !== 'denied') window.setTimeout(show, 900);
})();

/*!
 * Conversion instrumentation — Croll & Yoskovitz, "Lean Analytics"
 *
 * Pageviews are a vanity metric: they rise without telling you what to change.
 * A good metric is a ratio. The One Metric That Matters here is
 *
 *     enquiry rate = enquiries submitted / homepage sessions
 *
 * so these events exist to make that ratio computable, and to show where the
 * funnel leaks. Events only fire once consent is granted, because gtag does
 * not exist before then.
 */
(function () {
  'use strict';

  function track(name, params) {
    if (typeof window.gtag !== 'function') return;   // no consent, no events
    window.gtag('event', name, params || {});
  }

  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  // Funnel step 1 — intent to enquire (any "Get in touch")
  $$('a[href$="contact.html"], a[href="contact.html"]').forEach(function (a) {
    a.addEventListener('click', function () {
      track('cta_click', { location: a.closest('header') ? 'header'
                                   : a.closest('footer') ? 'footer'
                                   : a.closest('.hero') ? 'hero' : 'body' });
    });
  });

  // Funnel step 2 — engaged with the form
  var form = document.querySelector('form[data-validate]');
  if (form && document.querySelector('#message')) {
    var started = false;
    form.addEventListener('input', function () {
      if (started) return;
      started = true;
      track('form_start');
    }, true);

    // Funnel step 3 — the conversion itself
    form.addEventListener('submit', function () {
      if (!form.querySelector('[aria-invalid="true"]')) {
        track('enquiry_submitted', {
          enquiry_type: (document.querySelector('#enquiry-type') || {}).value || 'unknown',
          service: (document.querySelector('#service') || {}).value || 'unspecified'
        });
      }
    });

    // Leak detector — validation is where forms lose people
    form.addEventListener('submit', function () {
      var bad = form.querySelectorAll('[aria-invalid="true"]');
      if (bad.length) {
        track('form_validation_blocked', {
          fields: Array.prototype.map.call(bad, function (f) { return f.id; }).join(',')
        });
      }
    });
  }

  // Transitional conversion — not ready to talk, still reachable
  var notify = document.querySelector('#notify-email');
  if (notify && notify.form) {
    notify.form.addEventListener('submit', function () { track('guide_signup'); });
  }

  // Consent decisions, so the analytics denominator is interpretable
  var accept = document.querySelector('[data-consent="accept"]');
  if (accept) accept.addEventListener('click', function () {
    window.setTimeout(function () { track('consent_granted'); }, 400);
  });

  // Phone and email taps are enquiries too, and are otherwise invisible
  $$('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener('click', function () { track('phone_click'); });
  });
  $$('a[href^="mailto:"]').forEach(function (a) {
    a.addEventListener('click', function () { track('email_click'); });
  });
})();
