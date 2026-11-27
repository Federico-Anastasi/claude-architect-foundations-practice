// Scenario 6 · Structured Data Extraction · simulation pool
Q({ id: "x6-01", s: 6, d: 4, t: "4.1", sim: 1,
  q: "Your extraction pipeline emits three types of review flags. Last month: `amount_mismatch`, 900 raised, 8% dismissed as wrong; `bank_details_changed`, 300 raised, 72% dismissed; `missing_tax_id`, 500 raised, 12% dismissed. Reviewers have started approving flags in bulk without reading them, including real `amount_mismatch` ones. What should you do first?",
  o: [
    "Temporarily disable `bank_details_changed` while you rewrite its criteria, so that reviewers regain trust in the accurate flags.",
    "Keep all three flags and add one line to the prompt asking the model to be more conservative in every one of the three categories.",
    "Disable `amount_mismatch`, because it raises the most flags and so contributes the most to the reviewers' daily workload and fatigue.",
    "Attach a model-reported confidence to every flag and hide those below 0.7 across all three flag types, to reduce the volume.",
  ], a: [0],
  e: "Una categoria con molti falsi positivi (qui `bank_details_changed`, 72% scartate) mina la fiducia anche nelle categorie accurate: si disattiva temporaneamente mentre si migliorano i suoi criteri. Disattivare `amount_mismatch` solo perché è la più numerosa elimina un segnale accurato; chiedere genericamente più prudenza o filtrare per confidenza non corregge la categoria difettosa." });

Q({ id: "x6-02", s: 6, d: 4, t: "4.1", sim: 1,
  q: "The extraction schema has a `conflict_detected` boolean meant to mark documents whose source data is inconsistent. The prompt says 'Set conflict_detected when something looks off.' It is true for 35% of documents, mostly ones where an optional field is merely missing or an address is abbreviated, and reviewers now ignore it. Which rewrite of the instruction most improves precision?",
  o: [
    "'Set it to true only when the document states two different values for the same field; a missing or abbreviated value is not a conflict.'",
    "'Set conflict_detected only when you are highly confident that the document is inconsistent, and leave it false in every other case.'",
    "'Set conflict_detected conservatively, and prefer false whenever you are in doubt about whether the document is really inconsistent.'",
    "'Set conflict_detected whenever the extraction would need a human's judgment before it can be trusted for downstream use or posting.'",
  ], a: [0],
  e: "Un criterio esplicito e categoriale ('due valori diversi dichiarati per lo stesso campo; assenza o abbreviazione non contano') definisce cosa segnalare e cosa no. 'Solo se molto sicuro' e 'sii conservativo' sono istruzioni generiche che non migliorano la precisione, e 'quando serve un giudizio umano' resta vago e riproduce il problema." });

Q({ id: "x6-03", s: 6, d: 4, t: "4.2", sim: 1,
  q: "Your prompt contains a 14-item list of vendor-specific layout rules ('Acme: the total is in the bottom-right box', 'Borealis: the PO number is in the header'). It handles those vendors but fails on every newly onboarded vendor, and the list grows each month. What is the most effective way to improve handling of vendors you have not seen?",
  o: [
    "Replace the rule list with 3-4 diverse examples showing how the total and PO number are found in different layouts, with the reasoning.",
    "Keep adding a rule to the list for each new vendor as soon as it fails, and review the whole list every quarter to remove obsolete rules.",
    "Add a regular-expression pre-processing step that locates the total and the PO number before the model sees the document, for every vendor.",
    "Add an instruction that unknown layouts must be handled by analogy with the closest vendor in the existing list of fourteen rules.",
  ], a: [0],
  e: "Esempi diversi che mostrano il ragionamento permettono al modello di generalizzare a layout nuovi, mentre un elenco di regole copre solo i casi previsti. Aggiungere una regola a ogni fallimento è inseguire il problema; l'analogia con il fornitore più vicino è un'istruzione vaga; un pre-processing con espressioni regolari è fragile e va rifatto per ogni layout." });

