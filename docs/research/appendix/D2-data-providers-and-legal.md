# D2 — Commercial e-commerce data providers and the legal / terms-of-use constraints on collecting public marketplace data

Research date: 2026-11-26. Every source listed was opened on that date (or attempted, where the source list says a page could not be retrieved); prices are as seen on that date and will change.

**This is research, not legal advice.** It summarises published terms, court decisions and statutes so that a product owner can decide what to investigate and subscribe to. Qualified legal counsel in each market must confirm the conclusions before any collection starts.

How to read the evidence labels:

- A number in square brackets, such as [7], points to the numbered list in "Sources" at the end.
- **UNVERIFIED** means we could not confirm the point from a page retrieved today. It is included only so that someone can check it manually.
- **ESTIMATE** means a figure we calculated from published prices plus stated assumptions. It is not a quote.

---

## Bottom line

1. **No single provider covers our 18 target sites.** Amazon, Walmart and Target are well served by structured data services. For Noon, Takealot, Jumia, Nykaa, Boots and Ulta the only self-serve options we found are small community-maintained scrapers on the Apify Store (several have fewer than 20 monthly users), one Bright Data page for Noon, and scraping agencies [9][10][11][13][17][19][27][65][66].
2. **Best fit differs by market.** Amazon in the UAE, Saudi Arabia, India and South Africa: Rainforest API, ScraperAPI and Oxylabs are the three whose documentation covers amazon.co.za; SerpApi does not list it, and Keepa lists none of UAE, Saudi Arabia or South Africa [31][38][42][45][47]. Flipkart and Lazada: Oxylabs and Bright Data [22][25][31]. Shopee: Bright Data and Apify [14][26]. Tesco: Unwrangle and Apify [16][55].
3. **A workable shape is two or three subscriptions, not one:** a structured service for Amazon and Walmart, Apify for the long-tail marketplaces, and optionally Keepa for price history in the US, UK and India only [47].
4. **Unit prices are low.** Roughly $0.25 to $1.50 per 1,000 pages (Oxylabs), $1.50 per 1,000 records (Bright Data), $0.40 to $8 per 1,000 results (Apify actors), and $7 to $25 per 1,000 searches (SerpApi plans) [1][21][29][40].
5. **ESTIMATE for the small monitoring programme** (500 product pages plus 100 search pages): about $0 to $95 a month if run weekly, and about $27 to $670 a month if run daily. The spread comes mainly from whether a search page is billed once or once per product row. See section 1.5.
6. **Amazon review text is the weak point.** Provider documentation states that since 5 November 2024 Amazon requires login to see full review pages; without login, providers return only the handful of reviews shown on the product page (about 8 to 13). Options that use your own Amazon account cookie exist and should not be used under our policy [32][56].
7. **Most scraping services get past anti-bot systems on the customer's behalf.** That sits badly with our rule not to bypass CAPTCHAs. It needs an explicit policy decision and a written vendor answer, not an assumption [7][61][97].
8. **Every marketplace terms page we could read prohibits robots or automated collection** (Takealot, Jumia, Flipkart, Nykaa, Shopee) [86][87][89][90][91]. Jumia is the one site whose robots.txt openly tolerates identified bots under 200 requests a minute, although its terms still ask for written consent [77][87]. We could not retrieve the terms of Amazon, Walmart, Noon or Lazada (section 2.1).
9. **Courts have not made public-data scraping unlawful in itself, but they have not made it safe either.** In the US, reading public pages without logging in is unlikely to be "hacking" (hiQ), and terms that bind logged-in users did not reach logged-out scraping (Meta v. Bright Data). Contract, server-burden, copyright, anti-circumvention and privacy claims all remain live [95][97][99][101][109]. In the EU, a site may restrict use by contract even where no database right exists (Ryanair) [102].
10. **Reviewer names and profile links are personal data.** Keep review text, star rating and date; drop reviewer identifiers at the point of collection [3][114][116].
11. **Prices, ratings and rank positions are low-risk facts. Images, product copy and review text are other people's creative work:** use them for internal analysis only and never republish them [89][91][118][120].
12. **Gaps to close before commitment:** the terms of Amazon, Walmart, Noon and Lazada; Keepa's official prices; how each provider bills search pages; and the copyright rules of our non-EU markets (see "Limitations and gaps").

---

## Part 1 — Commercial data providers

### 1.1 Provider-by-provider summary

"Integration" is our judgement of engineering effort: low means one documented request returns structured data; medium means per-site set-up or extra parsing; high means building and maintaining our own extraction.

| Provider | What it is | Data types documented | Delivery | History | Stated compliance posture | Main limitations | Integration |
|---|---|---|---|---|---|---|---|
| **Apify** | Scraping platform with a marketplace ("Store") of ready-made scrapers called actors, some maintained by Apify, most by independent developers [1][2] | Product pages, search results with position, prices, offers, sellers, ratings, reviews, best-seller lists [2][3][4] | API, scheduled runs, datasets, webhooks | None built in; some actors offer change tracking | Apify's article: scraping public data is "generally legal", GDPR protects all personal data whatever its source, sites can restrict scraping by contract [20]. Its Amazon Reviews actor leaves out personal information by default [3] | Quality depends on each actor's maintainer; long-tail actors have very few users; optional CAPTCHA solver exists on one Amazon actor (off by default) [7] | Medium |
| **Bright Data** | Large scraping and dataset vendor: Web Scraper API plus pre-collected datasets [21][23] | Products, search, sellers, reviews, best sellers for Amazon; products for Walmart, Target, Lazada, Flipkart, Shopee, Noon [22][24][25][26][27] | API; delivery to cloud storage, Snowflake, SFTP, webhook [25] | Yes, through datasets with one-off or scheduled refresh [23] | "Only publicly available data", "GDPR & CCPA compliant", "ISO 27001 certified, SOC 2 controls"; customer vetting (KYC) referenced in its Trust Center [26][28]. Vendor claims, not independently checked | Amazon regional sites and Shopee/Lazada country sites are not itemised; billing unit for search pages not stated [22][24] | Medium |
| **Oxylabs** | Proxy and scraper vendor with dedicated "commerce scrapers" [30][31] | Amazon product, search, pricing, sellers, best sellers; Walmart, Target, Flipkart, Lazada product and search [31] | API (immediate, queued and batch modes) | None found | States the product is ISO/IEC 27001:2017 certified and extracts "publicly-available product data" [30] | No dedicated scraper for Noon, Takealot, Jumia, Nykaa, Shopee, Boots, Tesco or Ulta; no Amazon reviews endpoint in the current reference [31] | Low |
| **Zyte API** | General scraping API with AI-based product extraction; also a managed data service [33][34][35] | Product fields: name, SKU, GTIN, brand, price, currency, availability, rating [34] | API or managed feed | None found | "Product feeds do not collect personal data"; projects reviewed against its ethical principles; founding member of the Ethical Web Data Collection Initiative [34] | No marketplace-specific endpoints; price depends on a per-site difficulty tier that is not published per site [33] | Medium |
| **ScraperAPI** | Scraping API with "structured data endpoints" for a few large sites [37] | Amazon product, search, offers; Walmart product, search, category, reviews; eBay; Home Depot [37] | API (immediate and queued) | None found | None found on the pages retrieved | Other sites only through generic scraping; no Amazon reviews endpoint in the documentation index [37] | Low |
| **SerpApi** | Search-results API with engines for specific sites [43] | Amazon search and product; Walmart search, product, reviews, seller; Target search; Google Shopping [41][43] | API | Archive of your own past searches | "U.S. Legal Shield" of up to $2 million for scraping and parsing search engine data, provided the use is not illegal [40] | No engines for our long-tail marketplaces; amazon.co.za not listed [42][43] | Low |
| **Rainforest API** (Traject Data) | Amazon-only structured API [44] | Product, search, offers, best sellers; reviews status unclear | API; scheduled bulk "Collections" | None found | None found beyond describing public web data | Amazon only; reviews availability UNVERIFIED | Low |
| **BlueCart API** (Traject Data) | Walmart-only structured API [46] | Product, search, reviews | API; bulk Collections | None found | "not affiliated or endorsed by Walmart"; web-scraped public data [46] | Walmart only | Low |
| **Keepa** | Amazon price and offer history service with a token-metered API [48] | Price history, offers, buy box, product data [48] | API | Yes — the core product | None retrieved | Amazon only; domain list has no UAE, Saudi Arabia or South Africa [47]; official site blocked our access [50] | Medium |
| **DataForSEO Merchant API** | Task-based API for Amazon and Google Shopping [51] | Amazon products (search), ASIN detail, sellers, reviews; Google Shopping | API (queued or live) | None found | None retrieved | Supported Amazon countries not confirmed beyond US and UK [52] | Medium |
| **Firecrawl** | General crawler aimed at AI use, with schema-based extraction [53] | Any page; you define the fields | API | None | None retrieved | No marketplace parsers; you validate every field | Medium |
| **Unwrangle** | Structured retail APIs for a list of named retailers [55] | Product, search, category, reviews for Amazon, Walmart, Target, Tesco and others [55] | API | None found | None retrieved | Amazon reviews endpoint marked "legacy / high-risk"; no Noon, Flipkart, Shopee, Lazada, Boots, Ulta [55][56] | Low |
| **Canopy API** | Amazon-only API (REST and GraphQL) [58] | Product, offers, buy box, sales and stock estimates, search, best sellers [58] | API | None found | None retrieved | Prices and supported Amazon sites not public on pages retrieved [58][59] | Low |
| **Decodo** (formerly Smartproxy) | Scraping API with e-commerce templates [61] | Templates for Amazon, Walmart, Target: product, search, pricing, sellers, best sellers [61] | API | None found | No legal statement; advertises automatic CAPTCHA handling [61] | Other sites by raw URL only | Low |
| **Jungle Scout API** | Amazon analytics vendor's API [62] | Sales estimates, keyword volumes, share of voice, product database | API | Yes (modelled) | Not stated | Estimates, not shelf observations; needs an eligible plan [62] | Low |
| **SmartScout** | Amazon analytics tool; API is a sales-quoted add-on [63] | Brand, seller and category analytics | App; API add-on | Enterprise tier | Not stated | API price not public | Medium |
| **Similarweb** | Web and retail analytics; API sold by quotation [64] | Traffic, demand, Amazon sales and price tracking | APIs and feeds | Yes | Not stated | Pricing not public | Medium |
| **RealData API** | Scraping-service vendor with a Noon API page [65] | Noon product, search, reviews, offers, deals | API, webhook | None found | Claims public data only and ISO certificates — unverified | Small vendor; prices not public | Medium |
| **ScrapeIt** | Managed scraping agency (Jumia, Takealot) [66] | Product, price, seller, rating, stock | Files, API or feed | Only what accumulates | Says it collects only public data at moderate rates | Not self-serve | Low |

