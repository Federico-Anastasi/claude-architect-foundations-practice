// Scenario 3 · Multi-Agent Research System · practice pool
Q({ id: "s3-n01", s: 3, d: 1, t: "1.1",
  q: "The coordinator is implemented as a fixed script: it calls Task for search, then analysis, then synthesis, then report, and exits. After synthesis the model often notices that two subtopics are barely covered and asks for more research, but the script has already moved on to the report. Which change fits the intended design?",
  o: [
    "Run the coordinator as an agentic loop: execute the Task calls the model requests, append the results, continue on 'tool_use' and finish on 'end_turn'.",
    "Keep the script and repeat the search, analysis and synthesis sequence a fixed three times, whatever coverage the first pass achieved, before writing the report.",
    "Keep the script and add a final step that scans the model's text for phrases such as 'more research needed', triggering extra subagent calls when it finds one.",
    "Keep the script and add a decision tree that maps each category of coverage gap to a predetermined subagent call, executed right after the synthesis step.",
  ], a: [0],
  e: "Il coordinatore deve essere un ciclo agentico guidato dal modello: esegue i Task richiesti, aggiunge i risultati alla conversazione, continua con 'tool_use' e termina con 'end_turn', così è il modello a decidere quando la copertura basta. Ripetere la sequenza un numero fisso di volte è un tetto arbitrario; cercare frasi nel testo è un segnale in linguaggio naturale; un albero decisionale predefinito sostituisce il giudizio del modello con sequenze preconfigurate." });

Q({ id: "s3-n02", s: 3, d: 1, t: "1.2",
  q: "To cut latency, a developer lets the web search subagent invoke the document analysis subagent directly and pass it the PDF URLs it finds. In production, when the analysis step fails the coordinator never learns about it, each subagent handles errors in its own way, and the logs cannot show which findings went where. What is the recommended design?",
  o: [
    "Route all subagent communication through the coordinator, which receives search results, decides what the analysis subagent gets, and handles failures in one place.",
    "Keep the direct calls but have both subagents write their errors and handoffs to a shared log file, which the coordinator reads at the end of each run to reconstruct what happened.",
    "Keep the direct calls and add a callback so that the analysis subagent reports every failure back to the web search subagent for handling.",
    "Merge the two subagents into one agent that owns both toolsets, so that no handoff between subagents exists anymore and no failure can pass unseen.",
  ], a: [0],
  e: "Nel pattern hub-and-spoke il coordinatore gestisce tutta la comunicazione tra subagent: osservabilità, gestione uniforme degli errori e flusso controllato delle informazioni. Un log condiviso o una callback mantengono la comunicazione laterale e gli errori restano gestiti in modo disomogeneo; fondere i subagent perde la specializzazione e gli strumenti mirati." });

Q({ id: "s3-n03", s: 3, d: 1, t: "1.3",
  q: "The coordinator invokes the document analysis subagent on a first paper, then invokes it again with the prompt: 'Now compare this paper with the one you analyzed earlier.' The second invocation answers that it has no earlier paper and, in some runs, invents one. What is the right fix?",
  o: [
    "Include the first paper's analysis output in the second invocation's prompt, because subagents share no memory between invocations.",
    "Give the document analysis subagent a system prompt line telling it to recall earlier analyses performed during the same research session.",
    "Have the web search subagent store each analysis in a scratch store that every subagent reads automatically when it starts.",
    "Reuse the same subagent instance for both calls so that its working memory of the first paper carries over to the second.",
  ], a: [0],
  e: "I subagent non ereditano il contesto del coordinatore e non condividono memoria tra invocazioni: tutto ciò che serve va messo esplicitamente nel prompt, qui l'analisi precedente. Una riga nel system prompt non crea memoria, uno store letto 'automaticamente' non esiste come meccanismo, e riutilizzare l'istanza non conserva stato tra le invocazioni." });

