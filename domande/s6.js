// Scenario 6 · Structured Data Extraction
Q({ id: "s6-01", s: 6, d: 4,
  q: "Your extraction pipeline asks Claude to 'respond with JSON matching this schema' and parses the text. About 3% of responses fail to parse (missing braces, trailing commentary). What is the most reliable fix?",
  o: [
    "Define an extraction tool whose input schema is the JSON schema, and read the structured data from the `tool_use` block.",
    "Add 'Respond ONLY with valid JSON and no other text' to the prompt, and automatically retry whenever a response fails to parse.",
    "Use a regular expression to extract the outermost JSON object from the response before parsing.",
    "Lower the temperature to zero so the model reproduces the schema more consistently.",
  ], a: [0],
  e: "Tool use con JSON schema è l'approccio più affidabile per output conforme: elimina gli errori di sintassi. Le alternative riducono gli errori ma non li eliminano." });

Q({ id: "s6-02", s: 6, d: 4,
  q: "You have three extraction tools, `extract_invoice`, `extract_receipt`, and `extract_contract`, and the type of each incoming document is unknown. Sometimes Claude replies with a text description instead of calling a tool. How should you set `tool_choice`?",
  o: [
    "`{\"type\": \"any\"}`, so Claude must call one of the tools but can choose which one.",
    "`{\"type\": \"auto\"}`, so Claude decides whether a tool is needed at all.",
    "`{\"type\": \"tool\", \"name\": \"extract_invoice\"}`, since invoices are the most common document type.",
    "Leave it unset and add a system prompt instruction to always call a tool.",
  ], a: [0],
  e: "`any` obbliga a chiamare un tool lasciando al modello la scelta: è il caso di più schemi con tipo di documento ignoto. `auto` permette la risposta testuale (il problema attuale); forzare `extract_invoice` sbaglia gli altri tipi." });

Q({ id: "s6-03", s: 6, d: 4,
  q: "Your pipeline must always run `extract_metadata` before any enrichment tool, whatever the document. How do you guarantee this on the first call?",
  o: [
    "Force it with `tool_choice: {\"type\": \"tool\", \"name\": \"extract_metadata\"}`, then handle the enrichment steps in follow-up turns.",
    "Set `tool_choice: {\"type\": \"any\"}` and list `extract_metadata` first in the tools array, so it is the first tool the model considers.",
    "State in the system prompt that `extract_metadata` must always be called first.",
    "Set `tool_choice: {\"type\": \"auto\"}` and describe `extract_metadata` as 'call this first'.",
  ], a: [0],
  e: "La selezione forzata garantisce che quel tool sia chiamato per primo; i passi successivi si gestiscono nei turni seguenti. Con `any` il modello sceglie (l'ordine nell'array non conta); prompt e descrizioni sono probabilistici." });

Q({ id: "s6-04", s: 6, d: 4,
  q: "Some invoices do not contain a purchase order number. Your schema marks `po_number` as a required string, and Claude occasionally returns plausible but fabricated PO numbers. What change is most effective?",
  o: [
    "Make `po_number` optional and nullable, so the model can return null when the document does not contain it.",
    "Add 'Never invent values' to the prompt while keeping the field required.",
    "Validate PO numbers against a format regex and retry the extraction whenever the returned value has the wrong format.",
    "Lower the temperature to zero to reduce the likelihood of fabricated values.",
  ], a: [0],
  e: "Un campo obbligatorio per un'informazione che può mancare spinge il modello a inventare pur di rispettare lo schema. Nullable/opzionale gli permette di dire 'non c'è'. Una regex non riconosce un numero inventato ma ben formato." });

Q({ id: "s6-05", s: 6, d: 4,
  q: "Your schema classifies expenses into an enum of 8 categories. New expense types keep appearing and get forced into the wrong category. Which schema pattern handles this best?",
  o: [
    "Add an 'other' value to the enum plus a `category_detail` string field that describes it.",
    "Replace the enum with a free-text category field, so that any new expense type can be described.",
    "Add each new category to the enum as soon as it is spotted in production.",
    "Make the category optional so that unknown types are simply left empty.",
  ], a: [0],
  e: "Enum con 'other' + campo di dettaglio: categorie estendibili senza perdere la struttura. Il testo libero perde la normalizzazione; inseguire ogni categoria nuova non scala; lasciare vuoto perde informazione." });

Q({ id: "s6-06", s: 6, d: 4,
  q: "Some contracts are genuinely ambiguous about whether a clause is a 'termination' or a 'renewal' clause, and Claude picks one arbitrarily. What schema change makes these cases visible?",
  o: [
    "Add an 'unclear' enum value for ambiguous cases, so they can be identified and routed for review.",
    "Keep only 'termination' and 'renewal' as allowed values, so that the model must commit to one of them.",
    "Add a confidence field and accept the classification whenever confidence is above 0.5.",
    "Instruct the model to choose 'termination' whenever it is unsure, as the safer option.",
  ], a: [0],
  e: "Un valore 'unclear' rende visibili i casi ambigui invece di nasconderli dietro una scelta arbitraria." });

