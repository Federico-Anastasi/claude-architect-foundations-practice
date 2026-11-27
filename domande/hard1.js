// Scenario 1 · Customer Support Resolution Agent · hard simulation questions
Q({ id: "h1-01", s: 1, d: 1, t: "1.7", sim: 1, hard: 1,
  q: "Yesterday you worked a three-order case in the named session `case-4471`: the customer was verified, the orders were looked up, the returns policy was retrieved, and a resolution plan was agreed. The customer returns today. The order system's change feed shows exactly one change since yesterday: order 8903 moved from 'in transit' to 'delivered'. Everything else the session found, and the plan built on it, is still valid. The session is about 60 turns long. What should you do?",
  o: [
    "Resume `case-4471` with `--resume` and tell the agent that order 8903 is now delivered, so it re-checks only that order and what depends on it.",
    "Start a new session seeded with a structured summary of the case, because a session holding any outdated tool result is no longer reliable enough to continue.",
    "Resume `case-4471` with `--resume` and say nothing about the change, letting the agent notice the new status when the customer mentions the delivery.",
    "Resume `case-4471` with `--resume` and instruct the agent to repeat every lookup from yesterday before answering, since any stored result may be outdated.",
  ], a: [0],
  e: "Il vincolo decisivo è che cambia un solo record, noto, e tutto il resto (identità, policy, piano) è ancora valido: è il caso in cui conviene riprendere la sessione e comunicare il cambiamento specifico, così l'agente rianalizza solo ciò che ne dipende. Ripartire da un riepilogo è la scelta giusta quando i risultati dei tool sono per lo più obsoleti, non quando ne è obsoleto uno solo e si butterebbe via contesto verificato. Riprendere senza dire nulla lascia nel contesto lo stato 'in transit' come se fosse attuale, e l'agente non ha motivo di metterlo in dubbio. Rifare tutte le ricerche è la riesplorazione completa che la guida chiede di evitare quando si sa esattamente cosa è cambiato." });

Q({ id: "h1-02", s: 1, d: 1, t: "1.3", sim: 1, hard: 1,
  q: "A customer's message contains three issues: (1) a duplicate charge, (2) a damaged item, and (3) the exact refund amount for the damaged item after the restocking fee, which depends on the damage assessment from issue 2. Issues 1 and 2 are independent. The `billing` and `returns` subagents take about 20 seconds each, the `refund_calc` subagent about 5. The coordinator currently spawns one subagent per turn, so the customer waits about 45 seconds. How should the coordinator change to cut latency without hurting correctness?",
  o: [
    "Emit the `billing` and `returns` Task calls in one response so they run in parallel, then spawn `refund_calc` with the damage assessment in its prompt.",
    "Emit all three Task calls in one response and instruct `refund_calc` in its prompt to wait for the damage assessment from the `returns` subagent before calculating.",
    "Let the `returns` subagent invoke `refund_calc` directly as soon as its assessment is ready, while the `billing` subagent runs alongside it in the same step.",
    "Merge the three tasks into one subagent that handles the duplicate charge, the damage and the refund amount in sequence within a single prompt, avoiding coordination overhead.",
  ], a: [0],
  e: "I due compiti indipendenti si lanciano con più chiamate Task nella stessa risposta del coordinatore (circa 25 s invece di 45); il terzo dipende dall'esito del secondo, quindi parte dopo, con la valutazione del danno scritta nel suo prompt, perché i subagent non ereditano contesto. Lanciarli tutti e tre insieme chiedendo di 'aspettare' non funziona: i subagent hanno contesto isolato e non possono leggere l'output di un altro. La chiamata diretta tra subagent salta il coordinatore, che deve restare il punto unico per instradamento, errori e osservabilità. Un unico subagent sequenziale non riduce affatto i 45 secondi e perde la focalizzazione per compito." });

Q({ id: "h1-03", s: 1, d: 1, t: "1.3", sim: 1, hard: 1,
  q: "The coordinator delegates damaged-item claims to a `returns_specialist` subagent with a seven-step prompt ('Step 1: extract the order number from the message. Step 2: look up the order. Step 3: confirm it is within 30 days...'). Customer verification is already enforced by a programmatic prerequisite on `process_refund`. About 15% of claims, such as gifts, marketplace-seller orders and orders split across shipments, do not fit the steps; the subagent follows them anyway and returns an unusable result such as 'order not found'. Which change best fixes this?",
  o: [
    "Rewrite the prompt around the goal (a recommended resolution) and quality criteria (order identified, policy cited, amount stated, open questions listed), letting the subagent choose its steps.",
    "Add a dedicated branch to the procedure for each unusual case seen in the logs, so that gifts, marketplace orders and split shipments each get their own explicit steps and checks.",
    "Turn the seven steps into programmatic gates so that the subagent cannot skip, reorder or improvise on any step of the claim procedure, the way the refund prerequisite works.",
    "Replace the subagent with a fixed chain of three sequential calls (identify the order, check the policy, draft the resolution), each with a narrower and more predictable task.",
  ], a: [0],
  e: "Il guasto è la rigidità: le istruzioni procedurali falliscono sui casi che non prevedono, mentre un obiettivo con criteri di qualità lascia al subagent la capacità di adattarsi (compresi i casi non ancora visti). Aggiungere un ramo per ogni variante noto cura solo i sintomi e lascia scoperte le varianti future. I gate programmatici servono per la conformità, già garantita qui dal prerequisito sul rimborso; irrigidire gli altri passi peggiora il 15% dei casi anomali. Una catena fissa di prompt va bene per flussi prevedibili, mentre qui è proprio la varietà dei reclami a rompere la sequenza." });