Q({ id: "s3-n04", s: 3, d: 1, t: "1.4",
  q: "Compliance requires that every statistic in a published report is traceable to a source. Audits find that 6% of published reports contain unsourced statistics: the report generation subagent sometimes runs even though synthesis flagged unsourced claims, despite a coordinator instruction saying 'never generate a report with unsourced claims'. What should you do?",
  o: [
    "Add a programmatic gate that blocks the `generate_report` call until the synthesis output passes a check that every statistic has a claim-source mapping.",
    "Move the instruction to the top of the coordinator's system prompt, repeat it in the report subagent's prompt, and add emphasis to the wording so that it stands out.",
    "Add few-shot examples showing the coordinator stopping and sending claims back for sourcing when synthesis flags unsourced statistics.",
    "Have the report generation subagent review its own draft for unsourced statistics before finalizing it, in the same session.",
  ], a: [0],
  e: "Quando il rispetto di una regola deve essere garantito, serve un'applicazione programmatica: un prerequisito che blocca `generate_report` finché il controllo non passa. Rafforzare il prompt o aggiungere esempi resta probabilistico (il 6% di fallimenti ne è la prova); l'auto-revisione nella stessa sessione conserva il contesto della generazione ed è meno efficace nel contestare le proprie scelte." });

Q({ id: "s3-n05", s: 3, d: 1, t: "1.5",
  q: "Three search tools from third-party MCP servers, which you cannot modify, return market sizes in different shapes: `'$4.2B'`, `4200` (millions of USD) and `'4.2 billion'`. The synthesis agent occasionally treats them as different magnitudes and reports a false discrepancy. Which change fixes this most reliably?",
  o: [
    "Add a `PostToolUse` hook that converts every figure into one schema (numeric value plus unit) before the model processes the tool results.",
    "Add a rule to the synthesis agent's prompt requiring it to convert all figures to billions of USD, stating the conversion in its notes, before comparing any two of them.",
    "Give the synthesis agent a `normalize_units` tool and tell it to call the tool whenever it notices figures in different formats.",
    "Add few-shot examples of the three formats with the correct conversion, placed in the synthesis agent's system prompt.",
  ], a: [0],
  e: "Un hook `PostToolUse` intercetta i risultati dei tool e li trasforma prima che il modello li elabori: normalizzazione deterministica, anche su tool che non si possono modificare. Regole nel prompt ed esempi restano probabilistici; un tool di normalizzazione dipende dal fatto che il modello si accorga di dover chiamarlo, cioè proprio dall'errore da evitare." });

Q({ id: "s3-n06", s: 3, d: 1, t: "1.6",
  q: "For the open-ended task 'Why was our competitor's product recalled?', the team built a fixed chain of five prompts: search recall news, analyze regulator filings, summarize the supply chain, build a timeline, write the report. Findings often reveal unexpected leads (for example a supplier lawsuit) that the chain never follows. What should change?",
  o: [
    "Use dynamic decomposition: the coordinator generates and reorders subtasks based on what each step uncovers, instead of following a fixed chain.",
    "Add more steps to the chain that cover the most common leads, such as lawsuits, supplier changes, earlier recalls of similar products and regulator warnings.",
    "Append a final step to the chain asking the model to list the leads it noticed but did not investigate, and include them in the report.",
    "Run the same five-step chain twice, the second time with the first run's findings added to the prompts, and merge the two reports.",
  ], a: [0],
  e: "Per indagini aperte la decomposizione deve essere adattiva: i sottocompiti nascono da ciò che emerge a ogni passo. Il prompt chaining fisso va bene per analisi prevedibili e multi-aspetto. Aggiungere passi o elencare i filoni non seguiti non li fa indagare; ripetere la stessa catena riproduce gli stessi limiti." });

