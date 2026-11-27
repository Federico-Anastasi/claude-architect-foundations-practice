// Scenario 2 · Code Generation with Claude Code · hard simulation questions
Q({ id: "h2-01", s: 2, d: 3, t: "3.4", sim: 1, hard: 1,
  q: "A ticket asks you to stop `getExchangeRate()` in `rates/service.ts` from calling the external rates API on every request, because the provider is rate-limiting your account. Everything that must change is in that one file, and the ticket is two sentences long. The team has not decided between an in-process cache (no new infrastructure, but each of the 12 service instances keeps its own copy) and a shared Redis cache (consistent across instances, but a new cluster must be provisioned and operated). Which way of working with Claude Code fits best?",
  o: [
    "Start in plan mode to explore how the rates are used and compare both designs against the infrastructure each needs, settle the design before any edit, then switch to direct execution to implement it.",
    "Use direct execution, because the change is confined to a single file with a clear goal, and revisit the choice of cache in code review if the team prefers the other design.",
    "Use direct execution and tell Claude to implement the in-process cache, because it needs no new infrastructure and can be replaced later if the instances drift apart.",
    "Delegate to the Explore subagent to summarize how the rates are consumed across the service instances, then implement directly with whichever design that summary points to.",
  ], a: [0],
  e: "Il numero di file non decide: conta che la scelta tra cache in-process e Redis condivisa è una decisione architetturale, con requisiti infrastrutturali diversi, ancora aperta. Il plan mode serve proprio a esplorare e confrontare gli approcci prima di toccare il codice; poi si passa all'esecuzione diretta per implementare il design scelto. Eseguire subito sul principio «un solo file», o fissare l'in-process per comodità, impone una decisione che il team non ha preso e rischia un rifacimento costoso. Il subagente Explore isola l'output verboso della scoperta, ma qui non c'è output verboso da isolare e non confronta né sceglie tra i due design." });

Q({ id: "h2-02", s: 2, d: 3, t: "3.5", sim: 1, hard: 1,
  q: "A review of Claude's order-export feature left five comments. Comments 1 and 2 describe one mismatch: `export/serializer.ts` emits `total` as a string (comment 1) while `export/client.ts` parses it as a number (comment 2), and the right fix on each side depends on the choice made on the other. Comments 3, 4 and 5, all in `export/serializer.ts`, are a typo in a log message, a missing null check on `order.coupon` and an unused import; none of them affects the others or the first two. All five came from the same reviewer in one pass. How should you ask Claude for the fixes?",
  o: [
    "Send comments 1 and 2 together in one detailed message, because their fixes interact, and handle each of comments 3, 4 and 5 in its own request.",
    "Group by file: one message with the four comments on `export/serializer.ts` (1, 3, 4 and 5) and a second request for the comment on `export/client.ts` (2).",
    "Send all five comments in a single detailed message, because they come from one review of one feature and Claude can then plan the whole change.",
    "Fix the five comments one at a time in the order of the review, so that each change can be verified in isolation before the next one starts.",
  ], a: [0],
  e: "Il criterio è l'interazione tra le correzioni, non il file né l'origine dei commenti. I commenti 1 e 2 sono le due metà dello stesso disallineamento: la scelta su un lato condiziona l'altro, quindi vanno descritti insieme in un unico messaggio dettagliato. I commenti 3, 4 e 5 sono indipendenti e si trattano in sequenza, ciascuno nella propria richiesta. Raggruppare per file separa proprio la coppia che interagisce e unisce correzioni che non c'entrano tra loro; la sequenza di cinque richieste spezza la coppia, con il rischio di sistemare un lato senza l'altro, e il messaggio unico ignora la distinzione tra problemi indipendenti e interagenti." });

Q({ id: "h2-03", s: 2, d: 3, t: "3.5", sim: 1, hard: 1,
  q: "The team's `.claude/rules/error-messages.md`, committed to the repository, says in a single line: 'Write clear, consistent error messages that identify the failing entity.' Claude Code still produces `Failed to load order 42` in some handlers, `Order could not be loaded (id=42)` in others, and sometimes leaves the order id out entirely. Running `/memory` in the sessions that produced the inconsistent messages shows `error-messages.md` among the loaded files. What is the most effective fix?",
  o: [
    "Keep the rule file where it is and add two or three concrete before/after examples of the exact message format, including one case where the id was missing.",
    "Import the rule from the root CLAUDE.md with an `@import` line, so that it is guaranteed to be loaded in every session that touches any error handling code at all.",
    "Add a `paths` field with a glob for the handler files to the rule's frontmatter, so that the rule is loaded whenever those files are being edited by anyone.",
    "Turn the rule into a `/error-messages` skill and ask developers to run it before writing any handler, so that the guidance is applied deliberately.",
  ], a: [0],
  e: "L'evidenza di `/memory` esclude un problema di caricamento: la regola è già presente nelle sessioni che sbagliano, quindi il difetto sta nella formulazione, una descrizione in prosa che il modello interpreta in modi diversi. Il rimedio indicato è fornire 2-3 esempi concreti di input/output, qui il formato esatto del messaggio prima e dopo, incluso il caso in cui l'id mancava. `@import` e `paths` cambiano dove e quando la regola viene caricata, non come viene interpretata, e `paths` ridurrebbe soltanto i token. Una skill invocata a mano toglie l'applicazione automatica e lascia la stessa frase ambigua." });

