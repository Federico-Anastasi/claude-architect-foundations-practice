// Scenario 2 · Code Generation with Claude Code · practice pool
Q({ id: "s2-n01", s: 2, d: 3, t: "3.1",
  q: "Two instructions are being added to Claude Code's configuration: (1) 'run `make lint` after every edit', which is team policy, and (2) 'start each reply with a one-line summary', which is one developer's personal taste. Where should each one go?",
  o: [
    "The lint rule in the project CLAUDE.md, shared through version control; the summary preference in that developer's own `~/.claude/CLAUDE.md`.",
    "Both in the project CLAUDE.md, with the personal preference marked as optional so that teammates are free to ignore it in their own sessions.",
    "The lint rule in the `~/.claude/CLAUDE.md` of each developer, and the summary preference in the project CLAUDE.md so that it is easy to find.",
    "Both in the `~/.claude/CLAUDE.md` of the developer who proposed them, who then shares that file with the team through the chat.",
  ], a: [0],
  e: "La regola di team va nel CLAUDE.md di progetto, versionato e uguale per tutti; la preferenza personale va nel livello utente, che non viene condiviso. Mettere entrambe nel progetto impone un gusto personale a tutti (e 'opzionale' è solo un'istruzione che Claude può applicare comunque); invertirle fa mancare la regola di team a chi non l'ha copiata; condividere il file utente in chat crea copie divergenti." });

Q({ id: "s2-n02", s: 2, d: 3, t: "3.1",
  q: "Which TWO statements about the CLAUDE.md configuration hierarchy in Claude Code are correct?",
  o: [
    "Instructions in `~/.claude/CLAUDE.md` apply only to that user's sessions and are not shared with teammates through version control.",
    "A project-level CLAUDE.md can sit at the repository root or in `.claude/CLAUDE.md`, and it is shared with the team through version control.",
    "Subdirectory CLAUDE.md files are not supported: Claude Code reads the root CLAUDE.md and ignores any file placed in subfolders.",
    "Files in `.claude/rules/` can be used only in repositories that have no root CLAUDE.md, because the two mechanisms exclude each other.",
    "The `/memory` command copies a developer's user-level instructions into the project so that teammates receive them automatically.",
  ], a: [0, 1],
  e: "Il livello utente non è condiviso: solo il CLAUDE.md di progetto (nella root o in `.claude/CLAUDE.md`) viaggia nel repository e raggiunge il team. La gerarchia prevede anche i CLAUDE.md di sottocartella, quindi dire che vengono ignorati è sbagliato. `.claude/rules/` è un'alternativa o un complemento a un CLAUDE.md monolitico, non un meccanismo esclusivo. `/memory` serve a verificare quali file di memoria sono caricati, non a pubblicare istruzioni personali." });

Q({ id: "s2-n03", s: 2, d: 3, t: "3.2",
  q: "Your `/audit-dependencies` skill reads hundreds of lockfile entries and runs with `context: fork`. A developer asks what ends up in the main conversation after the skill finishes. What is the correct answer?",
  o: [
    "Only the skill's final result; the intermediate file reads and reasoning stay in the isolated sub-agent context.",
    "The complete transcript of the skill's run, collapsed into a single message so that it takes less space on the screen.",
    "Nothing at all: a forked skill can only write to files, and its findings have to be read from disk afterwards.",
    "Every tool result that the skill produced, because the sub-agent shares the main conversation's memory while it runs.",
  ], a: [0],
  e: "Con `context: fork` la skill gira in un contesto di subagent isolato: nella conversazione principale torna solo il risultato finale, mentre letture e ragionamenti intermedi restano nel contesto isolato. Non viene riversata l'intera trascrizione; la skill non è limitata a scrivere su file; e il subagent non condivide la memoria della conversazione principale mentre lavora." });