Q({ id: "s3-n07", s: 3, d: 1, t: "1.7",
  q: "Yesterday you ran a named session `ev-subsidy-research` that analyzed 15 government reports on EV subsidies (published 2019-2022, none of them changed since). Today you want to ask three follow-up questions about those same reports. Which approach is most appropriate?",
  o: [
    "Resume with `--resume ev-subsidy-research` and ask the follow-ups, since the prior analysis is still valid.",
    "Start a new session and inject a structured summary of yesterday's conclusions, to avoid carrying over any stale context.",
    "Create a `fork_session` branch for each of the three questions so that the answers cannot influence one another.",
    "Start a new session and re-run the document analysis subagents on all 15 reports, to be sure the answers rest on fresh results.",
  ], a: [0],
  e: "Quando il contesto precedente è ancora valido (fonti invariate, dati non sensibili al tempo) si riprende la sessione con nome. Il riassunto in una sessione nuova serve quando i risultati dei tool sono obsoleti; `fork_session` serve a esplorare approcci divergenti da una base comune, non a rispondere a domande di approfondimento; rieseguire tutto spreca lavoro." });

Q({ id: "s3-n08", s: 3, d: 1, t: "1.2",
  q: "Reports on broad topics keep missing entire areas: a report on 'renewable energy policy' covers only the EU and the US, with nothing on Asia, Africa or financing. Every subagent executes its assigned subtask well. Which TWO changes to the coordinator would best reduce these gaps?",
  o: [
    "Have the coordinator first list the major dimensions of the topic (regions, sectors, stakeholders) and derive its subtasks from that list.",
    "After each synthesis, have the coordinator check the report against the topic's major dimensions and re-delegate targeted queries for any it left uncovered.",
    "Instruct every search subagent to broaden its queries to anything related to the overall topic, beyond its assigned subtopic.",
    "Increase each subagent's maximum number of tool calls so that it can explore beyond its assigned subtopic when it sees fit.",
    "Make the synthesis agent refuse to write a report unless it can cite at least ten distinct sources across the findings.",
  ], a: [0, 1],
  e: "Il rischio è una decomposizione troppo stretta: il coordinatore deve enumerare le dimensioni del tema, derivarne i sottocompiti e poi valutare la sintesi rispetto a quell'elenco, ri-delegando query mirate sulle lacune. Allargare le query dei subagent riporta sovrapposizioni e sprechi senza garantire copertura; più chiamate ai tool non cambiano ciò che viene assegnato; un minimo di dieci fonti non garantisce che le aree mancanti vengano coperte." });

Q({ id: "s3-n09", s: 3, d: 2, t: "2.1",
  q: "Two tools exist: `analyze_content` ('Analyzes content and returns key information') and `analyze_document` ('Analyzes a document and returns key information'). Both accept a URL or raw text and return a free-form summary. The web search subagent keeps calling `analyze_document` on fetched web pages while the document analysis subagent calls `analyze_content` on PDFs. What is the most effective change?",
  o: [
    "Rename `analyze_content` to `extract_web_results` with a web-specific description, and reserve `analyze_document` for uploaded documents.",
    "Add 5-8 few-shot examples to each subagent's prompt showing which of the two tools to call for web pages and which for PDFs.",
    "Consolidate both tools into a single `analyze` tool that takes a `source_type` parameter and decides internally which backend should handle each request.",
    "Add a routing layer in the coordinator that inspects each URL and pre-selects the tool before the subagent is invoked.",
  ], a: [0],
  e: "I due tool hanno funzioni sovrapposte e descrizioni quasi identiche: il rimedio è eliminare la sovrapposizione rinominando e restringendo (es. `extract_web_results` per il web). Gli esempi aggiungono token senza risolvere l'ambiguità, un tool unico è una scelta architetturale più costosa di un primo passo, e un livello di routing aggira il modello con complessità sproporzionata." });

Q({ id: "s3-n10", s: 3, d: 2, t: "2.2",
  q: "The document analysis subagent calls `search_papers` with `date_range: 'last quarter'`. The tool answers `Error: invalid request` and the subagent repeats the identical call three times before giving up. What should the tool return so that the agent can recover on its own?",
  o: [
    "An error with a validation category and a description naming the offending parameter and the expected format, such as `YYYY-MM-DD/YYYY-MM-DD`.",
    "An error with a transient category and `isRetryable: true`, so that the agent retries the call in case the service is briefly unavailable.",
    "An empty result set marked as successful, so that the agent concludes there are no papers in that period and moves on.",
    "The same generic error, with the subagent's retry count raised to ten so that the call has more chances to succeed.",
  ], a: [0],
  e: "Un errore di validazione strutturato (categoria, parametro, formato atteso) permette all'agente di correggere l'input invece di ripetere la stessa chiamata. Marcarlo transitorio e riprovabile produce altri tentativi identici inutili; un vuoto 'riuscito' sopprime l'errore e nasconde il problema; più tentativi su un errore generico moltiplicano lo spreco." });

