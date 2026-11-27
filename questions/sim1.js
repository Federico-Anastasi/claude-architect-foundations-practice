// Scenario 1 · Customer Support Resolution Agent · simulation pool
Q({ id: "x1-01", s: 1, d: 1, t: "1.1", sim: 1,
  q: "Auditors want the support agent's behavior to be predictable, and an architect proposes replacing the agentic loop with a state machine that fixes the order of every tool call. The only hard audit requirements are that no refund is paid before the customer is verified and that no refund above $500 is paid without a human. What is the best response?",
  o: [
    "Keep Claude choosing the next tool inside the loop, and enforce only the two audited rules programmatically with a prerequisite gate and an interception hook.",
    "Replace the loop with the state machine, since a fixed order of tool calls is the only way to make the agent's behavior predictable for auditors and regulators.",
    "Keep the loop and state both audited rules clearly in the system prompt, logging every tool call so that auditors can check compliance afterwards.",
    "Replace the loop with one decision tree per request category, letting Claude fill in only the arguments of each pre-set tool call.",
  ], a: [0],
  e: "Le decisioni sul prossimo tool restano al modello (loop guidato da stop_reason), mentre la conformità richiesta dagli auditor si garantisce in modo deterministico solo dove serve: un prerequisito sul rimborso e un hook sulla soglia di $500. Una macchina a stati o un albero decisionale fisso tolgono adattabilità a richieste ambigue senza necessità; il solo prompt con log è probabilistico e controlla a danno avvenuto." });

Q({ id: "x1-02", s: 1, d: 1, t: "1.2", sim: 1,
  q: "A customer writes: 'I was charged twice, my replacement lamp never arrived, and I still can't log in.' The final reply addresses only the duplicate charge. Each subagent did its job correctly for the task it received, and the coordinator's log shows it created a single subtask, 'Investigate duplicate charge.' What is the most effective change?",
  o: [
    "Instruct the coordinator to list every distinct issue in the message and create one subtask for each before delegating, with coverage as a quality criterion.",
    "Broaden the billing subagent's prompt so it also investigates shipping and login problems whenever it finds any customer complaint in the case data it retrieves.",
    "Add a final proofreading subagent that checks the grammar and tone of the reply before it is sent to the customer.",
    "Let the synthesis step infer the missing issues from the original message and add them to the reply on its own.",
  ], a: [0],
  e: "Il difetto sta nella decomposizione del coordinatore, troppo stretta: i subagenti hanno eseguito bene ciò che gli è stato assegnato. Va corretto il coordinatore, facendogli enumerare tutti i problemi e delegare ciascuno. Allargare il prompt di `billing` rompe la specializzazione; il revisore di tono non rileva problemi mancanti; la sintesi non può inventare indagini mai svolte." });

Q({ id: "x1-03", s: 1, d: 1, t: "1.2", sim: 1,
  q: "For a message with a duplicate charge and a damaged item, the coordinator sends the entire message to both the `billing` and the `returns` subagents with the prompt 'Resolve this customer's request.' Both investigate the whole case, and in one incident each issued a $42.00 credit for the same duplicate charge. What should the coordinator change?",
  o: [
    "Partition the work by issue: assign the duplicate charge to `billing` and the damaged item to `returns`, each with a prompt scoped to its own issue.",
    "Let the two subagents see each other's tool calls as they work, so that each can skip anything the other one has already done on the same case.",
    "Keep the full-message prompts and add a system prompt rule that no single case may ever receive more than one credit, whichever subagent handles it.",
    "Run the two subagents one after the other and pass the first one's full output to the second as extra context for the whole case, so nothing is repeated.",
  ], a: [0],
  e: "Il coordinatore deve ripartire l'ambito tra i subagenti in modo da minimizzare la sovrapposizione: un problema distinto per ciascuno, con un prompt circoscritto. Far vedere le chiamate altrui contraddice l'isolamento dei subagenti; la regola nel prompt è probabilistica su un'azione economica; l'esecuzione in sequenza con tutto il caso a entrambi lascia l'indagine duplicata." });