**The most-used Apify Store actors for our marketplaces** (usage figures and prices read from the Apify Store on 2026-11-26; prices are for the "Bronze" discount tier that comes with the Starter plan).

| Marketplace | Actor | Maintained by | Total / monthly users | Price | Source |
|---|---|---|---|---|---|
| Amazon (product) | Amazon Product Scraper | Apify | 33,843 / 3,145 | $0.004 per result; +$0.002 per offer or seller | [2] |
| Amazon (reviews) | Amazon Reviews Scraper | Apify | 18,795 / 2,351 (rated 2.7 of 5) | $0.005 per review | [3] |
| Any retail site | E-commerce Scraping Tool | Apify | 16,801 / 727 | $0.0015 per product detail; $0.00042 per listing row | [4] |
| Walmart | Walmart Product Detail Scraper | Apify | 1,118 / 96 | $0.0043 per result | [8] |
| Noon | Noon Product Scraper (UAE, KSA, Egypt) | Community | 163 / 69 | $0.0008 per result | [9] |
| Takealot | Takealot Products Scraper | Community | 59 / 10 | $0.00093 per result | [10] |
| Jumia | Jumia Product Scraper | Community | 75 / 15 | $0.004 per product | [11] |
| Flipkart | Flipkart Scraper | Community | 198 / 69 | $0.003 per product; $0.001 per review | [12] |
| Nykaa | Nykaa Scraper | Community | 20 / 16 | $0.00243 per product | [13] |
| Shopee | Shopee Scraper (lists Malaysia) | Community | 3,560 / 333 | $0.005 per product | [14] |
| Lazada | Lazada Scraper (lists Malaysia) | Community | 669 / 97 | $0.00299 per result | [15] |
| Tesco | Tesco UK & Ireland Scraper | Community | 459 / 22 | $0.0025 per result | [16] |
| Boots | Boots UK Product Scraper | Community | 26 / 7 | $0.0004 per result | [17] |
| Target | Target Scraper | Community | 270 / 82 | $0.00105 per product | [18] |
| Ulta | Ulta Beauty Scraper | Community | 33 / 9 | $0.00132 per product; $0.00022 per review | [19] |

What this table tells a buyer: outside Amazon, Walmart and Shopee these are small tools run by individual developers. They can break when a site changes and may be withdrawn. Treat them as a pilot route, not a guaranteed supply. The figures were read from Apify's catalogue; no actor was run.

### 1.2 Coverage matrix (provider by target marketplace)

- **Doc** = the provider's own page, documentation or Store listing retrieved today names this marketplace (for Amazon country sites, names the country site or states that any Amazon site is accepted).
- **Gen** = generic scraping only: no dedicated support found; the site could only be attempted through the provider's "any URL" service, with us doing the parsing. Success was not tested.
- **—** = not found in the pages retrieved (the provider is site-specific and does not list it).

| Provider | amazon .com | .co.uk | .ae | .sa | .in | .co.za | walmart | noon | takealot | jumia (NG/KE) | flipkart | nykaa | shopee .com.my | lazada .com.my | boots | tesco | target | ulta |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Apify [2][5][8]–[19] | Doc | Doc | Doc | Doc | Doc | Gen | Doc | Doc | Doc | Doc | Doc | Doc | Doc | Doc | Doc | Doc | Doc | Doc |
| Bright Data [22][24]–[27] | Doc | Doc | Gen | Gen | Gen | Gen | Doc | Doc | Gen | Gen | Doc | Gen | Doc | Doc | Gen | Gen | Doc | Gen |
| Oxylabs [31] | Doc | Doc | Doc | Doc | Doc | Doc | Doc | Gen | Gen | Gen | Doc | Gen | Gen | Doc | Gen | Gen | Doc | Gen |
| Zyte API [33][34] | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen |
| ScraperAPI [37][38] | Doc | Doc | Doc | Doc | Doc | Doc | Doc | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen |
| SerpApi [42][43] | Doc | Doc | Doc | Doc | Doc | — | Doc | — | — | — | — | — | — | — | — | — | Doc | — |
| Rainforest API [45] | Doc | Doc | Doc | Doc | Doc | Doc | — | — | — | — | — | — | — | — | — | — | — | — |
| BlueCart API [46] | — | — | — | — | — | — | Doc | — | — | — | — | — | — | — | — | — | — | — |
| Keepa [47] | Doc | Doc | — | — | Doc | — | — | — | — | — | — | — | — | — | — | — | — | — |
| DataForSEO Merchant [51][52] | Doc | Doc | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| Firecrawl [53] | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen |
| Unwrangle [55][57] | Doc | Doc | Gen | Gen | Doc | Gen | Doc | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Gen | Doc | Doc | Gen |
| Canopy API [58] | Doc | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| Decodo [61] | Doc | Gen | Gen | Gen | Gen | Gen | Doc | Gen | Gen | Gen | Gen | Gen | Gen | Doc | Gen | Gen | Doc | Gen |
| Jungle Scout API [62] | Doc | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| SmartScout [63] | Doc | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| Similarweb [64] | Doc | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — | — |
| RealData API [65] | — | — | — | — | — | — | — | Doc | — | — | — | — | — | — | — | — | — | — |
| ScrapeIt [66] | — | — | — | — | — | — | — | — | Doc | Doc | — | — | — | — | — | — | — | — |

Notes on the matrix:

- **Apify and amazon.co.za.** The Apify-maintained Amazon actors accept any Amazon address, but no listing we retrieved names amazon.co.za; one community actor's country list includes .com, .co.uk, .in, .ae and .sa but not .co.za [5][7].
- **Bright Data.** "Amazon" is documented, with amazon.com, amazon.co.uk and amazon.de appearing in examples and a "global" Amazon dataset listed; the UAE, Saudi, Indian and South African sites are not itemised [23][24]. Shopee and Lazada pages do not name country sites [22][26].
- **Oxylabs.** The Amazon endpoint accepts "A URL on any Amazon marketplace" [31].
- **SerpApi.** 22 Amazon sites are listed, including amazon.ae, amazon.sa, amazon.in and amazon.co.uk; amazon.co.za is not on the list. Target is a search engine only (no product engine) [42][43].
- **Keepa.** Country codes in the client documentation: US, GB, DE, FR, JP, CA, IT, ES, IN, MX, BR [47].
- **Canopy, Jungle Scout, SmartScout, Similarweb.** Their pages say "Amazon" without naming country sites; we have marked amazon.com only.
- **DataForSEO.** Only the United States and United Kingdom appear in documentation examples; the full list is served through its API and was not retrieved [52].

**Best documented fit by market**

| Market | Sites | Documented self-serve options found | Comment |
|---|---|---|---|
| UAE, Saudi Arabia | amazon.ae, amazon.sa, noon | Amazon: Rainforest, ScraperAPI, SerpApi, Oxylabs, Apify. Noon: Apify community actors, Bright Data Noon page, RealData API | No mainstream structured API for Noon |
| South Africa | amazon.co.za, takealot | amazon.co.za: Rainforest, ScraperAPI, Oxylabs. Takealot: Apify community actors, ScrapeIt | Thinnest coverage of all our markets |
| United States | amazon.com, walmart, target, ulta | Many for Amazon, Walmart, Target. Ulta: Apify community actors only | |
| United Kingdom | amazon.co.uk, boots, tesco | Amazon: many. Tesco: Unwrangle, Apify. Boots: one Apify actor with 7 monthly users | |
| India | amazon.in, flipkart, nykaa | amazon.in: Rainforest, ScraperAPI, SerpApi, Oxylabs, Keepa, Unwrangle, Apify. Flipkart: Oxylabs, Bright Data, Apify. Nykaa: Apify community actors only | |
| Kenya, Nigeria | jumia | Apify community actors; ScrapeIt (agency) | Jumia's robots.txt conditionally tolerates identified bots (section 2.1) |
| Malaysia | shopee.com.my, lazada.com.my | Shopee: Bright Data, Apify. Lazada: Oxylabs, Bright Data, Decodo, Apify | |

### 1.3 Pricing table (all prices seen 2026-11-26)

