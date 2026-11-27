// Scenario 5 · Claude Code for Continuous Integration · practice pool
Q({ id: "s5-n01", s: 5, d: 3, t: "3.6",
  q: "Your merge gate runs `claude -p`, and a shell step greps the prose review for the word \"critical\" to block the merge. It blocks pull requests whose review says \"no critical issues found\", and it lets through reviews that call a serious flaw \"severe\" or \"a blocker\". What is the most reliable fix?",
  o: [
    "Run with `--output-format json` and a `--json-schema` requiring a `severity` enum on each finding, and make the gate step fail on any finding whose `severity` is `critical`.",
    "Instruct Claude to end every review with the single line `BLOCK` or `PASS`, and have the gate step match that line with a regular expression anchored to the end of the output.",
    "Extend the grep with a list of synonyms such as \"severe\", \"blocker\" and \"must fix\", and add handling for negations such as \"no critical\" or \"not critical\".",
    "Add a second Claude call that reads the prose review and answers yes or no on whether it describes a merge-blocking problem, and gate on that answer instead.",
  ], a: [0],
  e: "Un gate deterministico deve leggere un campo strutturato, non interpretare prosa: `--output-format json` con `--json-schema` e un enum `severity` riduce la decisione a un confronto su un valore. La riga `BLOCK`/`PASS` e la seconda chiamata restano affidate a testo libero e a un'interpretazione probabilistica; estendere il grep con sinonimi e negazioni insegue all'infinito le formulazioni possibili del modello." });

Q({ id: "s5-n02", s: 5, d: 3, t: "3.6",
  q: "Your review job re-runs after every push. To avoid duplicates, a pipeline script stores earlier findings as `file:line` keys and skips any new finding with a matching key. When developers add commits above the flagged code, the line numbers shift, and the bot re-posts comments for problems that are still open, now at different lines. What is the most effective change?",
  o: [
    "Give Claude the earlier findings as context and instruct it to report only issues that are new or still unaddressed in the current code.",
    "Match on `file` plus a window of 20 lines around the old line, and skip any new finding that falls inside the window of an earlier finding for that file.",
    "Re-post every finding on each run, but collapse the older ones into a single 'previous review' comment so that developers can skip over them.",
    "Review the diff against the first commit of the pull request instead of the latest one, so that the line numbers of earlier findings stay stable.",
  ], a: [0],
  e: "Quando si rilancia la review dopo nuovi commit, il modo corretto è passare a Claude i finding precedenti e chiedergli di riportare solo quelli nuovi o ancora aperti: sa riconoscere lo stesso problema anche se la riga è cambiata. La finestra di righe nasconde anche problemi nuovi vicini a quelli vecchi; il commento riassuntivo non elimina il rumore; confrontare con il primo commit cambia l'oggetto della review." });

Q({ id: "s5-n03", s: 5, d: 3, t: "3.1",
  q: "Your team needs to place three kinds of guidance for Claude Code: (1) one developer's preference for long explanations, (2) the review criteria that CI and every developer must follow, and (3) strict rules that apply only to the `payments/` package. Which placement is correct?",
  o: [
    "The explanation preference in `~/.claude/CLAUDE.md`, the review criteria in the project `CLAUDE.md`, and the payments rules in `payments/CLAUDE.md`.",
    "The explanation preference in the project `CLAUDE.md`, the review criteria in `~/.claude/CLAUDE.md`, and the payments rules in the project `CLAUDE.md`, under their own heading.",
    "The explanation preference in `payments/CLAUDE.md`, the review criteria in the project `CLAUDE.md`, and the payments rules in the developer's `~/.claude/CLAUDE.md`.",
    "All three in the project `CLAUDE.md`, with the personal explanation preference marked as optional for teammates who do not want it.",
  ], a: [0],
  e: "Ogni livello ha il suo scopo: il file utente (`~/.claude/CLAUDE.md`) vale solo per quella persona e non è condiviso; il CLAUDE.md di progetto arriva a tutti, CI compresa; quello nella directory `payments/` si applica solo a quel pacchetto. Scambiare i livelli rende i criteri di review invisibili alla CI, impone le preferenze personali ai colleghi o nasconde le regole di payments; mettere tutto nel file di progetto non isola nulla." });

