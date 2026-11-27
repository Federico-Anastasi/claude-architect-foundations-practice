// Scenario 2 · Code Generation with Claude Code · simulation pool
Q({ id: "x2-01", s: 2, d: 3, t: "3.1", sim: 1,
  q: "Your team keeps its coding standards in `docs/coding-standards.md`. Claude Code does not follow them in any developer's session, and running `/memory` shows that the file is not among the loaded memory files. The standards must apply in every session without anyone asking for them. What is the best fix?",
  o: [
    "Reference the file from the project CLAUDE.md with an `@import` line, so its content is loaded in every session.",
    "Ask each developer to begin every session by telling Claude to read `docs/coding-standards.md` before starting any task.",
    "Create a `/standards` command in `.claude/commands/` and ask developers to run it at the start of each session.",
    "Copy the file into each developer's `~/.claude/` directory, so that it is picked up as personal configuration.",
  ], a: [0],
  e: "Un file che `/memory` non elenca non viene caricato: va collegato al CLAUDE.md di progetto con `@import`, così il contenuto entra in ogni sessione e resta modulare e versionato. Chiedere di leggerlo a mano o lanciare un comando a inizio sessione dipende dalla memoria di ciascuno; copiarlo nel livello utente non lo condivide e crea copie divergenti." });

Q({ id: "x2-02", s: 2, d: 3, t: "3.1", sim: 1,
  q: "Claude Code writes commit messages in a terse, lowercase style for one developer, while the other nine on the same repository get the team's documented format. The project CLAUDE.md is committed and has not changed. What is the most likely cause, and how do you confirm it?",
  o: [
    "Commit-style instructions in their own `~/.claude/CLAUDE.md`, which affect only their sessions; confirm with `/memory`.",
    "Their `.mcp.json` lists an MCP server that overrides the project's commit conventions; remove the server to confirm the cause.",
    "Their copy of the project CLAUDE.md is cached from an earlier session; run `/compact` to force it to be reloaded.",
    "Their `.claude/commands/` folder shadows the project CLAUDE.md; compare the two folders to confirm the conflict.",
  ], a: [0],
  e: "Le istruzioni nel `~/.claude/CLAUDE.md` valgono solo per quell'utente e non sono condivise: spiegano una differenza che riguarda una sola persona, e `/memory` mostra quali file sono caricati nella sua sessione. `.mcp.json` configura server MCP, non istruzioni di stile; `/compact` riduce il contesto e non ricarica la configurazione; `.claude/commands/` contiene comandi, non nasconde il CLAUDE.md." });

Q({ id: "x2-03", s: 2, d: 3, t: "3.1", sim: 1,
  q: "Your team wants all Claude Code configuration to live under `.claude/` and keep the repository root uncluttered. Where can the project-level instructions go while still being shared with every developer?",
  o: [
    "In `.claude/CLAUDE.md` in the repository, a valid location for project-level instructions that is committed with the code.",
    "Only in the repository root, because `.claude/CLAUDE.md` is reserved for per-user instructions that are never committed.",
    "In `~/.claude/CLAUDE.md`, because user-level files are the only place that Claude Code reads before the repository.",
    "In `.claude/config.json` as an `instructions` field, which Claude Code reads for project-level guidance shared with the team.",
  ], a: [0],
  e: "Il CLAUDE.md di progetto può stare nella root oppure in `.claude/CLAUDE.md`: in entrambi i casi è nel repository e raggiunge tutti gli sviluppatori. `.claude/CLAUDE.md` non è un file per-utente; il livello utente (`~/.claude/CLAUDE.md`) non è condiviso con il team; un `.claude/config.json` con un campo di istruzioni non esiste." });

Q({ id: "x2-04", s: 2, d: 3, t: "3.2", sim: 1,
  q: "You are writing a `/map-dependencies` skill for the team. Requirements: (1) it reads dozens of files and must not clutter the main conversation, (2) a developer who runs it without naming a module must be prompted for one, and (3) it must be unable to modify files. Which SKILL.md frontmatter satisfies all three?",
  o: [
    "`context: fork`, `argument-hint` naming the module parameter, and `allowed-tools` limited to read and search tools.",
    "`context: fork` and `allowed-tools` limited to read and search tools, with the module name documented in the project CLAUDE.md.",
    "`argument-hint` naming the module parameter and `allowed-tools` limited to read and search tools, with a request in the body to keep output short.",
    "`context: fork` and `argument-hint` naming the module parameter, with a line in the body saying the skill must never modify files.",
  ], a: [0],
  e: "Ogni requisito ha il suo campo: `context: fork` isola l'output verboso, `argument-hint` chiede il parametro mancante, `allowed-tools` limita gli strumenti in modo vincolante. Senza `argument-hint` nessuno chiede il modulo (annotarlo nel CLAUDE.md non compare all'invocazione); senza `context: fork` l'output resta nella conversazione anche se breve; scrivere 'non modificare file' nel corpo è un'istruzione, non un vincolo." });

