// Scenario 1 · Customer Support Resolution Agent · practice pool
Q({ id: "s1-n01", s: 1, d: 1, t: "1.1",
  q: "Your first version of the support agent runs a hard-coded sequence for every conversation: `get_customer`, then `lookup_order`, then a policy check, then `process_refund` or `escalate_to_human`. Customers who only want to change an email address, or who describe a billing dispute with no order attached, run into pointless lookups and dead ends, and first-contact resolution is stuck at 52%. What is the most effective redesign?",
  o: [
    "Run an agentic loop in which Claude picks the next tool from the conversation and the results so far, continuing on 'tool_use' and finishing on 'end_turn'.",
    "Add a classifier that detects the request type and then runs one of five hard-coded tool sequences, each one tailored to a category such as returns, billing or account.",
    "Keep the fixed sequence and tell the model in the system prompt to disregard the output of any step that does not apply to the current request.",
    "Insert a planning call at the start of each conversation that writes a complete tool plan, then execute that plan exactly as written.",
  ], a: [0],
  e: "Le richieste ad alta ambiguità richiedono decisioni guidate dal modello: Claude sceglie il tool successivo in base al contesto e ai risultati ottenuti, il loop prosegue su `tool_use` e termina su `end_turn`. Il classificatore con cinque sequenze e il piano scritto in anticipo restano alberi decisionali pre-configurati che non si adattano a ciò che emerge; ignorare l'output lascia comunque le chiamate inutili, con costi e latenza." });

Q({ id: "s1-n02", s: 1, d: 1, t: "1.3",
  q: "A coordinator verifies the customer with `get_customer` and then delegates a damaged-item claim to a `returns_specialist` subagent through the Task tool, using the prompt 'Handle the damaged-item claim for this customer.' The subagent keeps asking the customer for their name and order number, and in one case it processed a refund against the wrong order. What is the most effective fix?",
  o: [
    "Put the verified customer ID, the order details and the claim description directly in the subagent's prompt, so it starts from what the coordinator learned.",
    "Configure the subagent to read the coordinator's conversation history automatically, so it sees everything the customer has said and every tool result obtained so far.",
    "Give the subagent its own `get_customer` tool and instruct it to verify the customer again before it touches any order.",
    "Extend the subagent's `AgentDefinition` system prompt with a strict rule never to ask the customer for information that is already known.",
  ], a: [0],
  e: "I subagenti hanno contesto isolato: non ereditano la conversazione né la memoria del coordinatore, quindi i risultati già ottenuti vanno inclusi esplicitamente nel prompt di delega. La lettura automatica della history non esiste; ripetere la verifica sul cliente non gli dà l'ordine né la descrizione del reclamo; una regola nel system prompt non può far 'sapere' al subagente dati che non ha ricevuto." });

Q({ id: "s1-n03", s: 1, d: 1, t: "1.4",
  q: "The agent follows the instruction 'verify the customer with `get_customer` before any `process_refund` call' in 99.5% of the 20,000 refund conversations each month. The remaining 100 or so include refunds paid to the wrong account. Engineers argue that 99.5% is good enough to leave the rule in the system prompt. What is the right call?",
  o: [
    "Block `process_refund` programmatically until `get_customer` has returned a verified customer ID, since a prompt rule always leaves some failures.",
    "Keep the rule in the prompt and add few-shot examples of the verification step, which should push compliance close enough to 100% without extra code.",
    "Keep the rule in the prompt and add a daily report of unverified refunds, so support leads can correct each wrong refund the next morning.",
    "Repeat the rule at the beginning and at the end of the system prompt, since placement at both ends improves how reliably it is followed.",
  ], a: [0],
  e: "Quando un errore ha conseguenze economiche, la conformità deve essere deterministica: un prerequisito programmatico non ha il tasso di fallimento non nullo delle istruzioni nel prompt, anche se è solo dello 0,5%. Few-shot e ripetizione riducono il rischio ma non lo azzerano; il report giornaliero interviene dopo che il rimborso è già stato pagato." });