Q({ id: "x6-04", s: 6, d: 4, t: "4.2", sim: 1,
  q: "Your resume-parsing pipeline raises `date_inconsistency` whenever two jobs overlap. It fires on 45% of resumes, mostly legitimate concurrent part-time or board roles, while genuine problems (an end date before the start date, two full-time roles overlapping for years) are buried. What is the most effective prompt change?",
  o: [
    "Add few-shot examples contrasting acceptable overlaps (not flagged) with genuine inconsistencies (flagged), each with a short reason.",
    "Instruct the model to flag an inconsistency only when it is highly confident that the inconsistency is genuine and would matter to a recruiter.",
    "Add a rule that overlaps shorter than six months are never flagged, regardless of the roles or the employers involved in the overlap.",
    "Run a second Claude call over each flagged resume to decide whether the flag was justified before the resume reaches a human reviewer.",
  ], a: [0],
  e: "Esempi few-shot che contrappongono pattern accettabili (incarichi concorrenti legittimi) a incoerenze reali, con il motivo, riducono i falsi positivi e permettono di generalizzare. Segnalare 'solo se molto sicuro' non modifica il criterio; una regola fissa di sei mesi scarta anche errori reali brevi; una seconda chiamata per ogni segnalazione aggiunge costo senza risolvere la definizione." });

Q({ id: "x6-05", s: 6, d: 4, t: "4.2", sim: 1,
  q: "`warranty_period` is a nullable string in your product-datasheet schema, and the prompt says 'Use null if the datasheet does not mention a warranty.' Even so, about 9% of outputs for datasheets without any warranty text contain '12 months', apparently inferred from typical industry practice. What is the most effective next step?",
  o: [
    "Add few-shot examples of datasheets without warranty text, showing `warranty_period` returned as null even though a typical default is plausible.",
    "Add a validation rule that rejects '12 months' as a warranty value and retries the extraction whenever that value appears in an output.",
    "Repeat the null instruction in capital letters at the top and at the bottom of the prompt to give it much more weight in the model's reading of the datasheet.",
    "Lower the temperature to zero so that the model stops filling in typical values for fields that the datasheet leaves out of its text.",
  ], a: [0],
  e: "Quando l'istruzione da sola non basta, esempi few-shot di schede senza garanzia con `warranty_period` null dimostrano che il valore tipico plausibile non va usato, e riducono le allucinazioni in estrazione. Vietare '12 months' copre solo quel valore; ripetere la regola in maiuscolo è ancora probabilistico; abbassare la temperatura non elimina l'inferenza dalla pratica tipica." });

Q({ id: "x6-06", s: 6, d: 4, t: "4.2", sim: 1,
  q: "With `tool_choice: any` and separate tools `extract_invoice` and `extract_credit_note`, Claude must call a tool but sometimes picks the wrong one for pro-forma invoices and 'invoice correction' documents, which resemble both types. The tool descriptions are already clear. What is the most effective improvement?",
  o: [
    "Add 2-4 few-shot examples of these borderline documents, each showing which tool is called and why it beats the other.",
    "Force `extract_invoice` with `tool_choice` for all documents, since invoices are far more common than credit notes in the incoming mail.",
    "Merge both tools into one `extract_financial_document` tool with a `document_kind` enum that covers every variant of the two types.",
    "Add a routing layer that classifies each document by keywords before the call and pre-selects the tool that the model must use.",
  ], a: [0],
  e: "Per documenti borderline, il few-shot con 2-4 esempi che mostrano quale tool viene chiamato e perché è la tecnica indicata per la selezione in casi ambigui. Forzare `extract_invoice` per tutti sbaglia le note di credito; unire i tool in uno solo richiede più lavoro di un primo passo; un livello di routing per parole chiave scavalca la comprensione del modello ed è fragile." });

Q({ id: "x6-07", s: 6, d: 4, t: "4.3", sim: 1,
  q: "Your `payment_method` field is an enum with 'card', 'bank_transfer', 'cash' and 'other', plus a `payment_method_detail` string. After three months, 'other' accounts for 11% of documents, and the product team wants to know which new methods deserve their own enum value. What is the best approach?",
  o: [
    "Periodically group the `payment_method_detail` values of 'other' records and promote the frequent ones to new enum values.",
    "Replace the enum with a free-text `payment_method` field so that every payment method is captured exactly as it is written in the document.",
    "Remove 'other' from the enum and force the model to choose the closest of the remaining values for every document it processes.",
    "Let the model propose new enum values in each response and add them to the schema automatically, without a review step.",
  ], a: [0],
  e: "I valori di `payment_method_detail` dei record 'other' sono il segnale per scoprire categorie emergenti: si raggruppano periodicamente e si promuovono i frequenti a valori dell'enum. Il testo libero perde la normalizzazione; eliminare 'other' forza classificazioni sbagliate; far aggiungere valori al modello a ogni risposta rende lo schema instabile e non controllato." });