Q({ id: "s2-n04", s: 2, d: 3, t: "3.2",
  q: "A developer built a `/gen-api-client` skill that scaffolds typed API clients and keeps it in their own `~/.claude/skills/` folder, so teammates cannot see it. The team wants every developer to get it automatically when they pull the repository. What should the developer do?",
  o: [
    "Move the skill into `.claude/skills/` in the repository and commit it, so that it is available to everyone through version control.",
    "Send the SKILL.md file to each teammate, who copies it into their own `~/.claude/skills/` folder on their machine.",
    "Convert the skill's instructions into a section of the project CLAUDE.md, so that they are loaded in every session of every developer.",
    "Register the skill in the project `.mcp.json`, so that teammates' sessions discover it together with the shared MCP servers.",
  ], a: [0],
  e: "Le skill di progetto stanno in `.claude/skills/` nel repository: sono versionate e disponibili a chiunque cloni o faccia pull. Copiare il file a mano crea versioni divergenti; convertirla in CLAUDE.md la renderebbe sempre caricata invece che su richiesta; `.mcp.json` configura server MCP, non skill." });

Q({ id: "s2-n05", s: 2, d: 3, t: "3.3",
  q: "GraphQL schema conventions (naming, pagination, deprecation notes) were moved out of the root CLAUDE.md into `standards/graphql.md`, which the root file imports with `@standards/graphql.md`. Token usage per session did not change: sessions that never touch a schema still carry them. The conventions must keep applying automatically whenever `.graphql` files are edited. What fixes this?",
  o: [
    "Make it a `.claude/rules/` file with `paths: [\"**/*.graphql\"]` in its frontmatter, so it loads only when schema files are edited.",
    "Replace the `@import` line with a condensed summary of the GraphQL conventions written directly into the root CLAUDE.md file.",
    "Convert the standards into a skill that backend developers are expected to invoke before they start touching any schema file.",
    "Move the `@import` line into the `~/.claude/CLAUDE.md` of each backend engineer, so that other developers stop loading it.",
  ], a: [0],
  e: "`@import` rende il CLAUDE.md modulare, ma il contenuto importato viene comunque caricato in ogni sessione. Una regola in `.claude/rules/` con `paths` si attiva solo quando si modificano file corrispondenti, riducendo contesto e token e restando automatica. Un riassunto nel file di root è sempre caricato; la skill richiede un'invocazione manuale; spostare l'import nel livello utente non lo condivide con il team." });

Q({ id: "s2-n06", s: 2, d: 3, t: "3.3",
  q: "Your repository has React component tests (`*.test.tsx`) and Node service tests (`*.spec.ts`), both spread across many directories next to the code they test. The two groups follow different conventions (testing-library queries versus supertest and shared fixtures). What is the most effective setup?",
  o: [
    "Two `.claude/rules/` files, each with `paths` globs for one test family (`**/*.test.tsx` and `**/*.spec.ts`), so only the matching conventions load.",
    "One `.claude/rules/` file listing both globs in `paths` and holding both sets of conventions, relying on Claude to apply the right set per file.",
    "A CLAUDE.md in every directory that contains tests, each holding the conventions for the kinds of tests that live in that directory.",
    "Two sections in the root CLAUDE.md, one per test family, with a note asking Claude to infer from each file's name which section applies.",
  ], a: [0],
  e: "Un file di regole per famiglia, con glob distinti, carica solo le convenzioni pertinenti a prescindere da dove sta il file. Un unico file con entrambi i set carica sempre anche le convenzioni sbagliate e affida a Claude la scelta; un CLAUDE.md per cartella non regge file sparsi in molte directory e va duplicato; le sezioni nel CLAUDE.md di root si basano sull'inferenza." });