Q({ id: "s5-n04", s: 5, d: 3, t: "3.2",
  q: "Your team keeps skills for its CI work in `.claude/skills/`. Which TWO of these are good candidates for `context: fork` in the SKILL.md frontmatter?",
  o: [
    "`/inventory-workflows`, which scans every workflow file in the monorepo and prints a very long inventory of triggers, runners and cache keys, of which developers only need a short summary.",
    "`/explore-cache-designs`, which brainstorms several alternative caching strategies for the build pipeline, most of which will be discarded after the developer picks one.",
    "`/fix-lint`, which applies formatting fixes to the files the developer is editing, so that the developer continues working with the edited files in the main conversation.",
    "`/ci-conventions`, which states the team's rule that every workflow pins its action versions and which should guide Claude in all sessions of the repository.",
    "`/pr-title`, which suggests a one-line pull request title from the current diff and returns a few words.",
  ], a: [0, 1],
  e: "`context: fork` esegue la skill in un contesto isolato: serve quando l'output è molto verboso (inventario) o esplorativo (alternative da scartare), così non inquina la conversazione principale. `/fix-lint` e `/pr-title` producono poco output che serve nella conversazione; `/ci-conventions` è uno standard universale, quindi va in CLAUDE.md e non in una skill a invocazione." });

Q({ id: "s5-n05", s: 5, d: 3, t: "3.3",
  q: "The root `CLAUDE.md` of a polyglot monorepo covers React conventions, Terraform conventions and SQL migration rules. Every CI review loads all of it although most pull requests touch one area, and reviews of Terraform-only changes sometimes apply React advice. What is the best restructuring?",
  o: [
    "Move each area's conventions into its own `.claude/rules/` file with a `paths` glob (for example `terraform/**/*`), so it loads only for matching files.",
    "Keep one `CLAUDE.md` but add clearer headers per area and an instruction to apply only the section that matches the files in the pull request.",
    "Create one skill per area and have the CI prompt invoke the right skill after inspecting the file extensions found in the pull request.",
    "Replace the root file with a `CLAUDE.md` in every subdirectory, copying each area's conventions into each folder that contains files of that area and keeping the copies in sync.",
  ], a: [0],
  e: "Le regole in `.claude/rules/` con `paths` si caricano solo quando si lavora su file corrispondenti: meno contesto irrilevante e meno applicazioni errate. Le sezioni in un solo file dipendono dall'inferenza del modello; le skill vanno invocate e non sono caricamento condizionale; copiare file in ogni cartella duplica le regole e le fa divergere." });

Q({ id: "s5-n06", s: 5, d: 3, t: "3.4",
  q: "You must add Claude-based review to the CI of a large repository. Two designs are plausible: a job on the existing hosted runners that calls `claude -p` for each pull request, or a separate internal review service fed by webhooks and a queue. They need different infrastructure and affect the workflows of several teams. How should you start?",
  o: [
    "Use plan mode to explore the repository and CI setup, compare both designs and their infrastructure needs, and settle on one before changing anything.",
    "Start with direct execution of the simpler hosted-runner job, and switch to the service design later if the job turns out to be too slow or too expensive.",
    "Write detailed upfront instructions for the queue-based service, since it is the more scalable design, and execute them directly.",
    "Build both designs in direct execution mode on parallel branches and keep whichever one passes its first test run.",
  ], a: [0],
  e: "Quando ci sono più approcci validi con requisiti infrastrutturali diversi e impatto su più team, la plan mode permette di esplorare e progettare prima di toccare il codice, evitando rifacimenti costosi. Partire in esecuzione diretta, scegliere a priori o costruire entrambe le soluzioni a caso rimandano la decisione architetturale a quando costa di più." });