Q({ id: "x6-08", s: 6, d: 4, t: "4.3", sim: 1,
  q: "To stop Claude from answering in prose, you set `tool_choice: {\"type\": \"any\"}` with the tools `extract_invoice`, `extract_receipt` and `extract_contract`. Now, when a scan is a blank page or a marketing flyer, the output is a plausible but fabricated invoice. What is the best fix?",
  o: [
    "Add a tool such as `flag_unprocessable_document` with a reason enum, so the model has a legitimate response when no schema applies.",
    "Switch to `tool_choice: auto` so that the model can decline unsuitable documents by answering in text, as it did before the change.",
    "Make every field of the three schemas optional so that empty documents simply produce empty records instead of invented values in them.",
    "Add a validation step that retries any extraction with implausible values, up to three times, before accepting the output as valid.",
  ], a: [0],
  e: "Con `any` il modello deve chiamare un tool: se nessuno schema si applica, inventa. Serve una via d'uscita legittima, ad esempio un tool `flag_unprocessable_document` con il motivo. Tornare ad `auto` ripropone le risposte in testo; campi tutti opzionali producono comunque record vuoti spacciati per estrazioni; i retry non servono perché il documento non contiene dati." });

Q({ id: "x6-09", s: 6, d: 4, t: "4.3", sim: 1,
  q: "An agent loop must first run `extract_metadata`, then call `lookup_vendor` and `check_duplicate` using that metadata, and finally return a short text summary. You set `tool_choice: {\"type\": \"tool\", \"name\": \"extract_metadata\"}` on every request in the loop. The agent calls `extract_metadata` again and again and never reaches the later tools. What is the fix?",
  o: [
    "Force `extract_metadata` on the first request only, then send follow-up turns with `auto` so Claude can call the other tools and end with text.",
    "Keep the forced selection and add a system prompt line saying that `extract_metadata` must be called only once per document in the loop.",
    "Switch every request to `any`, so that Claude can choose a different tool on each turn of the loop and is never stuck with one.",
    "Cap the loop at three iterations and merge the repeated metadata calls into a single result before the later tools are called.",
  ], a: [0],
  e: "La selezione forzata garantisce l'ordine se usata sulla prima richiesta; i passi successivi si gestiscono nei turni seguenti con `auto`, così Claude può chiamare i tool di arricchimento e chiudere con il testo. Con `any` ogni turno dovrebbe chiamare un tool e non si arriverebbe mai al riepilogo finale; una riga di prompt è probabilistica; un tetto di iterazioni è un'interruzione arbitraria che non risolve la causa." });

Q({ id: "x6-10", s: 6, d: 4, t: "4.3", sim: 1,
  q: "A single `extract_document` tool has a schema with a `document_type` enum and about 60 optional fields covering invoices, bills of lading and customs forms. Outputs often fill fields from the wrong type (for example `bl_number` on an invoice) and rarely populate all the right ones. What is the most effective redesign?",
  o: [
    "Split it into one tool per document type with a focused schema, and use `tool_choice: any` so Claude picks the matching tool.",
    "Keep the single schema but make all 60 fields required and nullable, so that the model must consider every one of them explicitly.",
    "Keep the single schema and add a paragraph to the prompt listing which fields belong to which `document_type` value in the enum.",
    "Force the single tool and add a post-processing step that clears every field not valid for the detected document type afterwards.",
  ], a: [0],
  e: "Uno schema generico con 60 campi opzionali favorisce la compilazione di campi del tipo sbagliato: meglio un tool per tipo, con schema focalizzato e contratto chiaro, e `any` perché il modello scelga quello giusto. Rendere tutto obbligatorio e nullable aumenta il carico; un elenco nel prompt è probabilistico; la pulizia a valle lascia comunque poco compilati i campi giusti." });

Q({ id: "x6-11", s: 6, d: 4, t: "4.4", sim: 1,
  q: "Your validation-retry loop (follow-up with the document, the failed extraction and the error) fixes 93% of `invoice_date` format failures on the first retry, but none of 400 `tax_id` failures last month, even after three retries each. Retry costs are rising. What should you do?",
  o: [
    "Stop retrying `tax_id` failures (the value is probably absent): allow null and route them to review, but keep retrying date-format errors.",
    "Raise the retry limit for `tax_id` failures from three to eight, since the date errors show that retries work when given enough attempts.",
    "Add the tax-ID format rules in capital letters to the retry feedback for those documents, with two examples of well-formed identifiers.",
    "Remove the retry loop for all fields, because a 0% success rate on one field shows that retries are unreliable and costly overall.",
  ], a: [0],
  e: "I dati dei retry dicono quali errori sono recuperabili: i formati sì (93%), i `tax_id` no, probabilmente perché il valore manca dal documento. Si smette di ritentare quelli, si ammette null e si manda a revisione. Più tentativi, più enfasi o eliminare tutto il loop sono reazioni che ignorano la causa." });