Q({ id: "s1-n04", s: 1, d: 1, t: "1.5",
  q: "Support leads ask that the agent end every reply with a one-line invitation to a satisfaction survey and keep a friendly tone. Measured compliance is 93%, and a missed invitation has no financial or legal consequence. An engineer proposes a programmatic check on every outgoing reply that blocks it and forces regeneration until the invitation is present. What is the most proportionate approach?",
  o: [
    "Keep the requirement in the system prompt with two or three few-shot examples of correct endings, and use hooks only where a miss has real cost.",
    "Add the programmatic check on every outgoing reply, since any rule the agent can break should be enforced deterministically, whatever the cost of breaking it.",
    "Add a second Claude instance that reviews each draft reply and rewrites it whenever the invitation or the friendly tone is missing.",
    "Implement a `PostToolUse` hook that appends the survey line to every tool result, so the model copies it into its final answer.",
  ], a: [0],
  e: "I hook e i gate programmatici servono dove serve conformità garantita (rimborsi, identità, compliance). Per una preferenza di stile senza conseguenze, il prompt con qualche esempio few-shot è la risposta proporzionata: il 93% si migliora senza infrastruttura. Il controllo su ogni messaggio in uscita e il secondo revisore sono sovra-ingegneria; un hook PostToolUse trasforma risultati di tool, non garantisce il testo finale." });

Q({ id: "s1-n05", s: 1, d: 1, t: "1.5",
  q: "A hook blocks every `process_refund` call above $500 and returns only the text 'Blocked'. In the logs the agent either retries the same call, splits the refund into two smaller calls, or tells the customer that a technical problem occurred. What should the hook return instead?",
  o: [
    "A result stating that the refund exceeds the $500 automatic limit, that it must not be retried, and that the case should go to `escalate_to_human`.",
    "A transient error, so the agent waits and tries the same refund again later, in case an approver has raised the limit in the meantime or the check misfired.",
    "A success response noting that the refund is pending, so the conversation can continue without confusing the customer.",
    "An exception that terminates the agent loop, so a human takes over the whole conversation from the very beginning.",
  ], a: [0],
  e: "Un hook che blocca una chiamata deve anche reindirizzare: spiegare che è una violazione di policy, non ritentabile, e indicare il workflow alternativo (escalation). 'Blocked' non dà al modello nulla su cui basare una decisione. Segnalare un errore transitorio invita a ritentare; la finta riuscita nasconde il blocco; terminare il loop scarta il contesto già costruito." });

Q({ id: "s1-n06", s: 1, d: 1, t: "1.6",
  q: "Only 62% of cases are resolved on first contact and you must find out why. You have 4,000 escalated conversations from last month and no existing taxonomy of causes. Which investigation plan fits best?",
  o: [
    "Map the escalations first (group a sample by trigger and tool involved), rank the groups by volume and impact, then plan deep dives that adapt to each finding.",
    "Define a fixed chain of five steps (policy gaps, tool errors, tone, routing, latency) and run every step across all 4,000 conversations, always in the same order.",
    "Place all 4,000 conversations in a single prompt and ask Claude to list the root causes in order of importance.",
    "Summarize each conversation independently in a loop and report the collected summaries as findings, without comparing them to each other.",
  ], a: [0],
  e: "Per un'indagine aperta senza tassonomia si usa una decomposizione adattiva: prima si mappa la struttura, si individuano le aree ad alto impatto, poi si costruisce un piano prioritario che cambia con ciò che si scopre. Una catena fissa presuppone di conoscere già le cause; un prompt unico con 4.000 conversazioni diluisce l'attenzione; riassumere una per una senza confronto non produce cause." });

