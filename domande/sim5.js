// Scenario 5 · Claude Code for Continuous Integration · simulation pool
Q({ id: "x5-01", s: 5, d: 3, t: "3.6", sim: 1,
  q: "Your pipeline has Claude Code implement a fix for a failing test, then starts a second `claude -p` job to review it. To give the reviewer 'full context', the pipeline passes it the generator's complete session transcript, including its reasoning. The reviewer approves almost everything, including a fix that special-cases the exact input used by the failing test. What should you change?",
  o: [
    "Give the reviewer only the diff, test results and project CLAUDE.md, without the generator's reasoning, so that it judges the change independently.",
    "Keep the transcript but add an instruction to question every assumption the author made and to look for shortcuts or special cases before approving the change.",
    "Resume the generator's own session for the review and enable extended thinking, so that the check goes deeper into the reasoning already made.",
    "Run the reviewer twice with the same transcript and approve the change only if both runs agree that it is correct.",
  ], a: [0],
  e: "Un'istanza di review indipendente funziona perché non ha il ragionamento di chi ha generato il codice: ricevere la trascrizione la porta a condividerne le ipotesi. Istruzioni di scetticismo, extended thinking nella sessione del generatore o doppie esecuzioni con lo stesso contesto non rimuovono il bias." });

Q({ id: "x5-02", s: 5, d: 3, t: "3.6", sim: 1,
  q: "The 14 review criteria are written in the CI script's prompt string, while developers who run Claude Code locally before pushing use a copy from a wiki page. The two have drifted apart, so local checks pass and CI complains, or the reverse. How do you make both use the same criteria with minimal upkeep?",
  o: [
    "Keep the criteria in the project's committed `CLAUDE.md` and shorten the CI prompt to 'review this diff', so that local and CI sessions read the same file.",
    "Copy the CI prompt string into each developer's `~/.claude/CLAUDE.md` and ask them to update their copy whenever the script changes.",
    "Turn the wiki page into a personal skill for every developer and have the CI job invoke the same skill through an environment variable.",
    "Have the CI script download the wiki page at job start and append it to the prompt, while local sessions keep consulting the wiki page by hand when they remember.",
  ], a: [0],
  e: "CLAUDE.md di progetto è il meccanismo con cui anche Claude Code lanciato in CI riceve criteri di review e standard del team, ed è versionato con il codice: una sola fonte per CI e sessioni locali. Il file utente non è condiviso e dipende dal singolo sviluppatore; skill personali e wiki scaricata lasciano due copie da mantenere." });

Q({ id: "x5-03", s: 5, d: 3, t: "3.1", sim: 1,
  q: "A monorepo's `payments/` package has strict rules (never log card data, all amounts as integer cents) that the payments team maintains and that must not apply to the other 11 packages. CI reviews cover all pull requests. Where should these rules live?",
  o: [
    "In a `CLAUDE.md` inside `payments/`, versioned with the code, while the root `CLAUDE.md` keeps the universal standards.",
    "In the root `CLAUDE.md` together with the universal standards, under a heading 'Payments only' that tells Claude when to apply them.",
    "In the payments lead's `~/.claude/CLAUDE.md`, so that the rules are applied whenever that person runs a review.",
    "In the CI job's prompt, added only when the pull request touches `payments/` and kept out of every file in the repository.",
  ], a: [0],
  e: "Un CLAUDE.md a livello di directory è il posto per regole valide solo per quel pacchetto: versionato e mantenuto dal team che lo possiede, accanto al codice. Nel file radice le regole arriverebbero a tutti i pacchetti; il file utente non è condiviso; nel prompt della CI le regole sparirebbero dalle sessioni locali." });

Q({ id: "x5-04", s: 5, d: 3, t: "3.1", sim: 1,
  q: "The security, QA and platform teams all edit the single 900-line project `CLAUDE.md`. Merge conflicts are frequent and nobody knows which section belongs to which team. All of the guidance must still be available to every CI review. What reorganization is most appropriate?",
  o: [
    "Split it into topic files under `.claude/rules/` (for example `security.md`, `testing.md`), each maintained by the team that owns the topic.",
    "Give each team its own `CLAUDE.md` in its members' home directories and have developers copy changes between the files whenever one changes.",
    "Keep one file and add a comment block at the top listing which team owns which section.",
    "Move each team's section into a separate skill under `.claude/skills/` that the CI prompt invokes once per team, one skill per section.",
  ], a: [0],
  e: "`.claude/rules/` serve a organizzare regole per argomento in file separati al posto di un CLAUDE.md monolitico: ogni team modifica il proprio e i conflitti calano, restando tutto parte del contesto del progetto. I file nelle home non sono condivisi; il commento in testa non evita i conflitti; le skill si invocano a richiesta e non sono contesto sempre caricato." });

