# Appendix B1 - E-commerce platforms for mass-market beauty and personal care: UAE, Saudi Arabia and Malaysia

Research date: 2026-11-26. Scope: which online platforms a brand owner in mass-market hair care, skin care and oral care should monitor first in the United Arab Emirates (AE), Saudi Arabia (SA) and Malaysia (MY). The machine-readable records are in `data/research/marketplaces/AE.json`, `SA.json` and `MY.json`; this appendix explains the ranking, the top three in each country, the D2C landscape, what was left out and what remains uncertain.

## How the evidence was collected

Every fact below comes from a page or search result retrieved on 2026-11-26. The shared web-search allowance for the session ran out after 20 queries, so most of the evidence was gathered by retrieving known pages directly: traffic-estimate pages (Semrush and Similarweb public pages), company investor-relations pages and app-store listings, official developer documentation, news articles already located, the retailers' own brand and category pages, and brand owners' "where to buy" pages. Pages were read with plain HTTP requests, the session's fetch tool and, for script-rendered public pages, a headless browser. No account was created, no form submitted and no CAPTCHA or anti-bot check bypassed; sites that refused automated access are recorded as such and their assortment is marked unverified. Search-engine `site:` results were used only for noon, before the allowance ran out.

Three points apply to every number in this appendix:

- **No verified market share was found** for any platform in any of the three countries. Nothing below comes from a regulator or an audited share disclosure; "share" figures are survey usage rates, modelled rankings or analyst statements and are labelled as such.
- **Traffic figures are third-party estimates of website visits** for October 2026. They exclude apps, so app-first services (noon, talabat, TikTok Shop, Grab, delivery apps) are understated. The two estimators often disagree: for amazon.sa Semrush shows 15.5 million visits and Similarweb 55.7 million [1][2]. Semrush's month-to-month figures are also volatile (shopee.com.my: 62.7 million in September, 34 million in October) [3].
- **Competitor presence was checked against 12 reference brands** (Dove, Pantene, L'Oreal Paris, Garnier, Head & Shoulders, Nivea, Vaseline, Colgate, Sensodyne, Himalaya, Dabur, Parachute) on each platform's own pages where they could be read, otherwise through brand-owner links; each record says how.

## Scoring method

Each platform is scored 1-5 on five criteria and weighted as specified: e-commerce significance 0.20, beauty category relevance 0.25, consumer reach 0.20, brand and competitor coverage 0.15, data integration feasibility 0.20. Rank is by weighted score within the country; ties are broken by beauty relevance, then reach. Where a tie survived both, I added three further tie-breaks (e-commerce significance, then the Semrush in-country visit estimate, then alphabetical order); these are not part of the brief and are disclosed in each file's `ranking_method_note`, together with the anchors used for each score. They decided three pairs: Lulu above Aster Pharmacy in the UAE, SHEIN above Temu in Saudi Arabia and GrabMart above foodpanda in Malaysia. Scores are judgements from the evidence, not measurements. Two systematic effects are worth knowing before reading the tables:

- Data feasibility and brand coverage together carry 35% of the weight, and both depend on whether a site could be read. Retailers that block automated access (Carrefour UAE, Lulu, Watsons Malaysia) score lower than their market position alone would suggest; small retailers with open storefront data (Watsons UAE, BIG Pharmacy, CARiNG) score higher.
- A documented seller API (Amazon, noon, Shopee, Lazada, TikTok Shop) returns the brand owner's own shop data. Only Amazon's documentation describes competitive price and offer data [4]. On every other platform, competitors' listings, prices and reviews would need an authorised data provider or manual sampling; no such provider was verified in this session.

## United Arab Emirates

### Landscape

EZDubai and Euromonitor put UAE retail e-commerce at AED 42.2 billion (USD 11.5 billion) in 2025, about 15.7% of retail sales, with apparel and footwear the largest category; beauty and personal care is not broken out in the public release [5]. By website audience in October 2026, amazon.ae leads (11.24 million UAE visits), followed by temu.com (5.67 million), noon.com (5.02 million), shein.com (2.44 million) and carrefouruae.com (2.26 million) [6]; Similarweb's top-five list has the same first three [7]. noon is app-first, with a 50M+ install band and a company claim of more than 50 million users across the Middle East, so the web figure understates it [8].

For personal care specifically, ECDB models an online share of only 5-10% and names Amazon, Noon and Temu as the three largest online retailers [9]. The category is still mostly bought offline, in hypermarkets and in the country's 3,000+ pharmacies; JLL counts 475+ Life Pharmacy stores and 245+ Aster outlets and describes pharmacy e-commerce revenue as low [10]. Online, the pharmacy sites are small next to the marketplaces: myaster.com 747 thousand and lifepharmacy.com 425 thousand UAE visits [11].

Grocery and quick commerce are growing. Lulu reported group e-commerce sales of USD 177 million in the third quarter of 2026, up 53% and equal to 9.7% of retail sales [12]; Carrefour's app was reported to have over 1.5 million active UAE users in October 2025 [13]; talabat reported group GMV of about USD 3 billion for the third quarter of 2026 and is investing in grocery delivery [14]. None of these discloses a UAE personal-care figure.

### Ranked platforms

| Rank | Platform | Category | Weighted score | Top 3 | One-line rationale | Confidence |
|---:|---|---|---:|:---:|---|---|
| 1 | Amazon.ae | General marketplace | 4.85 | Yes | Largest evidenced online audience in the UAE, the top modelled seller of personal care and the only platform with a documented API that returns competitive price/offer data. | high |
| 2 | Noon (incl. Noon Minutes / Supermall) | General marketplace | 4.40 | Yes | Second-largest evidenced platform for mass personal care in the UAE with very broad brand coverage and a seller API; it trails Amazon.ae on measurable web reach and on legitimate access to competitor data. | medium |
| 3 | Life Pharmacy | Pharmacy / health | 3.55 | Yes | The best-evidenced specialist for mass hair, skin and oral care in the UAE: near-complete brand coverage and readable public pages. | medium |
| 4 | Carrefour UAE | Grocery / supermarket | 3.45 |  | The leading grocery e-commerce destination in the UAE and probably a larger seller of mass personal care than its rank suggests. | medium |
| 5 | Temu | Cross-border marketplace | 3.25 |  | A price-led competitor with a large audience that may be taking personal-care volume; monitor at category level rather than brand level. | low |
| 6 | Talabat (talabat mart) | Quick commerce / delivery | 3.05 |  | The largest quick-commerce and delivery platform evidenced for the UAE; worth monitoring for availability and price in impulse/top-up missions, but data access is hard and category depth is unproven. | medium |
| 7 | Watsons UAE | Beauty specialist | 3.00 |  | Small audience but highly relevant assortment and the easiest data access in the set, which makes it a cheap early addition for price and range tracking. | medium |
| 8 | Lulu Hypermarket (Lulu Online) | Grocery / supermarket | 3.00 |  | A fast-growing online grocery business with solid company-reported numbers, but nothing about its personal-care assortment or data access could be confirmed, which keeps it mid-table. | medium |
| 9 | Aster Pharmacy (myAster) | Pharmacy / health | 3.00 |  | A credible second pharmacy channel with strong app adoption; ranks below Life Pharmacy because fewer mass brands could be verified. | medium |
| 10 | Mumzworld | Other (mother and baby) | 2.90 |  | Small but unusually complete mass-brand coverage for a specialist; useful for baby and family personal-care lines, lower priority otherwise. | medium |
| 11 | SHEIN | Cross-border marketplace | 2.80 |  | Large audience but marginal for mass hair, skin and oral care; watch for category drift rather than monitor routinely. | low |
| 12 | Boots UAE | Pharmacy / health | 2.25 |  | A recognised health-and-beauty banner with limited evidenced online reach in the UAE and little verified overlap with mass hair, skin and oral care brands. | low |
| 13 | Namshi | Fashion / department store | 2.20 |  | Relevant mainly for premium and derma skincare; low overlap with mass hair and oral care and poor data access. | low |
| 14 | Sephora Middle East | Beauty specialist | 2.05 |  | Included as the representative prestige specialist; it is a different competitive set and a low priority for a mass-market brand owner. | medium |
| 15 | Careem (Careem Quik) | Quick commerce / delivery | 2.00 |  | A secondary quick-commerce outlet with a narrow range and no realistic automated data route; low priority until Quik-specific scale is evidenced. | low |
| 16 | Huda Beauty (brand-owned store) | D2C brand site | 1.80 |  | Included to represent the D2C channel; not a monitoring priority for a mass-market brand owner. | medium |

### Why these three

**Amazon.ae** has the largest measured audience, is the modelled leader for online personal care and was the only UAE platform where both deep mass-brand listings (648 results for "dove shampoo", 535 for "pantene") and an official API with competitive-pricing operations could be verified [15][16][17][4]. It is first on the evidence, not by default. **Noon** is the second general marketplace, with pages for ten of the twelve reference brands seen in search results and a seller API, but its storefront refused automated access, which costs it feasibility points [18][19][20]. **Life Pharmacy** is third because it is the one specialist whose assortment could be verified almost completely (11 of 12 reference brands in its public brand directory) on pages that can be read without restriction [21].

Reservation: third place is narrow (3.55 against 3.45 for Carrefour UAE). Carrefour is the most-visited grocery site and probably sells more mass personal care online than Life Pharmacy; it ranks fourth because its site could not be read, so its assortment is unverified and its data feasibility is low. If the product owner can obtain retailer data from Carrefour directly, it should be treated as a top-three platform. Temu's fifth place reflects audience size and one modelled category ranking, not verified relevance to branded products.

### D2C landscape

Brand-owned selling of mass personal care appears to be marginal in the UAE. The brand sites checked send shoppers to retailers rather than selling direct: CeraVe's regional site lists Amazon.ae, noon, Namshi, Boots, Life Pharmacy, myAster, BinSina and BasharaCare as places to buy, and the Pantene Arabia site links to an Amazon.ae brand store [22][23]. Himalaya runs a regional brand site, whose checkout capability was not verified [24]. The visible D2C activity is in prestige beauty: hudabeauty.com is the second most-visited site in Semrush's UAE beauty list with about 217 thousand UAE visits a month, which is why it is included as the single D2C record [25][26]. For mass brands, the practical "D2C" channel is the official brand store inside Amazon.ae and noon.

### Considered but not profiled

| Platform | Why it was left out | Evidence |
|---|---|---|
| Noon Minutes | Covered inside the Noon record; described in the noon app listing as a fast-delivery service, with no separate figures found | [8] |
| InstaShop | Operating according to traffic estimates (about 44 thousand UAE web visits; app-first) but the site refused automated access; current ownership and scale could not be verified | [27][28] |
| BinSina Pharmacy | Third pharmacy site by visits (218 thousand) and a listed CeraVe retailer, but the site refused access, so nothing else could be verified; a candidate for a follow-up | [11][22] |
| Nahdi (UAE) | Emerging: nahdionline.com draws about 116 thousand UAE visits, ranks fifth in Similarweb's UAE beauty list and reported 35.5% UAE revenue growth in 2025; still small | [11][29][30] |
| Faces | Prestige fragrance, make-up and skincare (app listing cites Chanel, Dior, Gucci); about 179 thousand UAE visits; Sephora is profiled as the prestige representative | [31][32] |
| Golden Scent, Nice One | Saudi-centred; goldenscent.com shows only about 5.5 thousand UAE visits and no evidence of Nice One UAE activity was found | [25] |
| BasharaCare | Derma-skincare specialist with under 10 thousand UAE visits | [25][22] |
| Union Coop, Spinneys, Waitrose, Kibsons | Grocers with far smaller web audiences than Carrefour or Lulu (205, 171, 36 and 30 thousand visits); Union Coop, Spinneys and Kibsons refused automated access and Waitrose was not tested | [27] |
| Deliveroo, Keeta | Food-led delivery apps; no grocery or personal-care evidence collected (deliveroo.ae about 469 thousand visits; Keeta's site about 17 thousand UAE visits) | [27][33][34][35] |
| Trendyol, AliExpress, iHerb | Cross-border sites with 244 thousand, 1.39 million and 313 thousand UAE visits; no evidence of relevance to mass personal care in the UAE | [6] |
| Sharaf DG, Ounass, dubizzle | Electronics, luxury fashion and classifieds: outside the category | [6][7] |
| TikTok Shop, Amazon Now | Could not be verified as operating in the UAE in this session; not profiled | - |

## Saudi Arabia

### Landscape

Online spending is growing fast: e-commerce payments on mada cards alone reached a record SAR 30.7 billion in October 2025, 68% more than a year earlier, and SAR 88.3 billion in the third quarter of 2025, according to the Saudi Central Bank bulletin as reported by Asharq Al-Awsat; the series excludes credit cards and was the latest official figure found, about 13 months old [36]. By website audience in October 2026, amazon.sa (10.45 million Saudi visits) and noon.com (8.94 million) lead, followed by shein.com (7.97 million), temu.com (5.61 million) and aliexpress.com (5.24 million) [37][38].

Beauty and personal care is where Saudi Arabia differs most from the UAE: the pharmacy chains lead the category online. Similarweb ranks nahdionline.com and al-dawaa.com first and second among beauty and cosmetics sites [39]. Nahdi reports 1,219 pharmacies and 30.6% of its SAR 8.16 billion nine-month revenue from online channels [40]. ECDB models personal-care e-commerce at USD 1,177 million in 2025, an online share of 15-20%, with Nahdi Online (USD 760 million), Nice One and Trendyol as the three largest retailers [41]. Nice One, the listed beauty pure player, reported revenue of SAR 257 million for the third quarter of 2026 [42].

Grocery sites (Panda, Danube, Lulu, Carrefour, Tamimi) and quick-commerce apps (Ninja, HungerStation, Nana, Keeta) are active; Ninja's website alone draws about 3.1 million visits a month, roughly double a year earlier [43]. They disclose little about personal care.

### Ranked platforms

| Rank | Platform | Category | Weighted score | Top 3 | One-line rationale | Confidence |
|---:|---|---|---:|:---:|---|---|
| 1 | Amazon.sa | General marketplace | 4.60 | Yes | Largest measured online audience in the Kingdom plus the only documented API returning competitive price data. | medium |
| 2 | Noon (incl. Noon Minutes / Supermall) | General marketplace | 4.20 | Yes | The main regional marketplace alongside Amazon.sa with broad mass-brand coverage; it trails on data access and on Saudi-specific assortment verification. | medium |
| 3 | Nahdi Online | Pharmacy / health | 4.05 | Yes | The category leader for health and beauty online in Saudi Arabia on every piece of evidence found. | high |
| 4 | Al-Dawaa Pharmacies | Pharmacy / health | 3.80 |  | The natural companion to Nahdi for category monitoring: similar assortment depth and audience, slightly weaker evidence on online sales. | medium |
| 5 | Nice One | Beauty specialist | 3.40 |  | The leading beauty pure player, most relevant for skin and body care; weaker for hair and oral care where the pharmacies carry far deeper ranges. | medium |
| 6 | iHerb (Saudi storefront) | Cross-border marketplace | 3.20 |  | An overlooked cross-border channel with a large Saudi audience and some mass personal-care overlap; worth early price and range checks. | medium |
| 7 | Panda (Panda / Hyper Panda online) | Grocery / supermarket | 3.15 |  | The best-evidenced online grocer for mass personal care in the Kingdom and a good source of promotional price intelligence. | medium |
| 8 | HungerStation (HMarket / HungerStation Market) | Quick commerce / delivery | 3.05 |  | Large audience and a growing mart offer make it a relevant availability and pricing touchpoint, but category depth and data access are both weak. | low |
| 9 | Danube Online | Grocery / supermarket | 3.00 |  | A second grocery reference point after Panda with a premium shopper base; evidence is thinner on both reach and assortment. | low |
| 10 | Ninja | Quick commerce / delivery | 2.85 |  | The quick-commerce platform with the strongest audience signal in the Kingdom; important to watch but hard to instrument. | low |
| 11 | Trendyol | Cross-border marketplace | 2.85 |  | An emerging cross-border competitor flagged by one modelled ranking; worth a periodic check, not routine monitoring, until its brand mix is understood. | low |
| 12 | SHEIN | Cross-border marketplace | 2.80 |  | Very large audience but marginal for mass hair, skin and oral care. | low |
| 13 | Temu | Cross-border marketplace | 2.80 |  | Large but declining audience and no evidenced relevance to branded mass personal care; low priority. | low |
| 14 | Whites | Beauty specialist | 2.65 |  | Relevant assortment but very weak evidence of online reach; keep on a watch list rather than in the first monitoring wave. | low |
| 15 | Namshi | Fashion / department store | 2.40 |  | Low overlap with mass hair, skin and oral care and poor data access; lowest priority in the set. | low |

### Why these three

**Amazon.sa** and **Noon** take the first two places on total audience and, for Amazon, on the only API that documents competitive price data [37][17][4]. **Nahdi** is third and is the category leader on every piece of category evidence found: first in Similarweb's beauty ranking, first in ECDB's personal-care ranking, nearly a third of a SAR 8 billion business online, and listing pages that show Dove, Pantene, L'Oreal Paris Elvive, Garnier, Sunsilk, Nivea and Dabur [39][41][40][44][45].

Reservation: the formula places Amazon.sa and Noon above Nahdi because it rewards total audience and API access. For mass hair, skin and oral care, Nahdi probably sells more online than either, and Al-Dawaa (fourth, with 100-200 products each for Dove, Pantene, Nivea and Garnier) is close behind [46][47][48][49]. A monitoring plan built for this category should treat the two pharmacy chains as first-wave targets alongside the two marketplaces. Amazon.sa's brand coverage is only partly verified because its pages began refusing requests.

### D2C landscape

Direct selling is a visible part of Saudi e-commerce, but it appears concentrated in fragrance and local brands rather than mass personal care. The most-visited sites in Semrush's Saudi beauty list include 3saf.com (4.27 million visits), arabianoud.com (1.89 million) and daralamirat.com.sa (1.29 million), all ahead of Nice One, and Similarweb's top five likewise features perfume sites (arabianoud.com, ibraqperfumes.com); these sites were not examined individually [50][39]. Independent stores can be built on local platforms such as Salla, whose own site draws about 5 million Saudi visits a month and which publishes a merchant API [51][52]. For the mass brands checked, the brand site sends shoppers to retailers: CeraVe lists Nahdi, Al-Dawaa, Whites, Nice One, Boots, Amazon.sa and noon [22]. No D2C record is included for Saudi Arabia because no brand-owned site relevant to mass hair, skin or oral care was found.

### Considered but not profiled

| Platform | Why it was left out | Evidence |
|---|---|---|
| United Pharmacy | Material: about 2.14 million Saudi visits, the fourth-largest site in the pharmacy list. The site refused automated access, so operator, assortment and services could not be verified. The strongest candidate for a follow-up | [53] |
| Sidalih.com, Lemon, Chefaa, Adam | Smaller pharmacy sites (872, 293, 163 and 149 thousand visits) | [53] |
| Othaim Markets | Large web audience (2.67 million visits), but the site read is a corporate and offers site and online ordering could not be verified; the app it links to is named Iktissab | [43][54][55] |
| Lulu, Carrefour KSA, Tamimi, BinDawood | Further grocers (814, 450, 399 and 37 thousand visits); Lulu's Saudi revenue fell 6.6% in the third quarter of 2026; Panda and Danube are profiled as the grocery representatives | [37][43][12][56] |
| Nana | Quick-commerce app claiming 22,000 products, 2,000 beauty brands and 20-minute delivery; 1M+ installs, but its Android app was last updated in June 2026 and no traffic or sales evidence was found | [57][58] |
| Keeta, Jahez, Mrsool, Careem | Delivery apps with large install bands (10M+, 5M+, 10M+, 50M+); the Keeta and Jahez listings describe food delivery only, and no grocery or personal-care evidence was collected | [35][59][60][61] |
| Golden Scent | Fragrance-led beauty site with about 114 thousand visits; site refused access | [50] |
| Faces, Sephora, Boots | Prestige or derma-led beauty retailers (faces.sa about 537 thousand Saudi visits; Sephora and Boots far smaller); low overlap with mass brands | [62][63][50] |
| Boutiqaat | Still receiving traffic (about 190 thousand Saudi visits, more from Kuwait) but the site refused access and its current operating status could not be verified beyond that | [64] |
| Mumzworld | Mother-and-baby store with about 418 thousand Saudi visits; profiled under the UAE, where its brand directory was verified | [37] |
| AliExpress, Jarir, Extra, Haraj | Cross-border general merchandise, books and electronics, and classifieds: large audiences but outside the category | [37][38] |
| TikTok Shop | Could not be verified as operating in Saudi Arabia in this session | - |

## Malaysia

### Landscape

Google, Temasek and Bain project Malaysian e-commerce GMV of USD 25 billion in 2026, up 22% [65]. The official DOSM e-commerce income series is much larger because it counts all establishments, including business-to-business sales: RM937.5 billion in the first nine months of 2025 [66]; e-commerce gross value added was RM267.6 billion in 2025, 13.2% of GDP [67]. Momentum Works reports that platform GMV grew 47.6% in 2025 [68].

Consumer activity is concentrated on two platforms. In Ipsos's May 2026 survey, 71% of people who had bought online in the past six months had used Shopee and 62% TikTok (up from 43% in 2024); Facebook was at 12% and Lazada had fallen to 5% from 15% in 2024 [69]. Euromonitor says Shopee and TikTok Shop recorded almost equivalent sales in Malaysia in 2025 [70]. Web traffic tells the Shopee part of that story (26 million Malaysian visits against 4.8 million for Lazada) but not the TikTok part, because TikTok Shop purchases happen in the app [71][72].

Beauty is moving online quickly: 45% of online purchasers bought beauty care products or cosmetics in the past six months, up from 29% a year earlier, and 28% bought personal care products [69]. ECDB's model ranks TikTok Shop, Shopee and Lazada as the three largest online personal-care retailers [73]. Among retailers' own sites, Similarweb ranks watsons.com.my first for beauty, ahead of sephora.my [74].

### Ranked platforms

| Rank | Platform | Category | Weighted score | Top 3 | One-line rationale | Confidence |
|---:|---|---|---:|:---:|---|---|
| 1 | Shopee Malaysia | General marketplace | 4.65 | Yes | The default destination for online shopping in Malaysia and the place where mass-market brand owners themselves run flagship stores; highest reach, strong category evidence and a documented API. | high |
| 2 | TikTok Shop Malaysia | Social commerce | 4.50 | Yes | The fastest-growing commerce platform in Malaysia and probably the largest for personal care, with a mature seller API. | medium |
| 3 | Lazada Malaysia | General marketplace | 3.80 | Yes | Still carries official brand stores and offers a documented API, which keeps it third under the rubric. | medium |
| 4 | BIG Pharmacy | Pharmacy / health | 3.35 |  | Ranks fourth because its assortment and prices are fully verifiable and easy to collect. | medium |
| 5 | Watsons Malaysia | Beauty specialist | 3.30 |  | The most important specialist for the category in Malaysia. | medium |
| 6 | CARiNG Pharmacy (e-store) | Pharmacy / health | 3.20 |  | Small audience, but verified mass-brand listings and easy price collection make it a low-cost pharmacy benchmark. | medium |
| 7 | Guardian Malaysia | Pharmacy / health | 3.05 |  | A core offline competitor set with a smaller online audience than Watsons; second-wave monitoring target. | medium |
| 8 | Lotus's Shop Online | Grocery / supermarket | 3.00 |  | The best-evidenced grocery e-commerce site for mass personal care in Malaysia; a sensible second-wave addition for promotional pricing. | medium |
| 9 | GrabMart | Quick commerce / delivery | 2.65 |  | A relevant convenience touchpoint through partner supermarkets and pharmacies, but opaque and hard to instrument. | low |
| 10 | foodpanda (pandamart) | Quick commerce / delivery | 2.65 |  | A quick-commerce touchpoint comparable to GrabMart; low priority until category depth can be evidenced. | low |
| 11 | Temu | Cross-border marketplace | 2.40 |  | A declining cross-border audience with no evidenced relevance to branded mass personal care; low priority. | low |
| 12 | ZALORA Malaysia | Fashion / department store | 2.40 |  | Marginal for mass hair, skin and oral care; relevant only if premium or masstige lines are in scope. | low |
| 13 | PG Mall | General marketplace | 2.00 |  | The only local general marketplace with measurable traffic, but too small and too opaque to prioritise. | low |
| 14 | Sephora Malaysia | Beauty specialist | 1.85 |  | Included as the representative prestige specialist; lowest priority for a mass-market brand owner. | medium |

### Why these three

**Shopee** is the default: the most-used platform, the largest web audience, a documented open API and the place where brand owners themselves run flagship stores; the Malaysian sites of Pantene, Head & Shoulders, Sensodyne, NIVEA and Safi all link to official Shopee stores [69][75][76][77][78][79][80]. **TikTok Shop** is second on usage and is modelled as the largest online personal-care seller, with a mature seller API [69][73][81]; its weakness is that no reference mass brand could be verified there. **Lazada** is third because it still hosts official brand stores for P&G, Haleon and Wipro Unza brands and has a documented API [76][78][80][82].

Reservation: Lazada's consumer usage has collapsed (5% of online purchasers), so the formula probably overstates it. Watsons Malaysia, the top-ranked beauty site, scores 3.30 and ranks fifth only because its site blocked verification and data access; BIG Pharmacy ranks fourth because its listings and prices are fully readable, although its audience is small [74][83]. If the choice is about where category shoppers are, Watsons deserves the third monitoring slot ahead of Lazada.

### D2C landscape

In Malaysia the brand-owned channel is the official store inside a marketplace. Every mass-brand site checked routes its "buy" links to Shopee and Lazada official stores, and Safi's also to its Watsons and Guardian brand pages [76][77][78][79][80]. Stand-alone brand sites are small and mostly prestige: in Semrush's Malaysian beauty list the largest are bathandbodyworks.com.my (262 thousand visits), yslbeauty.com.my (225 thousand) and kiehls.com.my (85 thousand) [84]. No D2C record is included for Malaysia; monitoring official stores on Shopee, Lazada and TikTok Shop covers the channel.

### Considered but not profiled

| Platform | Why it was left out | Evidence |
|---|---|---|
| Alpro Pharmacy | Operating, with Pantene, Colgate, Sensodyne and Nivea verified in its store data and a "Sell With Alpro" programme, but only about 21 thousand visits | [85][86] |
| AA Pharmacy | Small (about 38 thousand visits); not examined | [87] |
| Hermo | The old hermo.my address now redirects to a relaunched store ("Welcome back to HERMO! Website sale launching 17 July 2026") carrying about 16 Korean beauty brands and no mass brands; negligible measured traffic | [88] |
| Sasa | sasa.com.my shows about 72 thousand visits in Semrush's beauty list but could not be reached from this environment, so nothing else was verified | [84] |
| myAEON2go, Jaya Grocer, Mydin | Grocers with smaller web audiences than Lotus's (164, 217 and 66 thousand visits); myAEON2go refused access; Jaya Grocer runs an open online store | [89][90] |
| Shein, AliExpress, Taobao | Cross-border sites with 409 and 797 thousand Malaysian visits for the first two; no Malaysia-specific evidence was found for Taobao, whose top traffic countries on Semrush do not include Malaysia | [71][91][92] |
| Facebook and other social selling | 12% of online purchasers reported buying on Facebook in 2026; not a platform with listings that can be monitored | [69] |
| Mudah, Carousell | Classifieds; outside the category | [72][71] |
| Mr DIY, Senheng, Coway, 7-Eleven | Large retail sites outside the category | [71] |
| Althea, Youbeli, Lelong | No traffic data was found for the addresses tried, and their operating status was not verified; not profiled | - |

## Limitations and gaps

- **Search allowance exhausted.** Only 20 web searches could be run before the session's shared limit was reached. Everything after that relied on retrieving known pages, so facts that needed discovery remain open: current ownership of InstaShop and Namshi, the parent companies of HungerStation, Lazada and Temu, whether TikTok Shop and Amazon's quick-commerce service operate in the Gulf, and store counts for Watsons Malaysia, BIG Pharmacy and Whites. These are marked "not verified" or "Not found" in the records.
- **No verified market shares.** No regulator or audited source gives platform shares in any of the three countries. The closest proxies are the Ipsos usage survey (Malaysia), ECDB's modelled category rankings and company-reported revenue (Nahdi, Nice One, Lulu, talabat).
- **Traffic estimates are rough.** Semrush and Similarweb differ by a factor of two to three for some sites and exclude apps. The fetch tool read Similarweb's headline "Total Visits" label ambiguously (it sits next to a three-month chart); the figures are treated as latest-month totals because they track each site's global rank, but this was not confirmed. Only Similarweb's and Semrush's public pages were used; the Similarweb connector available in this workspace was not authorised.
- **Blocked sites.** Carrefour UAE and KSA, Lulu, Namshi, talabat, InstaShop, BinSina, Union Coop, Spinneys, Kibsons, Golden Scent, United Pharmacy, Boutiqaat, Jahez, Watsons Malaysia, Zalora, myAEON2go, foodpanda and PG Mall refused automated access or presented a robot check. Their assortments are unverified and their data feasibility is scored low; this depresses the ranks of Carrefour UAE, Lulu and Watsons Malaysia in particular. Amazon's search pages answered the first requests and then returned HTTP 503.
- **Brand checks are a point-in-time sample.** Presence was checked for a subset of the 12 reference brands, usually on one or two pages, and says nothing about price, stock, seller identity or counterfeit risk. Oral care is unverified at Nahdi and Al-Dawaa.
- **Dated or undated figures.** talabat's active-customer figure is from September 2024; Shopee's group GMV is for 2024; the mada figures end in October 2025 and the DOSM income figure in September 2025; Nice One's customer base, Al-Dawaa's store and customer counts, Guardian's "500 stores" and Panda's store count are undated company statements.
- **ECDB figures are modelled** and its public pages contain inconsistencies (for Malaysia, a 0-5% online share alongside USD 1.07 billion of online personal-care revenue), so its rankings are used as indications only.
- **Third-party data providers were not assessed.** For most platforms the realistic way to obtain competitors' prices, listings and reviews at scale is an authorised provider or a data-sharing agreement with the retailer; availability, coverage and cost were not researched.
- **Scores are judgements.** Small differences (for example 3.55 against 3.45) are not meaningful; the reservations stated for each country matter more than the decimal places.

## Sources

All sources were accessed on 2026-11-26. "n.d." means no publication date was shown.

1. Semrush - amazon.sa Website Traffic, Ranking, Analytics [October 2026] [page "Last updated" date; October 2026 data]. https://www.semrush.com/website/amazon.sa/overview/ (published: 2026-11-11)
2. Similarweb - amazon.sa - Similarweb website analysis page [page titled October 2026]. https://www.similarweb.com/website/amazon.sa/ (published: 2026-10)
3. Semrush - shopee.com.my Website Traffic, Ranking, Analytics [October 2026] [page "Last updated" date; October 2026 data]. https://www.semrush.com/website/shopee.com.my/overview/ (published: 2026-11-11)
4. Amazon - Product Pricing API - Selling Partner API documentation. https://developer-docs.amazon/sp-api/docs/product-pricing-api (published: n.d.)
5. Zawya (press release; EZDubai / Euromonitor International) - EZDubai Logistics Hub: UAE e-commerce market size reaches AED 42.2bln in 2025 [2026; Gulf Today coverage dated 2026-09-28]. https://www.zawya.com/en/press-release/research-studies/ezdubai-logistics-hub-uae-e-commerce-market-size-reaches-aed-42.2bln-in-2025-1286875 (published: n.d.)
6. Semrush - Most Visited Retail Websites in the United Arab Emirates, October 2026 [page states "Updated October 2026"]. https://www.semrush.com/trending-websites/ae/retail (published: 2026-10)
7. Similarweb - Top Ecommerce & Shopping Websites Ranking in United Arab Emirates, October 2026 [page "Last updated"]. https://www.similarweb.com/top-websites/united-arab-emirates/e-commerce-and-shopping/ (published: 2026-11-01)
8. Google Play (listing published by noon e-commerce) - noon Online Shopping & Grocery - Apps on Google Play [date shown is when the store listing was last updated]. https://play.google.com/store/apps/details?id=com.noon.buyerapp&hl=en (published: 2026-11-26)
9. ECDB - Personal Care Industry in the UAE (e-commerce market sample data) [data to October 2026]. https://ecdb.com/resources/sample-data/market/ae/personal-care (published: n.d.)
10. JLL - Navigating through the UAE's retail pharmacy landscape. https://www.jll.com/en-ae/insights/navigating-through-the-uaes-retail-pharmacy-landscape (published: 2025-10-13)
11. Semrush - Most Visited Pharmaceuticals Websites in the United Arab Emirates, October 2026 [page states "Updated October 2026"]. https://www.semrush.com/trending-websites/ae/pharmaceuticals (published: 2026-10)
12. EnterpriseAM UAE - 3Q results from Lulu, DAE, Binghatti and Alec Holdings. https://enterpriseam.com/uae/2026/11/12/3q-results-from-lulu-dae-binghatti-and-alec-holdings/ (published: 2026-11-12)
13. Gulf News - Why Carrefour stores are shutting down abroad - but thriving in the UAE. https://gulfnews.com/business/retail/why-carrefours-global-decline-doesnt-match-its-success-seen-in-the-uae-1.500313517 (published: 2025-10-20)
14. Gulf News - talabat raises 2026 outlook again as third-quarter orders grow [page "Last updated"]. https://gulfnews.com/business/retail/talabat-raises-2026-outlook-again-as-third-quarter-orders-grow-1.500748848 (published: 2026-11-16)
15. Amazon.ae - Amazon.ae: Dove Shampoo (public search results page) [live page]. https://www.amazon.ae/s?k=dove+shampoo (published: n.d.)
16. Amazon.ae - Amazon.ae: Pantene (public search results page) [live page]. https://www.amazon.ae/s?k=pantene (published: n.d.)
17. Amazon - Marketplace IDs - Selling Partner API documentation (developer-docs.amazon.com redirects here). https://developer-docs.amazon/sp-api/docs/marketplace-ids (published: n.d.)
18. noon - Pantene UAE Store (noon brand page, seen as a search-engine site: result). https://www.noon.com/uae-en/pantene/ (published: n.d.)
19. noon - Head & Shoulders Shampoos UAE (noon category page, seen as a search-engine site: result). https://www.noon.com/uae-en/beauty/hair-care/shampoo-and-conditioners/shampoos-18048/head_shoulders/ (published: n.d.)
20. noon - noon API platform | noon Seller Help Center. https://helpcenter.noon.partners/en/category/global-selling/noon-api-platform (published: n.d.)
21. Life Pharmacy - Our Brands | Life Pharmacy UAE - Online Pharmacy [live page]. https://www.lifepharmacy.com/brands (published: n.d.)
22. CeraVe Arabia (L'Oreal Middle East) - Where to Buy CeraVe Products in Saudi Arabia | CeraVe Official. https://www.ceravearabia.com/en/where-to-buy (published: n.d.)
23. Pantene Arabia (P&G) - Pantene Arabia (page links to an Amazon.ae brand store). https://pantenearabia.com/en-ae/ (published: n.d.)
24. Himalaya Wellness - Himalaya Wellness (ME) brand site [live page]. https://himalayawellness.ae/ (published: n.d.)
25. Semrush - Most Visited Beauty & Cosmetics Websites in the United Arab Emirates, October 2026 [page states "Updated October 2026"]. https://www.semrush.com/trending-websites/ae/beauty-and-cosmetics (published: 2026-10)
26. Semrush - hudabeauty.com Website Traffic, Ranking, Analytics [October 2026] [page "Last updated" date; October 2026 data]. https://www.semrush.com/website/hudabeauty.com/overview/ (published: 2026-11-11)
27. Semrush - Most Visited Food & Beverages Websites in the United Arab Emirates, October 2026 [page states "Updated October 2026"]. https://www.semrush.com/trending-websites/ae/food-and-beverages (published: 2026-10)
28. Semrush - instashop.com Website Traffic, Ranking, Analytics [October 2026] [page "Last updated" date; October 2026 data]. https://www.semrush.com/website/instashop.com/overview/ (published: 2026-11-11)
29. Similarweb - Top Beauty and Cosmetics Websites Ranking in United Arab Emirates, October 2026 [page "Last updated"]. https://www.similarweb.com/top-websites/united-arab-emirates/lifestyle/beauty-and-cosmetics/ (published: 2026-11-01)
30. Nahdi Medical Company - Business Overview: 2025 highlights at a glance [FY2025 figures]. https://investors.nahdi.sa/en/about-us/business-overview (published: n.d.)
31. Semrush - faces.ae Website Traffic, Ranking, Analytics [October 2026] [page "Last updated" date; October 2026 data]. https://www.semrush.com/website/faces.ae/overview/ (published: 2026-11-11)
32. Google Play (listing published by ALLIED ENTERPRISES LLC) - FACES Beauty - Apps on Google Play [date shown is when the store listing was last updated]. https://play.google.com/store/apps/details?id=com.faces.androidapp&hl=en (published: 2026-10-23)
33. Google Play (listing published by Deliveroo) - Deliveroo: Food & Shopping - Apps on Google Play [date shown is when the store listing was last updated]. https://play.google.com/store/apps/details?id=com.deliveroo.orderapp&hl=en (published: 2026-11-26)
34. Semrush - keeta-global.com Website Traffic, Ranking, Analytics [October 2026] [page "Last updated" date; October 2026 data]. https://www.semrush.com/website/keeta-global.com/overview/ (published: 2026-11-11)
35. Google Play (listing published by KANGAROO LIMITED) - Keeta - Food Delivery - Apps on Google Play [date shown is when the store listing was last updated]. https://play.google.com/store/apps/details?id=com.sankuai.sailor.afooddelivery&hl=en (published: 2026-11-12)
36. Asharq Al-Awsat (citing the Saudi Central Bank statistical bulletin) - Saudi E-Commerce Hits Record Monthly Sales over SAR30.7 Billion in October. https://english.aawsat.com/node/5222867 (published: 2025-12-24)
37. Semrush - Most Visited Retail Websites in Saudi Arabia, October 2026 [page states "Updated October 2026"]. https://www.semrush.com/trending-websites/sa/retail (published: 2026-10)
38. Similarweb - Top Ecommerce & Shopping Websites Ranking in Saudi Arabia, October 2026 [page "Last updated"]. https://www.similarweb.com/top-websites/saudi-arabia/e-commerce-and-shopping/ (published: 2026-11-01)
39. Similarweb - Top Beauty and Cosmetics Websites Ranking in Saudi Arabia, October 2026 [page "Last updated"]. https://www.similarweb.com/top-websites/saudi-arabia/lifestyle/beauty-and-cosmetics/ (published: 2026-11-01)
40. Nahdi Medical Company - Home | Nahdi Investor Relations (Key Highlights: 9M 2026) [9M 2026 figures]. https://investors.nahdi.sa/ (published: n.d.)
41. ECDB - Personal Care Industry in Saudi Arabia (e-commerce market sample data) [data to October 2026]. https://ecdb.com/resources/sample-data/market/sa/personal-care (published: n.d.)
42. Nice One - Home | Nice One KSA investor relations (Financial Highlights Q3 2026) [Q3 2026 figures]. https://ir.niceonesa.com/ (published: n.d.)
43. Semrush - Most Visited Food & Beverages Websites in Saudi Arabia, October 2026 [page states "Updated October 2026"]. https://www.semrush.com/trending-websites/sa/food-and-beverages (published: 2026-10)
44. Nahdi Medical Company - Shampoo listing page, Nahdi Online [live page]. https://www.nahdionline.com/en-sa/hair-care/shampoo/plp/70141 (published: n.d.)
45. Nahdi Medical Company - Moisturizers listing page, Nahdi Online [live page]. https://www.nahdionline.com/en-sa/skin-care/moisturizers/plp/70207 (published: n.d.)
46. Al-Dawaa - Dove brand page, Al-Dawaa online pharmacy [live page]. https://www.al-dawaa.com/english/brands1/dove (published: n.d.)
47. Al-Dawaa - Pantene brand page, Al-Dawaa online pharmacy [live page]. https://www.al-dawaa.com/english/brands1/pantene (published: n.d.)
48. Al-Dawaa - Nivea brand page, Al-Dawaa online pharmacy [live page]. https://www.al-dawaa.com/english/brands1/nivea (published: n.d.)
49. Al-Dawaa - Garnier brand page, Al-Dawaa online pharmacy [live page]. https://www.al-dawaa.com/english/brands1/garnier (published: n.d.)
50. Semrush - Most Visited Beauty & Cosmetics Websites in Saudi Arabia, October 2026 [page states "Updated October 2026"]. https://www.semrush.com/trending-websites/sa/beauty-and-cosmetics (published: 2026-10)
51. Semrush - salla.sa Website Traffic, Ranking, Analytics [October 2026] [page "Last updated" date; October 2026 data]. https://www.semrush.com/website/salla.sa/overview/ (published: 2026-11-11)
52. Salla - Get Started - Salla Platform Docs (Merchant API). https://docs.salla.dev/ (published: n.d.)
53. Semrush - Most Visited Pharmaceuticals Websites in Saudi Arabia, October 2026 [page states "Updated October 2026"]. https://www.semrush.com/trending-websites/sa/pharmaceuticals (published: 2026-10)
54. Abdullah Al-Othaim Markets - Abdullah Al-Othaim Markets website (Arabic) [live page]. https://www.othaimmarkets.com/ (published: n.d.)
55. Google Play (listing published by Abdullah AlOthaim Markets) - Iktissab - Apps on Google Play [date shown is when the store listing was last updated]. https://play.google.com/store/apps/details?id=com.othaim.Iktissab&hl=en (published: 2026-11-08)
56. Tamimi Markets - Tamimi Markets Online - Supermarket Delivery, Click & Collect in KSA [live page]. https://www.tamimimarkets.com/ (published: n.d.)
57. Nana - Nana storefront landing page [live page]. https://nana.sa/english (published: n.d.)
58. Google Play (listing published by Nana Direct) - Nana - Apps on Google Play [date shown is when the store listing was last updated]. https://play.google.com/store/apps/details?id=com.exa.nanamarket&hl=en (published: 2026-06-11)
59. Google Play (listing published by Jahez) - Jahez - Apps on Google Play [date shown is when the store listing was last updated]. https://play.google.com/store/apps/details?id=net.jahez&hl=en (published: 2026-11-19)
60. Google Play (listing published by MRSOOL) - Mrsool - Apps on Google Play [date shown is when the store listing was last updated]. https://play.google.com/store/apps/details?id=com.mrsool&hl=en (published: 2026-11-18)
61. Google Play (listing published by Careem) - Careem: Taxi, Food & Delivery - Apps on Google Play [date shown is when the store listing was last updated]. https://play.google.com/store/apps/details?id=com.careem.acma&hl=en (published: 2026-11-24)
62. Semrush - faces.sa Website Traffic, Ranking, Analytics [October 2026] [page "Last updated" date; October 2026 data]. https://www.semrush.com/website/faces.sa/overview/ (published: 2026-11-11)
63. Similarweb - sephora.me - Similarweb website analysis page [page titled October 2026]. https://www.similarweb.com/website/sephora.me/ (published: 2026-10)
64. Semrush - boutiqaat.com Website Traffic, Ranking, Analytics [October 2026] [page "Last updated" date; October 2026 data]. https://www.semrush.com/website/boutiqaat.com/overview/ (published: 2026-11-11)
65. Bernama (citing Google, Temasek and Bain & Company e-Conomy SEA 2026) - Malaysia's digital economy (e-Conomy SEA 2026 coverage). https://bernama.com/en/region/news.php?id=2626914 (published: 2026-10-28)
66. The Star (citing the Department of Statistics Malaysia) - Malaysia's e-commerce revenue hits RM937.5bil in 9M25. https://www.thestar.com.my/business/business-news/2025/11/26/malaysia039s-e-commerce-revenue-hits-rm9375bil-in-9m25 (published: 2025-11-26)
67. The Star (citing the Department of Statistics Malaysia) - ICT industry, e-commerce contribute RM476.8bil to GDP in 2025. https://www.thestar.com.my/business/business-news/2026/10/15/ict-industry-e-commerce-contribute-rm4768bil-to-gdp-in-2025 (published: 2026-10-15)
68. TechNode Global (citing Momentum Works) - Southeast Asia's ecommerce market up 22.8 percent year on year to $157.6B in 2025: Momentum Works. https://technode.global/2026/04/14/southeast-asias-ecommerce-market-up-22-8-percent-year-on-year-to-157-6b-in-2025-momentum-works/ (published: 2026-04-14)
69. Ipsos Malaysia - Ipsos Press Release: E-commerce Landscape in 2026. https://www.ipsos.com/sites/default/files/ct/news/documents/2026-07/Ipsos%20Press%20Release%20-%2016%20Jul%20-%20E-commerce%20Landscape%202026%20%28EN%29%20.pdf (published: 2026-07-16)
70. Euromonitor International - In Southeast Asia, the winning e-commerce decisions are local. https://www.euromonitor.com/article/in-southeast-asia-the-winning-e-commerce-decisions-are-local (published: 2026-11-02)
71. Semrush - Most Visited Retail Websites in Malaysia, October 2026 [page states "Updated October 2026"]. https://www.semrush.com/trending-websites/my/retail (published: 2026-10)
72. Similarweb - Top Ecommerce & Shopping Websites Ranking in Malaysia, October 2026 [page "Last updated"]. https://www.similarweb.com/top-websites/malaysia/e-commerce-and-shopping/ (published: 2026-11-01)
73. ECDB - Personal Care Industry in Malaysia (e-commerce market sample data) [data to October 2026]. https://ecdb.com/resources/sample-data/market/my/personal-care (published: n.d.)
74. Similarweb - Top Beauty and Cosmetics Websites Ranking in Malaysia, October 2026 [page "Last updated"]. https://www.similarweb.com/top-websites/malaysia/lifestyle/beauty-and-cosmetics/ (published: 2026-11-01)
75. Shopee - Shopee Open Platform. https://open.shopee.com/ (published: n.d.)
76. Pantene Malaysia (P&G) - Complete Hair Care for Strong, Healthy, Shiny Hair | Pantene MY. https://www.pantene.com.my/en-my (published: n.d.)
77. Head & Shoulders Malaysia (P&G) - Anti-Dandruff Shampoo & Conditioner | H&S MY. https://www.headandshoulders.com.my/en-my (published: n.d.)
78. Sensodyne Malaysia (Haleon) - Sensodyne | Buy Now. https://www.sensodyne.com.my/where-to-buy.html (published: n.d.)
79. NIVEA Malaysia (Beiersdorf) - Homepage - NIVEA. https://www.nivea.com.my/ (published: n.d.)
80. Safi (Wipro Unza) - Safi | Science. Beauty. Natural. https://safi.com.my/ (published: n.d.)
81. TikTok Shop - TikTok Shop API concepts: Overview (TikTok Shop Partner Center). https://partner.tiktokshop.com/docv2/page/tts-api-concepts-overview (published: n.d.)
82. Lazada - Lazada Open Platform. https://open.lazada.com/ (published: n.d.)
83. BIG Pharmacy - BIG Pharmacy online store (homepage and public storefront search data) [live data; footer copyright 2026]. https://bigpharmacy.com.my/ (published: n.d.)
84. Semrush - Most Visited Beauty & Cosmetics Websites in Malaysia, October 2026 [page states "Updated October 2026"]. https://www.semrush.com/trending-websites/my/beauty-and-cosmetics (published: 2026-10)
85. Alpro Pharmacy - Alpro Pharmacy Online Shop (public storefront search data) [live data]. https://alpropharmacy.com.my/ (published: n.d.)
86. Semrush - Most Visited Pharmaceuticals Websites in Malaysia, October 2026 [page states "Updated October 2026"]. https://www.semrush.com/trending-websites/my/pharmaceuticals (published: 2026-10)
87. Semrush - Most Visited Healthcare Websites in Malaysia, October 2026 [page states "Updated October 2026"]. https://www.semrush.com/trending-websites/my/healthcare (published: 2026-10)
88. Hermo Creative (M) Sdn Bhd - HERMO - YOUR BEAUTY YOUR WAY (hermo.my redirects here) [live page; copyright 2026]. https://www.hermobeauty.com/ (published: n.d.)
89. Semrush - Most Visited Food & Beverages Websites in Malaysia, October 2026 [page states "Updated October 2026"]. https://www.semrush.com/trending-websites/my/food-and-beverages (published: 2026-10)
90. Jaya Grocer - Jaya Grocer online store (public storefront JSON) [live data]. https://www.jayagrocer.com/collections/all/products.json (published: n.d.)
91. Semrush - taobao.com Website Traffic, Ranking, Analytics [October 2026] [page "Last updated" date; October 2026 data]. https://www.semrush.com/website/taobao.com/overview/ (published: 2026-11-11)
92. Google Play (listing published by Taobao) - Taobao - Apps on Google Play [date shown is when the store listing was last updated]. https://play.google.com/store/apps/details?id=com.taobao.taobao&hl=en (published: 2026-11-14)
