// Scenario 2 · Code Generation with Claude Code
Q({ id: "s2-01", s: 2, d: 3, off: 1,
  q: "You want to create a custom `/review` slash command that runs your team's standard code review checklist. This command should be available to every developer when they clone or pull the repository. Where should you create this command file?",
  o: [
    "In the `.claude/commands/` directory in the project repository.",
    "In `~/.claude/commands/` in each developer's home directory.",
    "In the CLAUDE.md file at the project root.",
    "In a `.claude/config.json` file with a commands array.",
  ], a: [0],
  e: "I comandi di progetto stanno in `.claude/commands/` del repository: versionati e disponibili a chi clona. `~/.claude/commands/` è per i comandi personali; CLAUDE.md contiene istruzioni, non definizioni di comandi; `.claude/config.json` con un array di comandi non esiste." });

Q({ id: "s2-02", s: 2, d: 3, off: 1,
  q: "You've been assigned to restructure the team's monolithic application into microservices. This will involve changes across dozens of files and requires decisions about service boundaries and module dependencies. Which approach should you take?",
  o: [
    "Enter plan mode to explore the codebase, understand dependencies, and design an implementation approach before making changes.",
    "Start with direct execution and make changes incrementally, letting the implementation reveal the natural service boundaries.",
    "Use direct execution with comprehensive upfront instructions detailing exactly how each service should be structured.",
    "Begin in direct execution mode and only switch to plan mode if you encounter unexpected complexity during implementation.",
  ], a: [0],
  e: "Plan mode è pensato per cambi su larga scala, con più approcci validi e decisioni architetturali: esplori e progetti prima di toccare il codice. Procedere direttamente rischia rifacimenti costosi; istruzioni dettagliate presuppongono di conoscere già la struttura giusta; la complessità è già dichiarata, non 'eventuale'." });

Q({ id: "s2-03", s: 2, d: 3, off: 1,
  q: "Your codebase has distinct areas with different coding conventions: React components use functional style with hooks, API handlers use async/await with specific error handling, and database models follow a repository pattern. Test files are spread throughout the codebase alongside the code they test (e.g., `Button.test.tsx` next to `Button.tsx`), and you want all tests to follow the same conventions regardless of location. What's the most maintainable way to ensure Claude automatically applies the correct conventions when generating code?",
  o: [
    "Create rule files in `.claude/rules/` with YAML frontmatter specifying glob patterns to conditionally apply conventions based on file paths.",
    "Consolidate all conventions in the root CLAUDE.md file under headers for each area, relying on Claude to infer which section applies.",
    "Create skills in `.claude/skills/` for each code type that include the relevant conventions in their SKILL.md files.",
    "Place a separate CLAUDE.md file in each subdirectory containing that area's specific conventions.",
  ], a: [0],
  e: "Le regole in `.claude/rules/` con glob (es. `**/*.test.tsx`) si applicano in base al percorso, ovunque stia il file: perfetto per i test sparsi. Un unico CLAUDE.md si affida all'inferenza; le skill vanno invocate (non sono automatiche); i CLAUDE.md di cartella non coprono file sparsi in molte directory." });

Q({ id: "s2-04", s: 2, d: 3,
  q: "Claude Code applies the team's naming conventions when the tech lead uses it, but not when other developers do, including a new hire. Investigation shows the conventions are written in the tech lead's `~/.claude/CLAUDE.md`. What is the correct fix?",
  o: [
    "Move the conventions into the project-level CLAUDE.md (repository root or `.claude/CLAUDE.md`) and commit it.",
    "Ask every developer, including new hires, to copy the tech lead's `~/.claude/CLAUDE.md` into their own home directory.",
    "Add the conventions to `.mcp.json` so they are loaded together with the team's shared MCP servers.",
    "Add a CLAUDE.md in each source folder that points to the tech lead's user-level file.",
  ], a: [0],
  e: "Le istruzioni in `~/.claude/CLAUDE.md` valgono solo per quell'utente e non passano dal version control. Le convenzioni di team vanno nel CLAUDE.md di progetto. Copiare a mano crea divergenze; `.mcp.json` configura server MCP; il file di un utente non è raggiungibile dagli altri." });

