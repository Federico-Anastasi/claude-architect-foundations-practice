// Scenario 4 · Developer Productivity with Claude · practice pool
Q({ id: "s4-n01", s: 4, d: 1, t: "1.1",
  q: "In your Agent SDK harness, each `Grep` result is replaced, before it is appended to the conversation, by a one-line note written by the harness to save tokens, such as 'Grep returned 14 matches'. The agent keeps repeating the same search and never opens the matching files. What is the root cause and the fix?",
  o: [
    "Claude never sees the matches, so it cannot decide what to do next; append the actual tool result to the conversation on each iteration.",
    "The loop ends too early; keep it running until the agent has issued at least ten `Grep` calls, so that it eventually opens the files.",
    "Add a system prompt rule 'Never repeat a search' and keep the one-line notes, so that the agent moves on to reading the files.",
    "Set `tool_choice` to `{\"type\": \"any\"}` so that the agent must call a tool on each turn and therefore reads files instead of searching again.",
  ], a: [0],
  e: "Dopo ogni tool il risultato reale va aggiunto alla cronologia, così il modello può ragionare sul passo successivo con le informazioni nuove: un riassunto scritto dall'harness che non contiene le corrispondenze lo lascia senza elementi per decidere. Un minimo di dieci chiamate è un tetto arbitrario sul ciclo; una regola nel prompt non sostituisce i dati mancanti; `any` obbliga a chiamare un tool ma non quale, quindi può ripetere la stessa ricerca." });

Q({ id: "s4-n02", s: 4, d: 1, t: "1.2",
  q: "In your legacy-modernization assistant, a coordinator delegates to a `dependency-mapper` subagent and then to a `boilerplate-generator` subagent. To save a hop, a teammate proposes letting `dependency-mapper` call `boilerplate-generator` directly when it finishes. Last week a generator run failed on a partial dependency map and nobody could tell where the bad input came from. What should you do?",
  o: [
    "Keep all communication between subagents routed through the coordinator, so that every handoff can be observed and errors are handled consistently in one place.",
    "Allow the direct call, and have both subagents append every message they exchange to a shared log file that engineers can inspect after a failure to reconstruct what happened.",
    "Replace the two subagents with one agent holding the union of both tool sets, which removes the handoff and with it any chance of a partial map.",
    "Keep the coordinator in the path, but let it forward the mapper's output to the generator without inspecting it, to avoid adding any latency.",
  ], a: [0],
  e: "Nel modello hub-and-spoke il coordinatore gestisce tutta la comunicazione tra subagent: così ogni passaggio è osservabile, gli errori hanno un unico punto di gestione e il flusso di informazioni è controllato. Un log condiviso ricostruisce i fatti solo dopo il guasto; un agente unico con l'unione dei tool perde la specializzazione e aumenta la complessità di scelta degli strumenti; un coordinatore che inoltra senza ispezionare non offre né osservabilità né gestione degli errori." });

Q({ id: "s4-n03", s: 4, d: 1, t: "1.3",
  q: "During a session an engineer tells the coordinator: 'This service must stay on Python 3.8 and use `psycopg2` directly, no ORM.' The coordinator then spawns a `boilerplate-generator` subagent with the prompt 'Create the repository class for the `Invoice` entity.' The generated code uses SQLAlchemy and Python 3.10 syntax. What is the root cause and the fix?",
  o: [
    "Subagents do not inherit the coordinator's conversation, so the stated constraints must be included explicitly in the prompt the subagent receives.",
    "The generator's system prompt is too short; lengthen it with general guidance so that the subagent infers the right stack from the repository.",
    "Add 'follow all constraints stated earlier in the conversation' to the generator's system prompt so that it reads them from the coordinator's history.",
    "Let the generator run `Grep` over the repository's imports before writing, so that it deduces the database library and Python version from existing code.",
  ], a: [0],
  e: "I subagent lavorano con contesto isolato: non ereditano la conversazione del coordinatore né condividono memoria. I vincoli dichiarati dall'ingegnere vanno quindi scritti nel prompt di delega. Una frase generica nel system prompt non dà accesso a una cronologia che il subagent non ha; un system prompt più lungo o la deduzione dagli import sono probabilistici e non garantiscono un vincolo esplicito." });