Q({ id: "x5-05", s: 5, d: 3, t: "3.2", sim: 1,
  q: "Your `/triage-ci-failure` skill is meant only to read logs and source files and to print a short report. Its instructions say 'do not modify files or run commands', yet it occasionally edits a test or runs a build. What is the most reliable fix?",
  o: [
    "Restrict it with `allowed-tools` in the SKILL.md frontmatter to read-only tools, so edits and shell commands are unavailable while it runs.",
    "Repeat the instruction in capital letters at the top and at the end of the SKILL.md body, and add that violating it is a serious error that will be reported.",
    "Add few-shot examples to the skill showing the agent producing a triage report without touching any file or running any command.",
    "Run the skill with `context: fork`, so that any file it changes or command it runs stays out of the main conversation.",
  ], a: [0],
  e: "`allowed-tools` nel frontmatter limita davvero gli strumenti disponibili durante la skill: è una garanzia deterministica, mentre ripetere l'istruzione o aggiungere esempi resta probabilistico. `context: fork` isola l'output dalla conversazione ma non impedisce alla skill di modificare i file." });

Q({ id: "x5-06", s: 5, d: 3, t: "3.3", sim: 1,
  q: "A rule file `.claude/rules/terraform.md` has the frontmatter `paths: [\"terraform/**/*\"]`. A developer asks how it will affect their sessions and the CI reviews that run on the repository. Which statement is correct?",
  o: [
    "It loads only when Claude works on files matching the glob, such as `terraform/prod/main.tf`, so it adds no context to a session about application code.",
    "It loads in every session, but Claude gives its instructions more weight when the file being edited sits under the `terraform/` directory.",
    "It applies only to files placed directly in `terraform/`, not to files in subfolders such as `terraform/prod/`, which need their own rule file.",
    "It reaches teammates only after each of them invokes the rule by name with a slash command in their own session.",
  ], a: [0],
  e: "Le regole con `paths` si caricano in modo condizionale, solo quando si lavora su file che corrispondono al glob: `**` copre anche le sottocartelle e il contesto non viene occupato quando il lavoro riguarda altro. Non è caricamento universale con pesi diversi, non si ferma al primo livello e non richiede invocazione manuale come una skill." });

Q({ id: "x5-07", s: 5, d: 3, t: "3.3", sim: 1,
  q: "Your team has one convention that applies to every file Claude touches in the repository: 'never commit secrets and always use the shared logger'. A colleague suggests creating path-scoped rule files so that it loads only where needed. What is the best approach?",
  o: [
    "Put it in the project `CLAUDE.md`: it is a universal standard for all files, so conditional loading adds nothing.",
    "Create one path-scoped rule per top-level directory (`src/**`, `scripts/**`, `infra/**`), each repeating the convention.",
    "Create a `/team-conventions` skill that developers invoke at the start of each session and that the CI prompt invokes as well.",
    "Place the convention in a `CLAUDE.md` in every subdirectory that contains source code, so that it applies wherever Claude edits.",
  ], a: [0],
  e: "Gli standard universali sempre validi vanno nel CLAUDE.md di progetto, sempre caricato: il caricamento condizionale serve a convenzioni specifiche per tipo di file o area. Tre regole duplicate, una skill da invocare a mano o un file in ogni cartella aggiungono manutenzione e rischio di dimenticanze senza alcun beneficio." });

