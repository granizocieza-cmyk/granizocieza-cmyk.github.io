(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Horario y estado ---------- */
  // [apertura, cierre] en minutos desde las 0:00. Cierre > 1440 = pasa de medianoche.
  // 0 = domingo ... 6 = sábado
  var HOURS = {
    0: [600, 1440], 1: [540, 1440], 2: [540, 1440], 3: [540, 1440],
    4: [540, 1440], 5: [540, 1500], 6: [600, 1500]
  };
  var WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  function madridNow() {
    // Para probar: ?now=5-00:30 (día 0-6, hora). Útil para enseñar "viernes 0:30".
    var m = /[?&]now=([0-6])-(\d{1,2}):(\d{2})/.exec(location.search);
    if (m) return { day: +m[1], min: +m[2] * 60 + +m[3] };
    var o = {};
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(new Date()).forEach(function (p) { o[p.type] = p.value; });
    return { day: WD[o.weekday], min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
  }

  function fmt(min) {
    if (min === 1440) return '24:00';
    min = min % 1440;
    var h = Math.floor(min / 60), m = min % 60;
    return h + ':' + (m < 10 ? '0' : '') + m;
  }
  function at(min) { return (Math.floor((min % 1440) / 60) === 1 ? 'a la ' : 'a las ') + fmt(min); }

  function status(now) {
    var today = HOURS[now.day], prev = HOURS[(now.day + 6) % 7];
    // Viernes y sábado pasan de medianoche: a las 0:30 de sábado sigue abierto el horario del viernes.
    if (prev[1] > 1440 && now.min < prev[1] - 1440) return { open: true, until: prev[1] - 1440 };
    if (now.min >= today[0] && now.min < today[1]) return { open: true, until: today[1] };
    if (now.min < today[0]) return { open: false, when: '', at: today[0] };
    return { open: false, when: 'mañana ', at: HOURS[(now.day + 1) % 7][0] };
  }

  try {
    var now = madridNow(), s = status(now);
    var short = s.open
      ? 'Abierto ahora · cierra ' + at(s.until)
      : 'Cerrado · abre ' + s.when + at(s.at);
    document.querySelectorAll('[data-open]').forEach(function (el) {
      el.classList.add(s.open ? 'is-open' : 'is-closed');
      el.querySelector('[data-open-text]').textContent = short;
    });
    document.querySelectorAll('[data-open-line]').forEach(function (el) {
      el.classList.add(s.open ? 'is-open' : 'is-closed');
      el.textContent = short;
    });
    document.querySelectorAll('.hours tr[data-day="' + now.day + '"]').forEach(function (r) {
      r.classList.add('is-today');
      r.querySelector('th').insertAdjacentHTML('beforeend', ' <span class="today-tag">hoy</span>');
    });
  } catch (e) { /* sin Intl: queda el texto por defecto */ }

  /* ---------- Carta desde js/carta.js ---------- */
  var C = window.CARTA || { categorias: [], especiales: [] };

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function euro(n) { return n.toFixed(2).replace('.', ',') + ' €'; }

  function dishNode(cat, d, i) {
    var id = 'p-' + cat.id + '-' + i;
    var li = el('li', 'item');
    var btn = el('button', 'dish-btn');
    btn.type = 'button';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', id);
    btn.appendChild(el('span', 'dish', d.nombre));
    btn.appendChild(el('span', 'price', euro(d.precio)));
    btn.appendChild(el('span', 'chev'));
    var panel = el('div', 'dish-panel');
    panel.id = id;
    panel.hidden = true;
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', 'Ingredientes de ' + d.nombre);

    if (d.ingredientes && d.ingredientes.length) {
      panel.appendChild(el('p', 'dish-panel__lbl', 'Ingredientes'));
      panel.appendChild(el('p', 'dish-panel__txt', d.ingredientes.join(', ') + '.'));
      
    } else {
      panel.appendChild(el('p', 'dish-panel__pend', 'Pregúntanos por los ingredientes.'));
    }
    panel.appendChild(el('p', 'dish-panel__pend',
      d.alergenos && d.alergenos.length ? 'Alérgenos: ' + d.alergenos.join(', ') + '.' : 'Consulta los alérgenos con nuestro personal.'));

    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
    li.appendChild(btn);
    li.appendChild(panel);
    return li;
  }

  var header = document.getElementById('site-header');
  var chips = document.getElementById('chips');
  var menu = document.getElementById('menu');
  var tabs = [], panels = [];

  function select(id, opts) {
    opts = opts || {};
    var found = false;
    tabs.forEach(function (t, i) {
      var on = t.dataset.cat === id;
      if (on) found = true;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
      if (on && opts.focus) t.focus();
      // Centra la pestaña solo dentro de la fila (sin mover la página).
      if (on) chips.scrollTo({ left: t.offsetLeft - (chips.clientWidth - t.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
    });
    if (!found) return;
    if (opts.scroll) {
      // Deja el título de la categoría justo debajo de la barra fija.
      var bar = chips.parentElement.getBoundingClientRect();
      var top = menu.getBoundingClientRect().top;
      if (top < bar.bottom || top > window.innerHeight * 0.6) {
        var navH = header ? header.offsetHeight : 0;
        window.scrollTo({ top: window.pageYOffset + top - navH - bar.height - 12, behavior: reduce ? 'auto' : 'smooth' });
      }
    }
    if (opts.history && window.history && history.replaceState) history.replaceState(null, '', '#' + id);
  }

  if (menu && chips) {
    C.categorias.forEach(function (cat) {
      var tab = el('button', 'tab', cat.titulo);
      tab.type = 'button';
      tab.id = 'tab-' + cat.id;
      tab.dataset.cat = cat.id;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', cat.id);
      tab.setAttribute('aria-selected', 'false');
      tab.tabIndex = -1;
      chips.appendChild(tab);

      var sec = el('section', 'cat');
      sec.id = cat.id;
      sec.setAttribute('role', 'tabpanel');
      sec.setAttribute('aria-labelledby', tab.id);
      sec.hidden = true;
      sec.appendChild(el('h3', null, cat.titulo));
      var ul = el('ul', 'dishes');
      cat.platos.forEach(function (d, i) { ul.appendChild(dishNode(cat, d, i)); });
      sec.appendChild(ul);
      if (cat.incompleta) sec.appendChild(el('p', 'gap', cat.incompleta));
      menu.appendChild(sec);

      tabs.push(tab);
      panels.push(sec);
      tab.addEventListener('click', function () { select(cat.id, { scroll: true, history: true }); });
    });

    chips.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') n = 0;
      else if (e.key === 'End') n = tabs.length - 1;
      if (n === null) return;
      e.preventDefault();
      select(tabs[n].dataset.cat, { focus: true });
    });

    var start = (location.hash || '').slice(1);
    var known = C.categorias.some(function (c) { return c.id === start; });
    select(known ? start : C.categorias[0].id);
    if (known || start === 'carta') {
      // La carta se monta con JS: esperar a que la página termine de cargar para saltar a ella.
      var irACarta = function () {
        var carta = document.getElementById('carta');
        if (!carta) return;
        var ir = function () { carta.scrollIntoView({ behavior: 'instant', block: 'start' }); };
        ir();
        // Fuentes e imágenes pueden mover la página justo después: se corrige un par de veces.
        setTimeout(ir, 250); setTimeout(ir, 800);
      };
      if (document.readyState === 'complete') irACarta(); else window.addEventListener('load', irACarta);
    }
    window.addEventListener('hashchange', function () {
      var h = (location.hash || '').slice(1);
      if (C.categorias.some(function (c) { return c.id === h; })) select(h, { scroll: true });
    });
  }

  var esp = document.getElementById('especial-casa');
  if (esp) {
    C.especiales.forEach(function (e) {
      var box = el('div', 'especial deco' + (e.pendiente ? ' is-pending' : ''));
      if (e.pendiente) {
        box.appendChild(el('p', 'especial__name', 'Pendiente: lo elige el bar'));
        box.appendChild(el('p', 'especial__desc', 'Aquí iría el plato del día o de la semana, con su precio.'));
      } else {
        box.appendChild(el('p', 'especial__name', e.nombre));
        if (e.descripcion) box.appendChild(el('p', 'especial__desc', e.descripcion));
        if (typeof e.precio === 'number') box.appendChild(el('p', 'especial__price', euro(e.precio)));
      }
      esp.appendChild(box);
    });
  }

  /* ---------- Reservar ---------- */
  var dlg = document.getElementById('reservar');
  var wa = document.getElementById('reservar-wa');
  if (wa) {
    wa.href = 'https://wa.me/34600000000?text=' +
      encodeURIComponent('Hola, quería reservar mesa para __ personas el __ a las __');
  }
  document.querySelectorAll('[data-open-reservar]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (dlg && dlg.showModal) dlg.showModal();
      else location.href = 'tel:+34600000000';
    });
  });
  if (dlg) {
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }

  /* ---------- Cabecera fija: fondo al bajar, desplegable móvil y sección activa ---------- */
  var toggle = header && header.querySelector('.nav__toggle');
  var navLinks = header ? header.querySelectorAll('.nav__links a') : [];

  function setOpen(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  function onScroll() { header.classList.toggle('is-solid', window.pageYOffset > 24); }

  if (header && toggle) {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    toggle.addEventListener('click', function () { setOpen(!header.classList.contains('is-open')); });
    navLinks.forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (header.classList.contains('is-open') && !header.contains(e.target)) setOpen(false);
    });
    // Si se ensancha la ventana con el menú abierto, se cierra.
    var mq = window.matchMedia('(min-width: 900px)');
    var onMq = function () { if (mq.matches) setOpen(false); };
    if (mq.addEventListener) mq.addEventListener('change', onMq);
  }

  var ids = ['inicio', 'horario', 'especiales', 'carta', 'donde'];
  var sections = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'location');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (sec) { spy.observe(sec); });
  }
})();