Q({ id: "s4-n04", s: 4, d: 1, t: "1.4",
  q: "Your scaffolding agent is supposed to read `CONTRIBUTING.md` before generating a new module so that file names follow the team convention. In about 10% of runs it skips this and creates `userService.ts` instead of `user-service.ts`; the CI linter flags the name and the developer renames the file in seconds. What is the most proportionate fix?",
  o: [
    "Put the naming convention directly in the agent's standing instructions and let the existing CI linter remain the safety net for the rare miss.",
    "Add a programmatic prerequisite that blocks every `Write` call until a `Read` of `CONTRIBUTING.md` has been recorded in the session.",
    "Add a hook that intercepts each outgoing `Write` call, rejects names that break the convention, and redirects the agent to rename the file.",
    "Add a routing classifier that detects scaffolding requests and exposes only `Read` until `CONTRIBUTING.md` has been opened, then enables `Write`.",
  ], a: [0],
  e: "I vincoli programmatici servono quando serve conformità deterministica (identità prima dei pagamenti, soglie di rimborso). Qui l'errore è banale, già intercettato dal linter e corretto in secondi: basta una istruzione esplicita, con costo minimo. Gate sulle scritture, hook di rifiuto e classificatore di routing aggiungono infrastruttura sproporzionata al rischio." });

Q({ id: "s4-n05", s: 4, d: 1, t: "1.5",
  q: "Your repository-maintenance agent has `Read`, `Write`, and `Bash`. Policy: it must never modify anything under `infra/prod/`. The system prompt states this clearly, yet an audit found two runs last month in which the agent edited a production Terraform file while 'fixing' a lint error. What is the most reliable fix?",
  o: [
    "Add a hook that intercepts outgoing `Write` and `Bash` calls, blocks any that target `infra/prod/`, and tells the agent to propose the change as a patch for human review.",
    "Repeat the rule in bold at the top and bottom of the system prompt and add three few-shot examples of the agent refusing to edit files under `infra/prod/` or any other protected folder.",
    "Add a hook that runs after every tool call, detects changes under `infra/prod/`, and reverts them automatically with `git checkout` before the next step.",
    "Remove `Bash` from the agent's tools so that it can only change files through `Write`, which is easier to supervise than arbitrary shell commands.",
  ], a: [0],
  e: "Una regola di policy che non deve mai essere violata richiede un'intercettazione deterministica delle chiamate in uscita: l'hook blocca la scrittura prima che avvenga e reindirizza verso una revisione umana. Prompt e few-shot restano probabilistici (il rischio è già accaduto due volte). Un hook dopo l'esecuzione interviene a danno fatto; togliere `Bash` lascia comunque aperta `Write` su quei percorsi." });

Q({ id: "s4-n06", s: 4, d: 1, t: "1.6",
  q: "Your team plans three automated jobs for the productivity agent: (1) every night, document each of 40 modules with the same four sections; (2) answer 'why does the legacy checkout intermittently double-charge?'; (3) review a 20-file change for local bugs and for cross-file issues. Which pairing of task and decomposition strategy is correct?",
  o: [
    "(1) a fixed prompt chain with one step per section; (2) an adaptive investigation whose subtasks follow what is discovered; (3) per-file passes followed by a separate cross-file integration pass.",
    "(1) an adaptive investigation that picks its own sections for each module; (2) a fixed prompt chain with one step per suspected cause of the double charge; (3) one single pass over all 20 files at once.",
    "(1) per-file passes followed by a separate integration pass; (2) one single prompt that lists every possible cause; (3) a fixed prompt chain with one step per file.",
    "(1) one single prompt that writes all four sections for all the modules; (2) per-file passes followed by an integration pass; (3) an adaptive investigation that follows discoveries.",
  ], a: [0],
  e: "Per lavori prevedibili e multi-aspetto (stesse quattro sezioni) il prompt chaining sequenziale è adatto; per un'indagine aperta come il doppio addebito serve una decomposizione adattiva, con sotto-compiti generati dalle scoperte; una revisione ampia si divide in passate per file (problemi locali) più una passata di integrazione tra file. Le altre combinazioni scambiano le strategie: sezioni inventate a ogni modulo, catena fissa per una causa ignota, passata unica su 20 file che diluisce l'attenzione." });