Q({ id: "h2-04", s: 2, d: 3, t: "3.6", sim: 1, hard: 1,
  q: "A nightly CI job runs `claude -p` to propose unit tests for each module that changed that day, usually 20 to 40 modules. Reviewers report two problems: many proposed tests repeat scenarios that the module's existing tests already cover, and many others are low-value (trivial getters, objects built by hand instead of the team's shared fixtures). Developers who use Claude Code interactively need the same testing standards, and the existing tests change with every merge. Where should the fixes go?",
  o: [
    "Document the testing standards, valuable-test criteria and fixture catalog in the project CLAUDE.md, and give each run the existing test files of its module.",
    "Document the standards and the fixture catalog in the project CLAUDE.md, together with a hand-maintained summary of the scenarios that each module's existing tests already cover.",
    "Put the standards, the fixture catalog and an instruction to avoid duplicate scenarios in the job's prompt string, so that every nightly run receives the same complete instructions.",
    "Give each run the existing test files of its module and the standards in the job's prompt, and let developers copy the same text into their own interactive sessions.",
  ], a: [0],
  e: "Ci sono due tipi di contesto con vita diversa. Standard di test, criteri di un test di valore e catalogo delle fixture sono stabili e servono anche agli sviluppatori: stanno nel CLAUDE.md di progetto, che ogni esecuzione di `claude -p` carica. I test esistenti cambiano a ogni merge e dipendono dal modulo: vanno forniti nel contesto di ogni run, così non si propongono scenari già coperti. Un riepilogo scritto a mano nel CLAUDE.md invecchia subito; nel prompt del job gli standard restano duplicati e non raggiungono le sessioni interattive, e un'istruzione «evita i duplicati» senza i test esistenti non dà a Claude nulla su cui confrontare." });

Q({ id: "h2-05", s: 2, d: 3, t: "3.5", sim: 1, hard: 1,
  q: "You wrote a test suite first and asked Claude to implement a CSV-to-database importer against it. The 36 tests cover normal rows, empty fields, quoted delimiters and malformed lines, and Claude's implementation passes all of them. On the real 2-million-row file the import takes 41 minutes, while the agreed budget is 5 minutes; profiling shows the time spread evenly across parsing, validation and inserting. The suite runs in CI on every change. What is the most effective next step?",
  o: [
    "Add a performance test that runs the importer on a large generated input against a limit derived from the budget, check that it fails, then share its output with Claude and iterate.",
    "Tell Claude in a detailed message that the importer must become about eight times faster without changing its behavior, and ask it to optimize every stage of the pipeline carefully.",
    "Provide two or three input/output examples of CSV rows and the expected database contents, so that Claude understands precisely what correct behavior means.",
    "Use the interview pattern so that Claude asks you questions about performance considerations and failure modes before it touches the code again.",
  ], a: [0],
  e: "Tutti i test passano perché la suite non esprime il requisito violato: il budget di 5 minuti. Il test-driven va esteso anche ai requisiti di prestazione, oltre a comportamento e casi limite: un test con input grande e limite di tempo fallisce, il suo output guida l'iterazione e resta in CI come barriera contro le regressioni. Una richiesta in prosa di «essere più veloce» non è verificabile e può alterare il comportamento; gli esempi input/output chiariscono la correttezza, che qui è già a posto; l'interview fa emergere considerazioni non previste, ma il requisito è già noto e quantificato." });

