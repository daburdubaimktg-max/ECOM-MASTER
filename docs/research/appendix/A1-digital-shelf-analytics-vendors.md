# A1 — Digital shelf analytics vendors: evidence for the build-versus-buy decision

Appendix to the Brand Intelligence Engine research. Audience: the product owner deciding which capabilities to buy, integrate or build. Research date: **2026-11-26**.

## How this was researched

- Desk research on 2026-11-26 using public web pages only. 19 web searches were run before the session's shared search allowance ran out; after that, about 180 pages were requested directly from vendor websites, vendor press rooms and a few third-party sites, of which about 25 refused access or no longer existed. Nothing was signed up for, logged into or submitted, and no demo was taken.
- Every factual statement carries a numbered source from the list at the end. Vendor marketing is treated as evidence that a claim is made, not that it is true, and is worded as "vendor states" or "company-reported".
- Thirteen platforms are profiled: five in depth (the required ones) and eight more briefly. Nine further candidates were checked and are listed with their status.
- The machine-readable version of the profiles is in `data/research/vendors/digital-shelf-analytics.json`. The profile tables below are generated from the same records, so the two cannot drift apart.

## How to read this appendix

| Label | Meaning |
|---|---|
| company-reported / vendor states | A figure or claim published by the vendor itself. Not audited. |
| third-party listing | A figure shown on a software directory (here: Capterra). Often supplied by the vendor or out of date. |
| Not found | Looked for on the pages retrieved and not found. It does **not** mean the capability or coverage is absent. |
| UNVERIFIED | Something believed to be true that could not be confirmed from a source retrieved on 2026-11-26. |
| dated | The source is more than about 18 months old (before roughly May 2025). |

Coverage status used for our nine countries (UAE, Saudi Arabia, South Africa, United States, United Kingdom, India, Kenya, Nigeria, Malaysia):

- **confirmed** — specific evidence on a vendor page: the country, or a retailer site that serves only that country (for example walmart.com or boots.com), is named in a coverage table, a product or country page, or a customer example. It is still vendor-originated evidence, not an independent audit.
- **vendor claims** — weaker evidence: only a region is named, or a retailer appears in a general list without the country, or the wording is hedged, or the only evidence is old trade press.
- **not found** — nothing specific found. Generic claims such as "70+ countries" are recorded in the notes but are not counted as evidence for a particular country.

Capability values in the matrix: **Y** = offered as a described feature; **P** = partial (one retailer only, monitoring only, through a partner or managed service, or only loosely described); **N** = the vendor's own material shows it relies on partners for this; **?** = not mentioned on the pages retrieved (for specialist tools this usually means it is outside the product's scope, but that was not confirmed).

## At a glance

| # | Platform | Type | Owner | Pricing | Evidence found for our markets |
|---|---|---|---|---|---|
| 1 | Profitero+ | Digital shelf suite + managed services | Publicis Groupe [9] | Quote-based [18] | US and UK only; "1,400+ retailers in 70+ countries" is company-reported with no country list [1][17] |
| 2 | CommerceIQ | Digital shelf + retail media + Amazon operations, run by AI agents | Independent [29] | Quote-based; Capterra lists a $25,000 starting price (third-party, unit unclear) [32] | US and UK only; "1,450+ retailers, 85+ countries" company-reported [20][24] |
| 3 | NIQ Digital Shelf (ex Data Impact) | Digital shelf analytics tied to NIQ sales measurement | NIQ / NielsenIQ [34][42] | Quote-based | No country list; US and Europe per 2021 trade press; UAE only through the separate Brandbank content business [38][41] |
| 4 | DataWeave | Digital shelf + pricing intelligence + data feeds | Independent [54] | Quote-based | US, India, South Africa (customer testimonial); UK claimed [45][55][56][59] |
| 5 | Stackline | Market intelligence + brand analytics + retail media + shopper panel | Independent [69] | Quote-based | US only; "26 countries" not listed [61] |
| 6 | Paxcom | Digital shelf + ad automation, India-centred | Not confirmed [73] | Quote-based | India confirmed; UK and US named; Middle East and South-East Asia named as regions [74][77] |
| 7 | 42Signals | Digital shelf monitoring + review analytics | PromptCloud [81] | Quote-based; enquiry form shows $500–$5,000+/month bands [80] | UAE, Saudi Arabia, India, US, UK confirmed; Takealot, Jumia and Shopee named [78][79] |
| 8 | MetricsCart | Digital shelf analytics, content and review monitoring | Not found | **Public: from $300/month** [85] | US (Amazon, Walmart, Target); UK, India, UAE and Saudi Arabia through Amazon only [84][87][89] |
| 9 | Flywheel Commerce Cloud | Retail media + market intelligence + services | Omnicom [96] | Quote-based | US only on pages retrieved [93] |
| 10 | Pacvue | Retail media platform with digital-shelf signals | Not found | Quote-based | US, UK, Amazon UAE, Amazon Saudi Arabia; "Africa coverage is more limited today" [98] |
| 11 | Vizit | Image / creative analytics | Not found | Quote-based | Not retailer-specific [105] |
| 12 | Similarweb Retail Intelligence | Panel-based demand and Amazon analytics + shelf monitoring | Similarweb | Quote-based; free trial [110] | US and UK; Amazon analytics limited to six marketplaces, none in our other markets [110] |
| 13 | Helium 10 | Amazon / Walmart / TikTok seller tools | Pacvue [102] | **Public: $99–$359/month; enterprise from $1,499/month** [113] | US and UK; other markets could not be checked [114] |

### Coverage evidence for the nine target countries

C = confirmed, V = vendor claims, – = not found. See each profile for the retailers named.

| Platform | UAE | Saudi Arabia | South Africa | United States | United Kingdom | India | Kenya | Nigeria | Malaysia |
|---|---|---|---|---|---|---|---|---|---|
| Profitero+ | – | – | – | C | C | – | – | – | – |
| CommerceIQ | – | – | – | C | C | – | – | – | – |
| NIQ Digital Shelf | V | – | – | V | V | – | – | – | – |
| DataWeave | – | – | C | C | V | C | – | – | – |
| Stackline | – | – | – | C | – | – | – | – | – |
| Paxcom | V | V | – | C | C | C | – | – | V |
| 42Signals | C | C | V | C | C | C | V | V | V |
| MetricsCart | C | C | – | C | C | C | – | – | – |
| Flywheel | – | – | – | C | – | – | – | – | – |
| Pacvue | C | C | – | C | C | – | – | – | V |
| Vizit | – | – | – | – | – | – | – | – | – |
| Similarweb Retail Intelligence | – | – | – | C | C | – | – | – | – |
| Helium 10 | – | – | – | C | C | – | – | – | – |

Reading this table: no vendor could be shown to cover all nine countries. Kenya and Nigeria have no confirmed coverage from anyone; the only trace is 42Signals naming Jumia [79]. Outside the US and UK, evidence comes almost entirely from the smaller, India-rooted vendors and from Amazon-only coverage.

## Part 1 — In-depth profiles (the five required platforms)

### 1. Profitero+ (Profitero)

| Dimension | Findings |
|---|---|
| **Owner / head office** | Publicis Groupe (Profitero joined in March 2022) [9]. Head office: Not found on pages retrieved (UNVERIFIED: Boston, MA, USA). |
| **Typical customer** | Enterprise consumer-goods brands. Vendor states 9,000+ brands (company-reported) [1]. Capterra says enterprises make up 76% of its Profitero+ reviewers (third-party) [18]. |
| **Corporate changes since 2023** | August 2023: 'Ask Profitero' chat-based AI assistant announced [14][15]. 20 May 2025: rebranded offer 'Profitero+' launched, combining Profitero data/technology with Mars United Commerce managed services inside Publicis [13]. October 2025: vendor states it was named a Leader in the IDC MarketScape for Digital Shelf Analytics 2025 [16]. (The Publicis acquisition itself dates from 2022 [9][15].) |
| **Core functionality** | Modules: Digital Shelf (search visibility, availability and assortment, content compliance, price / MAP / third-party sellers / promotions, ratings and reviews) [2]; Sales & Share (Amazon sales and market-share estimates, 1P vs 3P, traffic and conversion) [3]; Content Optimizer (retailer-specific keywords, benchmarks, GenAI copy, approval workflow) [4]; Autopilot (automatic Amazon content correction, suppressed-ASIN and variant fixes, case management) [5]; Shelf Intelligent Media (ad bids adjusted from shelf signals through Skai, Pacvue and DSPs) [6]; AMZ Vendor Health (Amazon profitability dashboard from Vendor Central data) [7]; Store-Based Analytics (store-level price and availability) [8]; plus managed services for media, content, operations and strategy [1][13]. |
| **Data collection** | Daily collection from retailer sites (a Capterra reviewer calls them 'daily scrapes' [18]); vendor states 40TB of data per day at '95% accuracy' (company-reported) [2]. 'Secure Walmart API data' as a Walmart partner [12]. Amazon Vendor Central data for AMZ Vendor Health [7]. The client's content source of truth for Autopilot [5]. Sales & Share figures are modelled estimates ('90% accurate ... at the brand & category level', company-reported) [3]. ML / LLM parsing used for data quality [11]. |
| **Marketplace coverage** | Vendor states 1,400+ retailers in 70+ countries and 80M+ products tracked daily (company-reported) [1][2]. Retailers named on pages retrieved: Amazon and Walmart [3][4][12]. A customer quote cites 30 markets [1]. Retailer capability reports are published only for the US and UK [17]. No public retailer list by country was found. |
| **Evidence for our nine markets** | UAE: **not found** — Only the generic '70+ countries' claim [1]; no UAE retailer (Amazon.ae, Noon) named on pages retrieved.<br>Saudi Arabia: **not found** — Only the generic '70+ countries' claim [1].<br>South Africa: **not found** — Only the generic '70+ countries' claim [1]; Takealot not named.<br>United States: **confirmed** — Amazon and Walmart named; US retailer capability snapshots; US price studies [3][12][15][17].<br>United Kingdom: **confirmed** — UK retailer capability snapshots and UK price-study press releases [15][17].<br>India: **not found** — Only the generic '70+ countries' claim [1]; Flipkart / Nykaa not named.<br>Kenya: **not found** — No evidence found.<br>Nigeria: **not found** — No evidence found.<br>Malaysia: **not found** — No evidence found; Shopee / Lazada not named. |
| **Content intelligence** | Flags SKU-level content inconsistencies and checks that content fields are correct and visible on retailer pages; fixes can flow through PIM/DAM integrations [2]. Autopilot aligns Amazon titles, bullets, descriptions and images with the brand's source of truth [5]. Vendor states 180 attributes are monitored per product (company-reported) [10]. |
| **Listing quality scores** | Official retailer score: Walmart only on the evidence found - product pages are 'continuously scored against Walmart Content Quality Scores, category leaders and ... search terms', using Walmart API data [12]. Own scores: 'Completeness and Discoverability Scores' in Content Optimizer [4]. |
| **Ratings and reviews** | Review monitoring, customer-sentiment insights, automated alerts that flag negative reviews, and rating benchmarks against 'Amazon Fast Movers' and top competitors [2]. |
| **Competitor intelligence** | Competitor pricing and promotions, MAP violations, unauthorised third-party sellers, competitor launches, keyword and search share, and Amazon competitor sales and share estimates [2][3]. |
| **Automation** | Customised alerts [2]; Autopilot automatically corrects Amazon content and manages cases [5]; Shelf Intelligent Media adjusts ad bids automatically ('10k+ daily bid optimizations', company-reported) [6]. |
| **AI capabilities** | Ask Profitero - chat-based assistant on LLMs, announced August 2023 [14][15]; GenAI copy generation in Content Optimizer using brand guidelines and keywords [4]; ML / LLM parsing for data quality and automated bid adjustment [11]. |
| **Integrations** | PIM/DAM: Salsify, Syndigo, Riversand. Bid management: Pacvue, Skai. Programmatic: Amazon DSP, Walmart DSP, The Trade Desk, Pubmatic, DV360, Yahoo DSP. Measurement: Circana OmniMarket [2][9]. Data delivery through the web app, exports and Snowflake (for Tableau, Looker, Power BI) [2]. Public API documentation: Not found. |
| **Pricing** | Quote-based (no public price list). Third-party: Not found. Capterra shows 'Get Price' with no figure and 'Free trial not available' [18]; no Vendr page was found; G2 refused automated access. |
| **Limitations** | Documentation: Sales & Share and Autopilot are Amazon-only [3][5]; retailer capability reports cover only the US and UK [17]; no public country-by-country retailer list. Capterra user reviews (2021-2022, dated): very large exports crash; the dashboard 'could do with an overhaul'; the Ratings & reviews and Placement modules give insight 'but you can do almost nothing about it'; product categorisation needs continuous review [18]. Sales-led purchase with no free trial [18]. |
| **Confidence in this profile** | Medium. Modules and integrations are well documented on vendor pages (high). Coverage of UAE, Saudi Arabia, South Africa, India, Kenya, Nigeria and Malaysia could not be evidenced (low). Capability notes: official score ingestion is evidenced for Walmart only; sales/share estimates are Amazon-only; 'partial' on syndication and retail media means done through Amazon automation, partners or managed services. |

**Notes**

- The widest "insight to action" set among the five required vendors, but the action end is Amazon-centred: Autopilot and Sales & Share are Amazon-only [3][5]. Walmart is the only retailer for which use of an official retailer score is evidenced [12].
- Since 2025 the product is sold together with managed services from Publicis's Mars United Commerce under the Profitero+ name [13]. Check what can be bought as software or data only.
- For our markets the key open question is the retailer list. Ask specifically about Amazon.ae, Amazon.sa, Noon, Takealot, Jumia, Flipkart, Nykaa, Shopee and Lazada — none is named publicly.

### 2. CommerceIQ (includes the former e.fundamentals)