Q({ id: "s4-n07", s: 4, d: 1, t: "1.7",
  q: "An engineer investigates two unrelated legacy subsystems in the same repository, billing and notifications, switching between them over several days. In one long unnamed session the agent has started mixing facts from the two systems. How should the engineer organize the work?",
  o: [
    "Give each investigation its own named session, and continue whichever one is needed with `--resume <session-name>`.",
    "Run `fork_session` every morning, so that each day's work branches from the combined context of the previous days.",
    "Keep the single session, and ask the agent to prefix every answer with the name of the subsystem it is discussing.",
    "Start a fresh unnamed session each morning and paste the previous day's full transcript into the first message.",
  ], a: [0],
  e: "Le sessioni nominate con `--resume <nome>` permettono di riprendere l'indagine giusta tenendo il contesto separato. `fork_session` serve a creare rami divergenti da una base comune, ma qui il contesto di partenza sarebbe già mescolato; il prefisso nelle risposte non separa il contesto; incollare l'intera trascrizione ricrea il problema e consuma contesto." });

Q({ id: "s4-n08", s: 4, d: 2, t: "2.1",
  q: "Your MCP server exposes `search_codebase` (full-text search over a nightly index of `main` in all 40 company repositories) and `find_in_repository` (live search of the current repository only). Both descriptions read 'Searches code for matching text.' The agent picks between them almost at random: it sometimes floods the engineer with cross-repository hits for a local question, and sometimes searches only the current repository when asked about other services. What is the best fix?",
  o: [
    "Rename them to reflect their scopes, such as `search_all_repos_index` and `search_current_repo`, and rewrite each description to say what it covers and when to prefer the other.",
    "Keep the current names and add eight few-shot examples to the system prompt that show, for each kind of query, which of the two tools it should be routed to.",
    "Add a preprocessing layer that scans each request for phrases such as 'other services' and pre-selects one of the two tools before the model runs.",
    "Remove `search_codebase` from the server so the agent always uses the live search, which eliminates the choice entirely and keeps results limited to the current repository, however large the company is.",
  ], a: [0],
  e: "Due tool con funzione quasi sovrapposta e descrizioni identiche causano errori di instradamento: la soluzione è eliminare l'ambiguità con nomi che esprimono l'ambito e descrizioni che dichiarano copertura e confini. I few-shot aggiungono token senza correggere la causa; un livello di pre-selezione per parole chiave è eccessivo e aggira il modello; rimuovere lo strumento elimina la ricerca su tutti i repository." });