Q({ id: "x1-04", s: 1, d: 1, t: "1.3", sim: 1,
  q: "A customer disputes a $300 charge. The agent has already verified the customer and pulled the order history and the applicable policy. The team wants to draft two alternative resolutions, a full refund and a partial refund plus store credit, and compare their consequences, without repeating the investigation and without one draft influencing the other. What should you use?",
  o: [
    "Fork the session after the shared investigation with `fork_session`, and develop each resolution in its own independent branch.",
    "Ask the agent to draft both resolutions one after the other in the same conversation, then compare them in that shared context.",
    "Start two new sessions from scratch, repeating the customer verification and the order lookup in each, to keep the drafts apart.",
    "Resume the same named session twice with `--resume` and ask for a different resolution each time, as if they were separate branches.",
  ], a: [0],
  e: "`fork_session` crea rami indipendenti a partire da una base di analisi condivisa: l'indagine non si ripete e le due bozze non si influenzano. Scriverle nella stessa conversazione fa contaminare la seconda dalla prima; due sessioni nuove ripetono verifica e ricerche; `--resume` riprende lo stesso filo di conversazione, non ne crea un ramo separato." });

Q({ id: "x1-05", s: 1, d: 1, t: "1.3", sim: 1,
  q: "The coordinator has two subagent definitions with identical tool lists: `payments_agent` ('Handles payment issues') and `billing_agent` ('Handles billing issues'). A subscription renewal dispute is sent to one or the other seemingly at random, and the results are inconsistent. What is the best fix?",
  o: [
    "Rewrite the two `AgentDefinition` descriptions with distinct responsibilities, examples and boundaries, and give each only the tools its role needs.",
    "Add eight few-shot examples to the coordinator's prompt showing renewal disputes always routed to `billing_agent`.",
    "Add a routing layer that matches keywords in the customer message and invokes a subagent directly, bypassing the coordinator's own choice of subagent for the request.",
    "Merge the two definitions into a single `finance_agent` that has the union of both tool lists.",
  ], a: [0],
  e: "Il coordinatore sceglie il subagente dalle descrizioni delle `AgentDefinition`: se sono quasi identiche, l'instradamento è casuale. Si rendono distinte (responsabilità, esempi, confini) e si restringono i tool al ruolo. I few-shot aggiungono token senza risolvere la causa; un router a parole chiave aggira la comprensione del modello ed è sovra-ingegneria; fondere gli agenti allarga il set di tool." });

Q({ id: "x1-06", s: 1, d: 1, t: "1.4", sim: 1,
  q: "You implemented a gate that unlocks `process_refund` once `get_customer` has been called in the conversation. Audits still find refunds paid to the wrong account: in these cases `get_customer` had returned three matching records and the agent continued with one of them. What is the right fix?",
  o: [
    "Unlock `process_refund` only after `get_customer` has returned a verified customer ID, treating multiple matches as unverified until another identifier arrives.",
    "Keep the gate and instruct the agent to pick, among the matching records, the one whose most recent order best matches the customer's description of the problem.",
    "Require `get_customer` to be called twice before unlocking the refund, so that the second call confirms the result of the first.",
    "Keep the gate and log each refund with the number of matching records, so audits can find wrong-account refunds sooner.",
  ], a: [0],
  e: "Il prerequisito programmatico deve bloccare finché `get_customer` non ha restituito un ID cliente verificato, non solo finché è stato chiamato: con più corrispondenze l'identità non è verificata e serve un identificatore aggiuntivo. Scegliere con un'euristica è proprio l'errore; una seconda chiamata identica restituisce le stesse tre corrispondenze; il log rileva il danno solo dopo che è avvenuto." });

Q({ id: "x1-07", s: 1, d: 1, t: "1.4", sim: 1,
  q: "A programmatic prerequisite blocks `process_refund` until `get_customer` has returned a verified customer ID. When the agent tries a refund too early, the gate silently drops the call and returns nothing, and the agent then tells the customer that the refund went through. What should the gate do?",
  o: [
    "Return an error result saying that customer verification is required first and naming `get_customer`, so the agent calls it and then retries the refund.",
    "Return a success response saying the refund is queued, so the conversation continues while the verification happens in the background.",
    "Raise an exception that ends the agent loop, so the conversation restarts from the first message with verification as its first step.",
    "Keep dropping the call silently, and add a system prompt line telling the agent to confirm the refund appears in the tool result before telling the customer.",
  ], a: [0],
  e: "Un prerequisito che blocca una chiamata deve restituire un risultato esplicito che dice cosa manca e quale tool chiamare: il modello può correggere il percorso e riprovare. Una finta riuscita crea lo stesso errore verso il cliente; terminare il loop butta via il contesto; il blocco silenzioso con un'istruzione nel prompt lascia all'agente il compito di accorgersi di un'assenza." });