Q({ id: "s6-07", s: 6, d: 4,
  q: "With tool use and a strict JSON schema, every output is now schema-valid. However, in some invoices the line items do not add up to the extracted total. What does this indicate, and how should you address it?",
  o: [
    "Schemas eliminate syntax errors, not semantic ones; extract a `calculated_total` alongside the `stated_total` and flag discrepancies.",
    "The schema is not strict enough; adding `minimum` and `maximum` constraints to the amount fields will prevent this kind of mismatch from happening again.",
    "The model needs a higher `max_tokens` so that it can finish summing all line items.",
    "Tool use is unreliable for numbers; return to free-text output with a custom parser.",
  ], a: [0],
  e: "Lo schema garantisce la sintassi, non la correttezza semantica (somme, valori nel campo sbagliato). Auto-verifica: `calculated_total` accanto a `stated_total` per far emergere le discrepanze." });

Q({ id: "s6-08", s: 6, d: 4,
  q: "Validation fails because `invoice_date` was returned as '03/04/24' instead of ISO 8601. What should the retry request include?",
  o: [
    "The original document, the failed extraction, and the specific validation error, so the model can correct itself.",
    "Only the original document, sent again with the same prompt, since an error like this is usually random and disappears on retry.",
    "Only the validation error message, so the model focuses on the field that failed.",
    "The original prompt with a higher temperature, to obtain a different answer.",
  ], a: [0],
  e: "Retry con feedback: documento, estrazione fallita ed errore specifico. Senza documento il modello non può ricontrollare; senza errore ripete lo stesso sbaglio." });

Q({ id: "s6-09", s: 6, d: 4,
  q: "Validation requires `contract_end_date`, but for some contracts the date appears only in a separate amendment that is not part of the input. Your retry loop runs three times and still fails. What is correct?",
  o: [
    "Retries cannot succeed when the information is absent from the source; return null and flag the document for human review.",
    "Raise the retry count to five, adding more emphasis on the end date in each attempt.",
    "Instruct the model to estimate the end date from the start date and the typical contract length for that kind of agreement.",
    "Relax validation so that a partially filled date is accepted.",
  ], a: [0],
  e: "Il retry funziona per errori di formato o struttura, non quando l'informazione manca dal documento fornito. Stimare la data significa inventarla." });

Q({ id: "s6-10", s: 6, d: 4,
  q: "Which TWO kinds of extraction failure are likely to be fixed by a retry with error feedback?",
  o: [
    "A date returned as '5 March 2024' when the schema requires ISO 8601.",
    "A nested object placed at the wrong level of the output structure.",
    "A required field whose value appears only in a document that was not provided.",
    "A total that cannot be verified because the scanned source is illegible.",
    "A customer ID that the source document never mentions.",
  ], a: [0, 1],
  e: "Errori di formato e di struttura si correggono con il feedback. Se l'informazione non è nella fonte (documento mancante, scansione illeggibile, dato mai citato) il retry è inutile." });

Q({ id: "s6-11", s: 6, d: 4,
  q: "Source documents express weights as '2kg', '2,000 g', and '2 kilos'. Your strict schema requires a number in grams, and outputs are inconsistent. What should you add?",
  o: [
    "Format normalization rules in the prompt, alongside the strict output schema (for example: convert every weight to grams).",
    "A separate unit-conversion tool that the model must call for every weight value it extracts, before filling in the schema.",
    "A larger enum of allowed unit strings so that each original form is preserved.",
    "Nothing: the schema type 'number' already forces the correct normalization.",
  ], a: [0],
  e: "Lo schema rigido definisce la forma, le regole di normalizzazione nel prompt dicono come arrivarci da fonti incoerenti. Il tipo 'number' non sa che '2kg' vale 2000." });

Q({ id: "s6-12", s: 6, d: 4,
  q: "Extraction from research papers works for papers with a bibliography but misses citations in papers that use only inline citations. What is the most effective technique?",
  o: [
    "Add few-shot examples showing correct extraction from both inline-citation and bibliography-style documents.",
    "Add a rule stating that citations may appear anywhere in the document.",
    "Pre-process every document with a script that moves inline citations into a bibliography section before extraction.",
    "Use a separate model call to detect the citation style before extraction.",
  ], a: [0],
  e: "Few-shot che mostrano l'estrazione corretta da strutture diverse sono la tecnica più efficace per gestire la varietà dei documenti." });