Q({ id: "x2-05", s: 2, d: 3, t: "3.2", sim: 1,
  q: "Which TWO statements about custom commands and skills in Claude Code are correct?",
  o: [
    "A command stored in `.claude/commands/` is shared with the team through version control, while one in `~/.claude/commands/` is personal.",
    "`context: fork` runs a skill in an isolated sub-agent context, so verbose or exploratory output does not pollute the main conversation.",
    "`allowed-tools` keeps a skill's output out of the main conversation by running the skill in a separate context.",
    "The recommended way to customize a team skill for yourself is to create a personal skill with the same name in `~/.claude/skills/`.",
    "Skills are loaded into every session like CLAUDE.md, so Claude always has their full instructions in context.",
  ], a: [0, 1],
  e: "I comandi in `.claude/commands/` viaggiano col repository, quelli in `~/.claude/commands/` sono personali; `context: fork` isola l'output in un contesto separato. `allowed-tools` restringe gli strumenti, non il contesto; le varianti personali si creano con un nome diverso per non toccare quella del team; le skill sono su richiesta, mentre CLAUDE.md è sempre caricato." });

Q({ id: "x2-06", s: 2, d: 3, t: "3.2", sim: 1,
  q: "The project CLAUDE.md contains 20 universal coding standards plus six long playbooks (release, hotfix, database migration, onboarding, incident response, deprecation) totaling 900 lines. Most sessions need none of the playbooks, and developers feel Claude follows the universal standards less consistently. What is the best reorganization?",
  o: [
    "Keep the universal standards in CLAUDE.md and turn each playbook into a skill that is invoked on demand when it is needed.",
    "Move the playbooks into separate files and pull them into CLAUDE.md with `@import`, so that the main file becomes shorter.",
    "Ask Claude to condense each playbook to one paragraph and keep all six paragraphs in the project CLAUDE.md.",
    "Move the standards and the playbooks to `~/.claude/CLAUDE.md`, so that the repository's CLAUDE.md stays small.",
  ], a: [0],
  e: "CLAUDE.md è per standard universali sempre caricati; i workflow specifici e rari sono skill su richiesta, così non consumano contesto in ogni sessione. `@import` rende il file modulare ma il contenuto importato viene comunque caricato; condensare i playbook perde istruzioni che servono quando si usano; il livello utente toglie gli standard al resto del team." });

Q({ id: "x2-07", s: 2, d: 3, t: "3.2", sim: 1,
  q: "Developers have two complaints about the `/scan-secrets` skill: it once edited a source file while scanning, and its long findings listing clutters the main conversation. Which frontmatter change addresses both?",
  o: [
    "`allowed-tools` limited to read and search tools, plus `context: fork` to keep the listing out of the main conversation.",
    "`context: fork` alone, since a skill running in an isolated context cannot change the files of the main working tree.",
    "`allowed-tools` limited to read and search tools alone, since a skill with fewer tools naturally prints a shorter listing.",
    "`argument-hint` naming the directory to scan, plus a body instruction to print only a short listing and never to edit files.",
  ], a: [0],
  e: "Servono due campi con funzioni diverse: `allowed-tools` limitato a lettura e ricerca impedisce le modifiche ai file, `context: fork` tiene l'elenco lungo fuori dalla conversazione principale. `context: fork` da solo isola il contesto ma non vieta le modifiche al file system; `allowed-tools` da solo non riduce l'output; `argument-hint` chiede un parametro, e le istruzioni nel corpo non sono vincoli." });