Q({ id: "s2-05", s: 2, d: 3,
  q: "A developer reports that Claude Code follows the testing conventions in some sessions but not in others, in the same repository. What is the most direct way to diagnose which instruction files are actually loaded?",
  o: [
    "Run the `/memory` command to see which memory files are loaded in the session.",
    "Run `/compact` to reset the context and check whether the conventions reappear.",
    "Start the session with `--resume` so it reloads the configuration of the previous session.",
    "Ask Claude to list the conventions it knows and compare its answers across sessions.",
  ], a: [0],
  e: "`/memory` mostra quali file di memoria (CLAUDE.md e regole) sono caricati: è lo strumento per diagnosticare comportamenti incoerenti tra sessioni. Chiedere al modello è indiretto e inaffidabile." });

Q({ id: "s2-06", s: 2, d: 3,
  q: "Your monorepo has 12 packages. Shared standards live in files such as `standards/security.md`, `standards/react.md`, and `standards/data-access.md`. Each package needs a different subset, chosen by its maintainers. What is the most maintainable approach?",
  o: [
    "In each package's CLAUDE.md, use `@import` to include only the standards files relevant to that package.",
    "Copy the relevant standards text into each package's CLAUDE.md so every file is self-contained.",
    "Put all the standards in the root CLAUDE.md and let Claude decide which sections apply to the package being edited.",
    "Turn each standards file into a skill that developers invoke when they work on a given package.",
  ], a: [0],
  e: "`@import` tiene CLAUDE.md modulare: ogni package include solo i file pertinenti, con una sola fonte per ogni standard. Copiare duplica; tutto in root si affida all'inferenza; le skill sono su richiesta, mentre gli standard devono valere sempre." });

Q({ id: "s2-07", s: 2, d: 3,
  q: "The root CLAUDE.md has grown to 1,400 lines covering testing, API conventions, deployment, and code style, and it is hard to maintain. What is the recommended way to reorganize it?",
  o: [
    "Split it into focused topic files in `.claude/rules/`, such as `testing.md`, `api-conventions.md`, and `deployment.md`.",
    "Move it to `~/.claude/CLAUDE.md` so it no longer clutters the repository.",
    "Turn each section into a slash command in `.claude/commands/` that developers run when they need that part of the guidance.",
    "Ask Claude to compress it into a 200-line summary and replace the original file.",
  ], a: [0],
  e: "`.claude/rules/` è l'alternativa a un CLAUDE.md monolitico: file per argomento, più facili da mantenere, eventualmente limitati per percorso. A livello utente il team lo perde; i comandi sono su richiesta; comprimerlo perde informazione." });

Q({ id: "s2-08", s: 2, d: 3,
  q: "Your team's `/analyze-codebase` skill reads dozens of files and produces long intermediate output. After running it, developers find the main conversation cluttered and later answers degrade. Which SKILL.md frontmatter change addresses this?",
  o: [
    "Add `context: fork`, so the skill runs in an isolated sub-agent context and only its result returns to the main conversation.",
    "Add `allowed-tools: Read, Grep`, so the skill uses fewer tools and therefore produces less output.",
    "Add `argument-hint`, so developers pass a narrower directory and the skill reads fewer files.",
    "Add a `model` field pointing to a model with a larger context window, so that all of the intermediate output fits comfortably.",
  ], a: [0],
  e: "`context: fork` esegue la skill in un contesto di subagent isolato: l'output verboso non inquina la conversazione principale. `allowed-tools` limita gli strumenti, non il contesto; `argument-hint` serve a chiedere i parametri; un contesto più grande non evita l'inquinamento." });

Q({ id: "s2-09", s: 2, d: 3,
  q: "You are writing a `/generate-migration` skill that should only create new migration files. You want to make sure it cannot run shell commands or delete files while it executes. What should you use?",
  o: [
    "Set `allowed-tools` in the SKILL.md frontmatter to restrict the skill to file-writing tools.",
    "Write 'Never run shell commands or delete files' prominently at the top of the SKILL.md body.",
    "Set `context: fork` so that any destructive action stays confined to the sub-agent's isolated context.",
    "Add the restriction to the project CLAUDE.md so it applies whenever the skill is invoked.",
  ], a: [0],
  e: "`allowed-tools` limita gli strumenti disponibili durante la skill: un vincolo, non un'istruzione. `context: fork` isola la conversazione, non il filesystem: un comando distruttivo resta distruttivo." });