| Dimension | Findings |
|---|---|
| **Owner / head office** | Independent, venture-backed (Insight Partners, SoftBank, Madrona named by the vendor) [29]. Head office: Mountain View, California, USA (about page); support offices in London and Bengaluru [24]. Press releases are datelined Palo Alto [27][28][29]. |
| **Typical customer** | Enterprise consumer brands. Vendor states 2,200+ brands including Nestle, Colgate and Whirlpool (company-reported) [29]. Capterra: 'designed for enterprise consumer brands selling on Amazon, Walmart.com, and other online marketplaces' (third-party) [32]. |
| **Corporate changes since 2023** | Background (2022, dated): acquired UK digital-shelf vendor e.fundamentals in July 2022; e.fundamentals then reported 451 retailers in 41 countries; operations were merged and the first joint product was 'e.fundamentals by CommerceIQ' [30][31]. The e.fundamentals name no longer appears on CommerceIQ's current home, digital-shelf or about pages; the capability is sold as 'Digital Shelf Analytics powered by AllyAI' [19][20][24]. 21 May 2025: AllyAI 'AI teammates' launched [27]. 3 March 2026: four AllyAI agents (Content, Sales, Shelf, Media) launched [28]. 1 September 2026: Rahul Shah named CEO; founder Guru Hariharan became Executive Chairman [29]. |
| **Core functionality** | Four products on the AllyAI layer: Content Optimization (detect gaps, recommend and publish content) [21]; eCommerce Sales Management / Copilot for Amazon (plan tracking, predictive out-of-stock, automatic ticketing for suppressed SKUs, third-party variants and disputes) [23]; Digital Shelf Analytics (daily gap-to-plan scorecards, share of search, availability, content, ratings; one-click reports) [20]; Retail Media Management (bids and budgets optimised with an incrementality model using 50+ signals) [22]. Delivered with forward-deployed engineers and retail experts [19]. |
| **Data collection** | Digital-shelf tracking across retailer sites (method not described on the current page; the acquired e.fundamentals platform captured store-level availability, distribution and pricing daily [31]). Retailer and retail-media APIs, e.g. 'full integration with the Instacart API'; Amazon Vendor Central and Amazon Retail Analytics data [125]. Client PIM 'gold standard' content through two-way PIM sync [20]. |
| **Marketplace coverage** | Vendor states 1,450+ retailers and 85+ countries (company-reported) [24]. Named: Amazon, Walmart, Target, Kroger, Tesco, Sainsbury's, Carrefour [20]; Instacart, Best Buy, Criteo, Chewy, Citrus [19][25]. No Middle East, Africa, India or South-East Asia retailer is named on the pages retrieved. |
| **Evidence for our nine markets** | UAE: **not found** — Only the generic '85+ countries' claim [24].<br>Saudi Arabia: **not found** — Only the generic '85+ countries' claim [24].<br>South Africa: **not found** — No evidence found.<br>United States: **confirmed** — Amazon, Walmart, Target, Kroger, Instacart, Best Buy named [19][20].<br>United Kingdom: **confirmed** — Tesco and Sainsbury's named [20]; London support office [24].<br>India: **not found** — A support office in Bengaluru [24], but no Indian retailer named.<br>Kenya: **not found** — No evidence found.<br>Nigeria: **not found** — No evidence found.<br>Malaysia: **not found** — No evidence found. |
| **Content intelligence** | Content validated against the brand's 'gold standard'; secondary-image compliance 'with AI-powered matching'; SEO and answer-engine optimisation including Amazon Rufus; corrections flow back through two-way PIM sync [20]. The Content Agent 'identifies and resolves PDP compliance and optimization gaps' [28]. Publishing: 'Where a retailer has an API, we use it. Where one doesn't, our agents log into the retailer's portal', with human approval before anything ships [21]. |
| **Listing quality scores** | Own scores: 'content score' and 'shelf score' in scorecards and an AEO readiness score per product [19][20][21]. Ingestion of official retailer scores: Not found. |
| **Ratings and reviews** | Ratings and reviews appear as a scorecard metric [20] and the Shelf Agent monitors 'content, availability, assortment, reviews and search' [28]. Sentiment or theme analysis: Not found. |
| **Competitor intelligence** | Position-weighted share of search across paid and organic placements [20]; competitor promotions, third-party sellers and Buy Box as causes of sales drops on Amazon [23]; competitor out-of-stock used for ad conquesting [125]. |
| **Automation** | Prioritised next-best actions, daily scorecards and one-click PowerPoint / Excel business reviews [20]; automatic tickets with Amazon for suppressed SKUs, third-party variants and disputes [23]; automated bid and budget changes [22]; one-click content publishing with human approval [21]. |
| **AI capabilities** | AllyAI role-specific 'AI teammates' (21 May 2025) [27]; Ask Ally plain-language Q&A [20]; four AllyAI agents - Content, Sales, Shelf, Media (3 March 2026) [28]. |
| **Integrations** | Two-way PIM integration including Salsify [20]; Stibo Systems partnership listed in press [26]; retail media networks including Amazon, Walmart, Instacart, Criteo, Chewy Ads [19][22][26]; exports to PowerPoint and Excel [20]; SOC 2 Type II, SSO, role-based access [23]. Public API documentation: Not found. |
| **Pricing** | Quote-based (no public price list). Third-party: Capterra listing (third-party): 'Starting price $25000' with the unit shown as 'Per User, Per Month', plus 'Custom pricing' [32]. The unit looks unreliable; treat only as a rough indication of entry-level spend. |
| **Limitations** | G2 reviews (via search-result summary only; the G2 page refused automated access): 4.2/5 from 28 reviews; reviewers cite data inaccuracy, slow performance and limited report customisation [33]. Documentation: the deepest automation (Copilot) is described for Amazon [23]; no Middle East, Africa, India or South-East Asia retailer named [19][20][24][25]. The vendor now positions itself as 'the agency alternative' run with its own experts, which implies a services element [19][29]. No public price list. |
| **Confidence in this profile** | Medium. Product modules and dates come from vendor pages and press releases (high). Country coverage is a company-reported total with few named retailers (low for our target markets). 'partial' on sales/share: the homepage lists 'Share' and 'Share Shift Alerts' without detail; on API/export: only PowerPoint/Excel export is stated. |

**Notes**

- **What happened to e.fundamentals:** CommerceIQ bought the UK digital-shelf vendor in July 2022 and merged its operations; the first joint product was called "e.fundamentals by CommerceIQ" [30][31]. Four years on, the name is gone from CommerceIQ's main pages and the capability is sold as "Digital Shelf Analytics powered by AllyAI" [19][20][24]. The retailer count has grown from the 451 retailers in 41 countries that e.fundamentals reported in 2022 [30] to a company-reported 1,450+ retailers in 85+ countries [24]. The old e.fundamentals web domains could not be checked (they refused automated access).
- The company has moved from analytics towards execution: AI agents plus its own experts make content, media and ticketing changes on the brand's behalf, and it now calls itself "the agency alternative" [19][28][29]. That is attractive if we want outcomes, less so if we want a neutral data feed for our own engine.
- New chief executive since September 2026 [29].

### 3. NIQ Digital Shelf (NielsenIQ; formerly Data Impact) with NIQ Digital Shelf Lite / NIQ Brandbank