Q({ id: "h2-06", s: 2, d: 5, t: "5.3", sim: 1, hard: 1,
  q: "Your main Claude Code session delegates 'find every caller of the deprecated `legacyFormatDate()`' to a search subagent, covering three directories: `app/`, `libs/` and `vendor/`. The subagent searches `app/` and `libs/` without finding a match. On `vendor/` the search tool returns a permission-denied error caused by a repository access policy that will not change during the session. Which TWO behaviors should the subagent's report include?",
  o: [
    "State that `app/` and `libs/` were fully searched and contain zero callers, reported as a valid empty result and not as a failure.",
    "Report `vendor/` as an unresolved access failure, naming the failure type and the search that was attempted, so that the session can decide how to handle the gap.",
    "Retry the `vendor/` search several times with exponential backoff before reporting anything, since failures should be recovered from locally inside the subagent.",
    "Return a single 'search failed' status for the whole task, because the search could not be completed as requested across all three directories.",
    "Return 'no callers found' as a successful result for all three directories, since no error was raised for the first two and the denial is only a technicality.",
  ], a: [0, 1],
  e: "Qui servono due informazioni distinte. Le due directory cercate senza risultati sono un risultato vuoto valido, non un errore: la sessione deve sapere che lì non ci sono chiamanti. Il rifiuto su `vendor/` è un errore di accesso non risolto: va riportato con tipo di errore e ricerca tentata, così la sessione decide se chiedere un permesso o accettare la lacuna. Il recupero locale vale per i guasti transitori, ma il vincolo di accesso non cambierà durante la sessione, quindi i retry sono tempo perso. Uno stato generico «search failed» nasconde i risultati validi e il contesto; presentare tutto come «nessun chiamante» sopprime l'errore e fa credere che `vendor/` sia stata controllata." });

Q({ id: "h2-07", s: 2, d: 5, t: "5.4", sim: 1, hard: 1,
  q: "In one Claude Code session you spent 70 minutes mapping a legacy billing module: its entry points, the three-step retry flow, the `LedgerEntry` and `InvoiceLine` types and which files are safe to change. You now start three parallel subagents, each refactoring one sub-area. In a trial run each subagent re-scanned the module for about ten minutes and they named the shared `LedgerEntry` helper three different ways. A teammate suggests running `/compact` in the main session first so that the subagents start from a leaner context. What should you do?",
  o: [
    "Distil the mapping into a short structured brief (entry points, retry flow, shared types, naming decisions, safe files) and put it in each subagent's initial prompt.",
    "Run `/compact` as suggested, so that the subagents begin from the compacted state of the main session and no longer need to re-scan the module or to rename its shared types.",
    "Paste the main session's full conversation transcript into every subagent prompt, so that nothing found during the 70 minutes of mapping is ever lost.",
    "Start the subagents with only their own sub-area to keep them focused, and reconcile the names and structures they produce once all three of them have finished their work.",
  ], a: [0],
  e: "Il vincolo decisivo è che un subagente non eredita il contesto della sessione principale: vede solo ciò che sta nel suo prompt. Per questo la ri-scansione e i nomi divergenti si risolvono riassumendo i risultati della fase di mappatura (punti d'ingresso, flusso, tipi condivisi, decisioni di naming, file sicuri) e iniettando il riassunto nel prompt iniziale di ciascuno. `/compact` riduce il contesto della sessione principale ma non passa nulla ai subagenti. La trascrizione completa porta rumore e consuma il budget che il subagente dovrebbe usare per lavorare. Riconciliare a posteriori accetta la divergenza invece di prevenirla." });

Q({ id: "h2-08", s: 2, d: 5, t: "5.4", sim: 1, hard: 1,
  q: "A coordinator session in Claude Code runs six subagents in parallel to analyze six modules (`auth`, `billing`, `search`, `notifications`, `reports`, `admin`) before a library migration; each analysis takes about 25 minutes. Every subagent exports its findings to a known location, and the coordinator keeps a manifest of finished modules. The session crashes after `auth`, `billing`, `search` and `notifications` are complete, while `reports` and `admin` are unfinished. Overnight, a teammate merges a refactor that rewrites `billing` and `search`; nothing else changes. How should you recover?",
  o: [
    "Start a new coordinator session that loads the manifest, injects the saved findings for `auth` and `notifications` into the subagent prompts, and re-analyzes `billing`, `search`, `reports` and `admin`.",
    "Resume the crashed session with `--resume` and continue the two unfinished modules, so that all four completed analyses keep their original results.",
    "Load the manifest in a new session and analyze only `reports` and `admin`, trusting the four exported findings because the manifest marks those modules as complete.",
    "Discard the manifest and the exported findings and analyze all six modules again, so that every result reflects the code as it is now.",
  ], a: [0],
  e: "Decidono due fatti: il crash e il merge notturno. I risultati esportati di `auth` e `notifications` descrivono codice invariato e sono ancora validi: il coordinatore li carica dal manifest e li inietta nei prompt. Quelli di `billing` e `search` descrivono codice che non esiste più e vanno rifatti insieme ai due moduli rimasti incompiuti. Riprendere la sessione con `--resume` riporterebbe in vita risultati di strumenti ormai obsoleti; fidarsi di tutto il manifest propaga analisi stantie solo perché sono segnate come completate; rifare tutto butta via circa 50 minuti di lavoro ancora valido." });
