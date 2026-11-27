// Scenario 4 · Developer Productivity with Claude · simulation pool
Q({ id: "x4-01", s: 4, d: 1, t: "1.1", sim: 1,
  q: "In your Agent SDK harness for a test-fixing assistant, the agent calls `Bash` to run `npm test`. When tests fail, the process exits with code 1 and the harness treats any non-zero exit code as a fatal error: it stops the loop and shows the engineer a raw stack trace. The agent therefore never gets to fix the failures it caused. What should the harness do instead?",
  o: [
    "Return the command's output and exit status to Claude as the tool result in the conversation, and continue the loop so that it can decide the next action.",
    "Retry the same `npm test` command up to three times automatically, and stop the loop only if all three attempts fail, showing the engineer the last stack trace.",
    "Keep stopping on failure, but add a post-run step that sends Claude a one-line summary of the error in a brand-new conversation.",
    "Parse the failing test names in the harness and hard-code the next tool call that edits the matching source file.",
  ], a: [0],
  e: "I risultati dei tool, falliti compresi, vanno aggiunti alla cronologia così che il modello possa ragionare sul passo successivo; il ciclo continua finché `stop_reason` è `tool_use`. Ripetere lo stesso comando non cambia l'esito; un riassunto in una conversazione nuova perde il contesto del lavoro; una chiamata cablata sostituisce il processo decisionale guidato dal modello con una sequenza fissa." });

Q({ id: "x4-02", s: 4, d: 1, t: "1.2", sim: 1,
  q: "Engineers ask the coordinator to 'add audit logging to every service in the monorepo'. It decomposes the work into three subagent tasks, one for each service named in the README (`orders`, `billing`, `users`). The repository actually contains 11 services; the other eight get no audit logging, although every subagent completed its assigned task correctly. What change to the coordinator is most effective?",
  o: [
    "Have an exploration step enumerate the services actually present in the repository first, and decompose the work from those findings.",
    "Add a verification subagent at the end that rechecks each completed service and reports whether its audit logging works correctly.",
    "Raise the number of subagents the coordinator may spawn, so that it can handle more services in parallel on later runs.",
    "Ask the engineer to list all services in the prompt, since the coordinator has no way to discover the structure of a repository.",
  ], a: [0],
  e: "Il problema è nella scomposizione: il coordinatore ha ricavato i compiti da una fonte incompleta (il README) e l'ambito troppo ristretto lascia scoperti otto servizi. Una fase di esplorazione che enumera i servizi reali prima di scomporre ripara la causa. Un subagent di verifica controlla solo il lavoro assegnato; più subagent non cambiano cosa viene assegnato; il coordinatore può scoprire la struttura con gli strumenti di ricerca." });

Q({ id: "x4-03", s: 4, d: 1, t: "1.2", sim: 1,
  q: "Your coordinator sends two explorer subagents the same instruction: 'Investigate how the payments module works.' Both run broad `Grep` and `Read` passes over the same 200 files and return overlapping notes, doubling token cost with little new information. The module is large and the team wants the investigation to run in parallel. What should the coordinator do?",
  o: [
    "Partition the scope, giving each explorer a distinct area, such as the API layer versus the persistence layer, with non-overlapping files.",
    "Keep both instructions identical and add a final step in which the coordinator deduplicates the overlapping notes before the next stage.",
    "Give both explorers the whole repository instead of one module, so that the coordinator receives more perspectives to compare.",
    "Merge them into a single explorer that handles the whole module, which removes the duplication and also keeps the work simpler.",
  ], a: [0],
  e: "Quando più subagent lavorano in parallelo, il coordinatore deve ripartire l'ambito assegnando sotto-argomenti o aree distinte, per ridurre le duplicazioni. Deduplicare dopo non evita il costo già sostenuto; allargare l'ambito aumenta la sovrapposizione; un unico esploratore perde il parallelismo richiesto." });

