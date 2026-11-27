// Scenario 3 · Multi-Agent Research System · simulation pool
Q({ id: "x3-01", s: 3, d: 1, t: "1.1", sim: 1,
  q: "The web search subagent's loop returns as soon as a response contains a text block. The model often writes 'I will look for recent figures first.' in the same response in which it requests `web_search`, so the coordinator receives that sentence as the subagent's findings. What is the correct fix?",
  o: [
    "Decide on `stop_reason`: execute requested tools and continue on 'tool_use', and return only when the response ends with 'end_turn'.",
    "Add a system prompt instruction forbidding the model from writing any text in a response that also contains a tool request, and keep the loop as it is.",
    "Ignore text blocks shorter than 100 characters when deciding whether the response is final, and treat only longer text blocks as the finished answer.",
    "Return only when the text contains the phrase 'Final answer:', and make the system prompt require that phrase at the start of the last message.",
  ], a: [0],
  e: "Il completamento si decide con `stop_reason` ('tool_use' continua, 'end_turn' termina), non dalla presenza di testo: una risposta può contenere testo e una richiesta di tool insieme. Vietare il testo con il prompt è probabilistico, una soglia di lunghezza è arbitraria, e una frase marcatore è un segnale in linguaggio naturale, fragile quanto parsare frasi." });

Q({ id: "x3-02", s: 3, d: 1, t: "1.2", sim: 1,
  q: "To save cost, a team put a router in front of the coordinator: queries shorter than eight words skip delegation and get a single-pass answer. 'When did the Paris Agreement enter into force?' works well, but 'impact of AI on jobs' (five words) yields a shallow, one-sided answer. What is the best improvement?",
  o: [
    "Have the coordinator analyze each query's requirements, such as breadth and need for documents or fresh sources, and choose which subagents to invoke.",
    "Lower the word threshold from eight to four, so that short but broad queries like this one also reach the full delegation path.",
    "Remove the router and always run the full pipeline of search, analysis, synthesis and report for every query, whatever its length.",
    "Replace the word count with a classifier that assigns each query to a topic category and maps every category to a fixed set of subagents.",
  ], a: [0],
  e: "La complessità di una richiesta non si misura dalla lunghezza: il coordinatore deve analizzare i requisiti (ampiezza, documenti, fonti recenti) e invocare dinamicamente i subagent adatti. Abbassare la soglia sposta il problema; la pipeline completa sempre è lenta e costosa; la mappa categoria-subagent fissa non guarda ai requisiti reali della singola query." });

Q({ id: "x3-03", s: 3, d: 1, t: "1.2", sim: 1,
  q: "The synthesis output is thin on 'regulatory enforcement actions'. The coordinator re-delegates to the web search subagent with the prompt 'Find more about regulation.' About 80% of the second-round results are the same articles as in round one. What should the coordinator do differently?",
  o: [
    "Write targeted queries for the gap (named regulators, enforcement actions, years) and pass the sources already found so the subagent looks elsewhere.",
    "Re-send the same prompt and rely on the subagent to remember the articles it found in round one and to skip them in this second round.",
    "Increase the number of results returned per query from 10 to 50, so that new articles surface beyond the ones already seen in round one and are picked up.",
    "Re-run the web search and document analysis subagents with the original topic prompt, then merge the new output with the earlier one to widen coverage.",
  ], a: [0],
  e: "Nel ciclo di raffinamento il coordinatore ri-delega query mirate alla lacuna specifica e, dato che i subagent hanno contesto isolato, deve passare nel prompt ciò che è già stato trovato. Un subagent non ricorda il giro precedente; più risultati per query non indirizzano la lacuna; rieseguire l'intero argomento ripete il lavoro invece di colmare il vuoto." });

Q({ id: "x3-04", s: 3, d: 1, t: "1.3", sim: 1,
  q: "The coordinator has three subagent definitions: `researcher` (description: 'Researches topics'), `analyst` ('Analyzes information') and `writer` ('Writes reports'). About 30% of PDF analysis tasks go to `researcher`. What is the most effective change?",
  o: [
    "Rewrite each `AgentDefinition` description to state what the subagent handles, its inputs and outputs, and when to use it instead of the others.",
    "Add a keyword router in the coordinator's code that sends any task mentioning 'PDF', 'paper' or 'study' to `analyst` before the model gets to decide.",
    "Merge `researcher` and `analyst` into one subagent with both toolsets, so that no choice between them has to be made and no task can be misrouted.",
    "Add a paragraph to the coordinator's prompt reminding it to think carefully about which subagent suits each task before delegating.",
  ], a: [0],
  e: "Le descrizioni di `AgentDefinition` sono ciò che guida la scelta del subagent: quelle vaghe producono instradamenti sbagliati, e la correzione efficace e proporzionata è renderle precise su compiti, input/output e confini. Un router a parole chiave aggira il modello con più complessità; fondere i subagent perde la specializzazione; un promemoria generico non aggiunge le informazioni mancanti." });