Q({ id: "x5-08", s: 5, d: 3, t: "3.2", sim: 1,
  q: "The team's 10 universal review criteria live in a `/review-standards` skill. Developers invoke it by hand and reviews are consistent, but the CI job that runs `claude -p` on each pull request applies the criteria only occasionally. The skill also holds a rarely needed 12-step procedure for auditing license headers. What is the best restructuring?",
  o: [
    "Move the 10 universal criteria into the project `CLAUDE.md`, which is always loaded, and keep the license-audit procedure as an on-demand skill.",
    "Keep everything in the skill and add to the CI prompt an instruction to run `/review-standards` first, since team standards belong in skills.",
    "Move both the criteria and the license-audit procedure into `CLAUDE.md`, so that nothing at all depends on someone invoking a skill.",
    "Copy the criteria into each developer's `~/.claude/CLAUDE.md` and into an environment variable that the CI job appends to its prompt.",
  ], a: [0],
  e: "Gli standard universali, che devono valere sempre (anche in CI), vanno nel CLAUDE.md di progetto, caricato di default; le procedure specifiche e rare restano skill a invocazione. Dipendere dall'invocazione della skill nel prompt della CI è fragile; mettere anche la procedura di audit in CLAUDE.md gonfia il contesto sempre caricato; il file utente e la variabile d'ambiente creano copie non condivise." });

Q({ id: "x5-09", s: 5, d: 3, t: "3.4", sim: 1,
  q: "The nightly pipeline times out intermittently. To diagnose it you must read hundreds of workflow-run logs and many workflow files, looking for shared slow steps. The raw output is very large, and afterwards you will edit a few workflow files. How should you handle the discovery phase?",
  o: [
    "Delegate reading the logs and workflows to the Explore subagent, which keeps the verbose output out of the main session and returns a summary.",
    "Read all of the logs and workflow files in full in the main session, so that every detail stays available while you later edit those workflows yourself.",
    "Edit the most likely workflow first and read the logs only if the timeouts persist afterwards.",
    "Use plan mode for the whole investigation so that the log output is not added to the conversation.",
  ], a: [0],
  e: "Il subagent Explore isola l'output verboso della scoperta e restituisce solo una sintesi, preservando il contesto principale per la fase di modifica. Leggere tutto nella sessione principale lo esaurisce; modificare senza diagnosi è tirare a indovinare; la plan mode rende l'esplorazione sicura ma non toglie i log dalla conversazione." });

Q({ id: "x5-10", s: 5, d: 3, t: "3.4", sim: 1,
  q: "A workflow runs the test job on Node 18, which the runner image is about to drop. The only change needed is to set `node-version` to 20 in this one workflow file, and a failing run will show immediately whether the tests still pass. CI is on the critical path of every release. Which approach fits?",
  o: [
    "Direct execution: ask Claude to change that value in the single file and run the tests to confirm.",
    "Plan mode, because anything on the release critical path should be designed and reviewed before a change is made.",
    "Plan mode followed by the Explore subagent mapping every workflow in the organization before the file is touched.",
    "The interview pattern, so that Claude can ask about every Node-related setting in the pipeline before editing.",
  ], a: [0],
  e: "Per una modifica semplice e ben circoscritta (un valore in un file, con verifica immediata) l'esecuzione diretta è appropriata: la plan mode è pensata per cambiamenti ampi, con più approcci o implicazioni architetturali. Che la CI sia critica non rende complessa la modifica; mappare l'intera organizzazione o intervistare è sproporzionato." });

Q({ id: "x5-11", s: 5, d: 3, t: "3.5", sim: 1,
  q: "Last night's pipeline run failed for three unrelated reasons that you are fixing with Claude Code: an expired deploy token in the release job, a misconfigured lint rule, and an outdated snapshot in one test. None of the fixes touches the same files or depends on another. How should you work through them?",
  o: [
    "One at a time, in separate requests, re-running the pipeline after each fix, because the problems are independent.",
    "All three in one detailed message, so that Claude can plan the fixes together and you run the pipeline only once.",
    "Open a separate plan-mode session for each failure so that the contexts never mix, and merge the results by hand afterwards.",
    "Ask Claude to interview you about the three failures before it changes anything, so that it understands how they relate.",
  ], a: [0],
  e: "Con problemi indipendenti conviene procedere in sequenza, una richiesta mirata alla volta, verificando ogni correzione; un unico messaggio serve quando le correzioni interagiscono. Sessioni separate in plan mode aggiungono lavoro di unione senza ridurre alcuna interazione che non esiste; l'intervista serve a far emergere considerazioni non previste, non a collegare guasti già chiari." });