Q({ id: "x2-08", s: 2, d: 3, t: "3.3", sim: 1,
  q: "Every service has its own Dockerfile (`services/api/Dockerfile`, `services/worker/Dockerfile`, `tools/migrator/docker/Dockerfile`), and the team's container conventions must load only when a Dockerfile is edited. Which `paths` value fits?",
  o: [
    "`paths: [\"**/Dockerfile\"]`, which matches a file named `Dockerfile` in any directory.",
    "`paths: [\"services/*/Dockerfile\"]`, which matches the Dockerfile directly inside each service folder.",
    "`paths: [\"**/*\"]`, which matches every file so that the container conventions are never missed.",
    "`paths: [\"docker/**\"]`, which matches the files under a top-level `docker` folder.",
  ], a: [0],
  e: "`**/Dockerfile` seleziona il file con quel nome a qualsiasi profondità, quindi copre anche `tools/migrator/docker/Dockerfile`. `services/*/Dockerfile` copre un solo livello e lascia fuori il tool; `**/*` carica le convenzioni per qualunque file, vanificando il caricamento condizionale; `docker/**` presuppone una cartella di primo livello che qui non contiene i Dockerfile." });

Q({ id: "x2-09", s: 2, d: 3, t: "3.3", sim: 1,
  q: "The API conventions live in `.claude/rules/api.md` with `paths: [\"src/api/**/*\"]` and work well. Two new needs arrive: the same API conventions must also apply when Claude edits the OpenAPI file `spec/openapi.yaml`, and the security team's rule 'never log access tokens' must apply to every file in the repository. What is the best setup?",
  o: [
    "Add `spec/openapi.yaml` to the `paths` list of the existing API rule, and put the token rule in the project CLAUDE.md.",
    "Create a second rule file for `spec/**/*` repeating the API conventions, and append the token rule to the existing API rule file.",
    "Move both the API conventions and the token rule into the project CLAUDE.md, so that neither of them can ever be missed.",
    "Put the token rule in a new rule file with `paths: [\"**/*\"]`, and add a `CLAUDE.md` with the API conventions inside `spec/`.",
  ], a: [0],
  e: "Una regola con `paths` può elencare più glob: aggiungere il file OpenAPI estende le stesse convenzioni senza duplicarle. Una regola che vale per ogni file è uno standard universale e va nel CLAUDE.md di progetto, sempre caricato. Duplicare le convenzioni in un secondo file le fa divergere, e mettere la regola sui token nel file API la applica solo lì; spostare tutto nel CLAUDE.md carica le convenzioni API in ogni sessione; un glob `**/*` è un caricamento universale travestito e il CLAUDE.md in `spec/` duplica il testo." });

Q({ id: "x2-10", s: 2, d: 3, t: "3.3", sim: 1,
  q: "The team keeps its SQL-migration conventions in a `/migration-style` skill. When developers ask for schema changes in plain words, Claude edits files under `db/migrations/` without invoking the skill, and the generated migrations violate the conventions. The conventions must apply automatically whenever those files are edited, without adding tokens to unrelated sessions. What should you do?",
  o: [
    "Replace the skill with a `.claude/rules/` file whose `paths` is `db/migrations/**/*`, loaded when those files are edited.",
    "Keep the skill and set `context: fork`, so that it runs automatically in an isolated context whenever migrations are edited.",
    "Move the conventions into the root CLAUDE.md, so that they load in every session regardless of which files are edited.",
    "Keep the skill and add a note to the root CLAUDE.md asking Claude to invoke it before touching any file under `db/migrations/`.",
  ], a: [0],
  e: "Una regola con `paths` si carica da sola quando si modificano i file corrispondenti e non pesa sulle altre sessioni: è ciò che serve qui. `context: fork` isola l'esecuzione ma non avvia la skill; il CLAUDE.md di root carica tutto sempre; una nota che chiede di invocare la skill lascia la scelta al modello, già dimostratosi inaffidabile in questo caso." });

Q({ id: "x2-11", s: 2, d: 3, t: "3.3", sim: 1,
  q: "A rule file with React hooks conventions is scoped with `paths: [\"**/*.ts\"]`, but the UI code lives only under `src/ui/`. Backend developers editing plain `.ts` services report that hooks guidance shows up there, and the token savings of the rule are small. How should you fix the scoping?",
  o: [
    "Narrow `paths` to the UI source folder, for example `src/ui/**/*`, so the rule no longer loads for backend files.",
    "Keep the broad pattern and add a sentence at the top of the rule file saying that its guidance applies only to React code, not to backend code.",
    "Change the pattern to `**/*.{ts,tsx}` so that the rule's scope is stated explicitly for both file types.",
    "Move the hooks conventions into the root CLAUDE.md under a heading marked 'React only'.",
  ], a: [0],
  e: "Lo scoping deve riflettere dove le convenzioni valgono davvero: `src/ui/**/*` limita il caricamento ai file dell'interfaccia. Una frase nella regola non impedisce che venga caricata; `**/*.{ts,tsx}` è ancora più ampio; il CLAUDE.md di root la caricherebbe in ogni sessione." });