Q({ id: "s5-n07", s: 5, d: 3, t: "3.5",
  q: "Claude Code wrote a script that turns the review's JSON findings into GitHub comment payloads. It crashes when a finding has `line: null` (a file-level finding), and your earlier prompt 'handle edge cases properly' changed nothing. What is the most effective next message?",
  o: [
    "Give specific test cases: an example finding with `line: null` as input and the exact payload you expect as output, then ask Claude to satisfy them.",
    "Ask Claude to rewrite the whole script from scratch with an emphasis on robustness and defensive coding for any missing values.",
    "Explain in prose how GitHub treats comments without a line number and ask Claude to work out for itself which other cases the script should also handle.",
    "Tell Claude the script must never crash, and ask it to wrap everything in a general `try`/`catch` that skips any finding that fails.",
  ], a: [0],
  e: "Per correggere un caso limite, esempi specifici con input e output attesi comunicano il comportamento voluto meglio di richieste generiche di robustezza. Riscrivere da zero o spiegare in prosa lasciano l'interpretazione al modello; il `try`/`catch` generale sopprime l'errore in silenzio e perde commenti." });

Q({ id: "s5-n08", s: 5, d: 3, t: "3.5",
  q: "You must add automatic quarantining of flaky tests to the CI pipeline, an area your team has never worked in. You can state the goal but are unsure which design questions matter (what counts as flaky, who is notified, how a test leaves quarantine). What should you ask Claude Code to do before it writes anything?",
  o: [
    "Interview you about flakiness thresholds, ownership, notification and exit from quarantine, then implement from your answers.",
    "Produce a first full implementation, so that you can react to concrete code and list what is missing afterwards.",
    "Write the feature specification itself from your own knowledge of flaky-test tooling, and implement it without further questions.",
    "Generate the complete test suite for the quarantine feature first and iterate by sharing the failing tests.",
  ], a: [0],
  e: "In un dominio poco noto l'interview pattern fa emergere considerazioni che lo sviluppatore non aveva previsto (soglie, responsabilità, uscita dalla quarantena) prima di implementare. Un'implementazione immediata o una specifica scritta dal modello fissano ipotesi non verificate; una suite di test presuppone di sapere già quale comportamento atteso scrivere." });

Q({ id: "s5-n09", s: 5, d: 4, t: "4.1",
  q: "The review bot comments on long-standing problems in files the pull request touches only slightly, such as an old naming inconsistency elsewhere in the file. Developers call these comments noise and have started ignoring the bot's comments on real bugs too. Which prompt change most directly improves precision?",
  o: [
    "Add an explicit criterion: report only bugs and security problems introduced or made worse by the changed lines; skip issues already present in untouched code.",
    "Add 'Only mention issues that are relevant to this pull request and that you are highly confident about' to the prompt, and leave the other instructions unchanged.",
    "Tell Claude to be conservative and to limit itself to the three most important findings per file, so that only the clearest problems are posted.",
    "Add 'Do not nitpick' to the prompt and raise the minimum severity needed to post a comment to 'high', so that low-impact remarks are filtered out.",
  ], a: [0],
  e: "Criteri espliciti e categorici su cosa segnalare (bug e problemi di sicurezza introdotti dal diff) e cosa saltare (codice preesistente) migliorano la precisione. Istruzioni generiche come 'rilevante', 'conservativo' o 'non fare nitpick' e tetti sul numero di finding non definiscono dove sta il confine e lasciano passare gli stessi falsi allarmi." });