Q({ id: "s1-n07", s: 1, d: 1, t: "1.2",
  q: "A coordinator delegates to `billing`, `shipping` and `returns` subagents and currently invokes all three on every message. Most messages ('Where is my order?') touch a single area, so two of every three subagent runs produce nothing useful and the cost per case is triple that of the single-agent prototype. What is the best change?",
  o: [
    "Have the coordinator analyze each message first and invoke only the subagents the request needs, handling simple single-area questions with one.",
    "Merge the three subagents into one agent that holds all of their tools, which removes the delegation overhead and the need to decide which subagent to call.",
    "Instruct each subagent to answer 'not applicable' immediately whenever a request falls outside its own area.",
    "Run the three subagents in parallel for every message and ignore the results of those that find nothing relevant.",
  ], a: [0],
  e: "Il coordinatore deve decidere dinamicamente quali subagenti invocare in base alla complessità e al contenuto della richiesta, invece di far passare tutto dall'intera pipeline. Un agente unico con tutti i tool peggiora la selezione degli strumenti; il 'non applicabile' costa comunque una chiamata per ciascun subagente; la parallelizzazione riduce la latenza ma lascia invariato il costo sprecato." });

Q({ id: "s1-n08", s: 1, d: 1, t: "1.2",
  q: "To cut latency, an engineer lets the `billing` subagent call the `shipping` subagent directly when it needs a delivery date. Since then, when the shipping lookup fails the billing subagent silently proceeds without a date, nobody can trace which subagent asked what, and errors are handled differently on the two paths. What should you do?",
  o: [
    "Route all subagent communication through the coordinator, which fetches the delivery date and applies the same error handling and logging to every handoff.",
    "Keep the direct calls and add a shared log file that both subagents write to, so that every interaction can be reconstructed from the log after the fact.",
    "Keep the direct calls and add an instruction to the billing prompt on how to proceed when the shipping lookup returns no date, such as telling the customer.",
    "Give the `billing` subagent the tools of the `shipping` subagent so that it can look up delivery dates without delegating.",
  ], a: [0],
  e: "Nell'architettura hub-and-spoke il coordinatore gestisce ogni comunicazione tra subagenti: così osservabilità, gestione uniforme degli errori e controllo del flusso informativo restano in un solo punto. Un log condiviso o un'istruzione nel prompt non rendono uniforme la gestione degli errori; dare a `billing` i tool di `shipping` gonfia il suo set di strumenti fuori dalla sua specializzazione." });

Q({ id: "s1-n09", s: 1, d: 2, t: "2.1",
  q: "After a system prompt update, the agent calls `escalate_to_human` for simple questions such as 'How long do refunds take?'. The tool descriptions did not change and state clearly that escalation is for policy exceptions, explicit human requests, or stalled cases. The update added the line: 'For anything involving refunds or money, make sure the customer gets the right level of support.' What is the most likely cause and fix?",
  o: [
    "The line associates refund and money topics with escalation; reword it so it no longer keys on those words and points to the explicit escalation criteria.",
    "The `escalate_to_human` description is still too short; add more example queries showing when the tool should not be called, such as simple refund questions.",
    "The model defaults to the most conservative tool; set `tool_choice` to 'auto' explicitly so it stops preferring escalation for money topics.",
    "The agent lacks examples of simple refund questions; add few-shot examples of such questions answered directly and keep the new line unchanged.",
  ], a: [0],
  e: "Le istruzioni del system prompt sensibili a parole chiave possono creare associazioni indesiderate e prevalere su descrizioni di tool ben scritte: il problema è comparso con la modifica del prompt, quindi va rivista quella frase. Le descrizioni erano già chiare; `tool_choice` 'auto' è già il comportamento normale; i few-shot curano il sintomo lasciando la causa." });

Q({ id: "s1-n10", s: 1, d: 2, t: "2.2",
  q: "The agent calls `lookup_order` with 'ORD 8841' when the backend expects 'ORD-8841'. The tool returns `isError: true` with the text 'Operation failed', and the agent tells the customer the order system is down. How should the tool report this failure?",
  o: [
    "As a validation error whose message states the expected format ('ORD-' followed by digits), so the agent can correct the input and call again.",
    "As a transient error, so the agent repeats the same call after a short delay in case the backend was momentarily unavailable or overloaded.",
    "As a successful call with an empty result set, since no order matches a malformed number.",
    "With the text 'Operation failed (HTTP 400)', so the agent can infer the category of the problem from the numeric status code that is returned.",
  ], a: [0],
  e: "Un errore di validazione va segnalato come tale, con un messaggio azionabile (il formato atteso): l'agente corregge l'input e riprova, senza dare la colpa al sistema. Marcarlo come transitorio porta a ripetere la stessa chiamata sbagliata; un risultato vuoto 'riuscito' nasconde il problema; un codice HTTP nel testo lascia al modello l'interpretazione." });