| Provider | Pricing model | Public price points | Free tier | Source |
|---|---|---|---|---|
| Apify | Monthly plan with prepaid usage, plus per-event prices set by each actor | Free $0 (with $5 of usage per month); Starter $19/month; Scale $199/month; Business $999/month. Actor prices as in the table in 1.1 | $5 of usage per month | [1] |
| Bright Data | Per successful record | $1.50 per 1,000 records pay-as-you-go; Scale plan $499/month including 384,000 records, then $1.30 per 1,000. Datasets from $250 for 100,000 records (one-off) | 5,000 records per month | [21][23] |
| Oxylabs | Prepaid plan; price per 1,000 successful results | Starter $15/month; Basic $100/month; Flexible $500/month; Enterprise from $2,500/month. Amazon from $0.50 per 1,000 (falling to $0.25 at very high volume); other sites from $1.00; pages needing browser rendering $1.50 | $5 welcome credit | [29] |
| Zyte API | Per 1,000 successful responses, by site difficulty tier | Plain responses $0.13 to $1.27; browser-rendered $1.01 to $16.08 (pay-as-you-go). Commitments of $100, $200 or $500 a month reduce the rates. AI extraction cost not on the page | $5 credit for 30 days | [33] |
| ScraperAPI | Monthly credits; credits per request vary by site | Hobby $49 (100,000 credits); Startup $149 (1,000,000); Business $299 (3,000,000); Scaling $475 (5,000,000); Professional $975 (10,500,000). Amazon, Walmart and eBay cost 5 credits per request | 7-day trial with 5,000 credits; the FAQ also mentions a 1,000-credit free plan | [36][39] |
| SerpApi | Monthly searches (one request is one search) | Starter $25 (1,000 searches); Developer $75 (5,000); Production $150 (15,000); Big Data $275 (30,000); Searcher $725 (100,000) | 250 searches per month | [40] |
| Rainforest API | Monthly credits; prices shown are for annual billing | Hobbyist $23/month (500 credits); Starter $83 (10,000); Production $375 (250,000); BigData $1,000 (1,000,000). Extra credits $0.06, $0.0118, $0.003, $0.002 each | Free trial; size not stated | [44] |
| BlueCart API | Monthly credits; annual billing | Starter $66/month (10,000 credits); Production $375 (250,000); BigData $1,000 (1,000,000) | Free trial, no card | [46] |
| Keepa | Monthly subscription by tokens per minute | Official page not readable. A third-party article (updated 2026-08-20) reports €49 for 20 tokens a minute, €129 for 60, €459 for 250 — **UNVERIFIED** | None reported | [49][50] |
| DataForSEO Merchant | Pay-as-you-go per task | Amazon ASIN: $0.0015 standard, $0.003 priority, $0.005 live. Amazon search: page shows two price sets ($0.001 to $0.005) — confirm. Google Shopping $0.001 to $0.002. Amazon reviews $0.00075 per 10 reviews | Trial advertised; amount not stated | [51] |
| Firecrawl | Monthly credits; 1 per page, plus 4 for structured extraction | Hobby $19 (5,000 credits); Standard $99 (100,000); Growth $399 (500,000); Scale $749 (1,000,000) | 1,000 credits per month | [53] |
| Unwrangle | Monthly credits | Starter $99 (100,000 credits); Standard $249 (300,000); Professional $499 (750,000); Enterprise $999 (2,000,000). Amazon US 1 credit per request; other Amazon sites 2.5 | Not stated | [54][57] |
| Canopy API | Not publicly disclosed | Not publicly disclosed | Not publicly disclosed | [58][59] |
| Decodo | Monthly plan by pages scraped | $19 (38,000 pages); $49 (122,000); $99 (330,000); $249 (1.2 million); $499 (2.7 million) | Free plan up to 10,000 pages | [60] |
| Jungle Scout API | Add-on to an eligible subscription | 1,000 requests a month $29; 4,000 $99; 10,000 $199; overage $0.05 per request | First 100 requests | [62] |
| SmartScout | Subscription; API by quotation | Plans from $29 to $299 a month; for the API the page says "This feature is an add-on. If interested, please talk to sales" | Not stated | [63] |
| Similarweb | Quotation | Not publicly disclosed | Not publicly disclosed | [64] |
| RealData API | Per successful response | Not publicly disclosed | Sandbox key with sample credits | [65] |
| ScrapeIt | Managed service | €199 one-off (100,000 rows); from €169/month plus €499 set-up (monthly refresh) to €549/month plus €799 set-up (three refreshes a day) | Paid sample €9.99 | [66] |

### 1.4 Known limitation that affects every provider: Amazon review text

- Unwrangle's documentation states: "As of November 5th, 2024, Amazon now requires users to be logged in to view product reviews. To continue scraping more than the 8 most recent reviews, you'll need to provide your Amazon account's cookie with your API requests." It labels the endpoint "Legacy / high-risk" and warns that heavy use risks "your Amazon account being banned" [56].
- Oxylabs' own tutorial (updated 2026-06-22) says "for non-logged-in users, Amazon limits the visible reviews to roughly 8 to 13 featured reviews" and that the full history sits "increasingly, behind a login" [32]. Oxylabs' current reference lists Amazon product, search, pricing, sellers and best-seller endpoints but no reviews endpoint [31].
- ScraperAPI's documentation index lists Amazon Product, Search and Offers endpoints but no reviews endpoint [37].
- On Apify, the Apify-maintained Amazon Reviews Scraper is rated 2.7 out of 5 and caps results at 100 reviews per star filter [3]; one community actor states that "since Oct 2026 amazon.com returns summary/excerpts only (no login)" [6].
- Bright Data and DataForSEO still list Amazon review products [23][51]; how deep they go without login was not stated on the pages retrieved. Rainforest's reviews status is **UNVERIFIED**.

What this means in practice: plan on star rating, review count and the visible "top reviews" for competitor products on Amazon. Do not adopt any option that needs an Amazon account cookie: that is logged-in collection, which our policy excludes and which carries the greatest legal exposure (section 2.2). Review text for Walmart, Flipkart, Lazada, Noon and Ulta is offered by several tools [9][12][15][19][37][43], subject to the terms and privacy points in Part 2.

### 1.5 Cost estimates for a small monitoring programme — ESTIMATE

**Everything in this section is an ESTIMATE built from the public prices above. It is not a quotation, and success rates were not tested.**

Volumes:

- Weekly programme: 500 product pages × 52 ÷ 12 = 2,167 product pages a month; 100 search pages × 52 ÷ 12 = 433 search pages a month; 2,600 page requests in total.
- Daily programme: 500 × 365 ÷ 12 = 15,208 product pages a month; 100 × 365 ÷ 12 = 3,042 search pages a month; 18,250 page requests in total.
- **Assumption:** some providers charge per product row returned from a search page rather than per page. We assume 50 rows per search page (not measured). That gives 433 × 50 = 21,650 rows a month weekly and 3,042 × 50 = 152,100 rows a month daily. Change this number and the per-row figures change in proportion.

**Provider A — Apify** (Starter plan, $19 a month, which is also $19 of prepaid usage) [1]

| Case | Arithmetic | Weekly | Daily |
|---|---|---|---|
| Low: Apify's E-commerce Scraping Tool at $0.0015 per product detail and $0.00042 per listing row [4] | Weekly: 2,167 × 0.0015 = $3.25; 21,650 × 0.00042 = $9.09. Daily: 15,208 × 0.0015 = $22.81; 152,100 × 0.00042 = $63.88 | $12.34 of usage, so the $19 plan fee covers it: **about $19** | **about $87** ($86.69) |
| High: Apify's Amazon Product Scraper at $0.004 per result for product pages and for each search row [2] | Weekly: 2,167 × 0.004 = $8.67; 21,650 × 0.004 = $86.60. Daily: 15,208 × 0.004 = $60.83; 152,100 × 0.004 = $608.40 | **about $95** ($95.27) | **about $669** ($669.23) |

If the optional per-product add-ons in the low case all apply (residential proxy $0.001, browser rendering $0.00057, unblocker $0.0015, together $0.00307), add 2,167 × 0.00307 = $6.65 weekly or 15,208 × 0.00307 = $46.69 daily [4].

**Provider B — Bright Data** (pay-as-you-go, $1.50 per 1,000 records) [21]

| Case | Arithmetic | Weekly | Daily |
|---|---|---|---|
| Each product page is one record and each search row is one record | Weekly: (2,167 + 21,650) = 23,817 records × $1.50 ÷ 1,000. Daily: (15,208 + 152,100) = 167,308 records × $1.50 ÷ 1,000 | **about $36** ($35.73) | **about $251** ($250.96) |
| Each page (product or search) is billed once, as stated for its "page load" scrapers [26] | Weekly: 2,600 × $1.50 ÷ 1,000. Daily: 18,250 × $1.50 ÷ 1,000 | **$3.90**, and 2,600 is inside the 5,000-record free tier, so possibly **$0** | **about $27** ($27.38) |

**Provider C — SerpApi** (one credit per successful request, whatever the number of rows) [40]

| Case | Arithmetic | Weekly | Daily |
|---|---|---|---|
| Product pages through its product engines, search pages through its search engines | Weekly: 2,600 searches needs the Developer plan (5,000 searches). Daily: 18,250 searches needs the Big Data plan (30,000 searches) | **$75** | **$275** |

SerpApi covers Amazon and Walmart (and Target search) only, so this figure applies to that part of the programme [43].

**Summary of the ESTIMATE**

| Programme | Apify | Bright Data | SerpApi |
|---|---|---|---|
| Weekly (2,600 pages a month) | $19 to $95 | $0 to $36 | $75 |
| Daily (18,250 pages a month) | $87 to $669 | $27 to $251 | $275 |

Two further reference points, same method: **Oxylabs** at $0.50 to $1.50 per 1,000 pages gives 2,600 × that rate = $1.30 to $3.90 weekly (so the $15 Starter plan is the practical minimum) and 18,250 × that rate = $9.13 to $27.38 daily [29]. **Rainforest API**, assuming one credit per request (the pricing page does not state this), needs the $83 Starter plan weekly; daily needs 18,250 credits, which is Starter plus 8,250 extra credits × $0.0118 = $97.35, about $180 in total, or the $375 Production plan [44].

