// Scenario 3 · Multi-Agent Research System
Q({ id: "s3-01", s: 3, d: 1, off: 1,
  q: "After running the system on the topic 'impact of AI on creative industries', you observe that each subagent completes successfully: the web search agent finds relevant articles, the document analysis agent summarizes papers correctly, and the synthesis agent produces coherent output. However, the final reports cover only visual arts, completely missing music, writing, and film production. The coordinator's logs show it decomposed the topic into three subtasks: 'AI in digital art creation', 'AI in graphic design', and 'AI in photography'. What is the most likely root cause?",
  o: [
    "The coordinator agent's task decomposition is too narrow, resulting in subagent assignments that don't cover all relevant domains of the topic.",
    "The synthesis agent lacks instructions for identifying coverage gaps in the findings it receives from other agents.",
    "The web search agent's queries are not comprehensive enough and need to be expanded to cover more creative industry sectors.",
    "The document analysis agent is filtering out sources related to non-visual creative industries due to overly restrictive relevance criteria.",
  ], a: [0],
  e: "I log del coordinatore mostrano la causa: ha ridotto le 'industrie creative' alle sole arti visive. I subagent hanno fatto bene il compito assegnato; il problema è cosa è stato assegnato. Le altre opzioni incolpano agenti a valle che funzionano." });

Q({ id: "s3-02", s: 3, d: 5, off: 1,
  q: "The web search subagent times out while researching a complex topic. You need to design how this failure information flows back to the coordinator agent. Which error propagation approach best enables intelligent recovery?",
  o: [
    "Return structured error context to the coordinator including the failure type, the attempted query, any partial results, and potential alternative approaches.",
    "Implement automatic retry logic with exponential backoff within the subagent, returning a generic 'search unavailable' status only after all retries are exhausted.",
    "Catch the timeout within the subagent and return an empty result set marked as successful.",
    "Propagate the timeout exception directly to a top-level handler that terminates the entire research workflow.",
  ], a: [0],
  e: "Il contesto strutturato permette al coordinatore di decidere: riprovare con un'altra query, cambiare approccio o procedere con risultati parziali. Uno stato generico nasconde informazioni; un vuoto marcato come successo sopprime l'errore; terminare tutto è inutile quando il recupero è possibile." });

Q({ id: "s3-03", s: 3, d: 2, off: 1,
  q: "During testing, the synthesis agent frequently needs to verify specific claims while combining findings. Currently, it returns control to the coordinator, which invokes the web search agent, then re-invokes synthesis with results. This adds 2-3 round trips per task and increases latency by 40%. 85% of these verifications are simple fact-checks (dates, names, statistics) while 15% require deeper investigation. What's the most effective approach to reduce overhead while maintaining system reliability?",
  o: [
    "Give the synthesis agent a scoped `verify_fact` tool for simple lookups, while complex verifications continue delegating to the web search agent through the coordinator.",
    "Have the synthesis agent accumulate all verification needs and return them as a batch to the coordinator at the end of its pass, which then sends them all to the web search agent at once.",
    "Give the synthesis agent access to all web search tools so it can handle any verification need directly without round-trips through the coordinator.",
    "Have the web search agent proactively cache extra context around each source during initial research, anticipating what the synthesis agent might need to verify.",
  ], a: [0],
  e: "Minimo privilegio: un tool mirato per l'85% dei casi semplici, mentre i casi complessi seguono ancora il coordinatore. Il batching crea dipendenze bloccanti (la sintesi può dipendere da fatti verificati prima); tutti i tool di ricerca rompono la separazione dei ruoli; il caching speculativo non può prevedere cosa servirà." });

Q({ id: "s3-04", s: 3, d: 1,
  q: "The synthesis subagent's reports contain no citations, even though the web search subagent returned source URLs. The coordinator invokes synthesis with the prompt 'Synthesize the findings on topic X.' What is the root cause?",
  o: [
    "Subagents do not inherit the coordinator's context; the findings and their source metadata must be included explicitly in the synthesis subagent's prompt.",
    "The synthesis subagent's system prompt does not instruct it to include citations in the reports it writes.",
    "The web search subagent should write its results to a shared memory store that every subagent in the system reads automatically at the start of its task.",
    "The synthesis subagent needs access to the web search tool so it can retrieve the source URLs again.",
  ], a: [0],
  e: "I subagent hanno contesto isolato: non vedono la conversazione del coordinatore e non condividono memoria tra invocazioni. Il coordinatore deve passare i risultati completi, con metadati strutturati (URL, documento, pagina) separati dal contenuto." });