| Dimension | Findings |
|---|---|
| **Owner / head office** | NIQ Global Intelligence (NielsenIQ), listed on the NYSE after its July 2025 IPO [42]. Head office: Not found on pages retrieved (a search-result summary of the Renaissance Capital IPO profile says Chicago, Illinois, USA [127]). |
| **Typical customer** | Vendor states 'companies of all sizes' [34]; in practice global consumer-goods manufacturers (testimonials and event speakers from large CPG companies) [34][40]. NIQ Digital Shelf Lite is sold through NIQ Brandbank to brands that use its content services [36][37]. |
| **Corporate changes since 2023** | NIQ and GfK combined (NIQ's about page links to 'the NIQ GfK combination'; date not captured) [43]. July 2025: NIQ Global Intelligence IPO priced at $21, raising $1.1bn [42]. Product: Data Impact (Paris-based, bought by NielsenIQ in 2021 [41]) has been renamed NIQ Digital Shelf - 'Previously Data Impact, NIQ Digital Shelf combines that foundation with NIQ's global measurement, shopper and content data' [34]. NIQ Brandbank expanded into the UAE and Philippines (May 2023) and signed four more UAE retailers (June 2024) [38][39]. |
| **Core functionality** | NIQ Digital Shelf modules: Availability (out-of-stock rates, location-level availability, missed sales, share of assortment, negotiated vs live listings); Visibility (organic and paid share of search, category rank, product search score, AI keyword recommendations, retail-media monitoring); Content (image compliance, titles and keyword scores, product-page health checks, syndication accuracy, ratings and reviews, shopper sentiment); Sales & Performance (sales and share next to shelf KPIs, quantified revenue impact, Amazon sales and share, price / promotion monitoring with MAP detection, scorecards) [34]. NIQ Digital Shelf Lite: a lighter tool for price, competitor promotions, share of category and share of search [36]. NIQ Brandbank: product content capture, management and syndication to retailers [37]. |
| **Data collection** | Vendor states data is 'collected continuously from retailer websites, not just estimated from a sample', matched to a UPC-based product reference with AI-assisted matching and human validation; 200bn+ data points a day (company-reported) [34]. Digital-shelf data is connected to NIQ's own sales and share measurement [34]. Digital Shelf Lite claims 'real transactional data directly from retailers' through Brandbank [36]. |
| **Marketplace coverage** | NIQ Digital Shelf: 1,000+ retailers and 141,000+ locations (company-reported) [34]; the legacy Data Impact page says 1,000+ CPG retailers in 75+ countries and 56M products [35]. NIQ Digital Shelf Lite: 500+ retailers and 50+ countries [37]. NIQ Brandbank: 39 countries, 700+ retailers and wholesalers (2024, dated) [38]. No retailer list by country found for the analytics product. |
| **Evidence for our nine markets** | UAE: **vendor claims** — NIQ Brandbank (content, not analytics) names UAE retailers elGrocer, Spinneys, Deliveroo and Sharjah Co-op [38][39]; NIQ ran a UAE event with a digital-shelf session in May 2025 [40]. No UAE retailer list for NIQ Digital Shelf (e.g. Amazon.ae, Noon) found.<br>Saudi Arabia: **not found** — Only the generic '75+ countries' claim [35].<br>South Africa: **not found** — Only the generic '75+ countries' claim [35].<br>United States: **vendor claims** — Trade press (2021, dated) says Data Impact operated mainly in Europe and the US [41]; NIQ's pages cite US e-commerce share and Amazon sales and share [34][35]. No US retailer list found.<br>United Kingdom: **vendor claims** — Data Impact operated 'mainly across Europe' [41]; NIQ Brandbank press releases are issued from Norwich, UK [38]. No UK retailer list found.<br>India: **not found** — Only the generic '75+ countries' claim [35].<br>Kenya: **not found** — No evidence found.<br>Nigeria: **not found** — No evidence found.<br>Malaysia: **not found** — No evidence found. |
| **Content intelligence** | Image compliance, product titles and keyword scores, product-detail-page health checks and 'content syndication accuracy' [34]. Through NIQ Brandbank the group also creates and syndicates the content itself (5,750+ attributes, GDSN connectivity) [37]. |
| **Listing quality scores** | Own measures: keyword scores, a product-level search score and page health checks [34]. Ingestion of official retailer scores: Not found. |
| **Ratings and reviews** | 'Ratings and reviews benchmarked against category' and 'Shopper sentiment analysis' [34]. |
| **Competitor intelligence** | Share of search (organic and paid), share of assortment, category benchmarking, competitor promotions and retail-media activity, 1P / 3P seller tracking and lost Buy Box monitoring, plus sales and share estimates 'where retailers don't report them' [34]. |
| **Automation** | Customisable scorecards and AI-ranked recommended actions; advisory support from NIQ staff [34][35]. Alerts and scheduled reports are not described on the pages retrieved. |
| **AI capabilities** | 'AI-powered analysis quantifies what each KPI contributed to revenue', AI keyword recommendations, 'AI-decoded retailer algorithms', AI-assisted product matching [34]. No named assistant or launch date found for this product. |
| **Integrations** | Connected to NIQ sales and share data [34]. NIQ Brandbank: GDSN connectivity and a content-licensing API covering 50M+ FMCG products [37]; a Salsify connector to NIQ Brandbank was announced in November 2023 (search-result summary only; dated) [44]. API or BI export for NIQ Digital Shelf: Not found. |
| **Pricing** | Quote-based (no public price list). Third-party estimate: Not found. |
| **Limitations** | No public pricing. Two overlapping products with different coverage figures (Digital Shelf vs Digital Shelf Lite) [34][36][37]. No retailer list by country and no named retailer for UAE, Saudi Arabia, South Africa, India, Kenya, Nigeria or Malaysia in the analytics product. API, alerting and export options are not described publicly. Gartner Peer Insights reviews for 'NielsenIQ Data Impact' exist but refused automated access, so no user-reported limitations could be collected. |
| **Confidence in this profile** | Medium. Module list is from NIQ's current product page (high). Coverage of our target markets is unproven apart from Brandbank's content network in the UAE (low). 'partial' / 'yes' on PIM, syndication and API refer to the separate NIQ Brandbank product; 'partial' on retail media means monitoring only; 'partial' on alerts means scorecards are stated but alerts are not. |

**Notes**

- **How the three NIQ names relate.** *Data Impact* was a Paris-based e-commerce analytics company bought by NielsenIQ in 2021 [41]; it is now the full product **NIQ Digital Shelf** [34]. **NIQ Brandbank** is a separate NIQ business that captures, manages and syndicates product content to retailers [37]. **NIQ Digital Shelf Lite** is a lighter analytics tool sold inside the Brandbank range as the "measure" step of a "closed loop" from content creation to syndication to measurement [36][37]. The two analytics products quote different coverage figures [34][37].
- The distinctive strength is the link to NIQ's own sales and market-share measurement, so shelf changes can be tied to sales [34]. This matters most if the brand already buys NIQ retail measurement in the same countries (not checked here).
- In the UAE, the evidence found is for Brandbank's content network (elGrocer, Spinneys, Deliveroo, Sharjah Co-op) [38], not for analytics coverage of Amazon.ae or Noon.

### 4. DataWeave

| Dimension | Findings |
|---|---|
| **Owner / head office** | Independent (founded 2011 by Karthik Bettadapura and Vikranth Ramanolla) [54]. Head office: Described as 'Seattle-based' in a 2024 media mention reproduced on the vendor's press page [55]; founders' background and events are in Bengaluru, India [54]. Registered head office: Not found. |
| **Typical customer** | Consumer brands and retailers [45][54]. Named users include Bush Brothers & Company and Pernod Ricard South Africa (brands) [45]; pricing-intelligence customers are retailers. Mid-market to enterprise (inferred from named customers; not stated). |
| **Corporate changes since 2023** | No acquisition, rebrand or ownership change found. Product launches: Data Collection API (blog dated 2 September 2025) [58]; AVA 'AI Visibility Analytics' and a 'Commerce data for AI' licensing offer are on the current site (launch dates not found) [46][51]. |
| **Core functionality** | Digital Shelf Analytics for brands: pricing and availability, share of search and retail-media monitoring, content audit and optimisation, ratings and reviews analysis [45]. Also pricing intelligence and assortment analytics for retailers, AVA (AI-assistant visibility), a self-serve Data Collection API and licensed data feeds (product graph, price, availability, search visibility) [46][51][52]. |
| **Data collection** | Web crawling of sites, mobile apps, D2C sites and marketplaces, down to region, ZIP code or store level [45]; AI product matching with human-in-the-loop verification ('Veracite'), anomaly detection and a data-statistics dashboard [47]; 'LLMs, computer vision, and human-in-the-loop review' [46]. No retailer-API or panel data is claimed. |
| **Marketplace coverage** | Vendor states '1,500+ sites in 50+ countries, plus any you add' and 70M+ SKUs tracked daily (company-reported) [46]. Named in vendor material: Amazon, Walmart, Home Depot, Lowe's, Staples (US analyses) [55]; Amazon India, Flipkart, Myntra (2025) [56]; BigBasket, Blinkit, Dmart, Jiomart, Swiggy, Flipkart Grocery (2022, dated) [57]; UK and Germany Black Friday 2025 analyses [59]. |
| **Evidence for our nine markets** | UAE: **not found** — No UAE retailer named. Sources can be added on request ('plus any you add') [46].<br>Saudi Arabia: **not found** — No evidence found.<br>South Africa: **confirmed** — Testimonial from the Head of Ecommerce, South Africa, Pernod Ricard (three years' use of availability and share-of-search modules on 'online marketplaces'); retailers not named [45].<br>United States: **confirmed** — US retailers named in press analyses (Amazon, Walmart, Home Depot, Lowe's, Staples) [55].<br>United Kingdom: **vendor claims** — Vendor blog lists a 'Black Friday 2025 UK' analysis; retailers not captured [59].<br>India: **confirmed** — Amazon India, Flipkart, Myntra tracked (128,000 SKUs, 2025) [56]; grocery and quick-commerce apps in 2022 (dated) [57].<br>Kenya: **not found** — No evidence found.<br>Nigeria: **not found** — No evidence found.<br>Malaysia: **not found** — No evidence found. |
| **Content intelligence** | Content audit checks adherence to brand guidelines, detects retailer-initiated content changes, and assesses 'text accuracy, image quality, orientation and packaging alignment to retailer guidelines'; benchmarks against competitors; AI recommends and drafts titles, descriptions and bullets [48]. |
| **Listing quality scores** | Own measures: a content-health percentage (a customer cites moving 'from 51% to 76%') [45] and an 'AI Readiness Score' per SKU in AVA [51]. Ingestion of official retailer scores: Not found. |
| **Ratings and reviews** | Tracks rating counts, averages and star breakdown; NLP categorises reviews 'by tone and intent'; sentiment heat maps; competitor benchmarks; alerts for products with low or no recent feedback [49]. |
| **Competitor intelligence** | Competitor prices, promotions and availability; organic vs sponsored share of search and share of retail media; competitor bestsellers and keywords; content benchmarking; closest-competitor SKU pairing in AVA [45][48][50][51]. |
| **Automation** | MAP-violation alerts, ranking alerts, anomaly alerts, scorecards and trend charts [45][47][50]; scheduled or real-time crawls through the API [52]. |
| **AI capabilities** | AI product matching and attribute extraction (CLIP, BERT, LLM embeddings), NLP sentiment analysis, GenAI content and keyword optimisation, 'AI Agents for Retail' [53]; AVA scores AI-assistant visibility across ChatGPT, Gemini, Alexa and Sparky [51]. Launch dates: Not found. |
| **Integrations** | Automated delivery to AWS S3, Snowflake and Google Cloud; custom export formats; API [52]. PIM, DAM or retail-media integrations: Not found. |
| **Pricing** | Quote-based (no public price list). Third-party estimate: Not found. |
| **Limitations** | No public pricing. No Middle East, wider Africa or South-East Asia retailer named; new sources are added on request, which implies onboarding work [46]. No sales or market-share estimates and no content syndication are described. Third-party review sites (G2, TrustRadius, SourceForge) refused automated access, so no user-reported limitations were collected. |
| **Confidence in this profile** | Medium. Capabilities come from vendor product pages (high). India and South Africa evidence is vendor-published; other target markets unproven. 'yes' on image analysis means image-quality and packaging checks using computer vision, not conversion scoring; 'partial' on retail media means monitoring share of media only. |

**Notes**

- Sells both a finished application and the underlying data: licensed feeds and a self-serve Data Collection API with delivery to S3, Snowflake or Google Cloud [46][52]. That makes it a candidate for a "buy the data, build the intelligence layer" approach.
- The only one of the five with vendor-published evidence in India (Amazon India, Flipkart, Myntra, grocery and quick-commerce apps) and a named customer in South Africa [45][56][57].
- Coverage is extended on request ("plus any you add") [46]; ask how long a new retailer such as Noon, Takealot or Jumia takes and what it costs.
- Caution on wording: a DataWeave blog about a "GCC roundtable" refers to Global Capability Centres in Bengaluru, not to the Gulf, so it is not evidence of Gulf coverage.

### 5. Stackline

| Dimension | Findings |
|---|---|
| **Owner / head office** | Independent (founded 2014) [69]. Head office: Seattle, Washington, USA (920 5th Avenue) [69]. |
| **Typical customer** | Consumer brands selling through Amazon, Walmart, Target and similar retailers; vendor states 7,000 consumer brands supported and 250 staff (company-reported) [69]. Quoted customers include Kichler Lighting, Deoleo, Spin Master and King Arthur [61][62][67]. |
| **Corporate changes since 2023** | No acquisition or ownership change found. Product: Multi-Retailer Attribution launched with Amazon (18 November 2024); 'Presentations' AI reporting assistant (21 July 2025); AI Visibility (5 January 2026) with Google Gemini data added (14 October 2026); Advisor 'Templates and Schedules' (26 May 2026) [72]. |
| **Core functionality** | Atlas - market and competitor intelligence: sales, market share, traffic and search across retailers [61]. Beacon - the brand's own sales, operations and advertising analytics with 52-week SKU forecasts, scenario planning, recommendations and attribution [62]. Advisor - conversational AI over the data [68]. Shopper OS / Shopper Analytics - shopper panel, audiences, surveys, review campaigns [64][71]. Ad Manager - retail media. Modules also cover content, SEO, AI visibility, pricing and promotions [60][63][65][66][67]. |
| **Data collection** | Vendor describes proprietary 'first-party behavioral data from real shoppers' and '$10b first-party receipt values' (shopper panel and receipts) [71]; market data on '1.2 billion products measured daily' with a '97% accuracy rate per product' (company-reported) [61]; the brand's own retailer data in Beacon [62]; reviews ingested from Amazon, Walmart, Target and others [64]. The collection method for market data (crawl vs panel vs model) is not spelled out. |
| **Marketplace coverage** | '26 countries in the Atlas network' (not listed) [61]. Retailers named: Amazon, Walmart, Target, Instacart, Home Depot, Costco, Chewy, Best Buy [61][62][64][67]. Review publishing network: 15 retailers [64]. |
| **Evidence for our nine markets** | UAE: **not found** — The 26 Atlas countries are not listed [61].<br>Saudi Arabia: **not found** — No evidence found.<br>South Africa: **not found** — No evidence found.<br>United States: **confirmed** — US retailers named throughout (Amazon, Walmart, Target, Costco, Home Depot) [61][67].<br>United Kingdom: **not found** — Not named on pages retrieved; may be among the 26 unlisted countries [61].<br>India: **not found** — No evidence found.<br>Kenya: **not found** — No evidence found.<br>Nigeria: **not found** — No evidence found.<br>Malaysia: **not found** — No evidence found. |
| **Content intelligence** | Content analytics evaluates each title, description, image and video for 'utilization and completeness' against industry benchmarks, with recommendations; AI generates titles, bullets and descriptions for Amazon, Walmart and Target; content can be tested with shopper surveys [63]. |
| **Listing quality scores** | Own content utilisation / completeness evaluation against benchmarks [63]. Ingestion of official retailer scores: Not found. |
| **Ratings and reviews** | Review campaigns that request reviews from verified buyers (Amazon, Walmart, Chewy, Best Buy), an AI review-writing assistant for shoppers, review publishing to 15 retailers, and review analytics in which AI models classify themes and sentiment [64]. |
| **Competitor intelligence** | Competitor sales and market share (weekly), traffic and keyword-level search, share of voice, pricing and promotions, MAP compliance and Buy Box winners [61][66][67]. |
| **Automation** | Growth recommendations with predicted sales impact; AI-automated content creation and ad campaigns [62]; Advisor templates and scheduled outputs, AI-built presentations [72]. |
| **AI capabilities** | Advisor conversational AI [68] (Presentations 21 July 2025; Templates and Schedules 26 May 2026) [72]; AI Visibility measuring shopping questions on ChatGPT, Amazon Alexa / Rufus and Google Gemini (5 January 2026) [65][72]; AI content generation [63]; AI forecasting [62]; AI review analytics [64]. |
| **Integrations** | API and data platforms for technology partners; Amazon (Multi-Retailer Attribution, Amazon Marketing Cloud); SPINS [70]. PIM, DAM or BI connectors: Not found. |
| **Pricing** | Quote-based (no public price list). Third-party estimate: Not found. |
| **Limitations** | No public price list (the site's 'Pricing' page describes price-analytics features) [67]. Named retailers are US-centric and the 26 countries are not listed, so fit for our non-US markets is unproven [61]. The source of market data is not described in detail. Third-party review sites refused automated access, so no user-reported limitations were collected. |
| **Confidence in this profile** | Medium. Module descriptions come from vendor pages (high); country coverage and data-collection methods are thinly documented (low). 'partial' on availability: in-stock rates are covered for the brand's own catalogue, competitor availability monitoring is not evidenced; 'partial' on content compliance: completeness scoring against benchmarks rather than checks against a brand's master content. |

**Notes**

- Broadest product range of the five: market share, the brand's own analytics and forecasting, retail media, a shopper panel with surveys, review generation, and AI visibility tracking [60][61][62][64][65][71].
- Everything named is US-centred (Amazon, Walmart, Target, Costco, Home Depot) and the "26 countries" are not listed [61][67]. Treat fit for the Gulf, Africa, India and Malaysia as unproven until the vendor supplies a list.
- The reviews module is unusual: it does not only analyse reviews, it runs campaigns to collect and publish them (15 retailers) [64].

## Part 2 — Shorter profiles (eight further platforms)

Chosen for evidence of coverage in the Middle East, Africa, India or South-East Asia (Paxcom, 42Signals, MetricsCart, Pacvue) or for a distinctive capability: retail media at scale (Flywheel, Pacvue), image analytics (Vizit), panel-based demand data (Similarweb) and Amazon seller tooling with public prices (Helium 10).

### 6. Paxcom (Paxcom Commerce Engine, formerly Kinator)

| Dimension | Findings |
|---|---|
| **Owner / head office** | Not confirmed. The site footer lists 'Paymentus' next to 'Paxcom' under 'About Us' and the contact addresses include Charlotte NC and Richmond Hill, Canada [73][75] (UNVERIFIED: Paxcom is a Paymentus group company). Head office: Not stated. Offices listed: Gurugram, Mohali and Bengaluru (India), Charlotte NC (USA), Richmond Hill (Canada) [75]. |
| **Typical customer** | Vendor states '100+ global brands' and 'from Fortune-500 companies to fast-growing brands' (company-reported) [73][74]. India-centred examples (Amazon India, Flipkart, Blinkit, rupee budgets) [73][76]. |
| **Corporate changes since 2023** | Repositioned from a digital-shelf tool to 'the autonomous operating system for global brands': AI agents in 2023 and 'five AI engines' in 2025; the digital-shelf product Kinator was renamed Paxcom Commerce Engine [74][75]. No ownership change found. |
| **Core functionality** | Paxcom Commerce Engine (digital-shelf intelligence: pricing, availability, visibility, promotions, content health, competitor moves, review sentiment); Autopilot (automated media bidding); Predictive (demand forecasting and pricing); Gen-C (generative content and AI-search optimisation); Autonomous Marketplace Solution (revenue recovery); an AI agent marketplace [73][75][76]. |
| **Data collection** | Monitoring of marketplaces, quick-commerce apps and 'dark-store level locations Pan India'; vendor states 1.75M data points per hour and anomaly detection within 7 minutes (company-reported) [75]. Platform-provided sales and advertising data consolidated in dashboards (legacy page) [77]. |
| **Marketplace coverage** | '250+ platforms tracked' (company-reported) [75]; regions named: India, South-East Asia, the Middle East, the UK and the US [74]. A legacy Kinator page lists Amazon, Walmart, Flipkart, Lazada, Shopee, Souq, Nykaa, BigBasket, Tesco, Noon, JD, Myntra, Purplle, 1MG, Jiomart, Blibli, Tiki, Carrefour, Fair Price, Coles and others (probably dated) [77]. |
| **Evidence for our nine markets** | UAE: **vendor claims** — 'Middle East' named as a region [74]; legacy page lists Noon, Souq and Carrefour without naming countries (probably dated) [77].<br>Saudi Arabia: **vendor claims** — 'Middle East' region and Noon listed; Saudi Arabia not named [74][77].<br>South Africa: **not found** — No evidence found.<br>United States: **confirmed** — US named as a region; US section of the website; Amazon and Walmart listed; US office [73][74][75][77].<br>United Kingdom: **confirmed** — UK named as a region; UK section of the website; Tesco listed [73][74][77].<br>India: **confirmed** — Amazon India, Flipkart, Blinkit, Nykaa, Purplle, BigBasket; quick-commerce and dark-store tracking 'Pan India' [73][75][76][77].<br>Kenya: **not found** — No evidence found.<br>Nigeria: **not found** — No evidence found.<br>Malaysia: **vendor claims** — 'Southeast Asia' named; legacy page lists Lazada and Shopee without naming Malaysia [74][77]. |
| **Content intelligence** | 'Automated scanning of product titles, images, bullets, and A+ content across every listing for brand compliance violations with alerts and correction queues' [75]. |
| **Listing quality scores** | Own 'content health' measure [75]. Ingestion of official retailer scores: Not found. |
| **Ratings and reviews** | 'Customer Sentiment Intelligence' on reviews and ratings [75]; legacy page: reviews consolidated across platforms with aspect-level positive / negative analysis and competitor comparison [77]. |
| **Competitor intelligence** | Competitor out-of-stock and price moves, search share of shelf (top 3 / 10 / 20), Amazon bestseller rank, seller-level pricing and Buy Box [75][77]. |
| **Automation** | Anomaly detection that can trigger 'pre-approved advertising and pricing responses' automatically; alerts and correction queues; automated dispute filing; human-in-the-loop approvals [73][75][76]. |
| **AI capabilities** | AI agents (2023) and five AI engines (2025) [74]; Gen-C generates titles, bullets, A+ content and descriptions in several languages and optimises for ChatGPT, Perplexity and Google AI Overviews [76]. |
| **Integrations** | Not found on pages retrieved (advertising on Amazon, Flipkart and Blinkit is managed through the Autopilot engine [76]). |
| **Pricing** | Quote-based (no public price list). Third-party estimate: Not found. |
| **Limitations** | No public pricing. The most specific retailer list is on a legacy page that still names Souq and Grofers, so current coverage outside India needs confirming [77]. Present-day examples are India-centred [73][76]. Integrations and API are not documented publicly. No independent reviews were retrieved. |
| **Confidence in this profile** | Medium. Current capabilities come from vendor pages; the retailer list for the Middle East and South-East Asia comes from an older page. 'partial' on sales/share means consolidation of platform-provided sales data, not market estimates; 'partial' on syndication reflects a homepage example of the Gen-C engine publishing descriptions. |

**Notes**

- Deepest India evidence of any vendor reviewed, including quick commerce at dark-store level and beauty retailers Nykaa and Purplle [75][77].
- The list that names Noon, Lazada and Shopee is on an older page [77]; confirm it still holds.

### 7. 42Signals (PromptCloud)

| Dimension | Findings |
|---|---|
| **Owner / head office** | PromptCloud Technologies Pvt Ltd - 42Signals is described as 'a subsidiary of PromptCloud', a web-data acquisition company [80][81]. Head office: Not stated on pages retrieved (operating company: PromptCloud Technologies Pvt Ltd) [80]. |
| **Typical customer** | Vendor states it suits 'e-commerce businesses of all sizes' and D2C brands; plans manage 'up to 200 SKUs' [80]. Small and mid-market leaning (inferred from the SKU cap and budget bands). |
| **Corporate changes since 2023** | Not found. |
| **Core functionality** | Digital shelf analytics (availability, pricing and MAP violations, seller intelligence, share of search, keyword rank, ad tracking, competitor and category benchmarking) and Voice of Customer analytics (review sentiment) [78][80][83]. |
| **Data collection** | Web crawling by the parent's data-acquisition infrastructure, including JavaScript-heavy sites and anti-bot handling; refresh 'measured in hours'; custom crawls on request [78][79][81]. |
| **Marketplace coverage** | Vendor states 250+ platforms in 50+ countries (company-reported) [79]. Named: US - Amazon, Target, Walmart, Sephora, Instacart, DoorDash; India - Flipkart, Amazon, Nykaa, Blinkit, Swiggy Instamart, Zepto; UAE - Noon, Amazon, Sephora, Nykaa; UK / Europe - Boots, Sephora [78]; Middle East & Africa - 'Noon, Souq (via Amazon), Jumia, and Takealot'; Asia-Pacific - Flipkart, JD.com, Shopee, Rakuten [79]. |
| **Evidence for our nine markets** | UAE: **confirmed** — 'UAE Platforms': Noon, Amazon, Sephora, Nykaa [78]; dedicated Noon page (prices, availability, promotions, 'Noon Minutes') [82].<br>Saudi Arabia: **confirmed** — Coverage table lists 'Saudi Arabia - noon.com'; Noon page covers UAE vs KSA pricing [79][82].<br>South Africa: **vendor claims** — Takealot named under 'Middle East & Africa'; South Africa not named [79].<br>United States: **confirmed** — Amazon, Target, Walmart, Sephora, Instacart, DoorDash [78].<br>United Kingdom: **confirmed** — boots.com (United Kingdom) and Tesco named [78][79].<br>India: **confirmed** — Flipkart, Amazon, Nykaa; quick commerce Blinkit, Swiggy Instamart, Zepto [78].<br>Kenya: **vendor claims** — Jumia named under 'Middle East & Africa'; Kenya not named [79].<br>Nigeria: **vendor claims** — Jumia named under 'Middle East & Africa'; Nigeria not named [79].<br>Malaysia: **vendor claims** — Shopee and 'Southeast Asia' named; Malaysia not named [79]. |
| **Content intelligence** | 'Product content and image accuracy' is listed among core metrics [83]; no dedicated content-audit module was found. The Noon page mentions optimising listing quality and monitoring Arabic search keywords [82]. |
| **Listing quality scores** | Not found. |
| **Ratings and reviews** | Voice of Customer analytics: consumer sentiment analysis, positive and negative product aspects, competitor comparison, review data from several platforms [80]. |
| **Competitor intelligence** | Competitor prices and promotions, category benchmarking, brand comparison, share of search, seller intelligence and unauthorised sellers [80][83]. |
| **Automation** | Alerts by Slack, email and SMS; MAP and seller alerts come with screenshot evidence; real-time alerts and shareable reports [78][83]. |
| **AI capabilities** | Only a general statement of 'AI and ML integration' [80]; no named AI feature or launch date found. |
| **Integrations** | 'API and S3 delivery'; data 'can typically be exported or connected into existing BI dashboards' [78]. |
| **Pricing** | Quote-based (no public price list). No price list ('Get a quote'). The vendor's enquiry form offers budget bands from 'Less than $500 per month' to 'Above $5000 per month', and a 20% Black Friday discount banner was showing on 2026-11-26 [78][80]. Third-party estimate: Not found. |
| **Limitations** | Documentation: plans 'manage up to 200 SKUs' [80]; no dedicated content-compliance module, no listing-quality score, no sales or share estimates and no content generation were found. Coverage of South Africa, Kenya, Nigeria and Malaysia rests on retailer names in a marketing list, not country pages [79]. No independent reviews were retrieved. |
| **Confidence in this profile** | Medium. The only vendor reviewed that names retailers in all our regions (Noon, Jumia, Takealot, Flipkart, Nykaa, Shopee), but all evidence is vendor marketing. 'partial' on content and image: listed as a metric only; 'partial' on retail media: ad tracking, not ad buying. |

**Notes**

- The only vendor reviewed that publicly names retailers across all our regions, including Noon (UAE and Saudi Arabia), Jumia, Takealot, Flipkart, Nykaa and Shopee, and beauty retailers Sephora and Boots [78][79][82].
- Small-plan orientation (up to 200 SKUs) and a parent company whose business is web-data collection [80][81]; realistic as a data supplier for long-tail retailers rather than as a full enterprise suite.

### 8. MetricsCart

| Dimension | Findings |
|---|---|
| **Owner / head office** | Not found. Head office: Not found on pages retrieved. |
| **Typical customer** | Vendor states it serves 'challenger brands to global enterprises', agencies and research firms, with Beauty & Personal Care among its categories [86]; a Starter plan targets 'lean teams and digitally native brands' [85]. Named users include Goodbaby / Evenflo [84]. |
| **Corporate changes since 2023** | Vendor says the platform was reshaped 'around how teams actually work' in 2024 [86]. No acquisition found. |
| **Core functionality** | Digital shelf analytics, MAP monitoring and enforcement, share of search, ratings and reviews analysis, content compliance / optimisation, pricing intelligence, assortment and availability; free Amazon and Walmart bestseller reports [84]. |
| **Data collection** | Pulls 'live data on your SKUs and your competitors' from Amazon, Walmart, Target, and 150+ retailers' (crawling of live product pages); also user content from YouTube and Reddit for review analysis [87][88]. |
| **Marketplace coverage** | '150+ retailers' (company-reported) [86]. Named: Amazon, Walmart, Target [87]. Amazon bestseller reports are published for the US, UK, Germany, Australia, India, UAE and Saudi Arabia [84][89]. |
| **Evidence for our nine markets** | UAE: **confirmed** — Amazon UAE bestseller reports (Amazon only) [84][89].<br>Saudi Arabia: **confirmed** — Amazon KSA bestseller reports (Amazon only) [84].<br>South Africa: **not found** — No evidence found.<br>United States: **confirmed** — Amazon, Walmart, Target [84][87].<br>United Kingdom: **confirmed** — Amazon UK bestseller reports [84].<br>India: **confirmed** — Amazon India bestseller reports [84]. A quick-commerce launch for India appeared only in a search-result summary [126].<br>Kenya: **not found** — No evidence found.<br>Nigeria: **not found** — No evidence found.<br>Malaysia: **not found** — No evidence found. |
| **Content intelligence** | Audits every product page 'against retailer rules and your category's top performers': titles, bullets, descriptions, images, A+ content and attributes; image audit covers main-image rules, background, size and image count; alerts when A+ content drops or live content drifts from approved copy; an 'AI shelf readiness' check [87]. |
| **Listing quality scores** | Own 'content scorecards' that 'check each PDP against retailer style guides, image regulations, your brand rules and your category benchmark' [87]. Ingestion of official retailer scores: Not found. |
| **Ratings and reviews** | Continuous review collection across '150+ retailers & marketplaces'; AI groups reviews into themes and sub-themes, scores aspect-level sentiment and tracks NPS; competitor reviews; alerts and exports [88]. |
| **Competitor intelligence** | Competitor prices and MAP, share of search, competitor content benchmarks and reviews, bestseller rankings [84][87][88]. |
| **Automation** | Real-time alerts on content, MAP and review issues; custom reports and dashboards with an audit trail [87][88]. |
| **AI capabilities** | AI review theme and sentiment analysis [88]; AI-shelf / answer-engine readiness checks [87]. No named assistant or launch date found. |
| **Integrations** | Exports are mentioned by customers [84]. API, PIM or BI integrations: Not found. |
| **Pricing** | Public price list. Starter 'starts at $300/month' (up to 50 SKUs, 3 data sources, 1 module); Enterprise 'per module pricing starts at $1000/month'; usage-based, 'No Annual Contracts', 'Cancel Anytime' [85]. Third-party: Capterra lists a starting price of $300, usage based, per month (third-party listing, consistent with the vendor page) [90]. |
| **Limitations** | Evidence for the UAE, Saudi Arabia and India is Amazon-only [84][89]; no local marketplaces (Noon, Flipkart, Nykaa) named on pages retrieved. Capterra reviews (6 reviews): setup takes time, reports could offer more options, data 'sometimes takes a little while to update', and review insights depend on review volume [90]. No sales or share estimates, retail media or syndication described. |
| **Confidence in this profile** | Medium. One of only two vendors reviewed with a public price list. 'partial' on image analysis means rule-based image compliance checks; 'partial' on API/export means exports only. |

**Notes**

- Useful price benchmark: a published entry price of $300/month and $1,000/month per module for enterprise, with no annual contract [85].
- Its content scorecards are the clearest public description of scoring pages against each retailer's style guide plus brand rules [87] — a model for what an in-house content score could look like.

### 9. Flywheel (Flywheel Commerce Cloud)

| Dimension | Findings |
|---|---|
| **Owner / head office** | Omnicom - 'Omnicom Commerce runs on Flywheel' [96] (UNVERIFIED: acquired from Ascential, completed in early 2024). Head office: Not found on pages retrieved (11 offices, staff in 20+ countries) [95]. |
| **Typical customer** | Large brands; vendor describes products 'purpose-built for the world's leading brands' and has 2,000+ employees (company-reported) [91][95]. Software is sold alongside managed services and consulting [91]. |
| **Corporate changes since 2023** | Now the commerce platform of Omnicom [96]. Acquisition date not confirmed from a source retrieved in this session (UNVERIFIED: early 2024). |
| **Core functionality** | Flywheel Commerce Cloud: Retail Media (search, display and video, measurement); Retail Operations (AI content optimisation, Walmart rich media, fee recovery, catalogue classification, retail analytics); Market Intelligence (market share, plus digital-shelf metrics - share of voice, availability, search insights, content compliance, price monitoring, ratings and reviews - and Retail Insights forecasts) [91][92][93]. |
| **Data collection** | Not described in detail. Retail-media and first-party retailer data through platform connections [94]; market share at 'weekly, item-level granularity' (method not stated) [92]. |
| **Marketplace coverage** | '400+ marketplaces' and 'one login ... across +100 global retailer platforms and marketplaces' for campaigns (company-reported) [91][94]; Retail Insights covers 'thousands of global retailers, 200 markets' for forecasts [92]. Named: Amazon, Walmart [91][93][94]. No country list retrieved. |
| **Evidence for our nine markets** | UAE: **not found** — No country or retailer list retrieved.<br>Saudi Arabia: **not found** — No country or retailer list retrieved.<br>South Africa: **not found** — No evidence found.<br>United States: **confirmed** — Walmart.com rich media and Amazon tooling [93][94].<br>United Kingdom: **not found** — No country or retailer list retrieved.<br>India: **not found** — No evidence found.<br>Kenya: **not found** — No evidence found.<br>Nigeria: **not found** — No evidence found.<br>Malaysia: **not found** — No evidence found. |
| **Content intelligence** | Content compliance against 'each platform's best practices or to your Trusted Source content' [92]; generative AI recommendations for titles, descriptions and bullets; a rich-media builder for Walmart pages [93]. |
| **Listing quality scores** | Works with Walmart 'Content Quality Scores' (rich media to improve them; a Content Quality Score audit is offered as a service) [93]. Whether official scores are ingested as data: Not found. |
| **Ratings and reviews** | Ratings and reviews listed as a Market Intelligence module [92]; sentiment analysis: Not found. |
| **Competitor intelligence** | Market share and third-party seller dynamics, share of voice (organic and paid), price monitoring, competitor top sellers [92]. |
| **Automation** | Automated ad bidding (rule-based, intraday, goal-based 'powered by Perpetua') [94]; automated fee-recovery disputes; rules-based catalogue classification [93]. |
| **AI capabilities** | 'AI-powered content recommendations' using generative AI for titles, descriptions and bullets [93]. No named assistant or launch date found. |
| **Integrations** | Retailer ad platforms and Amazon Marketing Cloud [91][94]. PIM, DAM, API or BI integrations: Not found. |
| **Pricing** | Quote-based (no public price list). Third-party estimate: Not found. |
| **Limitations** | Little public detail on digital-shelf coverage, data collection or integrations; no country list. Strongly tied to retail media and managed services [91]. Acquisition history could not be verified in this session. No independent reviews were retrieved. |
| **Confidence in this profile** | Low. Public pages are high-level. 'partial' on official scores: Walmart Content Quality Score is referenced but ingestion is not stated; 'partial' on syndication: a Walmart rich-media builder and a content-syndication support service. |

**Notes**

- Best understood as Omnicom's retail-media and commerce services platform with digital-shelf modules attached [91][96]. Most relevant if the brand's media agency sits within Omnicom.

### 10. Pacvue

| Dimension | Findings |
|---|---|
| **Owner / head office** | Not found on pages retrieved. Pacvue's about page describes Helium 10 as its SMB product line [102]. Head office: Not stated; offices listed in Seattle, New York City, London and Shanghai [102]. |
| **Typical customer** | Brands and agencies. Vendor states 70,000+ brands and agencies, $12B+ annual ad spend managed and use by 5 of the 5 largest media agencies (company-reported) [102]. |
| **Corporate changes since 2023** | Rahul Choraria became CEO in 2024 [102]. Positioned as the 'AI-Powered Commerce Media OS'; Pacvue Agent introduced (date not found) [97][101]. Ownership changes: Not found. |
| **Core functionality** | Retail-media activation and automation across 100+ retailers; measurement and incrementality; digital shelf optimisation (content, pricing, availability, ratings, Buy Box); market and competitive insights; revenue recovery; data-as-a-service [97][98][99][100][104]. |
| **Data collection** | 'Direct API connections' to retailers and retail-media networks for content, pricing, availability, ratings and Buy Box data [98][99]; Amazon market insights 'built on 600M+ product data points and nearly a decade of historical tracking' [100]. |
| **Marketplace coverage** | 100+ retailers and partners in 30+ countries (company-reported) [98][102]. Named: Amazon, Walmart, Target, TikTok, Tesco, Carrefour, Instacart, CitrusAd, Criteo, Kroger, Sam's Club, bol, eBay; UK - Amazon UK, Tesco, ASDA, TikTok Shop UK; Asia - Amazon Japan, Amazon Singapore, TikTok Shop (including Malaysia), Shopee and Lazada 'where applicable'; Middle East - Amazon UAE, Amazon Saudi Arabia; 'Africa coverage is more limited today' [98]. |
| **Evidence for our nine markets** | UAE: **confirmed** — 'Amazon UAE' listed under Middle East coverage for retail media and marketplace operations [98].<br>Saudi Arabia: **confirmed** — 'Amazon Saudi Arabia' listed for retail media and marketplace operations [98]; customer story on Amazon Ads for Mars in KSA (May 2025) [103].<br>South Africa: **not found** — Vendor states 'Africa coverage is more limited today' [98].<br>United States: **confirmed** — Amazon, Walmart, Target, Kroger, Instacart and others [98].<br>United Kingdom: **confirmed** — Amazon UK, Tesco, ASDA, TikTok Shop UK [98].<br>India: **not found** — India is not in the Asia list retrieved [98].<br>Kenya: **not found** — Vendor states 'Africa coverage is more limited today' [98].<br>Nigeria: **not found** — Vendor states 'Africa coverage is more limited today' [98].<br>Malaysia: **vendor claims** — TikTok Shop Malaysia named in a rollout list; Shopee 'in select regions' and Lazada 'where applicable' [98]. |
| **Content intelligence** | Tracks 'content quality', content gaps that limit conversion, and alerts when products 'fall out of compliance' [99]. Detail of the audit method: Not found. |
| **Listing quality scores** | Not found. |
| **Ratings and reviews** | Tracks ratings and review trends; ads can be paused when ratings fall below thresholds [99]. Sentiment analysis: Not found. |
| **Competitor intelligence** | Competitor pricing, promotions and in-stock status, share of voice, keyword and ASIN benchmarking [99][100]. |
| **Automation** | Rule-based and AI bid and budget automation; ads adjusted or paused when inventory, Buy Box or ratings change; alerts and workflows [98][99]. |
| **AI capabilities** | Pacvue Agent - 'an AI-powered super agent' that explains performance changes and recommends bid and budget actions (launch date not found) [101]. |
| **Integrations** | API integrations with 100+ retailers and networks; Amazon DSP and Amazon Marketing Cloud; data-as-a-service delivery into the client's infrastructure [97][98][104]. Profitero lists Pacvue as a bid-management partner [9]. |
| **Pricing** | Quote-based (no public price list). Third-party estimate: Not found. |
| **Limitations** | Primarily an advertising platform: digital-shelf features exist to steer media rather than to audit content in depth [99]. Vendor itself says 'Africa coverage is more limited today'; Shopee and Lazada support is hedged; India not listed [98]. No public pricing. No independent reviews were retrieved. |
| **Confidence in this profile** | Medium. Coverage statements come from a vendor FAQ updated November 2026. 'partial' on sales/share means Amazon market insights only; 'partial' on content means monitoring without a documented audit method. |

**Notes**

- A retail-media platform first. It already integrates with Profitero's digital-shelf signals [9], which shows the usual pattern: shelf data from one vendor, ad execution from another.
- Evidence of Amazon advertising in Saudi Arabia [103]. The vendor's own FAQ says Africa coverage is limited [98].

### 11. Vizit

| Dimension | Findings |
|---|---|
| **Owner / head office** | Not found. Head office: Not found on pages retrieved. |
| **Typical customer** | Large consumer-goods companies; the site links to Colgate-Palmolive, L'Oreal, Mars, Mondelez and Nestle and cites 'the world's largest beauty company' in a case result [105]. |
| **Corporate changes since 2023** | Relaunched as 'the agentic platform for content optimization' ('Vizit Next Gen') [105][106]. Ownership changes: Not found. |
| **Core functionality** | Scores product images and product pages for predicted conversion ('Vizit Score' against a 'Content Conversion Standard'), diagnoses weak hero and carousel images, researches winning creative patterns by category, generates improved images ('Vizit Spark') and reports impact [105][106]. |
| **Data collection** | Client uploads or catalogue scans of images and product pages; AI model 'trained on ... what shoppers actually bought - across 20+ countries and every major retailer' (100M+ images, company-reported) [105]. How live product pages are collected: Not found. |
| **Marketplace coverage** | Not retailer-specific. '20+ countries' refers to training data; countries are not listed [105]. |
| **Evidence for our nine markets** | UAE: **not found** — Tool scores content rather than crawling retailers; no country list [105].<br>Saudi Arabia: **not found** — No country list [105].<br>South Africa: **not found** — No country list [105].<br>United States: **not found** — No country list [105].<br>United Kingdom: **not found** — No country list [105].<br>India: **not found** — No country list [105].<br>Kenya: **not found** — No country list [105].<br>Nigeria: **not found** — No country list [105].<br>Malaysia: **not found** — No country list [105]. |
| **Content intelligence** | Image and page-level conversion scoring, hero-image checks for mobile and 'AI shopping agent readiness', carousel analysis and recommended content mix (pack shots, lifestyle, benefits, ingredients) [105][106]. No checking of text against retailer rules is described. |
| **Listing quality scores** | Own 'Vizit Score' (0-100 style score for images and pages) [105][106]. Ingestion of official retailer scores: Not found. |
| **Ratings and reviews** | Not found. |
| **Competitor intelligence** | Category creative research - 'see which competitor visuals win with your audience' [105][106]. No price, search or availability tracking described. |
| **Automation** | Catalogue-wide scoring, ranked optimisation plans and always-on reporting [106]. |
| **AI capabilities** | Computer-vision scoring model; 'Vizit Spark' generative image engine; 'Vizit Agents' that score, diagnose and fix content (launch dates not found) [105][106]. |
| **Integrations** | API ('put visual intelligence in every system and workflow via API'); output described as 'ready-to-syndicate assets' [105][106]. Named PIM / DAM connectors: Not found. |
| **Pricing** | Quote-based (no public price list). Third-party estimate: Not found. |
| **Limitations** | A specialist tool: no price, availability, search or review monitoring is described, so it complements rather than replaces a digital-shelf platform. Country and retailer coverage are not listed. Performance figures on the site are company-reported. No independent reviews were retrieved. |
| **Confidence in this profile** | Medium. Only two vendor pages were available; 'unknown' here means the capability is not mentioned and is probably outside the product's scope. 'partial' on content audit means conversion scoring of pages, not rule compliance. |

**Notes**

- The one vendor whose core product is image analysis: it predicts how well an image or page will convert and generates better variants [105][106]. Relevant to beauty, where imagery carries much of the selling. It would sit alongside, not replace, a monitoring platform.

### 12. Similarweb Retail Intelligence (formerly Shopper Intelligence)

| Dimension | Findings |
|---|---|
| **Owner / head office** | Similarweb. Head office: Offices listed include Givatayim, Israel and New York, USA [110]. |
| **Typical customer** | Brands and retailers - e-commerce, commercial, marketing and insights teams [107]. Similarweb states 10,000 customers company-wide (company-reported) [110]. |
| **Corporate changes since 2023** | The product is now called Retail Intelligence (the old 'shopper' URL redirects) and has added digital-shelf monitoring, price intelligence, AI agents and MCP delivery [107][108][110]. Dates: Not found. |
| **Core functionality** | Cross-retail analysis, digital shelf and pricing intelligence (availability, price and promotions, content gaps, retail media, reviews, rankings, Buy Box), consumer analytics (cross-shopping, baskets, loyalty), category management and marketplace optimisation; weekly ASIN-level Amazon sales, views and conversion estimates [107][108][109]. |
| **Data collection** | 'Behavioral panel signals' and a 'mix of digital signals obtained from a variety of unique sources' [110]; vendor contrasts this with tools 'that rely only on scraped shelf data', combining shelf monitoring with shopper demand data [108]. |
| **Marketplace coverage** | '650+ retailers' (company-reported) [107]. Amazon analytics covers 'Amazon marketplaces in the US, Canada, UK, Germany, France, and Italy', plus sites such as Walmart, eBay, Target and Best Buy [110]. Named elsewhere: Tesco, Currys [107]. |
| **Evidence for our nine markets** | UAE: **not found** — Amazon.ae is not among the six Amazon marketplaces listed [110].<br>Saudi Arabia: **not found** — Not among the Amazon marketplaces listed [110].<br>South Africa: **not found** — No evidence found.<br>United States: **confirmed** — Amazon US, Walmart, eBay, Target, Best Buy [110].<br>United Kingdom: **confirmed** — Amazon UK; Tesco and Currys named [107][110].<br>India: **not found** — Amazon.in is not among the Amazon marketplaces listed [110].<br>Kenya: **not found** — No evidence found.<br>Nigeria: **not found** — No evidence found.<br>Malaysia: **not found** — No evidence found. |
| **Content intelligence** | 'Spot product data gaps and inconsistencies' on product pages [108]. No rule-based compliance audit described. |
| **Listing quality scores** | Not found. |
| **Ratings and reviews** | Monitors ratings and review trends and uses 'AI to analyze sentiment and group feedback themes' [108]. |
| **Competitor intelligence** | Competitor sales, traffic sources, keywords, price and promotions, rankings, Buy Box (1P vs 3P) and cross-shopping behaviour [107][108][109]. |
| **Automation** | Custom dashboards and automated reporting; 'urgency-ranked actions' on pricing [107]. |
| **AI capabilities** | AI sentiment and theme analysis of reviews [108]; 'Amazon AI Keyword Agent'; AI Studio; MCP for AI workflows [110]. Launch dates: Not found. |
| **Integrations** | REST and batch APIs (can be bought stand-alone), MCP, managed-service dashboards [110]. PIM or DAM: Not found. |
| **Pricing** | Quote-based (no public price list). Custom quote ('Talk to sales') based on data scope; a free plan / trial covers Amazon data for select categories [110]. (Similarweb's separate Web Intelligence product lists plans 'from $125/mo' - not the retail product [111].) Third-party estimate: Not found. |
| **Limitations** | Documentation: Amazon analytics is limited to six marketplaces (US, Canada, UK, Germany, France, Italy), none of them in the Middle East, Africa, India or South-East Asia [110]. Sales figures are estimates from panel and other signals. Content checks are light. No independent reviews were retrieved. |
| **Confidence in this profile** | Medium. Distinctive for demand-side (panel) data rather than shelf crawling. 'partial' on retail media means tracking competitors' activity; 'partial' on alerts means dashboards and automated reporting are stated but alerts are not. |

**Notes**

- Different data from the rest: shopper behaviour from a panel and other digital signals, used to estimate demand, traffic and Amazon sales [108][110]. Its Amazon coverage stops at six Western marketplaces [110], so it does not help in the Gulf, Africa, India or Malaysia today.

### 13. Helium 10

| Dimension | Findings |
|---|---|
| **Owner / head office** | Pacvue - its about page refers to 'Pacvue's enterprise suite and Helium 10's SMB solutions' [102]. Head office: Not found on pages retrieved. |
| **Typical customer** | Amazon, Walmart and TikTok Shop sellers, from new sellers to brands and agencies; plans are banded by yearly sales ($0-100K, $100K-10M, above $10M) [112][113]. Vendor states 860K+ active Chrome-extension users (company-reported) [113]. |
| **Corporate changes since 2023** | Added an AI agent ('Helium Agent') and an MCP connector to external AI tools [113][114]. Dates and ownership changes: Not found. |
| **Core functionality** | Product research (Black Box, Xray), keyword research and rank tracking (Cerebro, Magnet, Keyword Tracker), listing tools (Listing Analyzer, AI Listing Builder), operations (profits, inventory, refunds, review requests, alerts on listing changes), competitor tracking (Market Tracker), advertising (Helium 10 Ads) [112][113]. |
| **Data collection** | The seller's own marketplace account data plus Helium 10's proprietary marketplace datasets [112][114]. Collection methods: Not found. |
| **Marketplace coverage** | '24+ marketplaces supported'; examples given: 'US, CA, UK, DE, JP, AU, and more' across Amazon, Walmart and TikTok Shop [113][114]. The per-market list sits in a knowledge-base article that refused automated access. |
| **Evidence for our nine markets** | UAE: **not found** — Per-market tool list could not be read (knowledge base refused automated access).<br>Saudi Arabia: **not found** — Per-market tool list could not be read.<br>South Africa: **not found** — Per-market tool list could not be read.<br>United States: **confirmed** — US named; Amazon, Walmart, TikTok Shop [112][114].<br>United Kingdom: **confirmed** — UK named among marketplaces [114].<br>India: **not found** — Per-market tool list could not be read.<br>Kenya: **not found** — No evidence found.<br>Nigeria: **not found** — No evidence found.<br>Malaysia: **not found** — No evidence found. |
| **Content intelligence** | Listing Analyzer scores an existing listing; Listing Builder creates AI-generated listings; a converter exports Amazon listings to TikTok [112][113]. |
| **Listing quality scores** | Own listing score in Listing Analyzer ('Score Your Existing Product Listing') [112]. Ingestion of official retailer scores: Not found. |
| **Ratings and reviews** | Review requests and monitoring ('Seller Assistant') and 'analytical insights derived from real customer reviews' [112][113]. |
| **Competitor intelligence** | Competitor keywords, product research and competitor performance tracking (Market Tracker) on Amazon [112]. |
| **Automation** | Alerts on listing changes, automated review-request and email sequences, managed refund service [112]. |
| **AI capabilities** | Helium Agent ('AI commerce agent'), Helium 10 MCP (connects its data to Claude, ChatGPT or a custom agent), AI Listing Builder (launch dates not found) [112][113][114]. |
| **Integrations** | MCP connector (Diamond plan includes up to 1,000 calls) [113][114]. PIM, DAM or BI integrations: Not found. |
| **Pricing** | Public price list. Platinum $129/month billed monthly or $99/month billed yearly; Diamond $359/month or $279/month billed yearly; Enterprise from $1,499/month billed annually ('starting price'); a limited free plan exists [113]. Third-party estimate: Not found. |
| **Limitations** | Built for individual marketplace seller accounts (Amazon, Walmart, TikTok Shop), not for cross-retailer brand monitoring. Support for Amazon.ae, Amazon.sa and Amazon.in could not be confirmed because the per-market list was inaccessible. No independent reviews were retrieved. |
| **Confidence in this profile** | Medium. Included as the Amazon-seller-tool benchmark with a public price list. 'partial' values: inventory management for own stock only; a listing score rather than a compliance audit; review insights without stated sentiment AI; listing conversion to TikTok; product-level competitor tracking rather than market-share estimates; MCP connector rather than a documented data API. |

**Notes**

- Included as the reference point for Amazon seller tools with public prices [113]. It works per seller account and marketplace; it is not a cross-retailer brand monitor. Whether Amazon.ae, Amazon.sa and Amazon.in are supported could not be read from the vendor's knowledge base.

## Other candidates checked (not profiled)

| Candidate | Status on 2026-11-26 | What it is, in the vendor's words | Why not profiled |
|---|---|---|---|
| Intelligence Node | Operating. "Acquired by Interpublic (NYSE: IPG) in December 2024 and now part of Omnicom" [115] | "Unifies market, product, assortment, and content signals into real-time competitor price monitoring" [115] | Price and assortment intelligence aimed mainly at retailers; now a sister company of Flywheel inside Omnicom [96][115] |
| Wiser Solutions | Operating [116] | "Real-time price monitoring, category intelligence and MAP visibility"; "trusted by 300+ brands and retailers" (company-reported) [116] | Price / MAP focus; no evidence for our regions on the page retrieved |
| PriceSpider | **Rebranded as Wayvia** — pricespider.com redirects to wayvia.com; "Wayvia, formerly PriceSpider" [117][118] | Shoppable media (where-to-buy), commerce data and retail intelligence, including PROWL MAP monitoring and price, stock and content tracking [117][119] | Where-to-buy and MAP enforcement focus |
| Brandquad | Operating [120] | "AI-driven product experience management" — manage product data, syndicate it, analyse the shelf [120] | Primarily a product-information (PIM) and syndication tool |
| Jungle Scout (Cobalt) | Operating [121] | Amazon sales estimates and category benchmarking (Cobalt), "Jungle Scout Agents" and an MCP connector; "600M+ products tracked" (company-reported). The "Data Cloud" name was not seen on the current homepage [121] | Amazon-only; Helium 10 used as the seller-tool example because its prices are public |
| SmartScout | Operating [122] | Amazon brand, seller, keyword and advertising data; the homepage (served in Chinese to this session) says it is based on daily-updated US data [122] | US Amazon only |
| Keepa | Operating [123] | "Amazon price history charts, price drop alerts, price watches, daily drops and browser extensions" [123] | Single-purpose Amazon price tracker; the site needs a browser to read further |
| Digital Commerce Intelligence (DCI) | **Could not be verified.** Its web address could not be looked up without search; the two domains guessed (dci.ai and digitalcommerceintelligence.com) show a parked-domain redirect, and dci.ai leads to a "for sale" page [124] | — | UNVERIFIED whether the company still operates or uses another domain; it was a candidate specifically for Middle East coverage, so this is a gap |
| Detail Online | **Could not be reached** (no response from detailonline.com in this session) | — | UNVERIFIED |

## Cross-cutting observations

These are the analyst's reading of the evidence above, not vendor statements.

### Capability matrix

Y = yes, P = partial, N = relies on partners, ? = not mentioned on the pages retrieved. Columns: price and promotion monitoring; availability; content compliance audit; search rank / share of search; ratings and reviews collection; AI review sentiment; official retailer score ingestion; image or visual analysis; AI content generation; PIM; DAM; syndication to retailers; retail media; sales / share estimates; alerts and scheduled reports; API or data export.

| Platform | Price | Avail. | Content | Search | Reviews | Sentiment | Official score | Image | AI copy | PIM | DAM | Syndic. | Ads | Sales/share | Alerts | API/export |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Profitero+ | Y | Y | Y | Y | Y | P | Y | P | Y | N | N | P | P | P | Y | Y |
| CommerceIQ | Y | Y | Y | Y | Y | ? | ? | P | Y | N | ? | Y | Y | P | Y | P |
| NIQ Digital Shelf | Y | Y | Y | Y | Y | Y | ? | P | ? | P | ? | Y | P | Y | P | P |
| DataWeave | Y | Y | Y | Y | Y | Y | ? | Y | Y | ? | ? | ? | P | ? | Y | Y |
| Stackline | Y | P | P | Y | Y | Y | ? | P | Y | ? | ? | ? | Y | Y | Y | Y |
| Paxcom | Y | Y | Y | Y | Y | Y | ? | P | Y | ? | ? | P | Y | P | Y | ? |
| 42Signals | Y | Y | P | Y | Y | Y | ? | P | ? | ? | ? | ? | P | ? | Y | Y |
| MetricsCart | Y | Y | Y | Y | Y | Y | ? | P | ? | ? | ? | ? | ? | ? | Y | P |
| Flywheel | Y | Y | Y | Y | Y | ? | P | ? | Y | ? | ? | P | Y | Y | ? | ? |
| Pacvue | Y | Y | P | Y | Y | ? | ? | ? | ? | ? | ? | ? | Y | P | Y | Y |
| Vizit | ? | ? | P | ? | ? | ? | ? | Y | Y | ? | ? | ? | ? | ? | P | Y |
| Similarweb Retail Intelligence | Y | Y | P | Y | Y | Y | ? | ? | ? | ? | ? | ? | P | Y | P | Y |
| Helium 10 | ? | P | P | Y | Y | P | ? | ? | Y | ? | ? | P | Y | P | Y | P |

### What this category does well

1. **Daily monitoring at scale.** The four largest platforms each claim more than a thousand retailers or sites (Profitero+ 1,400+, CommerceIQ 1,450+, NIQ 1,000+, DataWeave 1,500+ sites; all company-reported) [1][24][34][46]. Price, availability, search position, content and reviews are covered by nearly every vendor (see matrix).
2. **Matching the same product across retailers.** NIQ matches listings to a barcode-based reference with human validation [34]; DataWeave uses AI matching checked by people [47]. This is unglamorous work that makes cross-retailer comparison possible.
3. **Turning shelf signals into action on Amazon and in retail media.** Examples: automatic content correction and case filing on Amazon (Profitero+ Autopilot, CommerceIQ Copilot) [5][23]; ad bids that react to stock, price or Buy Box changes (Profitero+, CommerceIQ, Pacvue) [6][19][22][99].
4. **Amazon sales and share estimates.** Offered by Profitero+, Stackline, NIQ, Similarweb and Jungle Scout [3][34][61][109][121].
5. **Generative AI has become standard.** Most vendors now offer AI copy generation (see matrix), a chat assistant (Ask Profitero 2023, AllyAI 2025, Stackline Advisor, Pacvue Agent, Helium Agent) [14][27][68][101][112] and, in 2025–2026, "AI visibility" tools that track whether AI shopping assistants recommend a product (Stackline, DataWeave, CommerceIQ) [21][51][65].

### What is commonly missing

1. **Provable coverage of the Middle East, Africa and South-East Asia.** None of the five required vendors publishes a retailer list by country, and none names Noon, Takealot, Jumia, Shopee or Lazada on the pages retrieved. Only 42Signals names all of these [79]; Paxcom names Noon, Lazada and Shopee on an older page [77]; MetricsCart and Pacvue evidence Amazon UAE and Amazon Saudi Arabia only [84][98]. Similarweb's Amazon analytics stops at six Western marketplaces [110]. Pacvue states that "Africa coverage is more limited today" [98]. For Kenya and Nigeria nothing was confirmed.
2. **India is covered mainly by India-rooted vendors.** Flipkart, Nykaa and the quick-commerce apps are named by DataWeave, Paxcom and 42Signals [56][57][77][78], not by the global leaders.
3. **Official retailer quality scores.** The only evidenced case is Walmart's Content Quality Score (Profitero+ uses Walmart API data; Flywheel works on the score) [12][93]. No vendor page describes ingesting an official score from Amazon, Noon, Flipkart, Takealot or any retailer in our other markets. Every other "content score" found is the vendor's own.
4. **Beauty-specific needs.** No page retrieved describes beauty-specific checks such as shade and variant mapping, ingredient or claims compliance, regulatory wording, or right-to-left and bilingual (Arabic / English) content checks. What exists is indirect: beauty retailers are tracked by 42Signals (Sephora, Nykaa, Boots) and Paxcom (Nykaa, Purplle) [77][78]; 42Signals mentions Arabic search keywords on Noon [82]; MetricsCart lists Beauty & Personal Care as a category and describes "need-based attributes" such as "for sensitive skin" [86][87]; Vizit cites a beauty case for image scoring [105].
5. **Image analysis beyond rule checks.** Most vendors only check image count, size or compliance (marked P in the matrix). Only Vizit scores images for likely conversion [105][106].
6. **Sales and share estimates outside Amazon in the US and Europe.** No vendor page describes sales estimates for Noon, Takealot, Jumia, Flipkart, Shopee or Lazada.
7. **Product master data and syndication.** Digital-shelf vendors mostly rely on partners such as Salsify, Syndigo and Stibo [9][20][26]; NIQ is the exception through Brandbank [37].
8. **Price transparency.** Only MetricsCart and Helium 10 publish prices [85][113]. Enterprise pricing is by quote, and the one third-party figure found (CommerceIQ on Capterra) has an implausible unit [32].

### What looks hard to replicate in-house, and what looks easy

| Harder to build (leans towards buying or licensing) | Why |
|---|---|
| Reliable collection from many retailers, apps and locations | Needs constant upkeep against site changes and bot defences, and store- or dark-store-level collection; vendors present this as core expertise [45][75][79] |
| Cross-retailer product matching | Vendors combine AI with human checking and a reference catalogue [34][47] |
| Sales and market-share estimates | Depend on data we cannot crawl: shopper panels and receipts (Stackline, Similarweb), calibration against retailer data (Profitero+), or NIQ's retail measurement [3][34][71][110] |
| Official retailer data links | Come from partnerships and account-level integrations (Walmart API, Amazon Vendor Central, 100+ retail-media APIs) [7][12][98] |
| Benchmarks trained on outcomes | For example image scoring trained on purchase data [105] |
| History | Years of past prices, ranks and share cannot be recreated later [46][100] |

| Easier to build (leans towards building) | Why |
|---|---|
| Checking our own listings against our own master content | We hold the master content; several vendors do exactly this comparison [5][20][87] |
| A rule-based content score per retailer | MetricsCart describes the recipe openly: retailer style guide + image rules + brand rules + category benchmark [87] |
| Alerts, scorecards and scheduled reports | Standard features in nearly every tool reviewed (see matrix) |
| AI copy drafting and review summarising | Now offered by most vendors (see matrix), which suggests general-purpose language models are sufficient |
| A chat assistant over our own data | Same reasoning; Helium 10, Similarweb and Jungle Scout already expose their data to outside AI tools through MCP connectors [110][114][121] |
| Beauty-specific and Arabic-language rules | No vendor page retrieved describes them, so this is where an in-house engine would be differentiated |

### What this suggests

The public evidence points towards a mixed approach rather than a single purchase: (a) no one vendor demonstrably covers all nine countries; (b) the hardest part to build — dependable data collection for regional retailers — can be bought as data from vendors that sell feeds or APIs (DataWeave, 42Signals, Pacvue's data service) [46][52][78][104]; and (c) the parts where the brand's needs are unusual — beauty rules, Arabic content, its own scoring — were not found in any vendor's public material. This is an inference from marketing material and must be tested with vendor demos and written coverage lists before any decision.

### Questions to put to every shortlisted vendor

1. A written list of retailers tracked in each of our nine countries, with refresh frequency and whether app-only and location-level data are included.
2. Which official retailer scores or account-level data they ingest, retailer by retailer.
3. Whether data can be taken out by API or bulk feed, with history, for use in our own engine — and at what price without managed services.
4. Arabic-language handling for search terms, content checks and review analysis.
5. Minimum contract value, term, SKU and retailer limits.

## Limitations and gaps in this research

- **Search allowance ran out.** Only 19 web searches could be run. The remaining work relied on reading vendor sites directly, so discovery of alternative vendors was limited and no analyst reports (IDC, Gartner, Forrester) were read. The IDC MarketScape result is cited only as the vendor reports it [16].
- **Review sites were mostly unreadable.** G2, Gartner Peer Insights, TrustRadius and SourceForge refused automated access. User-reported limitations therefore come only from Capterra (Profitero+, CommerceIQ, MetricsCart) and from one search-result summary of G2 (CommerceIQ) [18][32][33][90]. The Profitero+ reviews quoted are from 2021–2022.
- **Other pages that refused access:** Business Wire press releases, Omnicom press releases, the Helium 10 knowledge base (per-country marketplace list) and the old e.fundamentals domains.
- **Pricing is thin.** No Vendr, AWS Marketplace or Azure Marketplace listings were found or checked for most vendors. Enterprise price levels remain unknown.
- **Coverage "not found" is not "not covered".** The large vendors may well track retailers in our markets; they simply do not publish lists. This can only be settled by asking them.
- **Vendor claims are unaudited.** Retailer counts, accuracy percentages and performance uplifts are company-reported. Nothing was tested in a live product.
- **Not verified:** whether Digital Commerce Intelligence (DCI) and Detail Online still operate; the date Omnicom acquired Flywheel; Profitero's and several smaller vendors' head-office locations; Paxcom's relationship with Paymentus.
- **Dates.** Many vendor product pages are undated; launch dates are given only where a dated announcement was found.
- **Similarweb and Stackline** do not explain in public detail how shelf and market data are collected, so their "data collection" entries are incomplete.

## Sources

All accessed 2026-11-26. "n.d." = no publication date shown on the page. Entries marked "search-result summary only" were seen as web-search results; the page itself could not be opened.

1. https://www.profitero.com/ — *eCommerce data, technology & services | Profitero+*. Profitero+ (Publicis Groupe). Published/updated: n.d. (footer (c) 2026); accessed 2026-11-26.
2. https://www.profitero.com/product/digital-shelf — *Digital Shelf Analytics & eCommerce Insights | Profitero+*. Profitero+. Published/updated: n.d.; accessed 2026-11-26.
3. https://www.profitero.com/product/sales-share — *Amazon Sales & Market Share Analytics | Profitero+*. Profitero+. Published/updated: n.d.; accessed 2026-11-26.
4. https://www.profitero.com/product/content-optimizer — *Smarter keywords, scoring and genAI with Content Optimizer | Profitero+*. Profitero+. Published/updated: n.d.; accessed 2026-11-26.
5. https://www.profitero.com/product/autopilot — *Automate Amazon Operations with Autopilot | Profitero+*. Profitero+. Published/updated: n.d.; accessed 2026-11-26.
6. https://www.profitero.com/product/shelf-intelligent-media — *Smarter Bidding with Shelf Intelligent Media | Profitero+*. Profitero+. Published/updated: n.d.; accessed 2026-11-26.
7. https://www.profitero.com/product/avh — *AMZ Vendor Health Report | Profitero+*. Profitero+. Published/updated: n.d.; accessed 2026-11-26.
8. https://www.profitero.com/product/store-based-analytics — *Store-Based Analytics | Profitero+*. Profitero+. Published/updated: n.d.; accessed 2026-11-26.
9. https://www.profitero.com/open-commerce-ecosystem — *Open Commerce Ecosystem | Profitero+*. Profitero+. Published/updated: n.d.; accessed 2026-11-26.
10. https://www.profitero.com/our-story — *Profitero+ | Our story*. Profitero+. Published/updated: n.d.; accessed 2026-11-26.
11. https://www.profitero.com/solutions/ai — *AI Commerce Solutions | Profitero+*. Profitero+. Published/updated: n.d.; accessed 2026-11-26.
12. https://www.profitero.com/solutions/walmart — *Walmart Solutions | Profitero+*. Profitero+. Published/updated: n.d.; accessed 2026-11-26.
13. https://www.profitero.com/blog/profitero-mars-united-unveil-profitero-plus — *Profitero and Mars United Unveil Profitero+*. Profitero+ (blog). Published/updated: 2025-05-20; accessed 2026-11-26. — **dated (borderline, just over 18 months)**
14. https://www.profitero.com/blog/ask-profitero-commerce-ai-assistant — *Ask Profitero: Chat-Based AI Assistant Integrated with Commerce Analytics*. Profitero+ (blog). Published/updated: 2023-08-18; accessed 2026-11-26. — **dated**
15. https://www.profitero.com/press — *Press (list of news items and press releases)*. Profitero+. Published/updated: n.d. (items dated 2022-2024); accessed 2026-11-26.
16. https://www.profitero.com/blog/profitero-named-a-leader-position-in-idc-marketscape-for-digital-shelf-analytics — *Profitero+ Named a Digital Shelf Leader*. Profitero+ (blog). Published/updated: 2025-10-15; accessed 2026-11-26.
17. https://www.profitero.com/lp/retailer-capability-snapshots — *Retailer Capability Snapshots*. Profitero+. Published/updated: n.d.; accessed 2026-11-26.
18. https://www.capterra.com/p/198301/Profitero/ — *Profitero+ Software Pricing, Alternatives & More 2026*. Capterra. Published/updated: n.d. (page titled 2026; quoted user reviews dated 2021-2022); accessed 2026-11-26. — **third-party listing; quoted reviews are dated**
19. https://www.commerceiq.ai/ — *Optimize Brand Visibility in AI Search & Retail Media | CommerceIQ*. CommerceIQ. Published/updated: n.d.; accessed 2026-11-26.
20. https://www.commerceiq.ai/digital-shelf-analytics — *Digital Shelf Analytics Platform for Ecommerce Growth*. CommerceIQ. Published/updated: n.d.; accessed 2026-11-26.
21. https://www.commerceiq.ai/content-optimization — *AI Ecommerce Content Optimization Platform | CommerceIQ*. CommerceIQ. Published/updated: n.d.; accessed 2026-11-26.
22. https://www.commerceiq.ai/retail-media-management — *Retail Media Management Platform for Ecommerce Growth*. CommerceIQ. Published/updated: n.d.; accessed 2026-11-26.
23. https://www.commerceiq.ai/copilot-for-amazon — *Copilot for Amazon to Drive Revenue Growth with AI*. CommerceIQ. Published/updated: n.d.; accessed 2026-11-26.
24. https://www.commerceiq.ai/about-us — *About CommerceIQ: AI Platform for Ecommerce Growth*. CommerceIQ. Published/updated: n.d.; accessed 2026-11-26.
25. https://www.commerceiq.ai/retailer — *CommerceIQ Retailers | Global Network of Ecommerce Partners*. CommerceIQ. Published/updated: n.d.; accessed 2026-11-26.
26. https://www.commerceiq.ai/press-news — *CommerceIQ in the News | Retail AI & Digital Commerce*. CommerceIQ. Published/updated: n.d.; accessed 2026-11-26.
27. https://www.commerceiq.ai/press-releases/industrys-first-suite-of-agentic-ai-teammates — *CommerceIQ Announces Industry's First Suite of Agentic AI Teammates to Drive E-Commerce Sales and Profit Impact*. CommerceIQ (press release). Published/updated: 2025-05-21; accessed 2026-11-26. — **dated (borderline, just over 18 months)**
28. https://www.commerceiq.ai/press-releases/retail-ai-agents-for-brands-to-outperform-the-competition — *CommerceIQ Unveils Suite of Retail AI Agents for Brands to Outperform the Competition*. CommerceIQ (press release). Published/updated: 2026-03-03; accessed 2026-11-26.
29. https://www.commerceiq.ai/press-releases/commerceiq-names-rahul-shah-ceo-to-lead-next-phase-of-growth — *CommerceIQ Names Rahul Shah CEO to Lead Next Phase of Growth*. CommerceIQ (press release). Published/updated: 2026-09-01; accessed 2026-11-26.
30. https://www.commerceiq.ai/blog/e-fundamentals-becomes-a-commerceiq-company — *e.fundamentals becomes a CommerceIQ company*. CommerceIQ (blog). Published/updated: 2022-09-26; accessed 2026-11-26. — **dated**
31. https://www.commerceiq.ai/blog/commerceiq-launches-global-retail-ecommerce-management-platform-with-efundamentals-acquisition — *CommerceIQ Launches Global Retail ecommerce Management Platform*. CommerceIQ (blog reproducing press release of 2022-07-19). Published/updated: 2022-09-27; accessed 2026-11-26. — **dated**
32. https://www.capterra.com/p/10017506/CommerceIQ/ — *CommerceIQ Software Pricing, Alternatives & More 2026*. Capterra. Published/updated: n.d. (page titled 2026); accessed 2026-11-26. — **third-party listing**
33. https://www.g2.com/products/commerceiq/reviews?page=2 — *CommerceIQ Reviews*. G2. Published/updated: n.d.; accessed 2026-11-26. — **search-result summary only; the G2 page itself refused automated access (HTTP 403)**
34. https://nielseniq.com/global/en/products/digital-shelf/ — *NIQ Digital Shelf: Elevate Your E-Commerce Strategy*. NIQ (NielsenIQ). Published/updated: published 2024-12-12; updated 2026-09-07; accessed 2026-11-26.
35. https://nielseniq.com/global/en/solutions/analytics-and-activation/data-impact-by-nielseniq/ — *Data Impact by NielsenIQ - NIQ*. NIQ (NielsenIQ). Published/updated: updated 2026-06-04; accessed 2026-11-26.
36. https://nielseniq.com/global/en/products/digital-shelf-lite/ — *NIQ Digital Shelf Lite*. NIQ Brandbank. Published/updated: updated 2026-08-11; accessed 2026-11-26.
37. https://nielseniq.com/global/en/landing-page/brandbank/ — *Product Content Management Solutions | NIQ Brandbank - NIQ*. NIQ Brandbank. Published/updated: updated 2026-07-13; accessed 2026-11-26.
38. https://nielseniq.com/global/en/news-center/2024/niq-brandbank-expands-its-reach-with-new-retailers-in-uae/ — *NIQ Brandbank expands its reach with new retailers in UAE*. NIQ (press release). Published/updated: 2024-06-11; accessed 2026-11-26. — **dated**
39. https://nielseniq.com/global/en/news-center/2023/niq-brandbank-expands-to-united-arab-emirates-and-philippines/ — *NIQ Brandbank expands to United Arab Emirates and Philippines*. NIQ (press release). Published/updated: 2023-05-25; accessed 2026-11-26. — **dated**
40. https://nielseniq.com/global/en/events/2025/nielseniq-digital-advisory-council-uae-2025/ — *NielsenIQ Digital Advisory Council, UAE 2025 - NIQ*. NIQ (event page). Published/updated: event date 2025-05-06; accessed 2026-11-26. — **dated (borderline, just over 18 months)**
41. https://www.research-live.com/article/news/nielseniq-acquires-data-impact-and-rakuten-intelligence/id/5089842 — *NielsenIQ acquires Data Impact and Rakuten Intelligence*. Research Live (Market Research Society). Published/updated: 2021-09-30; accessed 2026-11-26. — **dated**
42. https://www.renaissancecapital.com/IPO-Center/News/112326/consumer-intelligence-provider-niq-global-intelligence-prices-ipo-at-21 — *Consumer intelligence provider NIQ Global Intelligence prices IPO at $21, within the range*. Renaissance Capital. Published/updated: 2025-07-23; accessed 2026-11-26.
43. https://nielseniq.com/global/en/about-us/ — *About us - The Full View - NIQ*. NIQ (NielsenIQ). Published/updated: n.d.; accessed 2026-11-26.
44. https://www.salsify.com/press-release-niq-brandbank-connector — *Salsify press release: NIQ Brandbank connector*. Salsify. Published/updated: 2023-11 (per search-result summary); accessed 2026-11-26. — **dated; search-result summary only, page not fetched**
45. https://dataweave.com/us/digital-shelf-analytics — *Digital Shelf Analytics*. DataWeave. Published/updated: n.d.; accessed 2026-11-26.
46. https://dataweave.com/us/commerce-data-for-ai — *Commerce Web Data for AI Agents and Teams | DataWeave*. DataWeave. Published/updated: n.d.; accessed 2026-11-26.
47. https://dataweave.com/us/accuracy-and-coverage — *Accuracy and Coverage*. DataWeave. Published/updated: n.d.; accessed 2026-11-26.
48. https://dataweave.com/us/dsa-content-audit — *Digital Shelf Content Audit*. DataWeave. Published/updated: n.d.; accessed 2026-11-26.
49. https://dataweave.com/us/dsa-ratings-reviews — *Digital Shelf Ratings & Reviews*. DataWeave. Published/updated: n.d.; accessed 2026-11-26.
50. https://dataweave.com/us/dsa-share-of-search-media — *Digital Shelf Share of Search & Retail Media*. DataWeave. Published/updated: n.d.; accessed 2026-11-26.
51. https://dataweave.com/us/ai-visibility-analytics-ava — *AVA - AI Visibility Analytics for Brands*. DataWeave. Published/updated: n.d.; accessed 2026-11-26.
52. https://dataweave.com/us/data-collection-api — *Data Collection API*. DataWeave. Published/updated: n.d.; accessed 2026-11-26.
53. https://dataweave.com/us/ai-innovation — *The AI Edge at DataWeave*. DataWeave. Published/updated: n.d.; accessed 2026-11-26.
54. https://dataweave.com/us/about-us — *Data Analytics for Retailers & Brands | Contact Us (About us)*. DataWeave. Published/updated: n.d.; accessed 2026-11-26.
55. https://dataweave.com/us/press-room — *Press & Media | DataWeave*. DataWeave. Published/updated: n.d. (items dated 2024-2025); accessed 2026-11-26.
56. https://dataweave.com/blog/indias-black-friday-2025-decoded-discount-analysis-and-brand-performance-across-major-e-commerce-platforms — *India's Black Friday 2025 Decoded: Discount Analysis and Brand Performance Across Major E-commerce Platforms*. DataWeave (blog). Published/updated: 2025-12-19; accessed 2026-11-26.
57. https://dataweave.com/blog/insights-from-the-digital-shelf-of-indian-fmcg-brands — *Insights from the Digital Shelf of Indian FMCG Brands*. DataWeave (blog). Published/updated: 2022-11-29; accessed 2026-11-26. — **dated**
58. https://dataweave.com/blog/fueling-agentic-commerce-introducing-the-dataweave-data-collection-api — *Fueling Agentic Commerce: Introducing DataWeave's Data Collection API*. DataWeave (blog). Published/updated: 2025-09-02; accessed 2026-11-26.
59. https://dataweave.com/blog — *The DataWeave Blog (index)*. DataWeave. Published/updated: n.d.; accessed 2026-11-26.
60. https://www.stackline.com/ — *Stackline - Retail Growth Platform*. Stackline. Published/updated: n.d.; accessed 2026-11-26.
61. https://www.stackline.com/atlas — *Atlas*. Stackline. Published/updated: n.d.; accessed 2026-11-26.
62. https://www.stackline.com/beacon — *Beacon*. Stackline. Published/updated: n.d.; accessed 2026-11-26.
63. https://www.stackline.com/content — *Content*. Stackline. Published/updated: n.d.; accessed 2026-11-26.
64. https://www.stackline.com/reviews — *Reviews*. Stackline. Published/updated: n.d.; accessed 2026-11-26.
65. https://www.stackline.com/aeo — *AEO*. Stackline. Published/updated: n.d.; accessed 2026-11-26.
66. https://www.stackline.com/seo — *SEO*. Stackline. Published/updated: n.d.; accessed 2026-11-26.
67. https://www.stackline.com/pricing — *Pricing (a product-feature page about price analytics, not a price list)*. Stackline. Published/updated: n.d.; accessed 2026-11-26.
68. https://www.stackline.com/advisor — *Advisor*. Stackline. Published/updated: n.d.; accessed 2026-11-26.
69. https://www.stackline.com/about — *About*. Stackline. Published/updated: n.d.; accessed 2026-11-26.
70. https://www.stackline.com/partners — *Partners*. Stackline. Published/updated: n.d.; accessed 2026-11-26.
71. https://www.stackline.com/shopper-analytics — *Shopper Analytics*. Stackline. Published/updated: n.d.; accessed 2026-11-26.
72. https://www.stackline.com/blog-categories/announcements — *Announcements | Stackline*. Stackline. Published/updated: n.d. (items dated 2023-10 to 2026-10); accessed 2026-11-26.
73. https://paxcom.ai/ — *Home - Paxcom*. Paxcom. Published/updated: n.d.; accessed 2026-11-26.
74. https://paxcom.ai/about-us/ — *About Us - Paxcom*. Paxcom. Published/updated: n.d.; accessed 2026-11-26.
75. https://paxcom.ai/digital-shelf-analytics/ — *Paxcom Commerce Engine - Paxcom*. Paxcom. Published/updated: n.d.; accessed 2026-11-26.
76. https://paxcom.ai/services/ — *Services - Paxcom*. Paxcom. Published/updated: n.d.; accessed 2026-11-26.
77. https://paxcom.ai/sg/channel-intelligence/ — *AI-Powered Digital shelf Monitoring & Intelligence | Paxcom (legacy Kinator page)*. Paxcom. Published/updated: n.d. (names Souq and Grofers, so probably dated); accessed 2026-11-26. — **probably dated**
78. https://www.42signals.com/ — *Digital Shelf Monitoring for North American Brands (homepage, redirects to /na/)*. 42Signals (PromptCloud). Published/updated: n.d.; accessed 2026-11-26.
79. https://www.42signals.com/platforms-we-crawl/ — *Global Data Coverage by 42Signals: 250+ Platforms in 50+ Countries*. 42Signals (PromptCloud). Published/updated: n.d.; accessed 2026-11-26.
80. https://www.42signals.com/pricing-plan/ — *Pricing Plans - 42Signals*. 42Signals (PromptCloud). Published/updated: n.d.; accessed 2026-11-26.
81. https://www.42signals.com/about/ — *42Signals - Your Partner in eCommerce Data Excellence*. 42Signals (PromptCloud). Published/updated: n.d.; accessed 2026-11-26.
82. https://www.42signals.com/use-case/noon-data/ — *Win in the UAE: Track Noon Prices, Availability & Promotions | 42Signals*. 42Signals (PromptCloud). Published/updated: n.d.; accessed 2026-11-26.
83. https://www.42signals.com/digital-shelf-analytics/ — *Digital Shelf Analytics: Optimize Pricing & Track Competitors*. 42Signals (PromptCloud). Published/updated: n.d.; accessed 2026-11-26.
84. https://metricscart.com/ — *MetricsCart | Digital Commerce Intelligence for Consumer Brands*. MetricsCart. Published/updated: n.d.; accessed 2026-11-26.
85. https://metricscart.com/pricing/ — *MetricsCart Pricing - Digital Shelf Analytics Plans from $300/month*. MetricsCart. Published/updated: published 2026-03-31; updated 2026-08-29; accessed 2026-11-26.
86. https://metricscart.com/about-us/ — *About Us - MetricsCart*. MetricsCart. Published/updated: n.d.; accessed 2026-11-26.
87. https://metricscart.com/content-compliance/ — *E-Commerce Content Optimization Software | MetricsCart*. MetricsCart. Published/updated: n.d.; accessed 2026-11-26.
88. https://metricscart.com/ratings-reviews/ — *Review Monitoring Software for Consumer Brands | MetricsCart*. MetricsCart. Published/updated: n.d.; accessed 2026-11-26.
89. https://metricscart.com/bestseller-reports/amazon-uae/brands/ — *Top Brands from Amazon UAE's Bestseller Rankings: Monthly Report*. MetricsCart. Published/updated: n.d. (report for October 2026); accessed 2026-11-26.
90. https://www.capterra.com/p/10018667/MetricsCart/ — *MetricsCart Software Pricing, Alternatives & More 2026*. Capterra. Published/updated: n.d. (page titled 2026); accessed 2026-11-26. — **third-party listing**
91. https://www.flywheeldigital.com/ — *Flywheel | Driving growth in digital commerce*. Flywheel (Omnicom). Published/updated: n.d.; accessed 2026-11-26.
92. https://www.flywheeldigital.com/market-intelligence — *Integrated Market Intelligence Software by Flywheel*. Flywheel (Omnicom). Published/updated: n.d.; accessed 2026-11-26.
93. https://www.flywheeldigital.com/retail-operations — *Retail Operation Solutions by Flywheel*. Flywheel (Omnicom). Published/updated: n.d.; accessed 2026-11-26.
94. https://www.flywheeldigital.com/retail-media — *Retail Media Software | Flywheel*. Flywheel (Omnicom). Published/updated: n.d.; accessed 2026-11-26.
95. https://www.flywheeldigital.com/about-flywheel — *About Flywheel*. Flywheel (Omnicom). Published/updated: n.d.; accessed 2026-11-26.
96. https://www.omc.com/capabilities/capability-commerce/ — *Capability-commerce - Omnicom*. Omnicom. Published/updated: n.d.; accessed 2026-11-26.
97. https://pacvue.com/ — *Pacvue | The AI-Powered Commerce Media OS*. Pacvue. Published/updated: n.d.; accessed 2026-11-26.
98. https://pacvue.com/marketplaces/ — *Manage Retail Media Across 100+ Retailers | Pacvue*. Pacvue. Published/updated: updated 2026-11-06; accessed 2026-11-26.
99. https://pacvue.com/platform/digital-shelf-optimization/ — *Digital Shelf Analytics & Optimization | Pacvue*. Pacvue. Published/updated: n.d.; accessed 2026-11-26.
100. https://pacvue.com/platform/market-competitive-insights/ — *Market & Competitive Intelligence for Commerce Media | Pacvue*. Pacvue. Published/updated: n.d.; accessed 2026-11-26.
101. https://pacvue.com/platform/artificial-intelligence/ — *AI for Retail Media & Commerce Execution | Pacvue*. Pacvue. Published/updated: n.d.; accessed 2026-11-26.
102. https://pacvue.com/about/about-us/ — *About Pacvue | The AI-Powered Commerce Media OS*. Pacvue. Published/updated: n.d.; accessed 2026-11-26.
103. https://pacvue.com/customerstories/wpp-media-drives-155-sales-growth-and-76-roas-increase-for-mars-in-ksa-with-pacvues-automated-rules/ — *WPP Media Drives +155% Sales Growth and +76% ROAS Increase for Mars in KSA with Pacvue's Automated Rules*. Pacvue (customer story). Published/updated: 2025-05-28; accessed 2026-11-26.
104. https://pacvue.com/platform/daas/ — *Retail Data-as-a-Service (DaaS) | Pacvue*. Pacvue. Published/updated: n.d.; accessed 2026-11-26.
105. https://www.vizit.com/ — *Vizit | The Agentic Platform for Content Optimization*. Vizit. Published/updated: n.d.; accessed 2026-11-26.
106. https://www.vizit.com/vizit-next-gen-platform — *The Vizit Platform | The Agentic Platform for Content Optimization*. Vizit. Published/updated: n.d.; accessed 2026-11-26.
107. https://www.similarweb.com/corp/retail/ — *Retail Intelligence Platform for Brands & Retailers | Similarweb (the former /corp/shopper/ URL redirects here)*. Similarweb. Published/updated: n.d.; accessed 2026-11-26.
108. https://www.similarweb.com/corp/retail/digital-shelf-analytics/ — *Digital Shelf Analytics for Brands | Similarweb*. Similarweb. Published/updated: n.d.; accessed 2026-11-26.
109. https://www.similarweb.com/corp/retail/amazon-sales-analytics/ — *Amazon Sales Analytics Tool for Brands | Similarweb*. Similarweb. Published/updated: n.d.; accessed 2026-11-26.
110. https://www.similarweb.com/packages/retail/ — *Retail Intelligence Pricing & Packages | Similarweb*. Similarweb. Published/updated: n.d.; accessed 2026-11-26.
111. https://www.similarweb.com/packages/web/ — *Web Intelligence Pricing & Packages | Similarweb*. Similarweb. Published/updated: n.d.; accessed 2026-11-26.
112. https://www.helium10.com/ — *Amazon, Walmart, and TikTok Shop Seller Tools | Helium 10*. Helium 10 (Pacvue). Published/updated: n.d.; accessed 2026-11-26.
113. https://www.helium10.com/pricing/ — *Plans & Pricing: Platinum, Diamond & Custom | Helium 10*. Helium 10 (Pacvue). Published/updated: updated 2026-11-18; accessed 2026-11-26.
114. https://www.helium10.com/tools/mcp/ — *MCP Landing Page | Helium 10*. Helium 10 (Pacvue). Published/updated: n.d.; accessed 2026-11-26.
115. https://www.intelligencenode.com/ — *Intelligence Node | The Intelligence Layer Powering Agentic Retail*. Intelligence Node (Omnicom). Published/updated: n.d. (footer (c) 2026); accessed 2026-11-26.
116. https://www.wiser.com/ — *Software and Intelligence for Brands and Retailers | Wiser Solutions*. Wiser Solutions. Published/updated: n.d.; accessed 2026-11-26.
117. https://wayvia.com/ — *Commerce Enablement Platform for Enterprise Brands | Wayvia (pricespider.com redirects here)*. Wayvia (formerly PriceSpider). Published/updated: n.d.; accessed 2026-11-26.
118. https://wayvia.com/about-us — *Wayvia | About Us*. Wayvia (formerly PriceSpider). Published/updated: n.d.; accessed 2026-11-26.
119. https://wayvia.com/retail-intelligence — *Retail Intelligence Software for Price, Stock & Digital Shelf | Wayvia*. Wayvia (formerly PriceSpider). Published/updated: n.d.; accessed 2026-11-26.
120. https://brandquad.com/ — *AI-Driven Platform for Product Experience Management | Brandquad*. Brandquad. Published/updated: n.d.; accessed 2026-11-26.
121. https://www.junglescout.com/ — *Jungle Scout | Amazon Data for Brands, Retailers & Financial Services*. Jungle Scout. Published/updated: n.d.; accessed 2026-11-26.
122. https://www.smartscout.com/ — *SmartScout - Amazon Data, Analytics, and Tools for Brands and Amazon Sellers*. SmartScout. Published/updated: n.d.; accessed 2026-11-26.
123. https://keepa.com/ — *Keepa - Amazon Price Tracker*. Keepa. Published/updated: n.d.; accessed 2026-11-26.
124. https://www.dci.ai/ — *(no title; page redirects to a GoDaddy 'for sale' parked-domain lander)*. unknown / domain parked. Published/updated: n.d.; accessed 2026-11-26. — **evidence that this guessed domain is not an operating vendor site**
125. https://www.commerceiq.ai/faqs — *CommerceIQ FAQs*. CommerceIQ. Published/updated: n.d.; accessed 2026-11-26.
126. https://metricscart.com/insights/metricscart-expands-to-quick-commerce-analytics/ — *MetricsCart Expands to Quick Commerce Analytics: Powering the Next Phase of Digital Shelf Intelligence*. MetricsCart. Published/updated: n.d.; accessed 2026-11-26. — **search-result summary only; direct fetch redirected to the insights index**
127. https://www.renaissancecapital.com/Profile/NIQ/NIQ-Global-Intelligence/IPO — *NIQ Global Intelligence IPO profile*. Renaissance Capital. Published/updated: n.d.; accessed 2026-11-26. — **search-result summary only; page not fetched**
