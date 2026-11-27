// Scenario 6 · Structured Data Extraction · practice pool
Q({ id: "s6-n01", s: 6, d: 4, t: "4.1",
  q: "Your contract-analysis pipeline extracts a `risk_clauses` array from vendor agreements. The prompt says: 'List clauses that could be risky for us; be conservative and only include clauses you are confident about.' Reviewers report that about 40% of the listed clauses are routine boilerplate (governing law, notice addresses), while some unusual indemnities are missed. What is the most effective prompt change?",
  o: [
    "Define which clause types to report (uncapped liability, unilateral termination, long-notice auto-renewal) and which to skip, each with a short criterion.",
    "Require a confidence score for every clause and keep only clauses scored 0.9 or higher, so that routine boilerplate is filtered out of the list.",
    "Remove the filtering instruction, extract every clause, and discard the routine ones downstream with a keyword blacklist maintained by the legal team.",
    "Add a closing instruction asking the model to re-read its own list and delete any clause that looks routine, before it gives the final answer to the reviewers.",
  ], a: [0],
  e: "Criteri espliciti e categoriali (cosa riportare e cosa saltare) migliorano la precisione molto più di istruzioni generiche come 'sii conservativo'. Il filtro per confidenza non distingue le clausole standard da quelle insolite, perché la confidenza autodichiarata è un proxy poco affidabile. Estrarre tutto e filtrare con parole chiave non recupera le manleve insolite e rende fragile la pipeline. Chiedere di rileggere e cancellare è un'autorevisione che non fissa nessun criterio." });

Q({ id: "s6-n02", s: 6, d: 4, t: "4.1",
  q: "Your extraction pipeline attaches an `issue_severity` ('blocking', 'warning', 'info') to each data-quality issue it detects, and 'blocking' stops the document from being posted automatically. The same kind of problem, an invoice total that differs from the sum of its line items by a few cents, is labeled 'blocking' on some runs and 'info' on others. What is the most effective fix?",
  o: [
    "Define explicit criteria for each severity level in the prompt, with a concrete example of each (for instance, a mismatch of a few cents is 'info').",
    "Ask the model to report a confidence score with each severity and treat every low-confidence label as 'warning' by default in the pipeline.",
    "Run each document three times and keep the severity label that appears most often across the three runs, to smooth out the inconsistency between runs.",
    "Collapse the scale to two levels, 'blocking' and 'non-blocking', so that there are fewer labels for the model to confuse with one another in borderline cases.",
  ], a: [0],
  e: "Criteri di gravità espliciti con un esempio concreto per ogni livello producono classificazioni coerenti: senza soglie il modello decide caso per caso. La confidenza autodichiarata non è calibrata e non definisce cosa sia 'blocking'. Tre esecuzioni con voto di maggioranza triplicano il costo senza fissare il criterio. Ridurre i livelli a due non dice dove passa il confine, quindi la stessa incoerenza si sposta sulla nuova soglia." });

Q({ id: "s6-n03", s: 6, d: 4, t: "4.2",
  q: "A pipeline extracts ingredient quantities from scanned recipe cards into `quantity_value` (nullable number), `unit`, and `quantity_text` (the original phrase). Cards contain phrases such as 'a handful of walnuts', 'butter the size of an egg' and 'about 2 cups'. Claude often returns a precise-looking number such as 30 for 'a handful', which downstream nutrition calculations treat as measured. The prompt already says 'do not invent quantities'. What is the most effective improvement?",
  o: [
    "Add 3-4 few-shot examples of informal measurements: the phrase is kept in `quantity_text` and `quantity_value` stays null unless the card gives a number.",
    "Repeat the rule 'NEVER estimate quantities' at the top and bottom of the prompt in capital letters so that the model gives the instruction more weight.",
    "Add a second model call that estimates a typical gram weight for each informal measurement, so that the stored values are at least realistic and consistent.",
    "Remove `quantity_value` from the schema and keep only the raw text, leaving all unit conversion to the downstream systems that read the records.",
  ], a: [0],
  e: "Per le misure informali gli esempi few-shot che mostrano l'output corretto riducono le allucinazioni più di una regola già presente nel prompt: il modello vede che per 'una manciata' si conserva il testo e il numero resta null. Ripetere il divieto in maiuscolo resta una richiesta probabilistica. Stimare un peso con una seconda chiamata inventa dati con più cura, ma li inventa. Eliminare il campo numerico butta via la normalizzazione anche per le quantità realmente misurate." });