Q({ id: "x5-12", s: 5, d: 3, t: "3.5", sim: 1,
  q: "A generated caching setup for CI has three problems: the cache key uses the wrong lockfile, the restore keys fall back to a stale cache, and the cache path excludes `node_modules`. The right key design depends on the restore-key and path choices, and vice versa. How do you communicate the fixes?",
  o: [
    "Describe all three problems in one detailed message and ask Claude to redesign key, restore keys and path together.",
    "Fix the key first, run the pipeline, then raise the restore keys, and finally the path, each in its own separate message.",
    "Fix only the path now because it is the easiest, and let Claude work out the other two from the results.",
    "Ask Claude to propose three alternative designs and pick whichever one needs the fewest edits.",
  ], a: [0],
  e: "Quando i problemi interagiscono, vanno comunicati insieme in un messaggio dettagliato, così le correzioni sono coerenti tra loro; correggerli uno alla volta può produrre soluzioni parziali che si contraddicono. Sistemare solo il più facile o scegliere in base al numero di modifiche ignora la dipendenza reciproca." });

Q({ id: "x5-13", s: 5, d: 4, t: "4.1", sim: 1,
  q: "To cut noise you added an explicit criterion to the review prompt: 'skip issues in code the pull request does not change'. False alarms fell sharply, but last week the bot stayed silent on a pull request whose changed line started passing user input to an old, untouched helper that builds SQL by string concatenation. What is the best adjustment?",
  o: [
    "Refine the criteria: report problems that the changed lines introduce or expose, even inside untouched code they call, with an example of this case.",
    "Remove the skip criterion again, since any rule that excludes code can hide real bugs, and accept the earlier level of false alarms.",
    "Add the instruction 'be especially careful about security issues' next to the skip criterion, leaving the rest of the prompt unchanged.",
    "Keep the criterion and ask Claude to attach a confidence score to each finding, posting low-confidence security findings anyway.",
  ], a: [0],
  e: "I criteri espliciti vanno raffinati quando tagliano un caso reale: qui il problema non sta nel codice non toccato in sé, ma nel fatto che la riga modificata lo espone. Un criterio più preciso con un esempio concreto mantiene la precisione e recupera il caso. Togliere il criterio riporta il rumore; 'fai attenzione alla sicurezza' è un'istruzione vaga che non dice cosa riportare; un punteggio di confidenza non cambia ciò che il criterio esclude." });

Q({ id: "x5-14", s: 5, d: 4, t: "4.1", sim: 1,
  q: "The 'performance' category of the review bot posts comments such as 'this loop could be faster' on almost every pull request, and developers dismiss most of them. The current prompt says 'Flag significant performance problems'. Which rewrite is most likely to improve precision?",
  o: [
    "Flag a performance issue only when the change adds a database or network call inside a loop, or a nested loop over request-sized collections; skip micro-optimizations.",
    "Flag a performance issue only when you are highly confident that it has a significant impact on production latency under real traffic.",
    "Flag at most two performance issues per pull request, choosing the ones with the highest estimated impact on the running time of the code.",
    "Move performance remarks out of the inline comments into one summary comment per pull request, so that developers can read them in one place and skip them.",
  ], a: [0],
  e: "Un criterio categorico e concreto (cosa conta come problema di prestazioni e cosa saltare) migliora la precisione. 'Alta confidenza', un tetto di due segnalazioni o lo spostamento in un commento riassuntivo non cambiano che cosa il modello considera un problema: i falsi allarmi restano, solo meno visibili o meno numerosi." });

Q({ id: "x5-15", s: 5, d: 4, t: "4.1", sim: 1,
  q: "You disabled the 'naming' and 'comment accuracy' categories (dismissed 63% and 58% of the time) and rewrote their prompts with explicit criteria. Archived pull requests include the developers' accept or dismiss verdicts on the old comments. How should you decide whether to re-enable the categories?",
  o: [
    "Run the rewritten prompts on archived pull requests, compare findings with the recorded verdicts per category, and re-enable those with an acceptable false-positive rate.",
    "Re-enable both at once, since explicit criteria are known to remove false positives, and watch the dismissal rate closely over the next month of merges.",
    "Re-enable both with a note on each comment saying that the category was recently changed and may still be inaccurate, so that developers can calibrate their trust in it.",
    "Ask Claude to rate its own accuracy on the rewritten prompts and re-enable the categories for which it reports a self-assessed accuracy of at least 90%.",
  ], a: [0],
  e: "Prima di riattivare una categoria si misura il tasso di falsi positivi per categoria su un campione con esiti noti: così si ripristina la fiducia senza esporre di nuovo gli sviluppatori al rumore. Riattivare tutto e osservare costa fiducia se il prompt non basta; la nota di avvertimento non riduce i falsi allarmi; l'autovalutazione del modello è poco affidabile." });