Q({ id: "s2-n07", s: 2, d: 3, t: "3.4",
  q: "You asked Claude to add audit logging to the checkout service using direct execution. After three files, Claude reports that the logging requires changing the shared event bus used by about 25 services, and that two different designs would work (extend the existing bus, or add a separate audit stream). What is the most appropriate next step?",
  o: [
    "Stop making changes and move to plan mode, to explore the services that depend on the event bus and choose between the two designs.",
    "Continue in direct execution and adjust each dependent service as the build or the tests reveal that it breaks.",
    "Finish the checkout service first with the design Claude was already using, and leave the other 24 services to follow-up tickets.",
    "Revert the three edited files and restart in direct execution with a longer prompt that fixes one of the two designs in advance.",
  ], a: [0],
  e: "La complessità è emersa in corso d'opera: ci sono più approcci validi e un impatto su molti servizi. Il passo giusto è fermarsi e passare a plan mode per esplorare le dipendenze e decidere il design prima di modificare altro. Proseguire a tentativi o rimandare il resto ai ticket successivi lascia il sistema incoerente; scegliere un design a priori senza esplorare presuppone di conoscere già la risposta." });

Q({ id: "s2-n08", s: 2, d: 3, t: "3.4",
  q: "You are asked to change `getOrder()` in `orders/service.ts` so that `createdAt` is returned as an ISO 8601 string instead of a Unix timestamp. It is a single function, but a quick search shows it is called from many modules, some of which do arithmetic on the value. What is the most appropriate approach?",
  o: [
    "Use plan mode to map every consumer of `getOrder()` and design the change, then switch to direct execution to implement it.",
    "Use direct execution: it is a one-function change, so edit it first and let the test suite reveal which consumers break afterwards.",
    "Use direct execution and ask Claude to fix any caller that it happens to notice while it edits the function.",
    "Use plan mode for the design, then stay in plan mode while the callers are updated so that every edit is reviewed.",
  ], a: [0],
  e: "Il cambio sembra locale ma il perimetro non è chiaro: molti consumatori dipendono dal formato. Serve prima esplorare e progettare (plan mode), poi implementare in direct execution. Modificare subito e affidarsi ai test o al caso lascia scoperti i chiamanti; plan mode serve a esplorare e progettare, non è la modalità in cui si applicano le modifiche." });

Q({ id: "s2-n09", s: 2, d: 3, t: "3.4",
  q: "Your team lead mandates plan mode for every Claude Code task. After a month, developers report that about half of their tickets are small, precisely specified fixes (a missing null check, a typo in an error message) that now take twice as long. What adjustment best fits the recommended practice?",
  o: [
    "Reserve plan mode for large-scale or architectural work, and use direct execution for well-scoped changes with a known cause.",
    "Drop plan mode entirely and rely on direct execution plus careful code review, since planning slows delivery on every kind of task.",
    "Keep plan mode for every task, but ask Claude to write shorter plans whenever the ticket looks small to the developer.",
    "Use direct execution first for every task, and fall back to plan mode only after a direct attempt has failed.",
  ], a: [0],
  e: "Plan mode è pensato per cambi ampi, con più approcci validi o decisioni architetturali; i cambi piccoli e ben delimitati si fanno in direct execution. Abolire plan mode toglie la protezione dal rifacimento nei lavori complessi; piani più corti restano un passaggio inutile; usarlo solo dopo un fallimento significa scoprire la complessità a costo già pagato." });

Q({ id: "s2-n10", s: 2, d: 3, t: "3.5",
  q: "A review of Claude's work on a checkout flow produced five comments. Three of them interact: the cart total rounding, the discount order and the tax calculation all depend on one another. The other two are independent: a typo in a log message and a missing `alt` attribute in a template. How should you ask for the fixes?",
  o: [
    "Send the three interacting comments together in one detailed message, and handle each of the two independent ones in its own request.",
    "Send all five comments in a single message, so that Claude can fix everything in one pass and keep the whole checkout flow consistent.",
    "Handle all five one at a time, in order of severity, verifying each fix before sending the comment that comes after it.",
    "Send the two independent comments together first, then the three interacting ones one at a time so that each fix is verified.",
  ], a: [0],
  e: "Si raggruppano i problemi che interagiscono (arrotondamento, sconto e tasse: cambiare uno cambia come impostare gli altri) in un unico messaggio dettagliato, mentre quelli indipendenti si affrontano separatamente. Mandare tutto insieme mescola cose non correlate; fare tutto in sequenza, o i tre interdipendenti uno alla volta, rischia correzioni incoerenti tra loro." });