Q({ id: "s1-n11", s: 1, d: 2, t: "2.2",
  q: "Which TWO `lookup_order` failures should the tool flag as retryable, meaning that repeating the same call unchanged may well succeed?",
  o: [
    "The order database does not answer within the configured timeout.",
    "The order service replies that it is temporarily unavailable.",
    "The order number is malformed and does not match the expected pattern.",
    "The agent is not authorized to view an order that belongs to another customer.",
    "The order sits on a closed account that policy treats as not viewable.",
  ], a: [0, 1],
  e: "Solo gli errori transitori (timeout, servizio temporaneamente non disponibile) possono riuscire se la stessa chiamata viene ripetuta. Un numero malformato è un errore di validazione: serve correggere l'input. L'accesso a un ordine altrui è un errore di permessi, e l'account chiuso è una regola di business: ritentare spreca chiamate e va comunicato o escalato." });

Q({ id: "s1-n12", s: 1, d: 2, t: "2.3",
  q: "The support agent works reliably with its four tools. Product now wants loyalty-program features and proposes adding ten loyalty tools (balances, tiers, transfers, expirations and so on) to the same agent, which would then have fourteen. What is the best design?",
  o: [
    "Create a separate loyalty subagent with its own focused tools, and have the coordinator delegate loyalty requests to it instead of growing the support agent's tool list.",
    "Add all ten tools to the support agent and compensate with a detailed system prompt section explaining when each of them should be used.",
    "Add all ten tools to the support agent and write a long description for each, since detailed descriptions remove the effect of a larger tool count.",
    "Add three combined loyalty tools that each hide several operations behind an `action` parameter, keeping the agent's total at seven tools.",
  ], a: [0],
  e: "Troppi tool in un solo agente (14 invece di 4-5) peggiorano l'affidabilità della selezione: le nuove funzioni vanno a un subagente specializzato con tool mirati, mentre il coordinatore delega. Più prompt o descrizioni più lunghe non tolgono la complessità della decisione; tool combinati con un parametro `action` ricreano tool generici e ambigui." });

Q({ id: "s1-n13", s: 1, d: 2, t: "2.4",
  q: "Before answering a returns question, the agent typically spends three or four tool calls browsing and searching to discover which policy documents exist (returns, warranty, shipping exceptions) and where they sit in the policy hierarchy. This adds latency, and it sometimes picks an outdated document. What is the best way to give it that visibility?",
  o: [
    "Expose the policy documentation hierarchy as an MCP resource, so the agent sees what exists up front without exploratory tool calls.",
    "Paste the full text of every policy document into the system prompt, so the agent never has to search for anything.",
    "Add few-shot examples showing the search sequence that finds each kind of policy document in the fewest calls.",
    "Combine the existing search tools into one `find_policy` tool with a longer description of the policy folders, so every lookup goes through it.",
  ], a: [0],
  e: "Le risorse MCP servono a esporre cataloghi di contenuti (gerarchie di documentazione, schemi) in modo che l'agente ne veda l'esistenza senza chiamate esplorative. Incollare tutti i documenti nel prompt consuma contesto inutilmente; i few-shot accorciano la ricerca ma non la eliminano; un tool unico lascia comunque la scoperta a chiamate durante la conversazione." });