Q({ id: "s4-n09", s: 4, d: 2, t: "2.2",
  q: "You are defining `errorCategory` and `isRetryable` for four failures of a `create_pull_request` MCP tool: (1) the Git host times out; (2) the branch name contains a space; (3) the agent's token lacks write scope on the repository; (4) a branch-protection policy forbids opening pull requests against `release`. Which classification is correct?",
  o: [
    "(1) transient, retryable; (2) validation, not retryable as submitted; (3) permission, not retryable; (4) business-rule violation, not retryable, with an explanation the agent can relay.",
    "(1) transient, retryable; (2) validation, retryable unchanged; (3) permission, retryable after a short wait; (4) business-rule violation, retryable if the agent tries with a different branch.",
    "(1) transient, not retryable; (2) validation, not retryable; (3) permission, retryable; (4) business-rule violation, retryable until the policy has changed.",
    "(1) permission, not retryable; (2) validation, retryable; (3) transient, retryable; (4) business-rule violation, not retryable, with an explanation the agent can relay.",
  ], a: [0],
  e: "Un timeout è transitorio e ripetibile; un input non valido va corretto, quindi non si riprova così com'è; un permesso mancante non si risolve ritentando; una violazione di policy è un errore di business non ripetibile e va accompagnata da una spiegazione leggibile. Le altre classificazioni rendono ripetibili errori che non lo sono (spreco di tentativi) o scambiano categorie, per esempio trattando il timeout come permesso." });

Q({ id: "s4-n10", s: 4, d: 2, t: "2.5",
  q: "The agent works in a large repository with the built-in tools `Read`, `Write`, `Edit`, `Bash`, `Grep`, and `Glob`. Which TWO pairings of a task and a built-in tool are correct?",
  o: [
    "Locating every file whose name matches `*.migration.sql`, wherever it sits in the repository, with `Glob`.",
    "Finding all call sites of `retryWithBackoff` by searching file contents with `Grep`.",
    "Finding all call sites of `retryWithBackoff` with `Glob`, using the function name as the path pattern.",
    "Locating every `.proto` file by searching the contents of all files with `Grep` for the string '.proto'.",
    "Changing one of fourteen identical `return null;` lines with `Edit`, using that line alone as the anchor text.",
  ], a: [0, 1],
  e: "`Glob` abbina i percorsi dei file a un pattern di nome o estensione; `Grep` cerca nel contenuto (chiamanti di una funzione, messaggi, import). `Glob` non guarda il contenuto, quindi non trova i punti di chiamata; cercare un'estensione nel contenuto con `Grep` è lo strumento sbagliato per i nomi di file; `Edit` richiede un testo d'ancoraggio univoco e con quattordici righe identiche fallisce (il ripiego è Read + Write)." });

Q({ id: "s4-n11", s: 4, d: 2, t: "2.3",
  q: "Your repository assistant answers engineers' questions. Sometimes it must search with `Grep` and `Read`; sometimes the answer is conceptual ('What is the difference between a rebase and a merge?'). A developer proposes setting `tool_choice` to `{\"type\": \"any\"}` so that every answer is grounded in the repository. What happens, and what should you do?",
  o: [
    "`\"any\"` forces a tool call on every turn, even for conceptual questions that need none; keep `\"auto\"` so that Claude decides when a tool call is useful.",
    "`\"any\"` makes Claude call every available tool once per turn, which wastes tokens; keep `\"auto\"` to limit the number of calls it makes.",
    "`\"any\"` is the right choice, because with `\"auto\"` Claude cannot call a tool unless the system prompt names that tool explicitly.",
    "Force `{\"type\": \"tool\", \"name\": \"Grep\"}` instead, so that every turn starts with a code search and the answer is then written from the results.",
  ], a: [0],
  e: "Con `\"any\"` il modello deve chiamare un tool (a scelta) a ogni turno, anche quando la domanda è concettuale; con `\"auto\"` può rispondere in testo o usare i tool quando servono. `\"any\"` non chiama tutti i tool, e `\"auto\"` non richiede di nominare i tool nel prompt. Forzare `Grep` avrebbe lo stesso difetto, con in più una ricerca inutile a ogni turno." });