Q({ id: "s3-n11", s: 3, d: 2, t: "2.3",
  q: "In about 60% of runs the synthesis agent returns control to the coordinator only to have a source reopened so that it can quote an exact passage, which adds a round trip each time. A teammate suggests giving it the general `fetch_url` tool. What is the best design?",
  o: [
    "Give it a constrained `load_document` tool that opens only URLs already in the collected findings; new-source searches stay with the web search subagent.",
    "Give it `fetch_url` and instruct it in its prompt to open only URLs that already appear in the collected findings and never to follow links to new pages.",
    "Keep routing every quote request through the coordinator and the retrieval subagent, since only the subagent specialized in retrieval should ever open a source page.",
    "Have the web search subagent attach the full text of every source it finds to its findings, so that synthesis always has every passage it could need on hand.",
  ], a: [0],
  e: "Per un bisogno frequente e semplice si dà all'agente di sintesi uno strumento trasversale limitato: `load_document` apre solo URL già presenti nei risultati, quindi elimina il giro dal coordinatore senza aprire il web, e le ricerche di nuove fonti restano al subagent di ricerca. `fetch_url` con una regola nel prompt è un vincolo probabilistico su uno strumento troppo ampio; instradare tutto dal coordinatore mantiene la latenza; allegare il testo integrale di ogni fonte gonfia il contesto." });

Q({ id: "s3-n12", s: 3, d: 2, t: "2.4",
  q: "A teammate clones the research-agent repository and finds that the internal `reports-db` MCP tools are missing. On the author's machine the server is defined in `~/.claude.json`, with the access token pasted into the definition. The team wants every developer to get the server automatically without committing the token. What should you do?",
  o: [
    "Move the definition to the project-scoped `.mcp.json` and reference the token as `${REPORTS_DB_TOKEN}`, set in each developer's environment.",
    "Copy `~/.claude.json` into the repository root so that every clone picks up the same definition together with its token.",
    "Keep the definition in `~/.claude.json` and document in the README that each teammate must paste the same definition and token by hand into their own file.",
    "Move the definition to `.mcp.json` with the token written inline, since the repository is private and only the team can read it.",
  ], a: [0],
  e: "I server condivisi dal team vanno nel `.mcp.json` di progetto (versionato), con espansione di variabili d'ambiente come `${REPORTS_DB_TOKEN}` per non committare segreti. Il file utente `~/.claude.json` è per server personali e non viaggia con il repository; copiarlo o incollare il token inline espone credenziali, e la configurazione manuale non è condivisa." });

Q({ id: "s3-n13", s: 3, d: 2, t: "2.2",
  q: "`search_internal_reports` returns `isError: true` with 'No results found' whenever a niche query matches nothing. The subagent then rewords the query four times, and the coordinator marks the source as degraded. What should the tool do instead?",
  o: [
    "Return a successful response with an empty result list for no-match queries, and reserve `isError` for failures such as timeouts or denied access.",
    "Keep `isError: true` but add `isRetryable: false` to the no-match response, so that the agent stops rewording the query after the first attempt.",
    "Return a generic 'Search failed' error for both no-match queries and real failures, so that the coordinator handles all of them the same way.",
    "Return a successful response containing the closest partial matches, whatever their relevance, so that the result list is never empty.",
  ], a: [0],
  e: "Una query riuscita senza corrispondenze è un risultato valido (informazione in sé), non un errore di accesso: `isError` va riservato ai guasti, così l'agente e il coordinatore possono distinguere i due casi. Segnarlo errore non riprovabile continua a farlo passare per un guasto; l'errore generico nasconde il contesto; restituire corrispondenze irrilevanti inquina i risultati." });