Q({ id: "s5-n10", s: 5, d: 4, t: "4.1",
  q: "A security-focused review pass in CI posts many theoretical warnings, for example about `Math.random()` used for UI animation or about hashing algorithms inside test fixtures. Developers dismiss most of them, including genuine injection findings. Which revision of the security criteria improves precision most?",
  o: [
    "List what to report (user input reaching SQL, shell or file-path sinks; missing authorization; secrets in code) and what to skip (non-security randomness, test fixtures).",
    "Ask Claude to flag only security issues it is at least 90% sure are exploitable, and to stay conservative on everything else that it notices in the diff.",
    "Ask Claude to rate each security finding's exploitability from 1 to 10 and to drop every finding that scores under 7 before the comments are posted.",
    "Keep the criteria as they are, but ask Claude to add to each warning a note on why it might be a false alarm, so that developers can judge each one faster and dismiss it.",
  ], a: [0],
  e: "Criteri categorici con esempi di cosa riportare e cosa saltare sono più efficaci di soglie di confidenza, che il modello non calibra bene: un 'almeno 90%' o un punteggio da 1 a 10 non cambiano ciò che considera un problema. Aggiungere note sul possibile falso allarme aumenta il rumore invece di ridurlo." });

Q({ id: "s5-n11", s: 5, d: 4, t: "4.2",
  q: "Your reviewer flags every empty `catch` block as a swallowed error. Some are real problems, but in this codebase an empty `catch` is intentional in best-effort cleanup code, such as removing a temp file. Prose rules did not fix this, and every week a new variation of the acceptable pattern appears. Which technique works best?",
  o: [
    "Add 2-4 few-shot examples contrasting an acceptable best-effort cleanup `catch` with a genuine swallowed error, each with a short reason.",
    "Add a list of every cleanup helper in the codebase and tell Claude never to flag `catch` blocks that appear inside any of those cleanup helpers.",
    "Instruct Claude to flag an empty `catch` only when it is more than 90% confident that the block hides an actual failure.",
    "Remove the swallowed-error check from the prompt permanently, since it keeps producing false positives.",
  ], a: [0],
  e: "Esempi few-shot che affiancano il pattern accettabile al problema reale, con la motivazione, permettono al modello di generalizzare il giudizio anche a varianti nuove. Un elenco di helper copre solo i casi già noti; la soglia di confidenza non cambia il criterio; eliminare del tutto il controllo perde problemi reali." });

Q({ id: "s5-n12", s: 5, d: 4, t: "4.2",
  q: "Your test-generation job writes tests for the happy path of each function but rarely for the untested branches (error paths, early returns, boundary conditions). Instructions such as 'achieve thorough branch coverage' made no difference. What is the most effective addition to the prompt?",
  o: [
    "Few-shot examples, each showing a function, its existing tests and the untested branch worth covering, with the reasoning for why that gap matters.",
    "A longer checklist describing every kind of branch (error paths, early returns, boundary values) that Claude must tick off for each function it covers.",
    "An instruction to generate three times as many tests per function, so that more branches are likely to be covered by chance.",
    "A request for a confidence score on each generated test, keeping only the tests that score above 8 out of 10.",
  ], a: [0],
  e: "Quando le istruzioni dettagliate producono risultati incoerenti, gli esempi few-shot sono la tecnica più efficace; qui mostrano come individuare i buchi a livello di ramo e perché contano. Una checklist più lunga è ancora prosa; generare più test aumenta il volume ma non la mira; i punteggi di confidenza non indicano quali rami mancano." });

Q({ id: "s5-n13", s: 5, d: 4, t: "4.3",
  q: "Your review service forces Claude to call a `report_findings` tool whose schema marks `file`, `line` and `message` as required. For architectural concerns that apply to the whole pull request, Claude fills `line` with invented numbers, and the bot posts comments on unrelated lines. What schema change fixes this?",
  o: [
    "Make `line` nullable so that a finding without a precise location can leave it empty instead of inventing one, and post it as a PR-level comment.",
    "Keep `line` required and add to the prompt that the model must write `1` as the line whenever a finding has no specific line to point to.",
    "Add a required `line_confidence` field to the schema so that the bot can ignore any comment whose location confidence falls below a chosen threshold.",
    "Remove `line` from the schema and let the bot infer each location by searching the file for the code quoted in the finding's message.",
  ], a: [0],
  e: "Un campo obbligatorio per un'informazione che può non esistere spinge il modello a inventarla: va reso opzionale/nullable. Il valore sentinella `1` è comunque un valore inventato; il campo di confidenza non toglie l'obbligo; eliminare `line` perde la posizione dei finding che ce l'hanno." });