Q({ id: "x2-12", s: 2, d: 3, t: "3.4", sim: 1,
  q: "A tech lead wants Claude to propose how to split the `billing` module into two services, but no file may be changed until the proposal has been reviewed and approved. Which way of working fits best?",
  o: [
    "Use plan mode to explore the module and design the split, then review and approve the plan before any implementation starts.",
    "Use direct execution in a throwaway branch, so that the changes can be discarded if the proposal is rejected by the lead.",
    "Ask Claude to implement the split directly and describe each change in the commit messages, so that reviewers can follow the reasoning afterwards.",
    "Use direct execution but instruct Claude in the prompt not to modify any file until you reply with the word 'approved'.",
  ], a: [0],
  e: "Plan mode permette di esplorare e progettare in sicurezza prima di modificare qualunque file: è esattamente il vincolo posto dal tech lead, con un piano da rivedere e approvare. Una branch usa comunque direct execution e produce modifiche da scartare; descrivere le modifiche nei commit le giustifica solo dopo; vietare le modifiche nel prompt è un'istruzione, non una garanzia." });

Q({ id: "x2-13", s: 2, d: 3, t: "3.4", sim: 1,
  q: "Which TWO statements about plan mode, direct execution and the Explore subagent are correct?",
  o: [
    "The Explore subagent isolates verbose discovery output and returns a summary, which preserves the main conversation's context.",
    "A single task can combine plan mode for investigation with direct execution for implementing the approach that was chosen.",
    "Plan mode is required whenever more than one file changes, even when the change is simple and clearly specified.",
    "Direct execution is the safest choice when several valid approaches exist, because the right design emerges while files are edited.",
    "The Explore subagent should be used for every lookup, since keeping discovery out of the main conversation is always preferable.",
  ], a: [0, 1],
  e: "L'Explore subagent isola l'output verboso della scoperta e restituisce un riepilogo; plan mode per investigare e direct execution per implementare si combinano nello stesso lavoro. Plan mode non serve per ogni modifica su più file (il criterio è complessità e decisioni architetturali); con più approcci validi la direct execution fa scoprire il design troppo tardi; per una ricerca breve l'isolamento aggiunge solo passaggi." });

Q({ id: "x2-14", s: 2, d: 3, t: "3.4", sim: 1,
  q: "Your team must move 30 services off a deprecated `legacy-auth` library. There are two viable migration strategies (a compatibility wrapper versus a direct rewrite of each call site), and finding which services and call sites use the library produces thousands of lines of search output. Which workflow fits best?",
  o: [
    "Delegate discovery to the Explore subagent, choose the strategy in plan mode from its summary, then implement directly.",
    "Run discovery, planning and implementation all in plan mode, since the task is complex from start to finish.",
    "Start in direct execution and let the search results guide the strategy while the call sites are being edited.",
    "Use the Explore subagent for discovery, then edit all affected services directly, since its summary shows what to change.",
  ], a: [0],
  e: "La scoperta verbosa va isolata nel subagent Explore, che restituisce un riepilogo; la scelta fra due strategie con costi diversi è lavoro da plan mode; l'applicazione del piano scelto si fa in direct execution. Restare in plan mode fino alla fine usa la modalità sbagliata per modificare i file; partire a modificare scegliendo la strategia strada facendo rischia rifacimenti; il riepilogo mostra dove intervenire, non quale strategia adottare." });

