/* =========================================================
   MICKA — Portfolio musicien
   Tout le comportement du site. Aucune dépendance externe.
   ========================================================= */
(function () {
  'use strict';

  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  /* ---------------------------------------------------------
     1. Année du copyright, mise à jour toute seule
     --------------------------------------------------------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     1b. Langue FR / ENG
     Le français est écrit dans la page ; la version anglaise est
     juste à côté : data-en="..." pour un texte, data-en-alt="...",
     data-en-aria-label="...", etc. pour un attribut.
     --------------------------------------------------------- */
  var lang = 'fr';
  var tr = function (fr, en) { return lang === 'en' ? en : fr; };
  var langHooks = [];

  var applyLang = function (l, save) {
    lang = l === 'en' ? 'en' : 'fr';
    document.documentElement.lang = lang;

    $$('[data-en]').forEach(function (el) {
      if (el._fr === undefined) el._fr = el.innerHTML;
      el.innerHTML = lang === 'en' ? el.getAttribute('data-en') : el._fr;
    });

    $$('*').forEach(function (el) {
      Array.prototype.slice.call(el.attributes).forEach(function (a) {
        if (a.name.indexOf('data-en-') !== 0) return;
        var target = a.name.slice(8);
        el._frAttr = el._frAttr || {};
        if (!(target in el._frAttr)) el._frAttr[target] = el.getAttribute(target);
        el.setAttribute(target, lang === 'en' ? a.value : el._frAttr[target]);
      });
    });

    $$('.lang__btn').forEach(function (b) {
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });

    langHooks.forEach(function (fn) { fn(); });

    if (save) {
      try { localStorage.setItem('lang', lang); } catch (e) {}
    }
  };

  $$('.lang__btn').forEach(function (b) {
    b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang'), true); });
  });

  /* ---------------------------------------------------------
     2. Navigation : fond au scroll, menu mobile, lien actif
     --------------------------------------------------------- */
  var nav    = $('#nav');
  var burger = $('#burger');
  var menu   = $('#menu');

  var onScroll = function () {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var closeMenu = function () {
    if (!menu) return;
    menu.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', tr('Ouvrir le menu', 'Open menu'));
    document.body.classList.remove('menu-open');
  };

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? tr('Fermer le menu', 'Close menu') : tr('Ouvrir le menu', 'Open menu'));
      document.body.classList.toggle('menu-open', open);
    });

    langHooks.push(function () {
      burger.setAttribute('aria-label', menu.classList.contains('is-open')
        ? tr('Fermer le menu', 'Close menu') : tr('Ouvrir le menu', 'Open menu'));
    });

    // Refermer après un clic sur un lien
    $$('a', menu).forEach(function (a) { a.addEventListener('click', closeMenu); });
  }

  // Surligner dans le menu la section actuellement visible
  var navLinks = $$('.nav__menu a[href^="#"]');
  var sections = navLinks
    .map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ---------------------------------------------------------
     3. Apparition en fondu au scroll
     --------------------------------------------------------- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealables = $$('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------------------------------------------------
     4. Vidéos YouTube en « façade »
     La miniature s'affiche tout de suite ; la vraie vidéo (et les
     cookies YouTube) ne se chargent qu'au clic du visiteur.
     --------------------------------------------------------- */
  // "1:23:45", "23:45" ou "345" -> secondes (0 si vide ou invalide)
  var toSeconds = function (v) {
    if (!v) return 0;
    var parts = String(v).split(':').map(Number);
    if (parts.some(isNaN)) return 0;
    return parts.reduce(function (acc, n) { return acc * 60 + n; }, 0);
  };

  $$('.video[data-yt]').forEach(function (card) {
    var id = card.getAttribute('data-yt');
    if (!id) return;

    var btn = $('.video__play', card);
    if (!btn) return;

    // maxresdefault n'existe pas pour toutes les vidéos : on teste, sinon hqdefault.
    var hi = new Image();
    hi.onload = function () {
      var src = hi.naturalWidth > 120
        ? 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg'
        : 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
      btn.style.backgroundImage = 'url("' + src + '")';
    };
    hi.onerror = function () {
      btn.style.backgroundImage = 'url("https://i.ytimg.com/vi/' + id + '/hqdefault.jpg")';
    };
    hi.src = 'https://i.ytimg.com/vi/' + id + '/maxresdefault.jpg';

    btn.addEventListener('click', function () {
      var frame = document.createElement('iframe');
      var src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&enablejsapi=1';
      var start = toSeconds(card.getAttribute('data-start'));
      var end   = toSeconds(card.getAttribute('data-end'));
      if (start) src += '&start=' + start;
      if (end)   src += '&end=' + end;
      frame.src = src;
      frame.title = btn.getAttribute('aria-label') || tr('Vidéo YouTube', 'YouTube video');
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      frame.allowFullscreen = true;
      frame.loading = 'lazy';
      btn.replaceWith(frame);
    });
  });

  /* ---------------------------------------------------------
     5. Carrousels (vidéos, photos) : flèches, points, glissé tactile, clavier
     --------------------------------------------------------- */
  $$('.slider').forEach(function (slider) {
    var track  = $('.slider__track', slider);
    var slides = $$('.slide', track);
    var dotsEl = $('.slider__dots', slider);
    var cur    = 0;

    var dots = slides.map(function (s, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'slider__dot';
      d.setAttribute('aria-label', tr('Aller au n°', 'Go to no. ') + (i + 1));
      d.addEventListener('click', function () { goTo(i); });
      dotsEl.appendChild(d);
      return d;
    });

    // Met en pause une vidéo YouTube déjà lancée quand on quitte son sujet.
    var pauseVideos = function () {
      $$('iframe', track).forEach(function (f) {
        try {
          f.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: '' }), '*');
        } catch (e) {}
      });
    };

    var goTo = function (i) {
      if (i !== cur) pauseVideos();
      cur = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-100 * cur) + '%)';
      slides.forEach(function (s, k) {
        var on = k === cur;
        if (on) s.removeAttribute('inert'); else s.setAttribute('inert', '');
        s.setAttribute('aria-hidden', String(!on));
      });
      dots.forEach(function (d, k) {
        d.classList.toggle('is-active', k === cur);
        if (k === cur) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    };

    langHooks.push(function () {
      dots.forEach(function (d, i) { d.setAttribute('aria-label', tr('Aller au n°', 'Go to no. ') + (i + 1)); });
    });

    $('.slider__arrow--prev', slider).addEventListener('click', function () { goTo(cur - 1); });
    $('.slider__arrow--next', slider).addEventListener('click', function () { goTo(cur + 1); });

    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', function (e) {
      if (e.target !== slider) return;
      if (e.key === 'ArrowLeft')  goTo(cur - 1);
      if (e.key === 'ArrowRight') goTo(cur + 1);
    });

    var startX = null;
    slider.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) goTo(dx < 0 ? cur + 1 : cur - 1);
    });

    goTo(0);
  });

  /* ---------------------------------------------------------
     6. Concerts : dates formatées, triées et filtrées automatiquement
     --------------------------------------------------------- */
  var datesList = $('#dates-list');

  if (datesList) {
    var monthFmt = new Intl.DateTimeFormat('fr-FR', { month: 'short' });

    // Minuit aujourd'hui : un concert du jour compte comme « à venir ».
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var items = $$('.date', datesList).map(function (li) {
      var parts = (li.getAttribute('data-date') || '').split('-');
      var date  = new Date(+parts[0], (+parts[1] || 1) - 1, +parts[2] || 1);
      var valid = !isNaN(date.getTime());
      var past  = valid && date < today;

      if (valid) {
        var day   = $('.date__day', li);
        var month = $('.date__month', li);
        if (day)   day.textContent = String(date.getDate()).padStart(2, '0');
        if (month) month.textContent = monthFmt.format(date).replace('.', '') + ' ' + date.getFullYear();
        li.classList.toggle('is-past', past);
      }

      return { el: li, date: date, past: past };
    });

    // Ordre d'affichage : à venir du plus proche au plus lointain,
    // passés du plus récent au plus ancien.
    items
      .slice()
      .sort(function (a, b) {
        if (a.past !== b.past) return a.past ? 1 : -1;
        return a.past ? b.date - a.date : a.date - b.date;
      })
      .forEach(function (item) { datesList.appendChild(item.el); });

    langHooks.push(function () {
      var fmt = new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'fr-FR', { month: 'short' });
      items.forEach(function (item) {
        if (isNaN(item.date.getTime())) return;
        var m = $('.date__month', item.el);
        if (m) m.textContent = fmt.format(item.date).replace('.', '') + ' ' + item.date.getFullYear();
      });
    });

    var emptyMsg = $('#dates-empty');

    var applyFilter = function (filter) {
      var shown = 0;
      items.forEach(function (item) {
        var visible = (filter === 'past') ? item.past : !item.past;
        item.el.hidden = !visible;
        if (visible) shown++;
      });
      if (emptyMsg) emptyMsg.hidden = shown > 0;
    };

    $$('.dates__filters .chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        $$('.dates__filters .chip').forEach(function (c) {
          c.classList.remove('is-active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('is-active');
        chip.setAttribute('aria-pressed', 'true');
        applyFilter(chip.getAttribute('data-filter'));
      });
    });

    applyFilter('upcoming');
  }

  /* ---------------------------------------------------------
     7. Visionneuse photo (lightbox)
     --------------------------------------------------------- */
  var lightbox = $('#lightbox');

  if (lightbox) {
    var lbImg      = $('#lb-img');
    var thumbs     = $$('.gallery__item');
    var index      = 0;
    var lastFocus  = null;

    var show = function (i) {
      index = (i + thumbs.length) % thumbs.length;
      var src = $('img', thumbs[index]);
      if (!src) return;
      lbImg.src = src.src;
      lbImg.alt = src.alt;
    };

    var open = function (i) {
      lastFocus = document.activeElement;
      show(i);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      $('#lb-close').focus();
    };

    var close = function () {
      lightbox.hidden = true;
      lbImg.src = '';
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    thumbs.forEach(function (btn, i) {
      btn.addEventListener('click', function () { open(i); });
    });

    $('#lb-close').addEventListener('click', close);
    $('#lb-prev').addEventListener('click', function () { show(index - 1); });
    $('#lb-next').addEventListener('click', function () { show(index + 1); });

    // Clic sur le fond noir = fermeture
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', function (e) {
      if (lightbox.hidden) return;
      if (e.key === 'Escape')     close();
      if (e.key === 'ArrowLeft')  show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  /* ---------------------------------------------------------
     8. Formulaire de contact
     - data-mailto présent  -> ouvre le logiciel mail du visiteur
     - action Formspree     -> envoi direct sans quitter la page
     --------------------------------------------------------- */
  var form = $('#contact-form');

  if (form) {
    var note = $('#form-note');
    var say  = function (msg) { if (note) note.textContent = msg; };

    form.addEventListener('submit', function (e) {
      var action = form.getAttribute('action') || '';

      // --- Cas 1 : Formspree (ou autre service HTTP) ---
      if (/^https?:/i.test(action)) {
        e.preventDefault();
        say(tr('Envoi en cours…', 'Sending…'));

        fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        })
          .then(function (res) {
            if (!res.ok) throw new Error('Réponse ' + res.status);
            form.reset();
            say(tr('Message envoyé, merci ! Je reviens vers toi rapidement.', 'Message sent, thank you! I will get back to you shortly.'));
          })
          .catch(function () {
            say(tr("L'envoi a échoué. Écris-moi directement par e-mail.", 'Sending failed. Please email me directly.'));
          });
        return;
      }

      // --- Cas 2 : mailto (comportement par défaut du site) ---
      var to = form.getAttribute('data-mailto');
      if (!to) return;

      e.preventDefault();

      var data    = new FormData(form);
      var subject = '[Site] ' + (data.get('sujet') || 'Message');
      var body    = tr('Nom : ', 'Name: ') + (data.get('nom')   || '') + '\n' +
                    tr('E-mail : ', 'Email: ') + (data.get('email') || '') + '\n\n' +
                    (data.get('message') || '');

      window.location.href = 'mailto:' + to +
        '?subject=' + encodeURIComponent(subject) +
        '&body='    + encodeURIComponent(body);

      say(tr('Ton logiciel de messagerie va s’ouvrir avec le message pré-rempli.', 'Your email app will open with the message pre-filled.'));
    });
  }

  var savedLang = null;
  try { savedLang = localStorage.getItem('lang'); } catch (e) {}
  applyLang(savedLang || ((navigator.language || 'fr').toLowerCase().indexOf('fr') === 0 ? 'fr' : 'en'));
})();
