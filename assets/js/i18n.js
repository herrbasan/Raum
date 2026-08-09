// i18n.js — site language toggle (EN/DE). Plain script (no modules) for file://.
// Per the plan: client-side preference, persisted in localStorage, defaults to
// the browser language. Instant swap, no reload, no second request.
// Mechanism:
//   [data-i18n]          → element textContent is swapped from data-i18n-<lang>
//   [data-i18n-block]    → element has a language twin; hidden toggled by [lang]
(function () {
  var KEY = 'raum-lang';
  var SUPPORTED = ['en', 'de'];
  var btn = document.getElementById('lang-toggle');

  function detect() {
    var b = (navigator.language || 'en').toLowerCase();
    return b.indexOf('de') === 0 ? 'de' : 'en';
  }
  function read() {
    var v;
    try { v = localStorage.getItem(KEY); } catch (e) { v = null; }
    return SUPPORTED.indexOf(v) !== -1 ? v : detect();
  }
  function write(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) { /* private mode */ }
  }

  function apply(lang) {
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
    document.querySelectorAll('[data-i18n-block]').forEach(function (el) {
      el.hidden = el.getAttribute('lang') !== lang;
    });
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = el.getAttribute('data-i18n-' + lang);
      if (val !== null) el.textContent = val;
    });
    if (btn) {
      btn.textContent = lang === 'de' ? 'DE' : 'EN';
      btn.setAttribute('aria-label', 'Language: ' + lang + '. Click to change.');
    }
  }
  function cycle() {
    var next = read() === 'en' ? 'de' : 'en';
    write(next);
    apply(next);
  }

  if (btn) {
    btn.addEventListener('click', cycle);
    btn.title = 'Language';
  }
  apply(read());
})();