Q({ id: "s3-n14", s: 3, d: 5, t: "5.1",
  q: "The web search subagent's `fetch_url` tool returns the full text of each page (about 40,000 tokens), although typically only two paragraphs matter. After six or seven fetches its context is nearly full and answers degrade. What is the best fix?",
  o: [
    "Trim each fetch result to the relevant passages plus title, date and source URL before it is appended to the context.",
    "Let the subagent summarize its oldest tool results into one paragraph whenever its context passes 80% of capacity.",
    "Tell the subagent in its prompt to ignore irrelevant parts of each page and quote only what it needs in its answers.",
    "Cap the subagent at five fetches per task and have the coordinator start another subagent for the remaining sources.",
  ], a: [0],
  e: "I risultati dei tool si accumulano nel contesto e consumano token in modo sproporzionato rispetto alla rilevanza: vanno ridotti ai campi/passaggi utili (più metadati di fonte) prima di entrare nel contesto. Riassumere i risultati vecchi rischia di perdere cifre e date; 'ignorare' parti di testo non riduce i token già consumati; un tetto di fetch limita la ricerca invece di ridurre lo spreco." });

Q({ id: "s3-n15", s: 3, d: 5, t: "5.3",
  q: "The document analysis subagent was asked to analyze 10 reports. After six it hit a timeout and returned a structured error: failure type 'timeout', the six completed analyses, and the list of the four unprocessed reports. How should the coordinator proceed?",
  o: [
    "Keep the six analyses, re-delegate only the four unprocessed reports, and annotate the report's coverage if any of them still fails.",
    "Discard the partial output and re-run all ten reports with a longer timeout, so that the whole analysis comes from a single consistent run.",
    "Proceed to synthesis with the six completed analyses and say nothing about the other four, since the output is usable as it is.",
    "Abort the research run and report the failure to the user, since an incomplete analysis cannot support a reliable report.",
  ], a: [0],
  e: "Il contesto d'errore strutturato (tipo, risultati parziali, elementi non elaborati) permette un recupero mirato: si conserva il lavoro fatto e si ri-delega solo il resto, annotando eventuali lacune residue. Rifare tutto spreca lavoro; tacere sui quattro report nasconde una lacuna di copertura; abortire tutto per un fallimento parziale è un anti-pattern." });

Q({ id: "s3-n16", s: 3, d: 5, t: "5.3",
  q: "For three consecutive rounds the news search subagent returned only 'news search unavailable', and each round the coordinator re-sent the same broad query ('global supply chain disruptions 2020-2024, all industries'). Investigation shows the query itself caused the timeouts. What change to the failure report lets the coordinator recover?",
  o: [
    "Return the failure type, the exact query attempted and any partial results, so that the coordinator can re-delegate narrower sub-queries.",
    "Add exponential backoff inside the subagent so that it keeps retrying the original query for several minutes before it reports any failure to the coordinator.",
    "Have the subagent return an empty result set marked as successful after a timeout, so that the coordinator moves on without stalling.",
    "Raise the timeout for every subagent so that broad queries have enough time to complete during each round.",
  ], a: [0],
  e: "Un messaggio generico ('unavailable') nasconde ciò che serve al coordinatore: tipo di guasto, query tentata e risultati parziali gli permettono di capire che la query era troppo ampia e di riformularla. Backoff sulla stessa query e timeout più lunghi trattano il sintomo; un vuoto marcato come successo sopprime l'errore e impedisce qualunque recupero." });