Q({ id: "s4-n12", s: 4, d: 2, t: "2.4",
  q: "Three MCP servers are being set up: (1) a shared documentation-search server that needs no credentials, which every developer should get when they clone the repository; (2) a shared issue-tracker server that needs each developer's personal token; (3) an experimental notes server that only you want to try. Which configuration is correct?",
  o: [
    "(1) project `.mcp.json`; (2) project `.mcp.json` with the token referenced as `${TRACKER_TOKEN}`; (3) your user-scoped `~/.claude.json`.",
    "(1) project `.mcp.json`; (2) project `.mcp.json` with a shared token written inline and committed; (3) project `.mcp.json` under an 'experimental' name.",
    "(1) each developer's `~/.claude.json`; (2) project `.mcp.json` with the token referenced as `${TRACKER_TOKEN}`; (3) your user-scoped `~/.claude.json`.",
    "(1) project `.mcp.json`; (2) each developer's user-scoped `~/.claude.json`, with the token written inline; (3) the project `CLAUDE.md`, with a note that it is experimental.",
  ], a: [0],
  e: "I server condivisi dal team stanno nel `.mcp.json` di progetto (versionato); le credenziali personali si passano con l'espansione di variabili d'ambiente, senza committare segreti; i server personali o sperimentali vanno nel `~/.claude.json` utente. Un token condiviso inline compromette il segreto; la configurazione utente per il server comune richiede setup manuale per ciascuno; CLAUDE.md non definisce server." });

Q({ id: "s4-n13", s: 4, d: 2, t: "2.5",
  q: "The agent must change `DEFAULT_TIMEOUT_MS` from 3000 to 5000. The constant is defined exactly once, on a line that is unique in a 2,800-line `settings.py`. Which approach is most appropriate?",
  o: [
    "Use `Edit` with that unique line as the anchor text, which changes only that text and leaves the rest of the file untouched.",
    "Use `Read` to load the whole file and `Write` it back with the value changed, since rewriting the file is the standard way to modify it.",
    "Use `Bash` to run a `sed` substitution, which modifies the file in place without the agent loading any of its content.",
    "Use `Glob` to locate `settings.py`, then `Write` it again with the whole content regenerated from the agent's summary of the file.",
  ], a: [0],
  e: "`Edit` è lo strumento per modifiche mirate con un testo d'ancoraggio univoco, ed è proprio il caso. Read + Write è il ripiego quando l'ancora non è univoca: qui riscriverebbe 2.800 righe senza motivo, con rischio di alterarle. Un `sed` non è lo strumento indicato per la modifica puntuale, e rigenerare il file da un riassunto può perdere contenuto." });

Q({ id: "s4-n14", s: 4, d: 3, t: "3.1",
  q: "Three kinds of instructions must reach Claude Code: (1) team-wide commit and testing conventions; (2) your personal preference for very short explanations; (3) quirks of the `tools/legacy-export/` directory, such as its unusual build command, which matter only when working there and should not take up context in other sessions. Which placement is correct?",
  o: [
    "(1) project-level `CLAUDE.md`, committed; (2) your user-level `~/.claude/CLAUDE.md`; (3) a directory-level `CLAUDE.md` inside `tools/legacy-export/`.",
    "(1) your user-level `~/.claude/CLAUDE.md`; (2) project-level `CLAUDE.md`, committed; (3) a directory-level `CLAUDE.md` inside `tools/legacy-export/`.",
    "(1) project-level `CLAUDE.md`, committed; (2) your user-level `~/.claude/CLAUDE.md`; (3) the same project-level `CLAUDE.md`, under a heading for the legacy tool.",
    "(1) project-level `CLAUDE.md`, committed; (2) a directory-level `CLAUDE.md` in each folder you work in; (3) your user-level `~/.claude/CLAUDE.md`.",
  ], a: [0],
  e: "La gerarchia ha tre livelli: progetto (condiviso via versionamento) per le convenzioni di team, utente (`~/.claude/CLAUDE.md`, non condiviso) per le preferenze personali, directory per istruzioni valide solo in una sottocartella. Mettere le convenzioni di team a livello utente non le fa arrivare ai colleghi; le particolarità del tool nel file di progetto vengono caricate sempre; le preferenze personali in file di directory versionati colpiscono tutti." });

