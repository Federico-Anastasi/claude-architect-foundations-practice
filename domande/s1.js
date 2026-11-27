// Scenario 1 · Customer Support Resolution Agent
Q({ id: "s1-01", s: 1, d: 1, off: 1,
  q: "Production data shows that in 12% of cases, your agent skips `get_customer` entirely and calls `lookup_order` using only the customer's stated name, occasionally leading to misidentified accounts and incorrect refunds. What change would most effectively address this reliability issue?",
  o: [
    "Add a programmatic prerequisite that blocks `lookup_order` and `process_refund` calls until `get_customer` has returned a verified customer ID.",
    "Enhance the system prompt to state that customer verification via `get_customer` is mandatory before any order operations.",
    "Add few-shot examples showing the agent always calling `get_customer` first, even when customers volunteer order details.",
    "Implement a routing classifier that analyzes each request and enables only the subset of tools appropriate for that request type.",
  ], a: [0],
  e: "Quando una sequenza di tool è un requisito critico (identità verificata prima dei rimborsi), serve una garanzia deterministica: un gate programmatico. Prompt e few-shot abbassano l'errore ma non lo azzerano, e qui l'errore costa soldi. Il classificatore agisce su quali tool sono disponibili, non sul loro ordine." });

Q({ id: "s1-02", s: 1, d: 2, off: 1,
  q: "Production logs show the agent frequently calls `get_customer` when users ask about orders (e.g., 'check my order #12345'), instead of calling `lookup_order`. Both tools have minimal descriptions ('Retrieves customer information' / 'Retrieves order details') and accept similar identifier formats. What's the most effective first step to improve tool selection reliability?",
  o: [
    "Expand each tool's description to include input formats it handles, example queries, edge cases, and boundaries explaining when to use it versus similar tools.",
    "Add few-shot examples to the system prompt demonstrating correct tool selection patterns, with 5-8 examples showing order-related queries routing to `lookup_order`.",
    "Implement a routing layer that parses user input before each turn and pre-selects the appropriate tool based on detected keywords and identifier patterns.",
    "Consolidate both tools into a single `lookup_entity` tool that accepts any identifier and internally determines which backend to query.",
  ], a: [0],
  e: "Le descrizioni sono il meccanismo principale con cui il modello sceglie i tool: con descrizioni minime non può distinguere tool simili. Ampliarle è la correzione della causa, a basso costo. I few-shot aggiungono token senza risolvere la causa; il routing layer è sovra-ingegneria e scavalca la comprensione del modello; consolidare è una scelta architetturale valida ma eccessiva come 'primo passo'." });

Q({ id: "s1-03", s: 1, d: 5, off: 1,
  q: "Your agent achieves 55% first-contact resolution, well below the 80% target. Logs show it escalates straightforward cases (standard damage replacements with photo evidence) while attempting to autonomously handle complex situations requiring policy exceptions. What's the most effective way to improve escalation calibration?",
  o: [
    "Add explicit escalation criteria to your system prompt with few-shot examples demonstrating when to escalate versus resolve autonomously.",
    "Have the agent self-report a confidence score (1-10) before each response and automatically route requests to humans when confidence falls below a threshold.",
    "Deploy a separate classifier model trained on historical tickets to predict which requests need escalation before the main agent begins processing.",
    "Implement sentiment analysis to detect customer frustration levels and automatically escalate when negative sentiment exceeds a threshold.",
  ], a: [0],
  e: "La causa è che i confini decisionali non sono chiari: criteri espliciti con esempi few-shot sono la risposta proporzionata. La confidenza auto-riportata è mal calibrata (l'agente è già sicuro di sé sui casi difficili); il classificatore richiede dati etichettati e infrastruttura prima di aver provato col prompt; il sentiment non è correlato alla complessità del caso." });

Q({ id: "s1-04", s: 1, d: 5,
  q: "A customer writes: 'I don't want to deal with a bot. Connect me to a human agent now.' Their issue is a simple shipping address change that the agent could complete with one tool call. What should the agent do?",
  o: [
    "Call `escalate_to_human` immediately, honoring the explicit request without first attempting to resolve the issue.",
    "Complete the address change first, since it takes a single tool call, and then offer to escalate if the customer is still unsatisfied.",
    "Explain that the issue is simple and ask the customer to confirm that they still want a human before escalating.",
    "Run a sentiment check on the message and escalate only if the frustration score exceeds the configured threshold.",
  ], a: [0],
  e: "Una richiesta esplicita di un operatore umano si onora subito, senza prima indagare o risolvere. Insistere o chiedere conferma peggiora l'esperienza. Il criterio è la richiesta esplicita, non il sentiment." });