Q({ id: "x5-16", s: 5, d: 4, t: "4.1", sim: 1,
  q: "The team's services wrap errors with an internal `fail()` helper and log with a custom `trace()` function instead of `console`. The review bot flags these as 'non-standard error handling' and 'non-standard logging' on nearly every pull request. What is the most effective prompt change?",
  o: [
    "Give explicit criteria: report real error-handling bugs (swallowed errors, unhandled rejections) and treat `fail()` and `trace()` as accepted local patterns.",
    "Add 'ignore style issues' to the prompt and keep the remaining review instructions unchanged.",
    "Tell Claude to report only high-confidence error-handling findings, since these helpers are rare in public code and therefore look unusual to it.",
    "Add a lint rule that rejects `console` calls and remove the logging and error-handling categories from the AI review altogether, leaving the whole matter to the linter.",
  ], a: [0],
  e: "Criteri espliciti che distinguono cosa segnalare (bug reali) da cosa saltare (pattern locali accettati) correggono il rumore alla radice. 'Ignora lo stile' è troppo vago e non nomina i pattern locali; il filtro per confidenza non cambia il giudizio; eliminare le categorie perde la rilevazione di errori veri." });

Q({ id: "x5-17", s: 5, d: 4, t: "4.2", sim: 1,
  q: "Your pull request bot must choose between `comment`, `request_changes` and `approve_with_note` for ambiguous diffs, such as a risky-looking change guarded by a feature flag. The prompt has 12 examples, mostly obvious bugs that map to `request_changes`, and the bot is still inconsistent on borderline cases. Which TWO changes to the examples are most effective?",
  o: [
    "Replace most of the obvious cases with 2-4 examples of genuinely ambiguous diffs that cover the different actions.",
    "For each example, add a short reason why the chosen action fits better than the plausible alternatives.",
    "Add examples for every kind of bug the team has ever seen, so that no diff is new to the bot.",
    "Turn the examples into rules in the system prompt, such as 'feature-flagged changes are always `approve_with_note`', and delete the examples.",
    "Sort the examples from easiest to hardest and repeat the hardest ones three times.",
  ], a: [0, 1],
  e: "Per i casi ambigui servono pochi esempi mirati (2-4) che mostrino il ragionamento con cui un'azione è preferita alle alternative plausibili: così il modello generalizza il giudizio. Coprire ogni bug noto copre solo casi già previsti; trasformare gli esempi in regole rigide perde la sfumatura; ripetere gli esempi difficili non aggiunge informazione." });

Q({ id: "x5-18", s: 5, d: 4, t: "4.2", sim: 1,
  q: "A CI step extracts the linked ticket from each pull request description as `ticket_id`, but descriptions vary: 'Fixes PLAT-412', 'see ticket 87 in the old tracker', 'related to the discussion in standup', or nothing at all. The model sometimes invents plausible IDs for the last two kinds. What is the most effective change?",
  o: [
    "Add a few examples of the varied formats, including descriptions without a ticket where the right output is `null`, and make `ticket_id` nullable.",
    "Add 'never guess; extract an ID only if it is explicitly written in the description text' to the prompt and keep the field required in the schema.",
    "Validate each extracted ID against the tracker and retry up to three times whenever the ID turns out not to exist there.",
    "Ask Claude to output a confidence score with the ID and discard IDs with a score below 0.7.",
  ], a: [0],
  e: "Esempi con formati diversi, inclusi i casi senza ticket con output `null`, riducono le allucinazioni, e un campo nullable evita di costringere il modello a inventare. Con il campo obbligatorio il divieto nel prompt resta solo un'istruzione; riprovare non può far comparire un ID che nel testo non c'è; la confidenza autodichiarata è poco affidabile." });