Q({ id: "x1-08", s: 1, d: 1, t: "1.5", sim: 1,
  q: "To enforce the $500 refund limit, engineers wrote a `PostToolUse` hook on `process_refund` that raises an alert and blocks the conversation when the refunded amount exceeds $500. Audits show that refunds of $720 are still being paid out. What is wrong with this design?",
  o: [
    "A `PostToolUse` hook runs after the tool has executed; the check must intercept the outgoing call so a refund above $500 never executes and is redirected.",
    "The hook should return a more detailed message after the call, so the model learns the limit and avoids large refunds later in the conversation.",
    "Hooks cannot enforce business rules; the limit should be stated in the system prompt with few-shot examples of refunds above $500 being escalated instead.",
    "The threshold in the hook should be lowered to $400, so that amounts near the limit are caught despite the delay.",
  ], a: [0],
  e: "I hook che intercettano le chiamate in uscita impediscono l'azione e possono reindirizzare (blocco sopra $500 con escalation); un hook PostToolUse agisce sul risultato quando il rimborso è già stato eseguito. Un messaggio più dettagliato dopo la chiamata non annulla il pagamento; i hook possono far rispettare regole di business, mentre il prompt è probabilistico; abbassare la soglia non cambia il momento del controllo." });

Q({ id: "x1-09", s: 1, d: 1, t: "1.4", sim: 1,
  q: "The agent has already issued a $40 credit for a $125 duplicate charge when the customer demands the remaining $85 plus compensation, which exceeds the agent's authority. Human agents see only what the agent sends in `escalate_to_human`, not the transcript. Which handoff is most useful?",
  o: [
    "A structured summary: customer ID, root cause (duplicate capture), $40 credited and $85 outstanding, the compensation request, and a recommended action.",
    "The customer ID and the reason 'billing dispute above agent authority', so the human agent can ask the customer for the details directly and start from scratch.",
    "The agent's complete tool-call log with all raw responses, so the human agent can reconstruct the case step by step.",
    "A sentiment label and a priority score computed from the conversation, so the case lands in the right queue.",
  ], a: [0],
  e: "Chi riceve l'escalation non ha il transcript: serve un riepilogo strutturato e autosufficiente con ID cliente, causa radice, importi (già accreditato e residuo), azioni compiute e azione raccomandata, così non si duplica né si contraddice il lavoro fatto. Una nota minima obbliga a ricominciare; il log grezzo è rumore da decifrare; sentiment e priorità non dicono cosa fare." });

Q({ id: "x1-10", s: 1, d: 1, t: "1.6", sim: 1,
  q: "Every week you review 300 resolved conversations against four fixed criteria: policy adherence, correct amounts, tone and handoff completeness. A single prompt asked to check all four produces uneven coverage: some conversations get detailed amount checks but no tone check. What is the best approach?",
  o: [
    "Use a fixed prompt chain with one focused pass per criterion on each conversation, followed by a final pass that merges the findings.",
    "Use a dynamic planner that decides at runtime which criteria are worth checking for each conversation, based on what it finds along the way.",
    "Run the single prompt three times per conversation and keep only the findings that appear in at least two runs.",
    "Move to a model with a larger context window so that the whole review fits in one, more attentive pass.",
  ], a: [0],
  e: "Per revisioni prevedibili e multi-aspetto il prompt chaining (un passaggio focalizzato per criterio, poi uno di integrazione) garantisce profondità uniforme. Un planner dinamico serve a indagini aperte, qui i criteri sono noti e fissi; il voto a maggioranza sopprime i problemi trovati solo a volte; una finestra più ampia non risolve la qualità dell'attenzione." });

Q({ id: "x1-11", s: 1, d: 1, t: "1.6", sim: 1,
  q: "Billing disputes over a charge the customer does not recognize are investigated with a fixed five-step checklist: card details, order history, subscription status, refunds issued and fraud flags. Often the first lookup reveals the real cause, such as a family member's account or a trial that converted, so the remaining steps are irrelevant while a needed step (checking linked accounts) is missing. What decomposition fits better?",
  o: [
    "Adaptive decomposition: start from the first finding and generate the next steps from what each result reveals, including steps outside the original checklist.",
    "Keep the checklist and append linked-account and trial-conversion checks as steps six and seven, so every dispute covers all the causes seen so far in past cases.",
    "Keep the five steps but let the agent skip any step it judges irrelevant, without adding any new ones.",
    "Run all five steps in parallel on every dispute and let the agent choose the relevant results at the end.",
  ], a: [0],
  e: "Per indagini aperte la decomposizione adattiva genera i sotto-compiti in base a ciò che si scopre a ogni passo, anche fuori da una checklist fissa. Allungare la checklist continua a sprecare passi e non copre le cause future; saltare passi senza aggiungerne non colma i buchi; eseguirli tutti in parallelo spreca chiamate e non adatta il piano." });