Q({ id: "s6-n04", s: 6, d: 4, t: "4.2",
  q: "Purchase orders reach your extraction tool in many layouts. When a PO shows only one address, labeled simply 'Address', Claude puts it in `delivery_address` on some runs and in `billing_address` on others, even though the prompt already contains a long, detailed rule about address handling. What is the most effective next step?",
  o: [
    "Add 2-4 few-shot examples of these single-address layouts, each showing the field chosen and a short reason why it was preferred over the alternative.",
    "Add 20 more few-shot examples of typical, unambiguous purchase orders so that the model sees a much wider variety of layouts, address labels and field orders.",
    "Extend the existing address rule with a decision table that covers every combination of labeled and unlabeled addresses found in the past orders reviewed so far.",
    "Replace the two address fields with one required `address` field, and assign billing or delivery in a separate classification call afterwards.",
  ], a: [0],
  e: "Quando le istruzioni dettagliate danno risultati incoerenti, 2-4 esempi mirati sui casi ambigui, con il motivo della scelta rispetto all'alternativa plausibile, sono la tecnica più efficace e permettono di generalizzare. Venti esempi di ordini ordinari non toccano l'ambiguità. Una tabella decisionale più lunga ripropone proprio le istruzioni che già non bastano. Separare la classificazione in una seconda chiamata aggiunge complessità senza risolvere la decisione." });

Q({ id: "s6-n05", s: 6, d: 4, t: "4.3",
  q: "Your team replaces 'respond with JSON' prompting with an extraction tool whose input schema defines the output, called with a forced `tool_choice`. Which TWO statements about what this setup guarantees are correct?",
  o: [
    "The output is syntactically valid and conforms to the declared schema, so JSON syntax errors disappear.",
    "Values can still be semantically wrong, for example line items that do not sum to the total or a date placed in the wrong field.",
    "Every extracted value is guaranteed to be faithful to the source document, because the schema constrains each field.",
    "Fields absent from the document automatically come back as null, even when the schema marks them as required.",
    "Cross-field business rules, such as an end date after a start date, are enforced by the schema, so no application-side validation is needed.",
  ], a: [0, 1],
  e: "Con tool use e schema la sintassi è sempre valida e conforme, ma gli errori semantici restano possibili (valori nel campo sbagliato, totali che non quadrano). Lo schema non garantisce la fedeltà dei valori al documento, non trasforma in null i campi assenti se sono obbligatori (anzi spinge a inventarli) e non applica regole incrociate come data fine dopo data inizio: per quelle serve validazione nel codice." });

Q({ id: "s6-n06", s: 6, d: 4, t: "4.3",
  q: "Vendor invoices carry dates such as '03/04/24'. European vendors write day/month/year, US vendors write month/day/year, and your schema requires an ISO 8601 `invoice_date`. About 6% of extracted dates have day and month swapped, and every one of them passes format validation. What is the most effective change?",
  o: [
    "Add prompt rules for reading day/month order from the vendor's country and locale cues, with null and an ambiguity note when no cue exists.",
    "Add a stricter format check on `invoice_date` and retry the extraction whenever a date fails to match the ISO 8601 pattern in the schema.",
    "Lower the temperature to zero so that the model reads ambiguous dates the same way on every run, then spot-check a sample each month.",
    "Return the date exactly as printed in an `invoice_date_text` string and let the downstream systems parse it using the server's default locale.",
  ], a: [0],
  e: "Le regole di normalizzazione nel prompt, accanto allo schema rigido, dicono come interpretare formati incoerenti: l'ordine giorno/mese si deduce da indizi come il paese del fornitore e, se mancano, si restituisce null con una nota invece di indovinare. Un controllo di formato non vede lo scambio giorno/mese, perché la data resta un ISO valido. Temperatura zero rende l'errore coerente, non corretto. Il testo grezzo letto con il locale del server sposta lo stesso errore a valle." });

