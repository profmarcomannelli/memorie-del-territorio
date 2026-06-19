# Memorie del Territorio

Sito web del progetto **"Memorie del Territorio"** dell'Istituto Comprensivo di Acquedolci (ME).

Documenta i siti archeologici e storici del territorio. È un contenitore che si arricchisce
durante l'anno scolastico con i contributi degli studenti.

## Siti documentati

- **Grotta di San Teodoro** — Paleolitico superiore (Acquedolci, ME)
- **Apollonia** — città greca, età greca e romana
- **Monte San Fratello** — borgo medievale normanno

## Tecnologia

Sito statico in **HTML / CSS / JavaScript puro**, senza framework.
I contenuti dei siti sono gestiti tramite `dati/siti.json`: per aggiungere un sito
basta modificare il JSON, senza toccare l'HTML.

- Mappa interattiva: [Leaflet.js](https://leafletjs.com/) + tiles CartoDB Voyager
- Galleria: masonry CSS + lightbox vanilla JS

## Anteprima in locale

Dalla cartella del progetto:

```bash
python3 -m http.server 3456
```

Poi apri http://localhost:3456 nel browser.

## Pubblicazione

Il sito è pubblicato su **Netlify** con deploy continuo da GitHub:
a ogni `git push` sul branch principale Netlify aggiorna automaticamente il sito online.

## Struttura

```
index.html                    Homepage
mappa.html                    Mappa interattiva dei siti
podcast/                      Sezione podcast
galleria/                     Galleria fotografica
dietro-le-quinte/             Metodologia, timeline, team
siti/                         Pagine di dettaglio dei singoli siti
assets/                       CSS, JS, immagini, font
dati/                         Contenuti in formato JSON
```