Q({ id: "x6-12", s: 6, d: 4, t: "4.4", sim: 1,
  q: "3% of invoices fail the check that line items sum to the stated total. A sample review shows that in most failures the model misread a digit in one line, while in the rest the printed invoice itself does not add up. Which handling covers both causes?",
  o: [
    "Retry with the document, the failed extraction and the discrepancy; if it persists, keep both totals, set `conflict_detected` and send to review.",
    "Retry repeatedly with the discrepancy in the feedback until the sums match, then keep the last extraction as the final result of the document.",
    "Overwrite `stated_total` with the calculated sum whenever they differ, so that downstream systems always receive a record that is internally consistent.",
    "Reject every invoice that fails the check and ask the vendor to resend a corrected document before any further processing takes place.",
  ], a: [0],
  e: "Due cause diverse: un errore di lettura si corregge con un retry con feedback specifico, mentre un documento che non quadra va conservato con `stated_total`, `calculated_total` e `conflict_detected` e mandato a revisione. Ritentare fino a che le somme tornano spinge il modello a modificare i valori; sovrascrivere il totale dichiarato falsifica la fonte; rifiutare tutto scarica il costo sul fornitore e perde gli errori di lettura recuperabili." });

Q({ id: "x6-13", s: 6, d: 4, t: "4.4", sim: 1,
  q: "Contract end dates are required by validation. For about 6% of master agreements the end date appears only in a separate amendment, which your document store links through `parent_contract_id` but which is not part of the extraction input. Retries with error feedback never succeed for these. What is the most effective fix?",
  o: [
    "Include the linked amendment in the extraction input for these contracts, so the information is actually available to the model.",
    "Retry again with stronger feedback that stresses that the end date must be extracted from the master agreement itself, and add an example.",
    "Make `contract_end_date` nullable and send every such contract to manual review, since the date is not in the input document.",
    "Instruct the model to calculate the end date from the start date and the usual term for that kind of contract in the industry.",
  ], a: [0],
  e: "Il retry non funziona perché l'informazione non è nell'input: va fornita. Se l'emendamento è collegato, lo si include nell'estrazione. Più enfasi nel feedback è inutile; il null con revisione manuale scarta un'informazione disponibile; stimare la data dal tipo di contratto è inventarla." });

Q({ id: "x6-14", s: 6, d: 4, t: "4.4", sim: 1,
  q: "A validation rule requires `shipment_date` on or after `order_date`. About 5% of extractions fail it and exhaust three retries with the same error. Reviewers confirm that, in every failing case, the extracted dates match the documents exactly: these are pre-shipped consignment orders. What should you do?",
  o: [
    "Fix the validation rule to allow this documented case: the extractions are correct, and retrying only invites the model to alter them.",
    "Add the failing dates to the retry feedback together with a note that the shipment date must come after the order date, then retry again.",
    "Increase the retry limit and lower the temperature so that one of the attempts eventually satisfies the validation rule as written.",
    "Instruct the model to swap the two dates whenever `shipment_date` precedes `order_date`, so that the rule is always satisfied.",
  ], a: [0],
  e: "Se le estrazioni coincidono con i documenti, l'errore è nella regola di validazione e va corretta per ammettere il caso reale. Ritentare spinge il modello a cambiare valori corretti: più tentativi, temperatura più bassa o scambio delle date introducono dati falsi." });

Q({ id: "x6-15", s: 6, d: 4, t: "4.5", sim: 1,
  q: "Contracts that exceed the context limit are split into chunks, and each chunk becomes its own request in a Message Batches job. Results must later be reassembled per contract in page order, and a failed chunk must be resubmitted on its own. How should you set `custom_id`?",
  o: [
    "Give each request a unique `custom_id` encoding the contract and chunk number, such as `contract-4821-chunk-03`, and group results by it.",
    "Rely on results being returned in submission order, and keep a local list that maps each position to a contract and a chunk number.",
    "Use the same `custom_id` for all chunks of a contract and tell the model in each prompt which chunk of the contract it is processing.",
    "Submit one batch per contract and use the batch ID as the only identifier, then concatenate its results in the order they are received.",
  ], a: [0],
  e: "`custom_id` è il meccanismo per correlare richieste e risposte: se codifica contratto e numero di chunk, i risultati si raggruppano e si ordinano, e un chunk fallito si reinvia da solo. L'ordine dei risultati non è garantito; lo stesso id per tutti i chunk non permette di distinguerli; un batch per contratto perde i vantaggi del batch e non identifica il singolo chunk." });