Q({ id: "x3-05", s: 3, d: 1, t: "1.3", sim: 1,
  q: "To cut latency, the coordinator now emits the Task calls for web search, document analysis and synthesis in the same response. Reports have become nearly empty: the synthesis subagent states that it has no findings to work with. What change keeps the latency gain where possible?",
  o: [
    "Emit the independent search and analysis Task calls together, wait for their results, then invoke synthesis with those complete findings in its prompt.",
    "Keep all three calls in one response and add a line to the synthesis prompt telling it to wait until the other two subagents have finished.",
    "Keep all three calls in one response and let the synthesis subagent poll a shared store until the search and analysis results appear.",
    "Return to sequential execution of all three subagents in separate turns, which removes the dependency problem entirely.",
  ], a: [0],
  e: "Search e analisi sono indipendenti e si lanciano in parallelo (più Task nella stessa risposta); la sintesi dipende dai loro risultati, che vanno inclusi per intero nel suo prompt, quindi va invocata dopo. Un subagent non può 'attendere' gli altri né condividere memoria; tornare al tutto sequenziale risolve ma perde il vantaggio di latenza dove non serve." });

Q({ id: "x3-06", s: 3, d: 1, t: "1.3", sim: 1,
  q: "To keep the synthesis prompt small, the coordinator condenses each subagent's output into two sentences. The reports became vague: figures, dates and URLs found by the subagents no longer appear. What is the right fix?",
  o: [
    "Pass the complete structured findings of the search and analysis subagents in the synthesis prompt, not a coordinator-written condensation.",
    "Give the synthesis subagent `fetch_url` so that it can reopen the sources itself and recover the figures, dates and URLs that its prompt is missing.",
    "Ask the coordinator to write longer condensations, around ten sentences per subagent, so that more details survive the summary.",
    "Instruct the synthesis subagent to infer the missing figures and dates from its background knowledge of the topic.",
  ], a: [0],
  e: "I subagent non ereditano il contesto: la sintesi riceve solo ciò che sta nel prompt, quindi vanno inclusi i risultati completi (strutturati, con metadati) e non una condensazione che perde cifre e fonti. Dare `fetch_url` alla sintesi esce dal suo ruolo e ripete il lavoro; riassunti più lunghi restano lossy; inferire dalla conoscenza del modello produce dati non citabili." });

Q({ id: "x3-07", s: 3, d: 1, t: "1.4", sim: 1,
  q: "The coordinator should ideally run web search before document analysis, because search results help pick which documents to analyze. When the order flips, the output is only slightly less focused, with no compliance impact, and this happens in about 5% of runs. The team wants the most proportionate fix. What should it do?",
  o: [
    "State the preferred order and the reason in the coordinator's prompt, and accept the occasional deviation.",
    "Add a prerequisite gate that blocks the document analysis Task call until the web search subagent has returned its results.",
    "Add a hook that intercepts every Task call and rejects any whose order differs from search, then analysis, then synthesis.",
    "Replace the coordinator's decision with a fixed pipeline that always runs search, analysis and synthesis in that order.",
  ], a: [0],
  e: "Una preferenza di ordine senza conseguenze di conformità non richiede applicazione programmatica: le garanzie deterministiche servono quando un errore ha costi seri (identità prima di un rimborso). Qui un'istruzione nel prompt è proporzionata. Gate, hook e pipeline fissa aggiungono complessità e rigidità per un rischio trascurabile (e la pipeline fissa toglie la scelta dinamica dei subagent)." });