Q({ id: "x2-15", s: 2, d: 3, t: "3.5", sim: 1,
  q: "You need Claude to build a rate limiter for a payment API. You have never built one, you are not sure which behaviors matter (burst handling, clock skew, what happens when the store is down), and you want a verifiable result. Which sequence of techniques fits best?",
  o: [
    "Have Claude interview you about the unfamiliar considerations first, turn the agreed behaviors into tests, then implement and iterate.",
    "Write a test suite from your own first guess at the behaviors, then implement, and rely on production incidents to reveal the missing cases.",
    "Have Claude implement the most common algorithm first, then interview you about the design choices it made once the code already exists.",
    "Give two or three input/output examples of allowed and blocked requests and ask for the whole implementation in a single pass.",
  ], a: [0],
  e: "In un dominio nuovo si parte dall'interview pattern per far emergere considerazioni non previste, si traducono i comportamenti concordati in una suite di test e si implementa iterando sui fallimenti. Test basati su una prima intuizione lasciano i casi mancanti agli incidenti; intervistare dopo l'implementazione scopre le scelte troppo tardi; due o tre esempi non coprono un dominio che non si conosce." });

Q({ id: "x2-16", s: 2, d: 3, t: "3.5", sim: 1,
  q: "Claude keeps normalizing log messages inconsistently even with a detailed prose description of the target format. You decide to add examples to the prompt. Which set of examples is most effective?",
  o: [
    "Two or three input/output pairs covering the tricky cases where earlier outputs differed, such as missing fields.",
    "Several dozen input/output pairs made of simple, typical messages, so that Claude sees the common case many times over.",
    "One input/output pair for the simplest message, plus a prose list of all the exceptions the earlier outputs got wrong.",
    "Output examples only, without the corresponding raw messages, so that Claude concentrates entirely on the target format.",
  ], a: [0],
  e: "Quando la prosa è interpretata in modo incoerente, servono 2-3 esempi concreti di input e output, scelti sui casi ambigui dove le risposte divergevano. Decine di esempi banali non mostrano la regola dove serve; un solo esempio più un elenco di eccezioni in prosa ripropone l'ambiguità; esempi di solo output non mostrano la trasformazione." });

Q({ id: "x2-17", s: 2, d: 3, t: "3.5", sim: 1,
  q: "You wrote a test suite for a currency-conversion module before asking Claude to implement it. The first implementation passes 17 of the 21 tests. What is the most effective way to continue?",
  o: [
    "Share the failing test output (names, expected and actual values) with Claude and ask it to fix the implementation.",
    "Describe the four failures in your own words, without pasting the output, and ask Claude to work out which tests are involved.",
    "Ask Claude to adjust the four failing assertions so that they match the values that the current implementation returns today.",
    "Start a new session with exactly the same prompt, on the assumption that a fresh attempt may pass all 21 tests at once.",
  ], a: [0],
  e: "Nell'iterazione guidata dai test si condividono i fallimenti reali (nomi, valori attesi e ottenuti) perché Claude corregga l'implementazione. Riassumere a parole perde precisione; adattare le asserzioni indebolisce i test per far passare il codice; ripartire da zero butta via ciò che già funziona (17 test) e non usa l'informazione dei fallimenti." });

Q({ id: "x2-18", s: 2, d: 3, t: "3.5", sim: 1,
  q: "Your finance team supplied a spreadsheet with 30 verified examples of tax calculations (input amounts, jurisdiction, and the exact expected result), including rounding edge cases. You need Claude to implement the calculator. Which approach is the most direct fit?",
  o: [
    "Turn the 30 verified cases into a test suite first and have Claude implement against it, iterating by sharing the failing cases.",
    "Use the interview pattern, having Claude ask you detailed questions about the tax rules before it writes any code at all.",
    "Summarize the rounding rules in prose with one or two sample calculations, and ask for the implementation in a single pass.",
    "Enter plan mode so that Claude designs the calculator's architecture first and only then receives the verified cases.",
  ], a: [0],
  e: "Con requisiti già noti e verificati in forma di input/output, il percorso più diretto è scriverli come test e iterare sui fallimenti. L'interview pattern serve quando i requisiti sono sconosciuti, qui sarebbe un passaggio superfluo; la prosa con uno o due esempi butta via 28 casi già verificati; plan mode non fornisce una verifica e ritarda l'uso dei casi." });

Q({ id: "x2-19", s: 2, d: 3, t: "3.6", sim: 1,
  q: "A CI job runs `claude -p` with `--output-format json` and `--json-schema` so that code-review findings can be posted automatically as inline pull-request comments. Which schema design best supports this?",
  o: [
    "An array of findings, each with `file`, `line`, `severity` and `description`, plus an optional `suggested_fix`.",
    "A single `review` string containing the full review in Markdown, which the job splits into comments by heading.",
    "An object with one `summary` string and one overall `severity` for the pull request, posted as a single top-level comment.",
    "An array of findings with only `description` and `severity`, leaving Claude to name the file and line inside the description text.",
  ], a: [0],
  e: "Per commenti in linea servono dati strutturati e leggibili da macchina con la posizione di ogni problema: file, riga, gravità, descrizione, eventualmente il fix suggerito. Una stringa Markdown da spezzare ricrea il parsing fragile; un riepilogo unico non può essere ancorato alle righe; mettere file e riga nel testo libero obbliga a estrarli di nuovo." });