Q({ id: "s3-05", s: 3, d: 1,
  q: "The coordinator invokes the web search and document analysis subagents one after the other, in separate turns, although their tasks are independent. How can you reduce end-to-end latency?",
  o: [
    "Have the coordinator emit multiple Task tool calls in a single response so the subagents run in parallel.",
    "Merge the two subagents into one agent that performs both the searching and the analysis.",
    "Send both subagent requests through the Message Batches API so that they are processed together at a lower cost.",
    "Lower `max_tokens` for each subagent so that each sequential turn completes faster.",
  ], a: [0],
  e: "Parallelismo: più chiamate Task nella stessa risposta del coordinatore, non in turni separati. La Batch API non ha garanzie di latenza (fino a 24 ore)." });

Q({ id: "s3-06", s: 3, d: 1,
  q: "You define a coordinator with the Agent SDK and three subagent AgentDefinitions. At runtime the coordinator answers everything itself and never delegates. Its configuration is `allowedTools: ['WebSearch', 'Read']`. What is the most likely cause?",
  o: [
    "`allowedTools` does not include 'Task', which the coordinator needs in order to spawn subagents.",
    "The subagent descriptions are too short for the coordinator to recognize when delegation is appropriate.",
    "Subagents must first be registered as MCP servers before a coordinator can call them.",
    "The coordinator needs `tool_choice: 'any'` to force it to delegate to at least one subagent.",
  ], a: [0],
  e: "Il tool Task è il meccanismo che genera i subagent: se non è in `allowedTools`, il coordinatore non può delegare. Le descrizioni contano per scegliere quale subagent, ma il problema qui è a monte." });

Q({ id: "s3-07", s: 3, d: 2,
  q: "All four subagents have access to the same 18 tools. The synthesis agent sometimes launches web searches instead of synthesizing, and the document analysis agent often picks the wrong extraction tool. What change best improves reliability?",
  o: [
    "Restrict each subagent's tool set to the 4-5 tools relevant to its role.",
    "Add a line to each subagent's system prompt listing the tools it should avoid.",
    "Lengthen every tool description so each agent can choose correctly among all 18.",
    "Merge the 18 tools into a few general-purpose tools so there are fewer choices.",
  ], a: [0],
  e: "Troppi tool (18 invece di 4-5) peggiorano la selezione, e i tool fuori dalla propria specializzazione vengono usati male. Soluzione: tool limitati al ruolo. Descrizioni migliori aiutano ma non correggono una cattiva distribuzione; tool generici aumentano l'ambiguità." });

Q({ id: "s3-08", s: 3, d: 5,
  q: "Two credible sources report different figures for the size of the same market: $4.2B and $6.8B. The synthesis agent currently keeps the higher figure. What should the system do instead?",
  o: [
    "Include both values, each attributed to its source with its publication date, and annotate the conflict in the report.",
    "Average the two values and report the mean as the best available estimate.",
    "Keep the figure from the source with the higher domain authority and discard the other one to avoid confusing the readers.",
    "Drop the statistic from the report entirely, because the sources disagree.",
  ], a: [0],
  e: "Conflitti tra fonti credibili: si annotano con attribuzione, non si sceglie arbitrariamente. Le date servono a capire se la 'contraddizione' è solo temporale (dati di anni diversi)." });

Q({ id: "s3-09", s: 3, d: 1,
  q: "Your coordinator always runs the full pipeline (search → analysis → synthesis → report), even for simple factual questions such as 'When was the GDPR adopted?', which makes those answers slow and expensive. What is the best improvement?",
  o: [
    "Have the coordinator analyze each query's requirements and dynamically select which subagents to invoke.",
    "Place a cache of previous answers in front of the pipeline so that repeated or similar questions skip it entirely.",
    "Use a faster, smaller model for every subagent so that the full pipeline completes quickly.",
    "Build a separate keyword-based router that sends short questions to a different system.",
  ], a: [0],
  e: "Il coordinatore deve scegliere dinamicamente quali subagent servono in base alla complessità della richiesta, invece di passare sempre dall'intera pipeline." });

