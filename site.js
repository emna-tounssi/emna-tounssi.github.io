// Small enhancements: theme toggle, mobile menu, active section, reveal on scroll, image viewer.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  // Theme: remembered per visitor, falls back to the system setting.
  var btn = document.querySelector('.theme-btn');
  if (btn) {
    btn.addEventListener('click', function () {
      var dark = root.getAttribute('data-theme') === 'dark' ||
        (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      var next = dark ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Mobile menu
  var menu = document.querySelector('.menu-btn');
  var nav = document.querySelector('.nav');
  if (menu && nav) {
    menu.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Header border once the page scrolls
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    // Reveal on scroll
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    // Highlight the current section in the nav (home) or the table of contents (project pages)
    var links = document.querySelectorAll('.nav a[href*="#"], .toc a');
    var map = {};
    links.forEach(function (a) { var id = a.getAttribute('href').split('#')[1]; if (id) { (map[id] = map[id] || []).push(a); } });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) {
          links.forEach(function (a) { a.classList.remove('active'); });
          map[en.target.id].forEach(function (a) { a.classList.add('active'); });
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // Image viewer for figures
  var figs = document.querySelectorAll('.fig img');
  if (figs.length && typeof HTMLDialogElement === 'function') {
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.innerHTML = '<img alt=""><button type="button" aria-label="Close">×</button>';
    document.body.appendChild(dlg);
    var big = dlg.querySelector('img');
    dlg.querySelector('button').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    figs.forEach(function (img) {
      img.addEventListener('click', function () { big.src = img.src; big.alt = img.alt; dlg.showModal(); });
    });
  }
})();
