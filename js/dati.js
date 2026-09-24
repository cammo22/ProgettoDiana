/* ─────────────────────────────────────────────
   Progetto Diana — DATI DEL SITO
   Tutto quello che cambia spesso sta qui:
   contatti, orari, social e l'elenco dei trattamenti.
   Modifichi questo file e il sito si aggiorna da solo
   (menu, schede, ricerca, quiz e modulo di prenotazione).
   ───────────────────────────────────────────── */

const CONFIG = {
  nome: 'Progetto Diana',

  // Contatti — sostituisci con quelli veri
  indirizzo: 'Via della Bellezza, 12',
  citta: 'Milano, Italia',
  telefono: '+39 000 000 0000',     // come lo vedono le persone
  whatsapp: '39000000000',          // solo cifre, con prefisso internazionale, senza "+"
  email: 'info@progettodiana.it',
  mappa: '',                        // link Google Maps (facoltativo)

  // Orari: indice 0 = domenica … 6 = sabato. null = chiuso
  orari: [
    null,
    ['09:00', '20:00'],
    ['09:00', '20:00'],
    ['09:00', '20:00'],
    ['09:00', '20:00'],
    ['09:00', '20:00'],
    ['09:00', '18:00'],
  ],

  // Social: lascia '' per nasconderli
  social: {
    instagram: '',
    facebook: '',
    tiktok: '',
  },

  // Facoltativo: ID di un form Formspree (es. 'xyzabc12').
  // Se c'è, il modulo invia davvero la richiesta; se manca,
  // prepara il messaggio da mandare su WhatsApp o per email.
  formspree: '',
};

// Le quattro aree dei servizi
const CATEGORIE = {
  medicina: { nome: 'Medicina Estetica',  icona: 'fa-syringe',   tono: 'oro'   },
  laser:    { nome: 'Laser & Tecnologie', icona: 'fa-bolt',      tono: 'lilla' },
  estetica: { nome: 'Centro Estetico',    icona: 'fa-spa',       tono: 'rosa'  },
  corpo:    { nome: 'Corpo & Benessere',  icona: 'fa-leaf',      tono: 'salvia'},
};

/* Ogni trattamento:
   cat    → una chiave di CATEGORIE
   img    → nome del file in immagini/web/ (senza .webp)
   icona  → icona Font Awesome (https://fontawesome.com/search?o=r&m=free)
   zone   → per il quiz: viso · sguardo · corpo · mente
   voglia → per il quiz: luce · giovinezza · forma · leggerezza · calma
   tempo  → per il quiz: momento (una seduta) · percorso (più sedute) */
