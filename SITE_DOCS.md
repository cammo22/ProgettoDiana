# Documentazione Tecnica — Progetto Diana

> Questo file è la fonte unica di verità per chiunque voglia modificare il sito.
> Ogni sezione indica esattamente **dove** trovare il codice e **come** intervenire.

---

## Indice

1. [Struttura dei File](#1-struttura-dei-file)
2. [Identità Visiva — Colori e Font](#2-identità-visiva--colori-e-font)
3. [Informazioni da Aggiornare](#3-informazioni-da-aggiornare)
4. [Mappa delle Sezioni HTML](#4-mappa-delle-sezioni-html)
5. [Come Modificare i Contenuti](#5-come-modificare-i-contenuti)
6. [Come Modificare i CSS](#6-come-modificare-i-css)
7. [JavaScript — Funzioni Interattive](#7-javascript--funzioni-interattive)
8. [Come Aggiungere Foto Prima/Dopo](#8-come-aggiungere-foto-primadopo)
9. [Come Integrare il Form](#9-come-integrare-il-form)
10. [Deploy su GitHub Pages](#10-deploy-su-github-pages)

---

## 1. Struttura dei File

```
ProgettoDiana/
│
├── index.html        ← Tutto il sito (HTML + CSS + JS in un unico file)
├── logo.jpg          ← Logo ufficiale (usato: navbar, loader, about, footer)
├── logo-loop.mp4     ← Video per lo sfondo della hero section
│
├── README.md         ← Presentazione pubblica del progetto su GitHub
└── SITE_DOCS.md      ← Questo file — documentazione tecnica
```

> **Nota:** Il sito è un singolo file `index.html`. CSS e JavaScript sono incorporati tramite `<style>` e `<script>` alla fine del file. Non esiste un processo di build.

---

## 2. Identità Visiva — Colori e Font

### Variabili CSS (righe 11–23 di `index.html`)

Tutte le variabili colore sono centralizzate in `:root`. Per cambiare un colore su tutto il sito, basta modificare qui:

```css
:root {
  --gold:          #C9A052;   /* Oro principale — CTA, accenti, frecce */
  --gold-light:    #E8D5A3;   /* Oro chiaro — gradienti, testo su scuro */
  --gold-dark:     #9A7430;   /* Oro scuro — sfondo bottoni hover */
  --purple:        #9B7FBD;   /* Lilla — subtitle nav, icone, section-line */
  --purple-light:  #D4C5E8;   /* Lilla chiaro — avatar, gradienti card */
  --purple-dark:   #6B4F8D;   /* Lilla scuro — (riservato) */
  --dark:          #1C1C1C;   /* Quasi nero — testo, navbar, hero bg */
  --gray:          #6B6B6B;   /* Grigio — testi secondari, descrizioni */
  --light:         #F8F5F0;   /* Grigio chiarissimo — bordi, separatori */
  --white:         #FFFFFF;   /* Bianco puro */
  --cream:         #FAF7F2;   /* Sfondo principale pagina */
}
```

### Font (riga 9 di `index.html`)

| Font | Uso | Peso |
|---|---|---|
| **Playfair Display** | Tutti gli `h1–h5`, numeri statistiche, corsivo hero | 400, 600, 700 |
| **Inter** | Tutto il corpo testo, bottoni, label form | 300, 400, 500, 600 |

Per cambiare font: modifica il link Google Fonts alla riga 9 e aggiorna `font-family` nei CSS corrispondenti.

---

## 3. Informazioni da Aggiornare

Questi sono i placeholder da sostituire con i dati reali del centro:

### Contatti (sezione `#prenota`, righe ~1386–1410)

| Campo | Valore attuale | Dove nel codice |
|---|---|---|
| Indirizzo | `Via della Bellezza, 12 — Milano` | `<p>Via della Bellezza, 12<br>Milano...` |
| Telefono | `+39 000 000 0000` | `<a href="tel:+39000000000">` |
| Email | `info@progettodiana.it` | `<a href="mailto:info@progettodiana.it">` |
| Orari | Lun–Ven 9–20, Sab 9–18 | Tag `<p>` sotto `.contact-icon 🕐` |
| Instagram | `href="#"` | `<a class="social-link" href="#">📸` |
| Facebook | `href="#"` | `<a class="social-link" href="#">📘` |
| TikTok | `href="#"` | `<a class="social-link" href="#">🎵` |
| WhatsApp | `href="#"` | `<a class="social-link" href="#">💬` |

### Team (sezione `#team`, righe ~1337–1373)

Ogni card del team ha questa struttura da modificare:

```html
<div class="team-card fade-in">
  <div class="team-photo"><span>👩‍⚕️</span></div>   ← emoji o <img>
  <h3>Dott.ssa Diana R.</h3>                        ← Nome
  <div class="role">Medico Estetico — Direttrice</div> ← Ruolo
  <p>Descrizione professionale...</p>               ← Bio
  <div class="team-specialties">
    <span class="specialty-tag">Filler</span>        ← Tag specialità
  </div>
</div>
```

Per aggiungere una foto reale, sostituire `<div class="team-photo"><span>👩‍⚕️</span></div>` con:
```html
<div class="team-photo" style="background:none;">
  <img src="team-nome.jpg" alt="Nome" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">
</div>
```

### Statistiche (sezione `#stats`, righe ~721–734)

I numeri sono animati via `data-count`. Per cambiarli:

```html
<div class="stat-num" data-count="2500">0</div>   ← cambia 2500
<div class="stat-num" data-count="30">0</div>     ← cambia 30
<div class="stat-num" data-count="98">0</div>     ← cambia 98 (% aggiunto auto)
<div class="stat-num" data-count="10">0</div>     ← cambia 10
```

Il suffisso `+` o `%` è gestito in JavaScript (funzione `animateCounter`, riga ~1616). Il valore `98` usa `%`, tutti gli altri usano `+`.

### Testimonianze (sezione `#testimonianze`, righe ~1244–1272)

Struttura di ogni recensione:
```html
<div class="review-card fade-in">
  <div class="review-stars">★★★★★</div>          ← stelle (1–5)
  <p class="review-text">Testo della recensione...</p>
  <div class="review-author">
    <div class="author-avatar">S</div>            ← iniziale nome
    <div class="author-info">
      <h4>Sara M.</h4>                            ← nome cliente
      <span>Filler Labbra · Milano</span>         ← trattamento e città
    </div>
  </div>
</div>
```

---

## 4. Mappa delle Sezioni HTML

```
index.html
│
├── <head>  (righe 1–9)       Meta, title, Google Fonts
├── <style> (righe 10–489)    TUTTO il CSS
├── <body>  (righe 491–fine)
│   │
│   ├── #loader          (riga 494)    Schermata di caricamento con logo
│   ├── .mobile-menu     (riga 499)    Menu mobile a schermo intero
│   ├── <nav>            (riga 509)    Barra di navigazione fissa
│   │
│   ├── #hero            (riga 532)    Video hero + titolo + CTA
│   ├── #about           (riga 563)    Chi siamo + valori
│   ├── #stats           (riga 616)    Contatori animati (div, non section)
│   ├── #servizi         (riga 634)    Tab con tutte le schede servizi
│   │   ├── #tab-medicina            Medicina Estetica (8 card)
│   │   ├── #tab-laser               Laser & Tecnologie (7 card)
│   │   ├── #tab-estetica            Centro Estetico (5 card)
│   │   └── #tab-corpo               Corpo & Benessere (4 card)
│   │
│   ├── #tecnologie      (riga 1094)   Griglia 8 tecnologie
│   ├── #metodo          (riga 1143)   4 step del metodo
│   ├── #risultati       (riga 1170)   Galleria prima/dopo
│   ├── #testimonianze   (riga 1230)   Recensioni clienti
│   ├── #faq             (riga 1275)   Domande frequenti accordion
│   ├── #team            (riga 1328)   Profili team
│   ├── #prenota         (riga 1376)   Form contatti + info
│   └── <footer>         (riga 1449)   Link, legale, copyright
│
└── <script> (riga 1498–fine)  TUTTO il JavaScript
```

---

## 5. Come Modificare i Contenuti

### Aggiungere una scheda servizio

Copia e incolla questo blocco dentro il `<div class="services-grid">` del tab corretto:

```html
<div class="service-card" onclick="toggleCard(this)">
  <div class="service-card-header">
    <div class="service-icon icon-gold">💎</div>   <!-- emoji icona -->
    <div>
      <h3>Nome Trattamento</h3>
      <p>Sottotitolo breve</p>
    </div>
  </div>
  <div class="service-card-body">
    <ul>
      <li>Punto 1</li>
      <li>Punto 2</li>
      <li>Punto 3</li>
    </ul>
  </div>
  <div class="service-card-footer">
    <span class="expand-btn">Scopri <span class="expand-arrow">›</span></span>
    <span style="font-size:0.78rem;color:var(--gray)">Testo nota</span>
  </div>
</div>
```

Classi icona disponibili: `icon-gold` (sfondo oro), `icon-purple` (sfondo lilla), `icon-dark` (sfondo scuro).

### Aggiungere una FAQ

Dentro `<div class="faq-grid">`:

```html
<div class="faq-item fade-in">
  <div class="faq-question" onclick="toggleFaq(this)">
    <span>La tua domanda qui?</span>
    <div class="faq-icon">+</div>
  </div>
  <div class="faq-answer">
    <p>La risposta dettagliata qui...</p>
  </div>
</div>
```

### Aggiungere una tecnologia

Dentro `<div class="tech-grid">`:

```html
<div class="tech-card fade-in">
  <span class="tech-icon">⚙️</span>
  <h3>Nome Tecnologia</h3>
  <p>Descrizione breve dell'apparecchiatura e del suo utilizzo.</p>
  <span class="tech-badge">Categoria</span>
</div>
```

### Modificare il titolo hero

Riga ~538:
```html
<h1 class="hero-title">La tua <em>bellezza</em><br>è il nostro progetto</h1>
```
Il tag `<em>` applica il colore oro e il corsivo. `<br>` controlla l'a capo.

---

## 6. Come Modificare i CSS

Il CSS è tutto dentro `<style>` nelle righe **10–489**. È organizzato con commenti:

```
/* LOADER */        riga ~31
/* NAV */           riga ~40
/* HERO */          riga ~80
/* SECTIONS */      riga ~140
/* ABOUT */         riga ~154
/* STATS */         riga ~190
/* SERVICES */      riga ~203
/* TECH SECTION */  riga ~251
/* METODO */        riga ~278
/* BEFORE AFTER */  riga ~290
/* TESTIMONIALS */  riga ~314
/* FAQ */           riga ~340
/* TEAM */          riga ~360
/* BOOKING */       riga ~390
/* FOOTER */        riga ~442
/* FADE IN */       riga ~457
/* RESPONSIVE */    riga ~461
```

### Breakpoint responsive

| Breakpoint | Riga | Cosa cambia |
|---|---|---|
| `max-width: 1024px` | ~462 | Layout tablet: griglia 2 col, nav compatta |
| `max-width: 768px` | ~475 | Layout mobile: 1 col, hamburger visibile |

### Modificare le animazioni

- **Fade-in al scroll**: classe `.fade-in` → `.fade-in.visible` (righe 457–459). Cambia `opacity`, `transform` e `transition`.
- **Loader**: `@keyframes pulse` (riga 38)
- **Scroll indicator hero**: `@keyframes scrollAnim` (riga 137)
- **Titolo hero**: `@keyframes fadeUp` (riga 138)

---

## 7. JavaScript — Funzioni Interattive

Il JavaScript è tutto alla fine del file, dentro `<script>` (riga ~1498).

| Funzione | Riga approx. | Cosa fa |
|---|---|---|
| `loader` | ~1499 | Nasconde il loader dopo 800ms dal caricamento |
| `navbar scroll` | ~1504 | Aggiunge la classe `.scrolled` alla nav dopo 60px di scroll |
| `toggleMenu()` | ~1509 | Apre/chiude il menu hamburger mobile |
| `closeMobile()` | ~1516 | Chiude il menu mobile (usato nei link) |
| `switchTab(e, id)` | ~1521 | Cambia tab attivo nella sezione servizi |
| `toggleCard(card)` | ~1527 | Espande/chiude una scheda servizio |
| `toggleFaq(el)` | ~1533 | Apre/chiude una voce FAQ |
| `animateCounter(el)` | ~1545 | Anima i numeri delle statistiche |
| `IntersectionObserver` | ~1558 | Attiva `.fade-in.visible` e i counter al scroll |
| `handleSubmit(e)` | ~1584 | Gestisce il submit del form (mostra success state) |
| `video fallback` | ~1589 | Se il video non carica, usa un gradiente CSS |

### Modificare i contatori statistiche

Funzione `animateCounter` (riga ~1545):
```js
function animateCounter(el) {
  const target = +el.dataset.count;
  const suffix = target === 98 ? '%' : target === 2500 ? '+' : '+';
  // ...
}
```
Per aggiungere un suffisso personalizzato (es. `k`), estendi la logica del `suffix`.

### Collegare il form a un servizio reale

Sostituire la funzione `handleSubmit` con una chiamata a Formspree:

```js
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const data = new FormData(form);
  const res = await fetch('https://formspree.io/f/IL_TUO_ID', {
    method: 'POST', body: data, headers: { 'Accept': 'application/json' }
  });
  if (res.ok) {
    form.style.display = 'none';
    document.getElementById('formSuccess').style.display = 'block';
  }
}
```

Per usarlo: crea un account su [formspree.io](https://formspree.io), crea un form e sostituisci `IL_TUO_ID`.

---

## 8. Come Aggiungere Foto Prima/Dopo

Le card nella sezione `#risultati` sono attualmente placeholder. Per inserire foto reali:

**Struttura attuale (placeholder):**
```html
<div class="ba-card">
  <div class="ba-card-inner">
    <div class="ba-icon">✨</div>
    <p>Galleria risultati...</p>
  </div>
  <div class="ba-label">Prima &amp; Dopo</div>
  <div class="ba-treatment"><h4>Filler Labbra</h4><p>...</p></div>
</div>
```

**Struttura con foto reale:**
```html
<div class="ba-card" style="background:none;">
  <img src="before-after-filler.jpg" alt="Prima e dopo filler labbra"
       style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;">
  <div class="ba-label">Prima &amp; Dopo</div>
  <div class="ba-treatment"><h4>Filler Labbra</h4><p>Acido ialuronico — 1 seduta</p></div>
</div>
```

Nominare i file in modo descrittivo (es. `ba-filler-labbra-1.jpg`) e salvarli nella stessa cartella di `index.html`.

---

## 9. Come Integrare il Form

Il form di prenotazione attualmente mostra un messaggio di successo locale (nessun invio reale).

### Opzione A — Formspree (consigliata, gratuita)

1. Vai su [formspree.io](https://formspree.io) → crea account → "New Form"
2. Copia l'ID del form (es. `xyzabc12`)
3. Modifica il tag `<form>` (riga ~1401):
   ```html
   <form id="contactForm" action="https://formspree.io/f/xyzabc12" method="POST" onsubmit="handleSubmit(event)">
   ```
4. Aggiorna `handleSubmit` come mostrato nella sezione 7

### Opzione B — EmailJS (invio email da frontend)

Aggiungi in `<head>`:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
```

Modifica `handleSubmit` per usare `emailjs.sendForm(...)`.

### Opzione C — Link WhatsApp

Sostituire il bottone submit con:
```html
<a href="https://wa.me/39NUMEROCELLULARE?text=Ciao!%20Vorrei%20prenotare%20una%20consulenza."
   class="form-submit" style="display:block;text-align:center;line-height:1.5;">
  Scrivici su WhatsApp →
</a>
```

---

## 10. Deploy su GitHub Pages

### Prima pubblicazione

```bash
git init
git add .
git commit -m "Initial commit — Progetto Diana website"
git remote add origin https://github.com/cammo22/ProgettoDiana.git
git push -u origin main
```

Poi su GitHub: **Settings → Pages → Source: Deploy from branch → main → / (root) → Save**

Il sito sarà live su: [https://cammo22.github.io/ProgettoDiana/](https://cammo22.github.io/ProgettoDiana/)

### Aggiornare il sito dopo modifiche

```bash
git add index.html         # o i file modificati
git commit -m "Descrizione modifica"
git push
```

GitHub Pages si aggiorna automaticamente entro 1–2 minuti.

### File da NON includere nel repo

- File originali con nomi lunghi (tipo `IMG-20260219-WA0001(1).jpg`)
- File `.env` o con credenziali
- Cartelle `node_modules` (qui non esistono, ma tenerlo presente)

---

## Note Finali

- Il sito **non usa framework** (no Bootstrap, no Tailwind, no React): tutto è CSS e JS vanilla.
- **Non serve build step**: si modifica `index.html` direttamente e si fa push.
- Per **aggiungere una pagina** (es. listino prezzi): crea un nuovo file HTML nella stessa cartella e collega con `<a href="listino.html">`.
- Il video `logo-loop.mp4` viene caricato in background. Se non disponibile, entra in gioco il `poster="logo.jpg"` come fallback automatico.
- **Accessibilità**: tutti i link hanno `href`, tutte le immagini hanno `alt`. Per migliorare ulteriormente, aggiungere `aria-label` ai bottoni icona.

---

*Documentazione generata per il progetto Progetto Diana — ultima revisione: 2026-03-28*