Q({ id: "s2-n11", s: 2, d: 3, t: "3.5",
  q: "A user reports that `parseDuration('1h30m')` returns 90 instead of 5400. Claude's first fix handled that input, but the function now fails on `'45s'` and `'2h'`. Your earlier explanations of the intended behavior were all in prose. What is the most effective next step?",
  o: [
    "Give Claude a table of inputs and exact expected outputs (`'1h30m'` to 5400, `'45s'` to 45, `'2h'` to 7200) to satisfy.",
    "Ask Claude to explain in prose how the function is supposed to work, and then repeat the original request unchanged.",
    "Tell Claude that its fix is wrong and ask it to try again, so that it searches for a different solution on its own.",
    "Ask Claude to special-case each of the three reported inputs so that they return the expected values in every environment.",
  ], a: [0],
  e: "Quando la descrizione in prosa porta a risultati incoerenti, casi concreti con input ed output attesi permettono di vedere esattamente il comportamento voluto e di iterare sui fallimenti. Far spiegare a parole o dire solo che è sbagliato non aggiunge informazione; trattare i tre input come casi speciali non rende corretta la funzione per gli altri." });

Q({ id: "s2-n12", s: 2, d: 3, t: "3.6",
  q: "A CI job runs `claude -p` to generate a Markdown page for each changed module, and a script must write each page to `docs/<module>.md`. The script currently splits Claude's free-text output on a delimiter line, and it breaks whenever a page contains that delimiter text. What is the most robust fix?",
  o: [
    "Use `--output-format json` with a `--json-schema` of objects with `module` and `markdown`, and write each to its file.",
    "Choose a rarer delimiter string, and tell Claude in the prompt never to print that string inside any page it generates.",
    "Ask Claude to produce all pages as one long Markdown file, and let the script cut it at the module headings.",
    "Validate the output with a regular expression in the script, and re-run the whole job whenever the split fails.",
  ], a: [0],
  e: "Per un output che uno script deve consumare serve una struttura garantita: `--output-format json` con `--json-schema` produce oggetti leggibili da macchina, senza dipendere da delimitatori nel testo. Un delimitatore più raro con il divieto nel prompt resta probabilistico; spezzare per intestazioni o rilanciare in caso di errore mantengono il parsing fragile." });

Q({ id: "s2-n13", s: 2, d: 3, t: "3.6",
  q: "Your team lead asks why the pipeline should review generated code in a second, independent Claude Code invocation instead of asking the generating session to review its own work more carefully. Which explanation is correct?",
  o: [
    "The generating session keeps its own reasoning context and is less likely to question its earlier decisions, while a fresh instance has no such context.",
    "A second invocation has access to a larger tool set than the generating session, so it can run checks that the first one cannot.",
    "The generating session's context window is almost always exhausted after producing a change, so it cannot read the diff again.",
    "Self-review is blocked when Claude Code runs non-interactively, so a separate invocation is the only way to obtain any review at all.",
  ], a: [0],
  e: "Il modello che ha generato il codice conserva il contesto del proprio ragionamento ed è meno incline a mettere in discussione le scelte fatte nella stessa sessione: un'istanza indipendente, senza quel contesto, individua meglio i problemi sottili. Non c'entrano gli strumenti disponibili, la saturazione della finestra di contesto o un presunto blocco dell'auto-revisione in modalità non interattiva." });