Q({ id: "x3-08", s: 3, d: 1, t: "1.4", sim: 1,
  q: "Some topics require a licensed database that only human analysts can open. When research is blocked, the system opens a ticket for an analyst who has no access to the agent's session or logs. What should the handoff contain?",
  o: [
    "A structured summary: topics completed, findings with sources, the blocked source with the exact query, and a recommended next step.",
    "The complete conversation transcript of the coordinator and all subagents, so that the analyst has every detail to work from, including the dead ends.",
    "A one-line ticket naming the topic and stating that research is blocked on the licensed database, leaving the analyst to work out the rest unaided.",
    "A link to the coordinator's session identifier, so that the analyst can reopen the session and read the history there.",
  ], a: [0],
  e: "Chi riceve l'escalation non ha il transcript: serve un riepilogo strutturato con lavoro svolto, risultati con fonti, causa del blocco (fonte e query esatta) e azione consigliata. Il transcript completo è verboso e non azionabile; una riga costringe l'analista a ricominciare; il riferimento alla sessione presuppone un accesso che l'analista non ha." });

Q({ id: "x3-09", s: 3, d: 1, t: "1.5", sim: 1,
  q: "Each run may spend at most 40 calls to a paid search API. The coordinator prompt states the limit, yet audits show some runs reaching 70 calls. Overruns must go to a human for approval instead of continuing. Which implementation fits best?",
  o: [
    "A hook that intercepts outgoing `web_search` calls, counts them, blocks any past the 40th, and redirects the run to a human-approval step.",
    "A `PostToolUse` hook that appends the running call count to each search result, so that the model can see how close it is to the limit.",
    "A stronger instruction in the coordinator prompt, with a few-shot example of stopping at 40 calls and asking for approval.",
    "A weekly report of API usage per run that is reviewed by a manager, who adjusts the prompt for runs that went over the limit.",
  ], a: [0],
  e: "Una soglia di business che deve essere garantita si applica intercettando le chiamate in uscita: il hook blocca oltre il limite e reindirizza all'approvazione umana. Mostrare il conteggio al modello o rafforzare il prompt resta probabilistico; il report settimanale rileva lo sforamento solo dopo che la spesa è avvenuta." });

Q({ id: "x3-10", s: 3, d: 1, t: "1.5", sim: 1,
  q: "The team is deciding which requirements need hooks and which can stay in prompts. Which TWO requirements are best enforced with hooks?",
  o: [
    "Strip email addresses and phone numbers from fetched page content before the model ever reads it.",
    "Block any outgoing `web_search` query that contains the confidential project codename.",
    "Prefer peer-reviewed sources over blog posts when both are equally relevant to the question.",
    "Write executive summaries in plain language that a non-specialist reader can follow.",
    "Ask the user a clarifying question when the research topic could refer to several different things.",
  ], a: [0, 1],
  e: "I hook danno garanzie deterministiche: trasformare i risultati dei tool prima che il modello li veda (rimozione di dati personali) e bloccare chiamate in uscita che violerebbero una regola (codename riservato). Preferenze di qualità, stile del testo e domande di chiarimento sono giudizi che il modello può esercitare con istruzioni nel prompt, dove una piccola variabilità è accettabile." });

Q({ id: "x3-11", s: 3, d: 1, t: "1.6", sim: 1,
  q: "Every Monday the system produces a brief on each of 12 competitors, always covering the same four aspects in the same order: pricing, product changes, funding and press. The team plans a fully dynamic coordinator that invents its own subtasks on every run. What should you recommend?",
  o: [
    "Use a fixed sequential pipeline (prompt chaining) with one focused step per aspect, since the aspects are known and stable.",
    "Use the dynamic coordinator, since adaptive decomposition always produces more complete briefs than a predefined sequence of steps.",
    "Use a single prompt asking for all four aspects of a competitor at once, to avoid the overhead of chaining several steps.",
    "Use `fork_session` to create one independent branch per competitor from a shared baseline and let each branch decide its own subtasks.",
  ], a: [0],
  e: "Per analisi prevedibili e multi-aspetto il prompt chaining (passi sequenziali fissi) dà struttura coerente e costi stabili; la decomposizione dinamica serve alle indagini aperte e qui introdurrebbe variabilità e costo inutili. Un prompt unico per quattro aspetti diluisce l'attenzione; `fork_session` serve per esplorare approcci divergenti, non per eseguire passi noti." });