Q({ id: "s2-10", s: 2, d: 3,
  q: "Developers often invoke your `/scaffold-component` skill without specifying the component name, and the skill produces a generic `MyComponent`. What is the most direct fix?",
  o: [
    "Add `argument-hint` to the skill's frontmatter so developers are prompted for the required component name.",
    "Add `allowed-tools` so the skill cannot create files until a name has been provided.",
    "Document in the project CLAUDE.md that the component name is a required argument.",
    "Set `context: fork` so the skill can pause and ask the developer for the missing name in a separate, isolated context.",
  ], a: [0],
  e: "`argument-hint` indica quali parametri servono quando la skill viene invocata senza argomenti. Documentarlo altrove non lo rende visibile al momento dell'invocazione." });

Q({ id: "s2-11", s: 2, d: 3,
  q: "Your team has a project skill `/review` in `.claude/skills/review/`. You want a personal version with extra checks for your own workflow, without changing anything for your teammates. What should you do?",
  o: [
    "Create a personal skill in `~/.claude/skills/` with a different name, such as `/review-deep`.",
    "Edit `.claude/skills/review/SKILL.md` in your working copy and take care never to commit the change.",
    "Create `~/.claude/skills/review/` with the same name so that your version replaces the team's for you.",
    "Add the extra checks to the project CLAUDE.md, scoped with a note that they apply only to you.",
  ], a: [0],
  e: "Le varianti personali stanno in `~/.claude/skills/` con un nome diverso, così non tocchi né confondi la versione del team. Una modifica locale non committata è fragile; lo stesso nome crea ambiguità; il CLAUDE.md di progetto vale per tutti." });

Q({ id: "s2-12", s: 2, d: 3,
  q: "Your team wants Claude to (1) always follow the project's error-handling conventions and (2) follow a 12-step release-notes workflow that is used about twice a month. Where should each one live?",
  o: [
    "Error-handling conventions in CLAUDE.md (always loaded); the release-notes workflow as a skill (invoked on demand).",
    "Both in CLAUDE.md, so that Claude always has the release-notes workflow in context and never needs to be told when it applies.",
    "Both as skills, so that neither consumes context until a developer explicitly invokes it.",
    "Error-handling conventions as a skill; the release-notes workflow in CLAUDE.md for visibility.",
  ], a: [0],
  e: "CLAUDE.md = standard universali sempre caricati; skill = workflow specifici su richiesta. Un workflow raro in CLAUDE.md consuma contesto in ogni sessione; le convenzioni in una skill diventano facoltative." });

Q({ id: "s2-13", s: 2, d: 3,
  q: "A production error report includes a clear stack trace pointing to a missing null check in one function of a single file. Which approach fits best?",
  o: [
    "Direct execution: the change is small and well-scoped, and the cause is already identified.",
    "Plan mode: every production fix should be designed and reviewed before any change is made.",
    "Plan mode, followed by the Explore subagent mapping every caller before the file is touched.",
    "Direct execution, but only after adding a CLAUDE.md rule that describes null-check conventions.",
  ], a: [0],
  e: "Direct execution per cambi semplici e delimitati: bug in un file con stack trace chiaro. Plan mode serve per cambi ampi, più approcci validi, decisioni architetturali." });

Q({ id: "s2-14", s: 2, d: 3,
  q: "You asked Claude to normalize phone numbers in a data-cleaning script. Despite a detailed prose description, results vary: some numbers keep spaces, others lose the country code. What is the most effective next step?",
  o: [
    "Provide 2-3 concrete input/output examples showing exactly how different raw formats must be transformed.",
    "Rewrite the description with more precise wording and stronger emphasis on the country code.",
    "Ask Claude to restate its understanding of the requirement in its own words before it regenerates the normalization code.",
    "Switch to plan mode so Claude designs the normalization approach before implementing it.",
  ], a: [0],
  e: "Quando la prosa viene interpretata in modo incoerente, 2-3 esempi concreti di input e output sono il modo più efficace per comunicare la trasformazione." });