Q({ id: "s6-n07", s: 6, d: 4, t: "4.4",
  q: "A validation rule requires `tax_id` for every vendor, and failures trigger a retry with the message 'tax_id is missing, please provide it'. Since the retry was added, the pass rate reached 100%, but an audit finds that 30% of the retried records contain tax IDs that appear nowhere in the source documents. What should you change?",
  o: [
    "Stop retrying when the value is absent from the source: make `tax_id` nullable, accept null with a 'not in document' status, and route those records to review.",
    "Keep the rule and the retry, but add 'only use a tax ID that is stated in the document' to the retry message so that the model stops inventing values.",
    "Add a checksum validation for tax ID formats and retry any record whose tax ID fails it, until a well-formed value is returned by the model.",
    "Raise the number of retries from two to four so that the model has more chances to locate the tax ID somewhere in the document.",
  ], a: [0],
  e: "Il retry funziona per errori di formato o struttura, non quando l'informazione manca dalla fonte: con una regola che esige il valore il modello lo inventa pur di passare la validazione, quindi il 100% di successo è fittizio. Si ammette null con uno stato esplicito e si manda a revisione. Aggiungere 'usa solo valori presenti' lascia in piedi la regola che li pretende; il controllo di checksum premia valori inventati ma ben formati; più tentativi producono più invenzioni." });

Q({ id: "s6-n08", s: 6, d: 4, t: "4.4",
  q: "After moving to tool use with a strict schema, 3% of extracted leases still have `lease_end` earlier than `lease_start`, which breaks the downstream billing system. The types of both date fields are correct in every output. Where should you address this?",
  o: [
    "Validate the cross-field rule in application code and, on failure, retry with the document, the failed extraction and the specific error.",
    "Tighten the JSON schema definitions of both date fields so that an inverted date range is rejected at generation time, before the output is returned.",
    "Add the sentence 'lease_end must be after lease_start' to the prompt and rely on the model to comply with the rule from now on, in every extraction.",
    "Add a second step in the same conversation that asks Claude to confirm that its extraction is valid before the result is stored in the lease database.",
  ], a: [0],
  e: "Lo schema garantisce la sintassi ma non le regole semantiche tra campi: la verifica va fatta nel codice applicativo (per esempio con Pydantic) e, in caso di errore, si ritenta con documento, estrazione fallita ed errore specifico. Tipi più stretti non possono esprimere un confronto tra due campi; una frase nel prompt è solo probabilistica; chiedere al modello di confermare la propria validità nella stessa conversazione è un'autorevisione poco efficace." });

Q({ id: "s6-n09", s: 6, d: 4, t: "4.5",
  q: "A nightly Message Batches job extracts fields from 20,000 insurance claim forms. All requests complete, but 4% of the results fail your semantic validation (inconsistent date formats, values in the wrong fields). You want to correct them without reprocessing everything. What is the best approach?",
  o: [
    "Submit a follow-up batch with only the failed `custom_id`s, each request including the original form, the failed extraction and its validation errors.",
    "Resubmit the whole batch of 20,000 forms with the validation rules added to the prompt, so that every result benefits from the clarified instructions and rules.",
    "Add the failed forms unchanged to tomorrow night's batch, since a repeated request will usually produce a valid result on the second attempt.",
    "Send all failed forms directly to human data-entry staff, since a result that has already failed validation once cannot be fixed by the model.",
  ], a: [0],
  e: "Gli errori di formato e di struttura si correggono con un retry con feedback; in un batch i casi si identificano per `custom_id` e si reinviano solo quelli, con documento, estrazione fallita ed errore. Rilanciare tutto spreca il risparmio del 50%. Rimandare le stesse richieste senza feedback ripete l'errore. Mandare tutto a revisione umana ignora che questi errori si correggono automaticamente." });