Q({ id: "x4-04", s: 4, d: 1, t: "1.3", sim: 1,
  q: "Your coordinator spawns generic subagents and describes each role only in the prompt of the Task call ('act as a code explorer', 'act as a test writer'), with every subagent given the full toolset. Across runs the roles drift: the 'explorer' sometimes edits files, and the team's test-naming conventions are forgotten by the 'test writer'. How should the subagents be configured?",
  o: [
    "Define one AgentDefinition per subagent type: a description of its purpose, a system prompt with its stable role and conventions, and a restricted tool list.",
    "Keep the generic subagent and make the Task prompts longer, repeating the full role description and every convention in each call, so that nothing is forgotten.",
    "Define one AgentDefinition per type, but leave all tools available and rely on each system prompt to say which tools the subagent may use.",
    "Define a single AgentDefinition with the union of all role descriptions in its system prompt, and let the coordinator pick the role to play in each Task call.",
  ], a: [0],
  e: "L'AgentDefinition di ogni tipo di subagent raccoglie descrizione, system prompt (ruolo e convenzioni stabili) e restrizioni sui tool: così il comportamento non dipende da ciò che il coordinatore ricorda di scrivere nel prompt. Prompt Task più lunghi ripetono il problema a ogni chiamata; lasciare tutti i tool e affidarsi al prompt rende la limitazione solo probabilistica; una definizione unica con tutti i ruoli reintroduce l'ambiguità e il set completo di strumenti." });

Q({ id: "x4-05", s: 4, d: 1, t: "1.3", sim: 1,
  q: "A `legacy-explorer` subagent returns prose summaries such as 'The retry logic lives in the queue consumer.' The `doc-writer` subagent that receives them cannot link its documentation to code, and engineers cannot verify the claims. How should the coordinator pass findings between them?",
  o: [
    "Require structured findings that separate each claim from its metadata (file path, line range, symbol), and pass them in the doc-writer's prompt.",
    "Ask `legacy-explorer` to write longer summaries that mention file names inside the prose, and pass those summaries unchanged.",
    "Give `doc-writer` the `Grep` tool so that it can search the repository for the sentences in the prose and recover the locations itself.",
    "Let `doc-writer` read the explorer's conversation history through shared memory, so that it can see which files were read.",
  ], a: [0],
  e: "Per conservare l'attribuzione si usano formati strutturati che separano il contenuto (l'affermazione) dai metadati (percorso, righe, simbolo), passati esplicitamente nel prompt del subagent successivo. Nomi di file dentro la prosa restano non affidabili da estrarre; far ricercare le frasi al writer duplica lavoro e non ritrova con certezza la fonte; i subagent non condividono memoria né cronologia." });

Q({ id: "x4-06", s: 4, d: 1, t: "1.4", sim: 1,
  q: "Policy: `publish_package` must run only after the test suite has passed. You implemented a hook that blocks `publish_package` until `run_tests` has been called in the session. A run still published a package after `run_tests` had reported 14 failing tests. What is the right correction?",
  o: [
    "Make the gate depend on the outcome: block `publish_package` until `run_tests` has returned a passing result for the current code.",
    "Keep the gate as it is and add a system prompt line telling the agent not to publish when it sees failing tests.",
    "Replace the gate with few-shot examples showing the agent running `run_tests` and stopping whenever the result contains failures.",
    "Make the gate also require that `run_tests` was called at least twice, to rule out one-off flaky results before publishing.",
  ], a: [0],
  e: "Un prerequisito programmatico deve verificare il risultato del passo precedente (come un ID cliente verificato), non solo che il tool sia stato chiamato. Qui il gate controlla la chiamata, non l'esito. Aggiungere una frase nel prompt o esempi few-shot riporta a un rispetto probabilistico; richiedere due chiamate non garantisce che i test passino." });

Q({ id: "x4-07", s: 4, d: 1, t: "1.4", sim: 1,
  q: "When the migration agent cannot finish a task (it needs write access to a service owned by another team), it opens a ticket for a human engineer who cannot see the conversation. Today the ticket says 'Unable to complete migration, please review' and attaches the 300-turn transcript. Engineers redo the investigation from scratch. What should the handoff contain?",
  o: [
    "A structured summary: what was changed, the root cause of the blockage, what was attempted, and the recommended next action.",
    "A one-paragraph natural-language recap written by the agent, plus the transcript, so that the engineer can search it for details.",
    "The agent's own confidence score for finishing the task, so that the engineer can decide how much attention the ticket needs.",
    "A list of every file the agent read during the session, so that the engineer can see everything it looked at.",
  ], a: [0],
  e: "Chi riceve un'escalation senza accesso alla conversazione ha bisogno di un riepilogo strutturato: azioni compiute, causa radice, tentativi e azione raccomandata. Un riassunto libero più la trascrizione scarica la ricerca sull'ingegnere; il punteggio di confidenza è un indicatore poco affidabile e non informa sul problema; l'elenco dei file letti non dice cosa è stato concluso." });

