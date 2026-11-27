# Deliverable 6 — Product Requirements Document

**Brand Intelligence Engine · Phase 1: E-commerce Intelligence**

**Version:** 1.0 · **Date:** 26 November 2026 · **Owner:** the product owner (brand team) · **Status of the product:** Build 1 (foundation) complete — see [Deliverable 10](10-first-build.md)

This document says what the product must do, for whom, and how we will know each part is finished. It is the reference for every later build stage. Where a requirement is already built, it says so and names the test that proves it.

**Status marks used throughout**

| Mark | Meaning |
|:-:|---|
| ✅ | Built and covered by automated tests in Build 1 |
| ◐ | Partly built — the note says which part |
| ○ | Planned — the stage is given. The database tables already exist |

---

## 1. What the product is

One system that knows what each brand stands for, what it sells, what it is allowed to claim and where its products are sold online — and that uses this knowledge to watch how the products are presented on each retailer, score the listings, read what customers say, compare with competitors, write better content and tell the brand team what to do next.

E-commerce is the first application. The same brand knowledge base, approval workflow, database and dashboard are designed to serve social media, advertising, influencer, traditional media and creative work later ([section 11](#11-designed-for-expansion)).

**The problem it solves.** Today this knowledge is scattered across brand books, spreadsheets, agencies and distributor accounts; retailer listings drift from the approved content without anyone noticing; and commercial tools cover the US and UK well and the brand's other markets poorly ([Deliverable 1](../research/01-industry-research-report.md)).

## 2. Who uses it

| Role | Who they are | What they need from the product |
|---|---|---|
| **Administrator** | The system owner | Set up the organisation, invite people, control access, decide whether outside AI services may be used, see the audit log |
| **Brand Manager** | Owns one or more brands | Keep brand and product information correct; approve claims, guidelines and content; see listing health and decide what to fix |
| **Content Editor** | Writes product content | Create and edit product information and content drafts; cannot approve their own work |
| **Analyst** | E-commerce or insights analyst | Choose which marketplaces to track, manage competitor lists, work through recommendations, read everything |
| **Agency Contributor** | An external agency | See only the brands they are assigned; upload files and propose content for review; approve nothing |
| **Viewer** | A stakeholder | Read only |

The full permission matrix is in the product under **Settings → Roles & permissions** and in `src/lib/auth/permissions.ts`. Two rules apply everywhere: **least privilege** (nobody sees or does more than their role needs) and **proposing and approving are always separate permissions**.

## 3. Product principles

The ten principles from the specification, and how the product holds itself to each.

| # | Principle | How it is honoured |
|---|---|---|
| 1 | **Brand ownership** | Brand Managers approve claims, guidelines, documents and (Stage 5) content. Agencies can only propose |
| 2 | **Centralisation** | One knowledge base holds brand profile, guidelines, claims, products and documents, searchable in one place |
| 3 | **Automation** | A background job queue runs today for document reading; scheduled collection, scoring and reporting arrive in Stages 3–5 |
| 4 | **Historical intelligence** | Observations, research and requirement sets are append-only. Nothing is overwritten; new information is a new dated record |
| 5 | **Actionability** | Recommendations with evidence, owner and status (Stage 5). Today: a "what to do next" checklist and review queues |
| 6 | **Marketplace specificity** | A requirements library per retailer, per country and per language. No retailer's rules are built into the universal product model |
| 7 | **Human oversight** | Nothing is published automatically. AI output is always labelled and always reviewed |
| 8 | **Extensibility** | Modules share one knowledge base, one permission system and one job queue; a new marketplace is data, not code |
| 9 | **Transparency** | Every figure carries one of five source markers; every score lists its components, evidence and rule version |
| 10 | **Cost efficiency** | Official APIs first; open-source components where licences allow; data bought only where it cannot be obtained otherwise ([Deliverable 8](08-build-vs-buy.md)) |

## 4. Scope and stages

| Phase | Content | Status |
|---|---|---|
| **Phase 1 — E-commerce intelligence** | This document | In progress |
| Phase 2 — Brand knowledge and content generation at depth | Extends the Content Studio beyond marketplaces | Designed for |
| Phase 3 — Social, advertising and creative intelligence | New modules on the same knowledge base | Designed for |
| Phase 4 — Unified brand operating system | Everything in one workflow | Designed for |

Phase 1 is built in six stages. The detail, dependencies and decisions for each are in the [roadmap](09-roadmap.md).

| Stage | What it delivers | Status |
|---|---|---|
| 1 — Research and specification | The ten deliverables | ✅ |
| 2 — Working foundation | Sign-in and roles, dashboard, brands, product catalogue, file upload, knowledge base, database | ✅ |
| 3 — E-commerce intelligence | Marketplace mapping ✅, requirements library ✅, SKU-to-listing mapping, listing monitoring, historical snapshots | ◐ |
| 4 — Intelligence and scoring | Listing audits, internal score, official score import, image assessment, reviews, competitors | ○ |
| 5 — AI and automation | Content generation, recommendations, weekly monitoring and report, alerts | ○ |
| 6 — Production readiness | Accuracy, permissions, security, failure handling, reproducibility, performance, backup and recovery | ○ |

---

## 5. The MVP and its acceptance criteria

The MVP is the point at which all eighteen criteria below are met with real data or clearly labelled demonstration data. **Build 1 is not the MVP.** It meets the criteria that do not need marketplace data; the rest need Stages 3 to 5.

| # | The MVP can… | Status | Evidence today, or what remains |
|:-:|---|:-:|---|
| 1 | Create a brand | ✅ | Browser test "criterion 1 — create a brand" |
| 2 | Upload a brand book | ✅ | PDF, Word, PowerPoint and Excel files are read, split into passages and made searchable; the true file type is verified. Browser test "criterion 2" |
| 3 | Add products and SKUs | ✅ | One at a time and by spreadsheet with a check-first step. Browser tests "criteria 3 and 4" and "criterion 3 — import" |
| 4 | Store product information | ✅ | Description, benefits, ingredients, directions, warnings, audience, attributes, markets, identifiers; barcodes validated by check digit |
| 5 | Map marketplaces by country | ✅ | 130 platforms in nine countries with evidence, sources and a reproducible rank. Browser test "criterion 5" |
| 6 | Add competitor products | ✅ | Competitor brands per brand, and named competitor products with pack size, tracked on any marketplace in Pricing Intelligence. Their listing content arrives with monitoring in Stages 3–4 |
| 7 | Collect or import real product listing data | ◐ | Prices can be recorded by hand today (Pricing Intelligence). Listing content by spreadsheet and official connectors in Stage 3 |
| 8 | Store historical snapshots | ○ | Stage 3. Tables exist; marketplace research and requirement sets already keep history |
| 9 | Audit product titles and descriptions | ○ | Stage 4. The requirements library it will check against is built: 668 sourced rules |
| 10 | Assess images | ◐ | Uploaded images are verified and measured (format, width, height). Assessment against each retailer's image rules is Stage 4 |
| 11 | Calculate an internal listing quality score | ○ | Stage 4. The proposed weights are stored as scoring rule version 1 and shown in the product |
| 12 | Import official scores where available | ○ | Stage 4. Which official scores truly exist, and how each is obtained, is researched and shown per retailer |
| 13 | Analyse ratings and reviews where accessible | ○ | Stage 4 |
| 14 | Generate content recommendations | ○ | Stage 5 |
| 15 | Generate marketplace-specific product content | ○ | Stage 5 |
| 16 | Track approval status | ◐ | Guidelines (draft → approved → retired), claims (unverified → approved or restricted) and source documents carry approval status with who and when. Content approval is Stage 5 |
| 17 | Generate a weekly intelligence report | ○ | Stage 5 |
| 18 | Explain the source of every metric and recommendation | ✅ | Every figure shown carries a source marker; every research figure links to its source. Recommendations will inherit the same rule in Stage 5 |

**Two rules govern acceptance, and they are tested:** every feature is exercised with real data or with the clearly flagged fictional brand "Demo Botanics"; and no marketplace metric is ever fabricated — metrics that need data not yet collected are shown as *not available*, never as zero (browser test "metrics that need marketplace data are shown as not available").

---

## 6. User journeys

### Journey 1 — Set up and bring a brand in ✅

1. The first person to open a new installation creates the organisation and becomes its Administrator.
2. They create a brand: name, positioning, personality, tone of voice, audience, visual guidelines.
3. They upload the brand book and other documents. Each is read automatically and becomes searchable within seconds, labelled *unverified* until a Brand Manager approves it as an authoritative source.
4. They record what the brand may claim. Each claim starts *unverified*; a Brand Manager approves it or restricts it, for all markets or for named ones.
5. They invite colleagues by one-time link, choosing a role and, for agencies, the brands each may see.

*Done when:* a new team member can search "what can we say about hair fall?" and get the approved claim, its source and its markets.

### Journey 2 — Build the product catalogue ✅

1. Add a product (the parent record), then its SKUs: variant, size, pack quantity, SKU code, barcode.
2. Or import a spreadsheet: the product checks the file first, reports every problem row by row, and only then imports. Repeating an import updates and never duplicates.
3. Add identifiers the product has on each marketplace (for example an Amazon ASIN), attributes retailers ask for, and the markets where it is sold.

*Done when:* every sellable unit has a code and a valid barcode, and the catalogue shows which do not.

### Journey 3 — Decide where to focus ✅

1. Open Marketplace Intelligence and choose a country. See the researched platforms ranked for beauty and personal care, with the evidence and sources behind every score.
2. Open a platform: reach estimates (labelled as estimates), data-access routes, official quality signals, sources.
3. Record the team's decision — tracked, planned or not tracked — and, for each brand, whether it is sold there and **by whom** (own seller account, the retailer, or a distributor). That last answer decides which data routes are open.
4. Open the Requirements Library to see what that retailer demands of a listing.

*Done when:* the team has a short list of tracked marketplaces with the seller of record known for each.

### Journey 4 — Watch the digital shelf ○ Stage 3

1. For each tracked marketplace, link each SKU to its listing. Barcode matches are proposed automatically; anything uncertain waits for a person.
2. Listing data arrives on a schedule by the best legitimate route — official API, licensed provider or spreadsheet upload.
3. Every observation is stored as a dated snapshot. The product shows what changed: title, images, price, promotion, availability.
4. If a collection fails, the product says "not observed" — it never reports the product as unavailable.

*Done when:* a Brand Manager can open any product and see, per marketplace, how it looks today, how it looked last month and what changed in between.

### Journey 5 — Understand and improve listing quality ○ Stage 4

1. Each listing shows up to three separate scores: the retailer's official score (only where one exists and has been obtained), the internal 0–100 score, and a competitive score.
2. Opening the internal score shows each component: its weight, what was found, what is missing, why points were deducted, the evidence and the recommended action.
3. When a retailer changes a rule, affected listings are flagged and re-scored against the new version; the old scores remain.

*Done when:* for any score, a person can answer "why this number?" from the screen alone, and recalculating from the stored inputs gives the same number.

### Journey 6 — Create and approve content ○ Stage 5

1. A Content Editor picks a product and a marketplace and asks for a draft.
2. The engine retrieves the brand's approved knowledge, uses only claims approved for that market, follows the tone of voice, and flags anything it could not find instead of inventing it.
3. The draft is checked against that retailer's requirements and shown side by side with the current listing, with the knowledge-base passages it drew on.
4. The editor refines it; a Brand Manager approves it. Every version is kept. Nothing is published by the system.

*Done when:* an approved, rule-compliant listing can be exported for upload, with a record of who approved it and what it was based on.

### Journey 7 — The weekly rhythm ○ Stage 5

1. Each week the engine collects, compares, re-scores, analyses reviews and competitors, and raises recommendations.
2. The team receives the weekly intelligence report. If nothing new was collected, it says so.
3. Recommendations are accepted, assigned as tasks and tracked to completion.

*Done when:* a week passes without anyone opening a retailer website, and the team still knows what changed and what to do.

### Journey 8 — Work with an agency ◐

1. An Administrator invites an agency user as *Agency Contributor*, ticking the brands they may see. ✅
2. The agency uploads files and proposes claims; everything they add is *unverified* until a Brand Manager approves it. ✅
3. They propose content drafts for review. ○ Stage 5

*Done when:* an agency can contribute without being able to see other brands, approve anything or read the audit log. The access rules are tested today.

---

## 7. Requirements by module

Each requirement has an identifier so later work can refer to it.

### 7.1 Overview

| ID | Requirement | Status |
|---|---|:-:|
| OV-1 | Show counts of brands, products, marketplaces and countries | ✅ |
| OV-2 | Show listings monitored, average internal score, official-score coverage, average rating, review volume, improvement opportunities, competitor changes and weekly alerts — each **as "not available" until real data exists** | ✅ shown as not available · ○ values in Stages 3–5 |
| OV-3 | Show the top three priority platforms per country with their calculated scores | ✅ |
| OV-4 | Show what needs attention (claims awaiting review, next set-up steps) and recent activity | ✅ |
| OV-5 | Explain the five source markers on the page | ✅ |

### 7.2 Brands and the brand knowledge base

| ID | Requirement | Status |
|---|---|:-:|
| BK-1 | Store brand name, identity, positioning, personality, tone of voice, target audience and visual guidelines | ✅ |
| BK-2 | Store guidelines by section and market, with versions; only approved guidelines are authoritative; editing returns one to draft | ✅ |
| BK-3 | Store claims with type, substantiation, product and markets; three states — unverified, approved, restricted (with reason) | ✅ |
| BK-4 | Upload PDF, Word, PowerPoint, Excel, text, images and video; verify the true file type from the file's contents; refuse anything else | ✅ |
| BK-5 | Read documents automatically in the background, split them into passages that cite page, slide or sheet, and index them | ✅ |
| BK-6 | Label every passage approved, unverified or restricted; documents are unverified until approved as a source | ✅ |
| BK-7 | Search by keyword and by meaning, in English and Arabic, showing source, location and trust label for every result; allow "approved only" | ✅ |
| BK-8 | Record competitor brands per brand | ✅ |
| BK-9 | Brand dashboard: marketplace coverage, listing health, reviews, competitive position, content gaps, recommendations | ◐ profile, readiness and knowledge today · ○ the rest in Stages 3–5 |
| BK-10 | Archive a brand without deleting its history | ✅ |
| BK-11 | Read text inside scanned documents and images (optical character recognition) | ○ Stage 4 — scanned PDFs are stored today but yield no text, and the product says so |

### 7.3 Product catalogue

| ID | Requirement | Status |
|---|---|:-:|
| PC-1 | Parent products with sub-brand, category, description, benefits, ingredients, directions, warnings, audience and status | ✅ |
| PC-2 | Variants, pack sizes and multipacks as SKUs with unique codes | ✅ |
| PC-3 | Barcodes (GTIN-8, 12, 13, 14) validated by check digit; the same barcode in different lengths is recognised as one | ✅ |
| PC-4 | Marketplace identifiers and retailer URLs per SKU | ✅ identifiers · ○ URLs with listings in Stage 3 |
| PC-5 | Free-form attributes (hair type, scent, shelf life…) and markets where sold | ✅ |
| PC-6 | Spreadsheet import with a dry run, row-level errors, and safe re-import | ✅ |
| PC-7 | Link product images, videos, packaging and regulatory files to a product | ✅ at upload · ○ gallery on the product page in Stage 3 |
| PC-8 | Product dashboard: listings, official and internal scores, reviews, competitor products, history, generated content, recommendations | ◐ master record today · ○ the rest in Stages 3–5 |
| PC-9 | Product records feed the knowledge base automatically | ✅ |

### 7.4 Marketplace intelligence

| ID | Requirement | Status |
|---|---|:-:|
| MI-1 | Country-by-country marketplace map with at least ten platforms per initial market | ✅ 12–16 per country, 130 in total |
| MI-2 | Top three priority platforms per country, ranked by a published formula from evidenced scores — never assumed | ✅ |
| MI-3 | Classify each platform: kind (general, beauty specialist, pharmacy, grocery, quick commerce, social…) and business model | ✅ |
| MI-4 | Show competitor presence, beauty relevance, reach estimates and data-access feasibility with sources and confidence | ✅ |
| MI-5 | Label reach figures as estimates and never present them as verified market share | ✅ |
| MI-6 | Filter by country, region, kind, business model, priority, data access and tracking status | ✅ |
| MI-7 | Filter by product category | ○ — research so far covers one category, beauty and personal care |
| MI-8 | Record per organisation: tracked / planned / not tracked, and per brand: sold here? by whom? | ✅ |
| MI-9 | Keep research history; a new research file adds a dated snapshot | ✅ |
| MI-10 | Add a platform the research did not cover; it carries no score until researched | ✅ |
| MI-11 | A research function that discovers new marketplaces and recommends additions, source-backed | ◐ research is run as a repeatable, documented process and loaded as data · ○ in-product research assistant in Stage 5 |

### 7.5 Marketplace requirements engine

| ID | Requirement | Status |
|---|---|:-:|
| RQ-1 | A separate rule set per retailer family, with country, language, category and seller-type scoping | ✅ 21 retailer families |
| RQ-2 | Each rule: what it covers, the limit, mandatory or recommended, the official source and its date | ✅ 668 rules |
| RQ-3 | Version control: a changed file creates a new version and marks the old one superseded | ✅ |
| RQ-4 | Say plainly when a retailer publishes no rules, instead of guessing | ✅ |
| RQ-5 | Record the official quality signals each retailer really exposes, and how a seller can obtain them | ✅ |
| RQ-6 | Check listings and drafts against the rules | ○ Stages 4 and 5 |
| RQ-7 | When a rule set changes, flag affected listings for reassessment | ○ Stage 4 |
| RQ-8 | Edit rules in the product, with approval | ○ Stage 4 — today rules are maintained as data files ([how-to](../guides/how-to.md#6-update-marketplace-requirements)) |

### 7.5a Brand Books ✅

| ID | Requirement | Status |
|---|---|:-:|
| BB-1 | Create brand books and launch books per brand: cover, story, key messages, tone, do's and don'ts, fonts, colours, claims, packshots, products | ✅ |
| BB-2 | Only approved claims can be placed in a book; restricted claims are listed automatically as "never say"; a claim that stops being approved is left out and flagged | ✅ |
| BB-3 | Draft → approved by a Brand Manager; editing an approved book returns it to draft with a new version | ✅ |
| BB-4 | A printable view that saves as PDF from the browser; drafts are marked as drafts | ✅ |

### 7.5b Pricing Intelligence ◐

| ID | Requirement | Status |
|---|---|:-:|
| PR-1 | Track our SKUs and named competitor products on any marketplace | ✅ |
| PR-2 | Record prices with date, currency, regular and promotional price, promotion and source; history is never overwritten | ✅ |
| PR-3 | Show price per 100 ml / 100 g / item, change since the previous check, and a like-for-like price index against the SKU a competitor product is compared with | ✅ |
| PR-4 | Never compare across marketplaces, currencies or incomparable units; say why instead. A product with no price shows "not recorded" | ✅ |
| PR-5 | Prices collected automatically by official connectors or a licensed provider | ○ Stages 3–4 |
| PR-6 | Price alerts and price trends in the weekly report | ○ Stage 5 |

### 7.6 Product and SKU mapping ○ Stage 3

| ID | Requirement |
|---|---|
| SM-1 | Match each SKU to marketplace products using barcode, manufacturer SKU, brand, name, variant, pack size, attributes, marketplace identifiers and URLs |
| SM-2 | Give every match a confidence score and the reasons for it |
| SM-3 | Never merge automatically when identifiers or attributes conflict; queue for a person |
| SM-4 | Allow manual matching, approval and rejection, all audited |
| SM-5 | Support parent products, variants and multipacks on both sides |

### 7.7 Digital shelf monitoring ○ Stage 3

| ID | Requirement |
|---|---|
| DS-1 | Capture per listing: title, description, bullets, attributes, images, videos, enhanced content, price, promotional price, discount, availability, seller, ranking and search visibility where accessible, URL, marketplace identifier, collection time |
| DS-2 | Store every observation as an immutable snapshot, with the raw observation and the processed version kept separately |
| DS-3 | Record for every observation: source, time, country, marketplace, product identifier, collection method, confidence |
| DS-4 | Detect changes in content, price, promotion, availability, images, attributes and rank; detect removals and new competitor products |
| DS-5 | Distinguish "not observed" from "unavailable"; a failed collection never becomes an out-of-stock |
| DS-6 | Accept data by official API, licensed provider and spreadsheet upload, in that order of preference |
| DS-7 | Compare like with like — same marketplace, product, country and collection method — and flag method changes |

### 7.8 Listing quality intelligence ○ Stage 4

| ID | Requirement |
|---|---|
| LQ-1 | **Official score:** import only where the retailer exposes one and access is authorised; store score, components, time, issues and suggested actions under the retailer's own name for it |
| LQ-2 | Where no official score exists or is accessible, say so. Never calculate a stand-in and present it as official |
| LQ-3 | **Internal score:** 0–100 from configurable weights, starting from the proposed framework below |
| LQ-4 | Weights can differ by marketplace and by category; every change is a new rule version |
| LQ-5 | For every component show: score, weight, raw assessment, missing information, reason for each deduction, recommended action, evidence, confidence and source marker |
| LQ-6 | A component that does not apply to a retailer (for example enhanced content where it is not offered) is excluded and the remaining weights re-scaled. A component whose data is missing is shown as *not assessed*, excluded from the total, and lowers the score's stated confidence — it is never scored as zero |
| LQ-7 | Reproducible: the score stores the snapshot, the rule version and a fingerprint of its inputs; recalculating gives the same result |
| LQ-8 | **Competitive score:** a separate comparison with competitor listings on completeness, imagery, information, keyword coverage, enhanced content, ratings, availability and price position |
| LQ-9 | Never compare scores across platforms without explaining the difference in method |
| LQ-10 | **Images:** check resolution, dimensions, background, count and variety by rule; assess visibility, overlays, packaging accuracy and lifestyle content with AI, labelled as AI-assessed; use per-retailer image templates |
| LQ-11 | Do not assume any retailer supports Amazon-style enhanced content |

Proposed internal weights (scoring rule version 1 — **internal judgement, not any retailer's weighting**):

| Title | Description | Bullets | Attributes | Main image | Other images | Enhanced content | Search and discoverability | Ratings and reviews | Q&A |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 10% | 10% | 10% | 15% | 15% | 10% | 10% | 10% | 5% | 5% |

### 7.9 Reviews, ratings and customer questions ○ Stage 4

| ID | Requirement |
|---|---|
| RR-1 | Capture, where legally and technically accessible: average rating, review count, rating distribution, review date, text, verified-purchase flag, language, helpful votes, customer questions and brand responses |
| RR-2 | Where a retailer does not expose them, show "Review data unavailable through current integration" — never zero |
| RR-3 | Never store reviewer names, profile links or photos; keep only an anonymous fingerprint to detect duplicates |
| RR-4 | Classify each review as positive, neutral, negative or mixed, and assign configurable themes (efficacy, fragrance, texture, packaging, value, authenticity, delivery…); AI classifications are labelled as such |
| RR-5 | Separate product complaints from seller, fulfilment and delivery complaints |
| RR-6 | Show rating and volume over time, sentiment trend, top complaints, most appreciated attributes, competitor comparison and emerging issues |
| RR-7 | Analyse customer questions: frequent, unanswered, repeated concerns, missing information |
| RR-8 | Draft answers from approved product information only; a person approves before anything is posted |
| RR-9 | Never state or imply that a change in sentiment caused a change in sales |

### 7.10 Competitor intelligence ○ Stage 4

| ID | Requirement | Status |
|---|---|:-:|
| CI-1 | Record competitor brands | ✅ |
| CI-2 | Track named competitor products: price, discount, rating, review count, description, imagery, claims, enhanced content, availability, search visibility and rank where accessible | ○ |
| CI-3 | Side-by-side comparison with the brand's own listing | ○ |
| CI-4 | Identify stronger content, missing information, positioning, launches, price moves, review advantages and differentiation opportunities | ○ |
| CI-5 | Weekly competitor summary inside the weekly report | ○ Stage 5 |
| CI-6 | Collect competitor data only by routes permitted under the data-collection policy ([Deliverable 4, section 6](../research/04-api-data-feasibility.md#the-policy-decision)) | ○ — decision needed |

### 7.11 Content Studio ○ Stage 5

| ID | Requirement |
|---|---|
| CS-1 | Generate titles, descriptions, bullets, benefits, keywords, FAQs, answers to customer questions, main and secondary image briefs, enhanced-content outlines, comparison charts, lifestyle concepts and marketplace-specific adaptations |
| CS-2 | Inputs: brand, product, SKU, market, marketplace, category, audience, guidelines, existing assets |
| CS-3 | Use only approved claims valid for the target market; check every draft against restricted claims |
| CS-4 | Follow the brand's tone of voice and the market's language; Arabic where the marketplace requires it |
| CS-5 | Never invent benefits or ingredients; flag missing information instead |
| CS-6 | Cite the knowledge-base passages each draft used |
| CS-7 | Validate every draft against the retailer's requirement set and show each failed rule |
| CS-8 | Keep every version — original, AI-generated, edited, approved, published — with status, person and date; compare side by side |
| CS-9 | Never publish automatically |
| CS-10 | Work only when an Administrator has allowed outside AI processing; record the model and prompt version with every output |

### 7.12 Recommendations ○ Stage 5

| ID | Requirement |
|---|---|
| RE-1 | Raise recommendations from rules and from analysis (examples in the specification: image below requirement, rating declining for four weeks, competitor with better image coverage, product missing from a specialist retailer, content inconsistent across retailers) |
| RE-2 | Each has: issue, product, marketplace, severity, business importance, evidence, confidence, suggested action, expected benefit, estimated effort, responsible team, status |
| RE-3 | Rank with a published priority formula |
| RE-4 | Label expected benefit as an estimate — never a verified financial result |
| RE-5 | Accept, reject or defer; accepted recommendations become assigned tasks tracked to completion |

### 7.13 Reports ○ Stage 5

| ID | Requirement |
|---|---|
| RP-1 | Weekly intelligence report with six sections: executive summary, marketplace intelligence, listing quality, customer intelligence, competitive intelligence, recommended actions |
| RP-2 | Compare with previous observations, like for like |
| RP-3 | Show collection dates and sources; state explicitly when no new data was collected |
| RP-4 | Export to PDF, Excel and CSV; optional weekly email |

### 7.14 Automation ◐

| ID | Requirement | Status |
|---|---|:-:|
| AU-1 | Background job queue with retries, back-off and recovery from crashes | ✅ |
| AU-2 | A secured address that a scheduler calls to drive recurring work | ✅ |
| AU-3 | Show live job status in the product | ✅ |
| AU-4 | Collection workflows with scheduled and manual runs, rate limits, logging, duplicate detection, validation and failure alerts | ○ Stage 3 (collection) and Stage 5 (alerts) |
| AU-5 | The ten-step weekly cycle: collect, compare, detect, score, analyse reviews, identify complaints, monitor competitors, recommend, report, notify | ○ Stage 5 |
| AU-6 | Different frequencies per marketplace or brand | ○ Stage 5 |

### 7.15 Settings, security and governance

| ID | Requirement | Status |
|---|---|:-:|
| SE-1 | Secure sign-in: strong password hashing, sessions that can be revoked, protection against password guessing | ✅ |
| SE-1a | People can change their own password; a forgotten password is recovered by a one-time link from an Administrator, or from the server command line if the only Administrator is locked out | ✅ |
| SE-2 | Six roles with a permission matrix enforced on the server for every action | ✅ |
| SE-3 | Brand-level access for external users; nothing visible unless explicitly granted | ✅ |
| SE-4 | Invitation by one-time expiring link; no self-registration | ✅ |
| SE-5 | A complete audit log that cannot be edited or deleted, even directly in the database | ✅ |
| SE-6 | A switch, off by default, that must be turned on before any brand content is sent to an outside AI service | ✅ |
| SE-7 | Secrets only in server configuration — never in the browser, the database or the code repository | ✅ |
| SE-8 | Uploaded files are verified, size-limited, stored outside the web folder and served only to signed-in users with access | ✅ |
| SE-9 | Requests from other websites are refused; standard security headers are set | ✅ |
| SE-10 | Database-level tenant isolation (Row Level Security) as a second line of defence | ○ Stage 6 |
| SE-11 | Single sign-on and two-step verification | ○ Stage 6 |
| SE-12 | Encrypted storage of marketplace credentials, with restricted outbound access for collectors | ○ Stage 3 |
| SE-13 | Backups with tested restore; error monitoring | ○ Stage 6 ([deployment guide](../guides/deployment.md)) |

Details are in the [security guide](../guides/security.md).

---

## 8. Data integrity requirements

This section is mandatory and overrides convenience everywhere else.

| ID | Requirement | Status |
|---|---|:-:|
| DI-1 | Every figure is exactly one of five classes — **verified, calculated, AI-assessed, estimated, missing** — and shows it | ✅ |
| DI-2 | The classes are never combined into one figure without showing the parts | ✅ by design · enforced in scoring in Stage 4 |
| DI-3 | Missing data is shown as "not available" with the reason — never as zero, never as "unavailable product" | ✅ |
| DI-4 | No official score is ever invented. A row in the official-score table exists only when the score was obtained through an authorised route | ✅ by design · exercised in Stage 4 |
| DI-5 | History is never overwritten. New observations, research and rule sets are new records | ✅ |
| DI-6 | Internal scores are reproducible from stored inputs and a versioned rule | ✅ marketplace priority score · ○ listing score in Stage 4 |
| DI-7 | Comparisons over time are like for like, and a change of method is flagged | ○ Stage 3 |
| DI-8 | Estimated commercial impact is never presented as a verified financial result | ○ Stage 5 |
| DI-9 | Demonstration data is flagged as such everywhere it appears and is limited to the fictional brand "Demo Botanics" | ✅ |
| DI-10 | Research data carries its source and access date | ✅ |

## 9. Other requirements

**Data collection.** Order of preference: official marketplace API → authorised data provider → approved retailer integration → permitted public collection → manual upload. The product never bypasses logins, CAPTCHAs, paywalls or technical blocks, and does not collect personal customer information.

**Languages.** The interface is in English. Content, search and requirements support English and Arabic from Build 1 (right-to-left display of Arabic text included); other languages can be added per market.

**Usability.** Written for people who are not technical: plain labels, an explanation on every screen of what the numbers mean, honest empty states, and no dead ends. Planned modules say what they will do, what already exists and what they need.

**Accessibility.** Keyboard-operable forms, labelled inputs, visible focus, and status conveyed by text as well as colour. A formal audit against WCAG 2.2 AA is Stage 6 work.

**Performance.** Pages should feel immediate for a team of tens of users and a catalogue of thousands of SKUs. Long work (reading documents, collection, scoring, AI) always runs in the background. Formal load testing is Stage 6.

**Reliability.** Background work retries with back-off and survives a restart. A failed collection is reported and never silently becomes data.

**Maintainability.** One pattern throughout: screens call thin actions, actions call services, and services check permission, scope by organisation and brand, and write the audit log. All checks — type-check, lint, unit, integration and browser tests — must pass before anything is called working.

## 10. Out of scope for Phase 1

- Publishing content to retailers automatically, and syndication networks.
- Sales and market-share estimation.
- Retail-media advertising management.
- Social, influencer, advertising, traditional-media and creative modules (Phase 3 — designed for, not built).
- Image-effectiveness prediction.
- A mobile app.

## 11. Designed for expansion

Later modules reuse what Phase 1 builds rather than starting again:

| Shared foundation | Used by e-commerce now | Reused later by |
|---|---|---|
| Brand knowledge base with trust labels | Listing content, answers to customer questions | Social captions, scripts, creative briefs, campaign ideas |
| Approved and restricted claims by market | Marketplace content checks | Every channel's copy checks |
| Approval workflow and version history | Listing content | Social posts, ad creative, briefs |
| Observation store with source, method and confidence | Listings, prices, reviews | Social account metrics, ad performance, creator data |
| Data-source registry and job queue | Marketplace connectors | Meta, TikTok, Google, Snapchat, Pinterest connectors |
| Themes and sentiment | Reviews | Social listening |
| Recommendations and tasks | Listing fixes | Campaign and content actions |
| Roles, brand-level access, audit log | All of the above | All of the above |

## 12. Decisions needed from the product owner

These are the points where the build waits for you. Each is explained in the [roadmap](09-roadmap.md#decisions-needed-from-you).

1. Which marketplaces to track first, and for each, **who is the seller of record**.
2. The **data-collection policy** for competitor data — Option A, B or C in Deliverable 4 — confirmed by legal counsel.
3. Where to **host** the product.
4. Whether to allow an **outside AI provider** to process brand content, and which.
5. Whether the proposed **listing quality weights** and **review themes** suit your categories.

## 13. How success will be judged

The product is working when these are true, and each is checkable from inside the product:

- Every tracked listing has a snapshot no older than its scheduled frequency, or a visible reason why not.
- Every internal score can be recalculated from stored inputs to the same value.
- No content reaches a retailer without a recorded approval.
- Every figure on every screen shows its source class; nothing shown is fabricated.
- A weekly report arrives without manual collection, and says so plainly when data is missing.
- Time from "retailer changed a rule" to "affected listings flagged" is days, not months.

## 14. Words used in this document

| Term | Meaning |
|---|---|
| **SKU** | One sellable unit: a specific variant, size and pack |
| **Barcode / GTIN / EAN / UPC** | The number under the barcode on the pack; the most reliable way to recognise the same product on different retailers |
| **Listing** | A product's page on one retailer |
| **Snapshot** | A dated copy of what a listing looked like when it was observed |
| **Seller of record** | The company whose account actually sells the product on a marketplace — you, the retailer or a distributor |
| **API** | An official channel through which a marketplace lets authorised software read data |
| **Data provider** | A company that sells structured data collected from public retailer pages |
| **Listing quality score** | A measure of how complete and effective a listing is — official when the retailer issues it, internal when this product calculates it |
| **Knowledge base** | Everything the engine knows about a brand, split into searchable passages with trust labels |
| **Passage** | A short section of a document or record, the unit that search returns |