Q({ id: "x2-20", s: 2, d: 3, t: "3.6", sim: 1,
  q: "Three CI jobs (review, test generation, documentation generation) each embed their own 40-line copy of the team's conventions in the `claude -p` prompt. The copies have diverged, and a fourth job was added with no conventions at all. What is the best fix?",
  o: [
    "Move the shared conventions into the project CLAUDE.md, which every CI-invoked run loads; keep prompts task-specific.",
    "Add the conventions to the `~/.claude/CLAUDE.md` of the CI service account, so that all jobs load the same copy of them.",
    "Tell each job's prompt to fetch the conventions from the team wiki at runtime before starting the task it was given.",
    "Remove the conventions from all prompts and rely on the model's general knowledge of good practice for each language.",
  ], a: [0],
  e: "Il CLAUDE.md di progetto è il meccanismo con cui si fornisce contesto a Claude Code in CI: una sola fonte versionata, caricata da ogni job, che evita le copie divergenti. Il livello utente dell'account di servizio non è versionato né legato al repository; recuperare una wiki a runtime dipende da un'istruzione del prompt e da una rete esterna; affidarsi alla conoscenza generica elimina proprio le convenzioni del team." });

Q({ id: "x2-21", s: 2, d: 5, t: "5.4", sim: 1,
  q: "A coordinator runs one subagent per module of a refactoring and keeps a manifest that only records which modules are done. After a crash, the restarted subagents re-derive shared decisions differently: the same `Money` type gets two different names in different modules. What should the exported state and manifest contain in addition?",
  o: [
    "Each agent's key decisions (naming, shared types, interfaces) in structured form, injected into restarted agents' prompts.",
    "The complete transcript of every finished agent, which the coordinator appends in full to the prompt of each restarted agent.",
    "A timestamp for each module's completion, so that the coordinator can restart the agents in their original order.",
    "A request to each restarted agent to infer the earlier decisions from the code that has already been migrated.",
  ], a: [0],
  e: "Per riprendere in modo coerente lo stato esportato deve includere anche le decisioni prese (nomi, tipi condivisi, interfacce) in forma strutturata, che il coordinatore inietta nei prompt degli agenti riavviati. Le trascrizioni complete consumano contesto in modo sproporzionato; i timestamp dicono quando, non cosa è stato deciso; dedurre le decisioni dal codice già migrato è un'euristica che può divergere." });

Q({ id: "x2-22", s: 2, d: 5, t: "5.4", sim: 1,
  q: "The main session delegates 'explore the payments module and tell me everything you find' to a subagent. It returns about 3,000 lines of file summaries, which fill the main context and bury the architecture decisions made earlier. How should the delegation be changed?",
  o: [
    "Give the subagent a specific question, such as which modules call `PaymentGateway` and how refunds flow, and ask for a concise answer.",
    "Keep the broad request and ask the subagent to start its output with a one-paragraph summary of what it found.",
    "Run the same broad exploration in the main session instead, so that nothing is lost between the subagent and the main agent.",
    "Split the broad request into ten smaller broad requests, each exploring one folder of the module and reporting everything it finds there.",
  ], a: [0],
  e: "Una delega ampia ('dimmi tutto') produce un dump verboso che invade il contesto principale: i subagent vanno usati per domande specifiche, con risposta concisa. Un riepilogo in testa non elimina le 3.000 righe; esplorare nella sessione principale peggiora il problema; dieci richieste ampie moltiplicano l'output senza renderlo mirato." });