Q({ id: "s4-n15", s: 4, d: 3, t: "3.2",
  q: "Three needs: (1) the team's naming and error-handling conventions must apply to every session; (2) a codebase-analysis workflow that prints thousands of lines should run only on demand, without cluttering the conversation; (3) SQL migration conventions must apply whenever migration files are edited, in any service directory. Which mapping is correct?",
  o: [
    "(1) the project CLAUDE.md; (2) a skill with `context: fork`; (3) a `.claude/rules/` file with `paths` globs for the migration files.",
    "(1) a skill invoked at the start of each session; (2) the project CLAUDE.md; (3) a `.claude/rules/` file with `paths` globs for the migration files.",
    "(1) the project CLAUDE.md; (2) a `.claude/rules/` file with `paths` globs; (3) a skill with `context: fork` that developers invoke before they edit migrations.",
    "(1) a directory-level CLAUDE.md in each package; (2) a skill without `context: fork`; (3) the user-level `~/.claude/CLAUDE.md` of each developer.",
  ], a: [0],
  e: "Gli standard universali vanno in CLAUDE.md (sempre caricato); un workflow su richiesta con output voluminoso è una skill con `context: fork`, che lo isola dalla conversazione principale; le convenzioni per tipo di file sparse in più directory si applicano con regole in `.claude/rules/` e glob `paths`. Una skill per le convenzioni universali dipende dall'invocazione; una regola per un workflow su richiesta non lo isola; il file utente non è condiviso." });

Q({ id: "s4-n16", s: 4, d: 3, t: "3.3",
  q: "Which TWO statements about path-scoped rules in `.claude/rules/` (files whose YAML frontmatter has a `paths` field with glob patterns) are correct?",
  o: [
    "A rule with `paths: [\"**/*.sql\"]` applies to SQL migration files in any service directory, which a single subdirectory `CLAUDE.md` cannot do.",
    "The rule is loaded only when Claude is editing files that match its patterns, which keeps unrelated conventions out of the context.",
    "The rule is loaded at the start of every session like the root `CLAUDE.md`, and is simply given lower priority outside the matching paths.",
    "Each rule file can name only one directory in `paths`, so conventions that span several directories require one rule file per directory.",
    "The rule applies only after a developer invokes it explicitly with a slash command that names the rule file.",
  ], a: [0, 1],
  e: "I pattern glob in `paths` applicano le convenzioni per tipo di file in qualsiasi directory (un CLAUDE.md di sottocartella è legato a una directory), e la regola si carica solo quando si modificano file corrispondenti, riducendo contesto e token. Non è caricata sempre, non è limitata a una directory e non richiede invocazione manuale con un comando." });

Q({ id: "s4-n17", s: 4, d: 3, t: "3.4",
  q: "Two tickets are open for the productivity agent. Ticket A: replace the in-house HTTP client with a third-party library across roughly 50 files, with two candidate migration strategies. Ticket B: a stack trace shows a missing null check in one function of a single file. Which approach fits each?",
  o: [
    "A: plan mode to explore usages and choose a strategy, then direct execution to implement it; B: direct execution.",
    "A: direct execution, adjusting the strategy as problems appear; B: plan mode, to make sure the null check is correct.",
    "A: direct execution with a detailed prompt describing the preferred strategy; B: direct execution.",
    "A: plan mode, followed by another round of plan mode for each group of files; B: plan mode, since every change deserves a plan first.",
  ], a: [0],
  e: "Una migrazione su circa 50 file con due strategie alternative è un caso da plan mode (esplorare e scegliere prima di toccare il codice), seguita da esecuzione diretta del piano; un null check in un solo file con stack trace chiaro è una modifica semplice e ben delimitata. Partire in diretta sulla migrazione rischia rilavorazioni; pianificare ogni modifica, anche banale, è eccessivo." });

