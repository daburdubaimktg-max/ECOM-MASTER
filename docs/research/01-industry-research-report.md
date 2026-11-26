# Deliverable 1 — Industry Research Report

**The digital shelf, product information, e-commerce intelligence and review intelligence market**

**Research date:** 26 November 2026 · **Prepared for:** the product owner of the Brand Intelligence Engine · **Detail and all source citations:** Appendices [A1](appendix/A1-digital-shelf-analytics-vendors.md), [A2](appendix/A2-pim-syndication-reviews-vendors.md), [C1](appendix/C1-content-requirements-amazon-walmart-noon.md), [C2](appendix/C2-content-requirements-regional-retailers.md), [D1](appendix/D1-official-apis.md), [D2](appendix/D2-data-providers-and-legal.md)

---

## 1. The ten things to know

1. **Nobody sells what you asked for as one product.** The market is split into four separate product categories — digital-shelf analytics, product information management (PIM), ratings-and-reviews networks, and data providers — each sold separately, mostly by quotation.
2. **The leaders are strongest where you need them least.** Public evidence for the big platforms centres on US and UK retailers and on Amazon. None of the five largest digital-shelf vendors publishes a retailer list by country, and none names Noon, Takealot, Jumia, Shopee or Lazada on any page we could read. No vendor has confirmed coverage of Kenya or Nigeria.
3. **Regional coverage comes from smaller, India-rooted vendors** — 42Signals, Paxcom and DataWeave — plus tools that cover only Amazon's Gulf stores.
4. **Official "listing quality scores" are rarer than the industry's language suggests.** Amazon has an official *Listing Quality Indicator* (Poor → Optimized) inside Seller Central only — no number, no API. Walmart, Shopee, Lazada, TikTok Shop and Takealot do expose a score by API, for your own listings only. Noon exposes content completeness and quality-check status by API, not a score. The popular "Amazon LQI" and "Listing Optimization Score" are third-party tools' own metrics, not Amazon's.
5. **Official APIs serve your own listings and almost nothing about competitors.** That one fact shapes the whole product: your own shelf can be monitored through official channels; the competitor shelf cannot.
6. **Selling through distributors removes most official data access.** Marketplace APIs answer only for the account that sells the product. Where a distributor is the seller of record, the brand needs the distributor's cooperation written into the agreement.
7. **Review text is the hardest data to get legitimately.** Amazon has required a login to read full review pages since November 2024; review networks give brands their own reviews but only benchmarks about competitors; one network's API terms forbid competitive use outright.
8. **Content rules move.** Amazon cut its title limit from 200 to 75 characters on 27 July 2026 and added a new 125-character "Item highlights" field — but not yet in the UAE or Saudi stores. A requirements library must be versioned and dated, or it will silently go wrong.
9. **The category is consolidating and rebranding around AI agents.** Syndigo bought 1WorldSync (and with it PowerReviews); Cinven agreed to buy Salsify in July 2026; nearly every vendor announced "agentic" features in 2025–26. Contract and roadmap risk is real for anything bought now.
10. **No vendor's public material describes beauty-specific checks or Arabic-language content rules.** That, together with approved-claims control and an explainable score, is where a brand-owned engine is genuinely different.

**Conclusion:** build a brand-owned engine, integrate official APIs for your own listings, buy data selectively for the competitor view after a policy decision, and treat the big platforms as optional additions for the US and UK rather than as the foundation. The cost comparison is in [Deliverable 8](../product/08-build-vs-buy.md).

---

## 2. How this research was done, and its limits

Ten parallel research streams were run on 26 November 2026, each required to cite a retrieved source for every claim and to label anything it could not confirm. Their full outputs are the appendices; this report is the synthesis.

Honest limits:

- **Vendor claims are unaudited.** Retailer counts, accuracy figures and AI features are what vendors say about themselves. No product was trialled.
- **The session's shared web-search allowance ran out part-way through.** Later work relied on opening known pages directly, so discovery of alternative vendors was thinner than planned and no analyst reports (Gartner, Forrester, IDC) were read.
- **Review sites largely refused automated access** (G2, Gartner Peer Insights, TrustRadius), so customer-reported weaknesses come mainly from Capterra.
- **Enterprise prices are not public.** Where a figure appears it is either the vendor's published price or a third-party estimate, and is labelled.
- **"No evidence found" is not "not offered."** It means: ask the vendor for it in writing.

**Independent spot-checks.** Four of the most decision-critical claims were re-verified by opening the cited primary source directly; all four matched word for word:

| Claim | Primary source checked |
|---|---|
| Amazon titles: 75 characters, plus 125-character Item highlights; requirement excludes Saudi Arabia, Egypt, Türkiye and the UAE | [Amazon Seller Central — Product title requirements](https://sellercentral.amazon.com/help/hub/reference/external/GYTR6SYGFA5E3EQC) |
| Amazon "will not move forward with the SP-API usage and annual fees at this time" | [Amazon — Cancellation of Third-Party Developer SP-API Fees](https://developer.amazonservices.com/cancellation-of-sp-api-fees) |
| Bazaarvoice APIs may not be used "for any other benchmarking or competitive purposes" | [Bazaarvoice — API Terms of Use](https://www.bazaarvoice.com/legal/terms-of-use/api) |
| Cinven agreed to acquire Salsify on 22 July 2026 | [Salsify press release](https://www.salsify.com/press-release-cinven-international-private-equity-firm-to-acquire-salsify-inc) |

---

## 3. The market in four layers

### 3.1 Digital-shelf analytics — "how do my products look and perform on retailer sites?"

**What they do.** Monitor price, promotions, availability, search position, content compliance, ratings and reviews across retailer sites every day, and turn the result into scorecards and alerts. The larger ones add sales and market-share estimates and tie into retail-media advertising.

**Who.** Profitero+ (Publicis Groupe), CommerceIQ (which absorbed e.fundamentals), NIQ Digital Shelf (formerly Data Impact, alongside NIQ Brandbank for content), DataWeave and Stackline are the established names. Flywheel (Omnicom) and Pacvue approach from retail media. Smaller or more specialised: Paxcom, 42Signals, MetricsCart, Vizit (image effectiveness), Similarweb Retail Intelligence, Helium 10 and Jungle Scout (Amazon seller tools). PriceSpider now trades as Wayvia.

**How they get data.** Mostly by collecting retailer web pages at scale — the four largest each claim well over a thousand retailers or sites (company-reported) — combined with account-level links to Amazon and Walmart where the client authorises them, and, for sales estimates, shopper panels or retail measurement that cannot be collected from web pages at all.

**How they charge.** By quotation. Only two publish prices: MetricsCart (from $300 a month) and Helium 10 ($99–$359 a month, enterprise from $1,499). 42Signals' enquiry form shows budget bands of $500 to $5,000+ a month. The one third-party figure found for an enterprise platform (CommerceIQ on Capterra, "$25,000") has an implausible unit and should not be relied on.

**What they do well.** Daily monitoring at scale; matching the same product across retailers (AI plus human checking against a barcode reference); acting automatically on Amazon (content correction, case filing, ad bids that react to stock); Amazon sales and share estimates.

**What is commonly missing.** Provable coverage of the Middle East, Africa and South-East Asia; official retailer scores (the only evidenced case is Walmart's); beauty-specific checks; Arabic and bilingual content checks; image analysis beyond counting and measuring (only Vizit scores images for likely conversion); price transparency.

### 3.2 Product information management and syndication — "one master record, published everywhere"

**What they do.** Hold the master product record (attributes, copy, images), check it against each retailer's requirements, and publish it to retailers through maintained connections.

**Who.** Salsify, Syndigo (now including 1WorldSync, PowerReviews and Taggstar) and Akeneo lead; inriver, Pimcore, Sales Layer, Plytix and Productsup follow.

**The valuable part** is the maintained requirement libraries and retailer connections (Syndigo cites 23,000 requirement sets; company-reported). **The weak part for you** is that those networks show no evidence of Noon, Takealot, Jumia, Flipkart, Nykaa or Lazada; Shopee appears only as a Plytix feed, and Amazon.ae/.sa only in Akeneo's channel list.

**Price evidence.** Plytix alone publishes a full list: free up to 100 SKUs, about 299 a month at 5,000 SKUs, unlimited users. Third-party (Vendr) medians for the enterprise products run from about $27,000 to $52,000 a year. Akeneo's Community Edition is free, open source (OSL-3.0) and still maintained (v2026.5). Pimcore is no longer open source: free only for organisations under €5 million revenue, otherwise from $9,900 a year.

### 3.3 Ratings-and-reviews networks and review analytics — "what are customers saying?"

**Networks (Bazaarvoice, PowerReviews, Yotpo)** collect reviews on brand sites and syndicate them to retailers — mainly US and UK retailers such as Walmart, Target, Ulta, Sephora, Boots and Tesco. No evidence was found that marketplaces in your other markets take part. A brand gets its own review text (by paid export or API), dashboards for retailer-hosted reviews, and aggregated benchmarks about competitors — not competitor review text.

**Analytics vendors (Revuze, Yogi, Wonderflow)** aggregate public reviews from retailer sites, including competitors', and analyse themes with AI. Their pages do not explain the legal basis for the collection, which matters before buying from them or copying them.

### 3.4 Data providers and seller tools — "just give me the data"

A separate layer sells structured public marketplace data by the request: Rainforest API, Oxylabs, Bright Data, ScraperAPI, SerpApi, Zyte, Apify and others, plus price-history (Keepa) and Amazon seller-tool APIs (Jungle Scout, SmartScout). They are cheap — roughly $0.25 to $8 per thousand pages — and cover Amazon, Walmart and Target well and regional sites thinly. They also raise the terms-of-use and policy questions set out in [Deliverable 4](04-api-data-feasibility.md).

---

## 4. Six trends that affect the design

| Trend | Evidence | What it means for the engine |
|---|---|---|
| **Consolidation** | Syndigo acquired 1WorldSync, PowerReviews and Taggstar; Cinven agreed to acquire Salsify (July 2026); Akeneo bought PricingHUB and Dataggo; Omnicom now houses Flywheel and Intelligence Node; e.fundamentals was absorbed into CommerceIQ | Avoid deep dependence on any one vendor; keep data portable; own the knowledge base |
| **"Agentic" everything** | AI agents or assistant connectors announced by nearly every vendor in 2025–26 | The AI layer is becoming a commodity built on the same general models; the durable asset is clean, approved brand knowledge |
| **AI shopping visibility** | New tools that track whether AI assistants recommend a product (Stackline, DataWeave, CommerceIQ, Bazaarvoice, Yotpo) | A likely future module; design the knowledge base so product facts can be published in machine-readable form |
| **APIs open for own data, closed for competitor data** | Amazon, Walmart, Shopee, Lazada, TikTok Shop and Takealot all document own-listing APIs; none exposes other sellers' listings beyond Amazon's limited catalogue and offer data | Two different collection strategies are needed: official integration for own listings, licensed data for competitors |
| **Platforms tightening access** | Amazon review pages behind login since November 2024; Amazon's affiliate API switched off and its replacement forbids analysis use; Google's older Content API retired 18 August 2026 | Build on current official routes only; never rely on logged-in collection |
| **Moving content rules** | Amazon's 75-character title rule (27 July 2026) with country exceptions | Requirements must be versioned, dated and re-checked; listings must be re-assessed when a rule changes |

---

## 5. What official listing-quality signals really exist

This table matters because the specification rightly says *never manufacture an official score*. Full detail and sources are in Appendices C1, C2 and D1.

| Retailer | Official signal | How a seller can get it | Note |
|---|---|---|---|
| **Amazon** (all stores) | *Listing Quality Indicator* — Poor to Optimized, in the "Enhance Listings" view | Seller Central screen only; no API or report found | Also by API: per-listing *issues* with severity and enforcement, and the Suppressed Listings report. No numeric score exists |
| **Walmart** (US marketplace) | *Listing Quality score*, 0–100, five components (content, price competitiveness, shipping, published and in stock, ratings and reviews) | API, dashboard and downloadable reports | First-party suppliers get a separate *Content Quality Score* in a report |
| **Noon** | Content completeness percentage (separately for English and Arabic), quality-check status with rejection reasons, and per-image review status | Official Content API (publicly documented) and the Seller Lab portal | No listing-quality *score* was found. Completeness and QC status are the official signals |
| **Takealot** | *Listing quality score* | API field and Seller Portal | Components are not itemised officially |
| **Shopee** | Listing quality level with an issue list | API | — |
| **Lazada** | *Content Score* | API | — |
| **TikTok Shop** | Listing quality tier (Poor / Fair / Good) and product diagnosis | API | The tier is documented for the US |
| **Jumia** | *Content Score* | Not currently viewable — the official FAQ says the function is "under development" | Quality-check status and rejection reasons are available |
| **Flipkart** | "Listing Quality Score" as named by third parties | Seller Hub (unverified) | No official public page could be retrieved |
| **Target** | "Target Content Score" as named by content partners | Unverified | Target publishes no description of it |
| Boots, Superdrug, Tesco, Ulta, Nykaa, Nahdi, Clicks, Dis-Chem, Carrefour UAE, Watsons Malaysia | None found | — | Content rules live in supplier portals or with distributors |

**Names to stop using:** "Amazon LQI / Listing Quality Index" is SellerApp's metric; "Listing Optimization Score" is Jungle Scout's; the older "Listing Quality Dashboard" no longer appears in Amazon's public help; no official Amazon "retail readiness score" could be verified.

---

## 6. What the market does not offer — and the engine should

| Gap in the market | Evidence | Engine response |
|---|---|---|
| Coverage of Gulf, African and South-East Asian retailers | No published retailer lists; no confirmed Kenya or Nigeria coverage anywhere | A marketplace database for nine countries, with data-access research per platform (built — Deliverable 3) |
| Control of what may be claimed | PIMs store content but none describes an approved / restricted claims register tied to AI generation | Claims register with approve / restrict per market, enforced in search and later in generation (built) |
| Transparent, reproducible scoring | Vendor content scores are proprietary formulas | Versioned scoring rules with a full explanation per component (designed; Stage 4) |
| Honest handling of missing data | Not described by any vendor | Five data classes shown everywhere; missing is never zero (built) |
| Beauty and Arabic-language rules | Not described on any vendor page | Requirements library with per-country, per-language rules (first version built) |
| One knowledge base for every channel | Vendors are organised by channel | Brand knowledge base designed to serve e-commerce first, then social, advertising and creative |

## 7. What the engine should *not* try to build

- **Sales and market-share estimates.** They depend on shopper panels and retailer measurement. Buy for the US and UK if needed; they are not offered for the other markets by anyone found.
- **A retailer syndication network.** Vendor reach is their moat, and publishing is outside the first product anyway.
- **Mass page collection across hundreds of retailers.** Buy data for the sites that matter, under an explicit policy.
- **Image effectiveness prediction.** It needs purchase-outcome data. Rule-based image checks are enough to start.

---

## 8. Where to read more

| Topic | Document |
|---|---|
| Platform-by-platform capability and price evidence | [Deliverable 2 — Capability Matrix](02-competitor-capability-matrix.md) |
| The nine markets and their priority platforms | [Deliverable 3 — Marketplace Research](03-global-marketplace-research.md) |
| What data can actually be obtained, and how | [Deliverable 4 — API and Data Feasibility](04-api-data-feasibility.md) |
| Reusable open-source tools | [Deliverable 5 — Skills Inventory](05-github-skills-inventory.md) |
| Each retailer's content rules | Appendices [C1](appendix/C1-content-requirements-amazon-walmart-noon.md) and [C2](appendix/C2-content-requirements-regional-retailers.md), and the Requirements Library in the app |
