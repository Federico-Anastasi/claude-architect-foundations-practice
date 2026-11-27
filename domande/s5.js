// Scenario 5 · Claude Code for Continuous Integration
Q({ id: "s5-01", s: 5, d: 3, off: 1,
  q: "Your pipeline script runs `claude \"Analyze this pull request for security issues\"` but the job hangs indefinitely. Logs indicate Claude Code is waiting for interactive input. What's the correct approach to run Claude Code in an automated pipeline?",
  o: [
    "Add the `-p` flag: `claude -p \"Analyze this pull request for security issues\"`.",
    "Set the environment variable `CLAUDE_HEADLESS=true` before running the command.",
    "Redirect stdin from `/dev/null`: `claude \"Analyze this pull request for security issues\" < /dev/null`.",
    "Add the `--batch` flag: `claude --batch \"Analyze this pull request for security issues\"`.",
  ], a: [0],
  e: "`-p` (`--print`) è il modo documentato per la modalità non interattiva: elabora il prompt, scrive su stdout ed esce. `CLAUDE_HEADLESS` e `--batch` non esistono; redirigere stdin è un espediente Unix che non affronta la sintassi di Claude Code." });

Q({ id: "s5-02", s: 5, d: 4, off: 1,
  q: "Your team wants to reduce API costs for automated analysis. Currently, real-time Claude calls power two workflows: (1) a blocking pre-merge check that must complete before developers can merge, and (2) a technical debt report generated overnight for review the next morning. Your manager proposes switching both to the Message Batches API for its 50% cost savings. How should you evaluate this proposal?",
  o: [
    "Use batch processing for the technical debt reports only; keep real-time calls for pre-merge checks.",
    "Switch both workflows to batch processing with status polling to check for completion.",
    "Keep real-time calls for both workflows to avoid batch result ordering issues.",
    "Switch both to batch processing with a timeout fallback to real-time if batches take too long.",
  ], a: [0],
  e: "La Batch API costa il 50% in meno ma può impiegare fino a 24 ore senza SLA: inadatta ai controlli pre-merge bloccanti, ideale per il report notturno. 'Spesso è più veloce' non basta per un flusso bloccante; l'ordine dei risultati si gestisce con `custom_id`; il fallback aggiunge complessità inutile." });

Q({ id: "s5-03", s: 5, d: 4, off: 1,
  q: "A pull request modifies 14 files across the stock tracking module. Your single-pass review analyzing all files together produces inconsistent results: detailed feedback for some files but superficial comments for others, obvious bugs missed, and contradictory feedback, flagging a pattern as problematic in one file while approving identical code elsewhere in the same PR. How should you restructure the review?",
  o: [
    "Split into focused passes: analyze each file individually for local issues, then run a separate integration-focused pass examining cross-file data flow.",
    "Require developers to split large PRs into smaller submissions of 3-4 files before the automated review runs.",
    "Switch to a higher-tier model with a larger context window to give all 14 files adequate attention in one pass.",
    "Run three independent review passes on the full PR and only flag issues that appear in at least two of the three runs.",
  ], a: [0],
  e: "La causa è la diluizione dell'attenzione su molti file. Passate per singolo file danno profondità uniforme, una passata di integrazione coglie i problemi tra file. Spezzare le PR scarica il problema sugli sviluppatori; un contesto più grande non migliora l'attenzione; il consenso sopprime bug reali che emergono a intermittenza." });

Q({ id: "s5-04", s: 5, d: 3,
  q: "Your CI job runs Claude Code to review pull requests and must post each finding as an inline comment through the GitHub API. Parsing the free-text output keeps breaking. What should you use?",
  o: [
    "`--output-format json` together with `--json-schema` to produce machine-parseable structured findings.",
    "A prompt instruction to answer only in JSON, plus a regular expression that extracts the JSON block.",
    "A verbose output mode so the result includes structured debug information that can be parsed.",
    "A second Claude call that converts the free-text review into JSON after the first review call has finished.",
  ], a: [0],
  e: "In CI: `-p` con `--output-format json` e `--json-schema` per finding strutturati e conformi, pronti per i commenti inline." });

