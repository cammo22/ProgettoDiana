/* ─────────────────────────────────────────────
   Progetto Diana — interazioni
   stato dello studio, macchina da scrivere, polvere d'oro e perle,
   trattamenti con ricerca e scheda, quiz del rituale,
   respiro guidato, modulo di prenotazione
   I dati (contatti, orari, trattamenti) sono in js/dati.js
   ───────────────────────────────────────────── */
'use strict';

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const GIORNI = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  const GG = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

  /* ── caricamento ── */
  const loader = $('#loader');
  const nascondiLoader = () => loader && loader.classList.add('off');
  addEventListener('load', () => setTimeout(nascondiLoader, 250));
  setTimeout(nascondiLoader, 2200);

  /* ── toast ── */
  const toast = $('#toast');
  let toastT;
  function avviso(msg) {
    toast.textContent = msg;
    toast.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('on'), 3200);
  }

  /* ── contatti dal CONFIG ── */
  const ora = s => s.replace(/^0/, '');
  function orariCompatti() {
    const ordine = [1, 2, 3, 4, 5, 6, 0];
    const gruppi = [];
    ordine.forEach(g => {
      const h = CONFIG.orari[g];
      const chiave = h ? h.join('-') : 'chiuso';
      const ultimo = gruppi[gruppi.length - 1];
      if (ultimo && ultimo.chiave === chiave) ultimo.a = g;
      else gruppi.push({ chiave, da: g, a: g, h });
    });
    return gruppi.map(x => {
      const giorni = x.da === x.a ? GG[x.da] : `${GG[x.da]}–${GG[x.a]}`;
      return `${giorni} ${x.h ? `${ora(x.h[0])}–${ora(x.h[1])}` : 'chiuso'}`;
    });
  }

  function contatti() {
    const tel = CONFIG.telefono.replace(/[^\d+]/g, '');
    const set = (k, testo, href, nuovo) => $$(`[data-cfg="${k}"]`).forEach(a => {
      a.textContent = testo;
      a.href = href;
      if (nuovo) { a.target = '_blank'; a.rel = 'noopener'; }
    });
    const dove = `${CONFIG.indirizzo} · ${CONFIG.citta}`;
    set('indirizzo', dove, CONFIG.mappa || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${CONFIG.indirizzo}, ${CONFIG.citta}`)}`, true);
    set('telefono', CONFIG.telefono, `tel:${tel}`);
    set('email', CONFIG.email, `mailto:${CONFIG.email}`);
    $('#orari').textContent = orariCompatti().join(' · ');

    const icone = { instagram: 'fa-instagram', facebook: 'fa-facebook-f', tiktok: 'fa-tiktok' };
    const social = Object.entries(CONFIG.social || {}).filter(([, url]) => url);
    if (social.length) {
      const box = $('#social');
      box.innerHTML = social.map(([k, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener" aria-label="${esc(k)}"><i class="fab ${icone[k] || 'fa-link'}"></i></a>`).join('');
      box.hidden = false;
    }
  }

  /* ── aperto ora? (ora di Roma) ── */
  function adessoARoma() {
    try {
      const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
      const v = t => p.find(x => x.type === t).value;
      return { g: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(v('weekday')), m: +v('hour') * 60 + +v('minute') };
    } catch (e) {
      const d = new Date();
      return { g: d.getDay(), m: d.getHours() * 60 + d.getMinutes() };
    }
  }
  const minuti = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };

  function statoStudio() {
    const { g, m } = adessoARoma();
    const oggi = CONFIG.orari[g];
    let aperto = false, dettaglio = '';
    if (oggi && m >= minuti(oggi[0]) && m < minuti(oggi[1])) {
      aperto = true;
      dettaglio = `chiudiamo alle ${ora(oggi[1])}`;
    } else if (oggi && m < minuti(oggi[0])) {
      dettaglio = `riapriamo oggi alle ${ora(oggi[0])}`;
    } else {
      for (let i = 1; i <= 7; i++) {
        const h = CONFIG.orari[(g + i) % 7];
        if (h) { dettaglio = `riapriamo ${i === 1 ? 'domani' : GIORNI[(g + i) % 7]} alle ${ora(h[0])}`; break; }
      }
    }
    $('#stato-titolo').textContent = aperto ? 'Studio aperto ora' : 'Studio chiuso ora';
    $('#stato-dettaglio').textContent = aperto ? `${dettaglio} · scrivici` : `${dettaglio} · prenota online`;
    $('#stato-led').classList.toggle('off', !aperto);
    const badge = $('#stato-badge');
    badge.textContent = aperto ? 'aperto ora' : 'chiuso ora';
    badge.className = `badge-open ${aperto ? 'on' : 'off'}`;
  }

  /* ── consiglio del giorno ── */
  function consiglio() {
    const d = new Date();
    const giorno = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 864e5);
    $('#consiglio').textContent = CONSIGLI[giorno % CONSIGLI.length];
  }

  /* ── macchina da scrivere ── */
  function macchinaDaScrivere() {
    const el = $('#tw');
    const frasi = ['di me', 'della mia pelle', 'del mio sorriso', 'del mio corpo', 'del mio respiro', 'del mio tempo'];
    if (RM) return;
    let f = 0, c = frasi[0].length, cancella = true;
    const tick = () => {
      if (cancella) {
        c--;
        el.textContent = frasi[f].slice(0, c);
        if (c > 0) return setTimeout(tick, 38);
        cancella = false;
        f = (f + 1) % frasi.length;
        return setTimeout(tick, 320);
      }
      c++;
      el.textContent = frasi[f].slice(0, c);
      if (c < frasi[f].length) return setTimeout(tick, 70);
      cancella = true;
      setTimeout(tick, 2300);
    };
    setTimeout(tick, 2600);
  }

  /* ── polvere d'oro e perle ── */
  const scintille = [];
  function cielo() {
    const cv = $('#stelle');
    const ctx = cv.getContext('2d');
    let W, H, dpr, polvere = [], perle = [], raf, t = 0;
    const r = (a, b) => a + Math.random() * (b - a);

    function crea() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.min(140, Math.round(W * H / 9000));
      polvere = Array.from({ length: n }, () => ({
        x: r(0, W), y: r(0, H), s: r(.5, 1.8), v: r(.05, .28), f: r(0, 6.28), w: r(.6, 2.2),
        c: Math.random() < .7 ? '248,227,174' : '226,211,251',
      }));
      perle = Array.from({ length: W < 700 ? 7 : 13 }, () => nuovaPerla(true));
    }
    function nuovaPerla(ovunque) {
      return { x: r(0, W), y: ovunque ? r(0, H) : H + 40, r: r(6, 22), v: r(.15, .45), f: r(0, 6.28) };
    }
    function perla(p) {
      const g = ctx.createRadialGradient(p.x - p.r * .35, p.y - p.r * .35, p.r * .1, p.x, p.y, p.r);
      g.addColorStop(0, 'rgba(255,255,255,.5)');
      g.addColorStop(.4, 'rgba(226,211,251,.16)');
      g.addColorStop(1, 'rgba(232,192,116,.06)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      ctx.strokeStyle = 'rgba(248,227,174,.28)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.55)';
      ctx.beginPath(); ctx.ellipse(p.x - p.r * .38, p.y - p.r * .42, p.r * .26, p.r * .14, -.6, 0, 6.283); ctx.fill();
    }
    function disegna() {
      t += 1;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of polvere) {
        p.y -= p.v; p.x += Math.sin((t + p.f * 100) / 160) * .15;
        if (p.y < -5) { p.y = H + 5; p.x = r(0, W); }
        const a = .25 + .55 * (.5 + .5 * Math.sin(t / 40 * p.w + p.f));
        ctx.fillStyle = `rgba(${p.c},${a})`;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.fill();
      }
      for (let i = scintille.length - 1; i >= 0; i--) {
        const s = scintille[i];
        s.x += s.vx; s.y += s.vy; s.vy += .02; s.vita -= 1;
        if (s.vita <= 0) { scintille.splice(i, 1); continue; }
        const a = s.vita / s.max;
        ctx.fillStyle = `rgba(${s.c},${a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.s * (0.6 + a * .6), 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      for (let i = 0; i < perle.length; i++) {
        const p = perle[i];
        p.y -= p.v; p.x += Math.sin((t + p.f * 200) / 120) * .3;
        if (p.y < -40) perle[i] = nuovaPerla(false);
        perla(p);
      }
      raf = requestAnimationFrame(disegna);
    }
    crea();
    if (RM) {
      // una sola immagine ferma, niente movimento
      ctx.globalCompositeOperation = 'lighter';
      polvere.forEach(p => { ctx.fillStyle = `rgba(${p.c},.5)`; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.fill(); });
      ctx.globalCompositeOperation = 'source-over';
      perle.forEach(perla);
      return;
    }
    disegna();
    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(crea, 200); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(disegna);
    });

    // una scia leggera di polvere dorata sopra la hero
    let ultimo = 0;
    $('.hero').addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || e.timeStamp - ultimo < 40) return;
      ultimo = e.timeStamp;
      spruzzo(e.clientX, e.clientY, 2, 1.2);
    });
  }
  function spruzzo(x, y, n = 30, forza = 3) {
    if (RM) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283, v = Math.random() * forza;
      const max = 40 + Math.random() * 50;
      scintille.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - forza * .3, s: .8 + Math.random() * 1.8, vita: max, max, c: Math.random() < .65 ? '248,227,174' : '226,211,251' });
    }
  }

  /* ── nav, avanzamento, torna su ── */
  function navigazione() {
    const nav = $('#nav'), menu = $('#menu'), links = $('#links'), prog = $('#progress'), su = $('#su');
    const chiudi = () => { links.classList.remove('open'); menu.classList.remove('on'); menu.setAttribute('aria-expanded', 'false'); };
    menu.addEventListener('click', e => {
      e.stopPropagation();
      const on = links.classList.toggle('open');
      menu.classList.toggle('on', on);
      menu.setAttribute('aria-expanded', String(on));
    });
    links.addEventListener('click', e => { if (e.target.closest('a')) chiudi(); });
    document.addEventListener('click', e => { if (!e.target.closest('#nav')) chiudi(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') chiudi(); });

    let tick = false;
    const aggiorna = () => {
      const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
      nav.classList.toggle('scrolled', y > 30);
      prog.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
      su.classList.toggle('on', y > 900);
      tick = false;
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(aggiorna); } }, { passive: true });
    aggiorna();
    su.addEventListener('click', () => scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }));

    // voce attiva nel menu
    const voci = $$('#links a[href^="#"]:not(.pearl)');
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        voci.forEach(a => a.classList.toggle('act', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    voci.forEach(a => { const s = $(a.getAttribute('href')); if (s) io.observe(s); });
  }

  /* ── comparsa allo scorrimento + contatori ── */
  function comparse() {
    const els = $$('.rv');
    // la cascata vale solo fra gli elementi che entrano in vista insieme
    const io = new IntersectionObserver(entries => {
      entries.filter(en => en.isIntersecting).forEach((en, k) => {
        en.target.style.setProperty('--d', Math.min(k * .07, .35) + 's');
        en.target.classList.add('in');
        io.unobserve(en.target);
        if (en.target.classList.contains('stats')) contatori(en.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));

    const passi = $('#steps');
    new IntersectionObserver((en, o) => { if (en[0].isIntersecting) { passi.classList.add('on'); o.disconnect(); } }, { threshold: .3 }).observe(passi);
  }
  function contatori(box) {
    $$('[data-count]', box).forEach(el => {
      const v = el.dataset.count === 'auto-trattamenti' ? TRATTAMENTI.length : +el.dataset.count;
      const suf = el.dataset.suffix || '';
      if (RM) { el.textContent = v + suf; return; }
      const t0 = performance.now(), dur = 1500;
      const step = now => {
        const k = Math.min((now - t0) / dur, 1);
        el.textContent = Math.round(v * (1 - Math.pow(1 - k, 3))) + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ── nastro dei trattamenti ── */
  function nastro() {
    const nomi = TRATTAMENTI.map(t => t.titolo.split(' — ')[0]);
    const html = nomi.map(n => `<span>${esc(n)}</span>`).join('');
    $('#ticker').innerHTML = html + html;
  }

  /* ── trattamenti: schede, filtri, ricerca ── */
  const stato = { cat: 'tutti', q: '' };
  function trattamenti() {
    const tabs = $('#tabs'), griglia = $('#griglia'), cerca = $('#cerca'), vuoto = $('#vuoto');
    const conta = c => TRATTAMENTI.filter(t => c === 'tutti' || t.cat === c).length;
    const voci = [['tutti', { nome: 'Tutti', icona: 'fa-star' }], ...Object.entries(CATEGORIE)];
    tabs.innerHTML = voci.map(([k, c]) =>
      `<button type="button" role="tab" class="tab" data-cat="${k}" aria-selected="${k === 'tutti'}" aria-controls="griglia"><i class="fas ${c.icona}"></i>${esc(c.nome)} <em>${conta(k)}</em></button>`
    ).join('');

    const testo = TRATTAMENTI.map(t => norm([t.titolo, t.sotto, t.nota, ...t.punti, CATEGORIE[t.cat].nome].join(' ')));

    function disegna() {
      const q = norm(stato.q.trim());
      const lista = TRATTAMENTI
        .map((t, i) => ({ t, i }))
        .filter(({ t, i }) => (stato.cat === 'tutti' || t.cat === stato.cat) && (!q || q.split(/\s+/).every(p => testo[i].includes(p))));
      griglia.innerHTML = lista.map(({ t, i }, k) => {
        const tono = CATEGORIE[t.cat].tono;
        return `<article class="card glass" data-i="${i}" style="--d:${Math.min(k * .04, .5)}s">
  <div class="card-img"><img src="immagini/web/${t.img}.webp" alt="" width="800" height="800" loading="lazy" decoding="async"><span class="note">${esc(t.nota)}</span></div>
  <div class="card-ico"><span class="ico sm i-${tono}"><i class="fas ${t.icona}"></i></span></div>
  <div class="card-body">
    <h3><button type="button" class="card-link" data-i="${i}">${esc(t.titolo)}</button></h3>
    <p>${esc(t.sotto)}</p>
    <div class="card-foot"><span class="cat">${esc(CATEGORIE[t.cat].nome)}</span><span class="more">Scopri <i class="fas fa-arrow-right"></i></span></div>
  </div>
</article>`;
      }).join('');
      vuoto.hidden = lista.length > 0;
    }

    tabs.addEventListener('click', e => {
      const b = e.target.closest('.tab');
      if (!b) return;
      scegliCategoria(b.dataset.cat);
    });
    tabs.addEventListener('keydown', e => {
      if (!['ArrowRight', 'ArrowLeft'].includes(e.key)) return;
      const bs = $$('.tab', tabs), i = bs.indexOf(document.activeElement);
      if (i < 0) return;
      const n = bs[(i + (e.key === 'ArrowRight' ? 1 : bs.length - 1)) % bs.length];
      n.focus(); scegliCategoria(n.dataset.cat);
    });
    function scegliCategoria(c) {
      stato.cat = c;
      $$('.tab', tabs).forEach(t => t.setAttribute('aria-selected', String(t.dataset.cat === c)));
      disegna();
    }
    let qt;
    cerca.addEventListener('input', () => {
      clearTimeout(qt);
      qt = setTimeout(() => {
        stato.q = cerca.value;
        if (stato.q && stato.cat !== 'tutti') scegliCategoria('tutti'); else disegna();
      }, 120);
    });
    $('#azzera').addEventListener('click', () => { cerca.value = ''; stato.q = ''; scegliCategoria('tutti'); cerca.focus(); });

    griglia.addEventListener('click', e => {
      const c = e.target.closest('.card');
      if (c) apriScheda(+c.dataset.i);
    });
    griglia.addEventListener('pointermove', e => {
      const c = e.target.closest('.card');
      if (!c) return;
      const b = c.getBoundingClientRect();
      c.style.setProperty('--mx', `${e.clientX - b.left}px`);
      c.style.setProperty('--my', `${e.clientY - b.top}px`);
    });

    // link del footer che aprono una categoria
    $$('[data-vai-cat]').forEach(a => a.addEventListener('click', () => { cerca.value = ''; stato.q = ''; scegliCategoria(a.dataset.vaiCat); }));

    disegna();
  }

  /* ── scheda trattamento ── */
  let schedaAperta = -1;
  function apriScheda(i) {
    const t = TRATTAMENTI[i], d = $('#scheda');
    schedaAperta = i;
    $('#scheda-img').src = `immagini/web/${t.img}.webp`;
    $('#scheda-img').alt = t.titolo;
    $('#scheda-cat').textContent = `// ${CATEGORIE[t.cat].nome.toLowerCase()}`;
    $('#scheda-titolo').textContent = t.titolo;
    $('#scheda-sotto').textContent = t.sotto;
    $('#scheda-punti').innerHTML = t.punti.map(p => `<li>${esc(p)}</li>`).join('');
    $('#scheda-nota').textContent = t.nota;
    if (d.showModal) d.showModal(); else d.setAttribute('open', '');
    document.body.classList.add('lock');
  }
  function schedaTratt() {
    const d = $('#scheda');
    const chiudi = () => { if (d.close) d.close(); else { d.removeAttribute('open'); document.body.classList.remove('lock'); } };
    d.addEventListener('close', () => document.body.classList.remove('lock'));
    $('#scheda-chiudi').addEventListener('click', chiudi);
    d.addEventListener('click', e => { if (e.target === d) chiudi(); });
    $('#scheda-prenota').addEventListener('click', e => {
      e.preventDefault();
      chiudi();
      prenotaPer(TRATTAMENTI[schedaAperta].titolo);
    });
  }

  function prenotaPer(titolo, nota) {
    const sel = $('#scelta');
    sel.value = titolo;
    sel.classList.remove('bad');
    const msg = $('#modulo textarea');
    if (nota && !msg.value.trim()) msg.value = nota;
    $('#prenota').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
    setTimeout(() => $('#modulo input[name="nome"]').focus({ preventScroll: true }), RM ? 0 : 700);
    avviso(`✦ ${titolo}: scelto. Manca solo il tuo nome.`);
  }

  /* ── quiz: trova il tuo rituale ── */
  function quiz() {
    const box = $('#quiz'), passi = $$('.q-step', box), esito = $('#quiz-esito'), indietro = $('#quiz-indietro');
    const ZONE = { viso: 'il viso', sguardo: 'sguardo e labbra', corpo: 'il corpo', mente: 'la mente' };
    const VOGLIE = { luce: 'Luce', giovinezza: 'Freschezza', forma: 'Definizione', leggerezza: 'Leggerezza', calma: 'Calma' };
    const chiavi = ['zona', 'voglia', 'tempo'];
    const r = {};
    let passo = 0, scelte = [];

    function mostra(n) {
      passo = n;
      passi.forEach((p, i) => p.classList.toggle('active', i === n));
      esito.hidden = n < 3;
      indietro.hidden = n === 0 || n === 3;
      $('#quiz-passo').textContent = n < 3 ? `domanda ${n + 1} di 3` : 'il tuo rituale';
      $('#quiz-prog').style.width = `${Math.min(n + 1, 3) / 3 * 100}%`;
    }
    function risultato() {
      scelte = TRATTAMENTI
        .map((t, i) => ({ i, s: (t.zone.includes(r.zona) ? 3 : 0) + (t.voglia.includes(r.voglia) ? 2 : 0) + (t.tempo === r.tempo ? 1 : 0) }))
        .filter(x => x.s >= 3)
        .sort((a, b) => b.s - a.s || a.i - b.i)
        .slice(0, 3)
        .map(x => x.i);
      $('#quiz-titolo').innerHTML = `${VOGLIE[r.voglia]} per <em>${ZONE[r.zona]}</em>`;
      $('#quiz-scelte').innerHTML = scelte.map((i, k) => {
        const t = TRATTAMENTI[i];
        return `<button type="button" class="pick" data-i="${i}" style="--d:${k * .1}s"><img src="immagini/web/${t.img}.webp" alt="" width="62" height="62" loading="lazy"><span><b>${esc(t.titolo)}</b><small>${esc(t.sotto)} · ${esc(t.nota)}</small></span><span class="rank">0${k + 1}</span></button>`;
      }).join('');
      mostra(3);
      const b = box.getBoundingClientRect();
      spruzzo(b.left + b.width / 2, b.top + 80, 50, 3.2);
    }

    box.addEventListener('click', e => {
      const o = e.target.closest('.q-opts button');
      if (o) {
        const step = +o.closest('.q-step').dataset.step;
        $$('button', o.parentElement).forEach(b => b.classList.toggle('sel', b === o));
        r[chiavi[step]] = o.dataset.v;
        setTimeout(() => (step < 2 ? mostra(step + 1) : risultato()), RM ? 0 : 260);
        return;
      }
      const p = e.target.closest('.pick');
      if (p) apriScheda(+p.dataset.i);
    });
    indietro.addEventListener('click', () => mostra(Math.max(0, passo - 1)));
    $('#quiz-ricomincia').addEventListener('click', () => {
      $$('.q-opts button.sel', box).forEach(b => b.classList.remove('sel'));
      mostra(0);
    });
    $('#quiz-prenota').addEventListener('click', e => {
      e.preventDefault();
      if (!scelte.length) return;
      const nomi = scelte.map(i => TRATTAMENTI[i].titolo);
      prenotaPer(nomi[0], `Ho fatto il quiz del rituale (${VOGLIE[r.voglia].toLowerCase()} per ${ZONE[r.zona]}): mi interessano ${nomi.join(', ')}.`);
    });
    mostra(0);
  }

  /* ── respiro guidato ── */
  function respiro() {
    const orb = $('#orb'), fase = $('#fase'), sec = $('#fase-sec'), cicli = $('#cicli'), btn = $('#respira-btn');
    let ritmo = [4, 4, 6, 0], timer = [], attivo = false, fine = 0, respiri = 0, orologio;
    const DURATA = 60;
    orb.classList.add('idle');

    $('#ritmi').addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      $$('#ritmi button').forEach(x => x.setAttribute('aria-checked', String(x === b)));
      ritmo = b.dataset.ritmo.split(',').map(Number);
      if (attivo) { ferma(true); avvia(); }
    });

    const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    function scala(v, s) {
      orb.style.setProperty('--dur', `${s}s`);
      orb.style.transform = `scale(${v})`;
    }
    function fasi() {
      const [i, t, e, p] = ritmo;
      return [['Inspira', i, 1, 'dal naso, piano'], ['Trattieni', t, 1, 'senza sforzo'], ['Espira', e, .45, 'lascia andare'], ['Pausa', p, .45, 'tutto tranquillo']].filter(f => f[1] > 0);
    }
    function ciclo() {
      if (!attivo) return;
      if (Date.now() >= fine) return completa();
      let t = 0;
      fasi().forEach(([nome, s, v, hint]) => {
        timer.push(setTimeout(() => {
          fase.textContent = nome;
          scala(v, s);
          let rimasti = s;
          sec.textContent = `${hint} · ${rimasti}`;
          const iv = setInterval(() => { rimasti--; if (rimasti > 0) sec.textContent = `${hint} · ${rimasti}`; else clearInterval(iv); }, 1000);
          timer.push(iv);
        }, t * 1000));
        t += s;
      });
      timer.push(setTimeout(() => { respiri++; ciclo(); }, t * 1000));
    }
    function avvia() {
      attivo = true; respiri = 0; fine = Date.now() + DURATA * 1000;
      orb.classList.remove('idle');
      scala(.45, .01);
      btn.innerHTML = '<i class="fas fa-stop"></i> Ferma';
      orologio = setInterval(() => {
        const s = Math.max(0, Math.ceil((fine - Date.now()) / 1000));
        cicli.textContent = `${respiri} respiri · ${mmss(s)}`;
      }, 250);
      timer.push(setTimeout(ciclo, 60));
    }
    function ferma(silenzioso) {
      attivo = false;
      timer.forEach(t => { clearTimeout(t); clearInterval(t); });
      timer = [];
      clearInterval(orologio);
      scala(.45, 1.2);
      setTimeout(() => { if (!attivo) { orb.style.transform = ''; orb.classList.add('idle'); } }, 1300);
      btn.innerHTML = '<i class="fas fa-play"></i> Inizia';
      if (!silenzioso) { fase.textContent = 'Quando vuoi tu'; sec.textContent = 'premi inizia'; cicli.textContent = '0 respiri · 1:00'; }
    }
    function completa() {
      const n = respiri;
      ferma(true);
      fase.textContent = 'Fatto. Come ti senti?';
      sec.textContent = `${n} respiri lenti, solo per te`;
      cicli.textContent = `${n} respiri · 0:00`;
      const b = orb.getBoundingClientRect();
      spruzzo(b.left + b.width / 2, b.top + b.height / 2, 70, 3.5);
      avviso('✦ Un minuto tutto per te. Ben fatto.');
    }
    btn.addEventListener('click', () => (attivo ? ferma() : avvia()));
    window.avviaRespiro = () => { if (!attivo) avvia(); };

    $$('[data-respira-subito]').forEach(a => a.addEventListener('click', () => setTimeout(() => window.avviaRespiro(), RM ? 0 : 900)));
  }

  /* ── risultati: filtri ── */
  function filtri() {
    const box = $('#filtri');
    box.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      $$('button', box).forEach(x => x.classList.toggle('on', x === b));
      const f = b.dataset.f;
      $$('.res').forEach(r => r.classList.toggle('off', f !== 'tutti' && !r.dataset.tags.split(' ').includes(f)));
    });
  }

  /* ── prenotazione ── */
  function modulo() {
    const form = $('#modulo'), sel = $('#scelta'), err = $('#errore'), fatto = $('#fatto');
    sel.innerHTML = '<option value="">Scegli un trattamento</option>'
      + '<optgroup label="Non so ancora"><option>Consulenza gratuita: consigliatemi voi</option></optgroup>'
      + Object.entries(CATEGORIE).map(([k, c]) =>
        `<optgroup label="${esc(c.nome)}">${TRATTAMENTI.filter(t => t.cat === k).map(t => `<option>${esc(t.titolo)}</option>`).join('')}</optgroup>`
      ).join('');

    form.addEventListener('input', e => e.target.classList.remove('bad'));

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const d = new FormData(form);
      const nome = (d.get('nome') || '').trim(), tel = (d.get('telefono') || '').trim(), email = (d.get('email') || '').trim();
      const tratt = d.get('trattamento'), quando = d.getAll('quando'), msg = (d.get('messaggio') || '').trim();
      const problemi = [];
      if (!nome) problemi.push(['nome', 'il tuo nome']);
      if (tel.replace(/\D/g, '').length < 6) problemi.push(['telefono', 'un numero di telefono valido']);
      if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) problemi.push(['email', "un'email valida (o lasciala vuota)"]);
      if (!tratt) problemi.push(['trattamento', 'il trattamento che ti interessa']);
      if (!d.get('privacy')) problemi.push(['privacy', 'il consenso al trattamento dei dati']);
      $$('.bad', form).forEach(x => x.classList.remove('bad'));
      if (problemi.length) {
        problemi.forEach(([n]) => form.elements[n].classList.add('bad'));
        err.textContent = `Manca ${problemi.map(p => p[1]).join(', ')}.`;
        err.hidden = false;
        form.elements[problemi[0][0]].focus();
        return;
      }
      err.hidden = true;

      const testo = [
        `Ciao ${CONFIG.nome}! Sono ${nome}.`,
        `Vorrei una consulenza per: ${tratt}.`,
        quando.length ? `Preferisco: ${quando.join(', ')}.` : '',
        `Telefono: ${tel}${email ? ` · Email: ${email}` : ''}`,
        msg,
      ].filter(Boolean).join('\n');

      const btn = $('button[type="submit"]', form), b = btn.getBoundingClientRect();
      let inviato = false;
      if (CONFIG.formspree) {
        btn.disabled = true;
        try {
          const res = await fetch(`https://formspree.io/f/${CONFIG.formspree}`, {
            method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, telefono: tel, email, trattamento: tratt, quando: quando.join(', '), messaggio: msg }),
          });
          inviato = res.ok;
        } catch (x) { inviato = false; }
        btn.disabled = false;
      }

      $('#invia-wa').href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(testo)}`;
      $('#invia-mail').href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(`Richiesta consulenza — ${tratt}`)}&body=${encodeURIComponent(testo)}`;
      $('#fatto-titolo').textContent = inviato ? 'Richiesta inviata!' : 'Ci siamo quasi!';
      $('#fatto-testo').textContent = inviato
        ? `Grazie ${nome}, ti contattiamo entro 24 ore per fissare la consulenza.`
        : `Grazie ${nome}! Il messaggio è pronto: scegli come inviarcelo e ti rispondiamo entro 24 ore.`;
      $('#fatto-azioni').hidden = inviato;
      form.hidden = true;
      fatto.hidden = false;
      spruzzo(b.left + b.width / 2, b.top, 60, 3.4);
    });

    $('#nuova').addEventListener('click', () => { form.reset(); fatto.hidden = true; form.hidden = false; });
  }

  /* ── video nello specchio: si ferma quando non si vede ── */
  function specchio() {
    const v = $('#mirror-video');
    if (!v) return;
    if (RM) { v.removeAttribute('autoplay'); v.pause(); return; }
    new IntersectionObserver(en => {
      if (en[0].isIntersecting) v.play().catch(() => {}); else v.pause();
    }).observe(v);
  }

  /* ── sorpresa: scrivi "luna" ── */
  function sorpresa() {
    let buf = '';
    addEventListener('keydown', e => {
      if (e.target.closest('input, textarea, select') || e.key.length !== 1) return;
      buf = (buf + e.key.toLowerCase()).slice(-4);
      if (buf === 'luna') {
        for (let i = 0; i < 6; i++) setTimeout(() => spruzzo(Math.random() * innerWidth, Math.random() * innerHeight * .7, 40, 3.6), i * 160);
        avviso('🌙 Diana ti ha vista. Oggi brilli.');
      }
    });
  }

  /* ── avvio ── */
  document.addEventListener('DOMContentLoaded', () => {
    $('#anno').textContent = new Date().getFullYear();
    contatti();
    statoStudio();
    setInterval(statoStudio, 60000);
    consiglio();
    nastro();
    trattamenti();
    schedaTratt();
    quiz();
    respiro();
    filtri();
    modulo();
    navigazione();
    comparse();
    cielo();
    macchinaDaScrivere();
    specchio();
    sorpresa();
    console.log('%c✦ Progetto Diana %c sito fatto a mano da DaProd — cammo22.github.io/Portfolio', 'background:#e8c074;color:#2b1a06;padding:4px 8px;border-radius:6px 0 0 6px;font-weight:700', 'background:#1c1227;color:#e2d3fb;padding:4px 8px;border-radius:0 6px 6px 0');
  });
})();
