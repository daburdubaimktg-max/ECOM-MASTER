# Appendix B2 — E-commerce platform database: South Africa, Kenya and Nigeria

Research date: 2026-11-26. Region: Sub-Saharan Africa. Prepared for the Brand Intelligence Engine (mass-market hair care, skin care and oral care).

Machine-readable records: `data/research/marketplaces/ZA.json`, `KE.json` and `NG.json`. This appendix explains the rankings, records what was left out and lists every source. Inline numbers such as [1] refer to the Sources list at the end.

## How to read this appendix

**What was done.** Each platform was checked on 2026-11-26 for live trading, audience evidence, presence of the reference brands (Dove, Pantene, L'Oréal Paris, Garnier, Head & Shoulders, Nivea, Vaseline, Colgate, Sensodyne, Himalaya, Dabur, Dark and Lovely, Sunsilk) and legitimate routes to listing and price data. Brand presence was read from each platform's own public pages, including public catalogue-search result URLs, or, where the record says so, from its store page on a delivery platform or from a brand owner's site. Pages were retrieved with plain HTTP requests, a standard fetch tool or a default headless browser. No account was created, no login was used, no personal or company details were entered anywhere, and no CAPTCHA or bot protection was bypassed; where a site refused automated requests, the record says so and the brand check is marked UNVERIFIED. One process note for the audit trail: the first two batches of Semrush requests carried a browser-style User-Agent header; the same pages were then confirmed to load with plain requests, which were used from then on.

**Scoring.** Each platform has five scores from 1 to 5: e-commerce significance (weight 0.20), beauty category relevance (0.25), consumer reach (0.20), brand and competitor coverage (0.15) and data integration feasibility (0.20). The weighted score is the weighted sum, rounded to two decimals. Rank is by weighted score within the country; ties are broken by beauty category relevance, then consumer reach. Where two platforms were still tied, e-commerce significance, then data feasibility, then name were used; this last step is our addition because the rubric stops earlier.

**Three cautions that apply to every table.**

1. Traffic figures are third-party estimates (Semrush and Similarweb), not measurements, and the two providers sometimes differ by a factor of two. They also miss app use, which matters for Checkers Sixty60, Glovo, Chowdeck and Mr D.
2. Verified market shares are scarce. The only regulator-sourced figures found are Glovo's delivery shares in Kenya (cited second-hand, with no study year) and the South African Competition Commission's 2023 finding that Takealot is dominant, which carries no percentage in the coverage retrieved. Every other "share" quoted here is a survey usage share or a company statement and is labelled as such.
3. Platforms whose catalogues could not be read receive a placeholder score for brand coverage (neutral at best, and marked UNVERIFIED) and a low score for data feasibility. This pushes closed platforms (Clicks, Dis-Chem, Checkers Sixty60, Jiji, Konga) down the ranking for reasons of access, not of commercial weight. The rationale in each record flags where that matters.

---

## South Africa

### Landscape

South Africa is the largest and best-documented market of the three. World Wide Worx estimates online retail at about R130 billion in 2025 and forecasts about R159 billion in 2026, the first full year in which online reaches roughly 10% of national retail turnover [1][2]. In the same report's consumer research, Takealot is used by 35.3% of online shoppers, Shein by 21.5%, Checkers Sixty60 by 15% and Amazon by 12.7%; these are usage shares from a survey, not sales shares [1]. The Competition Commission's 2023 inquiry found that Takealot holds "a dominant share of overall online sales", but the coverage retrieved gives no percentage and the finding is now more than three years old [3].

Three things shape the picture for personal care:

- **The category leaders are health-and-beauty chains, not marketplaces.** Clicks reports shares of 43.8% in skincare, 32.8% in haircare and 22.7% in personal care across all channels for its 2025 financial year, and 13.1 million active loyalty members a year later [4][5]. Dis-Chem reports 8.2 million active loyalty members [6]. Online is still small for them (4.1% of Clicks' front-shop sales, including purchases researched online) and both websites refused automated requests during this research.
- **On-demand grocery is the fastest-growing channel.** Checkers Sixty60 sales rose 34.5% to R25.5 billion in the year to June 2026 [7]; Pick n Pay's online turnover grew 35.4% in its latest half [8]; Woolworths reports online at 7.3% of its South African food sales [9].
- **Cross-border growth has slowed.** Cross-border orders were 18.6% of e-commerce transactions in 2025, but growth fell to 7% after the R500 de minimis import concession was removed in November 2024 [10]. Temu is still the most-visited retail website from South Africa in Semrush's October 2026 list (15.91 million visits, against 10.51 million for takealot.com) [11].

Amazon.co.za, which entered about two years before launching Prime in June 2026 [12], is the only platform in the three countries covered by Amazon's Selling Partner API [13].

### Ranked platforms

| Rank | Platform | Category | Weighted score | Top 3 | One-line rationale | Confidence |
|---|---|---|---|---|---|---|
| 1 | Takealot | General marketplace | 4.75 | Yes | Ranks first on every criterion except category leadership: largest audience, widest verified brand coverage and the only local marketplace with a documented seller API. | High |
| 2 | Amazon.co.za | General marketplace | 4.10 | Yes | Second by formula because of strong data feasibility and complete brand listings. | Medium |
| 3 | Clicks | Pharmacy and health | 3.70 | Yes | Third overall and the most important platform for the category itself. | Medium |
| 4 | Checkers Sixty60 | Quick commerce / delivery app | 3.60 | No | Enormous reach, but beauty is a secondary category and data can only be gathered manually or through the retailer. | Medium |
| 5 | Pick n Pay (asap! and pnp.co.za) | Grocery / supermarket | 3.50 | No | Best-evidenced grocer for brand coverage and the most accessible supermarket site, which makes it a practical proxy for grocery-channel pricing while Sixty60 remains closed to automated collection. | Medium |
| 6 | Bash | Department store / fashion | 3.35 | No | Large audience and easy to read, but only partly relevant: useful for skincare price tracking, not for hair or oral care. | Medium |
| 7 | Dis-Chem | Pharmacy and health | 3.25 | No | Category heavyweight held back by data access and by an e-commerce platform that is being rebuilt. | Medium |
| 8 | Woolworths (woolworths.co.za and Woolies Dash) | Grocery / supermarket | 3.20 | No | Mid-table: accessible and relevant for premium-leaning skincare and toiletries, but not where mass-market volume concentrates. | Medium |
| 9 | Makro (including Makro Marketplace) | General marketplace | 2.95 | No | Worth a later look if the brand or its distributors sell on Makro Marketplace; UNVERIFIED for the category today. | Low |
| 10 | Superbalist | Department store / fashion | 2.80 | No | Low priority for mass-market personal care; include only if skincare and cosmetics on fashion platforms become a focus. | Medium |
| 11 | Temu (South Africa) | Cross-border marketplace | 2.65 | No | High reach but low category relevance and no legitimate automated access. | Low |
| 12 | Shein (South Africa) | Cross-border marketplace | 2.65 | No | Large audience but marginal for mass-market hair, skin and oral care; no legitimate automated route to listings. | Low |
| 13 | Mr D | Quick commerce / delivery app | 2.20 | No | Low priority: the grocery range it carries is easier to monitor on Pick n Pay's own site. | Low |
| 14 | ARC Store | Beauty specialist | 1.65 | No | Included to cover the beauty-specialist type. | Medium |

### Why these three

**Takealot** leads on almost every criterion: the highest usage share, about 10.5 million monthly visits from South Africa, about US$2 billion of group GMV [14], twelve of thirteen reference brands confirmed with listing counts, and a documented Seller API [15]. Brand owners already send shoppers there: Garnier's South African site carries a "Shop Black Friday with Takealot" banner [16] and L'Oréal Paris's has a "Shop on Takealot" button [17].

**Amazon.co.za** is second by formula. It lists the full mass-market range (for example 275 results for Pantene and 530 for Colgate), draws about 9.6 million monthly visits from South Africa [18] and is the easiest platform to integrate. This is a data-feasibility result, not a claim that Amazon matters more for beauty than the pharmacy chains.

**Clicks** is third and is the most important platform for the category itself. It ranks below Amazon only because its site blocks automated access and no public API was found. If a manual audit or a data-sharing arrangement is acceptable, Clicks, and Dis-Chem after it, should be handled alongside the two marketplaces from the start. Note that Dis-Chem is replacing its e-commerce platform, with release targeted for early 2027 [19].

For grocery-channel pricing, Pick n Pay's site is the practical proxy: its search pages could be read and all eight brands tested were listed in depth [20]. Woolworths was also readable but stocks a narrower mass-market range [21].

### D2C and social commerce

- **Brand sites mostly hand shoppers to retailers.** Dark and Lovely's Africa site links to product pages on Clicks, Dis-Chem and Takealot [22], and the Garnier and L'Oréal Paris sites send shoppers to Takealot [16][17]. nivea.co.za is fourth in Similarweb's South African beauty ranking [23] with about 0.7 million visits in October 2026 [24], but whether it sells directly was not verified.
- **One transactional brand store was confirmed:** Himalaya Wellness runs an "Official Himalaya Online Store" for South Africa [25]. No traffic estimate was available for it, so it is described here and not entered as a record.
- **Social commerce.** TikTok's adult advertising reach is 29.1 million and Facebook's 27.9 million [26], but no evidence was found that social selling is a main route for mass-market beauty in South Africa. A secondary list of TikTok Shop markets shows no African country [27]; this is UNVERIFIED against an official TikTok source.

### Considered but not entered as records

| Platform | Why it was left out |
|---|---|
| Zando | Closed. Jumia announced its exit from South Africa in October 2024 [28]; zando.co.za now draws about 3,400 visits a month [29]. |
| Uber Eats | Active in all nine provinces and delivers groceries [30], including SPAR since 2025 [31], but its site refused automated requests (HTTP 403) and no current user numbers or personal-care evidence were found. Mr D represents the delivery-app type. |
| Faithful to Nature | Natural and organic health and beauty e-tailer with about 418,000 visits in October 2026 [32]. Its site returned HTTP 403, its owner could not be verified, and a natural positioning suggests little overlap with mass-market brands (UNVERIFIED). |
| Game | Massmart general-merchandise chain; about 2.5 million visits from South Africa [33]. Its site showed a human-verification page, so nothing could be checked. |
| Bob Shop | Live marketplace with a Health & Beauty category [34], about 2.4 million visits from South Africa [35] and fifth in Similarweb's marketplace ranking [36]. Auction and small-seller model; brand listings not checked. |
| Loot | Live storefront with a Health & Beauty department [37]. No traffic estimate was available, and it was named by only 3% of respondents in 2024 survey data [38]. |
| Truworths, Edgars | Fashion and department-store sites (about 5.0 million and 1.9 million visits from South Africa [39][40]). Not assessed in depth; Bash and Superbalist represent the type. Office London was not checked. |
| Shoprite (shoprite.co.za) | Covered through Checkers Sixty60, the group's on-demand service [7]. |
| OneDayOnly | Daily-deals site with about 1.7 million visits from South Africa [41]; not assessed. |
| TikTok Shop | Not available in South Africa according to the secondary list retrieved [27]. |

---

## Kenya

### Landscape

Kenyan online shopping happens mainly in apps and chats. The Communications Authority of Kenya's survey for July 2024 to June 2025 found that 44.8% of online orders were placed in mobile apps, 20.2% through WhatsApp and 12% on websites; mobile money was used by 65.7% of shoppers [42][43]. These figures were taken from press coverage; the original report was not retrieved.

- **Jumia is the largest marketplace.** jumia.co.ke leads every traffic estimate retrieved (3.8 million visits on Similarweb, 1.62 million on Semrush for October 2026) [44][45]. Jumia Kenya says it holds the largest market share and names beauty and perfumes as its second product category after phones [46]. Jumia does not publish Kenyan sales; the group reported 2.7 million quarterly active customers across all its countries in the third quarter of 2026 [47].
- **Glovo is the route to modern trade.** Its Nairobi pages list Naivas, Carrefour, Quickmart and Chandarana Foodplus under Groceries [48], and Goodlife, Pharma Plus, MYDAWA, Super Cosmetics and Lintons' Beauty Box under Pharmacy & Beauty, together with brand shops named "NIVEA Beauty Shop" and "Loreal Beauty Shop" [49]. A Competition Authority of Kenya study, reported second-hand, gives Glovo 33% of food delivery and 46% of grocery delivery [50].
- **Retailers' own sites are small and often closed.** Naivas, Quickmart and Carrefour all refused or failed automated requests; their own sites draw between about 83,000 and 312,000 visits a month.
- **The sector is unstable.** Copia Kenya was ordered into liquidation in September 2026 [51], and Uber has made a takeover offer for Glovo's parent, expected to complete in the second half of 2027 [50].

### Ranked platforms

| Rank | Platform | Category | Weighted score | Top 3 | One-line rationale | Confidence |
|---|---|---|---|---|---|---|
| 1 | Jumia Kenya | General marketplace | 4.60 | Yes | Clear first priority in Kenya: largest audience, beauty is a top category, widest verified brand coverage, and the brand owner of Dark and Lovely already points shoppers to it. | Medium |
| 2 | Glovo (Kenya) | Quick commerce / delivery app | 3.85 | Yes | Second priority and the most efficient single window onto Kenyan modern trade: one platform exposes supermarket, pharmacy and beauty-chain assortments that are otherwise blocked or thin on the retailers' own sites. | Medium |
| 3 | Kilimall | General marketplace | 3.35 | Yes | Third by formula: the second marketplace, with openly readable pages and most reference brands present. | Medium |
| 4 | Goodlife Pharmacy | Pharmacy and health | 3.20 | No | Close fourth and the most relevant specialist retailer for health and beauty, with a readable brand directory; it is also visible through Glovo. | Medium |
| 5 | Carrefour Kenya | Grocery / supermarket | 2.80 | No | Monitor through Glovo rather than directly; relevant for everyday personal-care pricing in modern trade. | Medium |
| 6 | Naivas | Grocery / supermarket | 2.80 | No | Important offline; online it is best observed through Glovo. | Medium |
| 7 | Pharmaplus Pharmacy | Pharmacy and health | 2.75 | No | Broadest verified brand directory among Kenyan pharmacy sites; a good low-effort addition after Goodlife. | Medium |
| 8 | WhatsApp (social commerce via WhatsApp Business) | Social commerce | 2.70 | No | Too important to ignore and impossible to monitor like a marketplace: keep it in the database as a channel to track through surveys and the brand's own WhatsApp activity, not as a data-integration target. | Medium |
| 9 | MYDAWA | Pharmacy and health | 2.65 | No | Easy to read and relevant for skin care, but small. | Medium |
| 10 | Jiji Kenya | Classifieds (other) | 2.60 | No | Large audience but weak fit: unstructured listings and no data route. | Low |
| 11 | Quickmart | Grocery / supermarket | 2.40 | No | Covered adequately by monitoring Glovo; low stand-alone priority. | Medium |
| 12 | Bolt Food (Kenya) | Quick commerce / delivery app | 1.80 | No | Low priority; revisit if its grocery and retail business keeps growing. | Low |
| 13 | Lintons Beauty World | Beauty specialist | 1.80 | No | Included to cover the beauty-specialist type; low relevance for mass-market lines. | Medium |

### Why these three

**Jumia Kenya** combines the largest audience with the strongest category evidence: 301,425 health and beauty products listed, all thirteen reference brands found (for example 266 Colgate, 138 Dark and Lovely and 135 Pantene products), and brand-store logos for Garnier, Nivea and Vaseline on the category page [52][53]. Dark and Lovely's own site names Jumia Kenya as its Kenyan online stockist [22].

**Glovo** is second because one openly readable platform exposes the assortments of the supermarket, pharmacy and beauty chains that cannot be read directly. It is also where two competitor brands have opened their own shops. The ownership change is a risk to plan for, not a reason to wait.

**Kilimall** is third by formula: it is the second marketplace by traffic, its pages are openly readable, and eleven of the thirteen reference brands were found there, although most with only a handful of listings [54]. Treat it as a price-comparison point, not a volume channel.

**Goodlife Pharmacy is a close fourth and we would add it to the first wave.** It is Kenya's largest pharmacy chain by its own description (over 150 stores) [55], with a public brand directory of 1,012 brands that includes eight of the thirteen reference brands [56]. Pharmaplus has an even wider directory (ten of thirteen brands) [57] and is a cheap addition.

### D2C and social commerce

- **D2C.** No significant stand-alone brand store was verified. Brand-owned selling shows up instead as brand shops inside Glovo ("NIVEA Beauty Shop", "Loreal Beauty Shop") [58][59] and official stores on Jumia.
- **Social commerce is material.** WhatsApp's 20.2% share of order placements is an official survey figure [42], and Business Daily describes small sellers using TikTok, Instagram and WhatsApp for items such as fashion and beauty. WhatsApp is therefore entered as a record, but with the lowest data-feasibility score: conversations are private and there is no legitimate way to read other sellers' prices. TikTok's adult advertising reach in Kenya is 18.4 million and Facebook's 17.0 million [60]. TikTok Shop does not appear in the secondary market list retrieved [27].

### Considered but not entered as records

| Platform | Why it was left out |
|---|---|
| Copia | In liquidation since September 2026 [51]. |
| Sky.Garden | The site still loads [61], but no traffic estimate was available and current trading could not be confirmed. Status unclear. |
| PigiaMe | Returned an HTTP 403 "Maintenance" page on 2026-11-26 [62]. Status unclear. |
| Avechi | Live, but an electronics shop ("smartphones and electronics") with about 99,000 visits [63][64]. Not relevant to the category. |
| Uber Eats | Among the most-downloaded delivery apps in late 2025 [65], but its site refused automated requests and its retail range is UNVERIFIED. Its parent is bidding for Glovo's owner [50]. |
| Super Cosmetics | Its own site returned HTTP 500. It trades on Glovo, where its store page shows L'Oréal, Garnier, Nivea, Cantu and CeraVe [66], so it is covered through Glovo. |
| Best Lady, Beauty Click | No working online store was found for Best Lady at the address tried (UNVERIFIED), and Beauty Click's site returned HTTP 403. |
| Temu, Shein, AliExpress, Amazon | Cross-border platforms such as Amazon account for 13.8% of platform usage in the regulator's survey [42], but no platform-level Kenyan evidence was found. Temu's Kenya address redirected to its global homepage, and Amazon has no Kenyan marketplace in its seller API [13]. |
| Greenspoon, Chandarana Foodplus | Greenspoon is a live online grocer [67] and Chandarana sells through Glovo [48]; neither was assessed for personal care. |

---

## Nigeria

### Landscape

Nigeria is Jumia's largest market by sales since early 2026 [68], with GMV up 30% year on year in the third quarter [47]. No official statistic on Nigerian e-commerce or online beauty sales was found, and commercial market-size estimates conflict so widely that none is quoted.

- **Two sites dominate attention.** jumia.com.ng and the classifieds site jiji.ng each draw several million visits a month (Semrush: 5.93 million and 4.34 million in October 2026) [69][70]. Jiji reports more than 12 million monthly users [71]. Konga is far smaller on the same measures, and much of its traffic appears to come from outside Nigeria [72][73].
- **Temu arrived fast.** It became the most-downloaded app within weeks of entering in late 2024 [74]; the latest download data retrieved is from mid-2025 [75].
- **Quick commerce is adding retail.** Chowdeck had about 1.5 million customers in August 2025 and is opening dark stores [76]; Glovo's Lagos pages list supermarkets, pharmacies and its own Glovo Mart [77][78].
- **Branded personal care is best listed on small, open sites.** Supermart.ng returned results for all thirteen reference brands [79]. On Jumia Nigeria, by contrast, searches found 112 Dark and Lovely and 96 Nivea products but only one Colgate product and none for Pantene [80], even though beauty and perfumes was its second most-sold product group in 2024 [81].

### Ranked platforms

| Rank | Platform | Category | Weighted score | Top 3 | One-line rationale | Confidence |
|---|---|---|---|---|---|---|
| 1 | Jumia Nigeria | General marketplace | 4.05 | Yes | First priority in Nigeria on reach and category weight. | Medium |
| 2 | Supermart.ng | Grocery / supermarket | 3.35 | Yes | Second by formula because it is the best open window onto branded personal-care listings and prices in Nigeria. | Medium |
| 3 | Glovo (Nigeria) | Quick commerce / delivery app | 3.05 | Yes | Third by formula: one accessible platform that exposes several Lagos supermarkets and pharmacies, including MedPlus and HealthPlus. | Low |
| 4 | Buy Better (buybetter.ng) | Beauty specialist | 2.80 | No | Best-evidenced beauty specialist in Nigeria and easy to read; relevant for skin care only. | Medium |
| 5 | MedPlus Pharmacy | Pharmacy and health | 2.80 | No | Most relevant pharmacy site for mass-market skin and oral care in Nigeria and easy to read. | Low |
| 6 | Jiji Nigeria | Classifieds (other) | 2.80 | No | Very large audience but weak fit and no data route. | Low |
| 7 | 24 Hours Market | Grocery / supermarket | 2.55 | No | Minor site that is easy to read; optional second price benchmark after Supermart.ng. | Medium |
| 8 | Konga | General marketplace | 2.55 | No | Scores low on the evidence available: no visible beauty category, shrinking measurable traffic and no data route. | Low |
| 9 | Chowdeck | Quick commerce / delivery app | 2.40 | No | Growing quick-commerce reach but no evidence yet of a meaningful personal-care range and no data route. | Low |
| 10 | Temu (Nigeria) | Cross-border marketplace | 2.25 | No | Watch for price pressure rather than monitor listings; evidence of its current scale in Nigeria is dated. | Low |
| 11 | HealthPlus Pharmacy | Pharmacy and health | 2.20 | No | Low priority for this category: its online range is medicine-led, with almost no mass-market personal care. | Medium |
| 12 | Essenza | Beauty specialist | 2.00 | No | Included to cover premium beauty specialists; not relevant to mass-market monitoring. | Medium |

### Why these three

**Jumia Nigeria** is first on reach and category weight. Its thin coverage of some international hair and oral-care brands is worth monitoring in its own right, because it shows where distribution is weak.

**Supermart.ng** is second by formula, and this is the ranking we are least comfortable with. It earns its place through verified range and open data (search pages and a public product feed [82]), but its audience is roughly a fiftieth of Jumia's. It delivers within Lagos and buys from supermarkets when orders are placed [83], so its catalogue reflects what Lagos modern trade stocks. Use it as a price and assortment benchmark, not as a volume channel.

**Glovo** is third: its Lagos pages are openly readable and cover SPAR Market, MedPlus, HealthPlus and Glovo Mart in one place. No Nigerian user or order figure was found for it, so confidence is low.

**Jiji and Konga deserve a manual audit before they are dismissed.** Both score poorly because their sites refused automated access and their beauty listings could not be seen, not because their audiences are small. If a short manual review finds meaningful branded listings, or unauthorised offers, Jiji in particular should move up.

### D2C and social commerce

- **D2C.** Zikel Cosmetics runs its own-brand store; searches there for third-party brands returned nothing, and Similarweb shows under 1,000 visits in October 2026 [84][85]. It is not significant enough for a record. Dark and Lovely's site links to Jumia Nigeria [22].
- **Social commerce could not be evidenced.** TikTok's adult advertising reach is 47.8 million, Facebook's 38.0 million and Instagram's 10.0 million [86], but no source was found for the share of beauty sales that runs through Instagram or WhatsApp sellers. This is an important gap, marked UNVERIFIED. Dedicated beauty-retail apps are negligible, with tens to a few hundred downloads a week [87].

### Considered but not entered as records

| Platform | Why it was left out |
|---|---|
| Kilimall Nigeria | Not operating: the Nigerian address did not respond and Kilimall's country selector lists only Kenya and Uganda [88]. |
| Shoprite Nigeria | The address tried did not respond; no transactional site was verified. |
| SPAR Nigeria, Justrite | SPAR's own site is live [89] but was not confirmed as transactional; both chains sell through Glovo [77]. |
| PricePally | Live online grocer [90], also on Glovo. Food-focused; not assessed for personal care. |
| Montaigne Place | Returned HTTP 503 on 2026-11-26 [91]. Status unclear. |
| Zikel Cosmetics | Own-brand store with negligible traffic (see above). |
| healthplus.com.ng | Data-quality warning: this address now redirects to a betting site. HealthPlus trades at healthplusnigeria.com [92]. |
| Shein, AliExpress, Amazon, TikTok Shop | No Nigeria-specific evidence was found. Amazon has no Nigerian marketplace in its seller API [13], and TikTok Shop is absent from the secondary market list retrieved [27]. |
| Beauty Hut, One Health | Seen as stores on Glovo Lagos [78]; not assessed separately. |

---

## Limitations and gaps

1. **Search allowance ran out.** The session's shared web-search allowance was exhausted after about 45 searches by this researcher. Everything after that relied on retrieving known pages directly. The main consequences: ownership of several platforms is unconfirmed (recorded as "not verified"), Nigerian social commerce has no evidence, and status could not be settled for Sky.Garden, PigiaMe, Montaigne Place, Shoprite Nigeria or Temu in Kenya.
2. **Traffic is estimated, not measured.** Semrush and Similarweb differ substantially (for jumia.co.ke, 1.62 million against 3.8 million visits). Similarweb's free pages label the figure "Total Visits" beside a three-month chart, so it may not be strictly one month. Country ranking pages from Semrush and Similarweb could be retrieved for South Africa but not for Kenya or Nigeria, so those two countries have no like-for-like ranking of sites.
3. **Verified market shares are scarce.** Glovo's Kenyan shares come from a regulator study cited by a news site without a year; the Competition Commission's finding on Takealot has no percentage; nothing comparable was found for Nigeria. The Communications Authority of Kenya figures, the Competition Commission finding and most company results were taken from press coverage, not the original documents.
4. **Brand checks are a one-day snapshot.** On-site search counts include loosely matched items, results can depend on delivery location, and several brands were not tested on every platform. Counts are indicators of presence, not catalogue sizes.
5. **Blocked platforms are under-described.** Clicks, Dis-Chem, Checkers Sixty60, Makro, Game, Naivas, Quickmart, Carrefour Kenya, Jiji (both countries), Temu, Shein and Uber Eats could not be read. Their brand coverage is UNVERIFIED and scored with placeholders.
6. **API findings are narrow.** Seller APIs (Takealot, Amazon, Makro, Glovo, SHEIN) serve registered sellers' own data; none was tested, and none provides competitors' listings. No authorised third-party data provider was identified or verified. Terms of use were not reviewed for any site and must be checked before automated collection.
7. **Dated evidence is flagged in the records.** This applies to the 2023 Competition Commission finding, 2024 survey data from the 2025 World Wide Worx report, Jumia Nigeria's 2024 category data, and Temu and Chowdeck figures from 2024 and 2025.
8. **Scores are judgements.** They follow the rubric and the evidence notes, but a different analyst could reasonably move individual scores by a point. Where the formula's order looks misleading, the rationale in the record says so.
9. **Not covered.** App-store review data, pricing depth, seller counts, marketplace fee structures and platform advertising products were out of scope for this pass.

## Sources

All sources were accessed on 2026-11-26. Titles marked "descriptive title" were written by us because the page title was not captured. Per-platform source lists are in the JSON files.

1. World Wide Worx. "SA online retail to reach R159-billion in 2026". Published: 2026-09-02. <https://www.worldwideworx.com/?p=3097>
2. TechCentral. "SA online retail to reach R159-billion as growth slows". Published: 2026-09-02. <https://techcentral.co.za/online-retail-south-africa-2026-world-wide-worx/285678/>
3. BusinessTech. "Takealot ordered to make massive changes to ease competition". Published: 2023-07-31. <https://businesstech.co.za/news/business/707944/takealot-ordered-to-make-massive-changes-to-ease-competition/>
4. Clicks Group. "Clicks business review - Clicks IAR 2025". Published: n.d. (Integrated Annual Report 2025). <https://clicksgroup.co.za/iar2025/?p=288>
5. EWN (Eyewitness News). "Clicks turnover exceeds R50bn for first time as retail footprint expands". Published: 2026-10-22. <https://www.ewn.co.za/2026/10/22/clicks-turnover-exceeds-r50bn-for-first-time-as-retail-footprint-expands>
6. Bizcommunity. "Dis-Chem's Better Rewards programme supports 8% revenue growth". Published: 2026-10-30. <https://www.bizcommunity.com/article/dis-chems-better-rewards-programme-supports-8-revenue-growth-414299a>
7. TechCentral. "Sixty60 now drives more than a third of Shoprite's growth". Published: 2026-08-12. <https://techcentral.co.za/sixty60-now-drives-more-than-a-third-of-shoprites-growth/284740/>
8. TechCentral. "Pick n Pay's online sales jump while store sales barely grow". Published: 2026-10-26. <https://techcentral.co.za/pick-n-pay-online-sales-store-sales/287625/>
9. Bizcommunity. "Woolworths posts R84.5bn turnover and sharpens Food focus". Published: 2026-09-03. <https://www.bizcommunity.com/article/woolworths-posts-r845bn-turnover-and-sharpens-food-focus-297167a>
10. ITWeb. "Shein, Temu forced to rethink SA e-commerce playbook". Published: 2026-09-09. <https://www.itweb.co.za/article/shein-temu-forced-to-rethink-sa-e-commerce-playbook/Pero3qZ365PvQb6m>
11. Semrush. "Most Visited Retail Websites in South Africa October 2026 | Top Websites & Popular Rankings". Published: n.d. (October 2026 data). <https://www.semrush.com/website/top/south-africa/e-commerce-and-retail/>
12. TimesLIVE. "Amazon launches Prime in SA as e-commerce battle intensifies". Published: 2026-06-03. <https://www.timeslive.co.za/news/2026-06-03-amazon-launches-prime-in-sa-as-e-commerce-battle-intensifies/>
13. Amazon. "Marketplace IDs / Store Identifiers - Selling Partner API documentation". Published: n.d. <https://developer-docs.amazon.com/sp-api/docs/marketplace-ids>
14. TechCentral. "Profits arrive at Takealot, but Naspers stays cautious". Published: 2026-06-29. <https://techcentral.co.za/profits-arrive-at-takealot-but-naspers-stays-cautious/283091/>
15. Takealot. "Seller API (Takealot Seller API documentation)". Published: n.d. <https://seller-api.takealot.com/api-docs/>
16. Garnier (L'Oreal). "Garnier | Hair Care, Hair Colour, Skin Care & Deodorant Products". Published: n.d. <https://africa.garnier.com/en-za>
17. L'Oreal Paris. "L'Oreal Paris South Africa - Hair page (carries a 'Shop on Takealot' button; descriptive title)". Published: n.d. <https://www.loreal-paris.co.za/hair>
18. Semrush. "amazon.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/amazon.co.za/overview/>
19. TechCentral. "Dis-Chem gets serious about e-commerce - again". Published: 2026-09-08. <https://techcentral.co.za/dis-chem-ecommerce-app-rebuild/285866/>
20. Pick n Pay. "Pick n Pay Online Shopping - public search results (brand queries run 2026-11-26; example URL for 'nivea')". Published: n.d. <https://www.pnp.co.za/search/nivea>
21. Woolworths. "Woolworths Online Shopping - public search results (brand queries run 2026-11-26; example URL for 'nivea')". Published: n.d. <https://www.woolworths.co.za/cat?Ntt=nivea>
22. Dark and Lovely (L'Oreal). "Dark and Lovely Home (Africa site with retailer store links)". Published: n.d. <https://africa.darkandlovely.com/>
23. Similarweb. "Top Beauty and Cosmetics websites in South Africa, October 2026 (descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/top-websites/south-africa/lifestyle/beauty-and-cosmetics/>
24. Semrush. "nivea.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/nivea.co.za/overview/>
25. Himalaya Wellness (South Africa). "Buy Himalaya Products on the Official Himalaya Online Store". Published: n.d. <https://himalayawellness.co.za/>
26. DataReportal (Kepios). "Digital 2026: South Africa". Published: 2025-11-08. <https://datareportal.com/reports/digital-2026-south-africa>
27. PhotonPay (blog). "TikTok Shop Countries (2026): Full List, Market Maturity & Seller Requirements". Published: 2024-11-17 (page header; body says 'as of 2026'). <https://www.photonpay.com/hk/blog/article/tiktok-shop-available-countries>
28. Jumia Group (news page). "African online retailer Jumia to exit South Africa and Tunisia". Published: 2024-10-16. <https://group.jumia.com/news/african-online-retailer-jumia-to-exit-south-africa-and-tunisia>
29. Semrush. "zando.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/zando.co.za/overview/>
30. TimesLIVE. "Uber Eats pushes R1.6bn in additional value for local restaurants over 10 years". Published: 2026-10-06. <https://www.timeslive.co.za/news/business/2026-10-06-uber-eats-pushes-r16bn-in-additional-value-for-local-restaurants-over-10-years/>
31. BusinessTech. "SPAR grocery and alcohol deliveries now on Uber Eats in South Africa". Published: 2025-07 (day not captured). <https://businesstech.co.za/news/business/830815/spar-grocery-and-alcohol-deliveries-now-on-uber-eats-in-south-africa/>
32. Semrush. "faithful-to-nature.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/faithful-to-nature.co.za/overview/>
33. Semrush. "game.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/game.co.za/overview/>
34. Bob Shop. "Bob Shop online shopping South Africa | bid or buy today". Published: n.d. <https://www.bobshop.co.za/>
35. Semrush. "bobshop.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/bobshop.co.za/overview/>
36. Similarweb. "Top Marketplace websites in South Africa, October 2026 (descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/top-websites/south-africa/e-commerce-and-shopping/marketplace/>
37. Loot. "Loot | For Sale | South Africa". Published: n.d. <https://www.loot.co.za/>
38. ITWeb. "Takealot extends e-commerce lead despite arrival of disruptors". Published: 2025-09-12. <https://www.itweb.co.za/article/takealot-extends-e-commerce-lead-despite-arrival-of-disruptors/rW1xLv5n3Z17Rk6m>
39. Semrush. "truworths.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-12. <https://www.semrush.com/website/truworths.co.za/overview/>
40. Semrush. "edgars.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/edgars.co.za/overview/>
41. Semrush. "onedayonly.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/onedayonly.co.za/overview/>
42. Business Daily (Nation Media Group). "Mobile apps now eclipse websites in Kenya's shift to e-commerce". Published: 2026-01-07. <https://www.businessdailyafrica.com/bd/corporate/technology/mobile-apps-eclipse-websites-in-kenya-s-e-trade-shift-5319176>
43. ITWeb Africa. "The rise of WhatsApp in Kenya's online shopping scene". Published: 2026-01-09. <https://itweb.africa/article/the-rise-of-whatsapp-in-kenyas-online-shopping-scene/mYZRXM9gprxvOgA8>
44. Similarweb. "Similarweb website analysis: jumia.co.ke (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/jumia.co.ke/>
45. Semrush. "jumia.co.ke Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/jumia.co.ke/overview/>
46. Jumia Kenya. "E-commerce in Rural Kenya: Expanding Access, Driving Inclusion, Connecting Border to Border (2nd rural e-commerce report)". Published: n.d. (2025; cites Jumia Group Q3 2025 results). <https://group.jumia.com/download/files/community/articles/jumia-kenyas-2nd-rural-e-commerce-report-expanding-access-driving-inclusion-connection-border-to-border-1771847915.pdf>
47. Jumia Technologies AG. "Jumia Reports Third Quarter 2026 Results (Exhibit 99.1)". Published: 2026-11-18. <https://s205.q4cdn.com/370993272/files/content_files/OS-Jumia-EX-99-1-Q3-2026.pdf>
48. Glovo. "Groceries delivery in Nairobi | Glovo". Published: n.d. <https://glovoapp.com/en/ke/nairobi/categories/groceries_4>
49. Glovo. "Pharmacy-beauty delivery in Nairobi | Glovo". Published: n.d. <https://glovoapp.com/en/ke/nairobi/categories/pharmacy-beauty_3>
50. Techweez. "Uber Buys Out Glovo, Its Biggest Rival in Kenya's Delivery Market". Published: 2026-07-17. <https://techweez.com/2026/07/17/uber-acquires-glovo-kenya-delivery-hero/>
51. Techweez. "Copia Kenya Ordered Into Liquidation After Two-Year Rescue Effort". Published: 2026-09-30. <https://techweez.com/2026/09/30/copia-kenya-liquidation/>
52. Jumia Kenya. "Jumia Kenya - Health & Beauty category page (descriptive title)". Published: n.d. <https://www.jumia.co.ke/health-beauty/>
53. Jumia Kenya. "Jumia Kenya catalogue search results (queries run 2026-11-26 for colgate, pantene, sensodyne, sunsilk, dark and lovely, head and shoulders; example URL)". Published: n.d. <https://www.jumia.co.ke/catalog/?q=colgate>
54. Kilimall. "Kilimall public search results (brand queries run 2026-11-26; example URL for 'Nivea')". Published: n.d. <https://www.kilimall.co.ke/search?q=Nivea>
55. Goodlife Pharmacy. "Goodlife Pharmacy - About Us (descriptive title)". Published: n.d. <https://www.goodlife.co.ke/about-us/>
56. Goodlife Pharmacy. "Goodlife Pharmacy - brand directory (descriptive title)". Published: n.d. <https://www.goodlife.co.ke/brands/>
57. Pharmaplus. "All Brands | PharmaPlus | Pharmaplus". Published: n.d. <https://shop.pharmaplus.co.ke/brands>
58. Glovo. "NIVEA Beauty Shop delivery in Nairobi | Glovo". Published: n.d. <https://glovoapp.com/en/ke/nairobi/stores/nivea-nbo>
59. Glovo. "Loreal Beauty Shop delivery in Nairobi | Glovo". Published: n.d. <https://glovoapp.com/en/ke/nairobi/stores/loreal-nbo>
60. DataReportal (Kepios). "Digital 2026: Kenya". Published: 2025-11-08. <https://datareportal.com/reports/digital-2026-kenya>
61. Sky.Garden. "Online Shopping - Instant Delivery - Sky.Garden". Published: n.d. <https://sky.garden/>
62. PigiaMe. "PigiaMe homepage (returned an HTTP 403 'Maintenance' page on 2026-11-26)". Published: n.d. <https://www.pigiame.co.ke/>
63. Avechi. "Avechi Kenya | Online shop for smartphones and electronics". Published: n.d. <https://avechi.co.ke/>
64. Semrush. "avechi.co.ke Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/avechi.co.ke/overview/>
65. Sensor Tower. "Top Food Delivery Apps in Kenya Q4 2025 Performance Analysis". Published: n.d. (Q4 2025 data). <https://sensortower.com/blog/2025-q4-unified-top-5-food-delivery-services-units-ke-63da96fbe1714cfff1c1e5a1>
66. Glovo. "Super Cosmetics delivery in Nairobi | Glovo". Published: n.d. <https://glovoapp.com/en/ke/nairobi/stores/super-cosmetics-nbo>
67. Greenspoon. "Home - Greenspoon". Published: n.d. <https://greenspoon.co.ke/>
68. Semafor. "Jumia leans on China imports as Nigeria becomes top market". Published: 2026-05-08. <https://www.semafor.com/article/05/08/2026/jumia-leans-on-china-imports-as-nigeria-becomes-top-market>
69. Semrush. "jumia.com.ng Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/jumia.com.ng/overview/>
70. Semrush. "jiji.ng Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/jiji.ng/overview/>
71. BusinessDay (Nigeria). "Soaring costs push Nigerians to pre-owned market as demand jumps 97%". Published: 2026-05-01. <https://businessday.ng/transport/article/soaring-costs-push-nigerians-to-pre-owned-market-as-demand-jumps-97/>
72. Semrush. "konga.com Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/konga.com/overview/>
73. Similarweb. "Similarweb website analysis: konga.com (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/konga.com/>
74. Semafor. "Chinese retailer Temu storms Nigeria". Published: 2024-12-11. <https://www.semafor.com/article/12/11/2024/chinese-retailer-temu-storms-nigeria>
75. Sensor Tower. "Top 5 Shopping Apps on Android in Nigeria: Q2 2025". Published: n.d. (Q2 2025 data). <https://sensortower.com/blog/2025-q2-android-top-5-shopping-units-ng-6571f22de1714cfff1c79b4a>
76. Techpoint Africa. "Chowdeck bets on dark stores to fuel growth after $9 million Series A". Published: 2025-08-11. <https://techpoint.africa/?p=336400>
77. Glovo. "Groceries delivery in Lagos | Glovo". Published: n.d. <https://glovoapp.com/en/ng/lagos/categories/groceries_4>
78. Glovo. "Pharmacy-beauty delivery in Lagos | Glovo". Published: n.d. <https://glovoapp.com/en/ng/lagos/categories/pharmacy-beauty_3>
79. Supermart.ng. "Supermart.ng search results (brand queries run 2026-11-26; example URL for 'nivea')". Published: n.d. <https://www.supermart.ng/search?q=nivea&type=product>
80. Jumia Nigeria. "Jumia Nigeria catalogue search results (queries run 2026-11-26 for nivea, dove, closeup, sensodyne, colgate, pantene, garnier, dark and lovely, sunsilk, vaseline; example URL)". Published: n.d. <https://www.jumia.com.ng/catalog/?q=nivea>
81. Jumia Nigeria. "E-commerce in Rural Areas of Nigeria (Jumia rural e-commerce report)". Published: n.d. (2025; internal data as of December 2024). <https://group.jumia.com/download/files/community/articles/e-commerce-in-rural-areas-of-nigeria.pdf>
82. Supermart.ng. "Supermart.ng public product JSON feed (Shopify storefront)". Published: n.d. <https://www.supermart.ng/products.json?limit=250>
83. Supermart.ng. "FAQs - Supermart.ng". Published: n.d. <https://www.supermart.ng/pages/faqs>
84. Zikel Cosmetics. "Zikel Cosmetics". Published: n.d. <https://zikelcosmetics.com/>
85. Similarweb. "Similarweb website analysis: zikelcosmetics.com (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/zikelcosmetics.com/>
86. DataReportal (Kepios). "Digital 2026: Nigeria". Published: 2025-11-08. <https://datareportal.com/reports/digital-2026-nigeria>
87. Sensor Tower. "Top Beauty Retail Apps on Android in Nigeria: Q1 2026". Published: n.d. (Q1 2026 data). <https://sensortower.com/blog/2026-q1-android-top-5-beauty-retail-units-ng-63fd3f19e1714cfff19e1990>
88. Kilimall. "Kilimall - Affordable Online Shopping in Kenya". Published: n.d. <https://www.kilimall.co.ke/>
89. SPAR Nigeria. "SPAR Nigeria". Published: n.d. <https://sparnigeria.com/>
90. PricePally. "PricePally - Online grocery store". Published: n.d. <https://www.pricepally.com/>
91. Montaigne Place. "Montaigne Place homepage (returned HTTP 503 on 2026-11-26)". Published: n.d. <https://montaigneplace.com/>
92. HealthPlus. "HealthPlus Pharmacy - Online Pharmacy in Nigeria". Published: n.d. <https://healthplusnigeria.com/>
93. Takealot. "Takealot Seller API - OpenAPI definition, version 2.0". Published: n.d. <https://seller-api.takealot.com/api-docs/swagger.json>
94. Takealot. "Takealot.com public search results (brand queries run 2026-11-26; example URL for 'nivea')". Published: n.d. <https://www.takealot.com/all?qsearch=nivea>
95. Semrush. "takealot.com Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/takealot.com/overview/>
96. Semrush. "makro.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/makro.co.za/overview/>
97. Semrush. "checkers.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/checkers.co.za/overview/>
98. Semrush. "pnp.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/pnp.co.za/overview/>
99. Semrush. "woolworths.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/woolworths.co.za/overview/>
100. Semrush. "clicks.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/clicks.co.za/overview/>
101. Semrush. "dischem.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/dischem.co.za/overview/>
102. Semrush. "superbalist.com Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/superbalist.com/overview/>
103. Semrush. "arcstore.co.za Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/arcstore.co.za/overview/>
104. Semrush. "jiji.co.ke Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/jiji.co.ke/overview/>
105. Semrush. "chowdeck.com Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/chowdeck.com/overview/>
106. Semrush. "supermart.ng Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-11. <https://www.semrush.com/website/supermart.ng/overview/>
107. Semrush. "bash.com Website Traffic, Ranking, Analytics [October 2026]". Published: 2026-11-12. <https://www.semrush.com/website/bash.com/overview/>
108. Similarweb. "Top Ecommerce & Shopping websites in South Africa, October 2026 (descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/top-websites/south-africa/e-commerce-and-shopping/>
109. Similarweb. "Top Groceries websites in South Africa, October 2026 (descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/top-websites/south-africa/food-and-drink/groceries/>
110. Amazon.co.za. "Amazon.co.za public search results (brand queries run 2026-11-26; example URL for 'nivea')". Published: n.d. <https://www.amazon.co.za/s?k=nivea>
111. Amazon.co.za. "Amazon.co.za product page: Vaseline Blue Seal petroleum jelly 450ml (shows 'Shipper / Seller Amazon.co.za')". Published: n.d. <https://www.amazon.co.za/Vaseline-Fragrance-Petroleum-Jelly-450ml/dp/B0CYZNTD72>
112. Sunday World. "Sixty60 powers Shoprite growth with record R25.5bn in sales". Published: 2026-09-01. <https://sundayworld.co.za/news/sixty60-powers-shoprite-growth-with-record-r25-5bn-in-sales/>
113. ITWeb. "New Pick n Pay asap! app adds 600K new customers". Published: 2025-10-27. <https://www.itweb.co.za/article/new-pick-n-pay-asap-app-adds-600k-new-customers/rW1xLv5nVY57Rk6m>
114. Massmart. "Makro deepens marketplace growth through seller collaboration". Published: 2026-06-22. <https://www.massmart.co.za/news/2026/06/makro-deepens-marketplace-growth-through-seller-collaboration>
115. ShoppingFeeder. "Connecting ShoppingFeeder to Makro Marketplace - ShoppingFeeder Help". Published: 2025-08-27. <https://help.shoppingfeeder.com/connecting-shoppingfeeder-to-makro-marketplace/>
116. Makro (Massmart). "Makro website (returned an 'Are you a human?' verification page to automated requests)". Published: n.d. <https://www.makro.co.za/>
117. TechCentral. "Fewer stores, more Bash: TFG's online pivot gathers pace". Published: 2026-11-06. <https://techcentral.co.za/tfg-bash-online-pivot-store-closures/288101/>
118. BusinessTech. "South Africa's Shein and Temu competitor breaks even two years ahead of schedule". Published: 2025-06-06. <https://businesstech.co.za/news/business/827124/south-africas-shein-and-temu-competitor-breaks-even-two-years-ahead-of-schedule/>
119. Bash (TFG). "Bash.com public search results (brand queries run 2026-11-26; example URL for 'nivea')". Published: n.d. <https://bash.com/s?search=nivea>
120. Superbalist. "Superbalist public search results (brand queries run 2026-11-26; example URL for 'nivea')". Published: n.d. <https://superbalist.com/search?q=nivea>
121. TechCentral. "Takealot offloads Superbalist to PE consortium". Published: 2024-09-02. <https://techcentral.co.za/takealot-superbalist-pe-consortium/250879/>
122. SHEIN. "SHEIN Developer Platform". Published: n.d. <https://open.sheincorp.com/>
123. SHEIN. "Shop Trendy Women's Fashion | Women Clothing | SHEIN South Africa". Published: n.d. <https://za.shein.com/>
124. Temu. "Temu (South Africa country path; search redirects to a login page)". Published: n.d. <https://www.temu.com/za>
125. Mr D. "Mr D (homepage)". Published: n.d. <https://www.mrd.com/>
126. ARC. "ARC store homepage (descriptive title)". Published: n.d. <https://www.arcstore.co.za/>
127. ARC. "ARC store brand directory (descriptive title)". Published: n.d. <https://www.arcstore.co.za/brands>
128. Daily Maverick. "Shein and Temu ban: Cosatu backs call to save local jobs". Published: 2026-10-15. <https://www.dailymaverick.co.za/article/2026-10-15-cosatu-calls-for-government-ban-of-shein-and-temu-to-protect-local-jobs/>
129. TechTrendsKE. "Kenya food delivery market attracts new competition". Published: 2026-11-16. <https://techtrendske.co.ke/2026/11/16/kenya-food-delivery-market/>
130. TechTrendsKE. "Carrefour opens Lavington store". Published: 2026-11-13. <https://techtrendske.co.ke/2026/11/13/carrefour-opens-lavington-store-as-kenyan-expansion-gathers-pace/>
131. Jumia. "Start Your Success Story with Jumia - Jumia VendorHub KE". Published: n.d. <https://vendorhub.jumia.co.ke/>
132. Jumia. "Jumia | Vendor Center". Published: n.d. <https://vendorcenter.jumia.com/>
133. Glovo. "Naivas delivery in Nairobi | Glovo". Published: n.d. <https://glovoapp.com/en/ke/nairobi/stores/naivas-nbo>
134. Glovo. "Carrefour delivery in Nairobi | Glovo". Published: n.d. <https://glovoapp.com/en/ke/nairobi/stores/carrefour-supermarket-nbo-ke>
135. Glovo. "Quickmart delivery in Nairobi | Glovo". Published: n.d. <https://glovoapp.com/en/ke/nairobi/stores/quickmart-nbo>
136. Glovo. "Glovo Partners API". Published: n.d. <https://api-docs.glovoapp.com/partners/index.html>
137. Goodlife Pharmacy. "Goodlife Pharmacy: Kenya's Largest Pharmacy | Online Pharmacy". Published: n.d. <https://www.goodlife.co.ke/>
138. MYDAWA. "MYDAWA | Kenya's Most Trusted Online Pharmacy". Published: n.d. <https://mydawa.com/>
139. Pharmaplus. "Pharmaplus | Your Trusted Online Pharmacy | Pharmaplus". Published: n.d. <https://shop.pharmaplus.co.ke/>
140. Lintons Beauty World. "Lintons Beauty World | Perfume, Skincare & Makeup | Official Store (KE)". Published: n.d. <https://www.lintonsbeauty.com/>
141. Lintons Beauty World. "Lintons Beauty World search results (queries run 2026-11-26 for 'garnier' and 'nivea'; example URL)". Published: n.d. <https://www.lintonsbeauty.com/search?q=garnier>
142. Bolt. "Bolt Food | Food delivery and takeout | Order food near you". Published: n.d. <https://bolt.eu/en-ke/food/>
143. WhatsApp. "WhatsApp | Secure and Reliable Free Private Messaging and Calling". Published: n.d. <https://www.whatsapp.com/>
144. Similarweb. "Similarweb website analysis: kilimall.co.ke (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/kilimall.co.ke/>
145. Similarweb. "Similarweb website analysis: jiji.co.ke (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/jiji.co.ke/>
146. Similarweb. "Similarweb website analysis: carrefour.ke (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/carrefour.ke/>
147. Similarweb. "Similarweb website analysis: naivas.online (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/naivas.online/>
148. Similarweb. "Similarweb website analysis: quickmart.co.ke (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/quickmart.co.ke/>
149. Similarweb. "Similarweb website analysis: goodlife.co.ke (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/goodlife.co.ke/>
150. Similarweb. "Similarweb website analysis: mydawa.com (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/mydawa.com/>
151. Similarweb. "Similarweb website analysis: lintonsbeauty.com (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/lintonsbeauty.com/>
152. Similarweb. "Similarweb website analysis: pharmaplus.co.ke (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/pharmaplus.co.ke/>
153. Similarweb. "Similarweb website analysis: jumia.com.ng (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/jumia.com.ng/>
154. Similarweb. "Similarweb website analysis: jiji.ng (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/jiji.ng/>
155. Similarweb. "Similarweb website analysis: supermart.ng (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/supermart.ng/>
156. Similarweb. "Similarweb website analysis: healthplusnigeria.com (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/healthplusnigeria.com/>
157. Similarweb. "Similarweb website analysis: medplusnig.com (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/medplusnig.com/>
158. Similarweb. "Similarweb website analysis: buybetter.ng (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/buybetter.ng/>
159. Similarweb. "Similarweb website analysis: 24hoursmarket.com (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/24hoursmarket.com/>
160. Similarweb. "Similarweb website analysis: essenza.ng (October 2026 snapshot; descriptive title)". Published: n.d. (October 2026 data). <https://www.similarweb.com/website/essenza.ng/>
161. Jumia Nigeria. "Jumia Nigeria - Health & Beauty category page (descriptive title)". Published: n.d. <https://www.jumia.com.ng/health-beauty/>
162. Jumia. "Start Your Success Story with Jumia - Jumia VendorHub NG". Published: n.d. <https://vendorhub.jumia.com.ng/>
163. Konga. "Konga.com homepage (descriptive title)". Published: n.d. <https://www.konga.com/>
164. Konga. "Konga search results page for 'nivea' (descriptive title)". Published: n.d. <https://www.konga.com/search?search=nivea>
165. Chowdeck. "Food, Groceries & Local Markets Delivery Near You | Chowdeck". Published: n.d. <https://chowdeck.com/>
166. Glovo. "Glovo Mart delivery in Lagos | Glovo". Published: n.d. <https://glovoapp.com/en/ng/lagos/stores/glovomart>
167. Glovo. "SPAR Market delivery in Lagos | Glovo". Published: n.d. <https://glovoapp.com/en/ng/lagos/stores/spar-los>
168. HealthPlus. "HealthPlus search results (brand queries run 2026-11-26; example URL for 'nivea')". Published: n.d. <https://healthplusnigeria.com/search?q=nivea&type=product>
169. HealthPlus. "HealthPlus public product JSON feed (Shopify storefront)". Published: n.d. <https://healthplusnigeria.com/collections/all/products.json?limit=5>
170. MedPlus. "Medplus Limited | Online Pharmacy". Published: n.d. <https://medplusnig.com/>
171. MedPlus. "MedPlus product search results (brand queries run 2026-11-26; example URL for 'nivea')". Published: n.d. <https://medplusnig.com/products?name=nivea>
172. Supermart.ng. "Supermart.ng". Published: n.d. <https://www.supermart.ng/>
173. 24 Hours Market. "Same Day Delivery Lagos | 1-3 Hour Express - 24hoursmarket". Published: n.d. <https://24hoursmarket.com/>
174. 24 Hours Market. "24 Hours Market search results (brand queries run 2026-11-26; example URL for 'nivea')". Published: n.d. <https://24hoursmarket.com/?s=nivea&post_type=product>
175. BuyBetter. "Original Skincare in Nigeria | BuyBetter". Published: n.d. <https://buybetter.ng/>
176. BuyBetter. "BuyBetter search results (brand queries run 2026-11-26; example URL for 'nivea')". Published: n.d. <https://buybetter.ng/?s=nivea&post_type=product>
177. Essenza. "Essenza: Fragrance | Skincare | Makeup". Published: n.d. <https://www.essenza.ng/>
178. Essenza. "Essenza search results (brand queries run 2026-11-26; example URL for 'nivea')". Published: n.d. <https://www.essenza.ng/search?q=nivea&type=product>
179. Temu. "Temu (Nigeria country path; redirects to a login page in a headless browser)". Published: n.d. <https://www.temu.com/ng>