Q({ id: "h1-04", s: 1, d: 2, t: "2.3", sim: 1, hard: 1,
  q: "Every customer message must first be turned into a structured intake record (issues listed, identifiers found, urgency) by calling `record_intake` before any other tool runs, because the record feeds the case-facts block. In testing the model skips it about 8% of the time: either it answers a short message in plain text, or it goes straight to `get_customer`. Which configuration fixes this?",
  o: [
    "Force `tool_choice: {\"type\": \"tool\", \"name\": \"record_intake\"}` on the first request after each customer message, then use `\"auto\"` on later requests.",
    "On the first request after each customer message, set `tool_choice` to `\"any\"`, so that the model must call some tool instead of answering in plain text.",
    "Add a prerequisite gate that blocks every other tool until `record_intake` has been called in the current turn, while keeping `tool_choice` on `\"auto\"` throughout.",
    "Expand the `record_intake` description with example messages, including very short ones, and state in the system prompt that it is always the first call of a turn.",
  ], a: [0],
  e: "Servono due garanzie: che il modello chiami un tool (non risponda in testo) e che sia proprio `record_intake`. Solo la selezione forzata le dà entrambe; poi si torna ad `\"auto\"` così il ciclo può terminare con una risposta testuale. `\"any\"` obbliga a chiamare un tool ma lascia scegliere quale: `get_customer` resterebbe possibile e l'intake saltato. Un gate blocca le chiamate sbagliate, ma non può far chiamare un tool a un modello che risponde in testo, quindi il caso del messaggio breve resta scoperto. Descrizioni e prompt più ricchi sono probabilistici e lasciano un tasso di fallimento diverso da zero." });

Q({ id: "h1-05", s: 1, d: 2, t: "2.2", sim: 1, hard: 1,
  q: "The `billing` subagent calls `lookup_order` on a backend that times out briefly about 5% of the time. Logs show that 92% of those timeouts succeed if the same call is repeated within two seconds, while 8% persist for minutes. The tool already returns `isError: true`, `errorCategory: transient` and `isRetryable: true`. Today every such error goes back to the coordinator, which re-delegates; each timeout costs a coordinator turn, and a few customers were told the order system had problems although an immediate retry would have worked. Where should recovery be handled?",
  o: [
    "In the `billing` subagent: retry transient failures briefly with back-off, and return only persistent ones with failure type, attempted query, retries made and partial results.",
    "In the coordinator: keep returning every transient error to it, enriched with failure type, attempted query and partial results, so that it decides on each retry itself.",
    "In the tool: retry indefinitely until the backend answers, so that no error, transient or persistent, ever reaches the subagent or the coordinator.",
    "In the agent loop: classify every `lookup_order` timeout as non-retryable and escalate the case to a human agent with a full structured handoff summary.",
  ], a: [0],
  e: "Per errori transitori che nel 92% dei casi si risolvono subito, il recupero va fatto localmente nel subagent con pochi tentativi limitati, propagando al coordinatore solo ciò che non si risolve, insieme a cosa è stato tentato e ai risultati parziali. Passare ogni errore al coordinatore, anche se ben strutturato, costa un turno per ogni timeout e espone problemi che un retry avrebbe risolto. Un retry infinito nasconde l'8% di guasti che durano minuti e può bloccare la conversazione senza dare al coordinatore alcun contesto. Escalare a un umano ogni timeout è sproporzionato per un errore che quasi sempre passa da solo." });