Q({ id: "x6-16", s: 6, d: 4, t: "4.5", sim: 1,
  q: "You are about to extract 120,000 archived purchase orders through the Message Batches API. A pilot of the current prompt on 200 representative documents shows 14% of outputs failing validation, mostly for the same two layout quirks. Every failed document would need to be resubmitted in a later batch. What should you do before submitting the full archive?",
  o: [
    "Refine the prompt on the sample until the two quirks are handled, then submit the full archive to maximize first-pass success.",
    "Submit the full archive now and resubmit the failures by `custom_id` in follow-up batches, since every batch costs 50% less.",
    "Submit the full archive through the synchronous API instead, so that each failure can be retried as soon as it is detected.",
    "Split the archive into 600 batches of 200 documents, so that the failures of each batch are smaller and easier to resubmit.",
  ], a: [0],
  e: "Rifinire il prompt su un campione rappresentativo prima di elaborare grandi volumi massimizza il successo al primo passaggio e riduce i costi dei reinvii. Inviare subito e reinviare il 14% (circa 17.000 documenti) moltiplica i giri e il tempo anche con lo sconto; l'API sincrona costa il doppio senza correggere la causa; spezzare in molti batch piccoli non riduce il tasso di errore." });

Q({ id: "x6-17", s: 6, d: 4, t: "4.5", sim: 1,
  q: "A nightly backlog of 200,000 purchase orders has no latency requirement. Today each request lets Claude call `lookup_vendor` mid-request and use the result to complete the record, and you want the Message Batches API's 50% discount. What is the right design?",
  o: [
    "Batch only the extraction, which is a single turn with the schema tool, and match vendors in your own code after the results return.",
    "Submit the current requests unchanged, since batches execute tool calls and feed the results back to the model as the synchronous API does.",
    "Keep the whole workload on the synchronous API, because the Batches API cannot be used with tool-based extraction at all.",
    "Submit the requests with the vendor list pasted from memory, asking Claude to simulate the lookup within a single turn.",
  ], a: [0],
  e: "Il batch non supporta chiamate di tool multi-turno in una singola richiesta, ma l'estrazione con schema è un solo turno: si manda in batch quella e si abbinano i fornitori nel proprio codice. Inviare le richieste invariate non funziona; tenere tutto sincrono rinuncia a un risparmio che qui è disponibile; far simulare il lookup al modello produce dati inventati." });

Q({ id: "x6-18", s: 6, d: 4, t: "4.5", sim: 1,
  q: "Finance wants supplier invoices extracted and posted within 10 hours of arrival to capture early-payment discounts. A colleague proposes the Message Batches API with hourly submissions, noting that batches 'usually finish in a couple of hours'. How should you evaluate this?",
  o: [
    "Reject it for this workload: batches can take up to 24 hours with no latency guarantee, so a 10-hour deadline needs the synchronous API.",
    "Accept it, since hourly submissions keep each batch small and small batches reliably finish within the 10-hour deadline in practice.",
    "Accept it with a fallback: resubmit to the synchronous API every document whose batch has not finished after 8 hours of waiting.",
    "Accept it, and choose the submission frequency so that the wait before submission plus the 24 hours of processing stays under 10 hours.",
  ], a: [0],
  e: "Il Batches API può richiedere fino a 24 ore senza SLA di latenza: una scadenza di 10 ore non si può garantire, e nessuna frequenza di invio lo risolve (24 è già più di 10). È un carico bloccante da servire con l'API sincrona. 'Di solito finiscono presto' non è una garanzia; il ripiego sincrono dopo 8 ore aggiunge complessità inutile quando basta usare l'API giusta fin dall'inizio." });