Q({ id: "s6-n10", s: 6, d: 4, t: "4.5",
  q: "A bank extracts fields from about 60,000 statements and wire-transfer forms every night. The results feed a morning compliance report, except for roughly 1% of documents tagged 'high-value wire', which an analyst must clear within minutes of arrival. The team wants the 50% batch discount. Which design fits best?",
  o: [
    "Send the high-value wires through the synchronous API as they arrive, and the rest of the nightly volume through the Message Batches API.",
    "Send everything through the Message Batches API and let analysts poll for the high-value results, since batches are often faster than 24 hours.",
    "Send everything through the synchronous API, because one blocking use case makes the Message Batches API unsafe for the whole pipeline.",
    "Send everything through batches, but fall back to the synchronous API for any wire not completed within five minutes of submission.",
  ], a: [0],
  e: "Il batch costa il 50% in meno ma ha una finestra fino a 24 ore e nessuna garanzia di latenza: va bene per il volume notturno, non per le poche pratiche che l'analista deve chiudere in minuti, che vanno sulla API sincrona. Affidarsi al fatto che i batch 'spesso sono più veloci' non è accettabile per un flusso bloccante. Tutto sincrono butta il risparmio sul 99% del volume. Il ripiego dopo un timeout aggiunge complessità quando basta assegnare ogni API al carico giusto." });

Q({ id: "s6-n11", s: 6, d: 4, t: "4.6",
  q: "Your pipeline extracts obligations from supplier contracts, then asks the same conversation to 'double-check your extraction and fix any mistakes'. It confirms its own work in 98% of cases, yet a human audit finds subtle errors, such as obligations assigned to the wrong party, in about 8% of contracts. What is the most effective change?",
  o: [
    "Run the check in a separate Claude instance that receives the contract and the extraction but not the generator's reasoning.",
    "Enable extended thinking on the extraction step so that the model reasons for longer before it produces its first answer.",
    "Strengthen the check prompt with 'assume the extraction contains at least one error and find it', keeping the same conversation.",
    "Switch the whole pipeline to a larger model so that fewer mistakes are made in the first place and the check has less to catch.",
  ], a: [0],
  e: "Un modello che rivede il proprio lavoro nella stessa sessione conserva il ragionamento della generazione ed è poco incline a metterlo in dubbio. Un'istanza indipendente, senza quel contesto, individua meglio gli errori sottili, più di istruzioni di autorevisione o del ragionamento esteso. 'Assumi che ci sia un errore' è ancora autorevisione; un modello più grande non cambia la struttura del controllo." });

Q({ id: "s6-n12", s: 6, d: 4, t: "4.6",
  q: "Loan applications arrive as packets of 12-15 documents (pay stubs, tax returns, bank statements). One prompt that extracts everything at once gives deep results for the first documents and shallow ones for the rest, and the same employer is spelled differently across documents without anyone noticing. How should you restructure the extraction?",
  o: [
    "Run one focused extraction pass per document, then a separate integration pass over the results to check consistency across documents.",
    "Keep one pass, but ask Claude to write a running summary after each document so that earlier documents stay in view for the later ones.",
    "Keep one pass, raise `max_tokens`, and instruct the model to give every document the same depth of analysis and to compare names.",
    "Run only the per-document passes, and rely on the downstream database's matching rules to harmonize the employer names afterwards.",
  ], a: [0],
  e: "Il rendimento disomogeneo è diluizione dell'attenzione: si fa un passaggio per documento (profondità costante) e un passaggio di integrazione separato per le incoerenze tra documenti, come il nome del datore di lavoro. Riassunti progressivi perdono dettagli; più token o istruzioni di 'pari profondità' non cambiano la struttura; i soli passaggi per documento lasciano irrisolte le incoerenze tra documenti." });

Q({ id: "s6-n13", s: 6, d: 4, t: "4.6",
  q: "You are adding a second, independent Claude instance to audit extractions from medical billing forms before they are posted. You want its input designed so that it can catch subtle errors the generator missed. What should the reviewer receive?",
  o: [
    "The source form, the extracted record and explicit audit criteria, without the generator's prompt, reasoning or conversation.",
    "The full generator conversation, including its reasoning, so that the reviewer understands why each value was chosen.",
    "The extracted record and the schema only, so that the reviewer judges plausibility without being anchored by the source form.",
    "The source form, the extracted record and the generator's own explanation of why it is confident in each value, to focus on weak points.",
  ], a: [0],
  e: "Il revisore indipendente deve avere la fonte, l'estrazione e criteri espliciti, ma non il ragionamento del generatore, che lo ancorerebbe alle stesse conclusioni. Dare la conversazione completa o la spiegazione della confidenza del generatore reintroduce proprio quel contesto. Senza il modulo originale il revisore può solo giudicare la plausibilità, non verificare i valori." });