Q({ id: "s1-n14", s: 1, d: 5, t: "5.1",
  q: "A customer raises three issues in one 30-turn conversation: a duplicate charge on order 8841, a damaged lamp from order 8903, and a late parcel on order 8950. By the end, the agent applies the $42.00 credit meant for the late parcel to the damaged lamp and mixes up the order numbers in its closing summary. What is the most effective fix?",
  o: [
    "Persist structured issue records (issue, order ID, amount, status) in a separate context layer included in every prompt, outside the summarized history.",
    "Add a line to the system prompt telling the agent to double-check order numbers and amounts before every tool call it makes during the conversation.",
    "Split the conversation into three independent sessions, one per issue, and send the customer three separate replies, one when each session finishes with its own result.",
    "Ask the agent to restate every order number and amount at the end of each reply, so the facts always remain visible in the recent history.",
  ], a: [0],
  e: "Nelle sessioni con più problemi i dati transazionali di ciascuno vanno estratti in uno strato di contesto strutturato e separato, riportato in ogni prompt: non si perdono con la summarization e non si confondono tra problemi. Un controllo richiesto nel prompt è probabilistico; tre sessioni perdono il contesto condiviso (cliente già verificato); ripetere i dati nelle risposte li lascia dentro la history che viene riassunta." });

Q({ id: "s1-n15", s: 1, d: 5, t: "5.1",
  q: "Before replying to a complex case, the coordinator concatenates the outputs of six subagents (billing, shipping, returns, warranty, prior tickets, policy) into one long input for the `resolution_writer`. Draft replies consistently miss the warranty finding that the item is still covered, which sits in the middle of the input. What is the most effective change?",
  o: [
    "Put a short summary of the key findings at the start of the input and give each subagent's detailed output its own labeled section.",
    "Instruct the `resolution_writer` in its system prompt to read the whole input slowly, in order and with equal care, before drafting any reply.",
    "Repeat the full text of every subagent output a second time at the end of the input, so each finding appears twice.",
    "Order the six outputs alphabetically by subagent name, so that the position of every finding is predictable.",
  ], a: [0],
  e: "Il modello elabora in modo affidabile l'inizio e la fine di input lunghi ma può omettere ciò che sta nel mezzo (effetto 'lost in the middle'): si mitiga mettendo in testa un riepilogo dei risultati chiave e organizzando i dettagli con intestazioni di sezione esplicite. Un'istruzione di lettura attenta non cambia l'effetto di posizione; raddoppiare il testo spreca token; l'ordine alfabetico non risolve la posizione." });

Q({ id: "s1-n16", s: 1, d: 5, t: "5.2",
  q: "You added explicit escalation criteria and five few-shot examples, and first-contact resolution improved. The agent still mishandles borderline cases: it grants a request for a replacement beyond warranty as a goodwill gesture and escalates a damaged item that has clear photos. All five examples are obvious (an explicit human request, a request the policy does not cover, and three trivial resolutions). What should you change?",
  o: [
    "Replace them with two to four examples of ambiguous cases, each explaining why escalation or resolution was chosen over the plausible alternative.",
    "Keep the five examples and escalate automatically any case that the agent itself considers borderline.",
    "Add thirty more obvious examples, so the model sees each category more often before it reaches a borderline case.",
    "Attach a self-reported confidence score to each example and instruct the agent to escalate whenever its confidence is below 7 out of 10 for the case at hand.",
  ], a: [0],
  e: "I few-shot più utili sono pochi esempi mirati sui casi ambigui, con il ragionamento che spiega perché si è scelta un'azione rispetto all'alternativa plausibile: così il modello generalizza il giudizio. Esempi ovvi non insegnano nulla sul confine; escalare tutto ciò che sembra dubbio riduce la risoluzione al primo contatto; la confidenza auto-riportata è un proxy inaffidabile." });

Q({ id: "s1-n17", s: 1, d: 5, t: "5.2",
  q: "Which TWO of these requests should the agent escalate instead of resolving on its own?",
  o: [
    "A customer asks for a refund after the 30-day return window closed, citing a hospital stay, a circumstance the policy does not address.",
    "A customer asks to transfer a store-credit balance to a family member's account, and the policy does not mention credit transfers.",
    "A customer returns five items from three orders and needs partial refunds on four of them, all within the standard policy.",
    "A customer writes in capital letters that this is the worst service ever and asks for the status of an order that shipped yesterday.",
    "A customer reports a damaged item and attaches clear photos, a case covered by the standard damage-replacement policy.",
  ], a: [0, 1],
  e: "Si escala quando la policy è silenziosa o non prevede l'eccezione richiesta (finestra di reso superata per motivi medici, trasferimento di credito): l'agente non deve inventare regole. Un caso complesso ma interamente coperto dalla policy (reso su cinque articoli) o un danno documentato si risolvono in autonomia, e il tono arrabbiato su una richiesta di stato non indica complessità." });