Q({ id: "x6-19", s: 6, d: 4, t: "4.6", sim: 1,
  q: "Claim files contain 8-12 documents. Your design runs one extraction pass per document, then an integration pass that checks that claimant name, dates and amounts agree across documents. What should the integration pass receive and be asked to do?",
  o: [
    "The structured per-document results, with a task limited to cross-document consistency such as mismatched names, dates and amounts.",
    "All the raw documents again, with the instruction to redo the full extraction and also to check that the documents are consistent.",
    "Only prose summaries of each document, with the instruction to confirm that the claim file looks complete and ready for approval.",
    "The per-document results, with the instruction to resolve any inconsistency by keeping the value that appears most often in them.",
  ], a: [0],
  e: "Il passaggio di integrazione lavora sui risultati strutturati dei singoli documenti e si limita alla coerenza tra documenti (nomi, date, importi): è il compito che i passaggi locali non possono svolgere. Rifare tutta l'estrazione sui documenti grezzi ripropone la diluizione dell'attenzione; riassunti in prosa perdono i dettagli; scegliere il valore più frequente nasconde le incoerenze invece di segnalarle." });

Q({ id: "x6-20", s: 6, d: 4, t: "4.6", sim: 1,
  q: "The extraction step marks `needs_review: true` on 2% of invoices based on its own judgment, yet audits find that 9% of invoices contain a wrong field. You want better review routing without reviewing everything. Which design is most effective?",
  o: [
    "Add an independent verification pass that re-checks each field against the source and reports field confidence, calibrated on labeled data.",
    "Ask the extraction step to be more careful when setting `needs_review`, and add ten examples of documents that should be flagged for review.",
    "Have the extraction step output a confidence for every field in the same call and route anything below 0.9 to human review.",
    "Send every invoice to human review for a month to learn what the model gets wrong, then stop reviewing altogether afterwards.",
  ], a: [0],
  e: "L'autovalutazione di chi ha estratto è poco affidabile (2% segnalato contro 9% errato). Un passaggio di verifica indipendente che ricontrolla ogni campo sulla fonte e produce confidenza a livello di campo, con soglie calibrate su dati etichettati, instrada l'attenzione dove serve. Chiedere più prudenza allo stesso passaggio e usare la sua confidenza non calibrata ripete il problema; rivedere tutto per un mese non produce un criterio di instradamento." });

Q({ id: "x6-21", s: 6, d: 5, t: "5.1", sim: 1,
  q: "A packet-processing agent calls `ocr_page` for each of 40 pages in one conversation. Each result carries word-level bounding boxes, per-character confidences and engine diagnostics, about 6,000 tokens in all, although extraction needs only the page text and table cells. By page 25 the context is crowded and earlier fields are being mis-stated. What is the best fix?",
  o: [
    "Trim each `ocr_page` result to the page text and table cells before it is appended to the conversation context.",
    "Summarize the whole conversation every ten pages and keep only the latest summary in the context for the remaining pages.",
    "Tell the agent in the system prompt to ignore the bounding boxes and diagnostics in each OCR result when it extracts the fields.",
    "Move to a model with a larger context window so that all 40 raw OCR results fit comfortably in a single conversation.",
  ], a: [0],
  e: "I risultati degli strumenti si accumulano nel contesto in modo sproporzionato rispetto alla loro utilità: si riducono ai campi rilevanti (testo e celle) prima di aggiungerli. Un riepilogo periodico rischia di sfumare i valori; un'istruzione di ignorare i campi non toglie i token dal contesto; una finestra più grande non risolve il problema di rilevanza." });

Q({ id: "x6-22", s: 6, d: 5, t: "5.6", sim: 1,
  q: "A review report is generated from consolidated extraction results and contains payment schedules, fees and technical collateral specifications. Reviewers complain that everything is rendered in one uniform format and is hard to use. Which TWO changes make the report easier to read?",
  o: [
    "Present payment schedules and fees as tables.",
    "Present the technical collateral specifications as structured lists.",
    "Present every section as running prose so that the report reads naturally.",
    "Present every section as a table so that all values line up in columns.",
    "Present the whole report as one JSON object so that reviewers can inspect each field.",
  ], a: [0, 1],
  e: "Contenuti diversi vanno resi in forme adatte: dati finanziari in tabelle e specifiche tecniche in elenchi strutturati, invece di convertire tutto in un unico formato. Prosa, sole tabelle o JSON uniformi sacrificano la leggibilità di almeno un tipo di contenuto per i revisori." });