Q({ id: "s2-n14", s: 2, d: 5, t: "5.4",
  q: "You have spent 90 minutes tracing how invoices flow through a legacy billing module, with Claude reading many files and running searches. The context is now full of verbose discovery output, but you want to keep working in this same session with the conclusions reached so far. What is the most appropriate step?",
  o: [
    "Run `/compact` to shrink the verbose discovery output while keeping the key conclusions, then continue in the same session.",
    "Start a brand-new session and ask Claude to rediscover the flow from the beginning, since a clean context always gives better answers.",
    "Ask Claude to re-read every file it has already examined, so that the full detail is fresh again at the end of the context.",
    "Switch to a model with a larger context window and keep going without changing anything else about the session.",
  ], a: [0],
  e: "`/compact` riduce il contesto occupato da output di scoperta verboso mantenendo le conclusioni, ed è lo strumento per le sessioni di esplorazione lunghe. Ripartire da zero butta via il lavoro fatto; rileggere tutti i file riempie di nuovo il contesto; una finestra più grande rinvia il problema senza trattare l'accumulo di output verboso." });

Q({ id: "s2-n15", s: 2, d: 5, t: "5.4",
  q: "You finish the day after a two-hour exploration of a legacy order system and will start a new session tomorrow instead of resuming this one. You want to avoid repeating the exploration. What should you do before closing the session?",
  o: [
    "Have Claude write the key findings (classes, files, flows, open questions) to a notes file, and begin tomorrow's session by reading it.",
    "Keep the terminal open overnight, so that tomorrow's work continues in exactly the same context without any extra step.",
    "Tell Claude to remember the findings, and tomorrow ask it to continue exploring from where it left off yesterday.",
    "Save the full terminal output of the session to a file, and paste all of it into the first message of tomorrow's session as the starting context.",
  ], a: [0],
  e: "Un file di appunti con le scoperte specifiche persiste oltre il confine di contesto: la nuova sessione lo legge e riparte senza rifare l'esplorazione. Un terminale aperto non è una strategia di persistenza; chiedere a Claude di 'ricordare' non sopravvive a una nuova sessione; incollare tutto l'output grezzo riempie subito il contesto di dettagli non filtrati." });

Q({ id: "s2-n16", s: 2, d: 5, t: "5.1",
  q: "You paste into one prompt a 40-page design document, 25 file excerpts and a list of 12 acceptance requirements, and ask Claude to implement the feature. The requirements sit between the design document and the excerpts. The generated code ignores several of them, while details at the start and at the end of the prompt are respected. Which change helps most?",
  o: [
    "Put a summary of the key requirements at the start of the input and organize the rest under explicit section headers.",
    "Move the requirements list to the middle of the prompt, so that it is surrounded by the material it refers to.",
    "Repeat the sentence 'follow all 12 requirements' in capital letters at several points inside the prompt.",
    "Split the input into 12 separate requests, one per requirement, and merge the 12 generated patches into one change afterwards.",
  ], a: [0],
  e: "I modelli elaborano bene l'inizio e la fine di input lunghi ma possono trascurare il centro (effetto 'lost in the middle'). Un riepilogo dei punti chiave in apertura e sezioni con intestazioni esplicite mitigano l'effetto. Mettere i requisiti al centro peggiora il problema; ripetere in maiuscolo non cambia la posizione; dodici richieste separate perdono coerenza e obbligano a unire patch contraddittorie." });

