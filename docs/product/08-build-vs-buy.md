# Deliverable 8 — Build-versus-Buy Analysis

**Should the Brand Intelligence Engine be bought, built, or a mixture — and what does each cost to set up, run and maintain?**

**Prepared:** 26 November 2026 · **Evidence:** [Deliverable 2 — Capability Matrix](../research/02-competitor-capability-matrix.md), [Deliverable 4 — API and Data Feasibility](../research/04-api-data-feasibility.md), Appendices [A1](../research/appendix/A1-digital-shelf-analytics-vendors.md), [A2](../research/appendix/A2-pim-syndication-reviews-vendors.md) and [D2](../research/appendix/D2-data-providers-and-legal.md)

> **How to read the numbers.** Every figure is one of three kinds and is labelled:
> **PUBLIC PRICE** — read from the supplier's own price page on 26 November 2026.
> **THIRD-PARTY ESTIMATE** — published by a price-comparison site, not by the vendor.
> **ESTIMATE** — our own arithmetic from public unit prices and stated assumptions. An estimate is a planning aid, not a quotation.
> No vendor was contacted and nothing was purchased or trialled.

---

## 1. Recommendation in one page

**Build a brand-owned engine, integrate official marketplace APIs for your own listings, buy data selectively for the competitor view, and do not buy an enterprise platform now.**

| | Option 1 — Buy an enterprise suite | Option 2 — Buy mid-market tools | **Option 3 — Brand-owned engine (recommended)** |
|---|---|---|---|
| What it is | A digital-shelf platform plus a product-information system plus a review network | A lower-cost digital-shelf tool plus a low-cost product-information tool | The product in this repository, extended stage by stage, with official APIs and licensed data plugged in |
| Covers your nine markets? | **No evidence** beyond the US and UK for the leaders; none for Kenya or Nigeria from anyone | Amazon stores in five of nine countries; little else | Whatever you connect: any platform by spreadsheet from day one, official APIs where the seller account authorises them |
| Approved-claims control, beauty and Arabic rules, explainable scores | Not described by any vendor | Not offered | Built in — this is the design centre |
| Yearly running cost | Not public. THIRD-PARTY ESTIMATE for a product-information system and a review network alone: about **$83,000–$88,000** (median contract values), before the digital-shelf platform | PUBLIC PRICE from about **$4,700** at entry tiers; ESTIMATE **$12,000–$48,000+** once several modules are needed | ESTIMATE **about $850–$11,000** for hosting, data and AI usage — plus maintenance time |
| Setup | Vendor implementation, usually with a partner; months | Days to weeks | Build 1 exists. ESTIMATE 17–28 person-weeks of development remain for Stages 3–6 |
| Who maintains it | The vendor | The vendor | You — ESTIMATE 2–4 days a month |
| You own the data and the knowledge base | No — exports only | No — exports only | Yes |
| Main risk | Paying for coverage you cannot use; consolidation (Salsify, Syndigo, 1WorldSync all changed hands) | Outgrowing it; still two tools that do not share a brand knowledge base | Depends on someone maintaining it; connectors must be kept working |

**Why not simply buy.** Cost is not the main reason. The main reason is fit: the leading platforms are strongest in the US and UK and on Amazon, publish no evidence for Noon, Takealot, Jumia, Shopee, Lazada or the Kenyan and Nigerian platforms, and none offers approved-claims control or beauty- and Arabic-specific rules. Buying would leave the central problem unsolved in seven of your nine markets.

**What is worth buying.** Data, not platforms: a licensed data provider for the competitor view (after the policy decision in Deliverable 4), and — only if the US and UK become priorities — a sales and market-share estimate from a specialist, because that cannot be built.

**What would change this recommendation** is set out in section 8.

---

## 2. The reference programme used for every estimate

Costs depend on scale, so every estimate below uses the same assumed programme. Change the assumptions and the costs scale roughly in proportion.

| Assumption | Value |
|---|---|
| Products (SKUs) | 200 |
| Priority marketplaces monitored | 5 |
| Listings (SKU × marketplace) | 1,000 |
| Team members using the product | 10 |
| Competitor monitoring | 500 product pages and 100 search pages per run (the programme costed in Appendix D2) |
| New customer reviews analysed | 5,000 a month |

---

## 3. Option 3 in detail — what the brand-owned engine costs

### 3.1 Setup cost (one-off)