Q({ id: "x1-12", s: 1, d: 1, t: "1.5", sim: 1,
  q: "Which TWO of these requirements should be implemented with hooks rather than with instructions in the system prompt?",
  o: [
    "Refunds above $500 must never execute without human approval.",
    "Timestamps from billing (Unix) and orders (ISO 8601) must reach the model in one consistent format.",
    "Replies to upset customers should open with a brief acknowledgment of the frustration.",
    "The agent should explain a declined refund in plain language, mentioning the policy that applies.",
    "The agent should prefer a replacement over a refund when both are possible and the customer has no preference.",
  ], a: [0, 1],
  e: "I hook garantiscono comportamenti deterministici: un hook sulle chiamate in uscita blocca i rimborsi oltre soglia e li reindirizza, un hook PostToolUse normalizza i formati dei risultati prima che il modello li veda. Tono, spiegazioni in linguaggio chiaro e preferenze di soluzione sono stili o criteri di giudizio: il prompt basta, senza costo economico in caso di errore." });

Q({ id: "x1-13", s: 1, d: 2, t: "2.1", sim: 1,
  q: "A new MCP tool `get_shipment_status` ('Retrieves order shipping information') was added next to `lookup_order` ('Retrieves order details'; its output also includes a shipping status). `get_shipment_status` returns carrier scan events and delivery estimates that `lookup_order` does not. The agent now picks between them almost at random for 'where is my parcel?' and for 'was I charged shipping?'. What is the best fix?",
  o: [
    "Rename it `track_shipment` and rewrite both descriptions to separate tracking from order contents, each saying when to use the other.",
    "Remove `get_shipment_status`, because `lookup_order` already reports a shipping status and a single tool is simpler for the model to choose between.",
    "Add six few-shot examples to the system prompt that show parcel questions going to `get_shipment_status`.",
    "Add a keyword router that pre-selects `get_shipment_status` when the message contains 'parcel', 'tracking' or 'delivery', before the model chooses.",
  ], a: [0],
  e: "Descrizioni quasi identiche causano l'errata selezione: si elimina la sovrapposizione rinominando il tool in modo specifico e riscrivendo le descrizioni con scopo, input e confini. Rimuovere il tool perde scansioni e stime di consegna; i few-shot aggiungono token senza risolvere la causa; il router a parole chiave è sovra-ingegneria e aggira il modello." });

Q({ id: "x1-14", s: 1, d: 2, t: "2.1", sim: 1,
  q: "A single `manage_account` tool accepts a free-text `request` field and a JSON `changes` object, and performs email updates, address changes, password-reset triggers and account closures. The agent frequently sends payloads of the wrong shape and twice triggered a closure when the customer asked about a reset. What is the best redesign?",
  o: [
    "Split it into purpose-specific tools (`update_email`, `update_address`, `send_password_reset`, `close_account`), each with a defined contract.",
    "Keep the single tool and add a detailed description with a JSON example for every type of change.",
    "Keep the single tool and add a system prompt step requiring the agent to confirm with the customer before it sends any closure payload to the backend.",
    "Keep the single tool and validate each payload on the server, returning a generic error whenever it does not match the expected shape for the request.",
  ], a: [0],
  e: "Un tool generico con payload libero rende ambigua la selezione e la forma dei dati: dividerlo in tool a scopo preciso con contratti di input/output definiti riduce errori e rende esplicita l'azione distruttiva. Una descrizione più lunga non toglie l'ambiguità tra azioni; la conferma nel prompt è probabilistica; un errore generico non dice all'agente cosa correggere." });