Q({ id: "x2-23", s: 2, d: 5, t: "5.4", sim: 1,
  q: "You keep a scratchpad file during a long investigation of a legacy order system and ask Claude to consult it before answering. Its entries read: 'order flow is complex', 'uses the repository pattern', 'some validation happens early'. Later answers still fall back on generic descriptions. What would make the scratchpad effective?",
  o: [
    "Record specific findings: class and file names, the call sequence, and the functions involved in each flow.",
    "Move the entries into the root CLAUDE.md, so that they are loaded in every session of the whole project.",
    "Also paste the raw search outputs from the investigation into the file, so that no detail is ever lost.",
    "Stop using the file and re-ask the earlier questions, so that Claude regenerates the details from the code each time.",
  ], a: [0],
  e: "Il degrado del contesto si manifesta con descrizioni generiche invece di classi specifiche: lo scratchpad funziona solo se registra scoperte puntuali (nomi di classi e file, sequenza di chiamate, funzioni). Il CLAUDE.md è configurazione di team, non un taccuino transitorio; incollare output grezzi lo gonfia come il contesto che si voleva alleggerire; rifare le domande ripropone il degrado." });

Q({ id: "x2-24", s: 2, d: 5, t: "5.4", sim: 1,
  q: "In a long investigation you ran `/compact` to free context. Afterwards, Claude describes the architecture in general terms but can no longer name the specific classes and call chains it identified earlier. What practice would have prevented this?",
  o: [
    "Saving specific findings (class names, call chains, paths) in a scratchpad file first, and re-reading it after compacting.",
    "Running `/compact` more often, so that each summary covers a shorter stretch of the conversation and loses less of it.",
    "Asking Claude for longer answers after compacting, so that it recalls more of the earlier details from the summary.",
    "Disabling `/compact` and letting the context fill up, so that no earlier detail is ever summarized away.",
  ], a: [0],
  e: "Prima di `/compact` le scoperte specifiche (nomi di classi, catene di chiamate, percorsi) vanno registrate in un file scratchpad, che Claude rilegge dopo la compattazione: il riassunto conserva il quadro generale ma perde i dettagli. Compattare più spesso o chiedere risposte più lunghe non recupera ciò che è già stato riassunto; disattivare `/compact` lascia riempire il contesto, che è la causa del degrado." });

Q({ id: "x2-25", s: 2, d: 5, t: "5.1", sim: 1,
  q: "A coordinator session spawns four subagents, each analyzing one package for use of a deprecated authentication API, and then merges their reports. The reports say things like 'several call sites use the old API' and 'the old API is probably used in tests', and two reports give conflicting counts. The merged result is not actionable. Which change to the subagents' output requirements helps most?",
  o: [
    "Require structured findings with file path, line, package version and the commit analyzed, instead of prose summaries.",
    "Ask the subagents for longer narrative reports with their full reasoning, so that the coordinator can judge each claim itself.",
    "Have the coordinator repeat the analysis itself on every package, to cross-check the counts the subagents reported.",
    "Ask each subagent for a confidence percentage on its report, and discard the reports with the lowest confidence.",
  ], a: [0],
  e: "I subagent devono restituire dati strutturati con metadati (percorso, riga, versione, data o commit analizzato), così il coordinatore può unirli e capire anche perché i conteggi divergono. Più narrativa e ragionamento gonfiano il contesto; rifare l'analisi in proprio annulla il vantaggio della delega; le percentuali di confidenza autodichiarate sono poco affidabili." });

Q({ id: "x2-26", s: 2, d: 5, t: "5.2", sim: 1,
  q: "Claude Code is asked to add a dependency to the project's manifest. The contribution guide lists approved licenses (MIT, Apache-2.0) and prohibited ones (GPL-3.0), but the requested package uses MPL-2.0, which the guide does not mention. What should Claude do?",
  o: [
    "Stop and ask the developer or maintainers, explaining that the guide does not cover MPL-2.0.",
    "Add the dependency, because the guide prohibits only GPL-3.0 and anything not prohibited is therefore allowed.",
    "Refuse the dependency, because any license missing from the approved list should be treated as prohibited.",
    "Add the dependency and leave a code comment saying the license is unverified, so that a reviewer can catch it later.",
  ], a: [0],
  e: "Quando la policy è muta sul caso specifico, la scelta non spetta a Claude: va segnalato il vuoto e chiesto a un umano. Presumere che ciò che non è vietato sia permesso, o che ciò che non è approvato sia vietato, decide per conto del team; il commento nel codice sposta il rischio sul revisore invece di risolverlo." });