Q({ id: "s5-05", s: 5, d: 3,
  q: "After each new commit on a pull request, the review re-runs and posts many comments identical to earlier ones. Developers are annoyed. What is the best fix?",
  o: [
    "Include the prior review findings in context and instruct Claude to report only new or still-unaddressed issues.",
    "Run the review only once per pull request, on its first commit, so that each pull request receives exactly one set of comments.",
    "Delete all previous review comments before posting the new review.",
    "Limit Claude to reporting at most five findings per run.",
  ], a: [0],
  e: "Dare i finding precedenti e chiedere solo quelli nuovi o non risolti evita i duplicati senza perdere copertura. Recensire solo il primo commit perde i problemi introdotti dopo." });

Q({ id: "s5-06", s: 5, d: 3,
  q: "The CI job that generates test cases keeps suggesting scenarios already covered by the existing suite. What change helps most?",
  o: [
    "Provide the existing test files in context so that generation avoids scenarios that are already covered.",
    "Ask Claude to generate twice as many tests and filter out the duplicates afterwards.",
    "Run test generation in plan mode, so that the new tests are designed and checked against each other before they are written.",
    "Add 'do not duplicate existing tests' to the prompt without making other changes.",
  ], a: [0],
  e: "Claude non può evitare duplicati di test che non vede: vanno forniti nel contesto." });

Q({ id: "s5-07", s: 5, d: 3,
  q: "Generated tests are technically correct but of low value: trivial getters, no use of the project's fixtures, inconsistent naming. Where should the guidance go so that every CI run uses it?",
  o: [
    "In the project CLAUDE.md: testing standards, what makes a test valuable, and the available fixtures.",
    "In each developer's `~/.claude/CLAUDE.md`, so that everyone on the team shares exactly the same guidance.",
    "In an environment variable that the CI script reads and appends to the prompt.",
    "In a personal skill that developers invoke before they push their branch.",
  ], a: [0],
  e: "Il CLAUDE.md di progetto è il meccanismo per dare contesto (standard di test, fixture, criteri di review) anche a Claude Code invocato in CI. Il file utente non esiste sul runner." });

Q({ id: "s5-08", s: 5, d: 4,
  q: "Your pipeline generates code with Claude and then, in the same session, asks it to review its own changes. The review rarely finds issues that human reviewers later catch. What is the best improvement?",
  o: [
    "Run the review in a second, independent Claude instance that does not have the generator's reasoning context.",
    "Enable extended thinking in the same session, so that the self-review reasons more thoroughly about each change.",
    "Add the instruction 'Be highly critical of your own code' to the self-review prompt.",
    "Run the same-session self-review three times and merge the findings.",
  ], a: [0],
  e: "Self-review limitata: il modello conserva il ragionamento con cui ha generato e tende a non contestarlo. Un'istanza indipendente è più efficace di istruzioni di autocritica o extended thinking." });

Q({ id: "s5-09", s: 5, d: 4,
  q: "Developers ignore the automated review because 60% of its comments concern minor style preferences. The current prompt says 'Only report high-confidence findings and be conservative.' Which change most improves precision?",
  o: [
    "Define explicit criteria: report bugs and security issues; skip minor style points and local patterns that follow existing conventions.",
    "Strengthen the wording to 'Only report findings you are at least 95% confident about.'",
    "Have Claude assign a confidence score between 0 and 1 to each finding, and automatically drop every finding that scores below 0.8 before posting.",
    "Run the review with a lower temperature to reduce speculative comments.",
  ], a: [0],
  e: "Istruzioni generiche ('be conservative', 'alta confidenza') non migliorano la precisione; criteri espliciti e categorici su cosa segnalare e cosa saltare sì." });

