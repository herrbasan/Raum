// theme.js — dark/light/system toggle. Plain script (no modules) so it works from file://.
// Default: system preference. Manual choice persisted in localStorage, cycles System → Dark → Light.
(function () {
  var KEY = 'raum-theme';
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function read() {
    try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; }
  }
  function write(mode) {
    try { localStorage.setItem(KEY, mode); } catch (e) { /* private mode — ignore */ }
  }
  function apply(mode) {
    root.setAttribute('data-theme', mode);
    if (btn) {
      btn.textContent = mode === 'dark' ? 'Dark' : mode === 'light' ? 'Light' : 'System';
      btn.setAttribute('aria-label', 'Theme: ' + mode + '. Click to change.');
    }
  }
  function cycle() {
    var order = ['system', 'dark', 'light'];
    var next = order[(order.indexOf(read()) + 1) % order.length];
    write(next);
    apply(next);
  }
  if (btn) {
    btn.addEventListener('click', cycle);
    btn.title = 'Color scheme';
  }
  if (mq && mq.addEventListener) {
    mq.addEventListener('change', function () {
      if (read() === 'system') apply('system');
    });
  }
  apply(read());
})();