Q({ id: "h1-06", s: 1, d: 5, t: "5.1", sim: 1, hard: 1,
  q: "To save context you trimmed `lookup_order` results to five return-relevant fields (status, delivery date, item list, return-window end, refund eligibility), and context use dropped by 60%. Since then, in billing disputes the agent tells customers 'I can't see how this was paid' and asks which card they used, although the payment fields exist in the 40+ field record that the tool still returns. What is the best fix?",
  o: [
    "Define the trimmed view per workflow: keep the return fields, add the few payment fields billing disputes need, and still drop warehouse and audit metadata before context.",
    "Stop trimming and append the full record to context, relying on periodic summarization of older turns to keep the context size under control as conversations grow.",
    "Keep the five-field view and add a system prompt rule telling the agent to ask the customer for payment details whenever the order record it sees lacks them or looks incomplete.",
    "Keep returning the full record but tell the agent in the system prompt to ignore every field outside the return-relevant ones unless the customer mentions a payment.",
  ], a: [0],
  e: "Il taglio dei campi era giusto nel principio ma troppo stretto: i campi 'rilevanti' vanno definiti rispetto a tutti i flussi che l'agente gestisce, quindi si aggiungono i pochi campi di pagamento e si continua a scartare metadati di magazzino e audit prima che entrino nel contesto. Tornare al record completo reintroduce lo spreco e affida i numeri a riassunti progressivi, che tendono a perderli. Chiedere i dati al cliente cura il sintomo e peggiora l'esperienza, perché l'informazione esiste già. Una regola nel prompt che dice di ignorare i campi non li toglie dal contesto: i token restano consumati." });

Q({ id: "h1-07", s: 1, d: 5, t: "5.2", sim: 1, hard: 1,
  q: "Your agent may approve replacements or refunds up to $500 on its own for items damaged in transit when the customer provides photos (cosmetic damage is covered), and may apply the standard shipping credit for late deliveries. The policy also adjusts the price when your own site lowers it within 14 days of purchase. It says nothing about goodwill compensation beyond these remedies. Which TWO of the following situations should the agent hand to a human rather than resolve itself?",
  o: [
    "A customer whose parcel is late writes: 'Skip the credit offer, I want a human agent to handle this.'",
    "A customer with a cracked $120 lamp and clear photos asks, on top of the replacement, for $150 as compensation for the inconvenience.",
    "A customer in capital letters says a $480 vase arrived shattered for the second time, attaches photos and demands a replacement.",
    "A customer bought a jacket six days ago and asks for the price difference now that your own site has lowered its price.",
    "A customer writes for the third time that a parcel is late and says 'this is ridiculous', without asking for a person.",
  ], a: [0, 1],
  e: "Due richieste vanno a un umano: la richiesta esplicita di un operatore va onorata subito, senza prima tentare di risolvere, e il compenso extra non è previsto dalla policy (lacuna), quindi l'agente non deve inventare una regola. Il vaso da $480 con foto è coperto e sotto i $500: il tono arrabbiato non è un criterio di escalation, si riconosce il disagio e si procede. L'adeguamento di prezzo dopo sei giorni è già previsto dalla policy (calo sul proprio sito entro 14 giorni), quindi si risolve da soli anche se somiglia a un 'price matching'. Il cliente irritato per il terzo ritardo non ha chiesto una persona e il credito standard è nelle facoltà dell'agente: si offre la soluzione e si passa a un umano solo se ribadisce." });

Q({ id: "h1-08", s: 1, d: 5, t: "5.5", sim: 1, hard: 1,
  q: "The agent reports a confidence score per case. Using a labeled validation set of 3,000 cases (address changes, order status, returns, billing disputes) you calibrated review thresholds per case type and reduced human review of high-confidence cases to a small sample. Last week the company launched warranty claims, 9% of volume, which can end in a replacement or a payout. The validation set has no warranty cases, and the agent's scores on them are mostly above 0.9. Your launch rule is that no case type is auto-resolved without measured accuracy for that type. How should warranty claims be routed?",
  o: [
    "Send all warranty claims to human review while labeled warranty cases accumulate, then calibrate a warranty-specific threshold on them before reducing review.",
    "Apply the existing calibrated thresholds to warranty claims, since the agent's scores were calibrated on a labeled validation set and have proved reliable so far.",
    "Send only warranty claims above $200 to human review, since larger payouts carry the most risk, and let the agent resolve the rest on its own.",
    "Ask the agent to re-rate each warranty claim on a stricter 1-10 scale and send to review only those it scores below 9.",
  ], a: [0],
  e: "La regola di lancio chiede un'accuratezza misurata per tipo di caso, e per la garanzia non esiste alcun dato etichettato: la calibrazione è valida solo per i segmenti su cui è stata fatta, quindi finché non si accumulano casi etichettati si mantiene la revisione umana e poi si calibra una soglia specifica. Riutilizzare le soglie esistenti trasferisce a un segmento nuovo una calibrazione che non lo ha mai visto, e il punteggio alto non prova nulla. Una soglia sull'importo è una regola arbitraria che lascia i casi sotto $200 senza alcuna misura di accuratezza. Un secondo punteggio autodichiarato soffre dello stesso difetto: l'autovalutazione del modello non è un indicatore affidabile senza calibrazione sui dati." });