What the estimate leaves out: failed or retried requests, extra charges for delivery-location lookups, review collection, engineering time, and the cost of running more than one provider. Collecting 500 products on each of several marketplaces multiplies the volumes accordingly.

---

## Part 2 — Legal and terms-of-use constraints

**This part is research, not legal advice.** It reports what the documents say. It does not tell you what a court or regulator would decide about our programme.

### 2.1 What the marketplaces' terms and robots.txt files say

A robots.txt file is a public file in which a site tells automated visitors which areas it does not want them to fetch. It is a statement of the site's wishes; a US court held in December 2025 that ignoring it is not, by itself, "circumvention" under US copyright law (section 2.2) [108]. Some terms of use turn it into a contractual rule: Jumia's terms forbid users to "violate the directives set out in the robots.txt file" [87].

| Platform | Terms page and date shown | Clause on automated access (verbatim) | robots.txt on product and review pages |
|---|---|---|---|
| **Amazon.com** | Conditions of Use — **not retrieved**. Amazon's robots.txt bars the AI agent used for this research from the whole site, so we fetched no Amazon page other than robots.txt | **UNVERIFIED.** From prior knowledge only, to be confirmed by reading the page: the "License and Access" section is understood to exclude "any use of data mining, robots, or similar data gathering and extraction tools" | For ordinary crawlers, product pages (/dp/) and search (/s) are not disallowed; offer listings (/gp/offer-listing), customer profile pages and several review-widget and member-review paths are. 99 named agents — including GPTBot, ClaudeBot, Claude-User, PerplexityBot, CCBot, Scrapy, Diffbot and Brightbot — are barred from the entire site [67] |
| **Amazon.ae** (and .sa, .co.uk, .in, .co.za) | Store-specific Conditions of Use — **not retrieved**, same reason | **UNVERIFIED** | Same structure and the same 99 barred agents on all five sites; amazon.in also disallows some filtered search addresses and top-reviewer pages [68][69][70][71][72] |
| **Walmart.com** | Terms of Use — **not retrieved**: the page answered automated access with a "Robot or human?" press-and-hold challenge, which we did not attempt to pass [92] | **UNVERIFIED** | Disallows /search, /api/, /account/ and similar functional paths; explicitly allows /reviews/product/ and /reviews/seller/; product pages are not disallowed [73] |
| **Noon** | Terms of Use — **not retrieved**: the site returned errors (HTTP 503) to automated access [93] | **UNVERIFIED** | Not retrieved (the fetch failed) [74] |
| **Takealot** | Terms & Conditions; no date shown [86] | You agree that you will not "use any robot, spider, other automatic device, or manual process to monitor, copy, distribute, or modify our platform or its content, except for technology used by internet search websites to direct internet users to our platform". Also: "The content is protected by law, and you may not use, distribute, or reproduce it without the property owner's written consent." | General rule is "Allow: /", with account, cart and wishlist areas and addresses carrying search, sort or filter parameters disallowed [75] |
| **Jumia Kenya** | Terms & Conditions, Version 3.0, "Last update: March, 2025", published 30 March 2025 [87] | You must not "10.9.9 conduct any systematic or automated data collection activities (including without limitation scraping, data mining, data extraction and data harvesting) on or in relation to our website without our express written consent; 10.9.10 access or otherwise interact with our website using any robot, spider or other automated means, except for the purpose of search engine indexing"; and must not "violate the directives set out in the robots.txt file for our website" | The file opens with: "Site scaping is permited IF the user-agent is clearly identify it as a bot and the bot owner and is using less than 200 request per minute" (spelling as in the original). Site search, filter parameters, /catalog/ and /ratingreview/ are disallowed, but /catalog/productspecifications/ and /catalog/productratingsreviews/ are explicitly allowed [77] |
| **Jumia Nigeria** | Terms and Conditions — only the title ("General Terms and Conditions of Use of the Marketplace for Buyers and Sellers") could be retrieved [88] | **UNVERIFIED** for Nigeria. The Kenya wording above is the closest verified text | Same opening statement and structure as Kenya [76] |
| **Flipkart** | Terms of Use; no date shown [89] | "You shall not use any "deep-link", "page-scrape", "robot", "spider" or other automatic device, program, algorithm or methodology, or any similar or equivalent manual process, to access, acquire, copy or monitor any portion of the Platform or any Content ... We reserve Our right to bar any such activity." | Disallows /search?, individual review links (/reviews/), product-review pages, seller pages, and addresses with page or sort parameters; product pages are not disallowed [78] |
| **Nykaa** | Terms & Conditions, "Last updated: 10th June, 2026", Version 1.3 [90] | "You agree, further, not to use or attempt to use any engine, software, tool, agent or other device or mechanism (including without limitation browsers, spiders, robots, avatars or intelligent agents) to navigate or search this Site other than the search engine and search agents available from NYKAA on this Site and other than generally available third party web browsers" | "Allow: /", with /search/, /catalog/, all-reviews pages, product-question pages and the best-seller ranking page disallowed [79] |
| **Shopee Malaysia** | Terms of Service, "Last Updated: 9 October 2026" [91] | Section 3.1: "you agree that you will not use any robot, spider or any other automatic device or manual process to monitor or copy our Content, without our prior written consent (such consent is deemed given for standard search engine technology ...)". Section 6.3 also bars users from acts including "(o) harvest or collect any information about or regarding other Account holders, including, without limitation, any personal data or information" | Asks crawlers to wait one second between requests; disallows cart, checkout, user and order areas and some search and recommendation addresses; product pages are not disallowed [80] |
| **Lazada Malaysia** | Terms of Use — **not retrieved**: the page delivered only site navigation to automated fetching and to a browser without a user [94] | **UNVERIFIED** | Disallows only the login path and a few malformed addresses; explicitly allows three OpenAI agents [81] |

Two observations for the product owner:

- **Every set of terms we could read forbids robots or automated collection unless the site has agreed.** Under the policy order in our brief, that makes direct collection by us from Takealot, Flipkart, Nykaa and Shopee something that needs the retailer's written approval, not "permitted public website collection".
- **Jumia is the nearest to an open door.** Its robots.txt tolerates identified, slow bots and gives a contact route for higher volumes ("please contact the email techops at jumia com"), while its terms require "express written consent" [77][87]. Writing to Jumia for consent is a cheap way to turn this into an approved integration.

For reference, the other four retailer sites: Boots disallows /search/ and its site-search path but not product pages [82]; Target disallows its search address (/s?) and several review-submission paths but not product pages [84]; Ulta names Anthropic's and OpenAI's agents and allows them most of the site [85]; Tesco refused our request for robots.txt (HTTP 403) [83]. Their terms of use were outside the scope requested.

### 2.2 Key court decisions

| Decision | What it decided | What it does **not** establish |
|---|---|---|
| **hiQ Labs v. LinkedIn**, US Court of Appeals, Ninth Circuit, 18 April 2022 [95] | The court upheld a temporary order stopping LinkedIn from blocking hiQ's access to public member profiles. On the federal anti-hacking law (the Computer Fraud and Abuse Act), it said: "It is likely that when a computer network generally permits public access to its data, a user's accessing that publicly available data will not constitute access without authorization under the CFAA." | It was a preliminary ruling, not a final judgment, and it covers one statute in one group of US states. The court itself added that scraped sites "are not without resort": "state law trespass to chattels claims may still be available. And other causes of action, such as copyright infringement, misappropriation, unjust enrichment, conversion, breach of contract, or breach of privacy, may also lie." In November 2022 the trial court ruled that hiQ had breached LinkedIn's User Agreement (subject to hiQ's remaining defences), and in December 2022 the parties filed a settlement providing for a $500,000 judgment against hiQ, a permanent injunction and deletion of the scraped data [96] |
| **Meta Platforms v. Bright Data**, US District Court, Northern District of California, 23 January 2024 [97] | Judgment for Bright Data on Meta's contract claims. Meta could not show any scraping while logged in, and "the Facebook and Instagram Terms do not bar logged-off scraping of public data; perforce it does not prohibit the sale of such public data." The court also distinguished "defeating anti-automated scraping" from "piercing privacy walls" | It interprets Meta's terms as written at the time. A site whose terms clearly bind every visitor, or a scraper who logs in or clicks "I agree", could be treated differently. It is one trial court's ruling. The law firm that reported it also represented Bright Data [98] |
| **X Corp. v. Bright Data**, same court, 9 May 2024 [99] | X's complaint was dismissed. Claims about copying and selling public posts failed because "they are preempted by federal law" — the Copyright Act, not X's terms, governs who may copy content that X does not own. Claims about burdening X's servers failed for lack of specific facts | It was a dismissal with permission to try again, and the judge wrote: "This order does not hold that sending requests to servers could never support a trespass-to-chattels claim." In November 2024 the court allowed amended claims based on server impairment to proceed, and Bright Data filed counterclaims; the case was continuing in January 2025 [101]. Its status after that was not verified |
| **Ryanair v PR Aviation**, Court of Justice of the EU, 15 January 2015 [102] | The EU Database Directive "is not applicable to a database which is not protected either by copyright or by the sui generis right under that directive, so that Articles 6(1), 8 and 15 of that directive do not preclude the author of such a database from laying down contractual limitations on its use by third parties, without prejudice to the applicable national law." In short: a site owner may forbid scraping by contract even when its data has no database protection | It does not say such terms are always binding; whether a contract was formed and is enforceable is decided under national law |
| **CV-Online Latvia v Melons**, Court of Justice of the EU, 3 June 2021 [103] | A specialised search engine that copies and indexes all or a substantial part of a freely accessible database is "extracting" and "re-utilising" it, which the database maker may prohibit where this "adversely affect[s] its investment" — that is, where it puts at risk the recovery of that investment | It does not ban all indexing: the national court must find actual harm to the investment |
| **Amazon v. Perplexity**, district court order 9 March 2026 and Ninth Circuit opinion 4 August 2026 [104][105] | The trial court barred Perplexity's AI shopping assistant from entering "password-protected" parts of Amazon. The appeal court cancelled that order, holding Amazon unlikely to prove that Perplexity (as opposed to the user) "accessed" its computers | The appeal court stressed: "We do not establish a new legal regime governing agentic AI", and "This outcome does not impair Amazon's ability to regulate access to Amazon.com via private terms of service for its users." The case concerns logged-in accounts, which our policy already excludes; it shows how actively Amazon litigates automated access [106][107] |
| **Ziff Davis v. OpenAI**, US District Court, Southern District of New York, 15 December 2025 (as reported) [108] | Ignoring robots.txt is not "circumvention" of an access control under US copyright law; the court compared the file to a "keep off the grass" sign | It does not decide whether robots.txt matters under contract, trespass or other laws |
| **Google v. SerpApi**, filed December 2025, Northern District of California (as reported) [109] | A pending claim that getting past Google's anti-bot system is unlawful "circumvention" under US copyright law. No ruling was reported | Nothing yet. It matters to us because it targets the act of defeating anti-bot measures, which is what many scraping vendors sell |
| **Ryanair v. Booking.com**, US District Court, Delaware, 22 January 2025 (as reported) [110] | The judge set aside a jury verdict against Booking.com because Ryanair had not proved the minimum $5,000 loss the anti-hacking law requires; the case "ended with no finding of liability for either party" | No rule either way on scraping; it shows that such cases turn on proof of harm |
| **Compulife Software v. Newman**, US Court of Appeals, Eleventh Circuit, 1 August 2024 (as reported) [111] | A competitor that used a bot to take millions of quotes from a public website was held to have taken a trade secret by improper means, even though each quote was public | It turned on its facts: direct competitors, copied code, and the scale of the taking |