Q({ id: "x3-12", s: 3, d: 1, t: "1.6", sim: 1,
  q: "The team already analyzes each of 12 papers in its own pass. The integration pass, which receives all 12 full papers plus the 12 per-paper summaries, produces superficial cross-paper comparisons and misses conflicts between methods. What should change?",
  o: [
    "Give the integration pass only the structured per-paper findings (claims, methods, sample sizes, dates) and have it compare them across papers.",
    "Give the integration pass the 12 full papers again without the summaries, so that it works from the original text only.",
    "Replace the single integration pass with one pass for every pair of papers, 66 comparisons in total, and concatenate the pairwise results into the report.",
    "Remove the integration pass and let the synthesis agent compare the papers while it writes the report.",
  ], a: [0],
  e: "Il passaggio di integrazione deve lavorare su risultati locali compatti e strutturati, non su tutto il testo: rileggere 12 articoli ricrea la diluizione dell'attenzione che la divisione in passaggi doveva evitare. Rimuovere i riassunti peggiora; le 66 coppie sono forza bruta e frammentano il confronto; delegare alla sintesi mescola due compiti in un solo passaggio." });

Q({ id: "x3-13", s: 3, d: 1, t: "1.7", sim: 1,
  q: "Three weeks ago the named session `pricing-landscape` collected competitor prices from live websites. Most of the stored tool results are pages that have since changed, and the resumed session now cites old prices as current. What is the most reliable way to continue?",
  o: [
    "Start a new session seeded with a structured summary of the conclusions that are still valid, and re-run the price lookups.",
    "Resume the session with `--resume pricing-landscape` and tell the agent that some prices may have changed, so that it re-checks them.",
    "Create a `fork_session` branch from the old session to compare old and new prices, and keep both branches active.",
    "Resume the session and ask the agent to double-check any price that looks suspicious before it uses it in the new report.",
  ], a: [0],
  e: "Quando i risultati dei tool salvati sono in gran parte obsoleti, è più affidabile una sessione nuova con un riepilogo strutturato delle conclusioni ancora valide e nuove ricerche. Riprendere la sessione lascia il modello a ragionare su dati vecchi: dirgli genericamente che 'qualcosa è cambiato' o chiedere controlli sui sospetti non indica cosa ricontrollare; il fork conserva la stessa base obsoleta." });

Q({ id: "x3-14", s: 3, d: 2, t: "2.1", sim: 1,
  q: "The synthesis agent has a scoped `verify_fact` tool described only as 'Verifies a fact.' It uses it for broad questions such as 'is the EV market growing?', which return poor results, and it skips it for simple dates. What is the most effective change?",
  o: [
    "Rewrite the description: one checkable fact (date, name, statistic) in, a verdict with evidence out, and broad questions go back to the coordinator.",
    "Add an optional `depth` parameter to `verify_fact` so that the model can choose between a quick check and a deep multi-source investigation each time it calls it.",
    "Add 5-8 few-shot examples to the synthesis agent's prompt showing questions that should and should not be sent to `verify_fact`, with the reasoning for each.",
    "Remove `verify_fact` and route every verification through the coordinator to the web search subagent, as before, accepting the added latency.",
  ], a: [0],
  e: "La descrizione è il meccanismo principale con cui il modello sceglie e usa un tool: va precisata con cosa accetta, cosa restituisce e dove finiscono i casi fuori confine. Un parametro `depth` fa ricadere sul modello una scelta ambigua e rende il tool meno scoperto; gli esempi aggiungono token senza correggere la descrizione; rimuovere il tool riporta la latenza del giro via coordinatore anche per i controlli semplici." });

Q({ id: "x3-15", s: 3, d: 2, t: "2.1", sim: 1,
  q: "`search_papers` is described as 'Searches academic papers.' The agent sends full natural-language questions as `query` and `date_range: 'recent'`, and the tool returns nothing useful. The tool expects short keyword queries and a `YYYY-MM-DD/YYYY-MM-DD` range. What is the best fix?",
  o: [
    "Expand the description with the expected input formats, an example call, and what an empty result means.",
    "Add a second model call inside the tool that rewrites natural-language questions into keyword queries before searching.",
    "Make `query` and `date_range` optional, so that calls with unsuitable values never fail validation.",
    "Add examples of well-formed `search_papers` calls to the coordinator's prompt, since the coordinator briefs the subagent.",
  ], a: [0],
  e: "Una descrizione minimale non dice al modello come costruire una chiamata corretta: formati di input, esempi di query e casi limite vanno nella descrizione del tool stesso. Una riscrittura interna con un secondo modello è sovra-ingegnerizzata; parametri opzionali nascondono l'errore senza migliorare le chiamate; gli esempi nel prompt del coordinatore non raggiungono il contesto in cui il subagent sceglie il tool." });