Q({ id: "s1-05", s: 1, d: 5,
  q: "A customer writes in an irritated tone: 'This is the third time my package is late, this is ridiculous.' They have not asked for a human. The delay is covered by a standard shipping-credit policy the agent is allowed to apply. What is the best behavior?",
  o: [
    "Acknowledge the frustration, offer to apply the shipping credit now, and escalate only if the customer reiterates that they want a human.",
    "Escalate to a human immediately, because repeated complaints combined with strongly negative sentiment reliably signal a case that needs human judgment.",
    "Apply the credit silently and close the conversation, since the emotional language is irrelevant to the resolution.",
    "Ask the customer to rate their frustration on a 1-10 scale to decide whether escalation is warranted.",
  ], a: [0],
  e: "Frustrazione non significa complessità. Se il problema è alla portata dell'agente: riconosci l'emozione e offri la soluzione; escala solo se il cliente ribadisce di volere un umano. Il sentiment negativo non è un trigger affidabile." });

Q({ id: "s1-06", s: 1, d: 5,
  q: "A customer asks the agent to match a lower price they found on a competitor's website. Your policy covers price adjustments when your own site lowers a price within 14 days, but says nothing about competitor prices. What should the agent do?",
  o: [
    "Escalate to a human, because the policy is silent on competitor price matching and this is a policy gap rather than a routine case.",
    "Deny the request, applying the closest existing rule (own-site adjustments only) as the authoritative policy.",
    "Approve the adjustment, since the evident intent of the own-site policy is to guarantee customers the lowest available price wherever they find it.",
    "Ask for the competitor's URL and process the adjustment automatically if the price difference is below $20.",
  ], a: [0],
  e: "Quando la policy è ambigua o tace sul caso specifico, l'agente escala: non inventa regole per analogia, né per negare né per approvare. La soglia di $20 non esiste nella policy." });

Q({ id: "s1-07", s: 1, d: 5,
  q: "Calling `get_customer` with the name 'Maria Rossi' returns three customer records in different cities. The customer is asking about a refund for a recent order. What should the agent do next?",
  o: [
    "Ask the customer for an additional identifier, such as the account email or an order number, before proceeding.",
    "Select the record with the most recent order activity, since it is the most likely match for a refund inquiry.",
    "Call `lookup_order` on all three records and continue with the account whose orders match the customer's description.",
    "Escalate to a human, because identity cannot be established automatically when multiple records match.",
  ], a: [0],
  e: "Con più corrispondenze si chiede un identificatore aggiuntivo invece di scegliere con un'euristica. Interrogare gli ordini di tutti e tre espone dati di altri clienti; escalare è prematuro perché l'agente può risolvere con una domanda." });

Q({ id: "s1-08", s: 1, d: 1,
  q: "Business policy states that refunds above $500 require human approval. The system prompt states this rule clearly, yet audits show the agent occasionally calls `process_refund` for amounts like $650. What is the most reliable fix?",
  o: [
    "Add a hook that intercepts outgoing `process_refund` calls, blocks those above $500, and redirects the flow to `escalate_to_human`.",
    "Rewrite the rule in capital letters and repeat it at the end of the system prompt to increase its salience.",
    "Add few-shot examples showing the agent escalating refunds of $600, $750, and $1,200 instead of processing them.",
    "Run a nightly audit job that detects refunds above $500, reverses them, and notifies each affected customer that a human agent will review the request.",
  ], a: [0],
  e: "Regole di business che richiedono compliance garantita → hook che intercetta la chiamata, la blocca e reindirizza a un workflow alternativo. Prompt e few-shot restano probabilistici; l'audit notturno interviene dopo il danno." });

Q({ id: "s1-09", s: 1, d: 1,
  q: "Your MCP tools return data in inconsistent formats: billing uses Unix timestamps, orders use ISO 8601 strings, and shipping returns numeric status codes such as `3` for 'delivered'. The agent sometimes misinterprets them. What is the most effective approach?",
  o: [
    "Implement a `PostToolUse` hook that normalizes timestamps and status codes into one consistent format before the agent processes the results.",
    "Add a section to the system prompt explaining each backend's date format and the meaning of every status code.",
    "Ask each backend team to change their API to return one common format, and postpone the launch until all of the changes have been deployed and tested.",
    "Add a `convert_format` tool that the agent can call whenever it is unsure how to interpret a value.",
  ], a: [0],
  e: "Un hook PostToolUse trasforma i risultati prima che il modello li veda: normalizzazione deterministica, nessun carico per il modello. Il prompt lascia l'interpretazione al caso; cambiare le API è lento e fuori dal tuo controllo; un tool in più aggiunge chiamate e decisioni." });