Q({ id: "s4-n18", s: 4, d: 3, t: "3.5",
  q: "Three problems with Claude's generated boilerplate: (1) field-name conversions come out differently each time despite a prose description; (2) you must build a cache layer in a domain nobody on the team knows, and you are unsure which design questions matter; (3) a function passes the happy path but fails on empty-list and NULL inputs. Which technique fits each?",
  o: [
    "(1) two or three concrete input/output examples; (2) the interview pattern, with Claude asking you questions first; (3) tests with example inputs and expected outputs, iterating on the failures.",
    "(1) the interview pattern, with Claude asking you questions first; (2) two or three concrete input/output examples; (3) a longer prose description of how to treat empty and NULL values.",
    "(1) tests with example inputs and expected outputs; (2) plan mode on its own, without questions; (3) the interview pattern, with Claude asking you questions first, even for the failing inputs.",
    "(1) a longer prose description with emphasis on consistency; (2) tests written after the implementation, from what it does; (3) two or three concrete input/output examples for the failing inputs.",
  ], a: [0],
  e: "Conversioni incoerenti nonostante la prosa si risolvono con 2-3 esempi concreti di input/output; in un dominio sconosciuto il pattern a intervista fa emergere considerazioni che non avevi previsto; i casi limite che falliscono si correggono con casi di test specifici (input ed esito atteso) iterando sui fallimenti. Le altre combinazioni assegnano la tecnica sbagliata al problema, per esempio altra prosa a un'incoerenza che la prosa non ha risolto." });

Q({ id: "s4-n19", s: 4, d: 3, t: "3.1",
  q: "The convention 'validate every request body with `zod`' is written in `packages/api/CLAUDE.md`. Frontend developers working in `packages/web/` find that Claude Code does not follow it, although the team wants it everywhere in the monorepo. What is the cause and the right fix?",
  o: [
    "A directory-level CLAUDE.md applies to its own subtree; move the convention into the root `CLAUDE.md` so that it applies across the monorepo.",
    "Duplicate the convention into the `~/.claude/CLAUDE.md` of every frontend developer, since user-level files apply in all folders.",
    "Create a `.claude/rules/` file with `paths: [\"packages/api/**/*\"]` that contains the same convention, so that it is loaded for frontend work as well.",
    "Add a `/validation-style` skill and ask frontend developers to invoke it whenever they begin work in `packages/web/`.",
  ], a: [0],
  e: "Un CLAUDE.md di directory vale per la propria sottocartella: la convenzione scritta in `packages/api/` non raggiunge `packages/web/`; se deve valere ovunque, va nel CLAUDE.md di progetto alla radice. I file utente non sono condivisi e vanno mantenuti da ciascuno; una regola con `paths` limitati ad api non carica nulla per il frontend; una skill richiede invocazione manuale." });

Q({ id: "s4-n20", s: 4, d: 3, t: "3.4",
  q: "An engineer asks: 'In which file is `parseConfig` defined?' in a 1,500-file repository. A single `Grep` for `function parseConfig` would return only a handful of lines. Which approach is best?",
  o: [
    "Run `Grep` directly in the main conversation; the output is small, so no subagent is needed to isolate it.",
    "Delegate to the Explore subagent every time, since every codebase question should be isolated from the main conversation.",
    "Enter plan mode first and write a plan describing the search strategy before running any search.",
    "Use `Glob` for `**/*parse*config*` and then `Read` every matching file to find the definition.",
  ], a: [0],
  e: "L'Explore subagent serve alle fasi di scoperta verbose, per non esaurire il contesto con output voluminoso; per una ricerca puntuale che restituisce poche righe basta un `Grep` diretto. La plan mode è per modifiche ampie o decisioni architetturali, non per una ricerca; `Glob` cerca per nome e non trova la definizione di una funzione, e leggere ogni file corrispondente è uno spreco." });