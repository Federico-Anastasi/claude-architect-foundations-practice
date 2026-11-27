# Claude Certified Architect – Foundations · practice

*English summary.* An unofficial study page for the Claude Certified Architect – Foundations exam (code CCAR-F):
condensed theory, 464 practice and mock-exam questions in English with explanations in Italian, timed simulations
and error review. One static HTML file, no install, no server. It can also serve as a template for another
multiple-choice exam: replace the question files and the theory section.

---

Pagina di studio **non ufficiale** per l'esame Claude Certified Architect – Foundations (codice CCAR-F): teoria in
sintesi, domande di allenamento, simulazioni d'esame a tempo e ripasso degli errori. Un solo file HTML statico, senza
installazione e senza server.

## Come si usa

Scarica la repository (o *Code → Download ZIP*) e apri `index.html` nel browser. Le sezioni:

- **Teoria**: le euristiche d'esame e i 5 domini della guida, in sintesi, con le trappole ricorrenti.
- **Allenamento**: una domanda alla volta con correzione immediata, filtrabile per scenario, dominio o solo sbagliate.
- **Simulazione**: 4 scenari su 6, 60 domande in 120 minuti, correzione alla consegna; versione breve da 30 domande
  in 60 minuti. Usa una banca separata, che non compare mai in allenamento, e propone prima le domande mai viste.
- **Errori**: le domande sbagliate l'ultima volta, finché non le azzecchi.

I progressi restano nel `localStorage` del browser che usi: niente account, niente dati inviati altrove.

Le domande sono in inglese, come gli esempi della guida; le spiegazioni sono in italiano. L'esame ufficiale dà la
soglia come punteggio scalato (720 su 100–1.000), non come percentuale: la pagina usa il 75–80% di risposte giuste
come obiettivo prudente.

## Le domande

| File | Banca | Domande |
|---|---|---|
| `domande/s1.js` … `s6.js` | allenamento, di cui 12 domande d'esempio della guida | 116 |
| `domande/s1n.js` … `s6n.js` | allenamento | 120 |
| `domande/sim1.js` … `sim6.js` | simulazione | 180 |
| `domande/hard1.js` … `hard6.js` | simulazione, difficili | 48 |

Il numero nel nome del file è lo scenario. Ogni domanda è una chiamata a `Q(...)`:

```js
Q({ id: "x1-01", s: 1, d: 1, t: "1.1", sim: 1,
  q: "Question text, in English.",
  o: [
    "The correct option, always first.",
    "A wrong option.",
    "A wrong option.",
    "A wrong option.",
  ], a: [0],
  e: "Spiegazione: perché la risposta giusta è giusta e le altre no, senza citare le lettere.",
});
```

- `id` univoco; `s` scenario (1–6); `d` dominio (1–5); `t` facoltativo, il task statement della guida (`"d.n"`).
- `sim: 1` mette la domanda nella banca di simulazione, `hard: 1` la segna come difficile (si vede solo in
  correzione), `off: 1` la segna come domanda d'esempio della guida. Senza `sim` è una domanda di allenamento.
- La risposta corretta si scrive sempre per prima (`a: [0]`); per le domande "Which TWO" si danno 5 opzioni e
  `a: [0, 1]`. La pagina mescola le opzioni a ogni presentazione.
- Un file nuovo va aggiunto ai tag `<script>` in fondo a `index.html`.

### Usarla come modello per un altro esame

Sostituisci i file in `domande/`, aggiorna in `index.html` le costanti `SCEN` (scenari) e `DOM` (domini e pesi), la
sezione Teoria e i numeri della Panoramica. Il resto (allenamento, simulazione a tempo, statistiche, errori) non
dipende dai contenuti.

## Fonte e avvertenze

Materiale non ufficiale, non affiliato ad Anthropic né approvato da Anthropic. Si basa solo sulla guida d'esame
pubblica *Claude Certified Architect – Foundations Exam Guide* (versione 1.1): da lì vengono i testi dei 6 scenari e
12 domande d'esempio, che restano di Anthropic. Tutte le altre domande sono scritte per l'allenamento e non sono
domande d'esame. La guida può cambiare: in caso di differenze vale la versione ufficiale in vigore.

## Licenza

[MIT](LICENSE), per il codice e per le domande scritte qui; non per i testi ripresi dalla guida.