**What already exists.** Build 1 — the foundation described in [Deliverable 10](10-first-build.md) — is complete and tested: about 17,400 lines of application and test code, a 65-table database design covering all of Phase 1, 132 automated tests and research data for 130 platforms. It was produced by an AI coding agent working from your specification.

**What remains.** ESTIMATE, in weeks of work for one experienced full-stack developer. These are planning ranges based on the size of Build 1 and the scope in the [roadmap](09-roadmap.md); they are not a quotation.

| Stage | Scope | ESTIMATE (person-weeks) | What it waits on |
|---|---|---|---|
| 3 — E-commerce intelligence | Listing import, SKU-to-listing matching, snapshots and change detection, first two official connectors (Amazon, Noon) | 4–7 | Seller-of-record answers; API applications approved |
| 4 — Scoring and insight | Internal listing quality score, official score import, image checks, ratings and reviews, competitor tracking | 5–8 | Stage 3 data; data-collection policy decision |
| 5 — AI and automation | Content Studio with approvals, recommendations, weekly report and exports, scheduled workflows | 5–8 | AI provider approved; Stages 3–4 |
| 6 — Production readiness | Database-level tenant isolation, cloud file storage, single sign-on, monitoring, backups, security review | 3–5 | Hosting decision |
| **Total remaining** | | **17–28** | |

To turn this into money, multiply by the rate of whoever builds it. No day rate is assumed here because rates vary several-fold by country and by whether the work is done by an employee, a contractor or an AI coding agent under your direction. If the remaining stages are built the way Build 1 was, the cost is your AI coding subscription or usage plus your own review time, and elapsed time is driven mostly by decisions, account approvals and testing against real accounts rather than by writing code.

**Accounts to open (no fee found for any of them):**

| Account | Needed for | Fee |
|---|---|---|
| Amazon Selling Partner API developer registration | Own-listing data on Amazon | None — Amazon's planned fee was cancelled (confirmed on Amazon's site) |
| Noon partner API access | Own-listing data on Noon | None found |
| Walmart, Takealot, Shopee, Lazada, TikTok Shop, Flipkart developer access | Own-listing data, where you sell there | None found |
| Amazon Brand Registry (Brand Representative role) | Search reports and content alerts | None found; requires a registered trade mark |
| Google Merchant Center | Market benchmarks | Free |

### 3.2 Running cost (recurring)

**Hosting.** PUBLIC PRICES as shown on each provider's pricing page on 26 November 2026. The product needs one always-on application server with a persistent disk, and a PostgreSQL database with the pgvector extension.