const TRATTAMENTI = [
  { cat: 'medicina', img: '08_tossina_botulinica', icona: 'fa-syringe',
    titolo: 'Tossina Botulinica', sotto: 'Trattamento rughe e lifting', nota: 'Risultati visibili in 3-7 gg',
    punti: ['Rughe frontali, glabella e zampe di gallina', 'Lifting non chirurgico del sopracciglio', 'Sorriso gengivale e bunny lines', 'Iperidrosi (sudorazione eccessiva)', 'Bruxismo e tensione mandibolare'],
    zone: ['viso'], voglia: ['giovinezza'], tempo: 'momento' },

  { cat: 'medicina', img: '09_filler_acido_ialuronico', icona: 'fa-droplet',
    titolo: 'Filler Acido Ialuronico', sotto: 'Volume, definizione e riempimento', nota: 'Effetto immediato',
    punti: ['Labbra: volume, definizione, idratazione', 'Zigomi e guance per un ovale armonioso', 'Rhinofiller — rinoplastica senza chirurgia', 'Rughe nasogeniene e del sorriso', 'Occhiaie, solco lacrimale, mento'],
    zone: ['viso', 'sguardo'], voglia: ['forma', 'giovinezza'], tempo: 'momento' },

  { cat: 'medicina', img: '10_biorivitalizzazione', icona: 'fa-wand-magic-sparkles',
    titolo: 'Biorivitalizzazione', sotto: 'Idratazione profonda e skinbooster', nota: 'Ciclo 2-3 sedute',
    punti: ['Skinbooster con acido ialuronico reticolato', 'Trattamenti per viso, collo, décolleté e mani', 'Luminosità, compattezza ed elasticità', 'Profhilo e Juvederm Volite'],
    zone: ['viso'], voglia: ['luce', 'giovinezza'], tempo: 'percorso' },

  { cat: 'medicina', img: '11_prp_plasma', icona: 'fa-dna',
    titolo: 'PRP — Plasma Ricco di Piastrine', sotto: 'Ringiovanimento biologico', nota: '100% naturale',
    punti: ['Ringiovanimento e rigenerazione viso', 'Tricologia: contrasto alopecia e diradamento', 'Stimolazione naturale del collagene', 'Efficace su cicatrici e smagliature'],
    zone: ['viso'], voglia: ['giovinezza', 'luce'], tempo: 'percorso' },

  { cat: 'medicina', img: '12_fili_tensori_pdo', icona: 'fa-feather-pointed',
    titolo: 'Fili Tensori PDO', sotto: 'Lifting non chirurgico', nota: 'Effetto lifting immediato',
    punti: ["Ridefinizione dell'ovale del viso", 'Lifting guance, zigomi e collo', 'Stimolazione del collagene endogeno', 'Risultati visibili subito, che migliorano nel tempo'],
    zone: ['viso'], voglia: ['giovinezza', 'forma'], tempo: 'momento' },

  { cat: 'medicina', img: '13_mesoterapia', icona: 'fa-flask',
    titolo: 'Mesoterapia', sotto: 'Cocktail attivi mirati', nota: 'Protocollo personalizzato',
    punti: ['Mesoterapia viso anti-age e illuminante', 'Tricologia: perdita capelli e diradamento', 'Corpo: cellulite e localizzazioni adipose', 'Formulazioni personalizzate per ogni esigenza'],
    zone: ['viso', 'corpo'], voglia: ['luce', 'leggerezza'], tempo: 'percorso' },

  { cat: 'medicina', img: '14_peeling_chimici', icona: 'fa-flask-vial',
    titolo: 'Peeling Chimici', sotto: 'Rinnovamento cellulare', nota: 'Pelle rinnovata',
    punti: ['Superficiali: glicolico, mandorla, lattico', 'Medi: TCA, Jessner — per macchie e photo-aging', 'Trattamento acne e cicatrici post-acneiche', 'Omogeneizzazione del tono cutaneo'],
    zone: ['viso'], voglia: ['luce'], tempo: 'percorso' },

  { cat: 'medicina', img: '15_carbossiterapia', icona: 'fa-wind',
    titolo: 'Carbossiterapia', sotto: 'CO₂ terapeutica', nota: 'Trattamento naturale',
    punti: ['Cellulite e adiposità localizzate', 'Trattamento occhiaie e rilassamento cutaneo', 'Rassodamento corporeo e viso', 'Stimolazione microcircolo'],
    zone: ['corpo', 'sguardo'], voglia: ['leggerezza', 'forma'], tempo: 'percorso' },

  { cat: 'laser', img: '16_laser_diodo', icona: 'fa-bolt',
    titolo: 'Laser Diodo 808nm', sotto: 'Depilazione permanente', nota: 'Risultati permanenti',
    punti: ['Depilazione definitiva su viso e corpo', 'Efficace su tutti i fototipi cutanei', 'Tecnologia a impulsi lunghi — indolore', 'Gambe, ascelle, inguine, labbro, collo'],
    zone: ['corpo'], voglia: ['leggerezza'], tempo: 'percorso' },

  { cat: 'laser', img: '17_hifu', icona: 'fa-bullseye',
    titolo: 'HIFU — Ultrasuoni Focalizzati', sotto: 'Lifting non invasivo', nota: '1 seduta = lifting',
    punti: ['Lifting viso e collo senza chirurgia', 'Rassodamento décolleté e corpo', 'Stimolazione del collagene in profondità', 'Zero downtime — effetto progressivo'],
    zone: ['viso', 'corpo'], voglia: ['giovinezza', 'forma'], tempo: 'momento' },

  { cat: 'laser', img: '18_radiofrequenza', icona: 'fa-wave-square',
    titolo: 'Radiofrequenza Multipolare', sotto: 'Rassodamento e rimodellamento', nota: 'No downtime',
    punti: ['Rassodamento viso, collo e corpo', 'Riduzione della cellulite', 'Stimolazione elastina e collagene', 'Trattamento smagliature'],
    zone: ['viso', 'corpo'], voglia: ['forma', 'giovinezza'], tempo: 'percorso' },

  { cat: 'laser', img: '19_criolipolisi', icona: 'fa-snowflake',
    titolo: 'Criolipolisi', sotto: 'Eliminazione adiposità localizzate', nota: 'Riduzione fino al 27%',
    punti: ['Distruzione selettiva delle cellule adipose', 'Addome, fianchi, cosce, braccia, doppio mento', 'Non invasiva — nessuna anestesia', 'Risultati visibili dalle 4-6 settimane'],
    zone: ['corpo'], voglia: ['forma', 'leggerezza'], tempo: 'momento' },

  { cat: 'laser', img: '20_cavitazione', icona: 'fa-water',
    titolo: 'Cavitazione Ultrasonica', sotto: 'Modellamento corpo', nota: 'Ciclo 6-8 sedute',
    punti: ['Riduzione cellulite e adiposità', 'Trattamento addome, cosce e glutei', 'Combinabile con radiofrequenza per potenziare', 'Drenaggio linfatico post-trattamento'],
    zone: ['corpo'], voglia: ['leggerezza', 'forma'], tempo: 'percorso' },

  { cat: 'laser', img: '21_ipl_luce_pulsata', icona: 'fa-rainbow',
    titolo: 'Luce Pulsata IPL', sotto: 'Foto-ringiovanimento', nota: 'Pelle uniforme',
    punti: ['Macchie solari e iperpigmentazioni', 'Couperose e capillari dilatati', 'Foto-ringiovanimento cutaneo', 'Uniformizzazione del tono del viso'],
    zone: ['viso'], voglia: ['luce'], tempo: 'percorso' },

  { cat: 'laser', img: '22_led_therapy', icona: 'fa-lightbulb',
    titolo: 'LED Therapy', sotto: 'Trattamento luminoso multifunzione', nota: 'Indolore e rilassante',
    punti: ['LED rosso: anti-age e stimolazione collagene', 'LED blu: acne e trattamento antibatterico', 'LED giallo: calmante e anti-rossore', 'Ideale in abbinamento ad altri trattamenti'],
    zone: ['viso'], voglia: ['luce', 'calma'], tempo: 'momento' },

  { cat: 'estetica', img: '23_trattamenti_viso', icona: 'fa-leaf',
    titolo: 'Trattamenti Viso', sotto: 'Pulizia, idratazione, anti-age', nota: 'Personalizzato',
    punti: ['Pulizia profonda del viso con estrattore', 'Idratazione intensa e trattamento nutriente', 'Anti-age con principi attivi concentrati', 'Trattamento acne e pelle mista-grassa', 'Microdermabrasione e ossigenoterapia'],
    zone: ['viso', 'mente'], voglia: ['luce', 'calma'], tempo: 'momento' },

  { cat: 'estetica', img: '24_trucco_semipermanente', icona: 'fa-pen-nib',
    titolo: 'Trucco Semipermanente', sotto: 'PMU — Permanent Make Up', nota: 'Dura 1-2 anni',
    punti: ['Microblading: sopracciglia hair stroke', 'Powder Brow / Ombre Brow', 'Blush Lips: labbra colorate e definite', 'Eye liner semipermanente', 'Retouching e correzioni'],
    zone: ['sguardo'], voglia: ['forma'], tempo: 'momento' },

  { cat: 'estetica', img: '25_ciglia_sopracciglia', icona: 'fa-eye',
    titolo: 'Ciglia & Sopracciglia', sotto: 'Extension, laminazione, henna', nota: 'Sguardo intenso',
    punti: ['Extension ciglia: classic, volume, mega volume', 'Lash Lift e Lash Filler', 'Laminazione sopracciglia', 'Henna sopracciglia e design', 'Tinte e mapping professionale'],
    zone: ['sguardo'], voglia: ['forma', 'luce'], tempo: 'momento' },

  { cat: 'estetica', img: '26_nail_care', icona: 'fa-hand-sparkles',
    titolo: 'Nail Care', sotto: 'Manicure, pedicure, ricostruzione', nota: 'Mani perfette',
    punti: ['Manicure e pedicure classiche', 'Smalto semipermanente gel', 'Ricostruzione unghie in gel e acrilico', 'Nail art e decorazioni su misura', 'Pedicure estetica e curativa'],
    zone: ['mente'], voglia: ['calma', 'luce'], tempo: 'momento' },

  { cat: 'estetica', img: '27_epilazione', icona: 'fa-feather',
    titolo: 'Epilazione', sotto: 'Ceretta italiana e orientale', nota: 'Pelle setosa',
    punti: ['Ceretta italiana tradizionale', 'Ceretta orientale liposolubile (meno dolorosa)', 'Epilazione full body', 'Viso, ascelle, gambe, inguine, schiena'],
    zone: ['corpo'], voglia: ['leggerezza'], tempo: 'momento' },

  { cat: 'corpo', img: '28_massaggi_terapeutici', icona: 'fa-spa',
    titolo: 'Massaggi Terapeutici', sotto: 'Relax, decontratturazione, drenaggio', nota: 'Puro benessere',
    punti: ['Massaggio rilassante e decontratturante', 'Drenaggio linfatico manuale (Vodder)', 'Hot Stone Massage', 'Massaggio anticellulite', 'Massaggio ayurvedico'],
    zone: ['mente', 'corpo'], voglia: ['calma', 'leggerezza'], tempo: 'momento' },

  { cat: 'corpo', img: '29_trattamenti_corpo', icona: 'fa-soap',
    titolo: 'Trattamenti Corpo', sotto: 'Scrub, fanghi, bendaggi', nota: 'Corpo levigato',
    punti: ['Scrub esfoliante corpo con oli essenziali', 'Fanghi termali e mineralizzanti', 'Bendaggi snellenti e drenanti', 'Wrap cioccolato e anti-age'],
    zone: ['corpo', 'mente'], voglia: ['calma', 'luce'], tempo: 'momento' },

  { cat: 'corpo', img: '30_abbronzatura_spray', icona: 'fa-sun',
    titolo: 'Abbronzatura Spray', sotto: "Bronze naturale tutto l'anno", nota: 'Senza UV',
    punti: ['Autoabbronzante professionale airbrush', 'Tonalità personalizzabili', 'Effetto immediato e naturale', 'Formula idratante e nutriente'],
    zone: ['corpo'], voglia: ['luce'], tempo: 'momento' },

  { cat: 'corpo', img: '31_percorsi_personalizzati', icona: 'fa-route',
    titolo: 'Percorsi Personalizzati', sotto: 'Protocolli su misura', nota: 'Solo per te',
    punti: ['Consulenza e analisi cutanea approfondita', 'Combinazione di trattamenti per obiettivi specifici', 'Protocolli corpo prima di eventi', 'Programmi stagionali di mantenimento'],
    zone: ['viso', 'sguardo', 'corpo', 'mente'], voglia: [], tempo: 'percorso' },
];

// Un piccolo consiglio al giorno, mostrato nella home (cambia ogni giorno)
const CONSIGLI = [
  "Un bicchiere d'acqua appena sveglia: la pelle se ne accorge prima di te.",
  "Protezione solare anche d'inverno. Soprattutto d'inverno.",
  'Struccati sempre prima di dormire, anche dopo la giornata più lunga.',
  'Ogni ora guarda lontano per 20 secondi: gli occhi ringraziano.',
  'Una federa di seta: meno pieghe sul viso, capelli più morbidi.',
  "Cinque minuti di stretching al collo scaricano la giornata.",
  'Applica la crema contorno occhi picchiettando, mai strofinando.',
  'Il sonno è il trattamento più sottovalutato che esista.',
  'Scrub corpo una volta a settimana, idratazione ogni giorno.',
  'Le mani invecchiano come il viso: trattale allo stesso modo.',
  'Tre respiri lenti prima di una riunione cambiano tutto.',
  'Una passeggiata di 20 minuti alla luce del giorno fa bene anche alla pelle.',
  'Detergi il telefono: tocca il tuo viso più spesso di quanto pensi.',
  'Concediti un momento solo tuo, anche breve. Oggi, non domani.',
];