Q({ id: "s6-n14", s: 6, d: 5, t: "5.1",
  q: "Annual reports of 300+ pages, far beyond what fits in one request, are split into 25-page chunks. A first pass writes a prose summary of each chunk, and a second pass extracts `total_revenue`, `fiscal_year_end` and covenant thresholds from the combined summaries. Exact figures and dates are often blurred ('revenue grew strongly') or missing. What is the best redesign?",
  o: [
    "Extract the exact values from each chunk into structured records with page references, and merge those records instead of prose summaries.",
    "Ask the summarization pass to write longer summaries so that more of the detail in each chunk survives into the second extraction pass over the summaries.",
    "Add the instruction 'always preserve numbers and dates' to the summarization prompt, keeping the rest of the pipeline exactly as it is today.",
    "Send the whole report to a model with a larger context window in a single request and skip the summarization pass entirely, to avoid any loss of detail.",
  ], a: [0],
  e: "Il riassunto progressivo condensa cifre e date in formule vaghe. Estrarre per chunk i valori esatti in record strutturati con riferimento di pagina, e unire quelli, conserva i fatti fuori dalla prosa. Riassunti più lunghi o l'istruzione 'conserva i numeri' restano probabilistici; mandare tutto in una sola richiesta non è possibile oltre il contesto e peggiora la perdita nelle sezioni centrali." });

Q({ id: "s6-n15", s: 6, d: 5, t: "5.2",
  q: "An extraction agent processes a claim form whose total is smudged beyond reading. It has already re-run OCR, tried a higher-resolution rendering and asked the clerk, who has no other copy. Every further attempt returns the same unreadable region. What should the agent do?",
  o: [
    "Escalate to a human reviewer with what was tried, the partial extraction and the unreadable region, since no meaningful progress is possible.",
    "Keep trying new rendering settings and OCR options until some attempt yields a value, then submit that value as the total of the claim.",
    "Estimate the total from the individual line items and the usual tax rate, and mark the extraction as complete so that it can be posted.",
    "Return the extraction with `total` set to null and mark it as successful, leaving downstream systems to deal with the missing amount.",
  ], a: [0],
  e: "Quando non si riesce a fare progressi significativi (tentativi esauriti, nessun'altra fonte) l'agente deve escalare con un passaggio strutturato: cosa è stato provato, risultato parziale, punto illeggibile. Continuare a insistere spreca risorse e rischia valori inventati; stimare il totale è inventarlo; restituire null come successo sopprime l'errore e non informa nessuno." });

Q({ id: "s6-n16", s: 6, d: 5, t: "5.3",
  q: "A document-analysis subagent calls an OCR service for each scanned page. The service returns an empty string both when it times out and when a page is genuinely blank (a separator sheet). The subagent reports every empty result to the coordinator as 'no text found', and the coordinator marks the page's fields as not present, so some real invoices end up with missing fields. What is the right fix?",
  o: [
    "Return a structured error with failure type and `isRetryable` for timeouts, and a successful empty result for blank pages.",
    "Retry every empty result three times and treat it as a blank page only if all three attempts return nothing.",
    "Treat every empty result as a failure and escalate the whole document to human review for manual keying.",
    "Return a generic 'page unavailable' status for every empty result, so that the coordinator treats all of them with caution and decides what to do.",
  ], a: [0],
  e: "Un timeout è un fallimento di accesso che può richiedere un retry o una fonte alternativa; una pagina bianca è un risultato vuoto valido. Il tool deve distinguerli, con errore strutturato (tipo, `isRetryable`) nel primo caso. Ritentare tre volte ogni vuoto è spreco e non risolve l'ambiguità; mandare tutto a revisione umana tratta le pagine separatrici normali come guasti; uno stato generico nasconde al coordinatore l'informazione necessaria." });