A current academic summary, from Professor Eric Goldman in October 2026: "Scraping is ubiquitous but not clearly legal", and for a scraping project to be permissible "it must survive each and every one of the doctrines" that may apply [112].

**Regulatory guidance on scraping and personal data**

- **UK Information Commissioner and 16 other data protection authorities, 28 October 2024.** Their joint statement concerns "publicly accessible personal information" and expects organisations to "Ensure that permissible data scraping for commercial or socially beneficial purposes is done lawfully and in accordance with strict contractual terms" [113].
- **French regulator (CNIL), focus sheet dated 5 January 2026.** Written for building AI training datasets, but its logic applies to any scraping of pages that contain personal data: "The collection of personal data available online through web scraping is generally based on legitimate interest", subject to safeguards. These include deleting irrelevant data "immediately after collection" — its example is collecting forum users' pseudonyms "when only the content of the comments is necessary" — and excluding sites that oppose scraping "by using robots.txt exclusion protocols or implementing CAPTCHA" [114].
- **EU and UK rules on "text and data mining"** (automated analysis of content) are covered in section 2.4.
- AI-training lawsuits (for example the Ziff Davis case) are included above only where they decide something that also applies to price and product monitoring.

### 2.3 Personal data in reviews (reviewer names, profile links)

A reviewer's display name, profile link, photo or location is "personal data" wherever it can be linked to a living person. The EU definition is "any information relating to an identified or identifiable natural person" [116]. Review text can also contain personal data, and in beauty and personal care it can reveal health details (skin or scalp conditions).

| Law | What it requires, in outline | Source |
|---|---|---|
| **EU GDPR and UK GDPR** | Applies to a business outside the EU when it monitors the behaviour of people in the EU (Article 3(2)). A lawful basis is needed; for this purpose it would normally be "legitimate interests", which fail where they "are overridden by the interests or fundamental rights and freedoms of the data subject" (Article 6(1)(f)), so a written balancing assessment is expected. People whose data was not collected from them must normally be informed, unless that "proves impossible or would involve a disproportionate effort", in which case the controller "shall take appropriate measures to protect the data subject's rights" (Article 14). The UK regulator's legitimate-interests guidance was updated on 23 March 2026 after the UK Data (Use and Access) Act | [115][116] |
| **UAE — Federal Decree-Law No. 45 of 2021 (PDPL)** | Consent is the rule, with listed exceptions; one exception is "if the Processing is for Personal Data that has become available and known to the public by an act of the Data Subject". Applies to organisations outside the UAE that process data of people in the UAE. The summary we read (last modified 27 January 2025) says the Executive Regulations had not been published and the enforcement body was not yet established; the DIFC and ADGM free zones have their own laws | [122] |
| **Saudi Arabia — Personal Data Protection Law** (Royal Decree M/19 of 2021, amended by M/148 of 2023) | In force since 14 September 2023, with compliance due by 14 September 2024. "the primary legal basis for processing of personal data is consent of the data subject", with limited exceptions. Applies to organisations abroad processing data of people residing in the Kingdom. Regulator: SDAIA. Separate regulations govern transfers abroad | [123] |
| **South Africa — POPIA (Act 4 of 2013)** | Protects living individuals and, where applicable, companies. Eight conditions for lawful processing. Information must be collected directly from the person unless, among other exceptions, it "is contained in or derived from a public record or has deliberately been made public by the data subject" (section 12(2)(a)). Transfers abroad are restricted. Fines up to R10 million | [121][125] |
| **India — Digital Personal Data Protection Act 2023 and Rules 2025** | Act and Rules notified on 13 November 2025 and phased in: the Data Protection Board from that date, consent-manager rules from 13 November 2026, and all other obligations from 13 May 2027; the older 2011 privacy rules apply until then. Consent or a listed "legitimate use" is needed. The Act does not cover personal data that the individual has deliberately made publicly accessible. Penalties up to INR 250 crore | [124] |
| **Nigeria — Data Protection Act 2023** | In force since 13 June 2023, supplemented by a General Application and Implementation Directive issued on 20 March 2025. Six lawful bases including legitimate interests. Organisations abroad that target people in Nigeria are covered. Organisations handling more than 200 people's data in six months must register. Fines up to 2% of annual gross revenue or N10 million, whichever is greater | [126] |
| **Kenya — Data Protection Act 2019** | In force since 25 November 2019, with 2021 regulations. Lawful bases include consent and legitimate interests; "It is an offence to process personal data without a lawful reason." Registration with the Data Commissioner above set thresholds. Transfers abroad are regulated. Penalty notices up to KES 5 million or 1% of turnover, whichever is lower | [127] |
| **Malaysia — PDPA 2010 as amended in 2024** | Covers personal data in commercial transactions; consent is generally required. The 2024 amendments took effect in stages during 2025: cross-border transfer changes on 1 April 2025; mandatory data protection officer and breach notification on 1 June 2025. Processors now have direct security duties | [128] |
| **United States** | No general federal privacy law; about 19 states have comprehensive consumer privacy laws alongside California's, and they generally exclude publicly available information | [129] |

Reading across the table: several of our markets carve out data that a person has deliberately made public (UAE, India, South Africa), but the EU and UK do not, and marketplace terms add their own bar — Shopee forbids users to "harvest or collect any information about ... other Account holders" [91]. The safest design is one that never needs reviewer identity.

**Practical data-minimisation recommendation**

1. **Keep:** review text, star rating, review date, product and variant identifier, marketplace and country, verified-purchase flag, helpful-vote count, and whether the review has photos (yes or no).
2. **Drop at the point of collection:** reviewer display name, profile link or account number, profile photo, reviewer location, and reviewers' own photos and videos. Where a tool offers the choice, switch personal fields off: Apify's Amazon Reviews Scraper has "Include personal information" set to off by default, with the note "You should not scrape personal data unless you have a legitimate reason to do so" [3].
3. **If duplicates must be detected,** store a one-way scrambled value (a salted hash) of the review's own identifier, not of the reviewer, and never use it to link one person's reviews together. The CNIL sheet recommends preventing "any combination of data based on individual identifiers" [114].
4. **Clean the text:** automatically remove names, phone numbers, e-mail addresses and order numbers that reviewers type into the review body.
5. **Set a retention period** for raw review text (for example 12 to 24 months) and keep only aggregated scores and themes after that.
6. **Record the reasoning:** a short written legitimate-interests assessment, an entry in the processing record, a published contact route for objections, and a contract with each provider that sets out what they may collect for us.
7. **Do not** profile or rank individual reviewers, contact them, or publish their words with their names.

### 2.4 Copyright and database rights: storing versus republishing