Q({ id: "s5-10", s: 5, d: 4,
  q: "Your review covers five categories. Findings in the 'comment accuracy' category are wrong 70% of the time, and developers have started dismissing findings from the other, accurate categories too. What should you do now?",
  o: [
    "Temporarily disable the comment-accuracy category to restore trust while you improve its prompt.",
    "Keep every category active and add a disclaimer to each comment saying that some findings may be inaccurate.",
    "Raise the severity of the accurate categories so that developers notice them more.",
    "Collect developer feedback on every false positive before changing anything.",
  ], a: [0],
  e: "Una categoria con molti falsi positivi mina la fiducia anche nelle altre: la si disattiva temporaneamente mentre si migliora il prompt." });

Q({ id: "s5-11", s: 5, d: 4,
  q: "The same kind of issue is labeled 'critical' in one pull request and 'minor' in another. What best produces consistent severity classification?",
  o: [
    "Define explicit severity criteria with concrete code examples for each severity level.",
    "Ask Claude to use its best judgment and justify the severity it assigns to each finding.",
    "Remove severity labels and list all findings at the same level.",
    "Use a larger model only for the severity classification step.",
  ], a: [0],
  e: "Classificazione coerente: criteri espliciti con esempi di codice concreti per ogni livello di severità." });

Q({ id: "s5-12", s: 5, d: 4,
  q: "Review findings are inconsistently formatted: some lack file locations, others omit a suggested fix. Adding more detailed format instructions has not helped. Which prompting technique is most effective?",
  o: [
    "Add few-shot examples showing the exact output format: location, issue, severity, suggested fix.",
    "Repeat the format instructions at both the beginning and the end of the prompt.",
    "Post-process the output and drop findings that are missing any field.",
    "Ask Claude to self-check each finding against the required format before it outputs the final list.",
  ], a: [0],
  e: "Quando le istruzioni dettagliate non bastano, gli esempi few-shot sono la tecnica più efficace per un formato coerente. Scartare i finding incompleti perde problemi reali." });

Q({ id: "s5-13", s: 5, d: 4,
  q: "Your prompt includes 'Check that code comments are accurate.' The review flags many comments that are merely incomplete or stylistically weak. Which rewrite best improves precision?",
  o: [
    "'Flag a comment only when the behavior it claims contradicts the actual behavior of the code.'",
    "'Check carefully that code comments are accurate and complete.'",
    "'Only flag a comment when you are highly confident that it is inaccurate, incomplete, or misleading.'",
    "'Be conservative when evaluating comments and avoid nitpicking.'",
  ], a: [0],
  e: "Un criterio esplicito e verificabile (contraddizione tra commento e comportamento) è più preciso di istruzioni vaghe o basate sulla confidenza." });

Q({ id: "s5-14", s: 5, d: 4,
  q: "Developers often dismiss certain review findings, but you cannot tell which code constructs cause the false positives. What change enables systematic analysis?",
  o: [
    "Add a `detected_pattern` field to each structured finding, recording the code construct that triggered it.",
    "Ask developers to write a short free-text reason every time they dismiss a finding, and review the reasons monthly.",
    "Log the full prompt and response of every review run for manual inspection.",
    "Reduce the number of findings per review so each one receives more attention.",
  ], a: [0],
  e: "Un campo `detected_pattern` nei finding strutturati permette di analizzare in modo sistematico quali costrutti generano i falsi positivi scartati." });

Q({ id: "s5-15", s: 5, d: 4,
  q: "Every night your pipeline generates test suggestions for 3,000 modules; the results are reviewed the next morning. Which API approach is most appropriate?",
  o: [
    "The Message Batches API, since the workload tolerates latency and gets 50% cost savings.",
    "The synchronous Messages API with many parallel requests, to finish as quickly as possible.",
    "The Message Batches API, falling back to synchronous calls for any module that takes over 10 minutes.",
    "Claude Code in interactive mode on a dedicated machine overnight.",
  ], a: [0],
  e: "Carico notturno, non bloccante, tollerante alla latenza: è il caso d'uso della Batch API. Il fallback aggiunge complessità senza beneficio." });