Q({ id: "x3-16", s: 3, d: 2, t: "2.2", sim: 1,
  q: "`load_documents` accepts five document IDs per call. When one of them is corrupted, the whole call returns `isError: true` with 'Operation failed' and the four successfully loaded documents are discarded. What should the tool return instead?",
  o: [
    "The four loaded documents together with a structured error entry for the failed one (category, retryable flag and description).",
    "The same error for the whole call, with a retry of all five documents by the agent until every one of them loads.",
    "Only the four loaded documents, with the failed one silently omitted, so that the agent works with clean results.",
    "An empty result set marked as successful, so that the agent does not build on a partially loaded batch.",
  ], a: [0],
  e: "Gli errori strutturati devono preservare i risultati parziali e dire cosa è fallito (categoria, riprovabilità, descrizione), così l'agente usa ciò che ha e decide come trattare il resto. Ripetere tutto spreca lavoro su un documento forse irrecuperabile; omettere in silenzio nasconde una lacuna; un vuoto 'riuscito' sopprime l'errore e butta via quattro documenti validi." });

Q({ id: "x3-17", s: 3, d: 2, t: "2.3", sim: 1,
  q: "The web search subagent has 15 source-specific tools (two news APIs, three academic databases, a patent index, a filings index and others) and often picks the wrong one. The descriptions are accurate, and every tool serves the same role: searching. What is the best restructuring?",
  o: [
    "Split it into subagents by source type (news, academic, filings), each with 4-5 tools, and have the coordinator partition the scope by source type.",
    "Keep one subagent with all 15 tools and lengthen every description with more examples and edge cases, so that each of the tools is easy to tell apart from the rest.",
    "Add a keyword router that pre-selects a subset of four tools from the query text before each subagent turn, hiding the rest from the model.",
    "Keep the 15 tools on one subagent and add few-shot examples to its prompt showing the right tool for each of the most common query types.",
  ], a: [0],
  e: "Troppi tool su un solo agente (15 invece di 4-5) degradano la selezione: anche con descrizioni accurate, quando il ruolo è unico la soluzione è dividerlo in subagent per tipo di fonte, ciascuno con pochi tool, con il coordinatore che partiziona lo scope per tipo di fonte. Descrizioni più lunghe ed esempi non riducono la complessità della scelta; un router a parole chiave aggira il modello con un livello sovra-ingegnerizzato." });

Q({ id: "x3-18", s: 3, d: 2, t: "2.3", sim: 1,
  q: "In production the synthesis agent needs to verify a claim in only 4% of runs, and nearly all of those checks require cross-checking several sources and judging their credibility. The current route (coordinator, then web search subagent, then synthesis again) adds latency to those runs only. Someone proposes giving synthesis a scoped `verify_fact` tool. What is the best decision?",
  o: [
    "Keep routing verification through the coordinator to the web search subagent: the needs are rare and complex, not frequent and simple.",
    "Add `verify_fact` to the synthesis agent anyway, so that it can attempt the checks locally before falling back to the coordinator when needed.",
    "Give the synthesis agent the full web search toolset, so that it can run any verification itself from start to finish without leaving its own pass.",
    "Have synthesis call the web search subagent directly for these checks, bypassing the coordinator to save the extra round trip on each of them.",
  ], a: [0],
  e: "Un tool trasversale mirato si giustifica per bisogni frequenti e semplici; qui le verifiche sono rare e complesse, quindi il percorso via coordinatore è proporzionato. Aggiungere `verify_fact` o l'intero set di ricerca amplia il perimetro del subagent senza beneficio e favorisce l'uso fuori ruolo; la chiamata diretta ai subagent aggira il coordinatore, perdendo osservabilità e gestione uniforme degli errori." });