Q({ id: "s2-15", s: 2, d: 3,
  q: "You need Claude to implement a caching layer for a service in a domain your team knows little about. You are not sure which design decisions matter. What technique fits best before implementation?",
  o: [
    "The interview pattern: have Claude ask you questions about requirements such as invalidation strategy and failure modes before implementing.",
    "Have Claude implement the most widely used caching approach for this kind of service, and refine it based on the bugs that show up in production.",
    "Write a complete test suite first, including performance requirements, and let Claude implement against it.",
    "Use direct execution with a long, detailed prompt describing the caching layer you think is needed.",
  ], a: [0],
  e: "Interview pattern: Claude fa domande per far emergere aspetti non previsti (invalidazione, failure mode) prima di implementare in un dominio poco noto. Il TDD presuppone di sapere già quali requisiti testare." });

Q({ id: "s2-16", s: 2, d: 3,
  q: "Review found three problems in Claude's implementation: the retry logic, the timeout value, and the circuit-breaker threshold. Changing any one of them changes how the others should be set. How should you communicate the fixes?",
  o: [
    "Describe all three issues together in a single detailed message, since the fixes interact.",
    "Fix them one at a time in separate messages, verifying each fix before moving on to the next one.",
    "Open a new session for each issue so that one fix does not bias the others.",
    "Ask Claude to fix the most severe one first and let it discover the other two by itself.",
  ], a: [0],
  e: "Problemi che interagiscono → un unico messaggio dettagliato, così le correzioni restano coerenti tra loro. Problemi indipendenti → uno alla volta." });

Q({ id: "s2-17", s: 2, d: 5,
  q: "During a two-hour session exploring a large legacy codebase, Claude starts answering with references to 'typical patterns' instead of the specific classes it identified earlier. Which practice best counteracts this?",
  o: [
    "Have Claude keep a scratchpad file of key findings and reference it for subsequent questions.",
    "Repeat your earlier questions so that Claude re-reads the same files and refreshes what it found.",
    "Switch to a model with a larger context window for the remainder of the session.",
    "Lower the sampling temperature so Claude's answers become more deterministic and specific.",
  ], a: [0],
  e: "Degrado del contesto nelle sessioni lunghe: i risultati chiave vanno salvati in un file scratchpad e richiamati. Aiutano anche subagent e `/compact`; rileggere tutto o allargare il contesto non affronta la causa." });

Q({ id: "s2-18", s: 2, d: 3,
  q: "You must migrate from one HTTP client library to another. The change touches about 45 files, and there are two possible migration strategies with different trade-offs. Which workflow fits best?",
  o: [
    "Plan mode to investigate usage and choose a strategy, then direct execution to implement the planned approach.",
    "Direct execution file by file, letting the right strategy emerge from the first few files.",
    "Plan mode for the entire task, keeping it active until every file has been migrated.",
    "Ask Claude to pick whichever strategy changes the fewest lines of code, and then proceed with direct execution across all 45 files.",
  ], a: [0],
  e: "Si combinano: plan mode per indagare e scegliere tra approcci, direct execution per applicare il piano. Plan mode serve a esplorare e progettare, non a modificare i file." });

Q({ id: "s2-19", s: 2, d: 3,
  q: "You want Claude to implement a date-range parser with tricky edge cases (leap years, open-ended ranges, time zones). Which approach best supports progressive improvement?",
  o: [
    "Write a test suite covering expected behavior and edge cases first, then iterate by sharing failing test output with Claude.",
    "Ask Claude to implement the parser first and then write tests for the code it produced.",
    "Describe every edge case in prose and ask Claude to confirm it has handled each one.",
    "Implement the parser in plan mode, so that every edge case is identified, discussed, and considered before any code is written.",
  ], a: [0],
  e: "Iterazione guidata dai test: prima i test (comportamento atteso, edge case, prestazioni), poi si itera condividendo i fallimenti. Test scritti dopo dal modello tendono a confermare il codice che ha scritto." });