Q({ id: "s5-16", s: 5, d: 4,
  q: "Documents arrive continuously and must be processed within 30 hours of arrival. You use the Message Batches API, which can take up to 24 hours to process a batch. How often should you submit batches to guarantee the SLA?",
  o: [
    "Every 4 hours: the longest wait before submission plus 24 hours of processing stays within 30 hours.",
    "Every 12 hours, since most batches finish well before the 24-hour limit.",
    "Once a day, matching the 24-hour batch processing window.",
    "Every 8 hours, which leaves a comfortable margin over the processing times typically observed for batches.",
  ], a: [0],
  e: "Caso peggiore = attesa massima prima dell'invio + 24 ore di elaborazione. Con uno SLA di 30 ore l'attesa deve restare entro 6 ore: ogni 4 ore → 28 ore nel caso peggiore. Ogni 8 ore → 32 ore." });

Q({ id: "s5-17", s: 5, d: 4,
  q: "In a batch of 500 documents, 23 requests failed because their documents exceeded the context limit. What is the correct handling?",
  o: [
    "Resubmit only the 23 failed requests, identified by `custom_id`, after chunking the oversized documents.",
    "Resubmit the whole batch of 500 so that all results come from the same run.",
    "Resubmit the 23 failed requests unchanged, since failures in batch processing are usually transient and succeed on retry.",
    "Drop the failed documents and list them in the nightly report.",
  ], a: [0],
  e: "Si reinviano solo i falliti, identificati dal `custom_id`, con la modifica che rimuove la causa (qui: spezzare i documenti troppo lunghi). Reinviarli invariati fallisce di nuovo." });

Q({ id: "s5-18", s: 5, d: 4,
  q: "You want to move an agentic review, which calls tools to fetch related files in the middle of its analysis, to the Message Batches API to cut costs. What is the key limitation?",
  o: [
    "The Batches API does not support multi-turn tool calling within one request: tools cannot run mid-request with their results returned to the model.",
    "Batch requests cannot include a system prompt, so the review criteria and the team's conventions would be lost for every pull request processed this way.",
    "Batch requests cannot include tool definitions or JSON schemas of any kind.",
    "Batch results come back in random order, so tool calls cannot be matched to files.",
  ], a: [0],
  e: "Nella Batch API non si possono eseguire tool a metà richiesta e restituire i risultati: niente loop multi-turn. L'ordine dei risultati si gestisce con `custom_id`." });

Q({ id: "s5-19", s: 5, d: 4,
  q: "Before running an extraction over 50,000 archived reviews with the Message Batches API, which step most reduces total cost and rework?",
  o: [
    "Refine the prompt on a representative sample first, to maximize first-pass success before processing the full volume.",
    "Submit the full volume immediately and refine the prompt using the failed requests.",
    "Split the volume into 50 batches and vary the prompt slightly in each to compare results.",
    "Process the first 10,000 reviews with the synchronous API to learn faster, then switch the remaining volume to batches.",
  ], a: [0],
  e: "Rifinire il prompt su un campione prima del grande volume massimizza il successo al primo passaggio e riduce i reinvii." });

Q({ id: "s5-20", s: 5, d: 3,
  q: "Which TWO statements about running Claude Code in a CI pipeline are correct?",
  o: [
    "The `-p` (`--print`) flag runs Claude Code non-interactively, so the job does not hang waiting for input.",
    "The project CLAUDE.md provides context such as testing standards and review criteria to Claude Code invoked in CI.",
    "Setting `CLAUDE_HEADLESS=true` is required for Claude Code to run inside CI runners.",
    "Code should be reviewed in the same session that generated it, so the reviewer can reuse its context.",
    "Each developer's `~/.claude/CLAUDE.md` is applied when CI runs Claude Code on the same repository.",
  ], a: [0, 1],
  e: "Vere: `-p` per la modalità non interattiva; CLAUDE.md di progetto come contesto in CI. `CLAUDE_HEADLESS` non esiste; la review va fatta da un'istanza indipendente; il file utente di un portatile non arriva al runner." });