Q({ id: "x6-23", s: 6, d: 5, t: "5.1", sim: 1,
  q: "Section-level extraction workers return prose paragraphs describing the values they found. The merge step has a limited context budget and must combine the results of 15 workers; it often attributes a value to the wrong section and mixes figures from different fiscal years. What change to the workers' output helps most?",
  o: [
    "Have each worker return structured records containing the value, its source location and its date, instead of prose.",
    "Ask the workers to write longer descriptions so that the merge step has the full context of every value they found in their sections.",
    "Have the workers append their full reasoning chains so that the merge step can see how each value was determined.",
    "Give the merge step the original sections as well, so that it can re-derive the values on its own if needed.",
  ], a: [0],
  e: "Quando il contesto del passo a valle è limitato, i sottoagenti devono restituire dati strutturati (valore, posizione della fonte, data) invece di prosa e catene di ragionamento: i metadati evitano attribuzioni sbagliate e confusioni tra anni fiscali. Descrizioni più lunghe, ragionamenti completi o le sezioni originali aumentano proprio il carico di contesto." });

Q({ id: "x6-24", s: 6, d: 5, t: "5.5", sim: 1,
  q: "You sample 60 auto-approved, high-confidence extractions each week. This week, 9 of the 60 contain a wrong `due_date`, and all 9 come from one vendor that has just changed its invoice template; earlier weeks had at most one error per sample. What is the best response?",
  o: [
    "Treat it as a new error pattern: send that vendor's invoices to full review now, fix the prompt for the new layout, and keep sampling.",
    "Lower the global confidence threshold slightly so that more invoices from every vendor reach the reviewers before approval, whichever template they use.",
    "Wait for another week of sampling before acting, since a single weekly sample of 60 is too small to justify any change to the pipeline.",
    "Treat the 9 errors as isolated mistakes, correct those 9 records by hand, and leave the rest of the pipeline and its sampling unchanged.",
  ], a: [0],
  e: "Il campionamento casuale sulle estrazioni ad alta confidenza serve proprio a rilevare pattern nuovi: 9 errori su 60 concentrati in un fornitore indicano un cambio di template. Si instrada quel segmento a revisione, si corregge il prompt (per esempio con esempi del nuovo layout) e si continua a campionare. Una soglia globale più bassa colpisce tutti i fornitori; aspettare lascia passare errori; correggere solo i 9 record ignora il pattern." });

Q({ id: "x6-25", s: 6, d: 5, t: "5.2", sim: 1,
  q: "An expense assistant extracts receipt data and applies the company policy to mark each expense `reimbursable`. The policy covers meals, travel and lodging, and neither lists nor excludes anything else. An employee submits a receipt for a coworking-space day pass. What should the assistant do?",
  o: [
    "Escalate it to a human reviewer with the extracted details, because the policy is silent on this type of expense.",
    "Mark it reimbursable under the closest category, lodging, since both are paid workspace costs and the amounts are comparable.",
    "Mark it not reimbursable, because anything the policy does not cover should be treated as a denied expense by default.",
    "Mark it reimbursable if the model's self-reported confidence in that decision is above 0.8 on a ten-point scale.",
  ], a: [0],
  e: "Quando la policy non copre il caso (né lo elenca né lo esclude) l'agente deve escalare con i dettagli estratti. Assimilarlo all'alloggio è un'estensione arbitraria; negare tutto ciò che non è elencato inventa una regola che la policy non contiene; la confidenza dichiarata non è un proxy affidabile della complessità del caso." });

Q({ id: "x6-26", s: 6, d: 5, t: "5.3", sim: 1,
  q: "While processing a 12-document packet, the OCR service times out on the tax return. The extraction subagent has already extracted the other 11 documents. Which TWO behaviors best support recovery in this multi-agent pipeline?",
  o: [
    "The subagent retries the transient timeout locally and propagates the failure only if the retries do not resolve it.",
    "The propagated error includes the failure type, what was attempted, the 11 completed extractions and possible alternatives such as a re-scan.",
    "The subagent returns the 11 extractions as a complete success and leaves the tax return fields empty.",
    "The subagent aborts the whole packet and returns only a generic 'extraction unavailable' status.",
    "The subagent forwards every OCR error to the coordinator immediately, without any local retry, so that the coordinator controls all recovery.",
  ], a: [0, 1],
  e: "Il sottoagente recupera localmente gli errori transitori e propaga solo quelli irrisolti, con tipo di fallimento, cosa è stato tentato, risultati parziali e alternative: il coordinatore può proseguire con 11 documenti e annotare la lacuna. Restituire successo con campi vuoti sopprime l'errore; un abort con stato generico butta il lavoro e nasconde informazioni; inoltrare ogni errore senza tentativi locali carica il coordinatore di problemi che si risolvevano sul posto." });