Q({ id: "s6-13", s: 6, d: 4,
  q: "For documents with unusual layouts (narrative descriptions instead of tables), Claude often returns null for fields whose values are actually present. What helps most?",
  o: [
    "Add few-shot examples demonstrating correct extraction from documents with varied formats, including narrative layouts.",
    "Make those fields required and non-nullable, so that the model is forced to look harder and always fill them in with a value.",
    "Retry every null value until the model returns something.",
    "Convert all documents to tables with a preprocessing script before extraction.",
  ], a: [0],
  e: "Estrazioni vuote su formati vari si correggono con few-shot che mostrano quei formati. Rendere i campi obbligatori o ritentare all'infinito spinge a inventare quando il dato davvero non c'è." });

Q({ id: "s6-14", s: 6, d: 5,
  q: "Your extraction system shows 97% overall field accuracy on a validation set, and management wants to remove human review entirely. What should you do first?",
  o: [
    "Analyze accuracy by document type and by field to verify consistent performance across all segments before reducing review.",
    "Remove human review, since 97% exceeds typical human accuracy for manual data entry.",
    "Remove review for the three most common document types and keep it for the rest.",
    "Have the model self-report a confidence score for every extraction, and skip human review whenever the reported score is high.",
  ], a: [0],
  e: "Un'accuratezza aggregata può nascondere segmenti scadenti (un tipo di documento raro al 60%, un campo critico). Prima si misura per tipo e per campo." });

Q({ id: "s6-15", s: 6, d: 5,
  q: "High-confidence extractions are now auto-approved. How should you keep measuring their error rate and detect new error patterns?",
  o: [
    "Run stratified random sampling of high-confidence extractions for ongoing human review.",
    "Review only the extractions that downstream systems reject.",
    "Review the 100 most recent extractions every week.",
    "Rely on the model's confidence scores from now on, since they were calibrated at launch.",
  ], a: [0],
  e: "Campionamento casuale stratificato anche sulle estrazioni ad alta confidenza: misura l'errore reale e fa emergere pattern nuovi. I soli scarti a valle o i più recenti sono campioni distorti." });

Q({ id: "s6-16", s: 6, d: 5,
  q: "You want to route extractions to human review based on field-level confidence. How should the routing thresholds be set?",
  o: [
    "Have the model output field-level confidence scores, then calibrate the thresholds against a labeled validation set.",
    "Use the model's raw confidence with one fixed threshold of 0.9 for every field.",
    "Route a fixed percentage of documents to review regardless of confidence.",
    "Let experienced reviewers set the thresholds, based on their own impression of which fields are hardest to extract correctly.",
  ], a: [0],
  e: "La confidenza del modello è utile solo se calibrata: soglie per campo tarate su un set di validazione etichettato." });

Q({ id: "s6-17", s: 6, d: 5,
  q: "A contract states the payment term as 'Net 30' on page 2 and 'Net 45' on page 9. What is the best extraction behavior?",
  o: [
    "Record both values with a `conflict_detected: true` flag and route the document to human review.",
    "Extract the value that appears first, since earlier sections usually take precedence.",
    "Extract the value that appears last, since later terms usually override earlier ones.",
    "Leave the field null, since the document does not give one definitive answer for the payment term.",
  ], a: [0],
  e: "Dati incoerenti nella fonte: si segnalano (`conflict_detected`) con entrambi i valori e si mandano a revisione. Scegliere per posizione è un'euristica arbitraria; null perde informazione." });

Q({ id: "s6-18", s: 6, d: 4,
  q: "You submit 10,000 documents through the Message Batches API. How do you match each result to its source document?",
  o: [
    "Assign a unique `custom_id` to each request and use it to correlate the results.",
    "Rely on results being returned in the same order in which requests were submitted.",
    "Include the file name in the prompt and parse it back out of each response.",
    "Submit one document per batch so that each batch ID identifies one document.",
  ], a: [0],
  e: "`custom_id` è il meccanismo per correlare richieste e risposte di un batch; l'ordine non è garantito." });

Q({ id: "s6-19", s: 6, d: 5,
  q: "Your team can review only 200 of the 5,000 extractions produced each day. Which extractions should be prioritized for human review?",
  o: [
    "Those with low calibrated confidence, or whose source documents are ambiguous or contradictory.",
    "A uniformly random sample of 200, to keep the review unbiased.",
    "The 200 longest documents, since length correlates with errors.",
    "Those from the newest customers, since their documents are unfamiliar to the system and to the team.",
  ], a: [0],
  e: "Con capacità limitata si dà priorità a bassa confidenza e fonti ambigue o contraddittorie. Il campione casuale (stratificato) serve a misurare l'errore, non a usare al meglio i revisori." });