Q({ id: "s2-n17", s: 2, d: 5, t: "5.1",
  q: "A Claude Code session on a refactoring investigation is running out of context. Which TWO changes reduce context consumption without losing information the task needs?",
  o: [
    "Make test and build commands report only the failing cases and their messages instead of printing every passing test.",
    "Instruct investigation subagents to return structured key facts (file path, symbol, one-line relevance) instead of full file contents and reasoning.",
    "Replace exact error codes, versions and line numbers in earlier notes with approximate descriptions to make the notes shorter.",
    "Put the key findings in the middle of the aggregated input, between the detailed sections, where they are easiest to locate.",
    "Keep every raw tool result in the conversation, since the model can simply ignore whatever it does not need.",
  ], a: [0, 1],
  e: "Si riduce il consumo tagliando l'output dei tool alle sole parti pertinenti (qui, solo i test falliti) e facendo restituire ai subagent dati strutturati invece di contenuti e ragionamenti verbosi. Approssimare codici, versioni e numeri perde proprio i dettagli che servono; i risultati chiave a metà input stanno nella zona che il modello trascura; tenere ogni output grezzo fa crescere il contesto in modo sproporzionato rispetto alla rilevanza." });

Q({ id: "s2-n18", s: 2, d: 5, t: "5.1",
  q: "In one long session you fix three bugs for three tickets (`PAY-101`, `PAY-102`, `PAY-103`), each with its own stack trace, file and acceptance test. After the context is condensed, Claude applies the fix for one ticket to the file of another. What is the best way to prevent this?",
  o: [
    "Keep a structured record per ticket (ID, error, file, test, status) in a notes file that Claude re-reads, outside the summary.",
    "Ask Claude to summarize the three tickets in a single paragraph, so that the condensed history stays short and uniform.",
    "Paste the three stack traces again at the end of every message, so that they always remain near the most recent part of the conversation.",
    "Switch to a larger context window, so that the three tickets never need to be condensed in the first place.",
  ], a: [0],
  e: "In una sessione con più problemi, i dati strutturati (ID, errore, file, test, stato) vanno tenuti in un livello separato, fuori dalla cronologia riassunta, così il riassunto non può mescolarli. Un unico paragrafo di sintesi proprio quello fa perdere; incollare di nuovo gli stack trace gonfia il contesto; una finestra più grande non evita che una sessione lunga venga condensata." });

Q({ id: "s2-n19", s: 2, d: 5, t: "5.2",
  q: "Asked to 'update the timeout in `config.ts`', Claude Code finds eleven files named `config.ts` in different packages, three of which contain a `timeout` setting. The request does not say which package is meant. What should Claude do?",
  o: [
    "Ask the developer which package is meant, listing the three candidate files, before changing anything.",
    "Pick the file that was modified most recently, since that is where the developer is most likely to be working.",
    "Update the `timeout` in all three files, so that whichever one was intended is covered by the change.",
    "Choose the `config.ts` closest to the repository root, since shared configuration is the most likely target.",
  ], a: [0],
  e: "Con più corrispondenze plausibili si chiede un chiarimento (qui, quale pacchetto) invece di scegliere con un'euristica: il costo di una domanda è minimo, quello di modificare il file sbagliato no. 'Più recente' e 'più vicino alla root' sono euristiche arbitrarie; cambiarli tutti e tre altera configurazioni che potrebbero non c'entrare." });

Q({ id: "s2-n20", s: 2, d: 5, t: "5.3",
  q: "A `dead-code-finder` subagent searches the repository for callers of `legacyFormatDate()` and reports to the main session. The search completes normally and finds no callers, but the subagent returns 'search failed: no results', and the main session keeps retrying with different patterns. What should the subagent return?",
  o: [
    "A successful result stating that the search covered the whole repository and found zero callers, as a real finding.",
    "A structured error with `isRetryable: true`, so that the main session tries the search again with broader patterns.",
    "A generic status such as 'inconclusive', so that the main session decides whether the result is worth trusting.",
    "The empty result plus a list of alternative search terms, so that the main session can run those as well if it wants to.",
  ], a: [0],
  e: "Una query riuscita senza corrispondenze è un risultato valido (qui: nessun chiamante, quindi la funzione è candidata alla rimozione) e va distinta da un errore di accesso; restituirla come fallimento fa ripetere ricerche inutili. Un errore ritentabile o uno stato generico nascondono che la ricerca è andata a buon fine; suggerire altri termini presuppone che manchi qualcosa." });