| Provider | What was shown |
|---|---|
| [Supabase](https://supabase.com/pricing) (database, file storage) | Free plan $0. Pro from $25 a month, including $10 of compute credit, 8 GB database disk and 100 GB file storage. Larger database computers: Small $15, Medium $60, Large $110 a month |
| [Render](https://render.com/pricing) (application server) | Professional workspace $25 a month. Web service instances: $7 (0.5 GB memory), $25 (2 GB, 1 CPU), $85 (4 GB, 2 CPU) a month |
| [Railway](https://railway.com/pricing) (application server and database) | Hobby $5, Pro $20 a month, plus usage: memory $0.00000386 per GB-second, CPU $0.00000772 per vCPU-second, outbound data $0.05 per GB |
| [Vercel](https://vercel.com/pricing) | Hobby $0, Pro $20 a month plus usage. **Not suitable for Build 1 as it stands** — see the note below |

*Memory needed.* Measured in this session: the production server used about 0.86 GB of memory with the built-in database and the language model for search both loaded. With an external PostgreSQL database the figure will be lower. A 2 GB instance is the sensible starting size.

*Why not a serverless host such as Vercel today.* Build 1 keeps uploaded files and the search model on the server's own disk and runs background jobs inside the server process. Serverless platforms give neither a persistent disk nor a long-running process. Moving file storage to cloud object storage is Stage 6 work; until then, use a host that offers a persistent disk.

ESTIMATE for a small production installation:

| Item | ESTIMATE per month | Basis |
|---|---|---|
| Application server, 2 GB memory | $25–$50 | Render's 2 GB instance at $25 plus the workspace plan; or Railway Pro at $20 plus usage (2 GB held for a month is about $20 of memory at the unit price above; CPU is charged only when used) |
| PostgreSQL with pgvector | $25–$40 | Supabase Pro at $25; a larger database computer if history grows |
| File storage | $0 | Included in the above at this scale |
| **Infrastructure total** | **$50–$90** | |

**Marketplace data.**

| Item | ESTIMATE per month | Basis |
|---|---|---|
| Official marketplace APIs | $0 | No usage fee found for any of them |
| Licensed data provider — weekly competitor run | $0–$95 | Appendix D2 arithmetic for 500 product pages and 100 search pages |
| Licensed data provider — daily competitor run | $27–$670 | Same programme, run daily. The spread comes mainly from how each provider bills a search page |

This line is zero if you choose policy Option A (official sources only) in [Deliverable 4, section 6](../research/04-api-data-feasibility.md#the-policy-decision).

**AI model usage (Stage 5 onwards).** The engine calls an AI model to draft content, assess listings, classify reviews and write the weekly summary. You pay per use. The estimate uses Anthropic's published prices for Claude models as recorded on 3 November 2026 — confirm them on the [official pricing page](https://platform.claude.com/docs/en/about-claude/pricing) before budgeting. Prices are per million *tokens* (a token is about three-quarters of a word).

| Model (PUBLIC PRICE) | Reading | Writing | Suited to |
|---|---|---|---|
| Claude Opus 5.5 | $4.00 | $20.00 | Writing content, judging listings, weekly analysis — the default |
| Claude Sonnet 5.5 | $2.00 | $10.00 | The same work at half the price, if quality proves sufficient |
| Claude Haiku 5.5 | $0.10 | $0.50 | High-volume sorting, such as classifying reviews |

Work that nobody is waiting for — which is most of this product's AI work — can be sent as an overnight batch at half price.

ESTIMATE for the reference programme. The token counts are planning assumptions; real usage will be measured from the first week of Stage 5 and shown in the product.

| Task | Assumption per item | Volume | ESTIMATE per month, Opus 5.5 at list price | With batch pricing and Haiku 5.5 for review sorting |
|---|---|---|---|---|
| Content drafts — first full set (one-off) | 8,000 tokens read, 5,000 written | 1,000 listings, once | *$132 once* | *$66 once* |
| Content drafts — ongoing | as above | 100 a month | $13 | $7 |
| Listing assessment, including images | 12,000 read, 2,000 written | 200–1,000 listings a month (only listings that changed need re-assessing) | $18–$88 | $9–$44 |
| Review classification | 500 read, 300 written | 5,000 reviews a month | $40 | $1 |
| Weekly report and recommendations | 40,000 read, 6,000 written | 4 a month | $1 | $1 |
| **AI total** | | | **$72–$142** | **$18–$53** |

Which model to use for which task is your decision; the engine will record the model and prompt version behind every AI output so quality and cost can be compared. Meaning-based search does **not** add to this: it runs on your own server with an open model and costs nothing per use.

**Not yet priced** (decide in the stage shown): an email service for invitations and report delivery (Stage 5); error monitoring and uptime alerts (Stage 6); "Verified by GS1" barcode-ownership checks in bulk (price not published — ask your local GS1 office).

### 3.3 Total running cost — ESTIMATE

| Scenario | Per month | Per year |
|---|---|---|
| **Minimum** — official APIs and spreadsheets only, no competitor data, modest AI use | about $70–$145 | about $850–$1,750 |
| **Typical** — weekly competitor run through a provider, AI on batch pricing | about $70–$240 | about $850–$2,900 |
| **Intensive** — daily competitor run on the most expensive provider billing, AI at list price | about $150–$900 | about $1,800–$10,800 |

The summary table in section 1 quotes the full range: **about $850–$11,000 a year.** The bottom of *Typical* equals the bottom of *Minimum* because some providers' free allowances cover a small weekly run.

### 3.4 Maintenance

A product you own is a product you maintain. ESTIMATE: **2–4 days a month** once all stages are live, made up of:

| Recurring work | How often | Why |
|---|---|---|
| Keep marketplace connectors working | Whenever a marketplace changes its API | Marketplaces revise and retire API versions on their own timetable |
| Refresh the requirements library | Quarterly, and when a retailer announces a change | Content rules move — Amazon's title limit dropped from 200 to 75 characters on 27 July 2026. The product versions every rule set, so a refresh adds a version rather than overwriting |
| Refresh marketplace research | Yearly, or when you enter a market | Rankings rest on dated evidence |
| Software updates and security patches | Monthly | Standard practice |
| Check backups can be restored | Quarterly | A backup that has never been restored is not a backup |
| Review AI output quality and cost | Monthly from Stage 5 | Models and prices change |

The research refresh is repeatable: the research files, their format and the loader are in the repository, and loading a new file creates a new dated version automatically ([how-to guide](../guides/how-to.md#6-update-marketplace-requirements)).

### 3.5 Scalability

| Dimension | Reference programme | What happens at ten times that | Design answer |
|---|---|---|---|
| Listing snapshots | 1,000 listings daily ≈ 365,000 a year | 3.65 million a year | Comfortable for PostgreSQL. Each snapshot stores a content fingerprint so unchanged listings need not store a second full copy; raw payloads can move to file storage |
| Price, stock and rating observations | A few million rows a year | Tens of millions | Append-only tables indexed by listing and time; partition by month if needed |
| Knowledge base | Thousands of passages | Hundreds of thousands | Today meaning-search compares the question with every passage exactly, which suits tens of thousands of passages. Beyond that, pgvector's approximate index (HNSW) is added with one database migration |
| Users | 10 | 100 | One application server is enough; a second can be added because sign-in sessions and jobs live in the database, not in server memory |
| Brands and organisations | A handful of brands | Dozens | Every record carries its organisation and brand; agency users are confined to assigned brands |
| Marketplaces | 5 | 50 | Adding a marketplace is data, not code, unless it needs a new official connector |
| Background work | Runs inside the application server | Needs dedicated workers | The job queue already supports several workers safely; splitting them out is a deployment change |

**Where the design will need reinforcing as it grows:** database-level tenant isolation and cloud file storage (both scheduled for Stage 6), and a dedicated worker process once scheduled collection starts in earnest.

---

## 4. Option 1 in detail — buying an enterprise suite

**What you would be buying:** a digital-shelf analytics platform (Profitero+, CommerceIQ, NIQ, DataWeave or Stackline), a product-information system (Salsify, Syndigo or Akeneo) and, for review collection, a review network (Bazaarvoice or PowerReviews).

**Price evidence.** None of the five largest digital-shelf vendors publishes a price.

| Product | Evidence | Kind |
|---|---|---|
| Salsify | Median contract $52,100 a year (range $21,467–$86,250) | THIRD-PARTY ESTIMATE (Vendr) |
| Bazaarvoice | Median $36,002 a year (range $12,300–$98,843) | THIRD-PARTY ESTIMATE (Vendr) |
| PowerReviews | Median $31,000 a year (range $9,594–$41,969) | THIRD-PARTY ESTIMATE (Vendr) |
| Akeneo | Growth package $45,000 (period not stated). Community Edition is free and open source | THIRD-PARTY ESTIMATE (GetApp) / PUBLIC |
| Pimcore | From $9,900 a year; free only for organisations under €5 million revenue | PUBLIC PRICE |
| Revuze (review analytics) | $30,000 "per feature" per year | THIRD-PARTY ESTIMATE (GetApp) |
| Profitero+, CommerceIQ, NIQ, DataWeave, Stackline | By quotation only. The single third-party figure found (CommerceIQ, "$25,000" with an implausible unit) should not be relied on | — |

A product-information system plus a review network therefore comes to roughly **$83,000–$88,000 a year at median contract values** (Salsify with PowerReviews or Bazaarvoice) **before** the digital-shelf platform and before implementation services.

**Strengths.** Daily monitoring at scale; mature retailer connections and requirement libraries for US and UK retailers; sales and market-share estimates for Amazon; vendor support and service levels; nothing to maintain.

**Why it does not fit now.**

- **Coverage.** No public evidence for Noon, Takealot, Jumia, Shopee, Lazada, Nykaa or any Kenyan or Nigerian platform. The widest *confirmed* digital-shelf coverage found is 42Signals, at five of your nine countries.
- **Distinctive needs are absent.** No vendor describes an approved-claims register that controls AI output, beauty-specific checks, Arabic-language content rules, or a score whose formula you can read and change.
- **Official scores.** Only one vendor (Profitero+) describes importing an official retailer score, and only Walmart's.
- **Lock-in during consolidation.** Syndigo bought 1WorldSync and PowerReviews; Cinven agreed to buy Salsify in July 2026.
- **Your knowledge stays theirs.** The brand knowledge base — the asset the later social, advertising and creative modules depend on — would live inside a vendor's product.

## 5. Option 2 in detail — mid-market tools

| Product | PUBLIC PRICE | What you get |
|---|---|---|
| MetricsCart | Starter from $300 a month: up to 50 SKUs, 3 data sources, 1 module. Enterprise from $1,000 per module per month. No annual contract | Digital-shelf monitoring; evidence of Amazon coverage in the UAE, Saudi Arabia, US, UK and India |
| 42Signals | By quotation; its enquiry form offers budget bands from "less than $500" to "above $5,000" a month | Widest confirmed country coverage found (five of nine); general claims for the rest |
| Plytix | By SKU tier with unlimited users: 1,000 SKUs at 89 / 229 / 829 a month; 5,000 SKUs at 159 / 299 / 969 a month (Standard / Pro / Enterprise; shown in dollars, with the same figures quoted in euros in the page's FAQ). Free for 100 SKUs or fewer | Product-information management and feeds |
| Helium 10 | $99–$359 a month; enterprise from $1,499 a month | Amazon seller tools only |

ESTIMATE: an entry combination (MetricsCart Starter plus Plytix Standard at 1,000 SKUs) is about **$389 a month, or $4,700 a year** — but that covers 50 SKUs and one monitoring module. Covering the reference programme with several modules at the vendor's published "from $1,000 per module per month" would be **$12,000–$48,000 a year or more** for one to four modules.

**Verdict.** A reasonable stop-gap for Amazon monitoring if a view of Amazon is needed before Stage 3 is built, and MetricsCart's no-contract terms make it low-risk to try. It does not provide the brand knowledge base, claims control, or coverage of the regional platforms.

---

## 6. Capability by capability

The full table, with the evidence behind each line, is in [Deliverable 2, section 6](../research/02-competitor-capability-matrix.md#6-buy-integrate-or-build--capability-by-capability). In summary:

| Decision | Capabilities |
|---|---|
| **Build** (done or planned) | Brand and product knowledge base; asset library; requirements library; internal listing quality score; product matching (barcode first); review themes and sentiment; rule-based image checks; AI content generation; alerts, scorecards, weekly report, automation |
| **Integrate** official APIs | Own-listing content, price, stock and issues; official quality scores where they exist; own review text (Shopee, Lazada, review-network exports); Amazon Brand Analytics |
| **Buy data** — after the policy decision | Competitor listings; ratings and review counts; search position |
| **Buy only if needed** | Sales and market-share estimates (US and UK only); image-effectiveness scoring |
| **Defer** | Syndication to retailers; retail-media advertising (Phase 3) |

---

## 7. Risks of the recommended option, and how each is contained

| Risk | Containment |
|---|---|
| Nobody is available to maintain it | Documentation is written for a non-developer owner; the code follows one pattern throughout ([architecture](../architecture/07-system-architecture.md)); 132 automated tests catch regressions; any developer familiar with TypeScript and PostgreSQL can pick it up |
| A marketplace changes or withdraws an API | Each connector is separate; spreadsheet import always works as a fallback; every observation records its collection route, so switching routes does not corrupt history |
| Distributors, not the brand, hold the seller accounts | Raised now, before Stage 3 — see [Deliverable 4, section 4](../research/04-api-data-feasibility.md#4-what-a-brand-that-sells-through-distributors-can-and-cannot-get) |
| Legal exposure from collecting competitor data | A policy decision with counsel comes first; official sources are the default; the product's own rules exclude logins, CAPTCHAs and personal data |
| AI output quality or cost drifts | Every AI output records its model and prompt version; a person approves everything before use; spending is visible in the product |
| The build takes longer than estimated | Each stage delivers working features on its own; the order can be changed; nothing depends on finishing everything |

## 8. What would change the recommendation

Revisit buying if any of these becomes true:

1. **The US and UK become the main markets and sales or market-share estimates are essential.** That data comes from shopper panels and cannot be built.
2. **Content must be published to many retailers automatically.** A syndication network is a vendor's moat — and the first product deliberately does not publish.
3. **The catalogue grows into thousands of SKUs with a large content team.** A dedicated product-information system (Plytix at a public price, or Akeneo Community Edition, free and maintained) can sit alongside the engine.
4. **A vendor proves coverage of your markets in writing.** Ask the five questions in [Deliverable 2, section 8](../research/02-competitor-capability-matrix.md#8-questions-to-put-to-any-vendor-before-buying). A demo from 42Signals and from one enterprise vendor would cost nothing and would test the coverage finding directly.
5. **No one can be found to maintain a custom product.**

## 9. What this analysis did not do

- No vendor was asked for a quotation, so enterprise prices remain third-party estimates.
- No product was trialled; vendor capabilities are as published.
- Developer cost is given as effort, not money.
- AI usage is estimated from assumptions, not measured.
- Hosting prices were read from public pages on one day and will change.
- The product has not yet been deployed to any of the hosting providers named; see the [deployment guide](../guides/deployment.md) for what has and has not been tested.
