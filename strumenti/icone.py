#!/usr/bin/env python3
"""Rigenera le icone del sito (css/icone.css + fonts/fa-*.woff2).

Il sito usa Font Awesome Free, ma non tutto: solo le icone che compaiono
davvero in index.html, js/dati.js e js/app.js. Così il font pesa pochi KB
e non serve nessun CDN esterno.

Quando aggiungi un'icona nuova (es. fa-heart-pulse) lanciala così:

    pip install fonttools brotli
    python3 strumenti/icone.py

Scarica Font Awesome Free da PyPI la prima volta e lo tiene in cache.
"""
import re
import subprocess
import sys
import tempfile
import urllib.request
import zipfile
from pathlib import Path

VERSIONE = '6.4.0'
RADICE = Path(__file__).resolve().parent.parent
CACHE = Path(tempfile.gettempdir()) / f'fontawesomefree-{VERSIONE}.whl'
BASE = 'fontawesomefree/static/fontawesomefree/js-packages/@fortawesome/fontawesome-free/'
FILE_SITO = ['index.html', '404.html', 'js/dati.js', 'js/app.js']
IGNORA = {'solid', 'brands', 'regular', 'style', 'display'}


def scarica():
    if CACHE.exists():
        return
    print('Scarico Font Awesome Free', VERSIONE, 'da PyPI…')
    with urllib.request.urlopen('https://pypi.org/pypi/fontawesomefree/%s/json' % VERSIONE) as r:
        import json
        url = next(u['url'] for u in json.load(r)['urls'] if u['filename'].endswith('.whl'))
    urllib.request.urlretrieve(url, CACHE)


def main():
    scarica()
    z = zipfile.ZipFile(CACHE)
    css_solid = z.read(BASE + 'css/fontawesome.css').decode()
    css_brand = z.read(BASE + 'css/brands.css').decode()

    testo = ''.join((RADICE / f).read_text(encoding='utf-8') for f in FILE_SITO if (RADICE / f).exists())
    nomi = sorted(set(re.findall(r'fa-([a-z0-9]+(?:-[a-z0-9]+)*)', testo)) - IGNORA)

    def codice(css, nome):
        m = re.search(r'\.fa-%s::?before\s*\{\s*content:\s*"\\([0-9a-f]+)"' % re.escape(nome), css)
        return m.group(1) if m else None

    solide, marchi, mancanti = {}, {}, []
    for n in nomi:
        c = codice(css_brand, n)
        if c:
            marchi[n] = c
            continue
        c = codice(css_solid, n)
        if c:
            solide[n] = c
        else:
            mancanti.append(n)
    if mancanti:
        print('Attenzione, icone non trovate in Font Awesome Free:', ', '.join(mancanti))

    with tempfile.TemporaryDirectory() as tmp:
        for nome_font, codici, uscita in [('fa-solid-900.woff2', solide, 'fa-solid.woff2'),
                                          ('fa-brands-400.woff2', marchi, 'fa-brands.woff2')]:
            sorgente = Path(tmp) / nome_font
            sorgente.write_bytes(z.read(BASE + 'webfonts/' + nome_font))
            subprocess.run([sys.executable, '-m', 'fontTools.subset', str(sorgente),
                            '--unicodes=' + ','.join('U+' + c for c in sorted(set(codici.values()))),
                            '--flavor=woff2', '--no-hinting', '--desubroutinize',
                            '--output-file=' + str(RADICE / 'fonts' / uscita)], check=True)

    regole = '\n'.join('.fa-%s::before { content:"\\%s"; }' % (n, c) for n, c in sorted({**solide, **marchi}.items()))
    (RADICE / 'css' / 'icone.css').write_text(f"""/* Font Awesome Free {VERSIONE} — solo le icone usate dal sito
   Licenza: icone CC BY 4.0, font SIL OFL 1.1, codice MIT (https://fontawesome.com/license/free)
   File generato da strumenti/icone.py: non modificarlo a mano */
@font-face {{ font-family:'FA Solid'; font-style:normal; font-weight:900; font-display:block; src:url(../fonts/fa-solid.woff2) format('woff2'); }}
@font-face {{ font-family:'FA Brands'; font-style:normal; font-weight:400; font-display:block; src:url(../fonts/fa-brands.woff2) format('woff2'); }}
.fas, .fab {{ display:inline-block; font-style:normal; font-variant:normal; line-height:1; text-rendering:auto; -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale; }}
.fas {{ font-family:'FA Solid'; font-weight:900; }}
.fab {{ font-family:'FA Brands'; font-weight:400; }}
{regole}
""", encoding='utf-8')
    print(f'Fatto: {len(solide)} icone + {len(marchi)} marchi in css/icone.css')


if __name__ == '__main__':
    main()