- **Facts versus creative content.** A price, a stock flag, a star rating, a review count or a search position is a fact. Product photographs, marketing copy (titles, bullet points, descriptions) and review text are creative content, usually owned by the brand, seller, photographer or reviewer and licensed to the marketplace. The US rule that facts as such are not protected by copyright is **UNVERIFIED** in this session (the source page refused access). Facts are not risk-free: collecting a large part of a compilation can still found other claims (Compulife, section 2.2) [111].
- **Marketplace terms restrict reuse of content as well as access.** Flipkart: "no part of the Platform and no Content may be copied, reproduced, republished ... for publication or distribution or for any commercial enterprise, without Flipkart's express prior written consent" [89]. Shopee: "You agree not to copy, distribute, republish, transmit, publicly display ... any portion of the Services, the Site or its Content" [91]. Takealot's wording is quoted in section 2.1 [86].
- **EU database right.** The maker of a database who has made "a substantial investment in either the obtaining, verification or presentation of the contents" can prevent "extraction and/or re-utilization of the whole or of a substantial part" of it (Article 7(1)); the right lasts fifteen years (Article 10) [117]. The CV-Online ruling shows it can be used against a service that copies a freely accessible database where that harms the maker's investment [103]. Our inference, for counsel to confirm: tracking a few hundred named products is far from "a substantial part" of a marketplace catalogue, whereas harvesting whole categories every day moves towards it.
- **UK database right.** The UK keeps an equivalent right; UK users "need the permission of the right holder(s)", and for databases made since 1 January 2021 only UK makers qualify for the UK right [119].
- **EU text-and-data-mining exception.** EU law lets anyone copy "lawfully accessible works" for automated analysis and keep the copies "for as long as is necessary", but only where the rightholder has not "expressly reserved" that use "in an appropriate manner, such as machine-readable means in the case of content made publicly available online" (Article 4). A separate, wider exception is limited to research organisations (Article 3) [118]. Marketplace terms and robots.txt rules are the obvious places for such a reservation, so we should not assume the exception is available.
- **UK text-and-data-mining exception.** It "only permits the making of copies for the purpose of text and data mining for non-commercial research" [120]. A commercial brand-intelligence platform cannot rely on it.
- **Internal analysis versus republishing.** Saving a copy for internal analysis is still copying, but it is far lower risk than showing the content to others. Practical rules: store facts and derived measures (sentiment scores, keyword counts, image attributes) in preference to raw content; store a link to an image, not the image file, wherever that is enough; keep raw copies for a short period; never show competitor images, copy or verbatim reviews in anything that leaves the company; our own brand's content is ours to use.
- **Not researched:** the copyright statutes of the UAE, Saudi Arabia, South Africa, India, Nigeria, Kenya and Malaysia.

### 2.5 Decision table: permitted, caution, avoid

**Qualified legal counsel must confirm this table before it is used.** "Permitted" means low risk on the evidence above, not a legal clearance. "Caution" means proceed only with the stated conditions and counsel's sign-off. "Avoid" means do not do it unless the site owner agrees in writing.