Q({ id: "s5-n14", s: 5, d: 4, t: "4.3",
  q: "Your review service defines a `report_findings` tool whose input schema is the findings structure, and forces it with `tool_choice`. The tool has no backend: it exists only to obtain structured output. A developer asks how the service should read the findings from Claude's response. What is correct?",
  o: [
    "Read them from the input arguments of the `tool_use` block in the response; the schema-shaped arguments are the structured output, and nothing needs to be executed.",
    "Parse them from the text block that precedes the tool call, because the tool arguments are meant only to be executed by a backend and not to be read by the service.",
    "Run `report_findings` on the server and use the string that the function returns as the structured output, validating it against the schema again.",
    "Send the tool call back in a second request so that Claude restates the arguments as plain JSON text, which the service then parses.",
  ], a: [0],
  e: "Con tool use il modello restituisce un blocco `tool_use` i cui argomenti rispettano lo schema: sono già l'output strutturato e si leggono da lì, senza eseguire nulla. Il testo che precede la chiamata non ha struttura garantita; eseguire una funzione inesistente o chiedere una seconda richiesta con testo JSON reintroduce errori di sintassi e costi inutili." });

Q({ id: "s5-n15", s: 5, d: 4, t: "4.4",
  q: "With tool use, every review response matches the schema. Still, about 6% of findings cite a `line` that is not inside the changed lines, so the bot's API call to post the inline comment fails. What is the most effective handling?",
  o: [
    "Validate each `line` against the diff in code, and for failures send a follow-up with the diff, the failed findings and the specific error for each.",
    "Enable the strictest schema mode available, since it guarantees that every value in the output is correct and not only well-formed, line numbers included.",
    "Retry the whole request unchanged up to three times and keep the first response whose inline comments post to the pull request successfully.",
    "Drop the findings that fail to post and record only their count, accepting a small loss of review coverage in exchange for a simpler pipeline.",
  ], a: [0],
  e: "Gli schemi stretti con tool use eliminano gli errori di sintassi ma non quelli semantici (una riga valida ma fuori dal diff): serve una validazione nel codice e un nuovo tentativo che includa input originale, output sbagliato ed errore specifico. La modalità più rigida non garantisce la correttezza; riprovare senza feedback e scartare i finding non correggono l'errore." });

Q({ id: "s5-n16", s: 5, d: 4, t: "4.4",
  q: "Generated tests must use the project's fixture helpers, and a validation step rejects any test calling a helper that does not exist. For one service, three retries with the validation error appended still fail: the model keeps calling `createOrderFixture`, which is defined in a shared test library that was never given to Claude. What is the correct conclusion?",
  o: [
    "Retrying cannot help because the needed information is missing from the input; provide the fixtures file or the list of helpers in context.",
    "Add more retries with the same feedback, since each attempt gives the model another chance to find the correct helper name.",
    "Append a stronger instruction to the retry stating that invented helpers will be rejected and must not be used under any circumstances whatsoever.",
    "Switch the retries to a larger model, which will infer the correct helper name from the service's other tests.",
  ], a: [0],
  e: "Il retry con feedback funziona per errori di formato o struttura, non quando l'informazione necessaria non è nell'input: qui il modello non può conoscere gli helper di una libreria che non ha visto. Più tentativi, istruzioni più forti o un modello più grande non creano l'informazione mancante." });

