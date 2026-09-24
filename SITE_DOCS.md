# Documentazione tecnica — Progetto Diana

> La guida per chi deve modificare il sito. Ogni sezione dice **dove** mettere le mani e **come**.
> Regola d'oro: quasi tutto quello che cambia spesso sta in **`js/dati.js`**.

---

## Indice

1. [Struttura dei file](#1-struttura-dei-file)
2. [Da aggiornare subito](#2-da-aggiornare-subito)
3. [Contatti, orari e social](#3-contatti-orari-e-social)
4. [Trattamenti](#4-trattamenti)
5. [Il quiz "Trova il tuo rituale"](#5-il-quiz-trova-il-tuo-rituale)
6. [Foto e immagini](#6-foto-e-immagini)
7. [Testi delle sezioni](#7-testi-delle-sezioni)
8. [Colori e font](#8-colori-e-font)
9. [Icone](#9-icone)
10. [Modulo di prenotazione](#10-modulo-di-prenotazione)
11. [JavaScript: cosa fa ogni funzione](#11-javascript-cosa-fa-ogni-funzione)
12. [Accessibilità e prestazioni](#12-accessibilità-e-prestazioni)
13. [Provare in locale e pubblicare](#13-provare-in-locale-e-pubblicare)

---

## 1. Struttura dei file

```
ProgettoDiana/
├── index.html              la pagina (solo struttura e testi fissi)
├── 404.html                pagina "questa pagina si è presa un giorno di relax"
├── .nojekyll               dice a GitHub Pages di pubblicare i file così come sono
│
├── css/
│   ├── style.css           tutto lo stile
│   ├── font.css            dichiarazione dei font locali
│   └── icone.css           icone usate (GENERATO: non modificarlo a mano)
│
├── js/
│   ├── dati.js             ← CONFIG, CATEGORIE, TRATTAMENTI, CONSIGLI
│   └── app.js              tutte le interazioni
│
├── fonts/                  Cormorant Garamond, Nunito, Space Mono, icone (woff2)
├── immagini/
│   ├── 01_…45_*.png        originali ad alta qualità (non usati dal sito)
│   ├── web/*.webp          versioni ottimizzate usate dal sito
│   └── prompts-immagini.md i prompt con cui sono state generate
├── img/
│   ├── emblema.webp        luna + profilo, scontornato (nav, caricamento, conferma)
│   ├── logo-chiaro.webp    logo completo per fondo scuro (footer)
│   ├── favicon.png, apple-touch-icon.png
│   └── readme/             banner, anteprima social (og.jpg) e screenshot del README
├── logo.jpg                logo originale (anche locandina del video)
├── logo-loop.mp4           logo animato, mostrato nello specchio-luna
│
├── strumenti/icone.py      rigenera css/icone.css e i font delle icone
├── README.md               presentazione su GitHub
└── SITE_DOCS.md            questo file
```

Non c'è nessun processo di build: si modifica un file, si fa push, fine.
Il sito **non carica niente da server esterni** (niente Google Fonts, niente CDN).

---

## 2. Da aggiornare subito

Questi dati sono ancora segnaposto. Stanno tutti in `js/dati.js`, dentro `CONFIG`:

| Campo | Valore attuale | Cosa mettere |
|---|---|---|
| `indirizzo`, `citta` | Via della Bellezza, 12 · Milano | indirizzo reale |
| `telefono` | +39 000 000 0000 | numero come deve apparire |
| `whatsapp` | 39000000000 | stesso numero, **solo cifre**, con 39 davanti |
| `email` | info@progettodiana.it | email reale |
| `mappa` | (vuoto) | link Google Maps dello studio (facoltativo: senza, cerca l'indirizzo) |
| `social` | tutti vuoti | link Instagram / Facebook / TikTok (quelli vuoti non compaiono) |
| `formspree` | (vuoto) | ID Formspree, se si vuole ricevere il modulo per email (vedi §10) |

Da rivedere anche nell'HTML: la sezione **Recensioni** (`#recensioni`) e il riquadro **4.9 su 200+ recensioni**
contengono testi d'esempio: vanno sostituiti con recensioni vere o tolti.

---

## 3. Contatti, orari e social

Tutto in `CONFIG` (`js/dati.js`). Da lì il sito compila da solo:

- i contatti nella sezione Prenota (con i link `tel:`, `mailto:` e alla mappa)
- la riga degli orari (es. *Lun–Ven 9:00–20:00 · Sab 9:00–18:00 · Dom chiuso*)
- lo stato **"aperto ora / chiuso ora"** nel pannello della home e accanto agli orari,
  calcolato sull'**ora di Roma** e aggiornato ogni minuto
- i pulsanti social (solo quelli con un link)
- il link WhatsApp e l'email del modulo

Orari: un elemento per giorno, **0 = domenica … 6 = sabato**. `null` vuol dire chiuso.

```js
orari: [
  null,                 // domenica
  ['09:00', '20:00'],   // lunedì
  ['09:00', '20:00'],   // martedì
  ['09:00', '13:00'],   // mercoledì, per esempio mezza giornata
  ['09:00', '20:00'],
  ['09:00', '20:00'],
  ['09:00', '18:00'],   // sabato
],
```

Nell'HTML ci sono valori di riserva (per chi ha JavaScript disattivato): se cambi i contatti,
puoi aggiornarli anche lì, ma non è indispensabile.

---

## 4. Trattamenti

L'elenco `TRATTAMENTI` in `js/dati.js` alimenta **cinque cose insieme**: le schede, i contatori
per categoria, la ricerca, il quiz e il menu a tendina del modulo. Il nastro che scorre sotto
la home e il numero "trattamenti" nei contatori si aggiornano da soli.

Per aggiungere un trattamento, copia un blocco e cambialo:

```js
{ cat: 'estetica', img: '46_laminazione_ciglia', icona: 'fa-eye',
  titolo: 'Laminazione Ciglia', sotto: 'Curva naturale, senza extension', nota: 'Dura 6-8 settimane',
  punti: ['Ciglia più lunghe e incurvate', 'Trattamento nutriente incluso', 'Nessuna manutenzione'],
  zone: ['sguardo'], voglia: ['forma'], tempo: 'momento' },
```

| Campo | Cosa è |
|---|---|
| `cat` | `medicina`, `laser`, `estetica` o `corpo` (vedi `CATEGORIE`) |
| `img` | nome del file in `immagini/web/`, **senza** `.webp` |
| `icona` | un'icona Font Awesome Free (vedi §9) |
| `titolo`, `sotto` | nome e sottotitolo della scheda |
| `nota` | etichetta sulla foto (es. "Effetto immediato") |
| `punti` | l'elenco che appare nella scheda aperta |
| `zone`, `voglia`, `tempo` | servono al quiz (vedi §5) |

Per creare una nuova categoria aggiungila a `CATEGORIE` con `nome`, `icona` e `tono`
(`oro`, `lilla`, `rosa` o `salvia`: il colore della piccola icona lucida).

---

## 5. Il quiz "Trova il tuo rituale"

Tre domande: **cosa** (zona), **cosa vorresti sentire** (voglia), **quanto tempo** (tempo).
Ogni trattamento prende punti così: zona giusta **+3**, voglia giusta **+2**, tempo giusto **+1**.
Si mostrano i tre con più punti (almeno la zona deve combaciare).

| Chiave | Valori possibili |
|---|---|
| `zone` | `viso` · `sguardo` (sguardo e labbra) · `corpo` · `mente` (relax) |
| `voglia` | `luce` · `giovinezza` (in pagina: *Freschezza*) · `forma` (*Definizione*) · `leggerezza` · `calma` |
| `tempo` | `momento` (una seduta) · `percorso` (più sedute) |

Le domande e le risposte sono nell'HTML, sezione `#rituale` (ogni bottone ha un `data-v`
uguale a uno dei valori qui sopra). I titoli del risultato ("Luce per il viso") sono in
`js/app.js`, funzione `quiz()`, oggetti `ZONE` e `VOGLIE`.

---

## 6. Foto e immagini

Il sito usa le versioni **WebP** in `immagini/web/` (circa 20–50 KB l'una). Gli originali PNG
restano in `immagini/` per future modifiche, ma non vengono caricati.

**Aggiungere o sostituire una foto**

1. Metti l'originale in `immagini/` (es. `46_laminazione_ciglia.png`).
2. Crea la versione WebP larga 800 px (1024 px per le foto grandi di "Chi siamo"):
   - online: [squoosh.app](https://squoosh.app) → WebP, qualità 80, ridimensiona a 800;
   - oppure da terminale (con `pip install pillow`):
     ```bash
     python3 -c "from PIL import Image; im=Image.open('immagini/46_laminazione_ciglia.png').convert('RGB'); im.thumbnail((800,800)); im.save('immagini/web/46_laminazione_ciglia.webp', quality=80, method=6)"
     ```
3. Usa il nome (senza estensione) nel campo `img` del trattamento, oppure nel `src` dell'HTML.

**Foto del team:** sezione `#team` di `index.html`, sostituisci `immagini/web/02_team_dalila.webp` ecc.

**Risultati reali (prima/dopo):** sezione `#risultati`. Ogni foto è una `<figure class="res">`
con `data-tags` (le parole dei filtri: `viso`, `labbra`, `corpo`). Per un nuovo filtro, aggiungi
un bottone in `#filtri` con `data-f="nome"` e usa lo stesso nome nei `data-tags`.
Ricorda il consenso scritto delle persone ritratte.

**Anteprima social:** quando il link viene condiviso si vede `img/readme/og.jpg` (1200×630).

---

## 7. Testi delle sezioni

I testi fissi sono in `index.html`, sezione per sezione, nell'ordine in cui compaiono:

| Sezione | id | Note |
|---|---|---|
| Home | (classe `hero`) | titolo, prompt, pannello "il tuo momento" |
| Nastro | `#ticker` | si riempie da solo coi trattamenti |
| Chi siamo | `#chi` | testo e 4 valori |
| Numeri | (classe `stats`) | `data-count` = numero finale; `auto-trattamenti` = conta da sola |
| Trattamenti | `#trattamenti` | le schede arrivano da `js/dati.js` |
| Il tuo rituale | `#rituale` | domande del quiz |
| Tecnologie | `#tecnologie` | 8 schede |
| Respira | `#respira` | ritmi del respiro: `data-ritmo="inspira,trattieni,espira,pausa"` in secondi |
| Metodo | `#metodo` | 4 fasi |
| Risultati | `#risultati` | foto e filtri |
| Recensioni | `#recensioni` | **testi d'esempio da sostituire** |
| Team | `#team` | 3 schede |
| FAQ | `#faq` | ogni domanda è un `<details>` |
| Prenota | `#prenota` | contatti da `CONFIG`, modulo |

**Le frasi della macchina da scrivere** ("oggi mi prendo cura … di me, della mia pelle…") sono in
`js/app.js`, funzione `macchinaDaScrivere()`. **I consigli del giorno** sono in `CONSIGLI` (`js/dati.js`):
ne compare uno diverso ogni giorno.

**Aggiungere una FAQ** (dentro `<div class="faq-list">`):

```html
<details class="faq glass rv"><summary>La tua domanda?<i class="fas fa-plus"></i></summary><p>La risposta.</p></details>
```

La classe `rv` fa comparire l'elemento con una dissolvenza quando entra nello schermo.

---

## 8. Colori e font

Tutti i colori sono variabili all'inizio di `css/style.css`:

```css
:root {
  --bg:     #0b0710;   /* notte: fondo pagina */
  --txt:    #e9e0ef;   /* testo */
  --txt2:   #b3a5c2;   /* testo secondario */
  --head:   #fff6ea;   /* titoli */
  --gold:   #e8c074;   /* oro: accenti e bottoni */
  --lilac:  #bfa2ea;   /* lilla */
  --rose:   #f2a7c3;   /* rosa */
  --sage:   #8fd8b8;   /* salvia: "aperto ora" */
  …
}
```

Componenti riutilizzabili:

| Classe | Cos'è |
|---|---|
| `glass` | pannello di vetro scuro col riflesso in alto |
| `pearl` | bottone lucido oro; varianti `lilac`, `sage`, `ghost`, `sm`, `wide` |
| `ico` + `i-oro` / `i-lilla` / `i-rosa` / `i-salvia` | icona lucida quadrata (`sm` = piccola) |
| `kicker` | la riga in stile terminale sopra i titoli (`// 01 · …`) |
| `title` + `<em>` | titolo; la parte in `<em>` diventa corsivo in oro sfumato |
| `rv` | comparsa allo scorrimento |

**Font** (in `fonts/`, dichiarati in `css/font.css`): Cormorant Garamond (titoli), Nunito (testo),
Space Mono (etichette e prompt). Tutti con licenza SIL Open Font License.

---

## 9. Icone

Il sito usa **Font Awesome Free**, ma solo le icone che servono (circa 7 KB invece di ~270).
Il nome di un'icona si scrive così: `<i class="fas fa-heart"></i>` (marchi: `fab fa-instagram`).

**Aggiungere un'icona nuova:**

1. Cercala su [fontawesome.com/search](https://fontawesome.com/search?o=r&m=free) (solo quelle *Free*, stile *Solid* o *Brands*).
2. Usala nell'HTML o in `js/dati.js` (es. `icona: 'fa-heart-pulse'`).
3. Rigenera le icone:
   ```bash
   pip install fonttools brotli
   python3 strumenti/icone.py
   ```
   Lo script cerca tutte le icone usate in `index.html`, `404.html`, `js/dati.js` e `js/app.js`
   e riscrive `css/icone.css` e `fonts/fa-*.woff2`.

---

## 10. Modulo di prenotazione

Il modulo controlla i campi obbligatori (nome, telefono, trattamento, consenso privacy) e poi:

- **senza `formspree` in `CONFIG`** (com'è adesso): prepara il messaggio e mostra due bottoni,
  **Invia su WhatsApp** (apre la chat con `CONFIG.whatsapp`) e **Invia per email** (apre la posta
  verso `CONFIG.email`). Il messaggio contiene nome, trattamento, fascia oraria preferita, contatti e note.
- **con `formspree`**: invia davvero la richiesta. Basta:
  1. creare un account gratuito su [formspree.io](https://formspree.io) → *New Form*;
  2. copiare l'ID (es. `xyzabc12`) in `CONFIG.formspree`.
  Se l'invio fallisce, compaiono comunque i bottoni WhatsApp ed email.

Il menu dei trattamenti del modulo si genera da `TRATTAMENTI`. Scegliendo **"Prenota questo
trattamento"** da una scheda, o **"Prenota questo rituale"** dal quiz, il modulo si precompila.

**Privacy:** la casella di consenso è obbligatoria. Prima di attivare Formspree conviene
aggiungere una pagina di informativa privacy e collegarla nel testo della casella.

---

## 11. JavaScript: cosa fa ogni funzione

Tutto in `js/app.js`, dentro un'unica funzione che parte al caricamento.

| Funzione | Cosa fa |
|---|---|
| `contatti()` | scrive contatti, orari e social da `CONFIG` |
| `statoStudio()` | "aperto ora / chiuso ora", ricalcolato ogni minuto (ora di Roma) |
| `consiglio()` | il consiglio del giorno da `CONSIGLI` |
| `macchinaDaScrivere()` | il testo che si scrive e si cancella nel prompt della home |
| `cielo()` | polvere d'oro e perle sullo sfondo (canvas); si ferma se la scheda del browser è nascosta |
| `spruzzo(x, y)` | la pioggia di scintille (quiz completato, respiro finito, prenotazione, parola segreta) |
| `navigazione()` | menu mobile, barra di avanzamento, voce attiva, bottone "torna su" |
| `comparse()` | fa comparire gli elementi `.rv`; avvia i contatori e la linea del metodo |
| `nastro()` | riempie il nastro dei trattamenti |
| `trattamenti()` | categorie, ricerca (anche senza accenti), schede, luce che segue il cursore |
| `apriScheda(i)` / `schedaTratt()` | la scheda di dettaglio di un trattamento |
| `prenotaPer(titolo)` | scorre al modulo e seleziona il trattamento |
| `quiz()` | il quiz del rituale |
| `respiro()` | il respiro guidato (60 secondi) |
| `filtri()` | i filtri della sezione risultati |
| `modulo()` | controllo e invio del modulo |
| `specchio()` | mette in pausa il video del logo quando non si vede |
| `sorpresa()` | scrivendo `luna` sulla tastiera parte una pioggia di stelle |

---

## 12. Accessibilità e prestazioni

- **Riduci movimento:** se il sistema lo chiede (`prefers-reduced-motion`), sfondo, macchina da
  scrivere, video e animazioni si fermano; tutto resta leggibile e usabile.
- **Tastiera:** link "Vai al contenuto", focus visibile in oro, schede apribili con Invio,
  categorie navigabili con le frecce, la scheda si chiude con Esc.
- **Immagini:** caricate solo quando stanno per entrare nello schermo (`loading="lazy"`),
  con dimensioni dichiarate per evitare salti di impaginazione.
- **Niente server esterni:** font e icone sono nel repository. Nessun cookie, nessun tracciamento.
- **Senza JavaScript** la pagina resta leggibile (testi, contatti di riserva, FAQ), ma schede,
  quiz, respiro e modulo richiedono JavaScript.

---

## 13. Provare in locale e pubblicare

```bash
python3 -m http.server 8000   # poi apri http://localhost:8000
```

Meglio un piccolo server che il doppio clic su `index.html`: aperti come file, in alcuni
browser font e video possono non caricarsi.

**Pubblicare:** GitHub Pages è impostato su *Deploy from a branch → `main` → `/ (root)`*.
Ogni push su `main` aggiorna il sito su
[cammo22.github.io/ProgettoDiana](https://cammo22.github.io/ProgettoDiana/) entro un paio di minuti.

```bash
git add .
git commit -m "Aggiorna orari"
git push
```

**La pagina 404** usa percorsi che cominciano con `/ProgettoDiana/`: se un giorno il sito passa
a un dominio proprio (es. `progettodiana.it`), in `404.html` basta togliere `/ProgettoDiana` dai link.

---

*Sito fatto a mano da [DaProd](https://cammo22.github.io/Portfolio/) · ultima revisione: settembre 2026*