| Collection method or data type | Rating | Why | Conditions if we proceed |
|---|---|---|---|
| Official marketplace APIs for our own listings, orders, advertising and reports | **Permitted** | Access is granted by the marketplace under its API terms | Follow each API's own data-use terms |
| Manual CSV or report exports from our own seller or vendor accounts | **Permitted** | Our own data, exported by an authorised user | Normal access controls |
| Retailer-approved integration or written permission (for example, consent from Jumia under its terms) | **Permitted** | Written consent answers the terms-of-use problem [87] | Keep the consent on file and stay within it |
| Provider API — public product facts: price, availability, title, seller name, star rating, review count, search position | **Caution** (lowest-risk scraping route) | US rulings favour logged-out collection of public facts [95][97], but marketplace terms prohibit robots [86][89][90][91] and the contractual risk is not removed by using an intermediary | Public pages only, no login; modest volumes; vendor warrants lawful collection; written answer on anti-bot methods; pilot first |
| Pre-collected datasets bought from a provider | **Caution** | Same underlying collection, with less visibility of how and when it was done [23] | Ask for provenance, date and licence terms; no personal data fields |
| Review text without reviewer identifiers, for internal analysis | **Caution** | Review text is copyright content and may contain personal data [114][116] | Apply section 2.3; internal use only; short quotations in internal reports |
| Reviewer names, profile links, photos, locations | **Avoid** | Personal data with no need for it; Shopee's terms forbid harvesting account-holder information [91] | Switch the fields off or delete on arrival |
| Amazon full review history using an Amazon account cookie | **Avoid** | Logged-in collection; the provider itself warns of account bans [56] | None — use star rating, count and visible top reviews |
| Any collection behind a login, password, cart or account area | **Avoid** | Courts treat password-protected areas differently from public pages [95][105]; excluded by our policy | None |
| Solving CAPTCHAs, disguising the bot as a person, or rotating addresses to evade blocks — done by us | **Avoid** | Excluded by our policy; the CNIL treats CAPTCHA as a clear objection [114]; anti-circumvention claims are being tested in the US [109] | None |
| The same anti-bot evasion done by a vendor on our behalf | **Caution — needs a policy decision** | Common in the industry [61]; one US court distinguished it from breaking into private areas [97], but it conflicts with the spirit of our own rule | Decide explicitly; prefer vendors and settings that do not solve CAPTCHAs (keep Apify's solver off [7]) |
| Our own direct collection where robots.txt allows the page and the site's terms do not prohibit it | **Caution** | We found no such site among those whose terms we could read | Identify the bot honestly, keep to slow rates, stop on any block or objection |
| Our own direct collection where terms prohibit robots (Takealot, Flipkart, Nykaa, Shopee, Jumia without consent) | **Avoid** | Direct breach of quoted terms [86][87][89][90][91]; Ryanair confirms such terms can be relied on in the EU [102] | Seek written permission instead |
| Our own direct collection from Amazon, Walmart, Noon, Lazada | **Avoid until terms are read** | Terms not verified; Amazon bars 99 named bots in robots.txt [67]; Walmart and Noon block automated access [92][93] | Counsel reads the terms first |
| Paths a site disallows in robots.txt (for example Walmart /search, Flipkart /search? and /reviews/, Nykaa /search/, Target /s?, Amazon offer listings) | **Avoid** for our own collection | A clear statement of the site's wishes; Jumia's terms make it contractual [73][78][79][84][87] | For providers, ask which paths they fetch |
| Product images — keep a link plus derived attributes for internal analysis | **Caution** | Images are copyright works [86][89] | Internal only; store links not files where possible; short retention of any copies |
| Product copy (titles, bullets, descriptions) for internal comparison and keyword analysis | **Caution** | Copyright content; EU and UK mining exceptions are unlikely to apply [118][120] | Internal only; store derived measures; never reuse wording in our listings |
| Republishing competitor images, copy or verbatim reviews outside the company | **Avoid** | Copyright and terms of use [89][91] | Only with a licence |
| Harvesting whole categories or catalogues, especially from EU and UK sites | **Avoid** unless counsel approves | Database right and the Compulife and CV-Online reasoning [103][111][117] | Keep to a defined list of products and search terms |
| Search-position monitoring through a search-results provider | **Caution** | Factual data, but collected from search pages that several sites disallow [73][78] | Low frequency; vendor due diligence |
| Using collected content to train AI models | **Caution — out of scope here** | Separate and fast-moving litigation [108] | Separate legal review |

---

## Limitations and gaps

- **Web search was cut off part-way through.** The shared search allowance for this session ran out, so later sources were reached only by following links from pages already open. Some topics we would otherwise have checked are therefore missing: the Dutch regulator's scraping guidance (its page refused access), the European Data Protection Board's opinions, the current status of Google v. SerpApi and X Corp. v. Bright Data, and any Reddit scraping lawsuits.
- **Terms of use not retrieved:** Amazon (all country sites), Walmart, Noon, Lazada Malaysia and Jumia Nigeria. Amazon's robots.txt bars the AI agent this research ran under, so we did not fetch its pages; Walmart showed a human-verification challenge; Noon returned errors; Lazada and Jumia Nigeria delivered no terms text to automated access. The Amazon wording given is from prior knowledge and is labelled UNVERIFIED. No archived copy was used: one attempt to open an archived copy of Noon's terms was stopped by this session's network policy and was not pursued. Someone should read these five sets of terms in an ordinary browser (each site links its terms from the page footer) and record the wording and date.
- **robots.txt not retrieved:** noon.com and tesco.com.
- **Keepa:** keepa.com blocked automated access and its documentation site was outside this session's network permissions. Prices come from a third-party article and are UNVERIFIED; country coverage comes from a community client's documentation.
- **Coverage was read, not tested.** No provider was run and no marketplace page was fetched, so "documented" means the provider says it supports the site, not that it works reliably today. "Generic only" has no evidence of success at all.
- **Billing units for search pages** (per page or per product row) were not stated by Bright Data, and credits per request were not stated by Rainforest. The cost ranges show both readings.
- **Fifty rows per search page** is an assumption.
- **Several page readings were made with an automated summarising tool.** Prices used in the estimates, and all quoted terms, court passages and statute text, were re-checked against the raw page or document text. Descriptive details in the provider table that were not re-checked could contain small errors.
- **Vendor compliance statements are the vendors' own claims.** No certificate was inspected.
- **Secondary sources for some cases.** Ziff Davis v. OpenAI, Google v. SerpApi, Ryanair v. Booking.com, Compulife v. Newman and the later history of hiQ and X Corp. are reported from law-firm and academic blog posts, not from the court documents. One of those firms represented Bright Data [98][100].
- **Law summaries for the UAE, Saudi Arabia, India, Nigeria, Kenya, Malaysia and the US** come from a law firm's country guide, not from the statutes. The UAE page was last modified in January 2025 and may be out of date.
- **Not researched:** copyright statutes outside the EU, UK and US; Boots, Tesco, Target and Ulta terms of use; contract terms of the providers themselves (acceptable-use rules, indemnities, data-processing agreements).

---

## Sources

All accessed 2026-11-26. "n.d." means no publication or update date was shown.

**Providers**

1. Apify — "Pricing". https://apify.com/pricing — n.d.
2. Apify Store — "Amazon Product Scraper" (junglee/Amazon-crawler), maintained by Apify. https://apify.com/junglee/Amazon-crawler — modified 2026-11-26.
3. Apify Store — "Amazon Reviews Scraper" (junglee/amazon-reviews-scraper), maintained by Apify. https://apify.com/junglee/amazon-reviews-scraper — modified 2026-11-26.
4. Apify Store — "E-commerce Scraping Tool" (apify/e-commerce-scraping-tool). https://apify.com/apify/e-commerce-scraping-tool — n.d.
5. Apify Store — "Amazon Product Scraper · No Login" (alfalfa/amazon-product-scraper), community. https://apify.com/alfalfa/amazon-product-scraper — n.d.
6. Apify Store — "Amazon Reviews Scraper — Review Text, Ratings & ASIN Data" (jaybird/amazon-reviews-scraper), community. https://apify.com/jaybird/amazon-reviews-scraper — n.d.
7. Apify Store — "Amazon ASINs Scraper" (junglee/amazon-asins-scraper), maintained by Apify. https://apify.com/junglee/amazon-asins-scraper — n.d.
8. Apify Store — "Walmart Product Detail Scraper" (e-commerce/walmart-product-detail-scraper), maintained by Apify. https://apify.com/e-commerce/walmart-product-detail-scraper — n.d.
9. Apify Store — "Noon Product Scraper — UAE, KSA, Egypt & GCC" (memo23/noon-scraper), community. https://apify.com/memo23/noon-scraper — n.d.
10. Apify Store — "Takealot Products Scraper" (shahidirfan/Takealot-Products-Scraper), community. https://apify.com/shahidirfan/Takealot-Products-Scraper — n.d.
11. Apify Store — "Jumia Product Scraper — Prices, SKUs & Sellers" (khadinakbar/jumia-product-scraper), community. https://apify.com/khadinakbar/jumia-product-scraper — n.d.
12. Apify Store — "Flipkart Scraper - Products, Prices, Specs & Reviews" (scrapesage/flipkart-scraper), community. https://apify.com/scrapesage/flipkart-scraper — n.d.
13. Apify Store — "Nykaa Scraper: Beauty Products, Prices, Reviews" (automation_craft/nykaa-scraper), community. https://apify.com/automation_craft/nykaa-scraper — n.d.
14. Apify Store — "Shopee Scraper - Prices, Units Sold & Sellers" (gio21/shopee-scraper), community. https://apify.com/gio21/shopee-scraper — n.d.
15. Apify Store — "Lazada Scraper | All-In-One" (fatihtahta/lazada-scraper), community. https://apify.com/fatihtahta/lazada-scraper — n.d.
16. Apify Store — "Tesco UK & Ireland Scraper" (radeance/tesco-scraper), community. https://apify.com/radeance/tesco-scraper — n.d.
17. Apify Store — "Boots UK Product Scraper" (dromb/boots-uk-product-search-catalog-unofficial), community. https://apify.com/dromb/boots-uk-product-search-catalog-unofficial — n.d.
18. Apify Store — "Target Scraper - Products, Prices & Store Stock" (automation-lab/target-scraper), community. https://apify.com/automation-lab/target-scraper — n.d.
19. Apify Store — "Ulta Beauty Scraper" (solidcode/ulta-scraper), community. https://apify.com/solidcode/ulta-scraper — n.d.
20. Apify blog — Ondra Urban, "Is web scraping legal?". https://blog.apify.com/is-web-scraping-legal/ — 10 February 2026.
21. Bright Data — "Web Scraper API pricing". https://brightdata.com/pricing/web-scraper — n.d.
22. Bright Data — "eCommerce scrapers". https://brightdata.com/products/web-scraper/ecommerce — n.d.
23. Bright Data — "eCommerce datasets". https://brightdata.com/products/datasets/ecommerce — n.d.
24. Bright Data — "Amazon Scraper". https://brightdata.com/products/web-scraper/amazon — n.d.
25. Bright Data — "Flipkart Scraper". https://brightdata.com/products/web-scraper/flipkart — n.d.
26. Bright Data — "Shopee Scraper". https://brightdata.com/products/web-scraper/shopee — n.d.
27. Bright Data — "Noon Scraper". https://brightdata.com/products/web-scraper/noon — n.d.
28. Bright Data — "Trust Center". https://brightdata.com/trustcenter — n.d.
29. Oxylabs — "Web Scraper API pricing". https://oxylabs.io/products/scraper-api/web/pricing — n.d.
30. Oxylabs — "E-Commerce Scraper API". https://oxylabs.io/products/scraper-api/ecommerce — n.d.
31. Oxylabs developer documentation — "Commerce Scrapers". https://developers.oxylabs.io/api-reference/dedicated-scrapers/commerce-scrapers.md — n.d.
32. Oxylabs blog — "How to scrape Amazon reviews". https://oxylabs.io/blog/how-to-scrape-amazon-reviews — updated 22 June 2026.
33. Zyte — "Pricing". https://www.zyte.com/pricing/ — n.d.
34. Zyte — "Product data". https://www.zyte.com/data-types/product-scraper/ — n.d.
35. Zyte — "AI extraction". https://www.zyte.com/zyte-api/ai-extraction/ — n.d.
36. ScraperAPI — "Pricing". https://www.scraperapi.com/pricing/ — n.d.
37. ScraperAPI documentation — "E-commerce" structured data endpoints. https://docs.scraperapi.com/structured-data-endpoints/e-commerce.md — n.d.
38. ScraperAPI documentation — "Amazon Product API". https://docs.scraperapi.com/structured-data-endpoints/e-commerce/amazon/amazon-product-api.md — n.d.
39. ScraperAPI documentation — "Credits and Requests costs". https://docs.scraperapi.com/getting-started/quick-start/credits-and-requests-costs.md — n.d.
40. SerpApi — "Pricing". https://serpapi.com/pricing — n.d.
41. SerpApi — "Amazon Search API". https://serpapi.com/amazon-search-api — n.d.
42. SerpApi — "Supported Amazon domains". https://serpapi.com/amazon-domains — n.d.
43. SerpApi — "Search engine APIs". https://serpapi.com/search-engine-apis — n.d.
44. Traject Data — "Rainforest API pricing". https://trajectdata.com/ecommerce/rainforest-api/pricing/ — n.d.
45. Traject Data documentation — "Rainforest API: Amazon domains". https://docs.trajectdata.com/rainforestapi/product-data-api/reference/amazon-domains — n.d.
46. Traject Data — "BlueCart API". https://trajectdata.com/ecommerce/bluecart-api/ — n.d.
47. keepa Python client documentation (third party) — "keepa.Domain". https://keepaapi.readthedocs.io/en/latest/api/types/keepa.Domain.html — n.d.
48. PyPI — "keepa" version 1.6.0. https://pypi.org/project/keepa/ — 5 October 2026.
49. RevenueGeeks (third party) — "Keepa pricing". https://revenuegeeks.com/keepa-pricing/ — updated 20 August 2026.
50. Keepa — API page. https://keepa.com/#!api — not readable: blocked by the site's security service on 2026-11-26.
51. DataForSEO — "Merchant API". https://dataforseo.com/apis/merchant-api — n.d.
52. DataForSEO documentation — "Merchant API: Amazon locations". https://docs.dataforseo.com/v3/merchant/amazon/locations/ — locations list updated 2 November 2026.
53. Firecrawl — "Pricing". https://www.firecrawl.dev/pricing — n.d.
54. Unwrangle — home page with pricing. https://www.unwrangle.com/ — n.d.
55. Unwrangle documentation — home. https://docs.unwrangle.com/ — n.d.
56. Unwrangle documentation — "Amazon Product Reviews API". https://docs.unwrangle.com/amazon-product-reviews-api/ — n.d.
57. Unwrangle documentation — "Amazon Product Data API". https://docs.unwrangle.com/amazon-product-data-api/ — n.d.
58. Canopy API — home page. https://www.canopyapi.co/ — n.d.
59. Canopy API — documentation. https://docs.canopyapi.co/ — n.d.
60. Decodo — "Web Scraping API pricing". https://decodo.com/scraping/web/pricing — n.d.
61. Decodo — "eCommerce Scraping API". https://decodo.com/scraping/ecommerce — n.d.
62. Jungle Scout — "Jungle Scout API". https://www.junglescout.com/products/jungle-scout-api/ — n.d.
63. SmartScout — "Pricing". https://www.smartscout.com/pricing — n.d.
64. Similarweb — "Pricing". https://www.similarweb.com/corp/pricing/ — n.d.
65. RealData API — "Noon Data Scraping API". https://www.realdataapi.com/noon-api.php — n.d.
66. ScrapeIt — "Jumia scraper". https://www.scrapeit.io/scraper/jumia — n.d.

**robots.txt files**

67. Amazon.com — robots.txt. https://www.amazon.com/robots.txt
68. Amazon.ae — robots.txt. https://www.amazon.ae/robots.txt
69. Amazon.co.uk — robots.txt. https://www.amazon.co.uk/robots.txt
70. Amazon.in — robots.txt. https://www.amazon.in/robots.txt
71. Amazon.sa — robots.txt. https://www.amazon.sa/robots.txt
72. Amazon.co.za — robots.txt. https://www.amazon.co.za/robots.txt
73. Walmart — robots.txt. https://www.walmart.com/robots.txt
74. Noon — robots.txt. https://www.noon.com/robots.txt — fetch failed (connection error; HTTP 503).
75. Takealot — robots.txt. https://www.takealot.com/robots.txt
76. Jumia Nigeria — robots.txt. https://www.jumia.com.ng/robots.txt
77. Jumia Kenya — robots.txt. https://www.jumia.co.ke/robots.txt
78. Flipkart — robots.txt. https://www.flipkart.com/robots.txt
79. Nykaa — robots.txt. https://www.nykaa.com/robots.txt
80. Shopee Malaysia — robots.txt. https://shopee.com.my/robots.txt
81. Lazada Malaysia — robots.txt. https://www.lazada.com.my/robots.txt
82. Boots — robots.txt. https://www.boots.com/robots.txt
83. Tesco — robots.txt. https://www.tesco.com/robots.txt — refused (HTTP 403).
84. Target — robots.txt. https://www.target.com/robots.txt
85. Ulta — robots.txt. https://www.ulta.com/robots.txt

**Terms of use**

86. Takealot — "Terms & Conditions". https://terms-and-policies.takealot.com/terms-conditions/ — n.d.
87. Jumia Kenya — "Terms & Conditions" (General Terms and Conditions of Use of the Marketplace). https://www.jumia.co.ke/fragment/contents/sp-terms-and-conditions/?lang=en — Version 3.0, published 30 March 2025.
88. Jumia Nigeria — "Terms and Conditions". https://www.jumia.com.ng/sp-terms-of-use/ — title only retrieved.
89. Flipkart — "Terms of Use". https://www.flipkart.com/pages/terms — n.d.
90. Nykaa — "Terms & Conditions". https://www.nykaa.com/terms-conditions — last updated 10 June 2026, Version 1.3.
91. Shopee Malaysia — "Shopee Terms of Services". https://help.shopee.com.my/portal/article/77215 — last updated 9 October 2026.
92. Walmart — "Walmart.com Terms of Use". https://www.walmart.com/help/article/walmart-com-terms-of-use/3b75080af40340d6bbd596f116fae5a0 — not retrieved (human-verification challenge).
93. Noon — "Terms of Use". https://www.noon.com/uae-en/terms-of-use/ — not retrieved (HTTP 503).
94. Lazada Malaysia — "Terms of Use". https://www.lazada.com.my/terms-of-use/ — not retrieved (navigation only).

**Court decisions and commentary**

95. US Court of Appeals for the Ninth Circuit — hiQ Labs, Inc. v. LinkedIn Corp., No. 17-16783, opinion. https://cdn.ca9.uscourts.gov/datastore/opinions/2022/04/18/17-16783.pdf — 18 April 2022.
96. Jeffrey Neuburger (Proskauer Rose), "hiQ and LinkedIn Reach Proposed Settlement in Landmark Scraping Case", National Law Review. https://www.natlawreview.com/article/hiq-and-linkedin-reach-proposed-settlement-landmark-scraping-case — 8 December 2022.
97. US District Court, Northern District of California — Meta Platforms, Inc. v. Bright Data Ltd., No. 23-cv-00077-EMC, order (document 181). https://storage.courtlistener.com/recap/gov.uscourts.cand.406956/gov.uscourts.cand.406956.181.0_1.pdf — 23 January 2024.
98. Jeffrey Neuburger, "California Court Issues Noteworthy Decision on Breach of Contract Claims in Web Scraping Dispute", Proskauer New Media and Technology Law Blog. https://newmedialaw.proskauer.com/2024/01/24/california-court-issues-noteworthy-decision-on-breach-of-contract-claims-in-web-scraping-dispute/ — 24 January 2024.
99. US District Court, Northern District of California — X Corp. v. Bright Data Ltd., No. C 23-03698 WHA, order dismissing complaint (document 83). https://storage.courtlistener.com/recap/gov.uscourts.cand.415869/gov.uscourts.cand.415869.83.0.pdf — 9 May 2024.
100. Jeffrey Neuburger, "California Court Issues Another Noteworthy Decision Dismissing Breach of Contract and Tort Claims in Web Scraping Dispute", Proskauer New Media and Technology Law Blog. https://newmedialaw.proskauer.com/2024/05/14/california-court-issues-another-noteworthy-decision-dismissing-breach-of-contract-and-tort-claims-in-web-scraping-dispute/ — 14 May 2024.
101. Kieran McCarthy, "Catching Up on the Heavyweight Scraping Battle Between X and Bright Data", Technology & Marketing Law Blog. https://blog.ericgoldman.org/archives/2025/01/catching-up-on-the-heavyweight-scraping-battle-between-x-and-bright-data-guest-blog-post.htm — 13 January 2025.
102. Court of Justice of the EU — Case C-30/14, Ryanair Ltd v PR Aviation BV, judgment. https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:62014CJ0030 — 15 January 2015.
103. Court of Justice of the EU — Case C-762/19, CV-Online Latvia v Melons, judgment. https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:62019CJ0762 — 3 June 2021.
104. US Court of Appeals for the Ninth Circuit — Amazon.com Services, LLC v. Perplexity AI, Inc., No. 26-1444, opinion. https://cdn.ca9.uscourts.gov/datastore/opinions/2026/08/04/26-1444.pdf — 4 August 2026.
105. US District Court, Northern District of California — Amazon.com Services LLC v. Perplexity AI, Inc., No. 25-cv-09514-MMC, order granting preliminary injunction (document 81). https://assets.alm.com/4c/fb/547b62214bf3bf5b82844f8b6653/dkt081-2026-03-09-main-document.pdf — 9 March 2026.
106. Eric Goldman, "Ninth Circuit Lifts Restrictions on Agentic AI Accessing Amazon", Technology & Marketing Law Blog. https://blog.ericgoldman.org/archives/2026/08/ninth-circuit-lifts-restrictions-on-agentic-ai-accessing-amazon.htm — 6 August 2026.
107. Kieran McCarthy, "When Can Amazon Block an Agentic AI Service?–Amazon v. Perplexity", Technology & Marketing Law Blog. https://blog.ericgoldman.org/archives/2026/06/when-can-amazon-block-an-agentic-ai-service-amazon-v-perplexity-guest-blog-post.htm — 6 June 2026.
108. Eric Goldman, "Are Robots.txt Instructions Legally Binding?–Ziff Davis v. OpenAI", Technology & Marketing Law Blog. https://blog.ericgoldman.org/archives/2025/12/are-robots-txt-instructions-legally-binding-ziff-davis-v-openai.htm — 17 December 2025.
109. Kieran McCarthy, "Relitigating hiQ Labs and Scraping Through the Lens of DMCA 1201 Anti-Circumvention", Technology & Marketing Law Blog. https://blog.ericgoldman.org/archives/2026/01/relitigating-hiq-labs-and-scraping-through-the-lens-of-the-dmca-1201-anti-circumvention-guest-blog-post.htm — 26 January 2026.
110. Kieran McCarthy, "Court Overturns a Bad Jury Verdict Against Scraping–Ryanair v Booking", Technology & Marketing Law Blog. https://blog.ericgoldman.org/archives/2025/03/court-overturns-a-bad-jury-verdict-against-scraping-ryanair-v-booking-guest-blog-post.htm — 2 March 2025.
111. Jeffrey Neuburger, "Court Rules That Scraping of Public Data by Competitor Constitutes Trade Secret Misappropriation", Proskauer New Media and Technology Law Blog. https://newmedialaw.proskauer.com/2024/09/16/court-rules-that-scraping-of-public-data-by-competitor-constitutes-trade-secret-misappropriation/ — 16 September 2024.
112. Eric Goldman, "My Reddit AMA on the Law of Web Scraping", Technology & Marketing Law Blog. https://blog.ericgoldman.org/archives/2026/10/my-reddit-ama-on-the-law-of-web-scraping.htm — 12 October 2026.

**Regulators and legislation**

113. UK Information Commissioner's Office — "Global privacy authorities issue follow-up joint statement on data scraping after industry engagement". https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2024/10/global-privacy-authorities-issue-follow-up-joint-statement-on-data-scraping-after-industry-engagement/ — 28 October 2024.
114. CNIL (France) — "The legal basis of legitimate interest: focus sheet on the measures to implement in the case of data collection by web scraping". https://www.cnil.fr/en/legal-basis-legitimate-interest-focus-sheet-measures-implement-case-data-collection-web-scraping — 5 January 2026.
115. UK Information Commissioner's Office — "Legitimate interests" guidance. https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/legitimate-interests/ — latest update 23 March 2026.
116. Regulation (EU) 2016/679 (General Data Protection Regulation). https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32016R0679 — 27 April 2016.
117. Directive 96/9/EC on the legal protection of databases. https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:31996L0009 — 11 March 1996.
118. Directive (EU) 2019/790 on copyright in the Digital Single Market. https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32019L0790 — 17 April 2019.
119. UK Intellectual Property Office — "Sui generis database rights". https://www.gov.uk/guidance/sui-generis-database-rights — published 30 January 2020.
120. UK Intellectual Property Office — "Exceptions to copyright". https://www.gov.uk/guidance/exceptions-to-copyright — last updated 4 January 2021.
121. POPIA website (text of the Act) — "Section 12: Collection directly from data subject". https://popia.co.za/section-12-collection-directly-from-data-subject/ — n.d.
122. DLA Piper, Data Protection Laws of the World — United Arab Emirates. https://www.dlapiperdataprotection.com/index.html?t=law&c=AE — last modified 27 January 2025.
123. DLA Piper, Data Protection Laws of the World — Saudi Arabia. https://www.dlapiperdataprotection.com/index.html?t=law&c=SA — last modified 11 February 2026.
124. DLA Piper, Data Protection Laws of the World — India. https://www.dlapiperdataprotection.com/index.html?t=law&c=IN — last modified 13 February 2026.
125. DLA Piper, Data Protection Laws of the World — South Africa. https://www.dlapiperdataprotection.com/index.html?t=law&c=ZA — last modified 16 February 2026.
126. DLA Piper, Data Protection Laws of the World — Nigeria. https://www.dlapiperdataprotection.com/index.html?t=law&c=NG — last modified 17 March 2026.
127. DLA Piper, Data Protection Laws of the World — Kenya. https://www.dlapiperdataprotection.com/index.html?t=law&c=KE — last modified 23 March 2026.
128. DLA Piper, Data Protection Laws of the World — Malaysia. https://www.dlapiperdataprotection.com/index.html?t=law&c=MY — last modified 12 February 2026.
129. DLA Piper, Data Protection Laws of the World — United States. https://www.dlapiperdataprotection.com/index.html?t=law&c=US — last modified 31 March 2026.