Q({ id: "s5-n17", s: 5, d: 4, t: "4.5",
  q: "Your team considers moving workloads to the Message Batches API for its 50% cost savings. Which TWO workloads are good candidates?",
  o: [
    "A weekly audit that reviews all 40 repositories for outdated dependency patterns, read by the platform team on Monday.",
    "A monthly report of recurring review findings by category across the whole organization.",
    "The pre-merge security review that keeps the merge button disabled until it passes.",
    "The `/review` comment command that developers post on a pull request and expect to be answered within a few minutes.",
    "A review agent that fetches related files with tool calls while it analyzes a diff, deciding what to read next from each result.",
  ], a: [0, 1],
  e: "La Batch API costa il 50% in meno ma può impiegare fino a 24 ore senza SLA di latenza: adatta a carichi non bloccanti come audit settimanali e report mensili. Inadatta ai controlli pre-merge e ai comandi interattivi, dove qualcuno aspetta, e ai flussi che richiedono chiamate di tool a metà richiesta, che la Batch API non supporta." });

Q({ id: "s5-n18", s: 5, d: 4, t: "4.5",
  q: "A nightly job submits a batch to the Message Batches API and then keeps one process waiting for the result. The CI runner's maximum job time is 6 hours, so the job is killed most nights while the batch is still processing. The team wants to keep the 50% savings. What is the right design?",
  o: [
    "Split into a submit step and a separate scheduled step that polls the batch status, then downloads the results and matches them by `custom_id`.",
    "Move the nightly job to the synchronous API so that no waiting is involved, accepting the higher cost for this workload as the price of reliability.",
    "Resubmit the batch every hour until one of the copies happens to finish within the runner's 6-hour limit, and use the first result.",
    "Shrink the batch until it fits within the 6 hours, since a smaller batch is guaranteed to finish sooner than the full one.",
  ], a: [0],
  e: "Una batch può durare fino a 24 ore senza SLA: il job non deve restare in attesa, ma sottomettere e poi controllare lo stato (polling) in un passo separato, correlando i risultati con `custom_id`. Passare al sincrono perde il risparmio; riinviare ogni ora moltiplica i costi; una batch più piccola non ha un tempo garantito." });

Q({ id: "s5-n19", s: 5, d: 4, t: "4.6",
  q: "To fix inconsistent depth, you changed the review of large pull requests to one focused pass per file. Reviews are now uniform, but a bug was missed: `orders.ts` passes a price in cents to `invoice.ts`, which expects dollars. Each file looks correct on its own. What should you add?",
  o: [
    "A separate integration pass examining data flow across the changed files, such as units and contracts at module boundaries.",
    "A longer prompt for each per-file pass asking it to consider how the file might interact with other files in the repository.",
    "A second per-file pass over every file with extended thinking enabled, to look harder at each file's own logic.",
    "A return to a single pass over all files, since per-file passes cannot see interactions.",
  ], a: [0],
  e: "Le passate per singolo file danno profondità uniforme sui problemi locali; i problemi tra file richiedono una passata di integrazione separata sul flusso dei dati. Chiedere a ogni passata locale di immaginare altri file non le dà il codice; ripassare gli stessi file non vede il confine; tornare alla passata unica riporta la diluizione dell'attenzione." });

Q({ id: "s5-n20", s: 5, d: 4, t: "4.6",
  q: "Your review pipeline posts every finding directly to the pull request, and reviewers want to spend their limited time on the doubtful ones. You add a verification pass. Which design supports calibrated routing?",
  o: [
    "Have the pass report a confidence per finding; post high-confidence ones, send low-confidence ones to human triage, and tune thresholds on past outcomes.",
    "Have Claude assign a confidence to each finding and silently discard every finding below 0.8, so that the pull request stays clean and developers see less noise.",
    "Route every finding labeled `high` severity to a human and post the others automatically, whatever the confidence attached to each finding.",
    "Ask the session that produced the findings to double-check them and mark the ones it doubts.",
  ], a: [0],
  e: "Una confidenza dichiarata accanto a ogni finding permette di instradare l'attenzione umana sui dubbi, con soglie calibrate su casi di esito noto. Scartare in silenzio i finding sotto soglia perde problemi reali; la severità non misura il dubbio; la riverifica nella stessa sessione risente del ragionamento già fatto." });