Q({ id: "x1-15", s: 1, d: 2, t: "2.2", sim: 1,
  q: "The refund backend rejects a $120 refund because only $80 of the order is still refundable, a partial refund having been issued earlier. Which response from `process_refund` lets the agent recover best?",
  o: [
    "`isError: true`, business category, not retryable, with a message stating the $80 refundable balance so the agent can offer up to that amount.",
    "`isError: true`, transient category, retryable, with the message 'Refund failed, please try again', so the agent resubmits the request.",
    "`isError: true` with only the text 'Operation failed', since further detail could confuse the model about what to tell the customer.",
    "A normal successful response containing `refunded: false`, leaving the agent to notice the field and work out the reason itself.",
  ], a: [0],
  e: "Una violazione di regola di business va segnalata con `isError`, categoria business, non ritentabile e con una spiegazione concreta (il saldo rimborsabile di $80): l'agente propone un importo valido e lo comunica al cliente. Un errore transitorio invita a ripetere una richiesta destinata a fallire; il testo generico toglie ogni base per decidere; una risposta 'riuscita' con un campo booleano nasconde il fallimento." });

Q({ id: "x1-16", s: 1, d: 2, t: "2.2", sim: 1,
  q: "`get_customer` returns 'Access denied' for accounts flagged as restricted, because the agent's service role cannot read them. The tool reports this as `isError: true` with 'Operation failed'; the agent retries three times and then tells the customer that the system is down. How should the tool report it?",
  o: [
    "As a non-retryable permission error whose description says the account is restricted for this service role, so the agent can escalate instead of retrying.",
    "As a transient error with `isRetryable: true`, since access rules may change while the agent keeps trying and the restriction could be lifted shortly after the first attempt.",
    "As a validation error, so the agent asks the customer to re-enter the account details.",
    "As a successful response with an empty customer record, so the agent proceeds as with a new customer.",
  ], a: [0],
  e: "Un errore di permessi non si risolve ritentando: va segnalato come tale, non ritentabile, con una descrizione leggibile, così l'agente cambia strada o escala. Marcarlo transitorio produce altri retry inutili; trattarlo come validazione fa chiedere al cliente dati che non servono; un record vuoto 'riuscito' porterebbe a trattare un cliente esistente come nuovo." });

Q({ id: "x1-17", s: 1, d: 2, t: "2.3", sim: 1,
  q: "Three subagents (`returns`, `billing`, `account`) are each configured with the same four MCP tools. Logs show that the `account` agent, which handles profile and login issues, repeatedly calls `process_refund` and `lookup_order` while trying to help with unrelated payment complaints. What is the most effective change?",
  o: [
    "Restrict the `account` agent's tools to what its role needs, such as `get_customer` and `escalate_to_human`, leaving refund and order tools to the other agents.",
    "Add a rule to the `account` agent's system prompt forbidding it from calling `process_refund` or `lookup_order` in any conversation, whatever the customer asks.",
    "Add a keyword classifier that routes payment complaints away from the `account` agent before it sees the message.",
    "Replace the three subagents with one agent that holds all the tools and decides for itself which ones to use.",
  ], a: [0],
  e: "Gli agenti con tool fuori dalla propria specializzazione tendono a usarli male: si limita il set di ciascun subagente al ruolo. Il divieto nel prompt è probabilistico e lascia il tool disponibile; un classificatore a monte aggiunge infrastruttura invece di togliere la causa; un agente unico con tutti i tool peggiora l'affidabilità di selezione." });

Q({ id: "x1-18", s: 1, d: 2, t: "2.3", sim: 1,
  q: "To stop the agent from answering in plain text when it should call a tool, the team set `tool_choice` to 'any' on every request. Now conversations never reach a final reply: each response must call a tool, and loops end only when the iteration cap triggers. What should you change?",
  o: [
    "Use 'any' only on requests that require a tool call, and use 'auto' otherwise so the model can end its turn with a text reply.",
    "Keep 'any' and raise the iteration cap, so the model has more turns in which to settle on a final answer before the loop ends.",
    "Keep 'any' and add a system prompt instruction to answer in text whenever the case is resolved, so the model knows when it may finish.",
    "Force one named tool on every request, which guarantees a single predictable tool call per turn and a loop that ends once that tool succeeds.",
  ], a: [0],
  e: "Con 'any' il modello deve sempre chiamare un tool, quindi non può chiudere con testo: va usato solo dove la chiamata è richiesta, tornando a 'auto' per permettere la risposta finale. Alzare il tetto non cambia il vincolo; un'istruzione nel prompt non può scavalcare una configurazione che impone la chiamata; forzare un tool a ogni richiesta peggiora il problema." });