Q({ id: "x3-19", s: 3, d: 2, t: "2.4", sim: 1,
  q: "You are designing an internal MCP server for the report library. Which TWO capabilities are best exposed as MCP resources rather than as tools?",
  o: [
    "A catalog of the library's reports with title, topic, publication date and ID.",
    "The hierarchy of topic categories under which the reports are organized.",
    "A full-text search that accepts a query string and filters and returns matching passages.",
    "A job that re-runs OCR on a scanned PDF and replaces the stored text of the report.",
    "An action that marks a report as superseded by a newer edition.",
  ], a: [0, 1],
  e: "Le risorse MCP espongono cataloghi di contenuti (elenchi di documenti, gerarchie) per dare visibilità sui dati disponibili e ridurre le chiamate esplorative. Ricerche parametrizzate e azioni che modificano lo stato (rifare l'OCR, marcare un report come superato) sono operazioni: vanno esposte come tool." });

Q({ id: "x3-20", s: 3, d: 2, t: "2.4", sim: 1,
  q: "You connect the research system to a company MCP server that exposes 14 tools (search, document store read and write, export, admin). All its tools become available to every subagent, and the synthesis subagent starts calling document-store write tools while its tool selection becomes erratic. What is the best fix?",
  o: [
    "Restrict each subagent's tool list in its `AgentDefinition` to the few MCP tools that its role needs.",
    "Add a line to the synthesis subagent's prompt telling it to ignore the write and admin tools exposed by the server.",
    "Split the server into four smaller servers and configure them only in `~/.claude.json`, so that fewer tools appear at once.",
    "Disconnect the server and re-implement the tools each subagent needs as functions inside the coordinator's code.",
  ], a: [0],
  e: "I tool di tutti i server MCP configurati sono scoperti alla connessione e disponibili insieme: la distribuzione va ristretta per ruolo nelle `AgentDefinition`, garanzia deterministica che riduce anche la complessità di scelta. Un'istruzione di prompt è probabilistica; spezzare il server e usare `~/.claude.json` non limita i tool per subagent; riscrivere i tool nel coordinatore elimina l'integrazione MCP e centralizza tutto." });

Q({ id: "x3-21", s: 3, d: 5, t: "5.1", sim: 1,
  q: "The coordinator runs three refinement rounds. After each round it condenses everything gathered so far into a paragraph to save context. By round three the report says 'several studies show strong growth' where the original findings said '3 studies, +23% in 2023, per the national statistics office'. What is the best fix?",
  o: [
    "Keep a structured findings ledger (claim, figure, date, source) verbatim in every round's prompt, and summarize only the surrounding narrative.",
    "Ask the coordinator to write longer condensed paragraphs in each round, so that more of the numbers and dates survive the summary and reach the report.",
    "Stop condensing and append every subagent's raw output to the context in each round, whatever its length, so that nothing is ever lost to summaries.",
    "Add an instruction to the final report prompt to include precise figures and dates wherever the findings mention them, and to avoid vague wording.",
  ], a: [0],
  e: "La sintesi progressiva comprime numeri, date e attribuzioni in formule vaghe. Si estraggono i fatti in un blocco strutturato mantenuto fuori dalla storia riassunta e riportato integralmente a ogni turno, riassumendo solo il resto. Paragrafi più lunghi perdono comunque dettagli; il testo grezzo completo satura il contesto; l'istruzione finale non può recuperare ciò che nel contesto non c'è più." });

Q({ id: "x3-22", s: 3, d: 5, t: "5.1", sim: 1,
  q: "The synthesis agent gives equal weight to a survey of 30 respondents and a controlled study of 3,000 participants because the document analysis subagent returns only a claim and a source for each finding. What should you change?",
  o: [
    "Require the document analysis subagent to include methodological context (study type, sample size, collection date) in every structured finding.",
    "Tell the synthesis agent to treat findings from academic sources as stronger than findings from any other kind of source, whatever their method.",
    "Have the synthesis agent open every source again and read its methods section before it combines any findings into the final report.",
    "Ask the document analysis subagent to rank its findings from most to least important and drop everything beyond the first ten of them.",
  ], a: [0],
  e: "Per una sintesi accurata i subagent devono restituire metadati strutturati (date, posizione nella fonte, contesto metodologico) insieme ai risultati. Una regola sul tipo di fonte non distingue un sondaggio da uno studio controllato; riaprire le fonti duplica il lavoro fuori ruolo; un ranking con taglio perde informazione e non fornisce il contesto necessario alla ponderazione." });

