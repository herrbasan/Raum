/* chrome.js — the only runtime JS on the static site.
   Progressive enhancement: menu toggle, theme cycle, lightbox triggers.
   Everything else is baked. */
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

	// Mark the header stuck so the scrim beneath it appears only once the page
	// has actually scrolled — at rest it would wash out the top of whatever sits
	// under the header. The header's height is cached and only re-measured on
	// resize, so the scroll handler reads no layout and writes only on change.
	if (header) {
		var stuck = false;
		var threshold = 0;
		var setStuck = function (on) {
			if (on === stuck) return;
			stuck = on;
			if (on) header.setAttribute('data-stuck', '');
			else header.removeAttribute('data-stuck');
		};
		var check = function () { setStuck(window.scrollY > threshold); };
		addEventListener('scroll', check, { passive: true });
		addEventListener('resize', function () {
			threshold = header.offsetHeight;
			check();
		}, { passive: true });
		threshold = header.offsetHeight;
		check();
	}

	// Lightbox triggers. The build bakes each figure's images into an
	// <nui-lightbox> host marked with data-lightbox, and the addon collects them
	// — but it has no click-to-open of its own: its data-action handler covers
	// only close/prev/next, so the documented declarative markup is inert without
	// a trigger. This is that trigger, and the only reason the site ships any JS
	// for images. The addon is a module script, so wire now if it already
	// upgraded and wait for it if it has not — never assume either order.
	var wireLightboxes = function () {
		Array.prototype.forEach.call(document.querySelectorAll('nui-lightbox'), function (host) {
			if (host.dataset.lbWired) return;
			host.dataset.lbWired = '1';
			var imgs = Array.prototype.slice.call(
				host.querySelectorAll('img[data-lightbox], [data-lightbox-src]'));
			imgs.forEach(function (img, i) {
				img.setAttribute('role', 'button');
				img.setAttribute('tabindex', '0');
				img.addEventListener('click', function () { host.open(i); });
			});
			host.addEventListener('keydown', function (e) {
				if (e.key !== 'Enter' && e.key !== ' ') return;
				var i = imgs.indexOf(document.activeElement);
				if (i < 0) return;
				e.preventDefault();
				host.open(i);
			});
		});
	};
	if (document.querySelector('nui-lightbox')) {
		if (customElements.get('nui-lightbox')) wireLightboxes();
		else customElements.whenDefined('nui-lightbox').then(wireLightboxes);
	}
})();
