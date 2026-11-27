// Scenario 4 · Developer Productivity with Claude
Q({ id: "s4-01", s: 4, d: 2,
  q: "An engineer asks the agent to list every test file in a large React repository. Test files follow the pattern `*.test.tsx` and are spread across many directories. Which built-in tool is most appropriate?",
  o: [
    "Glob with the pattern `**/*.test.tsx`.",
    "Grep searching for the string `describe(` across the repository.",
    "Bash running a recursive directory listing and filtering its output.",
    "Read on the repository root to inspect its directory tree.",
  ], a: [0],
  e: "Glob trova file per nome o estensione. Grep cerca nel contenuto (e `describe(` compare anche fuori dai test); un listing ricorsivo produce un output enorme." });

Q({ id: "s4-02", s: 4, d: 2,
  q: "The agent must find every place where `calculateShippingCost` is called in a codebase of 3,000 files. Which tool should it use first?",
  o: [
    "Grep for `calculateShippingCost` across the codebase.",
    "Glob for files whose names contain `shipping`.",
    "Read every file under `src` and scan each one for the function.",
    "Bash running the test suite to see which tests exercise the function.",
  ], a: [0],
  e: "Grep cerca nel contenuto dei file: è lo strumento per trovare chiamanti, messaggi d'errore, import. Glob guarda solo i percorsi." });

Q({ id: "s4-03", s: 4, d: 2,
  q: "The agent's Edit call fails because the anchor text `return null;` appears 14 times in the file, while the intended change is in one specific function. According to recommended practice, what is the reliable fallback?",
  o: [
    "Use Read to load the full file, then Write the complete updated content.",
    "Retry the same Edit call, since Edit applies to the first occurrence on a second attempt.",
    "Use Glob to locate the file again and repeat the Edit with the same anchor.",
    "Use Bash with a line-number-based `sed` command that targets the first match.",
  ], a: [0],
  e: "Edit richiede un testo d'ancoraggio univoco. Quando non lo è, la guida indica Read + Write come ripiego affidabile. Ripetere la stessa Edit fallisce di nuovo; un `sed` alla cieca rischia di modificare l'occorrenza sbagliata." });

Q({ id: "s4-04", s: 4, d: 2,
  q: "An engineer asks: 'How does authentication work in this legacy service?' The repository has 1,200 files. Which exploration strategy should the agent follow?",
  o: [
    "Grep for entry points such as `login` or `authenticate`, then Read the matching files and follow their imports to trace the flow.",
    "Read all 1,200 files upfront so that the agent has complete knowledge before answering.",
    "Glob every `.js` file in the repository and Read them one by one in alphabetical order until the authentication logic finally turns up.",
    "Ask the engineer to list the relevant files before the agent begins exploring.",
  ], a: [0],
  e: "Comprensione incrementale: Grep per i punti d'ingresso, Read per seguire import e flussi. Leggere tutto all'inizio esaurisce il contesto." });

Q({ id: "s4-05", s: 4, d: 2,
  q: "A utility module re-exports functions from several internal modules under different names (for example `export { fetchUser as getUser }`). The agent needs to find all usages of the underlying functionality. What approach is most reliable?",
  o: [
    "First identify all names exported by the wrapper module, then search the codebase for each of those names.",
    "Search only for the original internal function names, since every re-export ultimately points to the same code.",
    "Search only for the wrapper's import path and assume every importing file uses every function.",
    "Read the wrapper module and infer from its structure which files probably depend on it.",
  ], a: [0],
  e: "Per seguire l'uso attraverso un wrapper: individua tutti i nomi esportati, alias compresi, poi cercali uno per uno. I soli nomi originali perdono gli usi tramite alias." });

Q({ id: "s4-06", s: 4, d: 2,
  q: "The team wants the agent to read and update Jira tickets. One engineer proposes writing a custom MCP server for it. What is the recommended approach?",
  o: [
    "Use an existing community MCP server for Jira, and reserve custom servers for team-specific workflows.",
    "Write a custom MCP server, so that the team fully controls every tool description and behavior from the start.",
    "Give the agent Bash access with `curl` so it can call the Jira REST API directly.",
    "Export Jira tickets nightly to a JSON file that the agent reads with the Read tool.",
  ], a: [0],
  e: "Per integrazioni standard come Jira si usano i server MCP della community; i server custom servono per i workflow specifici del team." });

Q({ id: "s4-07", s: 4, d: 2,
  q: "You add a shared GitHub MCP server to the project's `.mcp.json`. It needs a personal access token. How should the token be provided?",
  o: [
    "Reference it through environment variable expansion, such as `${GITHUB_TOKEN}`, so each developer supplies their own and no secret is committed.",
    "Paste a shared team token into `.mcp.json` and restrict access to the repository to team members, so the token is never exposed outside the team.",
    "Put the token in the project CLAUDE.md so Claude can pass it to the server when needed.",
    "Move the whole server definition into each developer's `~/.claude.json` to keep tokens private.",
  ], a: [0],
  e: "Il `.mcp.json` di progetto è versionato: le credenziali passano dall'espansione di variabili d'ambiente. Spostare tutto a livello utente rinuncia alla configurazione condivisa." });

