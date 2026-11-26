# D1 — Official APIs for listing, price, review and quality-score data

**Feasibility assessment for the Brand Intelligence Engine**
Research date: 2026-11-26 · Every source below was retrieved on 2026-11-26 · Markets in scope: UAE, Saudi Arabia, South Africa, United States, United Kingdom, India, Kenya, Nigeria, Malaysia

## How to read this document

- **Own listings** means products sold through a seller or vendor account that has authorised the engine. **Competitor listings** means any product that account does not sell.
- **Seller of record** is the account that owns the offer shoppers buy from. **3P / seller** means the brand (or its distributor) sells to shoppers on the marketplace. **1P / vendor / supplier** means the brand sells to the retailer and the retailer sells to shoppers.
- Every factual statement carries a source number such as [7]; the numbered list is at the end. Text inside quotation marks is verbatim from the source.
- **UNVERIFIED** means the point could not be confirmed today from a page that was actually retrieved. **Not publicly documented** means the platform keeps its documentation behind a login or refused to serve it.
- Where this document interprets contract or policy wording it says so. Those interpretations are not legal advice.
- A machine-readable version of every record is in `data/research/apis/official-apis.json`.
- Method note: the session's web-search allowance ran out part-way through the work, so the later sections rely on official pages fetched directly by address. What that prevented is listed under "Limitations and gaps".

## Bottom line

1. **Amazon has no official listing-quality score in its API.** The Selling Partner API (SP-API) documentation index contains no quality-score operation or report [1]. What Amazon does expose for your own listings is a list of "issues" per listing with a severity and any enforcement action such as search suppression [2], a Suppressed Listings report [3], and the machine-readable attribute requirements for every product type [4]. The engine has to compute its own Amazon score from these.
2. **Official quality scores do exist by API on five other platforms, for your own listings only:** Walmart Marketplace (Listing Quality score 0–100 at seller and item level) [5][6], Walmart 1P suppliers (Content Quality Score in the product content report) [7], Shopee (content quality level plus issue list) [8], Lazada (product content score) [9], TikTok Shop (listing quality tier, United States only, plus diagnoses) [10] and Takealot (a `catalogue_quality_score` field on each offer whose meaning is not documented) [11].
3. **Competitor data through official APIs is thin everywhere.** Amazon's SP-API will return catalogue facts (title, attributes, images, identifiers, sales rank) [12] and the lowest and featured offers [13][14] for any product code, but never star ratings or review text [12]. Amazon's contract says the data is provided "solely for the purpose of supporting an Authorized User's business with Amazon" [15], so treat it as support for your own selling, not as a market-monitoring feed, and have counsel confirm the intended use.
4. **Amazon's affiliate API is not a route.** Product Advertising API 5.0 is switched off and returns an error [16]. Its replacement, the Creators API, requires an Amazon Associates account with at least 10 qualifying sales in the past 30 days [17], and its licence forbids use "for the purpose of aggregating, analyzing, extracting, or repurposing" the content or in software "intended for use by persons or entities that offer products on an Amazon Site" without written approval [18].
5. **Fees: the Amazon SP-API fee programme was cancelled.** Amazon's developer site states it "will not move forward with the SP-API usage and annual fees at this time" [19]. The plan announced in November 2025 (USD 1,400 a year plus usage fees for third-party developers) was reported as never applying to sellers and vendors who use the API only for their own business [20]. No API usage fee was found in the Walmart, Google, Takealot, Shopee, Lazada or TikTok Shop documentation retrieved. Reviews platforms are paid subscriptions (for example Trustpilot's API module tiers) [21].
6. **Amazon coverage is uneven by country.** All six Amazon stores in scope (US, UK, UAE, Saudi Arabia, India, South Africa) exist in the SP-API [22]. But the Brand Analytics search reports list no South Africa store [23], and the Customer Feedback (review topics) API covers only the US and UK among our markets [24].
7. **Kenya, Nigeria and Noon are documentation black holes.** Amazon has no store in Kenya, Nigeria or Malaysia [22]. Jumia's vendor tools are behind a login and no public API documentation could be retrieved [25][26]. Noon's developer portal redirects to a partner login [27]. Plan for portal exports and retailer-supplied reports in those channels until the account managers confirm otherwise.
8. **Malaysia is well served.** Shopee, Lazada and TikTok Shop each publish an open platform that covers Malaysia and includes content-quality diagnostics and, for Shopee and Lazada, your own review text [28][9][29][30].
9. **Selling through distributors removes most API access.** Marketplace seller APIs answer only for the account that authorises them. On Amazon the remaining official routes are Brand Registry roles (the Brand Representative role unlocks Brand Analytics; the Reseller role given to distributors does not) [31], an app the distributor authorises [32], content-change alerts for verified brand owners [33], and a vendor "manufacturing view" that covers every product the vendor manufactures "regardless of who sourced the products to Amazon" [34].
10. **Review text is the hardest data type.** Official own-review text is available from Shopee [35] and Lazada [36]. Amazon offers only summarised review topics in a few stores [24] and review counts through Data Kiosk [37]. Walmart's "Reviews API" manages a paid review-generation programme and does not return review text [38].
11. **Google Merchant Center gives market benchmarks, not competitor listings.** The Merchant API reports cover best-selling products and brands, a price benchmark for products you also sell, and visibility relative to other merchants [39][40]. The older Content API for Shopping "was sunset on August 18, 2026" [41], so build on the Merchant API only. Popular-products data is not offered for Kenya, Nigeria or Malaysia [42].
12. **Barcode checks can be done in-house; ownership checks need GS1.** The GTIN check-digit rule is public and simple to implement [43]. Confirming who owns a barcode uses Verified by GS1, which is free to look up one at a time, with batch and API access arranged through the local GS1 office at a price that is not published [44].

---

## 1. Amazon Selling Partner API (SP-API)

### 1.1 Summary record

| Field | Finding |
|---|---|
| What it is | A REST API "that helps sellers and vendors access their data on orders, shipments, payments, inventory, and other business information" [45]. |
| Authentication | Login with Amazon (OAuth 2.0). A private application is self-authorised by its own organisation and receives a long-lived refresh token; a public application is authorised by each selling partner through OAuth [46][47]. |
| Who can get access | A seller with a Professional selling account (Individual accounts are not eligible) or a vendor, registering as a private developer; or a public developer whose application other sellers or vendors authorise [47]. Registration must be done by the primary account user [47]. A brand that only works through a distributor has no account of its own to authorise (see section 11). |
| Own-listing data | Title, bullets, description, all attributes and images as submitted [2]; catalogue view of the same product [12]; A+ content you published [48]; price and offer [2]; featured offer (Buy Box) data, sellers only [49]; stock availability [2]; listing issues and suppression [2]; sales rank [12]; sales and traffic [23]; search performance, with Brand Registry [23]; review counts [37]; review topics in some stores [24]. |
| Competitor data | Catalogue facts and sales rank for any product code [12]; lowest-priced and featured offers for any product code, sellers only [13][14]; most-clicked products per search term through the Amazon Search Terms report [23]. No rating, review text, Q&A, stock or A+ content of other sellers [12][1]. |
| Official quality score | **No.** See 1.5. |
| Main limitations | Low request rates on pricing operations (1.7); no history for content (the engine must store snapshots); several reports limited to Brand Registry members and to certain stores (1.4); contract limits use to supporting the authorising account's business (1.6). |
| Pricing | No API fee in force: the third-party developer fee programme was cancelled (1.8) [19]. A Professional selling account is required for a private seller application [47]; the price of that plan was not checked today (UNVERIFIED). |
| Geography | Stores exist for US, UK, UAE, Saudi Arabia, India and South Africa. None for Kenya, Nigeria or Malaysia [22]. |
| Historical data | Data Kiosk seller analytics: start date "no more than two years ago" [37]. Search Query Performance: maximum monthly reporting period 17 months [23]. Vendor sales, traffic and inventory reports: daily data back 1,460 days, monthly back 36 months [23]. Review-topic trends: six months [24]. Listing content and prices: current state only. |
| Competitor monitoring permitted? | **Restricted.** Technically possible for catalogue and offer data; contractually limited to supporting the authorising account's own business (1.6). |
| Integration complexity | **High.** Developer registration with a security questionnaire, role approval, per-operation rate limits, asynchronous reports, and a data-protection policy that is audited [50][51]. |

### 1.2 Registration and developer types

| Type | What it is | How it is authorised | Limit |
|---|---|---|---|
| Private seller application | "Applications for sellers that are available only to your organization, and are self-authorized" [47] | Self-authorisation by the Primary User of the Seller Central account [46] | 10 self-authorisations; OAuth by other companies is "Not available" [32] |
| Private vendor application | Vendor application available only to your organisation; "in-house IT resources, or a third-party IT company or agency creating an app for you" [52] | Self-authorisation in Vendor Central, per vendor group [52] | 10 self-authorisations [32] |
| Public application | Applications "that are publicly available and are authorized by sellers or by vendors using OAuth" [47] | OAuth by each selling partner; re-authorisation is required annually [53][54] | Not listed in the Selling Partner Appstore: 25 seller authorisations (vendors unlimited). Listed: unlimited [32] |

- Public developers "must list their app in the Amazon Selling Partner Appstore" under the Solution Provider Portal Agreement [47]. The agreement requires listing "if you sell your Application or offer it for use to Solution Provider Customers" [15].
- Registration means completing a Developer Profile: contact details, the data you need, the roles you request, use cases and security controls, and acceptance of the Solution Provider Portal Agreement, Acceptable Use Policy and Data Protection Policy, which Amazon publishes by language and region [55]. Amazon opens a case and you "must respond within five days" to any question [50].
- **Roles** decide which operations an application may call. The ones this engine needs are Product Listing (sellers and vendors), Pricing (sellers only), Brand Analytics (sellers and vendors), Selling Partner Insights (sellers only) and Inventory and Order Tracking (sellers and vendors) [56]. None of these is marked "Restricted".
- **Restricted roles** are those that involve personally identifiable information, such as Direct-to-Consumer Shipping and Tax Invoicing [56]. Public developers requesting them go through an architecture review [53]. The engine does not need them for listing, price or quality data.
- Calling an operation without the required role returns a 403 error [56].

### 1.3 Marketplace availability for our countries

| Country | Amazon store in SP-API | Store identifier | Region and endpoint |
|---|---|---|---|
| United States | Yes | ATVPDKIKX0DER | North America — sellingpartnerapi-na.amazon.com |
| United Kingdom | Yes | A1F83G8C2ARO7P | Europe — sellingpartnerapi-eu.amazon.com |
| United Arab Emirates | Yes | A2VIGQ35RCS4UG | Europe — sellingpartnerapi-eu.amazon.com |
| Saudi Arabia | Yes | A17E79C6D8DWNP | Europe — sellingpartnerapi-eu.amazon.com |
| India | Yes | A21TJRUUN4KGV | Europe — sellingpartnerapi-eu.amazon.com |
| South Africa | Yes | AE08WJ6YKNBMC | Europe — sellingpartnerapi-eu.amazon.com |
| Kenya, Nigeria, Malaysia | No store listed | — | — |

Sources: store identifiers [22], endpoints [57]. Five of our six Amazon stores are served by the single Europe endpoint; the US store uses the North America endpoint.

### 1.4 What each relevant API returns