Q({ id: "x4-08", s: 4, d: 1, t: "1.5", sim: 1,
  q: "The agent's `Bash` tool sometimes returns environment dumps and config listings that contain API keys. The keys then appear in the conversation, and the model has twice copied one into a generated README. Requirement: the model must never see credential values. What is the most reliable approach?",
  o: [
    "Add a PostToolUse hook that redacts strings matching credential patterns from each tool result before the model processes it.",
    "Add a system prompt rule telling the model never to repeat credentials that appear in tool output, and to replace them with placeholders.",
    "Add a filter on the final answer that removes credential-like strings before the response reaches the engineer.",
    "Add few-shot examples in which the agent sees credentials in tool output and replaces them with placeholders in its answers.",
  ], a: [0],
  e: "Un hook PostToolUse trasforma il risultato del tool prima che il modello lo elabori: la redazione è deterministica e il modello non vede mai i valori. Regola nel prompt e few-shot lasciano che il modello veda le chiavi e si affidano alla sua obbedienza; un filtro sulla risposta finale non copre ciò che il modello scrive nei file (come il README) né ciò che ha già visto." });

Q({ id: "x4-09", s: 4, d: 1, t: "1.5", sim: 1,
  q: "Which TWO of the following requirements for a coding agent should be enforced with hooks rather than left to prompt instructions?",
  o: [
    "`DROP TABLE` statements must never run through `Bash` against the production database, because the data cannot be recovered.",
    "`git push --force` to protected branches must never run, because rewriting shared history cannot be undone.",
    "Commit messages should follow the team's preferred imperative style, such as 'Add retry to queue consumer'.",
    "New helper functions should use the naming style of the surrounding file, whichever convention it follows.",
    "Explanations of changes should stay under about five lines unless the engineer asks for more detail.",
  ], a: [0, 1],
  e: "I hook sono la scelta quando serve conformità garantita: intercettare in uscita un `DROP TABLE` in produzione o un push forzato impedisce l'azione prima che avvenga, e il costo di un errore è alto o irreversibile. Stile dei commit, nomi delle funzioni e lunghezza delle spiegazioni sono preferenze a basso rischio, che istruzioni nel prompt gestiscono bene." });

Q({ id: "x4-10", s: 4, d: 1, t: "1.6", sim: 1,
  q: "An engineer asks why the nightly export job on a legacy system sometimes writes duplicate rows. The agent follows a fixed checklist (check the database constraints, the job's code, the logs) and reports 'no cause found'. The duplicates actually come from a second cron entry that only becomes visible in the timestamps found while reading the logs. What approach would have worked better?",
  o: [
    "An adaptive investigation: start from the symptoms, and let each finding (such as two near-identical timestamps) generate the next subtask.",
    "The same checklist with extra steps for every other component the team can think of, so that all the possible causes are covered in order.",
    "A fixed prompt chain with one step per suspected cause, run in parallel so that the results can be compared afterwards.",
    "A single prompt asking Claude to list every possible cause of duplicate rows and to rank them by probability before investigating.",
  ], a: [0],
  e: "Per un'indagine aperta le cause non sono note in anticipo: serve un piano adattivo che genera sotto-compiti in base a ciò che si scopre a ogni passo. Una checklist fissa, anche allungata, copre solo ciò che si è immaginato; una catena fissa in parallelo ha lo stesso limite; un elenco di cause ordinato per probabilità è un'ipotesi, non un'indagine guidata dalle prove." });

Q({ id: "x4-11", s: 4, d: 1, t: "1.7", sim: 1,
  q: "After a long analysis of a legacy module, you have a good shared understanding in your session. You now want to try an aggressive rewrite of its caching layer, but the experiment may fail and you do not want it to pollute the baseline you will use for the other, conservative changes. What should you do?",
  o: [
    "Create a branch with `fork_session` and run the experiment there, keeping the original session as an untouched baseline.",
    "Run the experiment in the same session and, if it fails, tell the agent to disregard everything it did during the experiment.",
    "Resume the session with `--resume` in a second terminal and run the experiment there, while using the first terminal for the other changes.",
    "Start a new session with no context and let the agent repeat the full module analysis before the experiment.",
  ], a: [0],
  e: "`fork_session` crea rami indipendenti da una base di analisi condivisa: l'esperimento può fallire senza toccare la sessione di partenza. Chiedere di ignorare ciò che è stato fatto lascia comunque il materiale nel contesto; riprendere la stessa sessione due volte mescola le esplorazioni; ripartire da zero spreca l'analisi già fatta." });