Q({ id: "s1-10", s: 1, d: 5,
  q: "In long conversations, earlier turns are periodically summarized to save context. Testers report that after summarization the agent refers to 'a partial refund' instead of the exact $247.83 the customer was promised, and loses the order number. What is the best fix?",
  o: [
    "Extract transactional facts (amounts, dates, order numbers, statuses) into a persistent 'case facts' block in every prompt, outside the summarized history.",
    "Switch to a model with a larger context window so that summarization is no longer needed in long conversations.",
    "Summarize more often, instructing the summarizer to be as detailed as possible, so fewer facts are lost at each step.",
    "Summarize more often, instructing the summarizer to preserve every detail it can, so that fewer facts are lost at each summarization step along the way.",
  ], a: [0],
  e: "La summarization progressiva condensa numeri, date e aspettative in frasi vaghe. I fatti transazionali vanno in un blocco strutturato persistente, separato dalla history riassunta. Una context window più grande rimanda il problema; far ripetere il cliente scarica il costo su di lui." });

Q({ id: "s1-11", s: 1, d: 5,
  q: "Each `lookup_order` call returns 40+ fields (warehouse codes, internal SKUs, audit metadata), but only about 5 are relevant to returns. In conversations involving several orders the context fills quickly and response quality drops. What should you do?",
  o: [
    "Trim the tool output to the return-relevant fields before it is appended to the conversation context.",
    "Increase `max_tokens` so the model has more room to reason over the larger tool results.",
    "Keep the full results and run a compaction step whenever the conversation grows past a fixed token threshold.",
    "Instruct the agent in the system prompt to ignore fields that are not relevant to returns.",
  ], a: [0],
  e: "I risultati dei tool si accumulano e consumano token in proporzione alla loro dimensione, non alla loro utilità. Si filtrano ai campi rilevanti prima che entrino nel contesto. `max_tokens` limita l'output, non il contesto; dire al modello di ignorarli non libera token." });

Q({ id: "s1-12", s: 1, d: 1,
  q: "When the agent escalates, cases land in a queue for human agents who have no access to the conversation transcript. They complain that they must ask customers for everything again. What should the escalation include?",
  o: [
    "A structured handoff summary: customer ID, root cause analysis, refund amount if any, actions already taken, and the recommended next action.",
    "A link to the full raw transcript, so the human agent can read the entire conversation before responding.",
    "A short note saying that the customer needs assistance, so the human agent can start fresh without inheriting any of the AI agent's possibly wrong assumptions.",
    "The agent's internal reasoning for each turn, so the human can see exactly why it decided to escalate.",
  ], a: [0],
  e: "Chi riceve l'escalation non vede il transcript: serve un riepilogo strutturato e autosufficiente. Il transcript per ipotesi non è accessibile (e sarebbe lungo); una nota generica obbliga a ricominciare; il ragionamento interno è rumore." });

Q({ id: "s1-13", s: 1, d: 2,
  q: "All your MCP tools return the same error text, 'Operation failed', whatever the cause. The agent keeps retrying policy violations and gives up immediately on transient timeouts. What change best enables correct recovery decisions?",
  o: [
    "Return the `isError` flag with structured metadata: `errorCategory` (transient, validation, business, permission), `isRetryable`, and a readable description.",
    "Add a system prompt instruction telling the agent to retry every failed tool call up to three times with increasing delays before it gives up and apologizes to the customer.",
    "Log detailed errors server-side for engineers, and keep the agent-facing message generic to avoid confusing the model.",
    "Return HTTP status codes in the error text so the agent can infer the category from the numeric code.",
  ], a: [0],
  e: "Un errore uniforme impedisce di decidere: transient → riprova; validation → correggi l'input; business → non riprovare e spiega al cliente; permission → cambia strada o escala. I retry ciechi sprecano chiamate sulle violazioni di policy; i log lato server non aiutano l'agente; un codice numerico lascia l'interpretazione al modello." });