Q({ id: "s3-10", s: 3, d: 1,
  q: "Logs show the web search and document analysis subagents often research the same subtopics and return overlapping findings, wasting tokens. What should the coordinator do?",
  o: [
    "Partition the research scope, assigning distinct subtopics or source types to each subagent.",
    "Let both subagents work as before and deduplicate the overlapping findings later, during the synthesis step.",
    "Run the subagents sequentially so the second one can see what the first already covered.",
    "Reduce each subagent's maximum number of tool calls so the overlap costs less.",
  ], a: [0],
  e: "Partizionare lo scope (sottotemi o tipi di fonte distinti) elimina la duplicazione alla radice. Deduplicare dopo spreca comunque il lavoro; serializzare toglie il parallelismo." });

Q({ id: "s3-11", s: 3, d: 1,
  q: "Reports are coherent but sometimes thin on subtopics where the initial searches returned little. You want the system to fill these gaps automatically. Which pattern fits?",
  o: [
    "An iterative refinement loop: the coordinator checks the synthesis for gaps, re-delegates targeted queries, and re-invokes synthesis until coverage is sufficient.",
    "Increase the number of results each search returns so that the first pass captures more material.",
    "Instruct the synthesis agent to fill any gaps from its own background knowledge whenever the sources are missing, marking those passages so readers can tell them apart.",
    "Run the whole pipeline three times and merge the three resulting reports into one.",
  ], a: [0],
  e: "Raffinamento iterativo guidato dal coordinatore: valuta, ri-delega query mirate, ri-sintetizza. Riempire con la conoscenza del modello compromette le citazioni; più risultati non mirano alle lacune." });

Q({ id: "s3-12", s: 3, d: 1,
  q: "The coordinator's prompts to subagents are rigid step-by-step procedures ('search A, then B, then summarize in 3 bullets'). Subagents fail to adapt when a step yields nothing useful. How should the coordinator's prompts change?",
  o: [
    "Specify the research goals and quality criteria, leaving subagents room to adapt their approach.",
    "Add more steps that cover fallback cases for when earlier steps return nothing.",
    "Have subagents return control to the coordinator after each step to receive the next instruction.",
    "Replace the prompts with a fixed tool sequence enforced by hooks.",
  ], a: [0],
  e: "Il coordinatore indica obiettivi e criteri di qualità, non procedure passo-passo: così i subagent possono adattarsi a ciò che trovano." });

Q({ id: "s3-13", s: 3, d: 5,
  q: "The web search subagent returns 'no results' both when the search API times out and when a niche query genuinely has no matches. The coordinator treats both cases the same way. Why is this a problem?",
  o: [
    "An access failure may warrant a retry or an alternative source, while a valid empty result is itself a finding; the subagent must report them distinctly.",
    "It is not a problem: in both cases the information is unavailable to the coordinator, so handling the two cases identically is correct and keeps the design simple.",
    "Timeouts are rare, so the coordinator should simply retry every empty result once to cover them.",
    "The subagent should retry every empty result until at least one match is returned.",
  ], a: [0],
  e: "Bisogna distinguere l'errore di accesso (decidere se riprovare) dal risultato vuoto valido (query riuscita, zero corrispondenze). Riprovare ogni vuoto spreca; trattarli allo stesso modo nasconde i guasti." });

Q({ id: "s3-14", s: 3, d: 5,
  q: "After synthesis, the report states facts correctly, but many claims can no longer be traced to a specific source because subagents passed prose summaries. What design change preserves attribution?",
  o: [
    "Require subagents to output structured claim-source mappings (claim, excerpt, source URL or document, date) that synthesis must preserve and merge.",
    "Have the report agent search the web again for each claim in the final report and attach the first matching URL it finds as that claim's citation.",
    "Append the full list of URLs consulted during research to the end of the report as a bibliography.",
    "Instruct the synthesis agent to write shorter summaries so that less attribution is lost.",
  ], a: [0],
  e: "L'attribuzione si perde quando i risultati vengono compressi senza la mappatura claim→fonte. Serve un output strutturato che i passaggi successivi preservano. Una bibliografia generica non dice quale claim viene da quale fonte; cercare a posteriori rischia attribuzioni sbagliate." });

Q({ id: "s3-15", s: 3, d: 5,
  q: "The synthesis agent has a limited context budget. The document analysis agent returns long outputs that include its full reasoning chains, and synthesis quality drops. What is the best change?",
  o: [
    "Change the document analysis agent to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning.",
    "Give the synthesis agent a larger context window by switching it to a different model.",
    "Have the synthesis agent first summarize each incoming document analysis into a short paragraph, and then write the report from those summaries.",
    "Truncate each document analysis output to its first 2,000 tokens before passing it on.",
  ], a: [0],
  e: "Se l'agente a valle ha poco budget, si cambia quello a monte: dati strutturati e compatti invece di testo verboso. Troncare perde informazione a caso; un riassunto in più aggiunge un passaggio con perdita." });

