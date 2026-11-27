# How-to guide — everyday tasks

For brand teams and for whoever looks after the product. Each task says who may do it (the role needed) and the exact steps. If you have not installed the product yet, start with the [setup guide](setup.md).

| Task | Section |
|---|---|
| Invite your team | [1](#1-invite-your-team) |
| Add a brand and its knowledge | [2](#2-add-a-brand-and-its-knowledge) |
| Add products and SKUs | [3](#3-add-products-and-skus) |
| Find information | [4](#4-find-information) |
| Create a brand book or launch book | [4a](#4a-create-a-brand-book-or-launch-book) |
| Track prices | [5a](#5a-track-prices) |
| Choose marketplaces and add new ones | [5](#5-choose-marketplaces-and-add-new-ones) |
| Update marketplace requirements | [6](#6-update-marketplace-requirements) |
| Refresh the marketplace research | [7](#7-refresh-the-marketplace-research) |
| Look after automation | [8](#8-look-after-automation) |
| Check what happened | [9](#9-check-what-happened) |

---

## 1. Invite your team

**Who:** Administrator.

1. Open **Settings → Team**.
2. Under *Invite someone*, enter the person's email address and choose a role. The role's description appears below the list.
3. For an agency, choose **Agency Contributor** and tick the brands they may see. For an internal person you can also limit them to some brands; ticking nothing means all brands.
4. Press **Create invitation link**, then **Copy**, and send the link to the person by your usual email or chat. It is shown only once, works once and expires after 7 days.

No email is sent by the product. Nobody can sign up without an invitation.

**To change someone's role or brands, or to disable their account:** on the same page, open *Change role, access or password* under their name. Disabling an account signs the person out at once. The last Administrator cannot be removed or demoted.

**If someone forgets their password:** use **Create password-reset link** in the same place and send them the link. It works once, for 24 hours. For a locked-out Administrator, see the [setup guide, section 11](setup.md#11-if-you-forget-your-password).

## 2. Add a brand and its knowledge

**Who:** creating and editing a brand needs Administrator or Brand Manager. Content Editors and Agency Contributors can propose claims and upload documents.

### The brand profile

1. **Brands → New brand.** Only the name is required.
2. Fill in as much as you can: positioning, personality, tone of voice (include words to use and words to avoid), target audience, visual guidelines. The profile counts as approved brand knowledge.
3. You can return later with **Edit profile**.

### Documents and media

1. Open the brand, then **Documents & media**.
2. Choose what the file is (brand book, product catalogue, packaging file…) and, if it concerns one product, which one.
3. Drop the files in. Accepted: PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx), text, images and videos, up to 50 MB each.
4. Documents are read within seconds and become searchable. Their status changes to *Searchable*, with the number of passages found.
5. **Important:** everything taken from a document is labelled *unverified* until a Brand Manager presses **Approve as source**. Approve only documents that are current and authoritative, such as the signed-off brand book. Older decks and drafts can stay unverified; they remain searchable but are clearly marked.

Scanned PDFs (pictures of pages) are stored but cannot be read yet. Upload the original Word or PowerPoint file if you have it.

### Guidelines

1. **Guidelines → Add a guideline.** Choose a section (tone of voice, do's and don'ts, language and localisation…), give it a short title and write it as an instruction a copywriter could follow. Tick markets if it applies only to some.
2. It is saved as a **draft**. A Brand Manager presses **Approve**. Editing an approved guideline returns it to draft, so a change is always reviewed.

### Claims — what the brand may and may not say

1. **Claims → Propose a claim.** Write it exactly as it would appear in content, choose its type, the product it applies to (or the whole brand), the markets, and the evidence behind it.
2. Every new claim starts as **unverified** and is never used in content.
3. A Brand Manager either **approves** it, or chooses **Restrict…** and gives a reason. Restricted claims are the list of things content must never say, such as medical claims for cosmetics.
4. The Overview page shows how many claims are waiting for review.

### Competitors

**Competitors → Add a competitor** — the brand, its parent company and why it matters. This list is the starting point for competitor tracking in Stage 4.

## 3. Add products and SKUs

**Who:** Administrator, Brand Manager or Content Editor.

**Words:** a *product* is the parent item ("Nourishing Hair Oil"). A *SKU* is one sellable unit: a particular variant, size and pack ("Almond, 200 ml, twin pack"). Barcodes belong to SKUs.

### One at a time

1. **Product Catalogue → New product.** Choose the brand, give the parent name *without* size or pack, add the category, description, benefits (one per line), ingredients as printed on the pack, directions and warnings.
2. Set the status: *Draft* while information is incomplete (labelled unverified in search), *Active* when it is correct.
3. On the product page, under **Add a SKU**, enter each size and pack with its SKU code and barcode. The barcode's check digit is verified; a mistyped barcode is refused.
4. Add marketplace identifiers (for example an Amazon ASIN) with **Add identifier**, structured facts under **Attributes**, and the countries where it is sold under **Markets**.

A benefit listed on a product is not automatically an approved claim. To use it in content, also add it as a claim and have it approved.

### Many at once, from a spreadsheet

1. **Product Catalogue → Import from spreadsheet → Download template.**
2. Fill in one row per SKU. Rows with the same `product_name` belong to the same product. The column list on the import page explains each one. Separate several benefits or countries with `|`.
3. Save it as **CSV** (in Excel: *File → Save as → CSV UTF-8*; in Google Sheets: *File → Download → CSV*).
4. Choose the brand and the file, press **1 · Check file**. Nothing is saved yet. You see what would be created and updated, and every problem row with the reason.
5. Fix the problems in the spreadsheet if needed, check again, then press **2 · Import**.

Importing the same file again is safe: existing products and SKUs are updated, never duplicated, and empty cells never erase information already stored.

**Aim for a barcode on every SKU.** The catalogue shows how many are missing. Barcodes are how listings will be matched to your products in Stage 3.

## 4. Find information

**Knowledge Search** answers questions in your own words, in English or Arabic, for example *what can we say about dandruff?* or *ingredients of the hair oil*.

- Every result shows where it comes from (document and page, claim, guideline or product record) and whether it is **Approved**, **Unverified** or **Restricted — do not use**.
- Tick **Approved knowledge only** when you need something you can rely on in published content.
- **Open source record** takes you to the original. For documents you can download the file.

## 4a. Create a brand book or launch book

**Who:** Content Editors, Brand Managers and Administrators write books; only Brand Managers and Administrators approve them.

A *brand book* describes the whole brand; a *launch book* describes one new product or range. Both are put together from what the engine already knows, so nothing has to be retyped.

1. **Brand Books → Start a new book.** Choose the brand, the type and a title, and press **Create book**.
2. Fill in what you need — every part is optional:
   - **Cover:** subtitle, launch date and markets.
   - **The story:** what the brand stands for (or what you are launching and why), who it is for, key messages (one per line), tone of voice, do's and don'ts.
   - **Fonts:** name, what it is used for, how, and a link to where it is licensed. Press *+ Add a font* for more.
   - **Colours:** name and colour code (the six-character code from the design files, such as `#1F6B4A`). A swatch appears as you type.
   - **Claims:** tick the claims to include. **Only approved claims are offered.** The brand's restricted claims are added automatically under "Never say".
   - **Packshots and images:** tick images uploaded under *Brands → Documents & media*. Upload packshots there first.
   - **Products:** tick products; their names, categories and descriptions come from the Product Catalogue.
3. Press **Save draft**.
4. A Brand Manager presses **Approve**. Editing an approved book returns it to draft, with a new version number.
5. **View and print** shows the finished book. Use your browser's *Print* command and choose *Save as PDF* to share it. A draft is clearly marked "DRAFT — not yet approved" on the printed page.

If a claim in the book later stops being approved, it is left out of the printed book automatically, and the editor tells you which one.

## 5. Choose marketplaces and add new ones

**Who:** viewing needs any internal role. Recording decisions and adding platforms needs Administrator, Brand Manager or Analyst.

### Decide what to track

1. **Marketplace Intelligence** shows the five highest-ranked platforms per country. Choose a country to see all of them, or filter by region, kind, business model, data access or priority.
2. Open a platform. You see its priority score with the evidence behind each criterion, reach estimates (always labelled as estimates), how its data can legitimately be obtained, the official quality signals it publishes, and every source.
3. Under **Your decision**, choose *Tracked*, *Planned* or *Not tracked*, add a note and save.
4. Under **Are our brands sold here?**, record for each brand whether it is sold there and by whom: your own seller account, the retailer buying from you, or a distributor. **This answer matters:** it decides which official data routes are open to you in Stage 3.

The priority score is a calculation from researched evidence, not a market share. It is recalculated from the stored scores and weights every time research is loaded.

### Add a platform the research did not cover

At the bottom of **Marketplace Intelligence**, under *Add a platform we have not researched*, enter its name, country, website, kind and business model, and why you are adding it. It appears only for your organisation, marked *Added by your team*, and carries **no score** until it has been researched with evidence. To give it a researched score, add it to the research file for its country (section 7).

### Add a new country

A new country is a new research file. Follow section 7 and create `data/research/marketplaces/XX.json`, where `XX` is the country's two-letter code. The country appears in the product the next time the research is loaded.

## 5a. Track prices

**Who:** everyone with access to marketplaces can see prices; Administrators, Brand Managers and Analysts record them.

**Pricing Intelligence** keeps a dated history of what your products and your competitors' products cost on each marketplace, and shows who is cheaper per 100 ml, per 100 g or per item.

### Put products on the price board

1. **Pricing Intelligence → Add a product to track.**
2. Choose **Our product**, the brand, the SKU and the marketplace. Press **Add to price board**.
3. For a rival, choose **Competitor product**, the competitor brand (added under *Brands → Competitors*), its name, pack size and unit, and — important — **Compare with our SKU**. Choose the same marketplace and press **Add to price board**.

A product with no price yet shows *Not recorded* — never zero.

### Record a price

1. On the price board, open the product.
2. Enter the date you saw the price, the currency (filled in for the country), the regular price, and the promotional price and promotion if there is one. Say where the price came from: a website check, a seller-portal or retailer report, or a distributor report.
3. Press **Record price**. Each price is kept as a new dated record; nothing is overwritten.

### Read the board

| Column | Meaning |
|---|---|
| Latest price | The price paid at the last check; a promotional price shows the regular price struck through |
| Per unit | The price per 100 ml, per 100 g or per item, so different pack sizes can be compared ◆ calculated |
| Change | Up or down since the previous check |
| Price index | On competitor rows: our price per unit ÷ theirs × 100. **Above 100, we are dearer; below 100, we are cheaper.** Shown only when both are on the same marketplace, in the same currency, with comparable pack sizes — otherwise the reason is shown instead |

When marketplace connections arrive (Stage 3) they will add prices automatically to the same history, labelled with their source. To remove a product from the board, open it and press **Stop tracking**; its history is kept.

## 6. Update marketplace requirements

Each retailer's content rules are stored as one file in `data/research/requirements/`, for example `amazon.json` or `noon.json`. The **Requirements library** in the product shows what is loaded and which version.

**When to update:** when a retailer announces a change (for example Amazon's 75-character title rule of 27 July 2026), and as a routine check each quarter.

**How it works:** you edit the file and the product loads it as a **new version**. The previous version is kept and marked *superseded*, so you can always see what the rule used to be. Nothing is overwritten.

### Steps

1. Open the retailer's file in a text editor. (On GitHub you can edit it in the browser with the pencil icon.)
2. Change `research_date` at the top to today's date, written as `YYYY-MM-DD`.
3. Change, add or remove rules in the `rules` list. Each rule looks like this:

```json
{
  "id": "title.max_length",
  "area": "title",
  "requirement": "Titles must not exceed 75 characters, including spaces.",
  "rule_type": "max_length",
  "value": 75,
  "unit": "characters",
  "severity": "mandatory",
  "applies_to_country_codes": ["US", "GB", "IN"],
  "effective_date": "2026-07-27",
  "source_url": "https://sellercentral.amazon.com/help/hub/reference/external/GYTR6SYGFA5E3EQC",
  "source_title": "Product title requirements",
  "source_date": "2026-07-27",
  "verification": "official_document",
  "notes": "Not applied in the UAE and Saudi Arabia stores."
}
```

| Field | What to put |
|---|---|
| `id` | A short unique name for the rule. Keep the same `id` when you change a rule, so its history lines up |
| `area` | One of: `title`, `description`, `bullets`, `attributes`, `identifiers`, `images_main`, `images_secondary`, `video`, `enhanced_content`, `seo`, `variants`, `language`, `approval`, `restricted_claims` |
| `requirement` | The rule in plain words |
| `value`, `unit` | A number and its unit, if the rule has one (75 characters, 1000 pixels) |
| `severity` | `mandatory` (the retailer enforces it — breaking it can get a listing rejected), `recommended` (the retailer's own advice) or `informational` |
| `applies_to_country_codes` | The stores it applies to. Empty means all of the file's countries |
| `source_url` | **Required in practice.** The retailer's own page that states the rule. Only rules with a source should be added |
| `verification` | `official_document` if you read it on the retailer's own page; `secondary_quote` if from an agency or article; `unverified` otherwise |

4. Official quality signals the retailer publishes go in `official_quality_signals`. Record only signals the retailer itself documents, with the retailer's own name for them. Never add a score the retailer does not publish.
5. Save the file. To check it before loading, a developer can run `npm test` — one test reads every research file and reports any that cannot be loaded.
6. **Load it:**
   - on your own computer, stop and restart the product (`npm run dev`);
   - on a hosted installation, deploy the change; the deployment runs `npm run db:migrate`, which loads it.
7. Open the **Requirements library**. The retailer now shows the new version number and date.

A rule that cannot be read is skipped on its own and reported in the terminal or deployment log; the rest of the file still loads.

**A new retailer:** create a new file named after it, such as `sephora.json`, copying the layout of an existing file. For the product to link the new rules to that retailer's marketplace pages, a developer adds one line to the list `FAMILY_PATTERNS` in `src/db/reference-data.ts`, saying which platform names and countries the file applies to.

From Stage 4, when a rule set changes, listings checked against the old version will be flagged for reassessment automatically.

## 7. Refresh the marketplace research

The research behind Marketplace Intelligence lives in `data/research/marketplaces/`, one file per country (`AE.json`, `SA.json`, `ZA.json`…). Refresh a country yearly, or when you enter it.

1. Open the country's file and change `research_date` to today.
2. Update the platforms. For each platform, the five scores under `priority_scores` (each 1 to 5, with a `note` saying what evidence the score rests on) decide its rank. Each piece of evidence goes in `consumer_reach_evidence` with its source, and every source in `sources` with its address and the date you read it.
3. You do not need to calculate totals or ranks. The product recalculates them on loading and ignores any total written in the file.
4. Save, and load the file as in section 6, step 6.

The previous research is kept: each platform page lists its research history with dates. The research was originally produced with the method described in [Deliverable 3](../research/03-global-marketplace-research.md). An AI research assistant can be given that document and an existing file as a model, but **every figure must carry a source address that a person has checked**. The product never invents data, and research files must not either.

## 8. Look after automation

Today the background work is reading uploaded documents and preparing them for search. It starts by itself after each upload.

| What to check | Where | How often |
|---|---|---|
| Jobs are succeeding | **Automation → Background work — live**. Status should be *Succeeded*. A *Failed* job shows its error | Weekly, or when a document stays "being read" |
| The scheduler is connected (hosted installations) | **Automation → Scheduler** shows *Heartbeat secured* | After any hosting change |
| A document failed to read | **Brands → Documents & media**: the document shows the reason and a button to try again | When it happens |

**If the scheduler stops working:** check the scheduled task still exists at your hosting provider and that `JOBS_SECRET` there is unchanged. The setup steps are in the [setup guide, section 9](setup.md#9-background-work-and-the-scheduler). Without a scheduler, uploads are still processed straight away; only automatic retries wait.

**To rotate the scheduler's secret** (for example when someone who knew it leaves): create a new secret, update `JOBS_SECRET` in the hosting settings, update the scheduled task to use the new value, restart the product.

From Stage 3, the same screen will show scheduled data collection: each run, what it collected, what failed and why, and the frequency set for each marketplace.

## 9. Check what happened

**Settings → Audit log** (Administrator, Brand Manager, Analyst) lists every change: who, when and what, including sign-ins, approvals, uploads, imports, role changes and password resets. Filter by type at the top. Entries cannot be edited or deleted, even directly in the database.