Q({ id: "s6-n17", s: 6, d: 5, t: "5.5",
  q: "Extractions above the calibrated confidence threshold are auto-approved, and you sample 1% of them uniformly at random for review. Customs declarations make up 0.3% of volume, so the monthly sample holds only a few of them, and a template change corrupted a field on those documents for weeks before anyone noticed. Reviewer capacity cannot increase. What should you change?",
  o: [
    "Stratify the sample by document type, so that every type, including rare ones, gets enough reviewed items to measure its own error rate.",
    "Raise the uniform sampling rate to 5% so that rare document types are sampled more often over the course of each month and reach a useful size.",
    "Lower the confidence threshold so that more customs declarations are routed to human review before they are approved, until the error rate looks stable.",
    "Review only the auto-approved documents that downstream systems reject, since those point to errors that really occurred in the production flow.",
  ], a: [0],
  e: "Il campionamento stratificato per tipo di documento garantisce abbastanza elementi anche per i tipi rari, così se ne misura l'errore e si scoprono schemi nuovi come la modifica di template. Con capacità di revisione fissa, alzare il tasso uniforme non è praticabile e continua a sotto-campionare i tipi rari. Abbassare la soglia non misura le estrazioni già approvate. Rivedere solo i rifiuti a valle dà un campione distorto." });

Q({ id: "s6-n18", s: 6, d: 5, t: "5.5",
  q: "Your pipeline routes a whole document to human review whenever its lowest field confidence is below the threshold. 38% of documents are routed, but reviewers report that usually only one or two of the 25 fields are doubtful, and they re-check everything anyway. How can you use limited reviewer capacity better?",
  o: [
    "Route at field level: use calibrated field confidence to show reviewers only the doubtful fields, and accept the other fields automatically.",
    "Raise the document-level threshold until the routed share of documents falls below 15%, accepting the extra errors that will then pass unreviewed.",
    "Replace the field scores with one overall confidence score per document reported by the model, to simplify the routing rule for the whole review team.",
    "Stop using confidence for routing and send a random 15% of documents to review, so that reviewers always see an unbiased mix of documents.",
  ], a: [0],
  e: "La confidenza calibrata a livello di campo permette di mostrare ai revisori solo i campi dubbi e di accettare automaticamente gli altri, usando meglio una capacità limitata. Alzare la soglia di documento riduce il volume ma lascia passare errori; una confidenza unica per documento è meno informativa; un campione casuale ignora dove sta il rischio." });

Q({ id: "s6-n19", s: 6, d: 5, t: "5.6",
  q: "Per-chunk extraction results for 200-page contracts are merged into one record. Reviewers can no longer check where a value such as `liability_cap` came from, and conflicting mentions in different chunks are silently collapsed into one value. What should the extraction output and the merge step do?",
  o: [
    "Require each extracted value to carry its source (document, page, excerpt), and have the merge step preserve and combine these mappings.",
    "Keep, for each field, the value from the chunk with the highest confidence and discard the others, to keep the merged record clean and unambiguous.",
    "Append the full text of every chunk to the merged record so that reviewers can search for the source of any value themselves.",
    "Ask the merge step to add a sentence to its summary naming the chunks it relied on for each section of the record.",
  ], a: [0],
  e: "Ogni valore deve portare la propria fonte (documento, pagina, estratto) in forma strutturata, e il passo di unione deve conservare e combinare questi collegamenti: l'attribuzione si perde quando i risultati vengono compressi senza una mappatura affermazione-fonte. Tenere solo il valore a confidenza più alta nasconde i conflitti; allegare tutto il testo non dà tracciabilità; una frase sui chunk usati non è verificabile campo per campo." });

Q({ id: "s6-n20", s: 6, d: 5, t: "5.6",
  q: "Your pipeline extracts market statistics from industry reports and merges them. It flags a contradiction between one report stating 'defect rate 2.1%' (published 2022, measured per unit shipped) and another stating '5.4%' (published 2024, measured per production batch). Which TWO additions to the structured output would let downstream steps interpret such differences correctly?",
  o: [
    "A publication or data-collection date attached to each extracted value.",
    "The methodological context of each value, such as the measurement unit, population and definition.",
    "The timestamp at which Claude processed each document.",
    "An overall confidence score for the whole report.",
    "The file size and page count of each source report.",
  ], a: [0, 1],
  e: "Date di pubblicazione o raccolta e contesto metodologico (unità, popolazione, definizione) evitano che differenze temporali o di misura vengano scambiate per contraddizioni: qui 2022 contro 2024 e 'per unità' contro 'per lotto'. Il momento in cui Claude ha elaborato il file, una confidenza globale e le dimensioni del file non aiutano a interpretare i valori." });