Q({ id: "x5-19", s: 5, d: 4, t: "4.2", sim: 1,
  q: "A CI step reads failing-test output from three runners (pytest tracebacks, Jest diffs and `go test` output) and extracts `test_name`, `file` and `failure_reason`. Extraction is accurate for pytest but often returns an empty `failure_reason` for the Jest and Go logs. What should you add?",
  o: [
    "One short example per runner format, showing a raw log excerpt and the correct extracted object.",
    "A longer description in the prompt of each runner's output layout, field by field.",
    "A rule that an empty `failure_reason` triggers an automatic retry of the same request until the field is filled.",
    "A separate prompt for each runner, without examples, selected by a script that detects the log format.",
  ], a: [0],
  e: "Esempi few-shot che mostrano l'estrazione corretta da formati diversi sono la tecnica più efficace quando la struttura del documento varia e il modello restituisce campi vuoti. Una descrizione più lunga è ancora prosa; un retry cieco può portare a inventare un motivo; prompt separati senza esempi aggiungono routing senza mostrare il comportamento desiderato." });

Q({ id: "x5-20", s: 5, d: 4, t: "4.2", sim: 1,
  q: "The reviewer prompt lists nine specific injection patterns to flag, and it catches those reliably. In production it misses an injection through a tagged template literal that matches none of the listed shapes. How can you improve detection of unlisted variants?",
  o: [
    "Add a few examples of injection findings with the reasoning for why each is a vulnerability, so Claude generalizes to unlisted shapes.",
    "Extend the list to cover tagged template literals, and keep adding every new variant to the list as soon as it shows up in production.",
    "Tell Claude to flag anything that might conceivably be an injection, so that borderline cases are posted too and none is missed.",
    "Add a second pass that re-runs the same prompt on the same diff and keeps the findings of either run.",
  ], a: [0],
  e: "Gli esempi con il ragionamento permettono al modello di generalizzare il giudizio a pattern nuovi invece di riconoscere solo i casi elencati. Allungare l'elenco rincorre le varianti una per una; 'segnala tutto ciò che potrebbe essere' fa esplodere i falsi positivi; ripetere lo stesso prompt dà gli stessi punti ciechi." });

Q({ id: "x5-21", s: 5, d: 4, t: "4.3", sim: 1,
  q: "Your review service offers two tools: `post_review`, which carries findings, and `record_skip`, for pull requests that need no review (for example lockfile-only changes). With `tool_choice: auto`, about 5% of the time Claude answers a lockfile-only PR with a prose sentence such as 'Nothing to review' and no tool call, which breaks the parser. Which setting fixes this?",
  o: [
    "`tool_choice: {\"type\": \"any\"}`, which guarantees a tool call and lets Claude choose the tool that fits the pull request.",
    "`tool_choice` forced to `post_review`, so that every response is a structured findings object.",
    "Keep `auto` and add a line to the system prompt saying that the model must always answer by calling a tool.",
    "Keep `auto` and wrap the call in a retry that repeats the request whenever the response contains no tool call at all, up to a fixed number of times.",
  ], a: [0],
  e: "`any` garantisce che il modello chiami un tool pur lasciandogli scegliere quale, quindi sia `post_review` sia `record_skip` restano possibili. Forzare `post_review` obbliga a produrre una review anche dove non serve; l'istruzione nel prompt è probabilistica; il retry spreca chiamate e non elimina la causa." });

Q({ id: "x5-22", s: 5, d: 4, t: "4.3", sim: 1,
  q: "A CI step extracts the author's own effort estimate from pull request descriptions into `effort_minutes` (integer). Descriptions say '~2h', 'half a day', '30 mins' or 'about an hour or two'. Outputs are inconsistent: 'half a day' becomes 240, 180 or 480 across runs, and ranges are handled arbitrarily. What should you add?",
  o: [
    "Normalization rules in the prompt next to the strict schema: convert to minutes, a working day is 480, half a day is 240, a range becomes its midpoint.",
    "A stricter integer range (`minimum` and `maximum`) in the schema, so that implausible values are rejected.",
    "A free-text `effort_original` field only, leaving the conversion to a downstream script that parses the strings with regular expressions and handles ranges.",
    "A retry that repeats the request until two consecutive responses return the same number.",
  ], a: [0],
  e: "Lo schema rigido garantisce il tipo ma non decide come convertire formati eterogenei: servono regole di normalizzazione nel prompt accanto allo schema. Un intervallo numerico non risolve l'ambiguità tra valori plausibili; le espressioni regolari non coprono formulazioni libere come 'un'ora o due'; ripetere finché due risposte coincidono non rende corretto il valore." });