Q({ id: "x6-27", s: 6, d: 5, t: "5.5", sim: 1,
  q: "Auto-approval applies to extractions whose field confidence is above the calibrated threshold. A delivery note shows the quantity '120' in print and '102' handwritten next to it. The model reports 0.96 confidence for `quantity = 120` and the record is auto-approved. What should the design do with such cases?",
  o: [
    "Route documents whose source data is contradictory or ambiguous to human review, regardless of the confidence score.",
    "Raise the confidence threshold for `quantity` to 0.99 so that this record would have been routed to human review in the first place.",
    "Instruct the model to always choose the printed value, since typed text is more reliable than handwriting in delivery notes.",
    "Keep auto-approving such records and check them through the periodic random sample of approved extractions in the next review.",
  ], a: [0],
  e: "La confidenza non cattura la contraddizione nella fonte: i documenti ambigui o contraddittori vanno a revisione umana indipendentemente dal punteggio. Una soglia più alta resta una regola sulla confidenza (il modello può essere sicuro di una lettura sbagliata); scegliere sempre la stampa è un'euristica arbitraria; il campionamento serve a misurare l'errore, non a gestire casi noti." });

Q({ id: "x6-28", s: 6, d: 5, t: "5.5", sim: 1,
  q: "You calibrated field-level confidence thresholds on a labeled validation set of 500 documents taken from the cleanest digital PDFs. In production, fields from low-quality scans that the model reports at 0.9 confidence turn out to be wrong 20% of the time. What is the best remedy?",
  o: [
    "Rebuild the labeled set with every document type and quality segment, and calibrate thresholds per segment and field.",
    "Raise the global threshold to 0.97 so that fields from scans reported at 0.9 are always sent to human review from now on.",
    "Keep the thresholds and require the model to add a short note explaining each confidence score it reports for a field.",
    "Keep the thresholds and send every scanned document to human review permanently, whatever its confidence scores are.",
  ], a: [0],
  e: "Un set etichettato non rappresentativo (solo PDF puliti) produce soglie non valide per le scansioni: si ricostruisce con ogni tipo e livello di qualità e si calibra per segmento e campo. Alzare la soglia globale spreca capacità di revisione sui segmenti buoni; una spiegazione della confidenza non la calibra; rivedere sempre tutte le scansioni è una misura grezza che non sfrutta la calibrazione." });

Q({ id: "x6-29", s: 6, d: 5, t: "5.5", sim: 1,
  q: "A labeled-set analysis shows per-field accuracy of `invoice_number` 99.6%, `invoice_date` 99.1%, `total_amount` 98.7% and `bank_account` 81%, consistently across document types. Overall accuracy is 97%, the team's target per field is 98%, and management wants to automate approval. What is the best decision?",
  o: [
    "Automate the fields that meet the 98% target and keep human review for `bank_account`, sampling the automated fields.",
    "Automate every field, since the 97% overall accuracy is close enough to the 98% target to justify removing human review altogether.",
    "Automate every field and rely on the model's reported confidence to catch the weak `bank_account` extractions as they occur.",
    "Keep human review for every field of every document until `bank_account` also reaches the 98% target for the whole pipeline.",
  ], a: [0],
  e: "L'accuratezza aggregata (97%) nasconde il campo debole: si automatizzano i campi che raggiungono l'obiettivo e si mantiene la revisione per `bank_account`, con campionamento continuo sugli altri. Automatizzare tutto in base al dato aggregato, o affidarsi a una confidenza non calibrata, espone proprio il campo critico; tenere tutto in revisione spreca capacità sui campi già affidabili." });

Q({ id: "x6-30", s: 6, d: 5, t: "5.6", sim: 1,
  q: "A consolidated record for a loan applicant merges values extracted from pay stubs, tax returns and bank statements. Reviewers receive a flat list of 60 fields, waste time on values that every source agrees on, and easily miss the few conflicting ones. How should the output be structured?",
  o: [
    "Separate fields on which all sources agree from contested ones, and list every conflicting value with its source and date.",
    "Keep one flat list but attach the single most likely value to each contested field, together with a confidence score for it.",
    "Show reviewers only the contested fields and drop the agreed fields from the stored record to keep the record short and focused.",
    "Convert the whole consolidated record into one narrative paragraph summarizing the applicant's financial position for the reviewer.",
  ], a: [0],
  e: "Un record consolidato che distingue i campi concordi da quelli contestati, con ogni valore in conflitto accompagnato da fonte e data, permette ai revisori di concentrarsi dove serve. Scegliere un solo valore nasconde il conflitto; mostrare solo i contestati perde il record completo; un paragrafo narrativo uniforme cancella la struttura e la tracciabilità." });