Q({ id: "x3-23", s: 3, d: 5, t: "5.2", sim: 1,
  q: "A user asks for a report on 'Nova Systems'. `search_company` returns three matches: a Canadian software firm, a Spanish shipping line and a US defense contractor. The coordinator currently picks the top-ranked match, and some reports turn out to be about the wrong company. What should it do?",
  o: [
    "Ask the user for an additional identifier, such as country, website or ticker symbol, before delegating any research.",
    "Research all three companies in parallel and merge everything into one report so that the right company is surely covered.",
    "Pick the match with the highest annual revenue, since the user is most likely to be interested in the largest company.",
    "Keep picking the top-ranked match but start the report with a disclaimer naming the company that was assumed.",
  ], a: [0],
  e: "Quando un lookup restituisce più corrispondenze si chiede un identificativo aggiuntivo invece di scegliere con un'euristica. Ricercarle tutte e fondere i risultati mescola entità diverse e spreca lavoro; il fatturato è un'altra euristica; l'avviso in testa lascia comunque il rapporto sulla società sbagliata e costringe l'utente a rifare la richiesta." });

Q({ id: "x3-24", s: 3, d: 5, t: "5.3", sim: 1,
  q: "A report states 'no peer-reviewed studies exist on this question.' An audit shows that the academic database timed out for those queries and the subagent returned empty lists marked as successful. The coordinator has been changed to receive structured failure reports. How should the final report phrase the finding?",
  o: [
    "State that the academic database could not be queried for this question: it is a coverage gap, not a confirmed absence of studies.",
    "State that no studies were found, since an empty result is the closest accurate description of what the system actually received from the database.",
    "Remove the topic from the report, because a section based on failed queries cannot be supported by any evidence.",
    "State that studies probably exist but were not retrieved, and add a few likely titles from the model's background knowledge.",
  ], a: [0],
  e: "Un guasto di accesso non è un risultato vuoto valido: il rapporto deve riportare la lacuna di copertura (fonte non interrogabile), non un'assenza confermata. Affermare 'nessuno studio' trasforma un errore in una conclusione falsa; eliminare l'argomento nasconde la lacuna al lettore; titoli plausibili dalla conoscenza del modello sono invenzioni senza fonte." });

Q({ id: "x3-25", s: 3, d: 5, t: "5.3", sim: 1,
  q: "A subagent faces two failures: timeouts on a news API and 'access denied' on a licensed database. Which TWO handling rules are correct?",
  o: [
    "Retry the news API timeouts locally a bounded number of times before reporting anything to the coordinator.",
    "Propagate the access-denied failure immediately with its type, the attempted query and any alternative source.",
    "Retry the access-denied failure with exponential backoff, since permission problems are often temporary.",
    "Return an empty result set marked as successful after the retries, so that the coordinator can keep going.",
    "Propagate every failure to the coordinator on the first occurrence so that it keeps full control of recovery.",
  ], a: [0, 1],
  e: "I guasti transitori (timeout) si risolvono localmente con tentativi limitati; ciò che non si può risolvere, come un accesso negato, sale subito al coordinatore con tipo di errore, query tentata e alternative. Riprovare un permesso negato spreca tentativi; un vuoto marcato successo sopprime l'errore; propagare tutto subito carica il coordinatore di errori che il subagent poteva risolvere." });

Q({ id: "x3-26", s: 3, d: 5, t: "5.4", sim: 1,
  q: "A single-agent prototype reads 60 long reports itself. After about 30 of them its answers become inconsistent and refer to 'typical industry patterns' rather than to specific findings it extracted earlier. What redesign addresses the cause?",
  o: [
    "Delegate the reading to subagents that each investigate one question and return compact structured findings, while the main agent keeps the plan.",
    "Tell the agent to re-read the earlier reports whenever it feels unsure about a fact it extracted previously, and to quote the passages it relies on.",
    "Start a fresh session after every 10 reports and give the new session nothing from the old one, so that old content cannot confuse it.",
    "Switch to a model with a larger context window and keep the single-agent design as it is, since the reports then fit in one session.",
  ], a: [0],
  e: "Nelle sessioni lunghe il contesto si degrada: il lavoro verboso va isolato in subagent che restituiscono risultati compatti, mentre l'agente principale conserva la visione d'insieme. Rileggere i report consuma altro contesto; ripartire da zero senza passare nulla perde i risultati ottenuti; un contesto più ampio ritarda il problema senza eliminarne la causa." });