Q({ id: "x1-19", s: 1, d: 2, t: "2.4", sim: 1,
  q: "The agent needs two new integrations: your helpdesk ticketing platform, which has a well-maintained community MCP server, and your internal loyalty-points ledger, which has a proprietary API with team-specific rules. An engineer proposes building custom MCP servers for both. What is the recommended approach?",
  o: [
    "Use the existing community MCP server for ticketing and build a custom MCP server only for the loyalty-points ledger.",
    "Build custom servers for both, so that all integrations follow the same internal conventions and descriptions.",
    "Use the community server for ticketing and expose the ledger through a generic fetch tool that accepts any URL.",
    "Use the community server for ticketing and put the loyalty rules in the system prompt, since proprietary APIs cannot be exposed through MCP.",
  ], a: [0],
  e: "Per integrazioni standard conviene un server MCP della community già mantenuto; i server custom si riservano ai flussi specifici del team, come il registro punti interno. Costruirli entrambi spreca lavoro; un tool di fetch generico apre accessi non vincolati; l'affermazione sul prompt è falsa: le API proprietarie si espongono tramite MCP." });

Q({ id: "x1-20", s: 1, d: 2, t: "2.4", sim: 1,
  q: "Which TWO statements about configuring the support agent's MCP servers are correct?",
  o: [
    "A shared `.mcp.json` can reference credentials as `${VAR}` placeholders, which are expanded from each developer's environment instead of being committed.",
    "Tools from all configured MCP servers are discovered when the connection is made and are available to the agent at the same time.",
    "A personal experimental server in `~/.claude.json` is shared with teammates through version control.",
    "Developers must switch off their personal servers before the project's servers in `.mcp.json` can be used.",
    "A server's tools become available only after the agent calls a discovery tool in each conversation.",
  ], a: [0, 1],
  e: "Il file `.mcp.json` di progetto supporta l'espansione di variabili d'ambiente come `${VAR}`, quindi i token non vengono committati; i tool di tutti i server configurati sono scoperti alla connessione e disponibili insieme. La configurazione utente in `~/.claude.json` è personale e non condivisa via version control, non serve spegnere un server per usarne un altro, e non esiste un passo di discovery per conversazione." });

Q({ id: "x1-21", s: 1, d: 5, t: "5.1", sim: 1,
  q: "Which TWO items belong in the persistent 'case facts' block that is sent with every prompt, outside the summarized history?",
  o: [
    "The exact refund amount promised to the customer and the order number it applies to.",
    "The customer's stated expectation with its date, such as 'needs the replacement by Friday'.",
    "A paraphrase of the customer's emotional state across the conversation.",
    "The complete raw output of every `lookup_order` call made so far.",
    "The agent's reasoning for each decision it has taken so far.",
  ], a: [0, 1],
  e: "La summarization progressiva rischia di ridurre importi, date e aspettative del cliente a frasi vaghe: i fatti transazionali (importo promesso, numero d'ordine, scadenza attesa) vanno in un blocco persistente. Lo stato emotivo parafrasato non è un fatto su cui agire; gli output grezzi dei tool riempiono il contesto in modo sproporzionato; il ragionamento passato aggiunge rumore." });

Q({ id: "x1-22", s: 1, d: 5, t: "5.1", sim: 1,
  q: "The `billing` subagent returns findings as short prose such as 'A $42.00 credit was applied.' The `resolution` agent then tells a customer that this credit covers the current dispute, although it was issued three months earlier for a different order. What change is most effective?",
  o: [
    "Require the `billing` subagent to return structured findings that carry their metadata (order ID, date issued, source system) next to each amount.",
    "Instruct the `resolution` agent to double-check every amount against the conversation before it mentions the amount to the customer in its reply.",
    "Have the coordinator ask the `billing` subagent a follow-up question about the date and the order of each credit before every single handoff to `resolution`.",
    "Ask the `billing` subagent to write longer prose summaries that describe each credit in as much detail as it can manage.",
  ], a: [0],
  e: "Per una sintesi corretta a valle i subagenti devono includere nei loro output strutturati i metadati (date, ordine, fonte) accanto a ogni valore. Il controllo richiesto al writer non ha dati con cui verificare; una domanda di follow-up per ogni credito aggiunge giri e non è sistematica; la prosa più lunga resta ambigua e non garantisce date né ordini." });