Q({ id: "s3-16", s: 3, d: 5,
  q: "The synthesis agent receives the outputs of 10 subagents concatenated into one long input. Findings from the middle outputs are often missing from the final report. What helps most?",
  o: [
    "Put a summary of key findings at the beginning of the aggregated input and organize detailed results under explicit section headers.",
    "Randomize the order of the subagent outputs on each run so that no section stays in the middle.",
    "Put the most important subagent's output last, since models attend most reliably to the end of a long input and least to its middle.",
    "Ask the synthesis agent to read the whole input twice before writing the report.",
  ], a: [0],
  e: "Effetto 'lost in the middle': inizio e fine vengono elaborati bene, il centro meno. Rimedio: riepilogo dei punti chiave in testa e intestazioni di sezione esplicite." });

Q({ id: "s3-17", s: 3, d: 5,
  q: "The academic database used by one subagent was unavailable for the whole run, so findings on clinical studies are thin. How should the final report handle this?",
  o: [
    "Include coverage annotations stating which findings are well supported and which topic areas have gaps because sources were unavailable.",
    "Omit the clinical studies section so that the report contains only well-supported content.",
    "Fail the whole run and retry later, because a report with missing sources is not acceptable.",
    "Fill the clinical studies section from general web results instead, and present it in the same way as the other sections so the report stays consistent.",
  ], a: [0],
  e: "Annotazioni di copertura: il lettore sa cosa è solido e dove ci sono lacune. Ometterle o presentarle come complete è fuorviante; abortire tutto è un anti-pattern." });

Q({ id: "s3-18", s: 3, d: 2,
  q: "The document analysis subagent occasionally hits transient 503 errors from a PDF-parsing service. Today every such error goes to the coordinator, which re-plans the whole task. What is the better design?",
  o: [
    "Let the subagent retry transient errors locally and propagate to the coordinator only errors it cannot resolve, with what it attempted and any partial results.",
    "Keep propagating every error to the coordinator, so that it retains full control and visibility over all recovery decisions made anywhere in the research system.",
    "Have the subagent silently skip documents that fail and return results only for those that succeeded.",
    "Configure the coordinator to restart the entire pipeline whenever any subagent reports an error.",
  ], a: [0],
  e: "Recupero locale per gli errori transitori; al coordinatore solo ciò che non si risolve, con tentativi e risultati parziali. Saltare in silenzio nasconde lacune; riavviare tutto è sproporzionato." });

Q({ id: "s3-19", s: 3, d: 5,
  q: "A long research run crashes after three of its five subagents have finished. Restarting means repeating hours of work. What design enables recovery?",
  o: [
    "Each agent exports its state to a known location; on resume, the coordinator loads a manifest and injects the saved state into the agents' prompts.",
    "Resume the coordinator session with `--resume`; the subagents' results are restored together with it, so the remaining two subagents can simply continue.",
    "Give each subagent a lower timeout so failures happen earlier and the run restarts sooner.",
    "Keep all subagent results only in the coordinator's conversation history so that nothing is lost.",
  ], a: [0],
  e: "Persistenza strutturata dello stato: ogni agente esporta in una posizione nota, il coordinatore carica un manifest alla ripresa e lo inietta nei prompt. La history in memoria si perde con il crash." });

Q({ id: "s3-20", s: 3, d: 5,
  q: "Which TWO practices improve the final synthesized report?",
  o: [
    "Render each content type appropriately: financial data as tables, news as prose, technical findings as structured lists.",
    "Separate well-established findings from contested ones, preserving the sources' original characterizations.",
    "Convert all content into a uniform bullet-list format for consistency across sections.",
    "Resolve conflicting figures by keeping the most recent value and omitting the others.",
    "Remove methodological context from the findings to keep the report concise.",
  ], a: [0, 1],
  e: "La guida chiede formati adatti al contenuto e sezioni che separino il consolidato dal conteso, preservando metodologia e caratterizzazioni originali. Uniformare tutto, scegliere arbitrariamente tra valori o togliere la metodologia peggiora il report." });