Q({ id: "x5-23", s: 5, d: 4, t: "4.3", sim: 1,
  q: "To stop fabricated values, a teammate made every field of the `report_findings` schema optional. Fabrication has stopped, but now many findings arrive without `severity` and without `message`, so the bot cannot post them. What is the right schema design?",
  o: [
    "Keep required what the model can always determine (`file`, `severity`, `message`); make nullable only what may be absent (`line`, `suggested_fix`).",
    "Make all fields required again and instruct Claude in the prompt to write 'N/A' whenever it does not know the value of a field, so that nothing is omitted.",
    "Keep every field optional and add a validation retry that repeats the request until all fields are present.",
    "Make all fields required, but add an `unknown` value to the type of each field to signal that information is missing from the source.",
  ], a: [0],
  e: "Il campo deve essere obbligatorio quando l'informazione c'è sempre e nullable solo quando può davvero mancare: così si evitano sia i valori inventati sia i campi essenziali omessi. 'N/A' o `unknown` ovunque reintroducono segnaposto per dati che il modello conosce; un retry su campi opzionali non cambia lo schema." });

Q({ id: "x5-24", s: 5, d: 4, t: "4.3", sim: 1,
  q: "Findings have `category` as an enum: `bug`, `security`, `performance`, `style`, `docs`. New kinds of problems, such as license violations or accessibility issues, appear unpredictably and the model forces them into `bug`, which breaks the dashboards. Which schema change handles new kinds best?",
  o: [
    "Add an `other` value to the enum and a `category_detail` string that the model fills when it picks `other`.",
    "Change `category` to a free-text string so that the model can name any kind of problem it finds.",
    "Add `license` and `accessibility` to the enum now, and update the enum each time a new kind of problem appears.",
    "Keep the enum and add a prompt rule that new kinds must be reported as `style`, to keep the dashboards stable.",
  ], a: [0],
  e: "Per categorie estensibili si usa un enum con `other` più un campo di dettaglio: i nuovi tipi restano visibili senza rompere i valori noti. Il testo libero fa perdere la possibilità di aggregare; allungare l'enum a ogni novità non gestisce quelle imprevedibili; forzare i nuovi tipi in `style` nasconde il problema." });

Q({ id: "x5-25", s: 5, d: 4, t: "4.4", sim: 1,
  q: "A pull request description says 'refactor only, no behavior change', yet the diff changes the default value of a public config option. The review's summary currently repeats the description's claim. You want the pipeline to surface such inconsistencies for a human. What is the best output design?",
  o: [
    "Add `conflict_detected` and `conflict_detail` fields, so that the model records when description and diff disagree and the pipeline routes those pull requests to a human.",
    "Instruct Claude to trust the diff over the description and to leave the description out of the summary altogether, so that the summary never repeats unverified claims from the author.",
    "Add a `description_accuracy` score from 1 to 10 and route to a human every pull request that scores below 5, using a threshold calibrated by the team.",
    "Have a second call rewrite the description so that it matches the diff, and post the rewritten text on the pull request as a suggestion.",
  ], a: [0],
  e: "Un booleano `conflict_detected` con dettaglio rende esplicite le incoerenze tra fonti, così la pipeline può segnalarle invece di sceglierne una in silenzio. Ignorare la descrizione nasconde il conflitto; un punteggio 1-10 è arbitrario e poco affidabile; riscrivere la descrizione elimina proprio il segnale da mostrare." });

Q({ id: "x5-26", s: 5, d: 4, t: "4.4", sim: 1,
  q: "Each finding carries a `detected_pattern` field. A month of dismissal data shows that 41% of dismissed findings share the pattern `unchecked-optional-access`, while the rest are spread over 20 patterns, each under 3%. What is the most effective use of this data?",
  o: [
    "Target that pattern: refine its criteria and add examples separating acceptable optional accesses from genuine issues.",
    "Remove the `detected_pattern` field now that the analysis is done, to reduce the size of every response the service returns.",
    "Lower the severity of every finding to reduce the impact of the dismissals on developers, whichever pattern produced it.",
    "Ask developers to write a free-text reason for each dismissal across all 20 patterns and wait for the full picture before changing anything.",
  ], a: [0],
  e: "Il campo `detected_pattern` serve ad analizzare sistematicamente quali costrutti generano i rifiuti: un solo pattern concentra il 41% e va corretto con criteri ed esempi mirati. Rimuovere il campo butta via lo strumento; abbassare tutte le severità non tocca la causa; raccogliere motivazioni su 20 pattern rimanda l'azione." });