Q({ id: "x1-23", s: 1, d: 5, t: "5.2", sim: 1,
  q: "A customer who has lost access to their email wants a refund, has no order number, and cannot provide any other identifier. `get_customer` finds no match for the name and phone number given. After four attempts to collect identifiers, the agent is still asking the same questions. What should the agent do?",
  o: [
    "Escalate to a human with a structured handoff, because it cannot make meaningful progress toward verifying the customer on its own.",
    "Keep requesting identifiers until the customer supplies one that matches, since verification must finish before any escalation, however many attempts that takes.",
    "Match the name against the closest records and proceed with the most likely account, so the customer is not left waiting.",
    "End the conversation politely and ask the customer to contact the company again once they have an order number.",
  ], a: [0],
  e: "L'incapacità di fare progressi è un trigger di escalation appropriato: l'agente non può verificare l'identità e continuare a chiedere non porta a nulla. Procedere con il record più vicino è un'euristica che porta a identificare male l'account; chiudere la conversazione lascia il cliente senza una via di uscita." });

Q({ id: "x1-24", s: 1, d: 5, t: "5.2", sim: 1,
  q: "After a system prompt rule 'escalate whenever the customer mentions a lawyer, a chargeback or cancelling' was added, escalations rose 40%. Many customers say 'cancel' about a subscription the agent can cancel itself, while a real policy exception that used none of those words was resolved wrongly. What should you change?",
  o: [
    "Replace the keyword triggers with explicit criteria (human requested, policy exception or gap, no progress) and few-shot examples of escalating versus resolving.",
    "Extend the keyword list with more terms such as 'sue', 'dispute' and 'complaint', so that the exceptions without the old words are caught as well, and review the list monthly.",
    "Keep the keyword rule and add a sentiment detector that escalates when negative sentiment is high, to catch exceptions that use no keyword, and tune the sentiment threshold each month.",
    "Keep the keyword rule and ask the agent to report a confidence score, escalating whenever it falls below the team's chosen threshold, which is tuned over time.",
  ], a: [0],
  e: "Le istruzioni basate su parole chiave creano associazioni indesiderate: il trigger giusto è la situazione (richiesta di un umano, eccezione o vuoto di policy, impossibilità di avanzare), con criteri espliciti ed esempi few-shot. Più parole chiave ripetono l'errore; il sentiment e la confidenza auto-riportata sono proxy inaffidabili della complessità reale." });

Q({ id: "x1-25", s: 1, d: 5, t: "5.2", sim: 1,
  q: "The returns policy says 'unused items can be returned within 30 days' and does not define 'unused'. A customer wants to return a gadget whose sealed box they opened to check the contents, without ever switching it on. What should the agent do?",
  o: [
    "Escalate to a human, because the policy is ambiguous on whether opening the box counts as use and the agent should not invent the interpretation.",
    "Approve the return, since the customer-friendly reading of 'unused' is the one most consistent with the spirit of a 30-day policy, and it avoids a complaint.",
    "Deny the return, since opening a sealed box is the strictest and safest reading of what 'unused' means for a product with a sealed box.",
    "Ask the customer to describe how the item was handled, and approve if the agent judges the described handling to be light enough.",
  ], a: [0],
  e: "Quando la policy è ambigua o silente sul caso specifico, l'agente escala invece di scegliere un'interpretazione: né approvare né negare per analogia. Chiedere al cliente e giudicare 'abbastanza leggero' significa inventare una soglia che la policy non fissa." });

Q({ id: "x1-26", s: 1, d: 5, t: "5.3", sim: 1,
  q: "To keep errors from reaching customers, a developer wrapped the `get_customer` call so that any backend timeout returns an empty customer object marked successful. The agent now tells returning customers 'I can't find an account under that email' during backend slowdowns and offers to create a new one. What is the right design?",
  o: [
    "Return a structured error (failure type, attempted query, alternatives) for timeouts, keeping an empty successful result only for lookups that truly find no match.",
    "Keep the empty result and add a line to the system prompt telling the agent to be careful when no account is found, since the backend may be slow.",
    "End the conversation with an apology and ask the customer to start over whenever any tool call times out.",
    "Return a generic 'lookup unavailable' status for every failure with no further detail, so the agent is not confused.",
  ], a: [0],
  e: "Un timeout è un fallimento di accesso, non un risultato vuoto valido: nasconderlo come successo fa agire l'agente su un dato falso. Serve un errore strutturato che distingua i due casi, con tipo di errore, query tentata e alternative. L'avviso nel prompt non distingue i casi; terminare tutto è sproporzionato; uno stato generico nasconde il contesto necessario alla decisione." });