Q({ id: "x4-12", s: 4, d: 2, t: "2.1", sim: 1,
  q: "The `query_metrics` MCP tool has the description 'Queries metrics.' Its parameter expects a PromQL expression, but the agent often passes plain-English questions such as 'error rate for checkout last hour', and the tool returns validation errors. What is the most effective first fix?",
  o: [
    "Expand the description with the accepted input format (PromQL), one or two example queries, and the cases the tool cannot handle.",
    "Add a preprocessing step that translates every plain-English request into PromQL with a second model call before the tool runs.",
    "Make the tool accept free-text questions and translate them internally, so that the parameter no longer needs a defined format.",
    "Add a system prompt rule 'Always write PromQL when calling `query_metrics`' and leave the tool's own description unchanged.",
  ], a: [0],
  e: "La descrizione è il meccanismo principale con cui il modello sceglie e usa un tool: indicare formato d'ingresso, query di esempio e casi non gestiti è il primo intervento a basso costo. Una seconda chiamata al modello o la traduzione interna sono sviluppo più pesante prima di aver sistemato la causa; una regola nel prompt lascia il tool privo di documentazione." });

Q({ id: "x4-13", s: 4, d: 2, t: "2.1", sim: 1,
  q: "The agent has `lint_file` (checks one file, about 1 second) and `lint_project` (checks the whole repository, about 90 seconds). Both descriptions say only 'Runs the linter.' The system prompt says to prefer the narrower tool, yet the agent runs `lint_project` after editing a single file about half the time. What is the most effective first step?",
  o: [
    "Rewrite both descriptions to state their scope and cost, with the boundary 'use `lint_file` after single-file edits, `lint_project` for cross-file changes'.",
    "Add a hook that blocks `lint_project` whenever the session has edited only one file, and returns a message pointing to `lint_file`, allowing `lint_project` again after a second file is edited.",
    "Merge them into one `lint` tool with an optional `path` parameter, which removes the choice between two tools.",
    "Repeat the system prompt instruction in several sections, so that the preference for `lint_file` carries more weight.",
  ], a: [0],
  e: "Quando due tool simili hanno descrizioni minime, il modello non sa distinguerli: si descrivono scopo, costo e confini rispetto all'alternativa, a basso sforzo. Un hook o la fusione dei tool sono interventi più pesanti non giustificati come primo passo; ripetere la regola nel prompt non dà al modello le informazioni sul tool." });

Q({ id: "x4-14", s: 4, d: 2, t: "2.2", sim: 1,
  q: "Your MCP code-intelligence tools must tell the agent the difference between failing and finding nothing. Which TWO outcomes should be returned with `isError: true` rather than as successful results?",
  o: [
    "`find_references` cannot reach its index service and times out after 30 seconds.",
    "`read_repository_file` is denied because the agent's token lacks access to a private repository.",
    "`find_references` runs against the index and finds no callers for a function that is truly unused.",
    "`list_todos` scans a directory that contains no TODO comments.",
    "`get_ticket` finds an existing ticket that has zero comments.",
  ], a: [0, 1],
  e: "Un timeout del servizio e un permesso negato sono fallimenti di accesso: vanno segnalati come errori (transitorio il primo, di permesso il secondo) perché l'agente decida se ritentare o riferire. Zero chiamanti, zero TODO e un ticket senza commenti sono risultati vuoti validi di query riuscite, e anzi sono già informazioni." });

Q({ id: "x4-15", s: 4, d: 2, t: "2.2", sim: 1,
  q: "The `create_release_tag` tool refuses to tag from any branch other than `main` because of a release policy. It currently returns `isError: true` with 'Operation failed'. The agent tries again from three different branches and then tells the engineer the tool is broken. How should the tool report this rejection?",
  o: [
    "As a business-rule error marked non-retryable, with an explanation that tags may only be created from `main`, which the agent can relay to the engineer.",
    "As a transient error with `isRetryable: true`, so that the agent tries again once the branch has been merged into `main`.",
    "As a successful result containing the text 'tag not created', so that the agent does not treat the rejection as a tool failure and goes on with the rest of the release checklist.",
    "As a permission error, so that the agent asks the engineer for elevated access before it tries the operation again.",
  ], a: [0],
  e: "Una violazione di regola di business non si risolve ritentando: l'errore va segnalato come non ripetibile, con una spiegazione leggibile che l'agente può comunicare. Marcarlo transitorio invita a tentativi inutili; restituirlo come successo nasconde il rifiuto; la categoria permessi suggerisce un problema di accesso che non esiste." });

