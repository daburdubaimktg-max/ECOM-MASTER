# Deliverable 4 — API and Data Feasibility Report

**What marketplace data can actually be obtained, by which route, for whom and at what cost**

**Research date:** 26 November 2026 · **Detail and all source citations:** Appendices [D1 — Official APIs](appendix/D1-official-apis.md), [D2 — Data providers and legal constraints](appendix/D2-data-providers-and-legal.md), [C1](appendix/C1-content-requirements-amazon-walmart-noon.md) and [C2](appendix/C2-content-requirements-regional-retailers.md) · **This is research, not legal advice** — the legal section must be confirmed by qualified counsel.

---

## 1. Bottom line

1. **Your own listings can be monitored through official channels on most priority platforms** — Amazon (all six stores in scope), Noon, Walmart, Takealot, Flipkart, Shopee, Lazada and TikTok Shop — *provided the account that sells the product authorises the connection.*
2. **Competitor listings cannot.** Official APIs expose almost nothing about other sellers' products. The only exception is Amazon's catalogue and offer data, which is limited and bound by contract to "supporting an Authorized User's business".
3. **Who sells the product decides what you can get.** Where a distributor is the seller of record, the brand has no API access of its own. This is the single most important question to answer per marketplace before Stage 3 is built.
4. **The competitor view therefore needs licensed data providers** — cheap (tens to a few hundred dollars a month for a small programme) and good for Amazon and Walmart, thin for regional platforms — **and an explicit policy decision**, because every marketplace terms page that could be read prohibits automated collection.
5. **No official numeric listing-quality score exists for Amazon.** Scores do exist by API for Walmart, Shopee, Lazada, TikTok Shop (US) and Takealot. Noon exposes completeness and quality-check status. The engine must calculate its own score everywhere and import official ones only where they exist.
6. **Review text is the weak point everywhere.** Own-review text is available by API only from Shopee and Lazada. Amazon shows only a handful of reviews without login.
7. **There are no API fees to plan for.** Amazon cancelled its planned developer fee programme; no usage fee was found for the other marketplace APIs.
8. **Three markets have a real data gap:** Kenya and Nigeria (Jumia's API is reported but not confirmed; nothing else is documented) and the specialist retailers everywhere (Boots, Nykaa, Nahdi, Clicks, Dis-Chem, Watsons), whose content and data flow through supplier portals and distributors.

---

## 2. Data access route by priority platform

The three priority platforms per market from [Deliverable 3](03-global-marketplace-research.md), with the best legitimate route to data.

| Market | Platform | Own-listing data | Official quality signal | Competitor data |
|---|---|---|---|---|
| **UAE** | Amazon.ae | Official API (SP-API) | Issues by API; quality indicator on screen only | Limited catalogue and offers by API; otherwise provider |
| | Noon | Official partner API (content, pricing, offers, stock) | Completeness and QC status by API | Provider only — thin coverage |
| | Life Pharmacy | No public API — via the retailer or distributor | None found | Provider or manual |
| **Saudi Arabia** | Amazon.sa | Official API | As Amazon.ae | As Amazon.ae |
| | Noon | Official partner API | As above | Provider only |
| | Nahdi Online | No public API — supplier relationship | None found | Provider or manual |
| **South Africa** | Takealot | Official Seller API (title, price, stock) | Listing quality score by API | Not in the API — provider |
| | Amazon.co.za | Official API (Brand Analytics search reports not listed for this store) | As Amazon | As Amazon |
| | Clicks | No public API — supplier relationship | None found | Site blocks automation — manual |
| **United States** | Amazon | Official API | As Amazon | Limited API; providers cover well |
| | Walmart | Official Marketplace API; suppliers use Walmart's supplier tools | **Listing Quality score, 0–100, by API** | Providers cover well |
| | Target | No public seller API found — via content partners | Reported by partners only | Providers cover well |
| **United Kingdom** | Amazon.co.uk | Official API | As Amazon | Limited API; providers |
| | Boots | No public API — supplier portal | None found | Site blocks automation |
| | Tesco | No public API — supplier portal and content partners | None found | Two providers list coverage |
| **India** | Amazon.in | Official API | As Amazon | Limited API; providers |
| | Flipkart | Official Seller API (listing attributes, price, stock) | Reported, unverified | Not in the API — providers |
| | Nykaa | Not publicly documented | None found | Site closed to automation |
| **Kenya** | Jumia | Vendor Center API reported (not re-verified) and portal exports | Content Score "under development"; QC status available | Provider (small) or with Jumia's written consent |
| | Glovo | Not documented | None found | Manual |
| | Kilimall | Not documented | None found | Manual or provider |
| **Nigeria** | Jumia | As Kenya | As Kenya | As Kenya |
| | Supermart.ng | Not documented | None found | Manual |
| | Glovo | Not documented | None found | Manual |
| **Malaysia** | Shopee | Official Open Platform — including own review text | Listing quality level by API | Authorised shops only — providers |
| | TikTok Shop | Official Partner API | Diagnosis by API | Authorised shops only |
| | Lazada | Official Open Platform — own reviews for the last three months | **Content Score by API** | Authorised sellers only — providers |

**Reading this table:** the left-hand data column is achievable in Stage 3 once accounts are authorised. The right-hand column depends on the policy decision in section 6.

---

## 3. Official APIs in more detail

### 3.1 Amazon Selling Partner API (SP-API)

| Question | Answer |
|---|---|
| Which stores? | All six in scope exist: US, UK, UAE, Saudi Arabia, India, South Africa. There is no Amazon store in Kenya, Nigeria or Malaysia. |
| Who can connect? | The seller or vendor account that sells the product. A brand building a "private application" for its own account connects only its own account; it cannot be authorised by another company's account. |
| What does it return for own listings? | Title, bullets, description, attributes and images; A+ Content; price; stock; listing *issues* with severity and enforcement (for example search suppression); the attribute requirements for every product type (valuable for the requirements engine); sales and traffic; review counts. |
| Search data? | Brand Analytics search reports — requires Brand Registry. Not listed for the South Africa store. |
| Reviews? | Counts only, plus summarised review *topics* through the Customer Feedback API — which covers only the US and UK among your markets. No review text. |
| An official quality score? | **No.** There is no score operation or report. Amazon's *Listing Quality Indicator* is visible only inside Seller Central. |
| Competitor products? | Catalogue facts (title, attributes, images, sales rank) and lowest/featured offers for any product code — seller accounts only, low rate limits, never ratings or reviews. The contract limits use to supporting your own business with Amazon. Have counsel confirm the intended use. |
| Fees? | None. Amazon's site states it "will not move forward with the SP-API usage and annual fees at this time" (confirmed directly). |
| Effort to integrate | Medium to high: application approval, roles, per-region endpoints and rate limits. Amazon publishes an official connector and sample applications ([Deliverable 5](05-github-skills-inventory.md)). |

**Not a route:** Amazon's affiliate API (Product Advertising API 5.0) has been switched off, and its replacement requires affiliate sales and forbids aggregation or analysis use.

### 3.2 Noon

Noon publishes partner API documentation at `noon-docs.noonpartners.dev`: a **Content API** (create, update and monitor listings; submit English and Arabic content and track completeness and quality-check status separately per language; see exactly why a listing is not live), plus **Pricing, Offer and Stock** APIs, with OAuth authentication, rate limits and a sandbox. *(One research stream reported the documentation as unreachable; this was re-checked directly and corrected — see the note at the top of Appendix D1.)* It serves the seller's own catalogue. Nothing for competitors, and no ratings or review data was found.

### 3.3 Walmart

The Marketplace API covers items, price, inventory and — uniquely among the major platforms — an official **Listing Quality score** (0–100) at seller and item level with five components, plus downloadable listing-quality and content-quality reports. First-party suppliers use Walmart's supplier tools and receive a Content Quality Score in a product content report. The "Reviews API" manages a paid review-generation programme and does not return review text. US only.

### 3.4 The regional open platforms

| Platform | What the documentation shows |
|---|---|
| **Takealot** (ZA) | Seller API with offers, price and stock, and a listing-quality field on each offer whose components are not documented. |
| **Shopee** (MY) | Open Platform with products, price, stock, own review text and a content-quality level with issue list. |
| **Lazada** (MY) | Open Platform with products, price, stock, own reviews for the last three months and a product Content Score. |
| **TikTok Shop** (US, UK, MY) | Partner API with products, price, stock and product diagnosis; the quality tier is documented for the US. |
| **Flipkart** (IN) | Seller API for listings, price and stock. No ratings, reviews or quality score in the documented API. |
| **Jumia** (KE, NG) | A Vendor Center API is cited by one research stream and could not be re-verified. Portal exports of product and quality-check status are documented. Jumia's robots.txt tolerates identified bots at low rates, though its terms still ask for written consent. |
| **Nykaa, Meesho, Myntra, Target Plus** | Not publicly documented. |

### 3.5 Supporting sources

- **Google Merchant Center (Merchant API):** market benchmarks rather than competitor listings — best-selling products and brands, a price benchmark for products you also sell, relative visibility. Free with a Merchant Center account. Popular-products data is not offered for Kenya, Nigeria or Malaysia. The older Content API was retired on 18 August 2026.
- **GS1:** the barcode check-digit rule is public and is implemented in the product already. Confirming who *owns* a barcode uses "Verified by GS1" — free for single look-ups, with batch and API access arranged through the local GS1 office at an unpublished price.
- **Review networks:** Bazaarvoice and PowerReviews give a brand its own review text under contract; competitor information comes as benchmarks only, and Bazaarvoice's API terms forbid storing API data and any "benchmarking or competitive" use (confirmed directly).

---

## 4. What a brand that sells through distributors can and cannot get

Marketplace seller APIs answer only for the account that authorises them. If your distributor is the seller of record on Amazon.ae, Noon, Takealot or Jumia, the brand cannot connect on its own. The routes that remain:

| Route | What it gives | Limitation |
|---|---|---|
| The distributor authorises the engine on its account | Everything in section 3 for those listings | Needs the distributor's agreement; put it in the contract |
| Scheduled exports from the distributor | Listings, prices, stock, issues, scores as files | Manual and only as fresh as the schedule |
| Amazon Brand Registry — *Brand Representative* role | Brand Analytics search reports; content-change alerts for the brand owner | The *Reseller* role usually given to distributors does **not** unlock Brand Analytics |
| A brand-owned selling account in each priority store, even with a minimal catalogue | Unlocks catalogue data, Brand Analytics and alerts for the brand | Operational overhead; check channel agreements first |
| Amazon vendor "manufacturing view" (if you are a first-party vendor) | Covers every product you manufacture, whoever sold it to Amazon | Vendor accounts only |
| Licensed data provider | Public facts about your own listings as a shopper sees them | Same policy questions as competitor data |

**Recommended actions before Stage 3:**

1. For each priority marketplace, record who the seller of record is. *(The product already asks this on each marketplace page: "Are our brands sold here? Sold by…")*
2. Enrol the brand in Amazon Brand Registry with the Brand Representative role where it is not already.
3. Add data-sharing duties to distributor agreements: either API authorisation or scheduled exports of listings, prices, stock, issues and scores.
4. Ask the Noon and Jumia account managers what they will supply and whether API access can be granted to the brand.

---

## 5. Licensed data providers — the route to the competitor view

**No single provider covers all eighteen target sites.** Amazon, Walmart and Target are well served; Noon, Takealot, Jumia, Nykaa, Boots and Ulta rely on small community-maintained collectors, one provider's Noon page, or agencies.

| Need | Providers whose documentation covers it | Indicative public price (seen 26 Nov 2026) |
|---|---|---|
| Amazon in UAE, Saudi Arabia, India and South Africa | Rainforest API, ScraperAPI, Oxylabs (the three that document amazon.co.za) | Oxylabs about $0.25–$1.50 per 1,000 pages; Rainforest from $23 a month for 500 credits, $83 for 10,000 |
| Walmart | BlueCart API, Oxylabs, ScraperAPI, SerpApi | BlueCart from $66 a month for 10,000 credits |
| Flipkart and Lazada | Oxylabs, Bright Data | Bright Data $1.50 per 1,000 records |
| Shopee | Bright Data, Apify | Apify actors about $0.40–$8 per 1,000 results |
| Tesco | Unwrangle, Apify | Unwrangle from $99 a month |
| Noon, Takealot, Jumia, Nykaa, Boots | Small Apify community actors; one Bright Data page for Noon; scraping agencies | Varies; quality unproven |
| Search position | SerpApi and others | About $7–$25 per 1,000 searches |
| Amazon price history | Keepa | US, UK and India only; official price page could not be read |

**ESTIMATE — a small monitoring programme** (500 product pages plus 100 search pages; arithmetic in Appendix D2): about **$0–$95 a month if run weekly** and about **$27–$670 a month if run daily**. The spread comes mainly from whether a provider bills a search page once or once per product row. *This is an estimate from published price lists, not a quotation.*

**Known limitation that affects every provider:** since 5 November 2024 Amazon requires a login to see full review pages. Providers return only the reviews shown on the product page (about 8 to 13). Options that use your own Amazon account's login exist and must not be used.

**A workable shape** is two or three subscriptions rather than one: a structured service for Amazon and Walmart, a general platform for the regional sites that matter, and optionally price history for the US, UK and India.

---

## 6. Legal and terms-of-use constraints — and the decision you need to make

*Research summary only. Qualified legal counsel must confirm this before any collection starts.*

**What the terms say.** Every marketplace terms page that could be read — Takealot, Jumia, Flipkart, Nykaa and Shopee — prohibits robots or automated collection. The terms of Amazon, Walmart, Noon and Lazada could not be retrieved and must be read by counsel. Jumia is the one site whose robots.txt openly tolerates identified bots below 200 requests a minute.

**What the courts have said.** In the US, reading public pages without logging in is unlikely to be treated as "hacking" (*hiQ v. LinkedIn*), and terms that bind logged-in users did not reach logged-out collection (*Meta v. Bright Data*, 2024). But contract, server-burden, copyright and anti-circumvention claims remain open. In the EU a site may restrict use by contract even where no database right exists (*Ryanair v. PR Aviation*). Public-data collection is neither clearly unlawful nor clearly safe.

**Personal data.** Reviewer names, photos and profile links are personal data under the GDPR and under the data-protection laws of every market in scope (UAE PDPL, Saudi PDPL, POPIA, India's DPDP Act, Nigeria's NDPA, Kenya's Data Protection Act, Malaysia's PDPA). The product's design already drops them: the database stores review text, rating and date, and only an anonymous fingerprint of the reviewer.

**Copyright.** Prices, ratings and rank positions are facts. Images, product copy and review text are other people's creative work: use for internal analysis only and never republish.

### The decision table

| Collection method or data type | Rating | Condition |
|---|---|---|
| Official marketplace APIs for our own listings | **Permitted** | Follow each API's data-use terms |
| Exports from our own or our distributor's seller accounts | **Permitted** | Normal access controls |
| Collection with the retailer's written permission | **Permitted** | Keep the consent on file |
| Provider API — public product facts (price, availability, title, rating, review count, search position) | **Caution** — the lowest-risk route to competitor data | Public pages only, no login; modest volumes; vendor warrants lawful collection; written answer on anti-bot methods; pilot first |
| Review text without reviewer identifiers, internal analysis only | **Caution** | Internal use; short quotations only |
| Reviewer names, profile links, photos | **Avoid** | Switch the fields off or delete on arrival |
| Anything behind a login — including Amazon reviews via an account | **Avoid** | — |
| Solving CAPTCHAs or disguising automation, done by us | **Avoid** | Excluded by the product's own rules |
| The same evasion done by a vendor on our behalf | **Needs your decision** | Common in the industry; conflicts with the spirit of the "no bypass" rule |
| Our own direct collection where terms prohibit robots | **Avoid** | Seek written permission instead |
| Republishing competitor images, copy or reviews | **Avoid** | Only with a licence |
| Harvesting whole categories or catalogues | **Avoid** unless counsel approves | Keep to a defined list of products and search terms |

### The policy decision

Most data providers get past marketplaces' anti-bot systems on the customer's behalf. Your specification says the engine must not bypass CAPTCHAs or technical restrictions. Those two facts collide, and the collision must be settled by you, with counsel, not assumed by a developer. The options:

| Option | What it means | Consequence |
|---|---|---|
| **A. Strict** | Official APIs, retailer-approved data and manual uploads only | Fully consistent with the specification. Competitor intelligence is limited to Amazon's API data, Google benchmarks, retailer reports and manual spot checks |
| **B. Provider for public facts** *(suggested starting point, subject to counsel)* | Add a licensed provider for public product facts on a defined list of competitor products — no logins, no personal data, no review harvesting — after written vendor answers on how they collect | A useful competitor view at low cost. Accepts that the vendor may use anti-bot techniques; requires a written policy and a pilot |
| **C. Broad** | Providers for everything obtainable, including review text | Fullest picture, highest contractual and copyright exposure. Not recommended without specific legal advice |

The architecture supports all three: every observation records its collection method, so data from different routes is never mixed and a route can be switched off without losing history.

---

## 7. What this means for the build

| Stage | Data work | Depends on |
|---|---|---|
| **Stage 3** | Spreadsheet import of listing data (works for every platform immediately); Amazon SP-API and Noon partner API connectors for own listings; snapshot history and change detection | Seller-of-record answers; API applications approved; credentials configured on the server |
| **Stage 3–4** | Walmart, Takealot, Shopee, Lazada and TikTok Shop connectors, including their official quality scores | Which of these the brand actually sells on |
| **Stage 4** | Competitor data through one provider (Option B) for the top platforms; ratings and review counts | The policy decision; counsel's review; a pilot |
| **Stage 4–5** | Review themes from own reviews (Shopee, Lazada, review-network exports) and from visible competitor reviews if permitted | As above |

## 8. What could not be verified

- The terms of use of Amazon, Walmart, Noon and Lazada (pages refused automated access).
- Jumia's Vendor Center API (cited by one stream; could not be re-opened), and any API for Nykaa, Meesho, Myntra or Target Plus.
- Whether Amazon's Customer Feedback API serves competitor products, and whether Brand Analytics covers products sold by distributors.
- Keepa's official prices; how each provider bills search pages; Verified by GS1 API pricing.
- No API was called and no provider was trialled. Nothing in this report has been tested against a live account — that happens in Stage 3, and **no integration will be described as working until it has been.**