| API (version) | Who | What it returns | Required role | Notes |
|---|---|---|---|---|
| **Catalog Items** (2022-04-01) | Sellers and vendors [58] | For any product code (ASIN): summaries (item name, brand, manufacturer, browse category, colour, size and similar), attributes, browse classifications, dimensions, identifiers such as UPC and EAN, images, product types, variation relationships, sales ranks; vendor details for vendors only [12]. Search by identifier or by keyword, optionally limited to brand names [59]; at most 1,000 results can be paged [60]. | Product Listing [58] | The response model has no rating, review or offer-price field [12]. |
| **Listings Items** (2021-08-01) | Sellers and vendors [61] | For your own SKU: summary (ASIN, product type, status BUYABLE or DISCOVERABLE, item name, main image, created and updated dates), attributes (the latest data the selling partner submitted), **issues**, offers (price), fulfilment availability, vendor procurement details, relationships, product types [2][61]. | Product Listing or Inventory and Order Tracking [61] | Also creates and edits listings. A validation-preview mode tests a payload without saving it [62]. |
| **Listing issues** (inside Listings Items) | Sellers and vendors | Each issue has a code, message, severity (ERROR, WARNING, INFO), the attribute names concerned, categories (INVALID_ATTRIBUTE, MISSING_ATTRIBUTE, INVALID_IMAGE, MISSING_IMAGE, INVALID_PRICE, MISSING_PRICE, DUPLICATE, QUALIFICATION_REQUIRED, PRODUCT, LISTING) and enforcement actions (LISTING_SUPPRESSED, ATTRIBUTE_SUPPRESSED, CATALOG_ITEM_REMOVED, SEARCH_SUPPRESSED) with exemption status [2]. | as above | Amazon warns that "All problems that can occur with a listing do not have corresponding defined issues" [33]. |
| **Product Type Definitions** (2020-09-01) | Sellers and vendors [4] | The attribute and data requirements of each Amazon product type as JSON Schema, per store and per seller or vendor, including conditional requirements; schema download links are valid for seven days [4][63][62]. | Product Listing or Inventory and Order Tracking [4] | This is the official source for a requirements engine. A notification announces new product types and versions [33]. |
| **A+ Content Management** (2020-11-01) | Sellers and vendors [64] | Create, edit, submit and suspend A+ content; read "content that is already published by the selling partner"; list the ASINs attached to a content document [48]. | Brand Analytics or Product Listing [64] | Own content only. |
| **Product Pricing** (2022-05-01 and v0) | **Sellers only** [49] | `getCompetitiveSummary`: featured buying options with seller identifiers and customer segments, reference prices such as the competitive price threshold, up to 20 lowest-priced offers, and active promotions [14][65]. `getItemOffers` (v0): for an ASIN, each offer's seller identifier, listing price, shipping, whether it is the Buy Box winner, whether fulfilled by Amazon, seller feedback rating; plus Buy Box prices, number of offers and sales rankings [13]. `getFeaturedOfferExpectedPriceBatch`: the price at which your own offer is expected to win the featured offer, up to 40 SKUs [49]. | Pricing, which is not available to vendors [56] | Amazon describes the purpose as helping "sellers … update and manage their prices" and supporting repricers that "monitor price points, competitor prices" [49]. |
| **Reports — Brand Analytics** | Sellers with the Brand Analytics role who "are registered in Amazon Brand Registry"; some reports also vendors [23] | Search Query Performance and Search Catalog Performance (impressions, clicks, cart adds, purchases and your share of each, by search query or by ASIN); Market Basket; Repeat Purchase; Amazon Search Terms (search frequency rank and the most-clicked ASINs per term with click share and conversion share) [23]. | Brand Analytics | Search Query Performance, Search Catalog Performance and Market Basket are listed for US, UK, UAE, Saudi Arabia and India (among others) but **not South Africa** [23]. Search Terms needs a "brand representative" [23]. |
| **Reports — Sales and Traffic** | Sellers [23] | Ordered product sales, units, page views, sessions, Buy Box percentage and conversion by date and by ASIN [23]. | Brand Analytics | Can be requested or scheduled [23]. |
| **Reports — Suppressed Listings** | Sellers | A report that "contains suppressed listings, the reason each listing is suppressed, and instructions for removing each suppression" [3]. | Product Listing | One store per report [3]. |
| **Data Kiosk** (2023-11-15) | Sellers and vendors [66] | A query service (GraphQL) over analytics datasets. Seller Analytics: sales, traffic (including featured-offer percentage), promotions, account health, search (per keyword), **reviews** (`totalReviewCount`, `lowRatingReviewCount`, `criticalReviewRate`), return defects and returns, grouped by ASIN, SKU, brand and more [37]. Vendor Analytics: sales, traffic, inventory, forecasts, customer reviews and return topics [34]. | Brand Analytics [66] | Data for a day is ready "after 34 hours" [37]. Amazon states that reports will move from the Reports API to Data Kiosk over time [66]. |
| **Customer Feedback** (2024-06-01) | Sellers and vendors [24] | For an ASIN: the ten most positive and ten most negative review topics with number of mentions, share of reviews, effect on star rating, up to three review snippets per topic, and six-month trends. For a category (browse node): the same for reviews, plus return topics [24][67]. | Selling Partner Insights (sellers) or Brand Analytics (vendors) [24] | **Only US, UK, France, Italy, Germany, Spain, Japan**; refreshed weekly; English only [24]. It is not full review text. |
| **Sales** (v1) | Sellers only [68] | Aggregated order metrics for a period [68]. | Inventory and Order Tracking [56] | — |
| **Notifications** (v1) | Varies by type [33] | Push messages: listing status change; listing issues change; **branded item content change** (title, description, bullets or images changed on any ASIN the verified brand owner has a brand relationship with); product type change; any offer changed (top 20 offers and Buy Box); pricing health; hourly detail-page traffic [33]. | By type | "You cannot subscribe to notifications for items for which you do not have active offers" (any-offer-changed) [33]. |
| **Vendor (1P) APIs and reports** | Vendors | Catalog Items, Listings Items and Product Type Definitions for catalogue management; retail procurement orders, shipments and invoices; direct fulfilment; vendor sales, traffic, inventory, forecasting and net pure product margin reports, including hourly "rapid retail analytics"; Market Basket, Search Terms and Repeat Purchase reports [69][23]. | Brand Analytics for the reports [23] | Product Pricing API and Sales API are not available to vendors [49][68]. |
| **Action Items** (2026-06-01) | Sellers only [70] | Tasks and recommendations Amazon publishes for a seller; the documented example is expansion into another European store [70]. | Selling Partner Insights | Not a listing-quality score; cannot be filtered by ASIN or SKU [70]. |

### 1.5 Is there an official Amazon listing-quality score available by API?

**No.** The complete SP-API documentation index lists no operation, report or dataset that returns a listing-quality or content score [1]. The official building blocks that can feed a score the engine calculates itself are:

- **Listing issues** with severity and enforcement (for example search suppression) for each of your own SKUs, available on demand and as push notifications [2][33].
- **Suppressed Listings report** with the reason for each suppression [3].
- **Product Type Definitions**, which state which attributes are required or conditionally required for each product type and store [4].
- **Outcome measures** for your own products: page views, sessions, Buy Box percentage and conversion [23]; search impressions, clicks and share (Brand Registry) [23]; review counts and critical-review rate [37].

Whether Seller Central shows a quality indicator in its own screens was not checked, because those screens need a login (UNVERIFIED).

### 1.6 Can SP-API be used to read competitors' product details, prices, ratings or review text?

**What the API technically returns for a product you do not sell**

| Data | Available? | How |
|---|---|---|
| Title, brand, attributes, images, identifiers, category, variations | Yes | Catalog Items accepts any ASIN, or a keyword or barcode search [12][60] |
| Sales rank | Yes | Catalog Items `salesRanks` [12] |
| Prices, Buy Box winner, number of offers | Yes, seller accounts only | Product Pricing `getItemOffers` and `getCompetitiveSummary` [13][14] |
| Share of clicks and conversions per search term | Partly | Amazon Search Terms report lists the most-clicked ASINs for each term, whoever sells them [23] |
| Star rating, review count | No | No such field in the Catalog Items model [12] |
| Review text | No | No operation returns it [1] |
| Review topics for a competitor's ASIN | UNVERIFIED | The Customer Feedback reference does not say whether the ASIN must be your own [67]; category-level topics cover all products in a category [24] |
| A+ content, stock, Q&A of other sellers | No | A+ operations return only content "published by the selling partner" [48] |

**What the policies say** (verbatim extracts)

- Acceptable Use Policy 1.1: "Use the Amazon Services API only to perform acceptable Amazon activities, and only for Authorized Users who have authorized you to perform these activities on their behalf." [71]
- Acceptable Use Policy 3.8: "Do not request access to or retrieve Information that is not necessary for your Application's functionality." [71]
- Acceptable Use Policy 4.3: "Do not use, offer or promote external (non-Amazon) data services that vend information or data retrieved from Amazon's websites." [71]
- Acceptable Use Policy 4.4: "Do not aggregate data across Authorized Users' businesses or customers obtained through the Amazon Services API to provide or sell to any parties, including competing Authorized Users." [71]
- Acceptable Use Policy 4.5: "Do not promote, publish or share insights about Amazon's business. Do not use insights about Amazon's business for your own business purposes." [71]
- Solution Provider Portal Agreement D-7.1: "Amazon provides you access to this data solely for the purpose of supporting an Authorized User's business with Amazon." [15]
- Solution Provider Portal Agreement, section 6: "You will not and will not allow any third party to use data mining, robots, or similar data gathering and extraction tools to collect or use any of Our Materials", and the materials may not be used to "develop or improve large language or multimodal models, machine learning models or related technology" [15].
- Data Protection Policy 1.7: information must be deleted within 30 days when the selling partner "revokes authorization", and 1.8 requires that data retrieved from the API be stored separately or tagged with its origin [51].

**Reading of those terms (interpretation, to be confirmed by counsel)**

- Neither policy contains a sentence that names competitor look-ups as forbidden, and Amazon's own pricing documentation describes repricers that watch "competitor prices" as an intended use [49]. Checking competing offers on products you sell is therefore an expected use.
- A broad monitor of products you do not sell is not a use the documents describe. Three terms cut against it: data only "for the purpose of supporting an Authorized User's business with Amazon" [15], retrieve only what is "necessary for your Application's functionality" [71], and the default rate limits (1.7).
- Clause 4.3 matters for the engine as a whole. If the same organisation holds SP-API access and also buys Amazon data from an outside scraping vendor, that clause could be read against it [71]. This should be reviewed before the two are combined.
- If the engine trains or fine-tunes models, the section 6 wording on machine-learning use of Amazon's materials needs a legal view [15].

### 1.7 Rate limits (default usage plans)

Limits use a token-bucket method: a steady rate per second and a burst allowance. Most are counted per selling account and application pair. Some plans are "dynamic" and adjust to the size of the selling business, not to how often you call [72].

| Operation | Default rate (requests per second) | Burst | Source |
|---|---|---|---|
| Catalog Items `getCatalogItem` | 2 (250 per application) | 2 | [73] |
| Catalog Items `searchCatalogItems` | 2 (500 per application; keyword searches 50 per application) | 2 | [73] |
| Listings Items `getListingsItem`, `searchListingsItems` | 5 (100 per application) | 5 (the operation reference shows 10) | [74][2] |
| Listings Items `patchListingsItem` | 5 (500 per application; validation previews 20 per application) | 5 | [74] |
| Product Type Definitions (both operations) | 5 (100 per application) | 5 | [75] |
| Product Pricing `getCompetitiveSummary` | 0.033 (about two a minute) | 1 | [14] |
| Product Pricing `getFeaturedOfferExpectedPriceBatch` | 0.033 | 1 | [76] |
| Product Pricing `getItemOffers` (v0) | 0.5 | 1 | [13] |
| Product Pricing `getItemOffersBatch` (v0) | 0.1 | 1 | [1] |
| Reports `createReport` | 0.0167 (one a minute) | 15 | [1] |
| Reports `getReport` | 2 | 15 | [1] |
| Data Kiosk `createQuery` | 0.0167 (one a minute) | 15 | [77] |
| Customer Feedback (every operation) | 1 | 10 | [78] |
| A+ Content `getContentDocument` | 20 on the rate-limit page, with 30 per developer across the API; the operation reference shows 10 | 10 in the operation reference | [79][1] |

Amazon says it "can raise rate limits at any time" and will announce any lowering in advance [72]. Creating several developer accounts or applications to get around quotas is prohibited [71].

### 1.8 Fees — the 2025 SP-API fee programme