Q({ id: "x4-16", s: 4, d: 2, t: "2.3", sim: 1,
  q: "The `test-writer` subagent has `Read`, `Write`, and `Grep`. In roughly one run in twenty it needs to confirm the behavior of a third-party API, which only the `web-researcher` subagent can do, and the lookups vary widely from one case to the next. What is the best way to handle this?",
  o: [
    "Keep the tool sets as they are, and let `test-writer` report the open question to the coordinator, which delegates the research to `web-researcher`.",
    "Give `test-writer` the full web-search toolset of `web-researcher`, so that it never has to wait for the coordinator when a question comes up.",
    "Give every subagent all the tools, so that any of them can resolve questions that fall outside its own role without delegating.",
    "Have `web-researcher` pre-fetch documentation for every third-party API in the repository before each `test-writer` run starts.",
  ], a: [0],
  e: "Per un bisogno raro e vario fuori dal ruolo, il subagent mantiene i tool del proprio ruolo e il caso passa dal coordinatore, che lo delega allo specialista. Un tool cross-ruolo mirato è giustificato per bisogni frequenti e semplici, non per ricerche rare e aperte; dare a tutti ogni tool aumenta la complessità di scelta e gli usi impropri; il pre-caricamento speculativo non prevede ciò che servirà." });

Q({ id: "x4-17", s: 4, d: 2, t: "2.3", sim: 1,
  q: "In your multi-agent maintenance tool, every subagent inherits the same 24 tools from five MCP servers plus the built-ins. The `doc-writer` subagent has started running `Bash` to execute the test suite and editing source files to make failing tests pass, instead of documenting the module. What change best fixes this?",
  o: [
    "Define each subagent with only the tools relevant to its role; for `doc-writer`, file reading and search plus writing documentation files.",
    "Keep all tools available, and strengthen the `doc-writer` system prompt: 'You only write documentation; never run tests or edit source files.'",
    "Give the coordinator all 24 tools as well, so that it can check each subagent's work for tool misuse after it completes.",
    "Add a final reviewer subagent that reverts source edits made by `doc-writer` before the results are returned to the engineer.",
  ], a: [0],
  e: "Troppi tool, e fuori dalla specializzazione del ruolo, aumentano la complessità di scelta e inducono usi impropri: ogni subagent deve avere solo gli strumenti adatti al suo ruolo. Un system prompt più severo resta probabilistico mentre gli strumenti rimangono disponibili; dare tutto al coordinatore peggiora la selezione; annullare le modifiche a posteriori tratta il sintomo." });

Q({ id: "x4-18", s: 4, d: 2, t: "2.3", sim: 1,
  q: "A `schema-docs` subagent uses a generic `execute_sql` tool to document table structures. Reviewers found it occasionally runs exploratory `SELECT *` queries on tables containing personal data, although it only needs column names and types. What is the best fix?",
  o: [
    "Replace `execute_sql` with constrained tools such as `list_tables` and `describe_table` that accept only table names and return structural metadata.",
    "Keep `execute_sql` and add a system prompt rule telling the subagent to query only information-schema views and never to select rows from data tables.",
    "Keep `execute_sql` and add a weekly review of the query log to detect any query that reads from tables holding personal data.",
    "Keep `execute_sql` but cap its result size at 20 rows, so that any exploratory query exposes only a small sample of the data.",
  ], a: [0],
  e: "Un tool generico che permette più di quanto serve va sostituito con alternative vincolate, con contratto di ingresso e uscita definito: il limite sta nello strumento. Regola nel prompt, revisione settimanale dei log e tetto sulle righe non impediscono la lettura di dati personali, la riducono o la scoprono dopo." });

