# Claude Certified Architect – Foundations · practice

An **unofficial** study page for the Claude Certified Architect – Foundations exam (exam code CCAR-F): condensed
theory, practice questions, timed mock exams and error review. One static HTML file: no install, no server. The
official exam guide is on the
[certification page](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification).

The questions are in English, like the guide's sample questions. The interface, the theory and the explanations are
in Italian.

## How to use it

Download the repository (or *Code → Download ZIP*) and open `index.html` in a browser. Sections:

- **Teoria** (theory): the exam heuristics and the guide's 5 domains, condensed, with the recurring traps.
- **Allenamento** (practice): one question at a time with immediate feedback, filtered by scenario, domain, or only
  the ones you got wrong.
- **Simulazione** (mock exam): 4 scenarios out of 6, 60 questions in 120 minutes, scored at submission; a short
  version has 30 questions in 60 minutes. It uses a separate question bank that never appears in practice, and serves
  questions you have never seen first.
- **Errori** (mistakes): the questions you got wrong last time, until you get them right.

Progress is kept in the browser's `localStorage`: no account, nothing sent anywhere.

The official exam reports a scaled score (720 on 100–1,000), not a percentage: the page uses 75–80% correct answers
as a cautious target.

## The questions

| Files | Bank | Questions |
|---|---|---|
| `domande/s1.js` … `s6.js` | practice, including the guide's 12 sample questions | 116 |
| `domande/s1n.js` … `s6n.js` | practice | 120 |
| `domande/sim1.js` … `sim6.js` | mock exam | 180 |
| `domande/hard1.js` … `hard6.js` | mock exam, hard | 48 |

The number in the file name is the scenario. Each question is a call to `Q(...)`:

```js
Q({ id: "x1-01", s: 1, d: 1, t: "1.1", sim: 1,
  q: "Question text.",
  o: [
    "The correct option, always first.",
    "A wrong option.",
    "A wrong option.",
    "A wrong option.",
  ], a: [0],
  e: "Explanation: why the right answer is right and the others are not, without citing option letters.",
});
```

- `id` unique; `s` scenario (1–6); `d` domain (1–5); `t` optional, the guide's task statement (`"d.n"`).
- `sim: 1` puts the question in the mock-exam bank; without it, it is a practice question. `hard: 1` marks it as hard
  (shown only when reviewing results); `off: 1` marks a sample question from the guide.
- The correct answer is always written first (`a: [0]`); "Which TWO" questions have 5 options and `a: [0, 1]`. The
  page shuffles the options every time.
- A new file must also be added to the `<script>` tags at the bottom of `index.html`.

### Using it as a template for another exam

Replace the files in `domande/`, and in `index.html` update the `SCEN` (scenarios) and `DOM` (domains and weights)
constants, the theory section and the figures on the overview page. Everything else (practice, timed mock exams,
statistics, mistakes) does not depend on the content.

## Source and disclaimer

Unofficial material, not affiliated with or endorsed by Anthropic. It is based only on the public *Claude Certified
Architect – Foundations Exam Guide* (version 1.1), which can be downloaded from the
[official certification page](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification)
on Anthropic Academy, together with registration and exam policies. The 6 scenario descriptions and 12 sample questions come from it
and remain Anthropic's. All other questions were written for practice and are not exam questions. The guide may
change: where they differ, the official version in force prevails.

## License

[MIT](LICENSE), for the code and the questions written here; not for the text taken from the guide.
