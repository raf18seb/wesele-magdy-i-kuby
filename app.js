/* =====================================================================
   Magda & Kuba - Wesele | app.js
   Vanilla JS: countdown, topbar, photos, theme switcher, boarding-pass RSVP.
   No build step, no framework. Drop on any static host.
   ===================================================================== */
(function () {
  'use strict';

  /* ===================================================================
     CONFIG - podmień na właściwe dane
     =================================================================== */
  // Data i godzina ślubu (lokalny czas). Hero meta pokazuje [ 06.08.2026 ].
  var WEDDING_DATE = '2026-08-06T16:00:00';

  /* ===================================================================
     1. COUNTDOWN
     =================================================================== */
  (function countdown() {
    var target = new Date(WEDDING_DATE).getTime();
    var els = {
      days: document.querySelector('[data-cd="days"]'),
      hours: document.querySelector('[data-cd="hours"]'),
      mins: document.querySelector('[data-cd="mins"]'),
      secs: document.querySelector('[data-cd="secs"]')
    };
    if (!els.days) return;
    function pad(n, l) { n = String(n); while (n.length < l) n = '0' + n; return n; }
    function tick() {
      var d = target - Date.now();
      if (d < 0) d = 0;
      els.days.textContent = pad(Math.floor(d / 86400000), 3);
      els.hours.textContent = pad(Math.floor(d / 3600000) % 24, 2);
      els.mins.textContent = pad(Math.floor(d / 60000) % 60, 2);
      els.secs.textContent = pad(Math.floor(d / 1000) % 60, 2);
    }
    tick();
    setInterval(tick, 1000);
  })();

  /* ===================================================================
     2. TOPBAR - solid shadow once scrolled past the hero
     =================================================================== */
  (function topbar() {
    var bar = document.querySelector('.topbar');
    var hero = document.getElementById('hero');
    if (!bar) return;
    function onScroll() {
      var trigger = (hero ? hero.offsetHeight : 600) - 90;
      if (window.scrollY > trigger) bar.classList.add('solid');
      else bar.classList.remove('solid');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  })();

  /* ===================================================================
     2b. MOBILE NAV - hamburger toggles the dropdown menu
     =================================================================== */
  (function mobileNav() {
    var bar = document.querySelector('.topbar');
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('topnav');
    if (!bar || !toggle || !nav) return;
    function setOpen(open) {
      bar.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    toggle.addEventListener('click', function () {
      setOpen(!bar.classList.contains('nav-open'));
    });
    // close after tapping a link
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    // close when widening back to desktop layout
    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) setOpen(false);
    });
  })();

  /* ===================================================================
     3. PHOTOS - real <img> with striped placeholder fallback
     Each .photo[data-src] gets an <img>; on successful load it fades in
     and the placeholder hides. Missing/broken src keeps the placeholder.
     Add real files under photos/ matching the data-src paths.
     =================================================================== */
  (function photos() {
    var ICON =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/>' +
      '<circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>';
    var slots = document.querySelectorAll('.photo');
    Array.prototype.forEach.call(slots, function (slot) {
      var cap = slot.getAttribute('data-ph') || 'zdjęcie';
      var src = slot.getAttribute('data-src') || '';
      slot.innerHTML =
        '<img alt="" loading="lazy" decoding="async">' +
        '<figcaption class="photo-ph">' + ICON + '<span>' + escapeHtml(cap) + '</span></figcaption>';
      var img = slot.querySelector('img');
      img.addEventListener('load', function () { slot.classList.add('filled'); });
      img.addEventListener('error', function () { slot.classList.remove('filled'); });
      if (src) img.src = src;
    });
  })();

  /* ===================================================================
     4. THEME SWITCHER - lightweight, persists to localStorage
     =================================================================== */
  (function themeSwitcher() {
    var THEME_KEY = { 'Szałwia': 'sage', 'Pistacja': 'pistachio', 'Błękit': 'sky', 'Biały': 'white' };
    var ACCENT_VAR = { 'Szałwia': 'var(--sage)', 'Błękit': 'var(--sky)' };
    var ACCENT_SOFT = { 'Szałwia': 'var(--pistachio)', 'Błękit': 'var(--sky-soft)' };
    var STORE = 'mk-wesele-theme';

    var defaults = { heroTheme: 'Szałwia', rsvpTheme: 'Pistacja', accent: 'Szałwia', photoRadius: 4 };
    var t = defaults;
    try { var saved = JSON.parse(localStorage.getItem(STORE) || 'null'); if (saved) t = Object.assign({}, defaults, saved); } catch (e) {}

    function apply() {
      var hero = document.getElementById('hero');
      var rsvp = document.getElementById('rsvp');
      if (hero) hero.setAttribute('data-theme', THEME_KEY[t.heroTheme] || 'sage');
      if (rsvp) rsvp.setAttribute('data-theme', THEME_KEY[t.rsvpTheme] || 'pistachio');
      var root = document.documentElement.style;
      root.setProperty('--accent', ACCENT_VAR[t.accent] || 'var(--sage)');
      root.setProperty('--accent-soft', ACCENT_SOFT[t.accent] || 'var(--pistachio)');
      root.setProperty('--photo-radius', (t.photoRadius || 0) + 'px');
      try { localStorage.setItem(STORE, JSON.stringify(t)); } catch (e) {}
    }

    function segGroup(label, key, options) {
      var html = '<div class="tw-sect">' + label + '</div><div class="tw-seg" data-key="' + key + '">';
      options.forEach(function (o) {
        html += '<button type="button" data-val="' + o + '"' + (t[key] === o ? ' class="on"' : '') + '>' + o + '</button>';
      });
      return html + '</div>';
    }

    var fab = document.createElement('button');
    fab.className = 'tw-fab';
    fab.setAttribute('aria-label', 'Motyw kolorystyczny');
    fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="12.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="13.5" r="2.5"/><path d="M12 22a10 10 0 1 1 0-20 9 9 0 0 1 9 9 4.5 4.5 0 0 1-4.5 4.5h-2A2.5 2.5 0 0 0 12 18a2 2 0 0 1-2 2 2 2 0 0 0-2 2"/></svg>';

    var panel = document.createElement('div');
    panel.className = 'tw-panel';
    panel.innerHTML =
      '<div class="tw-title">Motyw <button class="x" aria-label="Zamknij">✕</button></div>' +
      segGroup('Tło hero', 'heroTheme', ['Szałwia', 'Pistacja', 'Błękit', 'Biały']) +
      segGroup('Karta pokładowa', 'rsvpTheme', ['Pistacja', 'Błękit', 'Biały']) +
      segGroup('Kolor akcentu', 'accent', ['Szałwia', 'Błękit']) +
      '<div class="tw-sect">Zaokrąglenie zdjęć</div>' +
      '<div class="tw-row"><input class="tw-slider" type="range" min="0" max="26" step="2" value="' + t.photoRadius + '">' +
      '<span class="tw-val">' + t.photoRadius + 'px</span></div>';

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    fab.addEventListener('click', function () { panel.classList.toggle('open'); });
    panel.querySelector('.x').addEventListener('click', function () { panel.classList.remove('open'); });

    Array.prototype.forEach.call(panel.querySelectorAll('.tw-seg'), function (grp) {
      grp.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-val]');
        if (!btn) return;
        var key = grp.getAttribute('data-key');
        t[key] = btn.getAttribute('data-val');
        Array.prototype.forEach.call(grp.querySelectorAll('button'), function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        apply();
      });
    });
    var slider = panel.querySelector('.tw-slider');
    var val = panel.querySelector('.tw-val');
    slider.addEventListener('input', function () {
      t.photoRadius = Number(slider.value);
      val.textContent = t.photoRadius + 'px';
      apply();
    });

    apply();
  })();

  /* ===================================================================
     5. BOARDING PASS - multi-step RSVP "Karta pokładowa"
     =================================================================== */
  (function boardingPass() {
    var root = document.getElementById('boarding-pass-root');
    if (!root) return;

    /* ---- icons ---- */
    var IC_PLANE = svg('<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>', 1.3);
    var IC_SOLO = svg('<circle cx="12" cy="8" r="3.4"/><path d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/>', 1.2);
    var IC_DUO = svg('<circle cx="8.5" cy="8" r="3"/><circle cx="16" cy="9" r="2.6"/><path d="M2.5 20c0-3.3 2.7-5.5 6-5.5"/><path d="M10 20c0-3.6 2.8-6 6-6s5.5 2.2 5.5 5.5"/>', 1.2);

    function svg(inner, w) {
      return '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' +
        w + '" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
    }

    var ROUTE_LINE =
      '<svg viewBox="0 0 360 78" fill="none" preserveAspectRatio="xMidYMid meet">' +
      '<circle cx="16" cy="56" r="4.5" fill="currentColor"/>' +
      '<path d="M20 54 C 110 6, 250 6, 322 42" stroke="currentColor" stroke-width="1.6" stroke-dasharray="1.5 8" stroke-linecap="round"/>' +
      '<g transform="translate(144.5,18.7) rotate(-6)">' +
      '<path d="M-9 -6 L9 0 L-9 6 L-4 0 Z" fill="currentColor"/>' +
      '<path d="M-4 0 L9 0" stroke="#FFFFFF" stroke-width="0.9" stroke-linecap="round"/></g>' +
      '<g transform="translate(322,16)" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M0 24 C -7 14, -9 10, -9 5 A 9 9 0 0 1 9 5 C 9 10, 7 14, 0 24 Z" fill="#FFFFFF"/>' +
      '<circle cx="0" cy="5" r="3.1" fill="currentColor" stroke="none"/></g></svg>';

    var BARCODE = (function () {
      var rng = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 2, 1];
      var x = 0, rects = '';
      rng.forEach(function (g) { rects += '<rect x="' + x + '" y="0" width="' + g + '" height="54" fill="var(--ink)"/>'; x += g + 2; });
      return '<svg class="barcode" viewBox="0 0 ' + x + ' 54" preserveAspectRatio="none">' + rects + '</svg>';
    })();

    /* ---- state ---- */
    function blankP() { return { name: '', attending: '', diet: 'zwykla', allergies: '' }; }
    var state = {
      step: 0, sent: false, errors: {},
      type: '', p1: blankP(), p2: blankP(),
      kids: 0, kidsNote: '',
      drinks: [], transferToVenue: '', transferToHome: '',
      email: '', phone: ''
    };

    /* ---- derived ---- */
    function isPair() { return state.type === 'para'; }
    function p1Going() { return state.p1.attending === 'tak'; }
    function p2Going() { return isPair() && state.p2.attending === 'tak'; }
    function anyGoing() { return p1Going() || p2Going(); }
    function steps() {
      var list = ['type', 'people'];
      if (anyGoing()) list.push('diet', 'extras');
      list.push('contact', 'summary');
      return list;
    }
    function current() { var s = steps(); return s[Math.min(state.step, s.length - 1)]; }

    var DIET = { zwykla: 'Zwykła', wege: 'Wegetariańska', wegan: 'Wegańska' };
    function dietLabel(d) { return DIET[d] || '—'; }
    function yn(v) { return v === 'tak' ? 'Tak' : v === 'nie' ? 'Nie' : '—'; }

    /* ---- live stub ---- */
    function stub() {
      var name = state.p1.name.trim() || '—';
      var name2 = isPair() ? (state.p2.name.trim() || '—') : null;
      var status = !state.type ? '—' : anyGoing() ? 'Na pokładzie' : state.p1.attending === 'nie' ? 'Nie tym razem' : '—';
      var row = 1 + (name.length * 7) % 28;
      var col = 'ABCDEF'[(name.length * 3) % 6];
      var seat = String(row).padStart(2, '0') + col;
      var guests = (p1Going() ? 1 : 0) + (p2Going() ? 1 : 0) + (anyGoing() ? state.kids : 0) || '—';
      return { name: name, name2: name2, status: status, seat: anyGoing() ? seat : '—', guests: guests };
    }

    /* ---- validation (mirrors prototype) ---- */
    function validate(key) {
      var e = {};
      if (key === 'type' && !state.type) e.type = 'Wybierz, jak lecisz.';
      if (key === 'people') {
        if (!state.p1.name.trim()) e.p1name = 'Podaj imię i nazwisko.';
        if (!state.p1.attending) e.p1att = 'Zaznacz obecność.';
        if (isPair()) {
          if (!state.p2.name.trim()) e.p2name = 'Podaj imię i nazwisko drugiej osoby.';
          if (!state.p2.attending) e.p2att = 'Zaznacz obecność.';
        }
      }
      if (key === 'contact') {
        var hasEmail = state.email.trim();
        var hasPhone = state.phone.trim();
        if (!hasEmail && !hasPhone) e.contact = 'Zostaw e-mail albo telefon - wybierz jedno.';
        else if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) e.email = 'Sprawdź adres e-mail.';
      }
      return e;
    }

    function next() {
      var e = validate(current());
      state.errors = e;
      if (Object.keys(e).length) { render(); return; }
      var s = steps();
      state.step = Math.min(state.step + 1, s.length - 1);
      render(true);
    }
    function back() { state.errors = {}; state.step = Math.max(0, state.step - 1); render(true); }
    function goTo(key) { var i = steps().indexOf(key); if (i >= 0) { state.errors = {}; state.step = i; render(true); } }

    /* ---- small control builders ---- */
    function segmented(field, opts, tone) {
      var val = get(field);
      var html = '<div class="seg ' + (tone || '') + '" data-seg="' + field + '">';
      opts.forEach(function (o) { html += '<button type="button" data-v="' + o.v + '"' + (val === o.v ? ' class="on"' : '') + '>' + o.l + '</button>'; });
      return html + '</div>';
    }
    function fieldWrap(label, required, error, inner) {
      return '<div class="fld ' + (error ? 'err' : '') + '">' +
        '<label class="cap">' + label + (required ? '<span class="req"> ·</span>' : '') + '</label>' +
        inner + '<div class="hint">' + (error || '') + '</div></div>';
    }
    function get(path) { var p = path.split('.'); return p.length === 2 ? state[p[0]][p[1]] : state[path]; }
    function set(path, v) { var p = path.split('.'); if (p.length === 2) state[p[0]][p[1]] = v; else state[path] = v; }

    /* ---- step bodies ---- */
    function stepHtml() {
      var c = current(), e = state.errors;
      switch (c) {
        case 'type':
          return '<div class="bp-step">' +
            '<h3 class="bp-step-h">Jak lecisz?</h3>' +
            '<p class="bp-step-s">Zarezerwuj miejsce dla siebie albo dla pary.</p>' +
            '<div class="choices">' +
            '<button type="button" class="choice ' + (state.type === 'sam' ? 'on' : '') + '" data-type="sam">' +
            '<span class="ic">' + IC_SOLO + '</span><div class="ttl">Sam / sama</div><div class="dsc">Jedno miejsce na pokładzie.</div></button>' +
            '<button type="button" class="choice ' + (state.type === 'para' ? 'on' : '') + '" data-type="para">' +
            '<span class="ic">' + IC_DUO + '</span><div class="ttl">W parze</div><div class="dsc">Dwa miejsca - dodaj osobę towarzyszącą.</div></button>' +
            '</div>' + (e.type ? '<div class="hint" style="margin-top:14px">' + e.type + '</div>' : '') + '</div>';

        case 'people':
          var h = '<div class="bp-step"><h3 class="bp-step-h">Pasażerowie</h3>' +
            '<p class="bp-step-s">Kto wsiada na pokład i czy będzie z nami tego dnia.</p>' +
            '<div class="pblock"><div class="ph-name"><span>' + (isPair() ? 'Osoba 1' : 'Twoje dane') + '</span><span class="ln"></span></div>' +
            '<div class="bp-grid two">' +
            fieldWrap('Imię i nazwisko', true, e.p1name, '<input class="inp" data-input="p1.name" placeholder="np. Magda Nowak" value="' + attr(state.p1.name) + '">') +
            fieldWrap('Obecność', true, e.p1att, segmented('p1.attending', [{ v: 'tak', l: 'Będę' }, { v: 'nie', l: 'Nie dam rady' }])) +
            '</div></div>';
          if (isPair()) {
            h += '<div class="pblock"><div class="ph-name"><span>Osoba 2 · towarzysząca</span><span class="ln"></span></div>' +
              '<div class="bp-grid two">' +
              fieldWrap('Imię i nazwisko', true, e.p2name, '<input class="inp" data-input="p2.name" placeholder="np. Kuba Nowak" value="' + attr(state.p2.name) + '">') +
              fieldWrap('Obecność', true, e.p2att, segmented('p2.attending', [{ v: 'tak', l: 'Będzie' }, { v: 'nie', l: 'Nie da rady' }])) +
              '</div></div>';
          }
          if (state.type && !anyGoing()) {
            h += '<p class="bp-step-s" style="margin-top:18px;margin-bottom:0">Szkoda, że Was nie będzie - dziękujemy, że dajecie znać. Zostaw jeszcze kontakt na ostatnim kroku.</p>';
          }
          return h + '</div>';

        case 'diet':
          var d = '<div class="bp-step"><h3 class="bp-step-h">Menu na pokładzie</h3>' +
            '<p class="bp-step-s">Dieta i alergie - osobno dla każdej osoby.</p>';
          if (p1Going()) d += dietBlock(isPair() ? (state.p1.name.trim() || 'Osoba 1') : 'Twoje menu', 'p1');
          if (p2Going()) d += dietBlock(state.p2.name.trim() || 'Osoba 2', 'p2');
          d += '<div class="pblock"><div class="ph-name"><span>Dzieci</span><span class="ln"></span></div>' +
            '<div class="bp-grid two" style="align-items:center">' +
            fieldWrap('Ile dzieci zabierasz?', false, null,
              '<div class="counter" data-counter="kids"><button type="button" data-d="-1" aria-label="mniej">–</button><span class="n">' + state.kids + '</span><button type="button" data-d="1" aria-label="więcej">+</button></div>') +
            (state.kids > 0 ? fieldWrap('Wiek dzieci / posiłek', false, null, '<input class="inp" data-input="kidsNote" placeholder="np. 3 i 6 lat, posiłki dla dzieci" value="' + attr(state.kidsNote) + '">') : '') +
            '</div></div></div>';
          return d;

        case 'extras':
          var drinks = ['Wino', 'Piwo', 'Drink', 'Coś mocniejszego', 'Bez alkoholu'];
          var chips = '<div class="chips" data-chips="drinks">';
          drinks.forEach(function (o) { chips += '<button type="button" class="chip ' + (state.drinks.indexOf(o) >= 0 ? 'on' : '') + '" data-v="' + o + '">' + o + '</button>'; });
          chips += '</div>';
          return '<div class="bp-step"><h3 class="bp-step-h">Pokład i transfery</h3>' +
            '<p class="bp-step-s">Napoje oraz transport w dniu wesela.</p>' +
            '<div class="bp-grid">' +
            fieldWrap('Co nalewamy? (możesz zaznaczyć kilka)', false, null, chips) +
            '<div class="bp-grid two">' +
            fieldWrap('Transfer z kościoła na salę', false, null, segmented('transferToVenue', [{ v: 'tak', l: 'Tak, proszę' }, { v: 'nie', l: 'Dojadę sam' }], 'sky')) +
            fieldWrap('Transfer z sali do domu (nocny)', false, null, segmented('transferToHome', [{ v: 'tak', l: 'Tak, proszę' }, { v: 'nie', l: 'Nie trzeba' }], 'sky')) +
            '</div></div></div>';

        case 'contact':
          return '<div class="bp-step"><h3 class="bp-step-h">Kontakt</h3>' +
            '<p class="bp-step-s">Damy znać o szczegółach. Wystarczy e-mail albo telefon.</p>' +
            '<div class="bp-grid two">' +
            fieldWrap('E-mail', false, e.email || e.contact, '<input class="inp" type="email" data-input="email" placeholder="imie@example.com" value="' + attr(state.email) + '">') +
            fieldWrap('Telefon', false, null, '<input class="inp" type="tel" data-input="phone" placeholder="+48 600 000 000" value="' + attr(state.phone) + '">') +
            '</div></div>';

        case 'summary':
          return summaryHtml();
      }
      return '';
    }

    function dietBlock(title, key) {
      var p = state[key];
      return '<div class="pblock"><div class="ph-name"><span>' + escapeHtml(title) + '</span><span class="ln"></span></div>' +
        '<div class="bp-grid">' +
        fieldWrap('Dieta', false, null, segmented(key + '.diet', [{ v: 'zwykla', l: 'Zwykła' }, { v: 'wege', l: 'Wegetariańska' }, { v: 'wegan', l: 'Wegańska' }], 'sage')) +
        fieldWrap('Alergie / nietolerancje', false, null, '<input class="inp" data-input="' + key + '.allergies" placeholder="np. orzechy, gluten, laktoza - lub zostaw puste" value="' + attr(p.allergies) + '">') +
        '</div></div>';
    }

    function summaryHtml() {
      var s = '<div class="bp-step"><h3 class="bp-step-h">Twoja karta pokładowa</h3>' +
        '<p class="bp-step-s">Sprawdź dane przed odprawą. Wszystko możesz jeszcze poprawić.</p>';
      s += sumSec('Pasażerowie', 'people');
      s += '<div class="sum-grid">';
      s += sumItem(isPair() ? 'Osoba 1' : 'Pasażer', (state.p1.name ? escapeHtml(state.p1.name) : muted('—')) + ' <span class="muted">· ' + (yn(state.p1.attending) === 'Tak' ? 'będzie' : 'nie będzie') + '</span>');
      if (isPair()) s += sumItem('Osoba 2', (state.p2.name ? escapeHtml(state.p2.name) : muted('—')) + ' <span class="muted">· ' + (yn(state.p2.attending) === 'Tak' ? 'będzie' : 'nie będzie') + '</span>');
      if (anyGoing() && state.kids > 0) s += sumItem('Dzieci', state.kids + (state.kidsNote ? ' · ' + escapeHtml(state.kidsNote) : ''));
      s += '</div>';

      if (anyGoing()) {
        s += sumSec('Menu', 'diet') + '<div class="sum-grid">';
        if (p1Going()) s += sumItem(isPair() ? escapeHtml(state.p1.name || 'Osoba 1') : 'Dieta', dietLabel(state.p1.diet) + (state.p1.allergies ? '<span class="muted"> · ' + escapeHtml(state.p1.allergies) + '</span>' : ''));
        if (p2Going()) s += sumItem(escapeHtml(state.p2.name || 'Osoba 2'), dietLabel(state.p2.diet) + (state.p2.allergies ? '<span class="muted"> · ' + escapeHtml(state.p2.allergies) + '</span>' : ''));
        s += '</div>';
        s += sumSec('Pokład i transfery', 'extras') + '<div class="sum-grid">';
        s += sumItem('Napoje', state.drinks.length ? escapeHtml(state.drinks.join(', ')) : muted('bez preferencji'));
        s += sumItem('Transfer · kościół → sala', yn(state.transferToVenue));
        s += sumItem('Transfer · sala → dom', yn(state.transferToHome));
        s += '</div>';
      }

      s += sumSec('Kontakt', 'contact') + '<div class="sum-grid">';
      s += sumItem('E-mail', state.email ? escapeHtml(state.email) : muted('—'));
      s += sumItem('Telefon', state.phone ? escapeHtml(state.phone) : muted('—'));
      s += '</div></div>';
      return s;
    }
    function sumSec(label, editKey) { return '<div class="sum-sec"><span>' + label + '</span><span class="ln"></span><button class="edit" data-edit="' + editKey + '">edytuj</button></div>'; }
    function sumItem(k, v) { return '<div class="sum-item"><div class="k">' + k + '</div><div class="v">' + v + '</div></div>'; }
    function muted(x) { return '<span class="muted">' + x + '</span>'; }

    /* ---- stub markup ---- */
    function stubHtml(confirm) {
      var st = stub();
      return '<aside class="bp-stub">' +
        '<div class="stub-hd"><span class="mono-mk">M&amp;K</span><span class="stub-lbl">' + (confirm ? 'Odcinek' : 'Odcinek pasażera') + '</span></div>' +
        '<div class="stub-row"><div class="stub-lbl">Pasażer</div><div class="v js-name">' + escapeHtml(st.name) + '</div>' +
        (st.name2 ? '<div class="v js-name2">' + escapeHtml(st.name2) + '</div>' : '') + '</div>' +
        '<div class="stub-row"><div class="stub-lbl">Status</div><div class="v it js-status">' + st.status + '</div></div>' +
        (confirm
          ? '<div class="stub-row"><div class="stub-lbl">Miejsce</div><div class="stub-mono js-seat">' + st.seat + '</div></div>'
          : '<div class="stub-row" style="display:flex;gap:24px"><div><div class="stub-lbl">Miejsce</div><div class="stub-mono js-seat">' + st.seat + '</div></div>' +
            '<div><div class="stub-lbl">Goście</div><div class="stub-mono js-guests">' + st.guests + '</div></div></div>') +
        BARCODE +
        (confirm
          ? '<div class="stub-foot"><div class="stub-mono">MK · [ DATA ]</div></div>'
          : '<div class="stub-foot"><div class="stub-lbl">Rejs</div><div class="stub-mono">MK · [ DATA ]</div></div>') +
        '</aside>';
    }

    /* ---- progress ---- */
    function progHtml() {
      var s = steps(), h = '<div class="bp-prog" aria-hidden="true">';
      s.forEach(function (_, i) {
        if (i > 0) h += '<span class="link"></span>';
        h += '<span class="node ' + (i < state.step ? 'done' : '') + ' ' + (i === state.step ? 'cur' : '') + '"></span>';
      });
      return h + '</div>';
    }

    /* ---- render ---- */
    function render(scroll) {
      if (state.sent) { renderSent(); return; }
      var c = current();
      var navRight = c === 'summary'
        ? '<button class="btn next" data-act="send">Odprawa · wyślij →</button>'
        : '<button class="btn next" data-act="next">Dalej →</button>';
      var navLeft = state.step > 0 ? '<button class="btn back" data-act="back">← Wstecz</button>' : '<span></span>';

      root.innerHTML =
        '<div class="bp-wrap">' + progHtml() +
        '<div class="bp"><span class="notch t"></span><span class="notch b"></span>' +
        '<div class="bp-main">' +
        '<div class="bp-hd"><div class="lhs"><span class="lbl">Karta pokładowa</span></div><span class="code">LOT&nbsp;MK&nbsp;·&nbsp;[DATA]</span></div>' +
        '<div class="bp-route"><div class="pt"><div class="k">Odlot</div><div class="v">[ Skąd ]</div></div>' +
        '<div class="mid">' + ROUTE_LINE + '</div><div class="pt r"><div class="k">Przylot</div><div class="v">Dworek</div></div></div>' +
        stepHtml() +
        '<div class="bp-nav">' + navLeft + navRight + '</div>' +
        '</div>' + stubHtml(false) + '</div></div>';

      bind();
      // Celowo nie przewijamy przy zmianie kroku. Wcześniej widok "wyrzucało"
      // na górę karty pokładowej - pozycja scrolla zostaje tam, gdzie była.
    }

    function renderSent() {
      root.innerHTML =
        '<div class="bp-wrap"><div class="bp"><span class="notch t"></span><span class="notch b"></span>' +
        '<div class="bp-main"><div class="done-wrap"><div class="ring">' + svg('<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>', 1.3) + '</div>' +
        '<h3>' + (anyGoing() ? 'Zameldowano' : 'Dziękujemy') + '</h3>' +
        '<p>' + (anyGoing()
          ? 'Twoja karta pokładowa jest gotowa. Do zobaczenia na pokładzie - damy znać o szczegółach.'
          : 'Dziękujemy, że dałeś znać. Będziemy o Tobie pamiętać.') + '</p>' +
        '<button class="btn ghost" style="margin-top:28px" data-act="reset">Wypełnij ponownie</button>' +
        '</div></div>' + stubHtml(true) + '</div></div>';
      var r = root.querySelector('[data-act="reset"]');
      if (r) r.addEventListener('click', function () { state.sent = false; state.step = 0; render(true); });
    }

    /* ---- live stub update without re-render (keeps input focus) ---- */
    function updateStub() {
      var st = stub();
      var n = root.querySelector('.js-name'); if (n) n.textContent = st.name;
      var n2 = root.querySelector('.js-name2'); if (n2) n2.textContent = st.name2 || '';
      var seat = root.querySelector('.js-seat'); if (seat) seat.textContent = st.seat;
    }

    /* ---- event wiring ---- */
    function bind() {
      // text inputs: update state + live stub only (no re-render -> focus kept)
      Array.prototype.forEach.call(root.querySelectorAll('[data-input]'), function (inp) {
        inp.addEventListener('input', function () { set(inp.getAttribute('data-input'), inp.value); updateStub(); });
      });
      // choice cards (type)
      Array.prototype.forEach.call(root.querySelectorAll('[data-type]'), function (b) {
        b.addEventListener('click', function () { state.type = b.getAttribute('data-type'); state.errors = {}; render(); });
      });
      // segmented controls
      Array.prototype.forEach.call(root.querySelectorAll('[data-seg]'), function (grp) {
        grp.addEventListener('click', function (e) {
          var btn = e.target.closest('button[data-v]'); if (!btn) return;
          set(grp.getAttribute('data-seg'), btn.getAttribute('data-v')); state.errors = {}; render();
        });
      });
      // chips (multi)
      var chips = root.querySelector('[data-chips]');
      if (chips) chips.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-v]'); if (!btn) return;
        var v = btn.getAttribute('data-v'); var i = state.drinks.indexOf(v);
        if (i >= 0) state.drinks.splice(i, 1); else state.drinks.push(v);
        render();
      });
      // counter
      var counter = root.querySelector('[data-counter]');
      if (counter) counter.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-d]'); if (!btn) return;
        var d = Number(btn.getAttribute('data-d'));
        state.kids = Math.max(0, Math.min(8, state.kids + d));
        render();
      });
      // summary edit links
      Array.prototype.forEach.call(root.querySelectorAll('[data-edit]'), function (b) {
        b.addEventListener('click', function () { goTo(b.getAttribute('data-edit')); });
      });
      // nav
      var acts = { next: next, back: back, send: submit };
      Array.prototype.forEach.call(root.querySelectorAll('.bp-nav [data-act]'), function (b) {
        var fn = acts[b.getAttribute('data-act')];
        if (fn) b.addEventListener('click', fn);
      });
    }

    /* ---- submit (MOCK) ----------------------------------------------
       INTEGRACJA: podłącz tu wysyłkę RSVP (Formspree / Getform / własny
       endpoint / Google Form). Payload poniżej jest gotowy do POST-a.
       Na razie tylko loguje do konsoli i pokazuje ekran "Zameldowano".
       ------------------------------------------------------------------ */
    function submit() {
      var payload = buildPayload();
      console.log('[RSVP] zgłoszenie (mock - podłącz backend):', payload);
      // Przykład realnej wysyłki:
      // fetch('https://formspree.io/f/XXXXXXX', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      //   body: JSON.stringify(payload)
      // }).then(...).catch(...);
      state.sent = true;
      render(true);
    }

    function buildPayload() {
      return {
        typ: state.type,
        osoba1: { imie: state.p1.name, obecnosc: state.p1.attending, dieta: state.p1.diet, alergie: state.p1.allergies },
        osoba2: isPair() ? { imie: state.p2.name, obecnosc: state.p2.attending, dieta: state.p2.diet, alergie: state.p2.allergies } : null,
        dzieci: state.kids, dzieciUwagi: state.kidsNote,
        napoje: state.drinks.slice(),
        transferNaSale: state.transferToVenue, transferDoDomu: state.transferToHome,
        email: state.email, telefon: state.phone
      };
    }

    render();
  })();

  /* ===================================================================
     util
     =================================================================== */
  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function attr(s) { return escapeHtml(s); }
})();