Q({ id: "x4-19", s: 4, d: 2, t: "2.4", sim: 1,
  q: "Your MCP server for the platform team exposes the repository documentation index, a `create_release_branch` operation, and a `trigger_ci_run` operation. The agent wastes several calls at the start of each task discovering which documents exist. Which design is best?",
  o: [
    "Expose the documentation index as an MCP resource, and keep `create_release_branch` and `trigger_ci_run` as tools.",
    "Expose all three as MCP resources, so that the agent sees everything it can use at the start of each task.",
    "Keep all three as tools, and add a `list_everything` tool that the agent is told to call first on every task.",
    "Keep the documentation index as a tool, and expose the two operations as resources so that their descriptions are always visible.",
  ], a: [0],
  e: "Le resource espongono cataloghi di contenuto (qui l'indice della documentazione) e riducono le chiamate esplorative; le azioni come creare un branch o avviare la CI restano tool. Esporre azioni come resource non le rende eseguibili; un tool `list_everything` mantiene una chiamata a ogni attività; invertire i ruoli lascia le chiamate esplorative e dà alle azioni lo strumento sbagliato." });

Q({ id: "x4-20", s: 4, d: 2, t: "2.5", sim: 1,
  q: "An engineer wants to know which services disable retries. The repository has 8,000 YAML files, and only the 60 files named `service.config.yaml` matter; the string `retry: false` also appears in test fixtures, Helm templates, and documentation. What is the best approach?",
  o: [
    "Use `Glob` with `**/service.config.yaml` to select those files, then search only their contents for `retry: false`.",
    "Use `Grep` for `retry: false` across the whole repository and ask the engineer to ignore matches in fixtures, templates and docs.",
    "Use `Read` on every YAML file in the repository and filter the results in the agent's own reasoning.",
    "Use `Glob` with the pattern `**/*retry*` and read the files whose names match.",
  ], a: [0],
  e: "`Glob` seleziona i file per nome o percorso (qui i 60 `service.config.yaml`), poi si cerca il contenuto solo in quelli: ogni strumento fa ciò per cui è fatto. Un `Grep` su tutto il repository restituisce rumore da fixture e documentazione; leggere 8.000 file esaurisce il contesto; il nome dei file non contiene la parola retry." });

Q({ id: "x4-21", s: 4, d: 2, t: "2.5", sim: 1,
  q: "Production logs show `Lease expired for resource 8841`. The engineer wants to know where in a 1,500-file codebase this message is produced. The code builds the message by interpolating the resource id into a fixed text. Which approach should the agent take?",
  o: [
    "Use `Grep` for the fixed part, `Lease expired for resource`, then `Read` the matching files to follow the code path.",
    "Use `Grep` for the complete line `Lease expired for resource 8841`, since that is the exact text from the log.",
    "Use `Glob` with `**/*lease*` and `Read` the matching files, since the message must be defined in a file named after leases.",
    "Use `Read` on the logging configuration to find which module writes to this log, then `Read` every file in that module.",
  ], a: [0],
  e: "`Grep` cerca nel contenuto dei file ed è lo strumento per localizzare messaggi d'errore; poiché l'id è interpolato, si cerca la parte fissa e poi si usa `Read` per seguire il flusso. Cercare la riga completa con l'id non troverà nulla nel codice; il nome del file non è un indizio affidabile per `Glob`; leggere configurazione e intero modulo è una ricerca cieca che consuma contesto." });

Q({ id: "x4-22", s: 4, d: 3, t: "3.1", sim: 1,
  q: "Two packages, `payments` and `reports`, both need the standards in `docs/persistence-rules.md`. Today each package's `CLAUDE.md` contains a pasted copy of that file, and the copies have drifted apart. What is the best way to fix this?",
  o: [
    "Remove the copies and have each package's `CLAUDE.md` reference the shared file with the `@import` syntax.",
    "Move the full text into the root `CLAUDE.md` so that it applies to all packages, including those that do not touch data access.",
    "Move the standards into `~/.claude/CLAUDE.md` so that each maintainer has one copy and keeps it up to date.",
    "Keep the copies and add a CI check that fails when they differ, so that drift is detected quickly.",
  ], a: [0],
  e: "`@import` permette di mantenere CLAUDE.md modulare: un solo file di standard, incluso solo dai pacchetti che ne hanno bisogno. Il file radice caricherebbe regole irrilevanti per gli altri pacchetti; il file utente non è condiviso con il team; un controllo CI sulle differenze mantiene la duplicazione e ne scopre solo gli effetti." });