Q({ id: "s3-n17", s: 3, d: 5, t: "5.6",
  q: "Findings from different subagents lose their sources and dates during synthesis. Which TWO additions to each finding in the subagents' structured output best support attribution and correct temporal interpretation?",
  o: [
    "A claim-source mapping: the claim, the supporting excerpt, and the source URL or document name.",
    "The publication date or data collection date of the source.",
    "The subagent's reasoning chain that led to selecting the finding, in full.",
    "A confidence score that the subagent assigns to its own wording of the claim.",
    "The number of tokens consumed while the subagent was researching that finding.",
  ], a: [0, 1],
  e: "Per conservare l'attribuzione servono mappature affermazione-fonte (estratto e URL/documento) che la sintesi deve preservare, e le date di pubblicazione o raccolta, che evitano di scambiare differenze temporali per contraddizioni. Catene di ragionamento, confidenza auto-riferita e consumo di token non aiutano né l'attribuzione né l'interpretazione temporale, e appesantiscono il contesto." });

Q({ id: "s3-n18", s: 3, d: 5, t: "5.6",
  q: "A report states: 'Sources disagree on remote-work adoption: 34% versus 61% of firms.' Checking shows that the 34% comes from a survey run in 2020 and the 61% from one run in 2024, but neither subagent output carried a date. What change prevents such false contradictions?",
  o: [
    "Require subagents to output the publication or collection date with every finding, so that synthesis can read the gap as a change over time.",
    "Instruct synthesis to keep only the figure from the most recently retrieved source whenever two figures for the same metric differ, and to drop the other figure.",
    "Add a conflict-detection subagent that flags every numeric disagreement between sources and sends it to a human reviewer.",
    "Have synthesis average figures that refer to the same metric and report the average as the consensus value.",
  ], a: [0],
  e: "Senza date, una differenza dovuta al tempo sembra una contraddizione: servono data di pubblicazione o raccolta nell'output strutturato. Tenere la fonte 'più recente' per recupero scarta informazione e non dipende dalla data reale; un rilevatore di conflitti segnalerebbe comunque falsi conflitti; la media fonde dati di anni diversi in un numero privo di significato." });

Q({ id: "s3-n19", s: 3, d: 5, t: "5.4",
  q: "A research run has two phases: four subagents explore broadly, then three new subagents do deep dives on the most promising areas. The phase-two subagents start with only the topic and repeat much of the phase-one work, wasting tokens. What is the best fix?",
  o: [
    "Have the coordinator summarize the key findings of phase one and inject that summary into each phase-two subagent's initial prompt.",
    "Pass the complete raw transcripts of all phase-one subagents to every phase-two subagent so that nothing from the first phase is lost.",
    "Tell the phase-two subagents to run quick searches first and skip any area where they find a lot of material already available.",
    "Run the phase-two work inside the same subagents as phase one, so that they keep their context across both phases.",
  ], a: [0],
  e: "Prima di avviare la fase successiva il coordinatore riassume i risultati chiave e li inietta nel contesto iniziale dei nuovi subagent: niente lavoro ripetuto e contesto snello. I transcript completi riportano il volume verboso che si voleva evitare; chiedere ai subagent di indovinare cosa esiste già non è affidabile; riusare gli stessi subagent accumula contesto fino a degradarlo." });

Q({ id: "s3-n20", s: 3, d: 5, t: "5.5",
  q: "The system produces 120 reports a day and reviewers can read only 15. Each synthesis output carries coverage annotations and conflict flags. Which review strategy makes the best use of limited reviewer capacity?",
  o: [
    "Prioritize reports with unresolved source conflicts or coverage gaps, plus a stratified random sample of unflagged reports to detect new error patterns.",
    "Review the reports for which the synthesis agent reports the lowest self-assessed confidence, since it is the one that knows best where it is unsure about its claims.",
    "Review 15 reports chosen uniformly at random each day, so that the sample is unbiased across the whole output.",
    "Review the 15 longest reports each day, since they contain the most claims and therefore the most chances for errors.",
  ], a: [0],
  e: "La capacità limitata va diretta ai casi ambigui o contraddittori (conflitti, lacune di copertura), mantenendo un campionamento casuale stratificato del resto per misurare gli errori e scoprire schemi nuovi. La confidenza auto-riferita è un proxy poco affidabile; un campione uniforme ignora i segnali già disponibili; la lunghezza non correla con il rischio di errore." });