Q({ id: "x1-27", s: 1, d: 5, t: "5.3", sim: 1,
  q: "A coordinator resolved two of three issues in a case; the carrier API was down, so the shipping question remains unanswered. The case is escalated to a human with a summary that reads: 'Customer issues addressed; please follow up.' What should the summary have contained?",
  o: [
    "Coverage annotations: which issues were resolved and how, which one is open because the carrier API was unavailable, and what was already attempted.",
    "A longer narrative of everything the agent did in chronological order, without separating resolved from unresolved items.",
    "A statement that all issues were investigated, with the shipping status filled in as 'likely in transit' based on typical delivery times.",
    "Only the unresolved shipping issue, since the two resolved issues need no human attention.",
  ], a: [0],
  e: "Le lacune dovute a fonti non disponibili vanno annotate in modo esplicito, distinguendo ciò che è risolto e supportato da ciò che è aperto, con cosa è stato tentato. Una narrazione cronologica mescola le due cose; riempire lo stato con una stima inventa un dato non verificato; omettere i casi risolti toglie all'umano il quadro per non ripetere il lavoro." });

Q({ id: "x1-28", s: 1, d: 5, t: "5.4", sim: 1,
  q: "An engineer is tracing why some refunds skip the approval step in the support agent's codebase. In phase one, a long main-session exploration identified the three modules involved. For phase two, the main agent spawns one subagent per module to inspect the approval logic. The subagents redo the discovery of the service layout and one of them reports on the wrong module. What should the main agent do?",
  o: [
    "Summarize the phase-one findings (the modules, their roles and the question) and inject that summary into each subagent's initial prompt.",
    "Rely on the subagents inheriting the main session's context, and shorten their prompts to the module name only, since they already know the rest.",
    "Have each subagent read the main session's full transcript from a file before starting its investigation of the module it was given.",
    "Run `/compact` in the main session and re-spawn the subagents with the same short prompts.",
  ], a: [0],
  e: "Prima di lanciare la fase successiva si riassumono i risultati della precedente e si iniettano nel prompt iniziale dei subagenti, che non ereditano il contesto. Affidarsi all'ereditarietà è sbagliato; far leggere il transcript completo consuma il contesto che si voleva preservare; `/compact` riduce il contesto principale ma non dà nulla ai subagenti." });

Q({ id: "x1-29", s: 1, d: 5, t: "5.5", sim: 1,
  q: "Human QA can review about 150 of the 2,500 cases the agent resolves daily. In some cases the order system says 'delivered', the carrier scan says 'returned to sender', and the customer says the parcel never arrived. How should reviewer capacity be directed?",
  o: [
    "Review cases with contradictory or ambiguous source data first, and use the remaining capacity for a stratified random sample of the other cases.",
    "Review the 150 most recent cases, so that reviewers always see the agent's current behavior.",
    "Review the 150 cases with the highest refund amounts, since errors there cost the most, and ignore the rest.",
    "Have the agent re-resolve each contradictory case a second time in the same session, and review only those where its two answers differ.",
  ], a: [0],
  e: "La capacità di revisione limitata va indirizzata ai casi con dati di origine ambigui o contraddittori, tenendo un campionamento casuale stratificato per misurare gli errori e scoprire pattern nuovi. I casi più recenti non sono i più a rischio; i soli importi alti ignorano il resto; la ripetizione nella stessa sessione riproduce il ragionamento già fatto." });

Q({ id: "x1-30", s: 1, d: 5, t: "5.5", sim: 1,
  q: "You want the agent to output a confidence score per case and send low-confidence cases to human review. A labeled validation set shows that cases scored 'high confidence' are 97% correct overall, but only 74% correct for cross-border refund cases. How should you set up routing?",
  o: [
    "Calibrate review thresholds on the labeled validation set by case type, with stricter routing for cross-border refunds even at high reported confidence.",
    "Use one global threshold of 0.9, which the validation set shows matches the 97% overall accuracy, and apply it to every type of case, which is simple to operate.",
    "Trust the reported scores as they are and drop human review for every case that the agent labels as high confidence, whatever its type or amount.",
    "Remove the confidence score and send a random 10% of all cases to review.",
  ], a: [0],
  e: "I punteggi di confidenza vanno calibrati con un set di validazione etichettato e verificati per segmento: la media del 97% nasconde un 74% sui rimborsi internazionali. Una soglia globale e la fiducia cieca nei punteggi ripetono l'errore dell'aggregato; il campione casuale uniforme spreca capacità e ignora il segmento debole già noto." });