Q({ id: "x4-23", s: 4, d: 3, t: "3.3", sim: 1,
  q: "Fifteen services each contain a `generated/` folder produced by a code generator. The convention 'never hand-edit; change the schema and run `make gen`' must apply whenever Claude touches those files, and only then. What is the most maintainable setup?",
  o: [
    "One `.claude/rules/` file with `paths: [\"**/generated/**\"]` holding the convention, so that it loads only when matching files are edited.",
    "A `CLAUDE.md` inside each of the fifteen `generated/` folders, each repeating the convention.",
    "A paragraph in the root `CLAUDE.md` describing the convention, so that Claude applies it when it notices a generated file.",
    "A `/generated-files` skill that developers invoke before they touch any file under a `generated/` folder.",
  ], a: [0],
  e: "Una regola in `.claude/rules/` con glob `paths` si attiva solo quando si modificano file corrispondenti, ovunque stiano, ed è un unico file da mantenere. Quindici CLAUDE.md di directory duplicano il testo; un paragrafo nel file radice è sempre caricato e dipende dall'inferenza; una skill richiede invocazione manuale e non è automatica." });

Q({ id: "x4-24", s: 4, d: 3, t: "3.2", sim: 1,
  q: "You wrote a `/legacy-map` skill in `~/.claude/skills/` that reads hundreds of files to map a legacy module. The team now wants everyone to use it. Two problems have also appeared: its long output floods the conversation, and once it edited a file although it should only read. What should you do?",
  o: [
    "Move it to `.claude/skills/` in the repository, and set `context: fork` and read-only `allowed-tools` in its frontmatter.",
    "Keep it in `~/.claude/skills/`, add `context: fork` and read-only `allowed-tools`, and send the folder to each teammate to copy.",
    "Move it to `.claude/skills/` with `context: fork`, and add a line to its body saying it must never modify any file it reads.",
    "Turn its instructions into a section of the project CLAUDE.md, so that every teammate gets them in every session automatically.",
  ], a: [0],
  e: "Tre esigenze, tre meccanismi: la skill di progetto in `.claude/skills/` arriva a tutti con il repository, `context: fork` isola l'output verboso, `allowed-tools` di sola lettura impedisce le modifiche in modo vincolante. Copiare la cartella a mano crea versioni divergenti; una riga nel corpo è un'istruzione, non un vincolo; nel CLAUDE.md il flusso verrebbe caricato sempre, anche quando non serve, e non sarebbe più isolato." });

Q({ id: "x4-25", s: 4, d: 3, t: "3.2", sim: 1,
  q: "A `/changelog` skill must read recent commits and append an entry to `CHANGELOG.md`. Its author set `allowed-tools: Read, Grep, Glob` to keep it safe, and now the skill reports that it cannot modify the file. What is the right fix?",
  o: [
    "Add the file-editing tool the skill needs, such as `Edit`, to `allowed-tools`, while still leaving out shell access.",
    "Remove `allowed-tools` entirely, so that the skill can use every tool, including `Bash`, whenever it decides it needs them.",
    "Set `context: fork` in the frontmatter, which gives a forked skill permission to modify files that it could not before.",
    "Add an `argument-hint` naming `CHANGELOG.md`, so that the developer authorizes the edit when invoking the skill.",
  ], a: [0],
  e: "`allowed-tools` definisce gli strumenti disponibili durante la skill: l'elenco di sola lettura impedisce proprio la scrittura che serve. Si aggiunge lo strumento di modifica necessario, lasciando fuori la shell per mantenere il perimetro stretto. Togliere del tutto la restrizione apre anche `Bash`; `context: fork` isola il contesto e non concede permessi; `argument-hint` chiede un parametro e non autorizza strumenti." });

Q({ id: "x4-26", s: 4, d: 3, t: "3.3", sim: 1,
  q: "Two services, `services/ledger/` and `services/settlement/`, share strict conventions for monetary arithmetic (always `BigDecimal`, explicit rounding modes). No other service needs them, and a lot of unrelated code lives in other directories. What is the best way to apply these conventions?",
  o: [
    "One `.claude/rules/` file whose `paths` lists `services/ledger/**/*` and `services/settlement/**/*`, loading only when either is edited.",
    "A copy of the conventions in a `CLAUDE.md` inside each of the two service directories, which developers must then keep in sync by hand over time.",
    "The conventions in the root `CLAUDE.md`, so that they apply everywhere and cannot be missed in any service, whatever the developer is working on.",
    "The conventions in a skill that developers invoke whenever they begin work on either of the two services, so that nothing loads automatically.",
  ], a: [0],
  e: "Quando una convenzione riguarda più directory ma non tutto il repository, una regola con glob `paths` su entrambe si carica solo per i file pertinenti ed è un unico testo da mantenere. Due CLAUDE.md di directory duplicano il contenuto con rischio di divergenza; nel file radice pesa su ogni sessione; una skill non è automatica." });