| Question | Answer | Source |
|---|---|---|
| Is the fee programme in force today? | **No.** Amazon's developer site carries the notice "Cancellation of Third-Party Developer Selling Partner API (SP-API) Fees": "we have decided that we will not move forward with the SP-API usage and annual fees at this time." | [19] |
| What was announced? | On 3 November 2025: an annual subscription of USD 1,400 from 31 January 2026, and monthly usage fees on GET calls from 30 April 2026. Tiers: Basic 2.5 million calls a month included; Pro USD 1,000 a month for 25 million; Plus USD 10,000 a month for 250 million; Enterprise by negotiation; USD 0.40 per 1,000 calls above the tier. | [20][80] (secondary sources; Amazon's original page now returns "page not found" [81]) |
| Who would have paid? | Third-party developers whose applications serve other selling partners. PPC Land's report of the announcement says: "Sellers and vendors using SP-API directly for only their own businesses will not face additional SP-API fees." This is the trade publication's wording, not a quotation from Amazon. | [20] |
| What happened next? | Delayed in January 2026, postponed indefinitely in March 2026, cancelled in May 2026. | [82][83] |
| Could fees come back? | The cancellation says "at this time" [19]. The Solution Provider Portal Agreement keeps a general clause: "If there is a fee associated with a program you are using or accessing through the Portal, you will be required to provide us with your valid credit card information" [15], and the portal FAQ still refers to registering a payment method to see API usage [84]. | as cited |
| Is a brand building a private application for its own account exempt? | Under the cancelled plan it was reported as exempt [20], and no fee applies to anyone today [19]. If the brand instead builds a public application that distributors authorise, it would be a third-party developer, which is the group the cancelled fees targeted. | as cited |

---

## 2. Amazon Product Advertising API 5.0 and the Creators API

| Field | Finding |
|---|---|
| Status | PA-API 5 "has been deprecated and is being replaced by the Creators API". Calls now receive "HTTP 403 Forbidden" with the message "Product Advertising API is deprecated" [16]. |
| What the Creators API is | A REST API giving "publishers, influencers, and affiliate partners" access to Amazon catalogue data, to help creators "grow their businesses through the Amazon Associates program" [17]. Operations: SearchItems, GetItems, GetVariations, GetBrowseNodes [17]. |
| Authentication | "OAuth 2.0 client credentials flow": application credentials are exchanged for an access token [85]; each request also carries a Partner Tag [86]. |
| Eligibility | Must be "enrolled in the Amazon Associates program for your target marketplace" and have "at least 10 qualifying sales within the past 30 days" [17]. Sign-up is "available only to associates who have referred qualified sales and have been accepted into the program" [87]. Access is lost after 30 consecutive days without qualified referred sales [88]. |
| Data available (any product) | Title, features (bullets), brand and manufacturer information, classifications, external identifiers, technical and product information; images; browse nodes and sales rank; offers: price, availability, condition, Buy Box winner flag, merchant information, deal details; parent ASIN and variations [86]. |
| Not available | The list of GetItems resources contains no customer rating or review resource [86]. |
| Official quality score | No [86]. |
| Rate limits | Starts at 1 request per second and 8,640 per day for the first 30 days; afterwards scaled by shipped revenue from your links: one daily request for every five US cents, and one request per second (maximum ten) for every USD 4,320 of shipped revenue in the previous 30 days [88]. Up to 10 items per GetItems call [86]. |
| Pricing | No fee stated; access depends on generating affiliate sales [88]. |
| Geography | Locales include United States, United Kingdom, United Arab Emirates, Saudi Arabia and India. South Africa, Kenya, Nigeria and Malaysia are not in the list [89]. |
| Historical data | None. Content other than images may be cached for up to 24 hours and must then be refreshed [18]. |
| Usable for monitoring? | **No.** The licence allows use only "to send end users and sales to an Amazon Site". It forbids use in any application that "does not have the principal purpose of advertising and marketing an Amazon Site", and, without "express prior written approval", use "for the purpose of aggregating, analyzing, extracting, or repurposing any Product Advertising Content or in connection with any software or other application intended for use by persons or entities that offer products on an Amazon Site" [18]. |
| Integration complexity | **Low** technically (four read operations), but not applicable because the permitted use does not fit. |

---

## 3. Amazon Ads API (brief)

| Field | Finding |
|---|---|
| What it is | An API that lets "Amazon advertisers and partners … programmatically manage advertising operations and retrieve performance data" [90]. |
| Authentication | A Login with Amazon client application, an access token granted by a user who manages the advertising account, and a profile identifier for the advertising account in each marketplace [91]. |
| Eligibility | "Direct advertisers, partners, and integrators are all eligible to apply"; approval "may take up to 1 business day" [92]. Agencies and tool providers apply through the Amazon Ads Partner Network; an advertiser applies directly [93]. |
| Data that could matter later | Campaign, ad group, ad and keyword performance for your own advertising [90]. **Brand Metrics** (open beta): awareness and consideration indices that "compare your performance to peers", covering "all shopping engagements with your brand on Amazon, not just ad-attributed engagements" [94]. Share-of-voice reports were not confirmed in the API documentation today (UNVERIFIED). |
| Brand Metrics eligibility | Open to "professional sellers enrolled in Amazon Brand Registry and vendors" in the United States, Canada, Mexico, United Kingdom, Germany, France, India, Italy, Spain, Japan and Australia [94]. Of our markets: US, UK and India only. |
| Competitor data | None at listing level; peer comparison is an index, not competitor records [94]. |
| Official quality score | No. |
| Main limitations | Advertising and brand-level metrics only; nothing about listing content. Brand Metrics is an open beta limited to the markets above [94]. |
| Rate limits | Not captured today (UNVERIFIED). |
| Pricing | Creating the client application is "free" and no API fee is stated in the onboarding pages [92]. |
| Geography | Marketplaces listed include US, UK, UAE, Saudi Arabia, India and South Africa [90]. |
| Historical data | Not captured today (UNVERIFIED). |
| Competitor monitoring permitted? | **No.** No competitor listing data is exposed. |
| Integration complexity | **Medium.** Separate approval and credentials from the SP-API; asynchronous reporting. |

---

## 4. Walmart

Walmart's developer portal has separate sections for Marketplace partners (third-party sellers and solution providers) and for "1P Suppliers" who sell directly to Walmart [95][96]. The official Listing Quality score lives in the Marketplace section.

### 4.1 Walmart Marketplace APIs (third-party sellers)

| Field | Finding |
|---|---|
| What it is | APIs that "provide programmatic access for sellers and approved solution providers" to manage "items, inventory, orders, pricing, promotions, reporting" on Walmart.com [97]. |
| Authentication | OAuth 2.0. A Client ID and Client Secret from the Developer Portal are exchanged at the Token API for an access token that is "valid for 15 minutes" [97]. Solution providers use the OAuth authorisation flow that a seller approves in the Walmart App Store; the older "Delegated Access" keys "will stop functioning after April 30, 2027" [98]. |
| Who can get access | A registered and approved Walmart Marketplace seller, for its own account; or an approved Solution Provider (application, review, demonstration and App Store listing; "three to five weeks") [99][100]. |
| Own-listing data | Items, inventory, prices, promotions, orders and reports [97]. Listing Quality score and issues per item [6]. Unpublished items with reason codes [101]. Pricing insights: "current item prices, Buy Box pricing, competitor pricing … price competitiveness metrics", Buy Box win rate [102]. Buy Box report showing "which SKUs are winning or losing the Buy Box" [103]. Search query report with "product impressions share, click share, and add-to-cart share" per search term [104]. Rating count, page views, conversion rate, orders and sales per item [6]. |
| Competitor data | The Item Search API searches the whole Walmart catalogue by keyword, UPC, GTIN, EAN or ISBN and returns published items with fields such as "`itemId`, `title`, `brand`, `price`, `images`, `condition`"; its documented purpose is "to determine whether Walmart already has the item you want to sell" [105]. For your own items the Listing Quality detail includes a competitor price and competitor web address [6]. No competitor ratings, reviews or quality scores. |
| **Official quality score** | **Yes — Listing Quality.** It "is measured based on four metric categories": Content (title, description, images), Discoverability (attributes such as brand, colour, size), Offer (price competitiveness, shipping speed, published and in stock) and Ratings & Reviews [101]. |
| Score endpoints | Seller score: `GET /v3/insights/items/listingQuality/score` returns `listingQuality` (0–100) plus `offerScore`, `contentScore`, `ratingReviewScore`, `priceScore`, `shippingScore`, `transactibilityScore` and post-purchase quality counts [5]. Item detail: `POST /v3/insights/items/listingQuality/items` returns each item's quality score, the content and discoverability issues attribute by attribute, offer issues, post-purchase issues, rating count and performance statistics [6]. A third API lists categories that contain items with issues [101]. Bulk reports: `LISTING_QUALITY` and `CONTENT_QUALITY` report types [106][107]. |
| Reviews | The "Reviews API" manages enrolment in the Review Accelerator Program, a paid service to gain reviews for items "with less than fifteen reviews". It does not return review text. United States only [38]. |
| Main limitations | The item-level quality endpoint is limited to one call a minute [108]. Listing Quality scores "are calculated daily" and the report is "accurate as of the previous day" [106]. No review text. |
| Rate limits | Token-bucket limits allotted "at the seller level", shown in response headers [108]. Examples: Seller Listing Quality Score 10 per hour; Item Listing Quality Details 1 per minute; Unpublished Items 100 per minute; All items 300 per minute; An item 900 per minute; Item Search 200 per minute (1,000 per day in specification format); Pricing Insights 2 per minute; Report request status 20 per hour [108]. |
| Pricing | No API fee is stated in the documentation retrieved. The Review Accelerator Program is paid [38]. |
| Geography | United States marketplace. A separate "Global" portal covers Canada, Mexico and Chile [109]. None of the other eight markets in scope. |
| Historical data | The Listing Quality report accepts a snapshot date ("Up to the previous 2 years") [106]; item detail includes "Historical quality score trends" [110]. |
| Competitor monitoring permitted? | **Restricted.** Catalogue search is documented for item set-up, not for monitoring [105]. Walmart's API terms were not reviewed today (UNVERIFIED). |
| Integration complexity | **Medium.** Simple key-based access for your own account; many separate report types; tight limits on the quality endpoints. |

### 4.2 Walmart first-party suppliers

| Field | Finding |
|---|---|
| Is the API available to 1P suppliers? | Yes, a separate set: "Walmart first-party (1P) suppliers, such as drop ship vendors (DSV), warehouse, and import suppliers … can manage their items, orders, inventory, and more with Walmart's Supplier APIs" [111]. The Listing Quality APIs of section 4.1 are documented for Marketplace sellers and solution providers [101]; suppliers get a content score through a report instead. |
| Authentication | API credentials issued in the Developer Portal for the supplier account ("1P Supplier (US)"), exchanged for an access token sent in the `WM_SEC.ACCESS_TOKEN` header [111][112]. |
| Data | Item set-up and maintenance feeds, product-type taxonomy and specifications, the supplier's item catalogue [112]. On-request reports: `DSV_ORDERS`, `INVENTORY_DSV`, `INVOICES`, `ITEM_CONFIGURATION_DATA`, `PRODUCT_CONTENT_DATA`, `VENDOR_MANAGED_PRICING` [113]. |
| **Official quality score** | **Yes — Content Quality Score** ("0 to 1 scoring") in the `PRODUCT_CONTENT_DATA` report, next to product name, brand, main image, site description, offer published status and unpublished reasons, selling price, "Is 1P Buy-box Winner", customer rating, number of reviews and insights on product name, key features, images and site description. Refreshed every 24 hours [7]. |
| Rate limits | One report "for each report type per hour"; reports take 15 to 45 minutes and are kept 30 days [113]. Item look-ups 1,500 per minute; token requests 100 per hour [114]. |
| What suppliers use besides the API | "Existing Walmart suppliers can access exclusive tools and resources through Supplier One", and the supplier page links to Retail Link [115]. Scintilla (the new name of Walmart Luminate from 2025 [116]) is Walmart Data Ventures' first-party data product; data can be taken out of the interface through "Cloud Feeds", "BI Link" and a "Developer Portal" [117]. Subscription prices are not published (UNVERIFIED). "Item 360" could not be confirmed in a public official page today (UNVERIFIED). |
| Pricing | No API fee is stated in the documentation retrieved. |
| Historical data | Reports are point-in-time and kept for 30 days [113]. |
| Competitor data | None documented in the supplier APIs. Competitor monitoring: **No.** |
| Geography | United States [111]. Scintilla was launched in Mexico and announced for Canada [116]. |
| Integration complexity | **Medium.** Report-based and asynchronous. |

---

## 5. Noon

| Field | Finding |
|---|---|
| Is there an official seller or partner API or developer programme? | An address named `developer.noon.partners` exists and sends visitors to the noon Partners login page [27]. That indicates a developer area for logged-in partners. Its contents could not be read. |
| Is documentation public? | **No — Not publicly documented.** `docs.noon.partners` refused an automated request (HTTP 418) [118], and the Seller Help Center is an application whose articles could not be retrieved [119]. |
| Authentication | Not publicly documented |
| Eligibility | Not publicly documented |
| Data covered (catalogue, orders, stock, pricing, content) | Not publicly documented |
| Official quality score | Unknown |
| Rate limits, pricing | Not publicly documented |
| Geography | Not publicly documented |
| Competitor monitoring | Unknown |
| Integration complexity | **High** (unknown scope; access must be negotiated before design can start). |

**What to ask Noon's account team:** the API documentation and scope; whether a brand owner that is not the seller of record can be granted access; which reports can be exported on a schedule; and whether Noon publishes any content or listing score.

---

## 6. Google Merchant Center — Merchant API

| Field | Finding |
|---|---|
| What it is | The Merchant API "is a redesign of the Content API for Shopping. It comprises multiple sub-APIs" for accounts, products, inventories, data sources, reports, reviews and more [120]. |
| Content API for Shopping | "Content API for Shopping was sunset on August 18, 2026." "Starting September 1, 2026, Content API for Shopping requests will experience progressive errors." [41][121] New work must use the Merchant API. |
| Authentication | OAuth 2.0 client or a service account. Prerequisites: a Merchant Center account, a Google Cloud project, and a link between the two created through "Developer Registration" [120]. |
| Eligibility | A Merchant Center account for the business. Google defines the retailer as "the business entity owning the domain of the products being sold or selling products on a marketplace" [42]. Reports are "only available for standalone and individual sub-accounts" [122]. For market-insight and competitive-visibility data, "Your account must meet minimum eligibility requirements" (not spelled out on the page) [39][40]. Competitor insights "aren't available for marketplace sellers and multi-client accounts" [123]. Price benchmarks need "a valid GTIN" on your products [124]. |
| Own data | Products, inventories, product status and issues, notifications [120]; performance reports for your products [122]. |
| Market reports | **Best sellers:** the best-selling products and brands on Google by category and country, with rank, previous rank, relative demand, title, brand, GTINs and whether you stock them [39]. **Price competitiveness:** your price against a `benchmark_price` for "the same products that you sell" [39]. **Sale price suggestions** [124]. **Competitive visibility:** other merchants' domains with rank, ads-to-organic ratio, page overlap rate, higher position rate and relative visibility, at product-category level [40]. |
| Product ratings | The Product ratings add-on shows aggregated stars; it needs "at least 50 reviews across all your products". Reviews reach Google through a supported aggregator ("Bazaarvoice, Trustpilot, or Yotpo" are named) or your own review data source [125]. The Merchant API can upload product reviews for accounts enrolled in the programme [126]. A separate XML "Product Review Feeds" format exists for review publishers [127]. |
| Official quality score | No listing-quality score was found in the pages retrieved; the API reports product issues and status [120]. |
| Limitations | Benchmarks are aggregates; no competitor product listings. For pricing, "only the latest prices are available at a given time", so history must be stored by you [124]. |
| Rate limits | Quota groups with a daily and a per-minute limit that differ by method and are read through a `quotas.list` method; by default products can be updated "up to twice per day"; quotas may change "at any time, without notice" [128]. |
| Pricing | No fee is stated in the Merchant API documentation retrieved. |
| Geography | Merchant Center terms of service are published for all nine countries in scope [129]. Popular-products data is available for India, Saudi Arabia, South Africa, UAE, UK and US, but not Kenya, Nigeria or Malaysia [42]. |
| Historical data | Best-seller reports are requested by report date [39]; popular-products data is updated weekly [42]. |
| Competitor monitoring permitted? | **Restricted.** The data is "only available for the internal use of the retailer or those acting on the retailer's behalf" and "can't be resold, publicly displayed, advertised, or aggregated across businesses" [42][124]. |
| Integration complexity | **Medium.** Standard Google authentication and a query language for reports; the brand needs its own Merchant Center account with products carrying GTINs. |

---

## 7. GS1

### 7.1 GTIN structure and check-digit rules

- A Global Trade Item Number (GTIN) identifies trade items, which GS1 defines as "products or services that are priced, ordered or invoiced at any point in the supply chain" [130]. It has four formats: GTIN-8, GTIN-12, GTIN-13 and GTIN-14 [43].
- Each is built from a GS1 Company Prefix (or a GS1-8 or U.P.C. prefix), an item reference and a final check digit. GTIN-14 has one extra leading digit, so the prefix starts "from position N2 for GTIN-14" [43].
- When a 14-digit field is required, shorter GTINs "must be prefixed by leading zeroes that simply act as filler digits" [43].
- The check digit uses one algorithm that is "identical for all fixed length numeric GS1 data structures": multiply the digits alternately by 3 and 1, starting with 3 at the digit immediately left of the check digit; add the results; then "Subtract sum from nearest equal or higher multiple of ten = check digit" [43].
- GS1's worked example: 629104150021 gives a sum of 57; 60 − 57 = 3; the full GTIN-13 is 6291041500213 [131].
- GS1 states that check-digit "verification, which must be carried out in the application software, ensures that the number is correctly composed" [43]. A correct check digit shows the number is well formed. It does not show that GS1 issued it or who owns it. That is what Verified by GS1 is for.

### 7.2 Verified by GS1

| Field | Finding |
|---|---|
| What it is | A service to "search, look up and verify information about any barcode number (GTIN, UPC, EAN), location (GLN), company or other GS1 key" [44]. |
| What it returns | Three levels: almost always the company that licensed the number; often core product information ("a handful of very foundational pieces of information"); and links to other data sources where the owner provides them [44]. It answers "Has the number been issued by GS1?" and "To which company is the number licenced?" [44]. |
| How to access | Single look-ups on the public web page. "Enterprise-level capabilities are also available for retrieving data such as batch querying and API connection", with the instruction to "Contact your local GS1 office" [44]. |
| Where the data comes from | Brand owners upload it through services "offered by their local GS1 Member Organisations", including "an interface or API" [44]. Your own product data is only as visible as what you have uploaded. |
| Authentication, rate limits | Not publicly documented (arranged with the Member Organisation). |
| Cost model | Not publicly documented on gs1.org. Batch and API access is offered by each Member Organisation on its own terms [44]. |
| Geography | GS1 has a Member Organisation in each of the nine countries (table below) [132]. Whether each one sells API access was not checked (UNVERIFIED). |
| Historical data | Not publicly documented. |
| Competitor use | Looking up any GTIN to see the licensing company is the stated purpose [44]. The terms of use were not reviewed today (UNVERIFIED). |
| Integration complexity | **Low** for check-digit logic (in-house). **Medium** for API access (contract with a Member Organisation first). |

**GS1 Member Organisations for our countries** [132][133]

| Country | Organisation | Website given by GS1 |
|---|---|---|
| United Arab Emirates | GS1 UAE | gs1ae.org |
| Saudi Arabia | GS1 Saudi Arabia | gs1.org.sa |
| South Africa | GS1 South Africa | gs1za.org |
| India | GS1 India | gs1india.org |
| Kenya | GS1 Kenya | gs1kenya.org |
| Nigeria | GS1 Nigeria | gs1ng.org |
| Malaysia | GS1 Malaysia | gs1my.org |
| United Kingdom | GS1 UK | gs1uk.org |
| United States | GS1 US | gs1us.org |

### 7.3 GDSN in one paragraph

The GS1 Global Data Synchronisation Network is described by GS1 as "the world's largest product data network". A company joins by "subscribing to a certified GS1 GDSN data pool"; product content is then "uploaded, maintained and shared automatically" with the trading partners that subscribe to it [134]. For this engine GDSN is a possible outbound channel for product master data to retailers that use it. It is not a source of competitor data, and the price of a data-pool subscription is not on the GS1 page (UNVERIFIED).

### 7.4 GS1 Digital Link in one paragraph

GS1 Digital Link is a standard for "consistent representation of GS1 identification keys within web addresses to link to online information and services" [135]. A GTIN becomes a web address such as `https://id.gs1.org/01/09520123456788`, or the same path on the brand's own domain, and that address "can also be the gateway to multiple sources of information" through a resolver [135]. The standard was first ratified in August 2018 [136]; the current URI syntax release is 1.7.0 (August 2026) [135]. It is a standard for encoding and linking, not a data API.

---

## 8. Other marketplace and retailer APIs

### 8.1 Overview

| Platform | Official API? | Who can get access | Main data | Official quality score by API | Helps with competitor data? | Our countries |
|---|---|---|---|---|---|---|
| **Takealot** Seller API | Yes, public definition [11] | The seller, with an API key generated in the Seller Portal [11] | Own offers, prices, stock, sales [11] | A `catalogue_quality_score` field on each offer; meaning not documented [11] | No | South Africa |
| **Jumia** Vendor Center | Not publicly documented [25][26] | Not publicly documented | Not publicly documented | Unknown | Unknown | Kenya, Nigeria |
| **Flipkart** Marketplace Seller API | Yes, public documentation v3.0 [137] | Registered sellers (self-access application) and verified partners (third-party application) [137] | Own listings, price, stock, orders, reports [138] | None found [139] | No | India |
| **Shopee** Open Platform | Yes [28] | Software service providers and sellers who build for themselves [28] | Own shop: products, price, stock, orders, ratings, review text, account health, ads [140] | **Yes** — content quality level and issues [8] | No | Malaysia |
| **Lazada** Open Platform | Yes [141] | Applications authorised by a seller [141] | Own shop: products, price, stock, orders, reviews, finance, sponsored solutions [141] | **Yes** — product content score [9] | No | Malaysia |
| **TikTok Shop** Partner API | Yes [142] | Sellers (custom app, own shop only), SaaS integrators, platform connectors [143] | Own shop: products, orders, fulfilment, returns, promotions, finance, analytics [142] | **Yes** — listing quality tier (US only) and diagnoses [10] | No | US, UK, Malaysia [30] |
| **eBay** Browse API | Yes [144] | eBay developer programme (terms not retrievable today) | Any live listing: search and item details [144] | None found | Possibly; licence terms UNVERIFIED | Not checked |
| **Mirakl**-powered marketplaces | Yes, per marketplace [145] | A seller on each Mirakl marketplace [145] | Own offers, orders and related seller operations [145] | Unknown | No | Depends on the retailer |
| **Nykaa** | Not publicly documented [146] | — | — | Unknown | Unknown | India |
| **Meesho** | Not publicly documented [147] | — | — | Unknown | Unknown | India |
| **Myntra** | Not publicly documented [148] | — | — | Unknown | Unknown | India |
| **Target Plus** | Not publicly documented [149] | Invited sellers [150] | — | Unknown | Unknown | United States |
| **Kroger** public Products API | Yes [151] | Any developer who registers an application [152] | Catalogue search with price, availability and stock level per store [151] | No | Technically yes; terms UNVERIFIED | United States |
| **Instacart** APIs | Yes [153][154] | App developers; retailer partners; advertisers [153][154] | Shopping lists and recipes; retailer fulfilment; ads [153][154] | No | No | Not checked |

### 8.2 Notes by platform

Documentation addresses: Takealot `seller-api.takealot.com/api-docs/` · Jumia `vendorcenter.jumia.com` (login) · Flipkart `seller.flipkart.com/api-docs/FMSAPI.html` · Shopee `open.shopee.com` · Lazada `open.lazada.com` · TikTok Shop `partner.tiktokshop.com/docv2` · eBay `developer.ebay.com` · Mirakl `developer.mirakl.com` · Target Plus `plus.target.com` and `developer.target.com` (login) · Kroger `developer.kroger.com` · Instacart `docs.instacart.com`. Full addresses are in the source list.

**Takealot Seller API**
- A public Swagger page titled "Takealot Seller API" (version 2.0) says it "represents the initial phase of the Seller API" for managing offers [11].
- Access: "You will need to generate an API key and attach an Authorization header to each request"; the key comes from the Seller Portal [11].
- Documented operations: list, read, create and update offers singly or in batches; offer counts; stock counts and stock-health statistics; sales, sales summary, sales orders and customer invoices [11].
- Offer fields: offer identifier, SKU, barcode, selling price, recommended retail price, lead time, status, title, offer web address, stock at Takealot and on the way, stock cover, sales units, discount, and `catalogue_quality_score` (an integer with no description) [11].
- Rate limits: responses carry `x-RateLimit-Limit`, `x-RateLimit-Remaining` and `x-RateLimit-Reset` headers; the numbers are not published. Page size is limited to 100 offers [11].
- A larger definition served at `/swagger.json` lists "Data Quality" operations (for example "Get data quality score for given tsin" and "Get data quality score shortcomings list") and catalogue search and review-listing operations next to login and other Seller Portal functions [155]. Whether an API key can call those is UNVERIFIED; treat them as portal functions until Takealot confirms.
- The country (South Africa) is not stated in the definition; it is taken from the brief.

**Jumia**
- Vendor Center is a web application that opens on a sign-in page [25]. The host `vendor-api.jumia.com` answers as an API gateway but returned no documentation at any address tried [26]. Jumia's vendor education site for Nigeria returned no API documentation when searched for "API" [156].
- Status: **Not publicly documented.** Existence, scope and access rules of a Jumia vendor API are UNVERIFIED and should be confirmed with Jumia's vendor support.

**Flipkart Marketplace Seller API**
- Sellers create a "self access application" under Seller Dashboard > Manage Profile > Developer Access and use the client-credentials flow. Partners and aggregators register separately and are verified "within 72 hours" before creating a third-party application that sellers authorise [137].
- Flipkart warns: "Do not share the self access application details with any 3rd party partner(s) / aggregator. It is meant strictly for self seller use." [137] A brand cannot simply borrow a distributor's self-access credentials.
- Listing Management covers creating listings and reading or updating "Selling price, MRP, Shipping fee", stock, procurement details and listing status [138]. The listing reference contains no rating, review or score fields [139]. Order and report management APIs also exist [137].
- Access tokens expire after "usually, 60days" [137]. Rate limits are not stated on the pages retrieved. The documentation footer is dated 2017 [137].

**Shopee Open Platform**
- "Available in all markets", for "Software service providers" and "Sellers with software development capabilities" [28]. Requests are signed and carry a partner identifier, a shop identifier and an access token, so data is limited to shops that authorised the application [157].
- Quality: `get_item_content_diagnosis_result` returns "the content quality details (including content quality level, content issues, and system suggestions)". Levels are TO_BE_IMPROVED, QUALIFIED and EXCELLENT; issue types include too few images, wrong category, too few attributes, missing brand, short description and name length; up to 48 items per call [8].
- Ratings and reviews: `get_item_extra_info` returns sales, views, likes, `rating_star` and `comment_count` [157]. `get_comment` returns the comment text, star rating, buyer username, media and the seller's reply, "up to 1000 comments", and "only respond 500 comments at most through OpenAPI" [35].
- Other modules listed: account health (shop performance, listings with issues, penalty points), ads, orders, logistics, returns. Buy Box operations are marked "only for BR now" [140].

**Lazada Open Platform**
- One API with endpoints for Vietnam, Singapore, the Philippines, Malaysia, Thailand and Indonesia; each call needs an application key, a seller `access_token` ("API interface call credentials") and a signature [141].
- Quality: `GetProductContentScore` ("get product content score") returns a score out of a total with per-area items and indicators such as title length and image findings [9].
- Reviews: `GetHistoryReviewIdList` ("reviews within 3 months can be get", at most 7 days per request), `GetReviewListByIdList` and `SubmitSellerReply` [29][36].
- Rate limits are enforced ("API level QPS limiting") but the numbers are not on the pages retrieved [9].

**TikTok Shop Partner API**
- Three developer types. A "TikTok Shop seller developer" builds a custom app with access to "Your own shop's data only" [143].
- API categories: Product, Order, Fulfillment, Return & Refund, Logistics, Promotion, Finance, Seller, Authorization, Events [142].
- Quality: "TikTok Shop provides APIs that diagnose product content and offer recommendations for optimization" [158]. `Get Product Diagnoses` returns "Listing quality information (available only for the US market)", issues and suggestions for title, description and images, for up to 200 products per call; in the US, listings are placed in tiers "POOR", "FAIR" and "GOOD" [10][158].
- Rate limits: "a dynamic QPS allocation mechanism"; the platform "does not expose a single fixed QPS query API for all endpoints" [159].
- Regions listed (updated 6 July 2026): Brazil, France, Germany, Indonesia, Ireland, Italy, Japan, Malaysia, Mexico, Philippines, Singapore, Spain, Thailand, United Kingdom, United States, Vietnam [30]. UAE, Saudi Arabia, South Africa, India, Kenya and Nigeria are not in that list.

**eBay**
- The Browse API "lets shoppers search eBay listings by keyword, category, GTIN, product, charity, compatibility criteria, or image" and returns item details [144]. Unlike the seller APIs above, it is designed to read any live listing.
- eBay's pages for call limits and the API Licence Agreement refused automated access today, so permitted uses and limits are UNVERIFIED.

**Mirakl**
- Mirakl's platform offers REST APIs in three groups (Front, Operator, Seller), plus GraphQL; "Seller APIs: Tailored for sellers, these APIs enable seller-specific operations within the marketplace environment" [145]. Parts of the documentation need a login [145], and external partners "must implement our Mirakl Authentication System" [160].
- Each retailer runs its own Mirakl instance, so access means a seller account with each one. Which retailers relevant to this brand run on Mirakl could not be confirmed today (UNVERIFIED).

**Nykaa, Meesho, Myntra**
- Nykaa's and Meesho's seller sites answered "Access Denied" to automated requests [146][147]. Myntra's partner site is a public page with login and registration; it mentions "platform integration" but publishes no API documentation [148]. No public API documentation was retrieved for any of the three. Status: **Not publicly documented** (UNVERIFIED whether partner APIs exist).

**Target Plus**
- Described by Target as "an invite-only platform" with "One seller per SKU" [150]. The developer portal shows only login options [149]. API documentation: Not publicly documented.

**Kroger**
- Kroger publishes "free Public APIs" [152]. "The Products API allows you to search the Kroger product catalog" by term, brand or product identifier; with a store location it returns regular and promotional price, fulfilment options, aisle location and stock level. "The Public Products API has a 10,000 call per day rate limit." Partner-only APIs (for example Catalog API V2) also exist [151][161].
- This can show any brand's products at Kroger. Kroger's terms of service were not reviewed (UNVERIFIED), so permitted use is unknown.

**Instacart**
- The Developer Platform API is "built for app developers" (recipe pages, shopping lists, nearby retailers). The Connect APIs are "built for retailer partners" [153][154]. The documentation menu also lists "Instacart Ads APIs (for advertisers)" and a "Consumer Insights Portal" [153]. No brand-side listing-content or quality API was found.

---

## 9. Ratings and reviews providers

| Provider | APIs a brand can use | Who can get access | Data | Rate limits | Pricing | Competitor data? | Complexity |
|---|---|---|---|---|---|---|---|
| **Bazaarvoice** | Conversations API; Displayable Content Export; Product Sentiments API; Response API; Content Search API [162] | Bazaarvoice clients. "The Enterprise package is required to access the Bazaarvoice Conversations API" [163]. API keys are requested in the Bazaarvoice Portal and approved by the client's Technical Administrator [164] | Your reviews, questions and answers, product catalogue and statistics [163]. Bulk export is a "single source for your displayable content and syndicated content from the Bazaarvoice network", with a weekly full snapshot and daily updates [165]. Sentiments: top best and worst product features and quotes [166] | Use is "rate limited on a per API key, per minute basis"; the allowance is shown in response headers [167] | Not publicly documented | No. Syndicated content appears only where syndication is configured and enabled on the key [168] | Medium |
| **PowerReviews** | Enterprise API; Display (Read) API; Write API [169] | PowerReviews customers; an API key must be requested [170] | Enterprise API is "intended for B2B integrations"; Display API powers custom review displays [169] | Not captured (UNVERIFIED) | Not publicly documented | No | Medium |
| **Yotpo** | API V3; Reviews & UGC API (V1); Loyalty; App partners [171] | Yotpo stores: a store identifier and API secret are exchanged for an access token [171] | Reviews, ratings, Q&A and visual content; orders, products and customers; a list of retailers the store's reviews are syndicated to [171] | "5 requests per second per store" [171] | Not publicly documented | No | Low |
| **Trustpilot** | Business APIs (Product Reviews, Service Reviews, Business Units, Invitations); Data Solutions API [21][172] | Requires "a Trustpilot for Business account with access to the API module" [173]. Data Solutions: by registration on a waitlist, with an API key generated in its web app [172] | Your own business and review data [21]. Data Solutions "gives you access to Trustpilot's global database of business profiles and consumer reviews"; its Insights product returns "the full text and details of a business's reviews" [172] | Recommended ceiling "833 calls per 5 minutes or 10K calls per hour" [174] | API module tiers of 200,000, 1,000,000 or unlimited calls a year; prices not shown [21] | Yes for company-level reviews through Data Solutions [172]; not marketplace product listings | Low |
| **Google product ratings** | Merchant API product reviews upload; Product Review Feeds [126][127] | Accounts in the Product ratings programme; at least 50 reviews [125] | Outbound only: you send reviews to Google [126] | See section 6 | None stated | No | Medium |

Geography and history: these are software services sold globally; country availability and data-retention terms were not checked (UNVERIFIED).

Reading for the engine: these providers give the brand its **own** collected and syndicated reviews in bulk, which fills the gap left by marketplaces that do not release review text. None of them is an official source for competitor product reviews on marketplaces.

---

## 10. PIM system APIs (for later integration)

| System | API exists | Type | Authentication noted | Source |
|---|---|---|---|---|
| **Akeneo** | Yes | REST API and GraphQL API, plus an event platform | App-based authentication and authorisation | [175] |
| **Salsify** | Yes | REST API with webhooks; products, records, properties, imports, exports | Token or OAuth 2.0 | [176] |
| **Pimcore** | Yes | "The basic configuration of Datahub comes with a GraphQL API"; adapters add a simple REST API, file export and webhooks | Configured per endpoint | [177] |
| **Plytix** | Yes | REST API (V1 and V2) for products, assets and categories | "Exchange your API key and password for a bearer token" | [178] |

All four are low-to-medium complexity integrations. Rate limits and prices were not collected because they depend on the customer's plan (UNVERIFIED).

---

## 11. What a brand that sells through distributors can and cannot get

**The basic rule.** Marketplace seller APIs answer for the account that authorises them. If the brand is not the seller of record on Amazon.ae, Noon, Takealot or Jumia, it has no account of its own that owns those offers, so it cannot pull listing, price, stock or sales data for them directly.

### 11.1 Amazon (including Amazon.ae)

| Route | What it gives | Conditions and limits | Source |
|---|---|---|---|
| **Brand Registry — protection roles** | Rights Owner and Administrator roles go to the trademark owner's account; the Administrator can assign roles to other accounts; Registered Agent is for third parties who report violations. | Requires enrolment of the brand by the trademark owner. | [31] |
| **Brand Registry — Brand Representative role on the brand's own selling account** | It "unlocks the full suite of benefits available to a brand", including tools that surface brand data "like Amazon Brand Analytics". | The role is "for internal, first-party sellers who are directly employed by the brand". The brand needs its own Amazon selling account in that store. | [31] |
| **Brand Registry — Reseller role for the distributor** | Lets the distributor create listings, use A+ Content, Brand Stores and Sponsored Brands for the brand. | Amazon states that "this role doesn't grant access to Brand Analytics". It is assigned by the brand Administrator using the seller's merchant token. | [31] |
| **Brand Analytics by API** | Search query and catalogue performance, market basket, repeat purchase, search terms. | Needs a selling account with the Brand Analytics API role that is "registered in Amazon Brand Registry" [23]. Listed for UAE, Saudi Arabia, India, UK and US, not South Africa [23]. Whether the reports cover products sold only by distributors is UNVERIFIED; the Market Basket report describes its ASINs as "in the selling partner's catalog" [23]. | as cited |
| **Content-change alerts for the brand owner** | A notification "whenever there is a change to the title, description, bullet points, or images, for any ASIN that the selling partner has a brand relationship with". | The subscriber must be "a verified brand owner" with a seller account and an SP-API application. | [33] |
| **Catalogue read from the brand's own account** | Title, attributes, images, identifiers and sales rank for any ASIN, including those the distributor sells. | Needs any seller or vendor account of the brand with the Product Listing role. No price, stock or sales of the distributor's offer. | [12][58] |
| **Content authority** | "Brand owners have the highest precedence to update data on the product details page on Amazon." | Updating still needs a selling or vendor account, or a support ticket. | [179] |
| **Distributor authorises an application** | Full seller data for the distributor's account: listings, issues, price, Buy Box, stock, sales and traffic. | A private application can only be self-authorised by its own organisation [32]. So either the distributor builds and runs its own private application and shares the output, or the brand (or its technology supplier) registers as a public developer and the distributor authorises it by OAuth: up to 25 seller authorisations if the application is not listed in the Appstore [32]. The agreement requires listing if you "offer it for use" to selling partners [15]; confirm with Amazon how this applies to a brand-and-distributor arrangement. Data must be deleted within 30 days if the distributor revokes access [51]. | as cited |
| **User permissions on the distributor's Seller Central account** | Screen access to the reports the distributor chooses to share. No API. | Amazon's policy: "Do not request or share Amazon Portal usernames or passwords", and where portal access is needed "ask the Authorized User to grant access through secondary user permissions". | [71] |
| **Vendor Central account — manufacturing view** | Data Kiosk vendor analytics "for all ASINs manufactured by the vendor (regardless of who sourced the products to Amazon)", including orders, glance views, lost featured offer and forecasts. | The brand must have a vendor relationship with Amazon and be recognised as the manufacturer; otherwise the query returns an error. A distributor that is the vendor sees the "sourcing view" only. | [34] |
| **What stays out of reach without the distributor** | The distributor's price, Buy Box share, stock, orders, listing issues and suppression status. | These exist only in the selling account's own data. | [2][49] |

For **Amazon.ae** specifically: the store is in the SP-API [22] and is listed for the Brand Analytics search reports [23], but it is not covered by the Customer Feedback (review topics) API [24].

### 11.2 Noon

- Nothing about brand-owner access, partner roles or reporting could be confirmed, because the documentation is not public [27][118].
- Working assumption until Noon confirms otherwise: data comes from the distributor (portal exports or an integration the distributor authorises) or from reports Noon agrees to supply under a commercial arrangement. Both are UNVERIFIED.

### 11.3 Takealot

- The Seller API works with an API key generated in the seller's own portal [11]. Only the seller of record (the distributor) can therefore pull offers, prices, stock, sales and the `catalogue_quality_score`.
- No brand-owner role or brand registry route appears in the API definition [11]. The brand needs the distributor to run the integration or to share exports.

### 11.4 Jumia

- Not publicly documented [25][26]. Expect to rely on Vendor Center exports supplied by the distributor (UNVERIFIED).

### 11.5 What this means in practice

1. Decide per marketplace who will hold the account that authorises the engine: the brand, or each distributor.
2. For Amazon, enrol the brand in Brand Registry and open a brand-owned selling account in each priority store, even with a minimal catalogue, to unlock Brand Analytics, the Catalog Items API and content-change alerts [31][33].
3. Put data-sharing duties into distributor agreements: either API authorisation or scheduled exports of listings, prices, stock, issues and scores.
4. For Noon and Jumia, ask the account managers what they will supply before any build is planned.

---

## 12. Matrix: which data types are obtainable through an official API?

Key: **Y** documented in the official API · **P** partly (see note) · **N** not available in the documented API · **ND** not publicly documented · **U** unverified today. "Own" assumes the account that sells the product has authorised the engine.

### 12.1 OWN listings

| Marketplace | Title, bullets, description, attributes, images | A+ / rich content | Price | Buy Box / featured offer | Stock | Rating and review count | Review text | Q&A | Sales rank | Search data | Official quality score |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Amazon US | Y [2] | Y [48] | Y [2] | Y, sellers only [49] | Y [2] | P: review counts and critical-review rate [37] | P: topic snippets only [24] | N [1] | Y [12] | Y, Brand Registry [23] | N: issues only [2] |
| Amazon UK | Y | Y | Y | Y, sellers only | Y | P | P: topic snippets only [24] | N | Y | Y, Brand Registry [23] | N |
| Amazon UAE | Y | Y | Y | Y, sellers only | Y | P | N: Customer Feedback API not offered [24] | N | Y | Y, Brand Registry [23] | N |
| Amazon Saudi Arabia | Y | Y | Y | Y, sellers only | Y | P | N [24] | N | Y | Y, Brand Registry [23] | N |
| Amazon India | Y | Y | Y | Y, sellers only | Y | P | N [24] | N | Y | Y, Brand Registry [23] | N |
| Amazon South Africa | Y | Y | Y | Y, sellers only | Y | P (U for this store) | N [24] | N | Y | P: main search reports not listed for this store [23] | N |
| Walmart (US) | Y [97] | U | Y [102] | Y [103] | Y [97] | Y [6] | N [38] | N | N | Y [104] | **Y** [5] |
| Noon | ND | ND | ND | ND | ND | ND | ND | ND | ND | ND | ND [27] |
| Takealot | P: title only [11] | N | Y [11] | N | Y [11] | N | N | N | N | N | P: field exists, meaning undocumented [11] |
| Jumia | ND | ND | ND | ND | ND | ND | ND | ND | ND | ND | ND [25] |
| Flipkart | P: listing attributes via listing management [138] | N | Y [138] | N | Y [138] | N [139] | N [139] | N | N | N | N [139] |
| Nykaa | ND | ND | ND | ND | ND | ND | ND | ND | ND | ND | ND [146] |
| Shopee (MY) | Y [140] | U | Y [140] | N: Brazil only [140] | Y [140] | Y [157] | Y [35] | N | N | U | **Y** [8] |
| Lazada (MY) | Y [141] | U | Y [141] | N | Y [141] | U | Y, last 3 months [29] | N | N | U | **Y** [9] |
| TikTok Shop (US, UK, MY) | Y [142] | U | Y [142] | N | Y [142] | U | U | N | N | U | **Y** in the US; diagnoses elsewhere [10] |

Amazon rows other than the US row rest on the same sources as the US row unless a different source is shown. Amazon "Y, sellers only" means the Product Pricing API, which vendor accounts cannot use [49].

### 12.2 COMPETITOR listings

| Marketplace | Title, attributes, images | A+ / rich content | Price | Buy Box / featured offer | Stock | Rating and review count | Review text | Sales rank | Search share | Quality score |
|---|---|---|---|---|---|---|---|---|---|---|
| Amazon (US, UK, UAE, Saudi Arabia, India, South Africa) | P: catalogue facts for any ASIN; purpose-limited by contract [12][15] | N [48] | P: offers for any ASIN, seller accounts only, low rate limits [13] | P: same [14] | N | N [12] | N [1] | P [12] | P: most-clicked ASINs per search term, Brand Registry [23] | N |
| Walmart (US) | P: catalogue search meant for item set-up [105] | N | P: price in search results; competitor price on your own items [105][6] | N | N | N | N | N | N | N |
| Noon | ND | ND | ND | ND | ND | ND | ND | ND | ND | ND |
| Takealot | N in the documented API [11] | N | N | N | N | N | N | N | N | N |
| Jumia | ND | ND | ND | ND | ND | ND | ND | ND | ND | ND |
| Flipkart | N [139] | N | N | N | N | N | N | N | N | N |
| Nykaa | ND | ND | ND | ND | ND | ND | ND | ND | ND | ND |
| Shopee | N: authorised shops only [157] | N | N | N | N | N | N | N | N | N |
| Lazada | N: authorised sellers only [141] | N | N | N | N | N | N | N | N | N |
| TikTok Shop | N: authorised shops only [143] | N | N | N | N | N | N | N | N | N |

**What the matrices say in one sentence:** official APIs cover the brand's own listings reasonably well where the brand or its distributor authorises access, and cover competitor listings almost nowhere, with Amazon catalogue and offer data as the limited, contract-bound exception.

---

## 13. Limitations and gaps

**How the research was constrained**
- The web-search allowance for the session was used up part-way through. After that, only pages reachable by a known official address could be read. No search engine, reader service or archive was used as a workaround.
- Nothing was signed up for, logged into or submitted. Anything behind a login is reported as not publicly documented.

**Could not be verified today (all marked UNVERIFIED in the text)**
1. **Noon:** existence and scope of a partner API, authentication, limits, prices, brand-owner access. The developer address redirects to a login [27].
2. **Jumia:** any vendor API documentation [25][26].
3. **Nykaa, Meesho, Myntra, Target Plus:** whether partner APIs exist and what they cover [146][147][148][149].
4. **Amazon SP-API fee amounts:** Amazon's original announcement page has been removed [81]. The amounts, dates and the own-account exemption come from secondary reports [20][80][82]. The cancellation itself is confirmed on Amazon's site [19].
5. **Amazon:** whether the Customer Feedback API answers for ASINs the account does not sell; whether Brand Analytics reports cover products sold only by distributors; whether every Data Kiosk metric is served for the South Africa store; whether Seller Central shows a listing-quality indicator in its screens; the price of a Professional selling plan; Brand Registry help pages behind the Seller Central login.
6. **Amazon Ads API:** rate limits and share-of-voice reports.
7. **Walmart:** Item 360 and Retail Link details, Scintilla prices, the API terms of use, whether non-US businesses can register as Marketplace sellers.
8. **Takealot:** the scale and meaning of `catalogue_quality_score`; whether the "Data Quality" operations in the larger definition accept API keys; numeric rate limits [11][155].
9. **eBay:** API licence terms and call limits (pages refused automated access); country coverage.
10. **Mirakl:** which relevant retailers run on Mirakl.
11. **TikTok Shop:** whether a review or rating API exists; **Lazada and TikTok Shop:** star-rating fields.
12. **GS1:** price and terms of Verified by GS1 batch and API access at each Member Organisation; GDSN data-pool costs.
13. **Reviews and PIM vendors:** prices, and rate limits for PowerReviews and the PIM systems.

**Known conflicts inside official documentation**
- Amazon's A+ Content rate limit for `getContentDocument` is 20 a second on the rate-limit page and 10 on the operation reference [79][1]. The burst for `getListingsItem` is 5 on the rate-limit page and 10 on the operation reference [74][2]. Design to the lower figure.

**Things that will change**
- Amazon says reports will be moved from the Reports API into Data Kiosk and then deprecated [66].
- Amazon cancelled its API fees "at this time" [19]; the wording leaves room for a later proposal.
- Walmart's Delegated Access keys end on 30 April 2027 [98].
- Google and TikTok Shop state that quotas and limits can change without notice [128][159].

**Legal reading still needed**
- The Amazon Acceptable Use Policy clause on external data services [71], the "solely for the purpose of supporting an Authorized User's business" clause [15] and the machine-learning clause [15] should be reviewed by counsel against the engine's intended design before any SP-API registration is submitted.

---

## Sources

All sources were retrieved on 2026-11-26. Amazon and Walmart developer pages were read in the markdown rendering that those sites serve for each page (same address with `.md` appended). The address developer-docs.amazon.com now redirects to developer-docs.amazon, which is the address recorded here. "n.d." means the page shows no publication or update date.

1. Amazon (Selling Partner API documentation). *Selling Partner API Documentation — full documentation index (lists every guide, API reference operation and its usage plan)*. Published or last updated: n.d. (latest entry: 18 November 2026 release). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/llms.txt>
2. Amazon (Selling Partner API documentation). *getListingsItem — Listings Items v2021-08-01 reference (OpenAPI definition)*. Published or last updated: 2026-09-10 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/reference/getlistingsitem>
3. Amazon (Selling Partner API documentation). *Inventory Reports (report type values)*. Published or last updated: 2026-10-28 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/report-type-values-inventory>
4. Amazon (Selling Partner API documentation). *Product Type Definitions API*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/product-type-definitions-api>
5. Walmart (Developer Portal). *Retrieve Listing Quality score*. Published or last updated: 2026-04-12 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/get-sellers-listing-quality-score>
6. Walmart (Developer Portal). *Item Listing Quality Details (API reference)*. Published or last updated: 2026-06-04 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/reference/itemsdetailsforlisting>
7. Walmart (Developer Portal). *Item product content data report (1P suppliers)*. Published or last updated: 2026-04-12 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/suppliers/docs/item-report-product-content-data>
8. Shopee Open Platform. *API reference — v2.product.get_item_content_diagnosis_result*. Published or last updated: n.d. Accessed: 2026-11-26. <https://open.shopee.com/documents/v2/v2.product.get_item_content_diagnosis_result?module=89&type=1>
9. Lazada Open Platform. *API reference — GetProductContentScore*. Published or last updated: 2023-05-24 (latest update). Accessed: 2026-11-26. <https://open.lazada.com/apps/doc/api?path=%2Fproduct%2Fcontent%2Fscore%2Fget>
10. TikTok Shop Partner Center. *Get Product Diagnoses (API reference, version 202405)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://partner.tiktokshop.com/docv2/page/get-product-diagnoses-202405>
11. Takealot. *Takealot Seller API v2.0 — public Swagger UI and its definition (/api-docs/swagger.json)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://seller-api.takealot.com/api-docs/>
12. Amazon (Selling Partner API documentation). *getCatalogItem — Catalog Items v2022-04-01 reference (OpenAPI definition)*. Published or last updated: 2026-09-10 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/reference/getcatalogitem>
13. Amazon (Selling Partner API documentation). *getItemOffers — Product Pricing v0 reference*. Published or last updated: 2026-09-10 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/reference/getitemoffers>
14. Amazon (Selling Partner API documentation). *getCompetitiveSummary — Product Pricing v2022-05-01 reference*. Published or last updated: 2026-09-10 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/reference/getcompetitivesummary>
15. Amazon. *Amazon Solution Provider Portal Agreement (incl. API Developer Terms)*. Published or last updated: Version: August 2026. Accessed: 2026-11-26. <https://sellercentral.amazon.com/mws/static/agreement?locale=en_US>
16. Amazon Associates (Creators API documentation). *PA-API 5 Deprecation Notice*. Published or last updated: n.d. Accessed: 2026-11-26. <https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation>
17. Amazon Associates (Creators API documentation). *Welcome to Creators API (Introduction)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction>
18. Amazon Associates. *Associates Program Policies — Associates Program IP License and Usage Requirements*. Published or last updated: Updated: April 14, 2026. Accessed: 2026-11-26. <https://affiliate-program.amazon.com/help/operating/policies/>
19. Amazon (Selling Partner API developer site). *Cancellation of Third-Party Developer Selling Partner API (SP-API) Fees*. Published or last updated: 2026-06-11 (page metadata; modified 2026-07-01). Accessed: 2026-11-26. <https://developer.amazonservices.com/cancellation-of-sp-api-fees>
20. PPC Land (secondary source). *Amazon introduces fees for third-party developer API access in 2026*. Published or last updated: 2025-11-09. Accessed: 2026-11-26. <https://ppc.land/amazon-introduces-fees-for-third-party-developer-api-access-in-2026/>
21. Trustpilot. *API module overview*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developers.trustpilot.com/api-module-overview/>
22. Amazon (Selling Partner API documentation). *Store Identifiers*. Published or last updated: 2026-10-23 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/store-identifiers>
23. Amazon (Selling Partner API documentation). *Analytics Reports (report type values)*. Published or last updated: 2026-11-18 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/report-type-values-analytics>
24. Amazon (Selling Partner API documentation). *Customer Feedback API*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/customer-feedback-api>
25. Jumia. *Jumia | Vendor Center (web application that opens on a sign-in page)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://vendorcenter.jumia.com/>
26. Jumia. *vendor-api.jumia.com — API gateway host; no public documentation route found*. Published or last updated: n.d. Accessed: 2026-11-26. <https://vendor-api.jumia.com/>
27. noon. *noon Partners developer portal — redirects to the partner login page*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developer.noon.partners/>
28. Shopee Open Platform. *Developer Guide — Introduction (What is Shopee Open Platform?)*. Published or last updated: 2024-11-11 (last updated). Accessed: 2026-11-26. <https://open.shopee.com/developer-guide/4>
29. Lazada Open Platform. *API reference — GetHistoryReviewIdList*. Published or last updated: 2022-09-28 (latest update). Accessed: 2026-11-26. <https://open.lazada.com/apps/doc/api?path=%2Freview%2Fseller%2Fhistory%2Flist>
30. TikTok Shop Partner Center. *Regions and languages*. Published or last updated: 2026-07-06 (last updated). Accessed: 2026-11-26. <https://partner.tiktokshop.com/docv2/page/regions-and-languages>
31. Amazon (Sell on Amazon blog). *Guide to Brand Registry roles*. Published or last updated: 2025-04-23. Accessed: 2026-11-26. <https://sell.amazon.com/blog/brand-registry-roles>
32. Amazon (Selling Partner API documentation). *Authorization Limits*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/application-authorization-limits>
33. Amazon (Selling Partner API documentation). *Notification Type Values*. Published or last updated: 2026-10-28 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/notification-type-values>
34. Amazon (Selling Partner API documentation). *Vendor Analytics Dataset Use Case Guide*. Published or last updated: 2026-09-30 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/vendor-analytics-dataset-guide>
35. Shopee Open Platform. *API reference — v2.product.get_comment*. Published or last updated: n.d. Accessed: 2026-11-26. <https://open.shopee.com/documents/v2/v2.product.get_comment?module=89&type=1>
36. Lazada Open Platform. *API reference — GetReviewListByIdList*. Published or last updated: 2022-08-16 (latest update). Accessed: 2026-11-26. <https://open.lazada.com/apps/doc/api?path=%2Freview%2Fseller%2Flist%2Fv2>
37. Amazon (Selling Partner API documentation). *Seller Analytics Dataset Use Case Guide*. Published or last updated: 2026-09-30 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/seller-analytics-dataset-guide>
38. Walmart (Developer Portal). *Reviews API overview*. Published or last updated: 2026-06-08 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/reviews-api-overview>
39. Google (Merchant API documentation). *Understand the market*. Published or last updated: 2026-10-26 (last updated). Accessed: 2026-11-26. <https://developers.google.com/merchant/api/guides/reports/understand-the-market>
40. Google (Merchant API documentation). *Explore your competitive landscape*. Published or last updated: 2026-10-26 (last updated). Accessed: 2026-11-26. <https://developers.google.com/merchant/api/guides/reports/explore-competitive-landscape>
41. Google (Merchant API documentation). *Migrate from Content API for Shopping to Merchant API*. Published or last updated: 2026-10-26 (last updated). Accessed: 2026-11-26. <https://developers.google.com/merchant/api/guides/compatibility/overview>
42. Google (Merchant Center Help). *About Popular products in Merchant Center Analytics*. Published or last updated: n.d. Accessed: 2026-11-26. <https://support.google.com/merchants/answer/13299535>
43. GS1 AISBL. *GS1 General Specifications Standard, Release 26.0 (sections 1, 3.3.2 and 7.9)*. Published or last updated: 2026-01 (Ratified, Jan 2026). Accessed: 2026-11-26. <https://ref.gs1.org/standards/genspecs/>
44. GS1. *Verified by GS1*. Published or last updated: n.d. Accessed: 2026-11-26. <https://www.gs1.org/services/verified-by-gs1>
45. Amazon (Selling Partner API documentation). *What is the Selling Partner API?*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/what-is-the-selling-partner-api>
46. Amazon (Selling Partner API documentation). *Authorize Private Applications*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/self-authorization>
47. Amazon (Selling Partner API documentation). *SP-API Registration Overview*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/sp-api-registration-overview>
48. Amazon (Selling Partner API documentation). *Manage A+ content*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/manage-aplus-content>
49. Amazon (Selling Partner API documentation). *Product Pricing API*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/product-pricing-api>
50. Amazon (Selling Partner API documentation). *Register as a Private SP-API Developer*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/register-as-a-private-developer>
51. Amazon. *Data Protection Policy (Amazon Services API)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://sellercentral.amazon.com/mws/static/policy?documentType=DPP&locale=en_US>
52. Amazon (Selling Partner API documentation). *Register as a Private SP-API Vendor*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/register-as-a-private-vendor>
53. Amazon (Selling Partner API documentation). *Register as a Public SP-API Developer*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/register-as-a-public-developer>
54. Amazon (Selling Partner API documentation). *Authorize Applications*. Published or last updated: 2026-11-23 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/authorizing-selling-partner-api-applications>
55. Amazon (Selling Partner API documentation). *Policies and Agreements*. Published or last updated: 2026-09-16 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/policies-and-agreements>
56. Amazon (Selling Partner API documentation). *Selling Partner API Roles*. Published or last updated: 2026-11-17 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/roles-in-the-selling-partner-api>
57. Amazon (Selling Partner API documentation). *SP-API Endpoints*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/sp-api-endpoints>
58. Amazon (Selling Partner API documentation). *Catalog Items API*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/catalog-items-api>
59. Amazon (Selling Partner API documentation). *searchCatalogItems — Catalog Items v2022-04-01 reference (OpenAPI definition)*. Published or last updated: 2026-09-10 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/reference/searchcatalogitems>
60. Amazon (Selling Partner API documentation). *Search catalog items*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/search-catalog-items>
61. Amazon (Selling Partner API documentation). *Listings Items API*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/listings-items-api>
62. Amazon (Selling Partner API documentation). *Manage Listings Issues*. Published or last updated: 2026-11-18 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/manage-listings-issues>
63. Amazon (Selling Partner API documentation). *Retrieve a Product Type Definition*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/retrieve-a-product-type-definition>
64. Amazon (Selling Partner API documentation). *A+ Content API*. Published or last updated: 2026-09-30 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/a-plus-content-api-use-case-guide>
65. Amazon (Selling Partner API documentation). *Product Pricing API and Notifications FAQ*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/pricing-faq>
66. Amazon (Selling Partner API documentation). *Data Kiosk API*. Published or last updated: 2026-10-20 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/data-kiosk-api>
67. Amazon (Selling Partner API documentation). *getItemReviewTopics — Customer Feedback v2024-06-01 reference*. Published or last updated: 2026-09-10 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/reference/getitemreviewtopics>
68. Amazon (Selling Partner API documentation). *Sales API*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/sales-api>
69. Amazon (Selling Partner API documentation). *SP-API Vendor Use Cases*. Published or last updated: 2026-11-16 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/sp-api-vendor-use-cases>
70. Amazon (Selling Partner API documentation). *Action Items API*. Published or last updated: 2026-10-28 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/action-items-api>
71. Amazon. *Acceptable Use Policy (Amazon Services API)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://sellercentral.amazon.com/mws/static/policy?documentType=AUP&locale=en_US>
72. Amazon (Selling Partner API documentation). *Usage Plans and Rate Limits*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/usage-plans-and-rate-limits>
73. Amazon (Selling Partner API documentation). *Catalog Items API Rate Limits*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/catalog-items-api-rate-limits>
74. Amazon (Selling Partner API documentation). *Listings Items API Rate Limits*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/listings-items-api-rate-limits>
75. Amazon (Selling Partner API documentation). *Product Type Definitions API Rate Limits*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/product-type-definitions-api-rate-limits>
76. Amazon (Selling Partner API documentation). *getFeaturedOfferExpectedPriceBatch — Product Pricing v2022-05-01 reference*. Published or last updated: 2026-09-10 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/reference/getfeaturedofferexpectedpricebatch>
77. Amazon (Selling Partner API documentation). *createQuery — Data Kiosk v2023-11-15 reference*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/reference/createquery>
78. Amazon (Selling Partner API documentation). *Customer Feedback API Rate Limits*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/customer-feedback-api-rate-limits>
79. Amazon (Selling Partner API documentation). *A+ Content API Rate Limits*. Published or last updated: 2026-09-09 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/aplus-api-rate-limits>
80. Marketplace Pulse (secondary source). *Amazon Monetizes the Software Layer Sellers Depend On*. Published or last updated: 2025-11-13. Accessed: 2026-11-26. <https://marketplacepulse.com/articles/amazon-monetizes-the-software-layer-sellers-depend-on>
81. Amazon (Selling Partner API developer site). *Original SP-API fee announcement page ('Important Update') — returned HTTP 404 on the access date*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developer.amazonservices.com/spp-announcement>
82. Fivetran (secondary source). *No walled gardens: Amazon reversed its Seller Partner API fees*. Published or last updated: 2026-07-15. Accessed: 2026-11-26. <https://www.fivetran.com/blog/no-walled-gardens-amazon-reversed-its-seller-partner-api-fees>
83. PPC Land (secondary source). *Amazon drops SP-API fees after developer pushback*. Published or last updated: 2026-05-14. Accessed: 2026-11-26. <https://ppc.land/amazon-drops-sp-api-fees-after-developer-pushback>
84. Amazon (Selling Partner API documentation). *Solution Provider Portal FAQ*. Published or last updated: 2026-09-30 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/spp-faq>
85. Amazon Associates (Creators API documentation). *Frequently Asked Questions (Creators API)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://affiliate-program.amazon.com/creatorsapi/docs/en-us/frequently-asked-questions>
86. Amazon Associates (Creators API documentation). *GetItems (operation reference)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://affiliate-program.amazon.com/creatorsapi/docs/en-us/api-reference/operations/get-items>
87. Amazon Associates (Creators API documentation). *Register for Creators API*. Published or last updated: n.d. Accessed: 2026-11-26. <https://affiliate-program.amazon.com/creatorsapi/docs/en-us/onboarding/register-for-creators-api>
88. Amazon Associates (Creators API documentation). *API Rates*. Published or last updated: n.d. Accessed: 2026-11-26. <https://affiliate-program.amazon.com/creatorsapi/docs/en-us/concepts/api-rates>
89. Amazon Associates (Creators API documentation). *Locale Reference for Product Advertising API*. Published or last updated: n.d. Accessed: 2026-11-26. <https://affiliate-program.amazon.com/creatorsapi/docs/en-us/locale-reference>
90. Amazon Ads (Advanced Tools Center). *Amazon Ads API overview (use cases and regional endpoints)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://advertising.amazon.com/API/docs/en-us/reference/api-overview>
91. Amazon Ads (Advanced Tools Center). *Getting started with the Amazon Ads API*. Published or last updated: n.d. Accessed: 2026-11-26. <https://advertising.amazon.com/API/docs/en-us/guides/get-started/overview>
92. Amazon Ads (Advanced Tools Center). *Amazon Ads API onboarding overview*. Published or last updated: n.d. Accessed: 2026-11-26. <https://advertising.amazon.com/API/docs/en-us/guides/onboarding/overview>
93. Amazon Ads (Advanced Tools Center). *Apply for Amazon Ads API access*. Published or last updated: n.d. Accessed: 2026-11-26. <https://advertising.amazon.com/API/docs/en-us/guides/onboarding/apply-for-access>
94. Amazon Ads (Advanced Tools Center). *Brand Metrics API open beta overview*. Published or last updated: n.d. Accessed: 2026-11-26. <https://advertising.amazon.com/API/docs/en-us/guides/reporting/brand-metrics/overview>
95. Walmart (Developer Portal). *Walmart Developer Portal — home (Marketplace Partners, 1P Suppliers, Advertising Partners)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developer.walmart.com/>
96. Walmart (Developer Portal). *1P Supplier — developer portal home (Feeds, Items, Order management, EPCIS, Drop Ship Vendor APIs)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developer.walmart.com/suppliers>
97. Walmart (Developer Portal). *Introduction to Walmart Marketplace APIs*. Published or last updated: 2026-11-13 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/introduction-to-marketplace-apis>
98. Walmart (Developer Portal). *Authentication & authorization*. Published or last updated: 2026-10-26 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/authentication-authorization>
99. Walmart (Developer Portal). *Get started as a seller*. Published or last updated: 2026-11-13 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/get-started-as-a-seller>
100. Walmart (Developer Portal). *Get started as an approved Solution Provider*. Published or last updated: 2026-11-05 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/get-started-as-a-solution-provider>
101. Walmart (Developer Portal). *Insights API overview*. Published or last updated: 2026-04-12 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/insights-api-overview>
102. Walmart (Developer Portal). *Get pricing insights*. Published or last updated: 2026-06-08 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/get-pricing-insights>
103. Walmart (Developer Portal). *Request a Buy Box insights report*. Published or last updated: 2026-08-20 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/request-a-buy-box-insights-report>
104. Walmart (Developer Portal). *Request a search insights SQR report*. Published or last updated: 2026-08-20 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/request-a-search-insights-sqr-report>
105. Walmart (Developer Portal). *Item search for the Walmart catalog*. Published or last updated: 2026-10-22 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/item-search-for-the-walmart-catalog>
106. Walmart (Developer Portal). *Request an item listing quality report*. Published or last updated: 2026-08-17 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/request-an-item-listing-quality-report>
107. Walmart (Developer Portal). *Request a content quality report*. Published or last updated: 2026-08-18 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/request-a-content-quality-report>
108. Walmart (Developer Portal). *Rate limiting*. Published or last updated: 2026-11-20 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/rate-limiting>
109. Walmart (Developer Portal). *Global Marketplace portal (Canada, Mexico and Chile APIs)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developer.walmart.com/global-marketplace>
110. Walmart (Developer Portal). *Monitor item listing quality*. Published or last updated: 2026-11-13 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/us-marketplace/docs/monitor-item-listing-quality>
111. Walmart (Developer Portal). *Introduction to Walmart supplier APIs*. Published or last updated: 2026-04-12 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/suppliers/docs/get-started>
112. Walmart (Developer Portal). *Item Management API overview (1P suppliers)*. Published or last updated: 2026-09-24 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/suppliers/docs/item-management-api-overview>
113. Walmart (Developer Portal). *On Request Reports API overview (1P suppliers)*. Published or last updated: 2026-10-06 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/suppliers/docs/on-request-reports-api-overview>
114. Walmart (Developer Portal). *Synchronous API throttling limits (1P suppliers)*. Published or last updated: 2026-04-12 (last updated). Accessed: 2026-11-26. <https://developer.walmart.com/suppliers/docs/sync-api-throttling-limits>
115. Walmart Inc. (corporate site). *Suppliers*. Published or last updated: n.d. Accessed: 2026-11-26. <https://corporate.walmart.com/suppliers>
116. Walmart Data Ventures. *Introducing Scintilla: Walmart Luminate will have a new name in 2025*. Published or last updated: 2024-10-01. Accessed: 2026-11-26. <https://www.walmartdataventures.com/content/walmartdataventures/en_us/insights/articles/introducing-scintilla-walmart-luminate-will-have-a-new-name-in-2025.html>
117. Walmart Data Ventures. *Data Access & Collaboration (Scintilla)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://www.walmartdataventures.com/content/walmartdataventures/en_us/data-access-and-collaboration.html>
118. noon. *docs.noon.partners — returned HTTP 418 to an automated request*. Published or last updated: n.d. Accessed: 2026-11-26. <https://docs.noon.partners/>
119. noon. *Noon Seller Help Center — JavaScript application; article content could not be retrieved*. Published or last updated: n.d. Accessed: 2026-11-26. <https://helpcenter.noon.partners/>
120. Google (Merchant API documentation). *Overview of Merchant API*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developers.google.com/merchant/api/overview>
121. Google (Content API for Shopping documentation). *Get started — Content API for Shopping (Deprecated)*. Published or last updated: 2026-07-06 (last updated). Accessed: 2026-11-26. <https://developers.google.com/shopping-content/guides/quickstart>
122. Google (Merchant API documentation). *Merchant Reports API*. Published or last updated: 2026-10-26 (last updated). Accessed: 2026-11-26. <https://developers.google.com/merchant/api/guides/reports/overview>
123. Google (Merchant Center Help). *About Competitors in Merchant Center Analytics*. Published or last updated: n.d. Accessed: 2026-11-26. <https://support.google.com/merchants/answer/13773303>
124. Google (Merchant Center Help). *About Pricing in Merchant Center Analytics*. Published or last updated: n.d. Accessed: 2026-11-26. <https://support.google.com/merchants/answer/13798101>
125. Google (Merchant Center Help). *About Product ratings*. Published or last updated: n.d. Accessed: 2026-11-26. <https://support.google.com/merchants/answer/14620705>
126. Google (Merchant API documentation). *Review products using Merchant API*. Published or last updated: 2026-11-17 (last updated). Accessed: 2026-11-26. <https://developers.google.com/merchant/api/guides/reviews/products>
127. Google (developers.google.com). *Product Review Feeds*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developers.google.com/product-review-feeds>
128. Google (Merchant API documentation). *Quotas*. Published or last updated: 2026-10-26 (last updated). Accessed: 2026-11-26. <https://developers.google.com/merchant/api/guides/quotas-limits/quotas>
129. Google (Merchant Center Help). *Terms of Service (Merchant Center, by country)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://support.google.com/merchants/answer/160173>
130. GS1. *Global Trade Item Number (GTIN)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://www.gs1.org/standards/id-keys/gtin>
131. GS1. *How to calculate a check digit manually*. Published or last updated: n.d. Accessed: 2026-11-26. <https://www.gs1.org/services/how-calculate-check-digit-manually>
132. GS1. *Contact Overview (list of GS1 Member Organisations)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://www.gs1.org/contact/overview>
133. GS1. *GS1 local office pages — retrieved for United Arab Emirates, Saudi Arabia, South Africa, India, Kenya, Nigeria, Malaysia, United Kingdom and United States (same URL pattern /locations/<country>)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://www.gs1.org/locations/united-arab-emirates>
134. GS1. *GS1 Global Data Synchronisation Network (GS1 GDSN)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://www.gs1.org/services/gdsn>
135. GS1 AISBL. *GS1 Digital Link Standard: URI Syntax, Release 1.7.0*. Published or last updated: 2026-08 (Ratified Aug 2026). Accessed: 2026-11-26. <https://ref.gs1.org/standards/digital-link/uri-syntax/>
136. GS1 AISBL. *GS1 Digital Link (standards overview)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://ref.gs1.org/standards/digital-link/>
137. Flipkart. *Flipkart Marketplace Seller APIs — Developer API v3.0 documentation*. Published or last updated: n.d. (page footer: Copyright 2017). Accessed: 2026-11-26. <https://seller.flipkart.com/api-docs/FMSAPI.html>
138. Flipkart. *Listing Management API (overview)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://seller.flipkart.com/api-docs/listing-api-docs/LMAPIOverview.html>
139. Flipkart. *Listing Management API Reference For Flipkart Marketplace*. Published or last updated: n.d. Accessed: 2026-11-26. <https://seller.flipkart.com/api-docs/listing-api-docs/LMAPIRef.html>
140. Shopee Open Platform. *API reference — v2.product.get_item_base_info (with the full API module list)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://open.shopee.com/documents/v2/v2.product.get_item_base_info?module=89&type=1>
141. Lazada Open Platform. *API reference — GetProducts (with the API category list)*. Published or last updated: 2022-07-28 (latest update). Accessed: 2026-11-26. <https://open.lazada.com/apps/doc/api?path=%2Fproducts%2Fget>
142. TikTok Shop Partner Center. *TikTok Shop API concepts — Overview*. Published or last updated: n.d. Accessed: 2026-11-26. <https://partner.tiktokshop.com/docv2/page/tts-api-concepts-overview>
143. TikTok Shop Partner Center. *Get started overview (developer types)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://partner.tiktokshop.com/docv2/page/tts-developer-types>
144. eBay Developers Program. *Browse API (overview)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developer.ebay.com/api-docs/buy/browse/overview.html>
145. Mirakl. *Mirakl Platform (API reference overview)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developer.mirakl.com/content/product/mmp>
146. Nykaa. *Nykaa seller site — returned HTTP 403 'Access Denied' to an automated request*. Published or last updated: n.d. Accessed: 2026-11-26. <https://seller.nykaa.com/>
147. Meesho. *Meesho supplier site — returned HTTP 403 'Access Denied' to an automated request*. Published or last updated: n.d. Accessed: 2026-11-26. <https://supplier.meesho.com/>
148. Myntra. *Partner at Myntra-Jabong (partner site with login and registration; no API documentation)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://partners.myntrainfo.com/>
149. Target. *Target Developer Portal (login page only)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developer.target.com/>
150. Target. *Target Plus — Marketplace for Sellers*. Published or last updated: n.d. Accessed: 2026-11-26. <https://plus.target.com/>
151. The Kroger Co.. *Products API (1.3.0) — public*. Published or last updated: 2025-10-21 (catalog 'last updated'). Accessed: 2026-11-26. <https://developer.kroger.com/api-products/api/product-api-public>
152. The Kroger Co.. *Kroger Developers — home ('APIs for Everyone')*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developer.kroger.com/>
153. Instacart. *Introduction — Instacart Developer Platform API*. Published or last updated: n.d. Accessed: 2026-11-26. <https://docs.instacart.com/developer_platform_api/>
154. Instacart. *Instacart Connect APIs*. Published or last updated: 2026-10-19 (last updated). Accessed: 2026-11-26. <https://docs.instacart.com/connect/>
155. Takealot. *Takealot Seller API — broader API definition served at /swagger.json (588 path entries)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://seller-api.takealot.com/swagger.json>
156. Jumia. *Jumia VendorHub NG (vendor education site; a Kenyan equivalent exists at vendorhub.jumia.co.ke)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://vendorhub.jumia.com.ng/>
157. Shopee Open Platform. *API reference — v2.product.get_item_extra_info*. Published or last updated: n.d. Accessed: 2026-11-26. <https://open.shopee.com/documents/v2/v2.product.get_item_extra_info?module=89&type=1>
158. TikTok Shop Partner Center. *Listing quality diagnosis*. Published or last updated: n.d. Accessed: 2026-11-26. <https://partner.tiktokshop.com/docv2/page/listing-quality-diagnosis>
159. TikTok Shop Partner Center. *Rate limits*. Published or last updated: n.d. Accessed: 2026-11-26. <https://partner.tiktokshop.com/docv2/page/rate-limits>
160. Mirakl. *Mirakl Developer Portal*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developer.mirakl.com/>
161. The Kroger Co.. *Developer Catalog (API products)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developer.kroger.com/api-products>
162. Bazaarvoice (Developer Space). *Bazaarvoice Developer Space — product list*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developers.bazaarvoice.com/>
163. Bazaarvoice (Developer Space). *Conversations API — Home*. Published or last updated: 2026-03-30 (last updated). Accessed: 2026-11-26. <https://developers.bazaarvoice.com/v1.0-ConversationsAPI/docs/home>
164. Bazaarvoice (Developer Space). *API Key Management*. Published or last updated: 2026-03-30 (last updated). Accessed: 2026-11-26. <https://developers.bazaarvoice.com/v1.0-ConversationsAPI/docs/api-key-management>
165. Bazaarvoice (Developer Space). *Displayable Content Export — Home*. Published or last updated: 2026-03-30 (last updated). Accessed: 2026-11-26. <https://developers.bazaarvoice.com/v1.0-DCE/docs/home>
166. Bazaarvoice (Developer Space). *Product Sentiments API — Overview*. Published or last updated: 2026-03-30 (last updated). Accessed: 2026-11-26. <https://developers.bazaarvoice.com/v1.0-SentimentsAPI/docs/overview>
167. Bazaarvoice (Developer Space). *API Rate Limit*. Published or last updated: 2026-03-30 (last updated). Accessed: 2026-11-26. <https://developers.bazaarvoice.com/v1.0-ConversationsAPI/docs/api-rate-limit>
168. Bazaarvoice (Developer Space). *Syndicated Content*. Published or last updated: 2026-03-30 (last updated). Accessed: 2026-11-26. <https://developers.bazaarvoice.com/v1.0-ConversationsAPI/docs/syndicated-content>
169. PowerReviews. *PowerReviews API documentation (Enterprise, Display and Write APIs)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://apidocs.powerreviews.com/>
170. PowerReviews. *PowerReviews APIs (developer portal)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developers.powerreviews.com/>
171. Yotpo. *Yotpo API Documentation (API hub and documentation index)*. Published or last updated: n.d. Accessed: 2026-11-26. <https://docs.yotpo.com/>
172. Trustpilot. *Get started with Data Solutions*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developers.trustpilot.com/data-solutions-get-started/>
173. Trustpilot. *Get started with Trustpilot for Business*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developers.trustpilot.com/introduction/>
174. Trustpilot. *Rate limiting best practices*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developers.trustpilot.com/rate-limiting/>
175. Akeneo. *Akeneo API documentation*. Published or last updated: n.d. Accessed: 2026-11-26. <https://api.akeneo.com/>
176. Salsify. *Salsify Developer Hub*. Published or last updated: n.d. Accessed: 2026-11-26. <https://developers.salsify.com/>
177. Pimcore. *Pimcore Datahub*. Published or last updated: n.d. (documentation version 2026.3). Accessed: 2026-11-26. <https://docs.pimcore.com/platform/Datahub/>
178. Plytix. *Plytix API Documentation*. Published or last updated: n.d. Accessed: 2026-11-26. <https://docs.plytix.com/>
179. Amazon (Selling Partner API documentation). *Listings APIs FAQ*. Published or last updated: 2026-11-25 (last updated). Accessed: 2026-11-26. <https://developer-docs.amazon/sp-api/docs/listings-apis-faq>