Q({ id: "x2-27", s: 2, d: 5, t: "5.2", sim: 1,
  q: "Claude Code sometimes pushes ahead on risky changes (dropping a database column, changing a public API signature) without checking, yet asks the developer trivial questions about variable names. The team proposes having Claude rate its own confidence from 1 to 10 and ask only when it is below 7. What is the better approach?",
  o: [
    "Write explicit criteria into CLAUDE.md for when to stop and ask (schema drops, API changes) and when to proceed, with examples.",
    "Adopt the confidence rule and raise the threshold from 7 to 8 after a week of observing how often Claude asks questions.",
    "Have Claude infer the developer's mood from their messages and ask more questions whenever they seem relaxed about the task.",
    "Train a small classifier on past sessions to predict which requests need confirmation before Claude begins working on them.",
  ], a: [0],
  e: "Il problema è la mancanza di confini decisionali chiari: criteri espliciti in CLAUDE.md, con esempi di quando fermarsi e quando procedere, risolvono la causa. L'autovalutazione della confidenza è mal calibrata (Claude è sicuro proprio sui casi difficili), quindi cambiare la soglia non basta; l'umore dello sviluppatore non correla con la complessità della modifica; un classificatore addestrato è sovradimensionato quando il prompt non è stato ancora migliorato." });

Q({ id: "x2-28", s: 2, d: 5, t: "5.2", sim: 1,
  q: "Claude Code has tried three different fixes for a failing integration test. Each attempt failed with the same timeout error, and the last two only changed the timeout value. What is the most appropriate behavior now?",
  o: [
    "Stop trying variations, summarize what was tried so far, and ask the developer for direction.",
    "Keep increasing the timeout in further attempts, since each run adds information about how long the service takes.",
    "Mark the test as skipped so that the pipeline is unblocked, and note the problem in the commit message.",
    "Rewrite the test to mock the service that times out, so that it stops failing for good.",
  ], a: [0],
  e: "Dopo tentativi ripetuti senza progresso significativo, l'escalation corretta è fermarsi, riassumere cosa è stato provato e chiedere indicazioni, invece di iterare a caso. Aumentare ancora il timeout ripete lo stesso tentativo; saltare il test o sostituirlo con un mock nasconde il difetto invece di risolverlo." });

Q({ id: "x2-29", s: 2, d: 5, t: "5.3", sim: 1,
  q: "A coordinator session delegates test-gap analysis of four packages to parallel subagents. One subagent times out on the largest package after analyzing 60% of its files. Which TWO behaviors best support recovery?",
  o: [
    "The subagent returns structured error context: the failure type, what it attempted, and the partial results it had gathered.",
    "The coordinator proceeds with the other packages' results and marks the final report with a coverage note for the incompletely analyzed package.",
    "The subagent returns an empty list of gaps marked as successful, so that the coordinator's flow is not interrupted.",
    "The coordinator aborts the whole analysis and reports a single failure, so that no incomplete report is ever produced.",
    "The subagent returns only the status 'analysis unavailable', which keeps its message short for the coordinator.",
  ], a: [0, 1],
  e: "Il subagent restituisce contesto d'errore strutturato (tipo, tentativo, risultati parziali) e il coordinatore prosegue con ciò che ha, annotando nel report le aree con copertura incompleta. Un vuoto marcato come successo sopprime l'errore; interrompere tutto per un solo timeout spreca il lavoro riuscito; uno stato generico nasconde i dettagli necessari a decidere se riprovare." });

Q({ id: "x2-30", s: 2, d: 5, t: "5.3", sim: 1,
  q: "A coordinator migrates 40 modules with parallel subagents. Three modules fail because their test suites cannot run in the sandbox, and the other 37 succeed. The coordinator's draft pull-request description says 'Migration complete'. What should it say instead?",
  o: [
    "That 37 modules were migrated, and list the three that were not, with the reason for each and what remains to be done.",
    "'Migration complete', with the three failures kept in the coordinator's logs where an engineer can find them if they look.",
    "Nothing until all 40 modules succeed, so that the pull request never describes a partial migration to the reviewers.",
    "That the migration is 'mostly complete', without naming the modules, so that the description stays short and readable.",
  ], a: [0],
  e: "La descrizione deve annotare la copertura: quali moduli sono stati migrati, quali no, perché e cosa resta da fare, così il revisore non scambia un risultato parziale per completo. Dichiarare 'completo' con i fallimenti solo nei log nasconde le lacune; non pubblicare nulla scarta il lavoro riuscito; 'quasi completo' senza nomi non permette di agire." });