Q({ id: "s4-08", s: 4, d: 2,
  q: "You want to try an experimental MCP server for your personal note-taking app without affecting your teammates. Where should you configure it?",
  o: [
    "In the user-scoped `~/.claude.json`.",
    "In the project's `.mcp.json`, with a comment marking it as experimental.",
    "In `.claude/settings.json` inside the repository.",
    "In the project CLAUDE.md under an 'Experimental' heading.",
  ], a: [0],
  e: "Server personali o sperimentali → `~/.claude.json` (utente). Server condivisi dal team → `.mcp.json` di progetto." });

Q({ id: "s4-09", s: 4, d: 2,
  q: "A developer has the team's database MCP server configured in `.mcp.json` and a personal documentation server in `~/.claude.json`. They ask whether they must switch configurations to use both in one session. What is correct?",
  o: [
    "No: tools from all configured MCP servers are discovered at connection time and are available to the agent simultaneously.",
    "Yes: only one scope is active at a time, and user-level servers override project-level ones.",
    "Yes: project-level servers take precedence, so the personal server is ignored whenever Claude Code runs inside this repository.",
    "No, but the agent can call only one server's tools per turn, alternating between servers.",
  ], a: [0],
  e: "I tool di tutti i server MCP configurati vengono scoperti alla connessione e sono disponibili insieme." });

Q({ id: "s4-10", s: 4, d: 2,
  q: "Your team built an MCP tool, `search_code_semantic`, that understands symbol relationships across services. The agent keeps using the built-in Grep instead and misses cross-service references. The MCP tool's description is 'Searches code.' What should you do first?",
  o: [
    "Expand the MCP tool's description to explain its capabilities, inputs, outputs, and when it is preferable to Grep.",
    "Remove Grep from the agent's available tools, so that the agent is forced to use the MCP tool for every code search.",
    "Add a system prompt rule stating that Grep must never be used in this project.",
    "Rename the tool to `grep_advanced` so the agent associates it with code search.",
  ], a: [0],
  e: "Una descrizione dettagliata (capacità, output, quando preferirlo) evita che l'agente preferisca i tool built-in. Togliere Grep elimina uno strumento utile nei casi semplici; un divieto nel prompt non spiega quando usare il tool MCP." });

Q({ id: "s4-11", s: 4, d: 2,
  q: "In every session, the agent spends many tool calls listing tables and reading schemas before it can write a single query. Which MCP feature addresses this?",
  o: [
    "Expose the database schemas as MCP resources, so the agent sees the available data catalog without exploratory tool calls.",
    "Add a `list_everything` tool that returns every table and schema in a single call, so the agent explores with one call instead of many.",
    "Paste the full database schema into the system prompt of every session.",
    "Raise the agent's tool-call limit so that exploration does not cut its work short.",
  ], a: [0],
  e: "Le MCP resources espongono cataloghi di contenuto (schemi DB, documentazione, sommari di issue) e danno visibilità senza chiamate esplorative. Tools = azioni; resources = contenuti." });

Q({ id: "s4-12", s: 4, d: 2,
  q: "A single `analyze_document` tool is used for extracting figures, summarizing, and checking claims. The agent often gets the wrong kind of output back. What is the recommended redesign?",
  o: [
    "Split it into purpose-specific tools with defined contracts, such as `extract_data_points`, `summarize_content`, and `verify_claim_against_source`.",
    "Add a free-text `mode` parameter so that the agent can describe what kind of analysis it wants.",
    "Keep one tool but lengthen its description with examples of all three uses.",
    "Route all document requests through a dedicated sub-agent that decides internally which kind of analysis to run and returns the result in a common format.",
  ], a: [0],
  e: "Tool generico → più tool specifici con contratti di input e output definiti." });

Q({ id: "s4-13", s: 4, d: 2,
  q: "The agent has a generic `fetch_url` tool. It sometimes fetches unrelated web pages when it should only load internal documentation. What is the best fix?",
  o: [
    "Replace `fetch_url` with a constrained `load_document` tool that validates URLs against the documentation domain.",
    "Add a sentence to the system prompt asking the agent to fetch only URLs that belong to the internal documentation site.",
    "Log every fetched URL and review the logs each week for unrelated pages.",
    "Keep `fetch_url` but lower its maximum response size so unrelated pages cost less.",
  ], a: [0],
  e: "Si sostituisce il tool generico con un'alternativa vincolata che valida l'input: il vincolo è nel tool, non in una richiesta al modello." });

Q({ id: "s4-14", s: 4, d: 2,
  q: "Tool descriptions are clear, but the agent calls `analyze_content` for almost every request. The system prompt says: 'Always analyze the content of the user's request carefully.' What is the likely cause?",
  o: [
    "The wording 'analyze the content' in the system prompt creates an unintended association with `analyze_content`; the instruction should be reworded.",
    "The `analyze_content` description is longer and more detailed than the others, so it dominates the model's attention when it selects a tool for each request.",
    "The agent has too few tools and falls back to the most general one available.",
    "The model needs few-shot examples of requests that should not use `analyze_content`.",
  ], a: [0],
  e: "Istruzioni del system prompt sensibili alle parole chiave possono creare associazioni involontarie con i nomi dei tool e scavalcare buone descrizioni: va rivisto il testo." });