Q({ id: "s1-14", s: 1, d: 2,
  q: "`process_refund` rejects a request because the item is outside the 90-day return window. How should the tool report this so the agent handles it appropriately?",
  o: [
    "Return `isError: true` with a business-error category, `isRetryable: false`, and a customer-friendly explanation of the policy that the agent can relay.",
    "Return a transient error so the agent waits and retries later, in case the policy check failed because of a temporary glitch in the order management backend.",
    "Return a success response with a note field explaining that no refund was actually issued.",
    "Raise an exception that ends the conversation and routes the customer to a generic support form.",
  ], a: [0],
  e: "Violazione di una regola di business: non ritentabile, con una spiegazione comunicabile al cliente. Segnalarla come transient provoca retry inutili; marcarla come successo nasconde il fallimento; chiudere la conversazione è sproporzionato." });

Q({ id: "s1-15", s: 1, d: 1,
  q: "A customer's single message describes three problems: a duplicate charge on their card, a damaged item in their last order, and a request to update their email address. What is the most effective way for the agent to handle it?",
  o: [
    "Decompose the message into distinct issues, investigate each one (in parallel where possible) using shared customer context, then synthesize one unified resolution.",
    "Resolve only the first issue, then ask the customer to open separate requests for the remaining two.",
    "Escalate to a human, because requests with multiple issues exceed what an autonomous agent should handle.",
    "Start three independent agent conversations, one per issue, each one re-identifying the customer from scratch so that every issue is handled in complete isolation.",
  ], a: [0],
  e: "Richieste con più problemi: scomporre in punti distinti, indagare ciascuno condividendo il contesto (cliente già verificato), poi una risposta unica. Le alternative scaricano lavoro sul cliente, escalano senza motivo o perdono il contesto condiviso." });

Q({ id: "s1-16", s: 1, d: 1,
  q: "Your agentic loop ends when the assistant's text contains phrases such as 'resolved' or 'anything else'. Occasionally the loop exits while Claude still has a pending tool request, leaving refunds half-processed. How should you fix the loop?",
  o: [
    "Continue while `stop_reason` is 'tool_use' (executing the tools and appending their results), and terminate when `stop_reason` is 'end_turn'.",
    "Extend the phrase list with more completion signals collected from production transcripts and match them with a case-insensitive regular expression.",
    "Cap the loop at five iterations, which covers the large majority of support cases observed in production.",
    "Terminate whenever the response contains any text block, since responses that request tools contain no text.",
  ], a: [0],
  e: "La terminazione si decide su `stop_reason`, non sul testo. Gli anti-pattern della guida sono proprio questi: cercare segnali in linguaggio naturale, un cap di iterazioni come meccanismo principale, il testo dell'assistente come indicatore di fine (una risposta può contenere testo e tool_use insieme)." });

Q({ id: "s1-17", s: 1, d: 5,
  q: "Which TWO of the following are appropriate triggers for escalating to a human agent?",
  o: [
    "The customer explicitly asks to speak with a human.",
    "The request falls into a policy gap, such as an exception the policy does not address.",
    "Sentiment analysis detects strongly negative language in the customer's message.",
    "The agent self-reports a confidence score below 7 out of 10 for its planned response.",
    "Resolving the case requires more than three tool calls.",
  ], a: [0, 1],
  e: "Trigger validi: richiesta esplicita, eccezioni o lacune della policy, impossibilità di fare progressi. Sentiment e confidenza auto-riportata sono proxy inaffidabili della complessità; il numero di chiamate ai tool non dice nulla." });

Q({ id: "s1-18", s: 1, d: 1,
  q: "A developer's loop executes the tools Claude requests, but to save tokens it sends only the latest user message on each new request, discarding earlier turns. The agent keeps calling `get_customer` for the same customer. What is the cause?",
  o: [
    "Prior turns, including tool calls and their results, must be sent back in the conversation history so the model can reason about what it already learned.",
    "The `get_customer` description is too vague, so the model cannot tell that it has already called the tool.",
    "The sampling temperature is too high, causing non-deterministic and repeated tool calls across iterations; setting it to zero makes tool selection stable.",
    "The tool should cache its results server-side so repeated calls return faster and consume fewer tokens.",
  ], a: [0],
  e: "L'API è stateless: ogni richiesta deve contenere la history completa, compresi i blocchi tool_use e tool_result. Senza, il modello non sa cosa ha già ottenuto e ripete le chiamate. Un cache lato server non dà memoria al modello." });