Q({ id: "x3-27", s: 3, d: 5, t: "5.5", sim: 1,
  q: "An automated check of published reports shows 94% overall claim accuracy. Broken down, news-based claims (70% of volume) are 98% accurate, while figures taken from tables in scanned PDFs (8% of volume) are only 78% accurate. Management wants human review removed everywhere. What should you do?",
  o: [
    "Reduce review only for segments that meet the bar individually; keep it for scanned-table figures while that segment is improved.",
    "Remove human review everywhere, since 94% overall accuracy is above the target and the weak segment is only 8% of the total volume of reports.",
    "Keep human review on every report until overall accuracy reaches 99%, then remove it for all segments at the same time.",
    "Route the claims where the model reports low confidence to human review and treat the rest as reliable.",
  ], a: [0],
  e: "Una metrica aggregata può nascondere segmenti deboli: l'accuratezza va analizzata per tipo di documento e di campo prima di automatizzare. Si riduce la revisione dove ogni segmento regge e si mantiene dove no. Togliere tutto ignora il 78%; aspettare il 99% complessivo non dice quali segmenti siano sicuri; la sola confidenza auto-dichiarata non è calibrata e non sostituisce l'analisi per segmento." });

Q({ id: "x3-28", s: 3, d: 5, t: "5.6", sim: 1,
  q: "While analyzing two reports, the document analysis subagent finds that they give different values for the same indicator (12% and 18%). It keeps the value from the more recent report and omits the other, and the final report mentions only 18%. What is the right behavior?",
  o: [
    "Include both values, each annotated with its source and date, and let the coordinator decide how to reconcile them before synthesis.",
    "Keep the more recent value as the subagent did, since a newer publication date normally reflects a more up-to-date measurement.",
    "Report the average of the two values, noting in the output that it is a mean of two sources.",
    "Flag the indicator as unreliable and drop it from the subagent's output until a human has resolved the discrepancy.",
  ], a: [0],
  e: "In presenza di valori in conflitto da fonti credibili, l'analisi del documento li include entrambi con annotazione e attribuzione, e il coordinatore decide come riconciliarli prima della sintesi. Scegliere in silenzio il più recente scarta informazione (la differenza può dipendere da metodo o periodo); la media crea un valore che nessuna fonte ha prodotto; eliminare l'indicatore perde un dato utile." });

Q({ id: "x3-29", s: 3, d: 5, t: "5.6", sim: 1,
  q: "The web search subagent and the document analysis subagent independently find the same statistic, from two different sources. In the final report only one citation remains. What should the synthesis agent do when combining such findings?",
  o: [
    "Merge the claim-source mappings so that the combined claim lists both sources.",
    "Keep the first mapping received and discard the second, since duplicate claims add no information.",
    "Keep the mapping from the higher-ranked source and mention the other source only in a general bibliography.",
    "Rewrite the claim in general terms and cite the research as a whole instead of each individual source.",
  ], a: [0],
  e: "La sintesi deve preservare e unire le mappature affermazione-fonte quando combina i risultati: due fonti indipendenti per la stessa affermazione la rafforzano e vanno entrambe citate. Scartarne una perde attribuzione e corroborazione; una bibliografia generica non collega fonte e affermazione; una formulazione generale con citazione complessiva rende la tracciabilità impossibile." });

Q({ id: "x3-30", s: 3, d: 5, t: "5.6", sim: 1,
  q: "A source states: 'In a survey of 120 CIOs at large banks, 40% plan to adopt the technology within two years.' The report says: '40% of companies plan to adopt the technology.' What should change in the synthesis instructions?",
  o: [
    "Require synthesis to preserve each source's original characterization and methodological context (population, sample size, method) with the figure.",
    "Require synthesis to round all percentages to the nearest ten so that the precision does not exceed what the sources can justify, since the surveys are small.",
    "Require the report generation subagent to add a general disclaimer that all figures come from surveys and may not be representative of the wider market.",
    "Require synthesis to include only findings that come from studies with at least 1,000 respondents, to avoid weak generalizations.",
  ], a: [0],
  e: "Comprimere un risultato perde la caratterizzazione originale e il contesto metodologico: popolazione, campione e metodo vanno conservati accanto al dato, così il lettore sa a chi si riferisce. Arrotondare non ripristina il contesto; un avviso generico non dice quale cifra riguarda quale popolazione; una soglia di 1.000 rispondenti scarta fonti utili e non risolve la generalizzazione indebita." });