Q({ id: "s4-15", s: 4, d: 1,
  q: "Yesterday you analyzed a module in a named session `auth-refactor`. Overnight, a teammate modified 2 of its 30 files. You want to continue today. What is most effective?",
  o: [
    "Resume with `--resume auth-refactor` and tell the agent which two files changed so it re-analyzes them specifically.",
    "Resume the session and ask the agent to re-read all 30 files to be safe.",
    "Resume the session without mentioning the changes; the agent will notice the modified files by itself when it reads them.",
    "Start a brand-new session and redo the full analysis from scratch.",
  ], a: [0],
  e: "Contesto in gran parte valido → riprendi la sessione nominata e indica i file cambiati per un'analisi mirata. L'agente non sa da solo che alcuni risultati dei tool sono superati." });

Q({ id: "s4-16", s: 4, d: 1,
  q: "After a week of major refactoring, most files analyzed in your previous session have changed substantially. You want to continue the investigation. What is most reliable?",
  o: [
    "Start a new session and inject a structured summary of the conclusions that are still valid, instead of resuming with stale tool results.",
    "Resume the old session, since its context holds the most complete record of the analysis.",
    "Resume the old session and compact it, so the stale results are summarized away.",
    "Fork the old session with `fork_session`, so that the stale tool results are kept on a separate branch and do not affect the continued investigation.",
  ], a: [0],
  e: "Se i risultati precedenti sono in gran parte superati, una nuova sessione con un riepilogo strutturato è più affidabile della ripresa. Compattare o fare fork porta con sé gli stessi dati vecchi." });

Q({ id: "s4-17", s: 4, d: 1,
  q: "You have completed a shared analysis of a codebase and want to compare two refactoring approaches, extracting a service versus modularizing in place, without one exploration contaminating the other. What should you use?",
  o: [
    "`fork_session`, to create two independent branches from the shared analysis baseline.",
    "Two `--resume` commands on the same session, run one after the other.",
    "A single session in which you explore both approaches, alternating between them message by message.",
    "Two new sessions, each re-running the full codebase analysis from scratch.",
  ], a: [0],
  e: "`fork_session` crea rami indipendenti da una base comune per esplorare approcci divergenti. Riprendere due volte la stessa sessione mescola le esplorazioni; ripartire da zero spreca l'analisi già fatta." });

Q({ id: "s4-18", s: 4, d: 1,
  q: "An engineer asks: 'Add comprehensive tests to this legacy codebase.' Which decomposition strategy fits best?",
  o: [
    "Map the codebase structure, identify high-impact areas, and create a prioritized plan that adapts as dependencies are discovered.",
    "Use a fixed pipeline that generates tests for each file in alphabetical order, so that progress is predictable and every file gets covered eventually.",
    "Generate tests for every file in a single request so that coverage is consistent.",
    "Ask the engineer for the complete list of functions to test before starting.",
  ], a: [0],
  e: "Task aperto → decomposizione dinamica e adattiva. La pipeline fissa (prompt chaining) è adatta a lavori prevedibili come una review in più passate." });

Q({ id: "s4-19", s: 4, d: 3,
  q: "Before a refactor, the agent must survey a large monorepo. The discovery phase produces thousands of lines of search results and file listings, and by the implementation phase the context is nearly exhausted. What should you do?",
  o: [
    "Delegate the discovery phase to the Explore subagent, which isolates the verbose output and returns a summary.",
    "Skip discovery and start implementing in the files you already know about.",
    "Raise the output limit so that the discovery results are captured in full.",
    "Paste the discovery output into CLAUDE.md, so that it is loaded automatically in this session and in every later one.",
  ], a: [0],
  e: "L'Explore subagent isola l'output verboso della fase di scoperta e restituisce un riassunto, preservando il contesto principale." });

Q({ id: "s4-20", s: 4, d: 1,
  q: "A colleague proposes replacing the agent's tool selection with a hard-coded decision tree: 'if the question mentions a file, call Read; if it mentions a function, call Grep'. For exploring unfamiliar codebases, why is this usually worse?",
  o: [
    "Model-driven decisions let Claude choose the next tool based on what it has discovered so far, which a fixed tree cannot anticipate.",
    "Decision trees execute more slowly than model calls inside the Agent SDK, because each branch requires an additional round trip to the API.",
    "The Agent SDK does not allow tools to be called outside the model's control.",
    "A hard-coded tree cannot call both Grep and Read within the same session.",
  ], a: [0],
  e: "Nel loop model-driven Claude sceglie il tool successivo in base al contesto e a ciò che ha scoperto. Alberi decisionali o sequenze fisse vanno bene solo per flussi prevedibili o dove serve un vincolo." });