Q({ id: "x5-27", s: 5, d: 4, t: "4.4", sim: 1,
  q: "The review service uses tool use with a strict JSON schema. Which TWO problems in its output are NOT prevented by the schema and therefore need validation in the pipeline?",
  o: [
    "A finding whose `line` is a valid integer but lies outside the changed lines of the file.",
    "A finding whose `suggested_fix` describes a different problem from the one stated in its `message`.",
    "A response with a trailing sentence after the JSON that breaks parsing.",
    "A finding that lacks the required `severity` field.",
    "A `severity` value that is not one of the allowed enum values.",
  ], a: [0, 1],
  e: "Tool use con schema stretto elimina gli errori di sintassi (JSON malformato, campi obbligatori mancanti, valori fuori enum) ma non quelli semantici: una riga valida ma fuori dal diff o valori nel campo sbagliato richiedono validazione nel codice. Testo extra, campi mancanti ed enum errati sono invece prevenuti dallo schema." });

Q({ id: "x5-28", s: 5, d: 4, t: "4.4", sim: 1,
  q: "A pipeline step extracts figures from a vendor's scan report: findings per package plus a printed 'Total findings' line. In some reports the per-package counts do not add up to the printed total, and the step currently returns the printed total. What is the best design?",
  o: [
    "Extract the printed total as `stated_total` and the sum of the packages as `calculated_total`, and flag a discrepancy for review.",
    "Always return the sum of the per-package counts and ignore the printed total, since the counts are the underlying data and the total is a derived figure.",
    "Retry the extraction with the error message 'totals do not match' and repeat until the two numbers agree.",
    "Keep returning the printed total, since it is the figure the vendor officially reports and downstream users expect.",
  ], a: [0],
  e: "Estrarre sia `stated_total` sia `calculated_total` permette di rilevare la discrepanza e passarla a una revisione invece di scegliere un valore in silenzio. Se il documento stesso è incoerente, il retry non può far coincidere i numeri; scegliere sempre l'uno o l'altro nasconde l'errore." });

Q({ id: "x5-29", s: 5, d: 4, t: "4.5", sim: 1,
  q: "Before rolling out a rewritten review prompt, you want to compare it with the current one on 2,000 archived pull requests whose real outcomes are known, without exposing developers to the new prompt. Nobody is waiting; results are needed within a couple of days. Which approach is most appropriate?",
  o: [
    "Submit both prompt versions over the archived PRs through the Message Batches API, with a `custom_id` encoding PR and prompt version, and compare when done.",
    "Run all 4,000 requests through the synchronous API in parallel, to finish the comparison as quickly as possible, whatever the cost.",
    "Serve the new prompt to half of the developers on the live pre-merge pipeline, and compare the outcomes of both groups over the next several weeks of real merges.",
    "Use Claude Code interactively and review the archived pull requests one at a time.",
  ], a: [0],
  e: "Un confronto offline su dati archiviati è un carico non bloccante e tollerante alla latenza: la Batch API dà il 50% di risparmio e `custom_id` permette di correlare richieste e risultati. Il sincrono parallelo paga di più senza bisogno di velocità; il test sui PR reali espone gli sviluppatori al prompt nuovo; la sessione interattiva non scala." });

Q({ id: "x5-30", s: 5, d: 4, t: "4.6", sim: 1,
  q: "Single-pass reviews of 30-file pull requests give uneven depth and contradictory comments. Your team proposes several remedies. Which TWO statements about these proposals are correct?",
  o: [
    "Keeping only the findings that appear in at least two of three identical runs would suppress real bugs that the model catches only intermittently.",
    "Moving to a model with a larger context window would not by itself fix the uneven depth, because the problem is attention quality rather than capacity.",
    "Running the review three times and taking the union of the findings would reduce false positives, because the noise differs from run to run.",
    "Asking the same session to re-review its own findings with extended thinking is the most reliable way to catch subtle issues in the generated code.",
    "Sorting the 30 files alphabetically before the review removes the contradictory comments between files.",
  ], a: [0, 1],
  e: "Il voto a maggioranza tra più esecuzioni scarta anche i bug veri trovati solo a intermittenza, e una finestra di contesto più ampia non risolve la qualità dell'attenzione: la soluzione sono passate per file più una di integrazione. L'unione delle esecuzioni aumenta il rumore; la riverifica nella stessa sessione conserva il ragionamento di partenza; l'ordine alfabetico non cambia la diluizione." });