Q({ id: "s1-n18", s: 1, d: 5, t: "5.3",
  q: "A customer message contains three issues, and the coordinator delegates each to a subagent. The `shipping` subagent cannot reach the carrier API even after its own retries, while the `billing` and `returns` subagents succeed. What should the shipping subagent return, and what should the coordinator do?",
  o: [
    "Return the failure type, the query attempted, partial results and alternatives; the coordinator resolves the other two issues and reports shipping as pending.",
    "Return a 'shipping unavailable' status; the coordinator abandons the case and escalates all three issues to a human, including the two that succeeded.",
    "Return an empty shipping result marked successful; the coordinator completes the reply and tells the customer that there are no shipping problems on any order.",
    "Raise the exception to a top-level handler that stops the whole run, and ask the customer to send the message again later.",
  ], a: [0],
  e: "Un errore strutturato (tipo di fallimento, query tentata, risultati parziali, alternative) permette al coordinatore di decidere: proseguire con ciò che funziona e segnalare il resto come in sospeso. Lo stato generico nasconde il contesto e porta a scartare lavoro valido; il risultato vuoto 'riuscito' sopprime l'errore e fa dichiarare cose non verificate; fermare tutto per un solo guasto è sproporzionato." });

Q({ id: "s1-n19", s: 1, d: 5, t: "5.4",
  q: "A coordinator handles a three-issue case with subagents. The process crashes after the `billing` subagent issued a $42.00 credit but before the `shipping` subagent finished. On restart the case is replayed from the customer's original message, the agent re-investigates everything, and it offers the credit a second time. What design prevents this?",
  o: [
    "Have each agent export its state (steps done, credits issued, case facts) to a known location, and have the coordinator load that manifest on restart and inject it into the prompts.",
    "Add a system prompt instruction telling the agent to check carefully whether a credit might already have been issued for this case before it offers any credit to the customer again.",
    "Save the full raw transcript of the crashed run and ask the new run to read all of it before it does anything else.",
    "Run the three subagents one after the other instead of in parallel, so that a crash can lose at most one subagent's work.",
  ], a: [0],
  e: "Per il recupero dopo un crash ogni agente esporta il proprio stato in un luogo noto e il coordinatore carica un manifest al riavvio, iniettandolo nei prompt: l'agente sa cosa è già stato fatto. Un'istruzione nel prompt non ha dati su cui basarsi; leggere un transcript grezzo è verboso e inaffidabile; l'esecuzione sequenziale non conserva alcuno stato." });

Q({ id: "s1-n20", s: 1, d: 5, t: "5.5",
  q: "A weekly QA review of 500 randomly sampled auto-resolved cases shows 96% correct resolutions, and leadership wants to cut human QA completely. Broken down by case type, the sample shows 99% on address changes and order status but 71% on refund-exception and billing-dispute cases, which make up 12% of volume. What should you do?",
  o: [
    "Keep human review for refund-exception and billing-dispute cases, analyze accuracy by case type, and cut review only for segments that prove consistently accurate.",
    "Cut QA as planned, since 96% overall is above the quality target and the weak segment represents only a small share of the total case volume, which leadership can accept.",
    "Keep QA at the current level for all case types until the overall accuracy reaches 99%, and only then cut it completely for every case type.",
    "Have the agent report a confidence score for each case and drop human review wherever it reports more than 90%, since its own reports are good enough.",
  ], a: [0],
  e: "Una metrica aggregata può nascondere prestazioni scarse su segmenti specifici: prima di ridurre la revisione umana si verifica l'accuratezza per tipo di caso (e campo). Il 96% complessivo copre un 71% su casi costosi; attendere il 99% complessivo non tratta i segmenti separatamente; la confidenza auto-riportata non calibrata non è una base per eliminare i controlli." });
