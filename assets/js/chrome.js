/* chrome.js — the only runtime JS on the static site.
   Progressive enhancement: menu toggle, theme cycle, lightbox triggers, note popups.
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

	// Research-note popups. A note link in an essay is a real link to the note's
	// page; this upgrades the click to open the note baked into the page (a
	// hidden <dialog>) so the reader keeps their place. The href is left intact,
	// so with JS off — or for a note that was not baked on this page — the link
	// simply navigates, which is exactly the graceful degradation we want.
	var noteDialogs = Array.prototype.slice.call(document.querySelectorAll('.note-dialog'));
	if (noteDialogs.length) {
		var openNote = function (slug) {
			var dlg = document.getElementById('note-' + slug);
			if (!dlg || typeof dlg.showModal !== 'function') return false;
			// One note at a time: a cross-note link swaps the panel.
			noteDialogs.forEach(function (d) { if (d !== dlg && d.open) d.close(); });
			if (!dlg.open) dlg.showModal();
			return true;
		};
		document.addEventListener('click', function (e) {
			var a = e.target.closest && e.target.closest('a.note-ref');
			if (a && openNote(a.getAttribute('data-note'))) e.preventDefault();
		});
		noteDialogs.forEach(function (dlg) {
			// Escape and focus trapping are the <dialog>'s own. The backdrop click
			// is not: a click that lands on the dialog box itself (not on the panel)
			// is a click on the backdrop.
			dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
			var closeBtn = dlg.querySelector('.note-close');
			if (closeBtn) closeBtn.addEventListener('click', function () { dlg.close(); });
			// "Open in a new tab" carries the reader out of the popup, so close it:
			// the anchor's target="_blank" still opens the tab, and the panel would
			// otherwise be left open behind it.
			var openLink = dlg.querySelector('.note-open');
			if (openLink) openLink.addEventListener('click', function () { dlg.close(); });
		});
	}
})();