Q({ id: "x4-27", s: 4, d: 3, t: "3.4", sim: 1,
  q: "A ticket says: 'The `format_price` function in `pricing.py` should round half up instead of truncating.' The function is 6 lines long, has existing unit tests, and is called from one place. The engineer is unsure whether to start in plan mode. What is the best approach?",
  o: [
    "Use direct execution: the change is small and well scoped, so the agent can make it and run the existing tests.",
    "Use plan mode, because any change to a rounding rule might have hidden effects that require exploration first.",
    "Use plan mode followed by the Explore subagent, to map every caller of `format_price` before touching the function.",
    "Use plan mode, so that the engineer can approve a written design before the first line of code is changed.",
  ], a: [0],
  e: "L'esecuzione diretta è adatta a modifiche semplici e ben delimitate: una funzione di sei righe con test esistenti e un solo chiamante. La plan mode serve a compiti con modifiche ampie, più approcci validi o decisioni architetturali; qui aggiungerebbe cerimonia, e mappare chiamanti già noti con l'Explore subagent non cambia l'esito." });

Q({ id: "x4-28", s: 4, d: 3, t: "3.5", sim: 1,
  q: "Which TWO situations call for describing all the problems together in a single detailed message rather than fixing them one at a time?",
  o: [
    "An API endpoint's page size, cursor format and sort order are each wrong, and the right choice for each depends on the other two.",
    "A new column name, the migration that creates it, and the serializer that exposes it are inconsistent with each other, and each must change to match the others.",
    "A README example is outdated, a log message has a typo, and a test fixture uses an old date format, none of which affects the others.",
    "A CSV parser fails on one encoding, while a separate report query lacks an index; the two are in different modules and unrelated.",
    "Three unrelated functions each have a missing null check, found in separate review comments.",
  ], a: [0, 1],
  e: "Quando le correzioni interagiscono (i valori dipendono l'uno dall'altro, nomi e schema devono restare coerenti) conviene descrivere tutti i problemi in un unico messaggio dettagliato, così che Claude li risolva insieme. I difetti indipendenti (esempio nel README, refuso nel log, fixture, parser e query non collegati, null check separati) si correggono in sequenza, uno alla volta, verificando ogni passo." });

Q({ id: "x4-29", s: 4, d: 3, t: "3.5", sim: 1,
  q: "Claude generates DTO classes from legacy SQL column names. You asked for 'idiomatic camelCase names', but results are inconsistent: `cust_nm` becomes `custNm` in one class and `customerName` in another, and `is_active_flg` sometimes drops its suffix. Which next step is most effective?",
  o: [
    "Provide two or three input/output examples pairing column names with the exact DTO field names expected.",
    "Describe the naming rules in more detail in prose, adding further criteria about what counts as idiomatic and how abbreviations are treated.",
    "Ask Claude to interview you about naming preferences, then generate all the DTO classes in one pass using the preferences you described.",
    "Run the generation a second time and keep only the field names that match in both runs, asking about the rest.",
  ], a: [0],
  e: "Quando una descrizione in prosa viene interpretata in modo incoerente, 2-3 esempi concreti di input e output atteso sono il modo più efficace per comunicare la trasformazione. Altra prosa ripete il problema; l'intervista fa emergere considerazioni di progetto, non fissa una regola di trasformazione; confrontare due esecuzioni elimina i campi incerti senza dire quale nome sia corretto." });

Q({ id: "x4-30", s: 4, d: 3, t: "3.5", sim: 1,
  q: "An engineer asks the agent to add rate limiting to the company's public API, but admits not having thought through burst handling, whether limits are per user or per key, or what clients should receive when the limit is hit. Which first step best fits?",
  o: [
    "Use the interview pattern: have Claude ask questions that surface these design considerations before any implementation begins.",
    "Enter plan mode so that Claude explores the existing middleware and proposes a design from the code alone.",
    "Write a test suite first with the expected behavior, and let Claude iterate on the failures until it passes.",
    "Give Claude two or three input/output examples of requests and the responses expected when the limit is exceeded.",
  ], a: [0],
  e: "Quando il problema è che le considerazioni di progetto non sono state pensate (burst, per utente o per chiave, risposta al superamento), il pattern a intervista le fa emergere prima di implementare. La plan mode esplora il codice ma non i requisiti non ancora decisi; una suite di test o esempi di input/output presuppongono di sapere già quale comportamento si vuole." });