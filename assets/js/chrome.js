/* chrome.js — the only runtime JS on the static site.
   Progressive enhancement: menu toggle + theme cycle. Everything else is baked. */
(function () {
	'use strict';

	// Theme: system → dark → light, persisted in localStorage
	var themeBtn = document.getElementById('theme-toggle');
	function themeLabel() {
		var m = document.documentElement.dataset.theme || 'system';
		return m === 'system' ? 'Auto' : m.charAt(0).toUpperCase() + m.slice(1);
	}
	if (themeBtn) {
		themeBtn.textContent = themeLabel();
		themeBtn.addEventListener('click', function () {
			var order = ['system', 'dark', 'light'];
			var cur = document.documentElement.dataset.theme || 'system';
			var next = order[(order.indexOf(cur) + 1) % order.length];
			document.documentElement.dataset.theme = next;
			try { localStorage.setItem('raum-theme', next); } catch (e) {}
			themeBtn.textContent = themeLabel();
		});
	}

	// Mobile menu
	var menuToggle = document.getElementById('menu-toggle');
	var header = document.getElementById('site-header');
	var nav = document.getElementById('site-nav');
	if (menuToggle && header && nav) {
		var setMenu = function (open) {
			menuToggle.setAttribute('aria-expanded', String(open));
			menuToggle.classList.toggle('open', open);
			header.classList.toggle('nav-open', open);
		};
		menuToggle.addEventListener('click', function () {
			setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
		});
		nav.addEventListener('click', function (e) {
			if (e.target.closest('a')) setMenu(false);
		});
	}
})();
