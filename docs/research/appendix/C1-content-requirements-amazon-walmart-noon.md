# C1 - Product-content requirements: Amazon, Walmart and noon (Beauty & Personal Care)

**Research date:** 2026-11-26. **Scope:** hair care, skin care and oral care listings on Amazon (US, UK, UAE, Saudi Arabia, India), Walmart (US; Marketplace sellers and first-party suppliers) and noon (UAE, Saudi Arabia). General listing rules are included where the retailer does not publish a beauty-specific rule.

**Machine-readable rules:** `data/research/requirements/amazon.json`, `walmart.json`, `noon.json`. The tables below are generated from the same data, so rule ids match.

**Method.** Every rule was read on 2026-11-26 from a page retrieved in this session: Amazon Seller Central public help (`/help/hub/reference/external/`, rendered in a headless browser), Amazon seller-forum announcements by News_Amazon, the Selling Partner API documentation, Walmart Marketplace Learn and developer.walmart.com, and noon's Seller Help Center and API documentation. Nothing was taken from memory. No login, form submission or bot-check bypass was used. The session's web-search quota ran out part-way through; after that, pages were reached only by following links, sitemaps and navigation data on the official sites.

**How to read the tables.** *Severity*: `mandatory` = the retailer states the listing, attribute or asset is rejected, suppressed, removed or unpublished when the rule is broken; `recommended` = stated best practice; `informational` = context, process or a documented gap. *Verification*: unmarked sources are official documents; `(unverified)` marks a point that could not be confirmed and is recorded only to document the gap. No `secondary_quote` rules were needed.

| Retailer | Rules | official_document | secondary_quote | unverified | mandatory | recommended | informational |
|---|---|---|---|---|---|---|---|
| Amazon | 145 | 139 | 0 | 6 | 93 | 22 | 30 |
| Walmart | 81 | 74 | 0 | 7 | 46 | 18 | 17 |
| noon | 89 | 83 | 0 | 6 | 59 | 15 | 15 |

## Headline findings

1. **Amazon's title limit is now 75 characters, not 200.** Since 27 July 2026 titles in all non-media categories must be 75 characters or fewer including spaces, with a new 125-character *Item highlights* field shown beneath the title [1][6][7]. This is confirmed for the US, UK and India. For the UAE and Saudi Arabia Amazon's own pages contradict each other, so the rule is recorded there as a recommendation with a 200-character legacy ceiling [4][5][8].
2. **Amazon's official quality measure is the *Listing Quality Indicator*** - a five-level category (Poor, Fair, Good, Great, Optimized) built on two pillars, content quality and multimedia quality, visible only in Seller Central (Manage Products > Enhance) [46]. It is not a number and has no documented API. 'LQI / Listing Quality Index' is a SellerApp metric, not Amazon's [62].
3. **The only Amazon quality data available by API are listing *issues*** (severity and enforcement actions such as SEARCH_SUPPRESSED) from the Listings Items API, and the Suppressed Listings Report [51][52].
4. **Walmart publishes a numeric Listing Quality score (0-100)** with five components - content quality, price competitiveness, shipping, published & in stock, ratings & reviews - available in Seller Center, by API and as downloadable reports, including an attribute-level content-quality report [85][88][93][94]. First-party suppliers get a separate Content Quality Score (0 to 1) in a product-content report [98].
5. **Walmart's hard content limits**: title 150 characters, key features 80 characters each, description as one paragraph (150 words minimum is the stated norm), English only [64].
6. **Walmart rich media is self-serve**: any seller can add a video; *Brand Highlights* is reserved for Brand Portal brand owners [68][69].
7. **noon has an A+ equivalent** (image banners, up to 10 per product, English and Arabic) [104], requires English content and treats Arabic as optional in both the UAE and Saudi Arabia [105], and exposes completeness, QC status and rejection reasons through its Content API [120][121]. It has no documented numeric quality score.
8. **Beauty claims**: all three retailers prohibit disease or drug claims on cosmetics. Amazon and Walmart both use the same example - 'reduce the appearance of wrinkles' is acceptable, 'eliminate wrinkles' is not [55][81]. Only Walmart names before/after images explicitly [81].

## 1. Amazon (US, UK, UAE, Saudi Arabia, India)

### 1.1 Recent policy changes

| Change | Effective | Scope | Source |
|---|---|---|---|
| Title limit 200 characters; special characters ! $ ? _ { } ^ and two others banned; a word may appear at most twice | 2025-01-21 | 'Most product categories', announced across stores | [8] |
| Title limit cut to 75 characters; new Item highlights field (125 characters) | 2026-07-27 (start of a gradual rollout through 2026) | All categories except media; US, UK and India help pages; AE/SA unclear | [6][1][2][3] |
| Item highlights displayed beneath the title on desktop and mobile | 2026-08-10 | As above | [7] |
| Generic keyword field required for 23 product types including 'Beauty' | 2023-12-06 | US page | [29] |

Amazon describes 27 July 2026 as a kick-off rather than a hard deadline: non-compliant titles are replaced gradually by AI recommendations, brand owners have 14 days to review each change, and listings stay active [6][7]. A new listing, however, must meet the requirements when first created [1].

### 1.2 Differences between country stores

| Topic | US | UK | India | UAE | Saudi Arabia |
|---|---|---|---|---|---|
| Title limit | 75 [1] | 75 [2] | 75 [3] | Local page says 75 but US/UK/IN pages exclude the UAE; same page also says 200; no Item highlights [4] | Same as UAE [5] |
| Item highlights (125) | Yes | Yes | Yes | Not mentioned | Not mentioned |
| HTML in description | Not allowed; line break allowed [9] | Same [10] | Same [11] | Not allowed; no line-break exception stated [12] | Same as UAE [13] |
| Language sentence | None found | Local language of the store | Local language of the store | Local language of the store concerned (language not named) | Same as UAE |
| Images, bullets, video, A+ guide, Listing Quality Indicator | Identical text on all five sites [16][14][22][23][46] | | | | |
| Search terms | Less than 250 bytes [28][33] | Less than 250 bytes [31] | Under 250 bytes [30] | Less than 250 bytes [32] | Less than 250 bytes (search optimization page) |
| Beauty GTIN rule | UPC for major brands; exemption for private label [37] | UPC or EAN | UPC | UPC or EAN | UPC or EAN |
| Cosmetics policy page | FDA, FPLA, MoCRA; label content in images [55] | UK Cosmetics Regulation, responsible person, UK notification [56][57] | Drugs and Cosmetics Act 1940, Magic Remedies Act 1954, CDSCO [60] | Approval to sell required; Dubai Municipality references [58] | Approval to sell required; SFDA and SASO references [59] |
| Extra local rules | - | - | Price must not exceed MRP; separate video policy (English, 10 videos, 500 MB) [11] | - | - |

### 1.3 Rules

#### Title

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `title.max_length` | Product titles (Item name) must not exceed 75 characters, including spaces. Applies to all product types except media product types. Effective 2026-07-27. | 75 characters | mandatory | US, GB, IN | all | [1] |
| `title.max_length.ae_sa` | UAE and Saudi Arabia: the local help page states that titles must not exceed 75 characters including spaces, but the applicability of this limit to these two stores is contradicted by other official pages. | 75 characters | recommended | AE, SA | all | [4] |
| `title.max_length.ae_sa_legacy_ceiling` | UAE and Saudi Arabia: 200 characters is the last limit that is stated without contradiction (2025 policy: 'For most product categories, titles may not exceed 200 characters, including spaces'). Effective 2025-01-21. | 200 characters | informational | AE, SA | all | [8] |
| `title.item_highlights.max_length` | Item highlights (new field displayed beneath the title in search results and on the detail page) is limited to 125 characters including spaces. The field is optional and can be filled once the title is 75 characters or fewer. Effective 2026-07-27. | 125 characters | mandatory | US, GB, IN | all | [1] |
| `title.item_highlights.format` | Write Item highlights as comma-separated phrases (materials, recommended use cases, compatibility), not full sentences; keep the brand name and the most important varying attributes in the Item name. | - | recommended | US, GB, IN | all | [7] |
| `title.prohibited_special_characters` | Titles must not use the special characters ! $ ? _ { } ^ ¬ ¦. Other special characters such as ~ # < > * are allowed only in specific contexts (product identifiers such as 'Style #4301', measurements such as '<10 lb'); decorative use is not allowed. Effective 2025-01-21. | - | mandatory | US, GB, AE, SA, IN | all | [1] |
| `title.prohibited_promotional_phrases` | Titles must not contain promotional phrases such as 'free shipping' or '100% quality guaranteed'. | - | mandatory | US, GB, AE, SA, IN | all | [1] |
| `title.word_repetition` | A title must not contain the same word more than twice. Prepositions, articles and conjunctions are exempt; brand names count towards the limit. Effective 2025-01-21. | 2 occurrences of the same word | mandatory | US, GB, IN | all | [1] |
| `title.word_repetition.ae_sa` | UAE and Saudi Arabia: the local title page lists the same two-occurrence word-repetition rule. | 2 occurrences of the same word | recommended | AE, SA | all | [4] |
| `title.restricted_phrases` | Titles must not include restricted phrases such as 'FSA/HSA eligible'. | - | mandatory | US, GB, IN | all | [1] |
| `title.minimum_information` | Titles must contain the minimum information needed to clearly describe the product (examples given: 'Amazon Essentials Dress', 'Columbia Hiking Boots', 'Sony Headphones'). | - | mandatory | US, GB, IN | all | [1] |
| `title.capitalization` | Use capital letters only for the first letter of each word; do not write the whole title in capital letters; emojis, emoticons or symbols at the beginning of each word are prohibited. The same rule applies to bullet points and product descriptions. | - | mandatory | US, GB, AE, SA | all | [9] |
| `title.capitalization.in` | India: capitalize the first letter of each word except prepositions, conjunctions and articles; do not use all caps. | - | recommended | IN | all | [3] |
| `title.information_order` | Recommended word order: brand name, flavor or style, product type, key attribute, color, size or pack count, model number. | - | recommended | US, GB, AE, SA, IN | all | [1] |
| `title.numerals_and_units` | Use numerals instead of spelled-out numbers ('2' not 'two') and abbreviate measurements ('cm', 'oz', 'in', 'kg'). | - | recommended | US, GB, AE, SA, IN | all | [1] |
| `title.no_subjective_commentary` | Do not use subjective commentary such as 'Hot Item' or 'Best seller' in titles; avoid redundancy and decorative symbols. | - | recommended | US, GB, AE, SA, IN | all | [1] |
| `title.parent_child` | Include size and color in child ASIN titles only, not in the parent ASIN title. In Beauty (and Clothing, Accessories & Luggage, Sporting Goods) the detail page and search results show the parent ASIN title, so the parent title is the one customers see. | - | recommended | US, GB, AE, SA, IN | beauty | [1] |
| `title.multipack_quantity` | For multipacks and variety multipacks the product title must state the total quantity (x pack or x count) and must not conflict with the main image. | - | mandatory | US | all | [20] |
| `title.bundle_word` | Bundle titles must include the word 'Bundle' and follow the standard product title requirements. | - | mandatory | US | all | [43] |

#### Description

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `description.no_html` | Do not use HTML, JavaScript or other code in product detail pages. As a special case, line breaks (</br>) may be used in the description. | - | mandatory | US, GB, IN | all | [9] |
| `description.no_html.ae_sa` | UAE and Saudi Arabia: do not include HTML, DHTML, Java, scripts or other executables in detail pages; 'bad data (HTML and special characters)' in titles, descriptions, bullet points and any other attribute is prohibited. | - | mandatory | AE, SA | all | [12] |
| `description.prohibited_content` | Titles, descriptions, bullet points and images must not contain: phone numbers, addresses, email addresses or website URLs; availability, price or condition details; links to other websites or alternative shipping offers such as free shipping; reviews, quotes or testimonials; requests for positive reviews; adverts, promotional material or watermarks; time-sensitive information; pornographic, obscene or offensive content. | - | mandatory | US, GB, AE, SA, IN | all | [9] |
| `description.max_length` | A maximum character length for the product description is not stated on the public help pages retrieved. | - | informational | US, GB, AE, SA, IN | all | [34] (unverified) |
| `description.style` | The description is shown in paragraph form and should elaborate on key features, uses, benefits and technical specifications; keep it concise, clear and consistent with other attributes. | - | recommended | US | all | [15] |
| `description.bundle` | Bundle descriptions must clearly state that the product is a bundle and identify all included items. | - | mandatory | US | all | [43] |

#### Bullet points / key features

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `bullets.min_count` | Include at least three bullet points. | 3 bullets | recommended | US, GB, AE, SA, IN | all | [14] |
| `bullets.max_count` | Bullet points 'allow you to include up to five descriptive points' on the product detail page. | 5 bullets | informational | US | all | [15] |
| `bullets.max_length` | Bullet point character limits vary by product type; no universal maximum is published. | - | informational | US, GB, AE, SA, IN | all | [14] |
| `bullets.format` | Begin each bullet with a capital letter; write a sentence fragment without end punctuation; separate phrases with semicolons; use a header followed by a colon ('Cotton fabric: Made from 100% cotton'); write numbers one to nine in full except in names, model numbers and measurements; put a space between digit and unit ('60 ml'). | - | recommended | US, GB, AE, SA, IN | all | [14] |
| `bullets.content_focus` | Highlight product features, benefits and how the product meets customer needs; avoid brand marketing stories; keep data consistent across variants and minimise duplication with the title, description or product overview. | - | recommended | US, GB, AE, SA, IN | all | [14] |
| `bullets.prohibited_special_characters` | Bullet points must not contain the special characters listed by Amazon: trademark, registered, euro, ellipsis, dagger, double dagger, cent, pound, yen, copyright, plus-minus, tilde and similar symbols. | - | mandatory | US, GB, AE, SA, IN | all | [14] |
| `bullets.prohibited_emojis_placeholders_asins` | Bullet points must not contain emojis, placeholder text ('not applicable', 'NA', 'n/a', 'not eligible', 'TBD', 'copy pending', ...) or ASINs. | - | mandatory | US, GB, AE, SA, IN | all | [14] |
| `bullets.prohibited_claims` | Bullet points must not contain the prohibited claims 'eco-friendly', 'environmentally friendly', 'ecologically friendly', 'anti-microbial', 'anti-bacterial', 'made from bamboo', 'contains bamboo', 'made from soy' or 'contains soy'. | - | mandatory | US, GB, AE, SA, IN | all | [14] |
| `bullets.prohibited_guarantee_and_external_info` | Bullet points must not contain guarantee information ('Full refund', 'If not satisfied, send it back', 'Unconditional guarantee with no limit') or external information (company information, website links, external hyperlinks, contact information). | - | mandatory | US, GB, AE, SA, IN | all | [14] |
| `bullets.prohibited_style` | Bullet points must not repeat the same information across bullets, use all caps ('MACHINE WASHABLE'), use abbreviations such as 'qty', 'pkg', 'w/', 'approx.', or repeat content that has a dedicated field (fabric content, care instructions, country of origin). | - | mandatory | US, GB, AE, SA, IN | all | [14] |
| `bullets.claims_and_references` | Avoid subjective, performance or comparative claims unless verifiable on packaging; avoid unsubstantiated award claims or consumer survey results; do not refer to other products not included under the ASIN and do not compare with competitor brands. | - | recommended | US, GB, AE, SA, IN | all | [14] |
| `bullets.bundle_first_bullet` | For bundles, the first bullet must state that the product is a bundle of X items and identify the products in the bundle. | - | mandatory | US | all | [43] |

#### Attributes

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `attributes.required_set` | Required attributes must be completed to create a listing (examples given: product title, main image, product description, price). Required and recommended attributes vary by product type and must be read from the current bulk listing template or the Product Type Definitions API. | - | mandatory | US, GB, AE, SA, IN | all | [34] |
| `attributes.valid_values` | For attributes with a valid-value list, select only from the provided values; a value not in the list is rejected (Error 90057). | - | mandatory | US, GB, AE, SA, IN | all | [34] |
| `attributes.template_freshness` | Use only listing templates downloaded within the last 90 days so that they include the latest attribute requirements. | 90 days | recommended | US, GB, AE, SA, IN | all | [34] |
| `attributes.brand_name` | Enter the brand in the Brand name field; for products without a brand enter 'generic' in the Brand name field and do not put a brand name in the title. | - | recommended | US, GB, AE, SA, IN | all | [1] |
| `attributes.unit_count.beauty` | Child listings in Consumables (Grocery, Beauty, Pets, Health & Personal Care) without a unit count and value are suppressed from search and browse. | - | mandatory | US | beauty | [48] |
| `attributes.item_form_net_content_number_of_items` | Item Form (86 product types), Number of Items (154 product types) and Net Content (8 product types) are mandatory for the listed product types, and Unit Count Type is restricted to values allowed for the product type and item form (example: product type 'Shampoo' with item form 'Liquid' must use 'Fl Oz'). | - | mandatory | US | beauty | [35] |
| `attributes.cosmetics_us_detail_page` | US cosmetics, skin and hair care policy: the product detail page must carry item name, product identifier and type (UPC, EAN, ISBN or GTIN), brand name, age range description, manufacturer, product features and number of items. | - | mandatory | US | beauty | [55] |
| `attributes.generic_keyword_required_beauty` | The Generic keyword (search terms) field is required for 23 product types, including 'Beauty', 'Body care product' and 'Body deodorant'. Effective 2023-12-06. | - | mandatory | US | beauty | [29] |
| `attributes.beauty_specific_fields` | Which beauty-specific attributes (ingredients, scent, hair type, skin type, expiry or shelf life, country of origin, safety and compliance fields) are required per product type is not listed on the public help pages retrieved. | - | informational | US, GB, AE, SA, IN | beauty | [34] (unverified) |
| `attributes.india_mrp` | India: products must not be listed at a price higher than the Maximum Retail Price (MRP) determined by the manufacturer. | - | mandatory | IN | all | [11] |

#### Identifiers (GTIN / barcode / brand)

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `identifiers.gtin_required` | A product ID (GTIN: UPC, EAN, JAN or ISBN) is required to create new listings in Beauty and in Health & Personal Care. Major brands require a UPC (UPC or EAN on the UK, UAE and Saudi pages); exemptions may be requested for private-label brands. | - | mandatory | US, GB, AE, SA, IN | beauty | [37] |
| `identifiers.accepted_gtin_types` | The most commonly used GTINs in the Amazon catalog are UPC, ISBN, EAN and JAN; the specific GTIN required for page creation and matching varies by category. | - | informational | US | all | [36] |
| `identifiers.gs1_validation` | Amazon verifies product UPCs against the GS1 database; UPCs that do not match GS1 information are considered invalid, listings with invalid UPCs are removed and ASIN-creation or selling privileges may be removed. Obtain UPCs directly from GS1. | - | mandatory | US | all | [38] |
| `identifiers.gtin_ownership` | Use only GTINs you own or are authorized to use; GTINs must be purchased directly from GS1 or used with explicit authorization from the GTIN prefix owner. Listing submissions with unauthorized GTINs will be blocked. False product identification information is prohibited. | - | mandatory | US, GB, AE, SA, IN | all | [9] |
| `identifiers.gtin_exemption` | A GTIN exemption can be requested for private-label or handmade products, products manufactured without barcodes, parts, bundles and generic products. It is not available when the product already has a GS1 barcode or the brand requires a UPC, and it must be requested separately for each store and category (product type). | - | informational | US | all | [39] |
| `identifiers.multipack_upc` | Each sellable unit needs its own product identifier: a multi-pack needs a separate UPC from the single item plus the item package quantity, and a bundle needs its own unique UPC or EAN. | - | mandatory | US | all | [40] |
| `identifiers.product_id_not_editable` | The product ID of an existing listing cannot be edited unless the listing was created with a GTIN exemption. | - | informational | US, IN | all | [9] |
| `identifiers.brand_registry_eligibility` | Amazon Brand Registry (prerequisite for A+ Content and other brand tools) requires an active registered trademark in each country of enrolment, or a pending trademark at a subset of offices; accepted government trademark offices include the United States, India, the United Kingdom, Saudi Arabia and the United Arab Emirates. | - | informational | US, GB, AE, SA, IN | brand_registered | [61] |

#### Images - main image and technical specifications

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `images_main.required` | Every product requires at least one compliant main image. If no main image meets the requirements Amazon may remove the listing from search until a compliant main image is provided. | 1 images | mandatory | US, GB, AE, SA, IN | all | [16] |
| `images_main.background` | The main image must have a pure white background (RGB 255, 255, 255). | - | mandatory | US, GB, AE, SA, IN | all | [16] |
| `images_main.frame_fill` | Show the product as 85% of the main image. | 85 percent of image frame | mandatory | US, GB, AE, SA, IN | all | [16] |
| `images_main.no_text_logos_watermarks` | The main image must not contain text, logos, graphics or watermarks. | - | mandatory | US, GB, AE, SA, IN | all | [17] |
| `images_main.whole_product_single_view` | Show the entire product within the frame (no cropping), show the product only once (not front and back together), show only one unit plus the accessories included, and never use a placeholder image. | - | mandatory | US, GB, AE, SA, IN | all | [16] |
| `images_main.no_props_or_packaging` | Do not show accessories or props that are not included with the product, and do not include packaging unless it is an important product feature. | - | mandatory | US, GB, AE, SA, IN | all | [16] |
| `images_main.multipack` | For multipacks the main image must show the total quantity delivered to the customer and must show the product in its packaging. Amazon pack-quantity stickers or Amazon logos must not be added to the image by the seller. | - | mandatory | US | all | [20] |
| `images_main.bundle` | For bundles the main image must include all products in the bundle and no product that is not part of it. | - | mandatory | US | all | [43] |
| `images.min_longest_side_px` | Images must be at least 500 pixels on the longest side; smaller images cannot be uploaded. Do not artificially enlarge small images. | 500 pixels | mandatory | US, GB, AE, SA, IN | all | [16] |
| `images.zoom_threshold_px` | Images with 1,000 or more pixels on the longest side enable the zoom function; Amazon recommends 1,000+ pixels. | 1000 pixels | recommended | US, GB, AE, SA, IN | all | [16] |
| `images.max_longest_side_px` | Images must not exceed 10,000 pixels on the longest side. | 10000 pixels | mandatory | US, GB, AE, SA, IN | all | [16] |
| `images.file_formats` | Supported formats: JPEG (.jpg, .jpeg), TIFF (.tif, .tiff), PNG (.png) and non-animated GIF (.gif); JPEG is recommended. EPS, BMP, PDF and application-specific formats (PSD, AI, CDR, ...) are not accepted. | - | mandatory | US, GB, AE, SA, IN | all | [16] |
| `images.resolution_dpi` | Image resolution must be at least 72 dpi; images must be clear, non-pixelated and without jagged edges. | 72 dpi | mandatory | US, GB, AE, SA, IN | all | [16] |
| `images.color_mode` | RGB colour mode is preferred; CMYK is not preferred and should be converted to RGB before upload. | - | recommended | US, GB, AE, SA, IN | all | [16] |
| `images.file_preparation` | Submit images with minimal or no compression (JPEG at the highest quality level, TIFF uncompressed), remove all layers, and do not rely on ICC colour profiles for accurate colour display. | - | recommended | US | all | [18] |
| `images.aspect_ratio` | No required aspect ratio for product images is stated on the public pages retrieved. | - | informational | US, GB, AE, SA, IN | all | [16] (unverified) |

#### Images - additional

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `images.recommended_count` | Upload at least six additional images and one video in addition to the main image. | 6 additional images | recommended | US, GB, AE, SA, IN | all | [16] |
| `images.max_count` | The maximum number of images accepted or displayed per listing is not stated on the public pages retrieved. | - | informational | US, GB, AE, SA, IN | all | [16] (unverified) |
| `images_secondary.content_rules` | All product images must accurately represent the product and match the title, and must not show nudity or sexually suggestive content, customer reviews, five-star imagery, claims such as 'free shipping', seller-specific information, Amazon logos or trademarks, or Amazon badges such as 'Amazon's Choice', 'Best seller' or 'Top seller'. | - | mandatory | US, GB, AE, SA, IN | all | [16] |
| `images_secondary.swatch` | Swatch images must not contain text or pricing details. | - | mandatory | US, GB, AE, SA, IN | all | [16] |
| `images_secondary.variant_codes` | Use the dedicated image variant codes: INGR for ingredient information, PS01-PS06 for product safety and compliance (warnings), DTLS for multipack images, PT01-PT99 for additional angles, in-use and detail shots. | - | informational | US, GB, AE, SA, IN | beauty | [16] |
| `images_secondary.cosmetics_us_label_content` | US cosmetics, skin and hair care policy: product images must include the ingredients list and a product identity statement (a clear statement of what the product is, such as 'shampoo' or 'moisturizing body lotion'). | - | mandatory | US | beauty | [55] |
| `images.ai_generated_people_disclosure` | If an image contains photorealistic AI-generated people it must be tagged before upload with the IPTC keyword 'contains-synthetic-performer' in the dc:subject (XMP) field. | - | mandatory | US, GB, AE, SA, IN | all | [16] |
| `images.beauty_diversity_image` | For selected Beauty ASINs (lip colour, eye colour, foundation, concealer, skin moisturizer and cleanser) Amazon may insert a diversity image as the fourth image (PT03); the last image is pushed out if the image block is full. | - | informational | US | skin_care | [21] |

#### Video

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `video.file_format` | Video files must be MOV or MP4. | - | mandatory | US, GB, AE, SA, IN | all | [22] |
| `video.max_file_size` | Maximum video file size is 5 GB. | 5 GB | mandatory | US, GB, AE, SA, IN | all | [22] |
| `video.max_resolution` | Video resolution up to 1080p. | 1080 p | mandatory | US, GB, AE, SA, IN | all | [22] |
| `video.aspect_ratio` | Aspect ratio 16:9 (horizontal) or 9:16 (vertical). | - | mandatory | US, GB, AE, SA, IN | all | [22] |
| `video.min_duration` | Minimum video duration is 1 minute. | 1 minutes | mandatory | US, GB, AE, SA, IN | all | [22] |
| `video.max_duration` | Maximum video duration is 12 minutes. | 12 minutes | mandatory | US, GB, AE, SA, IN | all | [22] |
| `video.thumbnail` | Thumbnail must be JPEG, PNG, GIF or BMP and under 5 MB; 1920 x 1080 pixels at 16:9 is recommended. | 5 MB | mandatory | US, GB, AE, SA, IN | all | [22] |
| `video.eligibility` | Videos can be uploaded when the selling account has been active for more than three months (brand-registered or not), the ASINs exist and are listed, and each video is associated with at least one ASIN. | 3 months of account activity | mandatory | US, GB, AE, SA, IN | all | [22] |
| `video.prohibited_content` | Videos must not include external website links, promotional calls to action, unauthorized music or artwork, visible third-party or external branding, promotional content, or misleading or incorrect claims; they must comply with the Community guidelines. | - | mandatory | US, GB, AE, SA, IN | all | [22] |
| `video.india_detail_page_policy` | India: the detail page rules add a video policy - up to 10 videos per product; spoken or written language must be English; no pricing, guarantees, environmental claims, competitor comparisons, URLs or references to other retailers; superlative claims ('#1 rated', 'Best-Selling', '100%') only with third-party evidence shown in the video; file size must not exceed 500 MB. | 10 videos per product | mandatory | IN | all | [11] |

#### Enhanced content

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `enhanced_content.eligibility` | A+ Content is available to brand owners and authorized resellers: the account role must be brand representative or reseller, ASINs must be registered to the brand, and the brand name on the ASIN must exactly match Brand Registry (case sensitive). | - | mandatory | US, GB, AE, SA, IN | brand_registered | [23] |
| `enhanced_content.premium_eligibility` | A+ Content is available at no additional cost for Basic and Premium features, and there is no additional eligibility criterion for sellers to access Premium A+. | - | informational | US, GB, AE, SA, IN | brand_registered | [23] |
| `enhanced_content.basic.max_modules` | Basic A+: up to 5 modules on the detail page, chosen from 14 module types; image size 970 x 300; comparison chart supported; no video, hotspots or navigation carousel. | 5 modules | mandatory | US, GB, AE, SA, IN | brand_registered | [23] |
| `enhanced_content.premium.max_modules` | Premium A+: up to 7 modules on the detail page, chosen from 19 module types; image size 1464 x 600; comparison chart, video, hotspots and navigation carousel supported. | 7 modules | mandatory | US, GB, AE, SA, IN | brand_registered | [23] |
| `enhanced_content.brand_story.max_cards` | A+ Brand Story appears in the 'From the brand' section and supports one module with up to 19 pre-formatted cards in a carousel; it can be used alongside Basic or Premium A+. | 19 cards | mandatory | US, GB, AE, SA, IN | brand_registered | [23] |
| `enhanced_content.image_file` | A+ images must be .jpg, .bmp or .png in RGB colour space, under 2 MB per file and at least 72 dpi; animated images (GIF) and CMYK are not allowed. | 2 MB | mandatory | US, GB, AE, SA, IN | brand_registered | [23] |
| `enhanced_content.alt_text` | Alt-text (formerly image keywords) must be supplied for every A+ image and must describe the image. | - | mandatory | US, GB, AE, SA, IN | brand_registered | [25] |
| `enhanced_content.prohibited_technical` | A+ Content must not contain HTML tags, watermarks, QR codes, hyperlinks or external redirects. | - | mandatory | US, GB, AE, SA, IN | brand_registered | [23] |
| `enhanced_content.prohibited_content` | A+ Content must not include time-sensitive references, promotional language or pricing, competitor comparisons, external links or contact information, warranty or guarantee information, shipping details, personal information, images duplicated from the gallery, blurry images or small unreadable text. | - | mandatory | US, GB, AE, SA, IN | brand_registered | [23] |
| `enhanced_content.comparison_charts` | Comparison charts may only compare against other products owned by the same brand; comparisons against categories (for example LED versus halogen bulbs) are acceptable. | - | mandatory | US, GB, AE, SA, IN | brand_registered | [24] |
| `enhanced_content.claims` | A+ claims rules: awards and endorsements need date and awarding body and must not be older than 2 years; certification claims need substantiation in the text; environmental claims such as 'eco-friendly', 'biodegradable' and 'compostable' are not allowed; satisfaction and boastful claims ('100% satisfaction guaranteed', '#1 rated', 'top-rated', 'best-selling') are not allowed; claims to cure, mitigate, treat or prevent disease must be removed for drugs, cosmetics and health products; at most four quotes or endorsements, only from well-known publications or public figures. | - | mandatory | US | beauty, brand_registered | [24] |
| `enhanced_content.other_prohibited` | A+ Content must not reference the company as seller or distributor or mention seller authorization, must not use purchase-directing language ('buy now', 'add to cart'), price words ('affordable', 'cheap', 'free', 'bonus'), stand-alone trademark or copyright symbols, off-Amazon customer service references, or imitations of Amazon logos and detail-page headings. | - | mandatory | US | brand_registered | [24] |
| `enhanced_content.language` | A+ text must be in the content language selected for the project (a small amount of other-language text is allowed only as part of the brand identity); content is shown only on the detail page of the language it was published in. | - | mandatory | US, GB, AE, SA, IN | brand_registered | [23] |
| `enhanced_content.pending_submissions` | A maximum of 20 A+ submissions can be pending review at one time. | 20 pending submissions | mandatory | US, GB, AE, SA, IN | brand_registered | [23] |
| `enhanced_content.style` | A+ writing style: unique content that does not duplicate the image gallery; paragraphs of at most three sentences; numbers under 10 spelled out; serial commas; sparing bold and italic; content formatted for mobile. | - | recommended | US, GB, AE, SA, IN | brand_registered | [23] |
| `enhanced_content.vendor_access` | First-party vendors create A+ in Vendor Central (Advertising > A+ Content Manager). A seller cannot add A+ to an ASIN that already has A+ contributed by a retail vendor. | - | informational | US, GB, AE, SA, IN | first_party_vendor | [27] |

#### SEO / keywords

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `seo.search_terms.max_bytes` | Search terms (Generic keyword attribute) must be less than 250 bytes in total. If the limit is exceeded, none of the search terms for that product are indexed. | 249 bytes | mandatory | US, GB, AE, SA, IN | all | [33] |
| `seo.search_terms.prohibited` | Search terms must not contain brand names (your own or others'), ASINs, profanity, temporary statements ('new', 'on sale now'), subjective claims ('best', 'cheapest', 'amazing') or offensive terms. | - | mandatory | US, GB, AE, SA, IN | all | [29] |
| `seo.search_terms.style` | Search-term style: use synonyms, spelling variations (not misspellings) and abbreviations; all lower case; no punctuation; separate words with spaces; do not repeat words; omit stop words (a, an, and, by, for, of, the, with); use singular or plural, not both. | - | recommended | US, GB, AE, SA, IN | all | [29] |
| `seo.item_type_keyword` | Each ASIN must be classified to the most specific browse node; the Item Type Keyword must match the spelling and formatting in the Browse Tree Guide. ASINs without a browse node are not indexed. | - | mandatory | US, GB, AE, SA, IN | all | [28] |
| `seo.other_keyword_attribute_limits` | Other keyword attributes have byte limits beyond which content is ignored: item_type_keyword 250, specific_uses_keywords 150 (being phased out), style_keywords 100, subject_keywords 210 (media only), thesaurus_subject_keywords 250; platinum_keywords are no longer used. | - | informational | US | all | [33] |
| `seo.indexing_not_guaranteed` | Amazon may not use all supplied search terms, description or bullet content for search retrieval, and it does not guarantee a specific placement in search results. | - | informational | US, GB, AE, SA, IN | all | [28] |

#### Variants, bundles and multipacks

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `variants.valid_relationships` | Create a variation family only for products that are fundamentally the same and differ only by variation attributes such as size, colour, flavour, scent or quantity. Parent and child products must be the same product type and brand, serve the same function and have similar titles and images. | - | mandatory | US | all | [41] |
| `variants.standard_themes` | Use only Amazon's standard variation themes available for the product type, and use each theme only for its intended attribute (a colour theme must contain colour information only). | - | mandatory | US | all | [41] |
| `variants.number_of_items` | Use the 'number of items' variation attribute when identical items are offered in different pack quantities; the size attribute may express dimensions, standardized sizes or quantity but not useful life or compatibility. | - | recommended | US | all | [41] |
| `variants.display_beauty` | In Beauty the detail page shows the parent product's title and description without varying attribute information until the customer selects a child; in search, the parent appears for these categories. | - | informational | US | beauty | [42] |
| `variants.bundles_policy` | A bundle combines two or more complementary (different) products and is branded and categorized by its primary product; multi-packs of identical items are not bundles. Hard-kit bundles are allowed only when packaged by the original manufacturer or brand with a unique identifier (exceptions: gift baskets, camera kits, or a letter of authorization); virtual bundles are created in the Virtual Bundles tool and cannot be created via spreadsheets or APIs. | - | mandatory | US | all | [43] |

#### Language

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `language.local_language` | Detail page information must be added in the local language of the store concerned. | - | mandatory | GB, IN, AE, SA | all | [12] |
| `language.ae_sa_arabic_english` | Whether sellers on amazon.ae and amazon.sa must supply both English and Arabic content, and how Amazon translates between the two, is not documented on the public pages retrieved. | - | informational | AE, SA | all | [12] (unverified) |
| `language.image_text` | For country-specific image uploads, any text in the images must be in the country's official language or English. | - | mandatory | GB, AE, SA, IN | all | [19] |
| `language.video` | Select the language used in each video at upload; the list shows the languages supported in that store. | - | informational | US, GB, AE, SA, IN | all | [22] |

#### Approval, moderation and timelines

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `approval.title_update_time` | Title and Item highlights changes are accepted immediately but take 24 to 48 hours to be processed and displayed. | 48 hours | informational | US, GB, IN | all | [1] |
| `approval.ai_title_changes_review_window` | When Amazon applies AI-generated title or Item highlights changes to non-compliant listings, brand owners have 14 days before implementation to review, modify and approve them in Review Listing Changes. Effective 2026-07-27. | 14 days | informational | US, GB, IN | all | [6] |
| `approval.title_enforcement` | A non-compliant or inaccurate title on an existing listing may be automatically corrected or may not appear in search results; suppressed titles are listed under 'Search suppressed and inactive listings' in Manage All Inventory and suppression is lifted automatically once the title complies. | - | informational | US, GB, AE, SA, IN | all | [1] |
| `approval.image_processing_time` | A newly uploaded image that is selected for display can take up to 24 hours to appear on the detail page. | 24 hours | informational | US, GB, AE, SA, IN | all | [16] |
| `approval.aplus_review_time` | A+ Content is reviewed within up to seven business days (longer in the holiday season; no expedited requests) and is published within 24 hours of approval. | 7 business days | informational | US, GB, AE, SA, IN | all | [26] |
| `approval.video_review_time` | Video review takes 1-7 business days; publication to the detail page follows within three days of approval. | 7 business days | informational | US, GB, AE, SA, IN | all | [22] |
| `approval.search_propagation` | Changes to an ASIN's offer, browse node or launch date can take up to 72 hours to be reflected in shopping results. | 72 hours | informational | US, GB, AE, SA, IN | all | [28] |
| `approval.listing_quality_refresh` | The Listing Quality Indicator refreshes within 15 minutes of publishing updates in the Enhance view; verified contributions appear on the detail page within 48 hours. | 15 minutes | informational | US, GB, AE, SA, IN | all | [46] |

#### Restricted claims and prohibited content

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `restricted_claims.disease_claims` | Listings must not state or imply that a product diagnoses, cures, mitigates, treats or prevents a disease in humans or animals without FDA approval. Amazon's example list of terms that products cannot claim includes 'Anti-Bacterial', 'Anti-Fungal', 'Anti-Microbial' and 'Nano silver' alongside named diseases. | - | mandatory | US | beauty | [53] |
| `restricted_claims.antibacterial_antimicrobial` | Claims that a product is anti-microbial or anti-bacterial need supporting proof on request, and products claimed to have antimicrobial, antifungal, antibacterial or other pesticidal properties must comply with FIFRA (US pesticide law) and state pesticide laws. | - | mandatory | US | beauty | [54] |
| `restricted_claims.fda_references` | Cosmetics listings and images must not include the FDA logo and must not claim 'FDA approved' unless the product has official FDA approval. | - | mandatory | US | beauty | [55] |
| `restricted_claims.cosmetic_vs_drug` | A cosmetic may claim to reduce the appearance of wrinkles but may not claim to eliminate wrinkles. Products that are both cosmetic and drug (anti-dandruff shampoo, sunscreen-containing moisturizers, antiperspirant deodorant) must follow the FDA OTC monograph or an approved NDA for their claims. | - | mandatory | US | beauty | [55] |
| `restricted_claims.unverified_claims` | Do not make unverified claims of health benefits, therapeutic properties or purity levels without evidence from certified testing; superlatives and comparisons ('best', '100% pure', 'guaranteed', 'twice as effective') may be used only when supported by verifiable, objective proof. | - | mandatory | US | beauty | [53] |
| `restricted_claims.environmental` | Environmental claims must be truthful, not misleading and supported by evidence (FTC Green Guides); general terms such as 'eco-friendly' are identified as potentially problematic. | - | mandatory | US | all | [53] |
| `restricted_claims.guarantees_and_testimonials` | Phrases like 'satisfaction guaranteed' or 'money-back guarantee' may be used only if full refunds are given for any reason; testimonials and endorsements must follow the FTC Endorsement Guides; reviews, quotes and testimonials are not allowed in titles, descriptions, bullet points or images. | - | mandatory | US | all | [54] |
| `restricted_claims.competitor_references` | Do not make competitor comparisons in A+ Content and do not use brand names (your own or others') in search terms; in bullet points Amazon's writing guidance is not to compare the product with competitor brands or refer to other products. | - | mandatory | US, GB, AE, SA, IN | all | [23] |
| `restricted_claims.us_mocra` | US regulatory note cited by Amazon: cosmetics must comply with the Federal Food, Drug, and Cosmetic Act, the Fair Packaging and Labeling Act and MoCRA (Modernization of Cosmetics Regulation Act of 2022). Offers must be new and sealed with visible lot or matrix codes. Skin-lightening products need validation by an Amazon-authorized testing provider, including a GMP certificate and FDA Forms 5066 and 5067 (facility registration and product listing). | - | mandatory | US | beauty | [55] |
| `restricted_claims.uk_cosmetics_regulation` | UK regulatory note cited by Amazon: cosmetics sold in Great Britain must comply with the UK (GB) Cosmetics Regulation - a Cosmetics responsible person established in the UK, notification on the UK Submit Cosmetic Product Notification service, a product information file, and labelling including the responsible person's name and address. Northern Ireland follows the EU Cosmetics Regulation and CPNP notification. | - | mandatory | GB | beauty | [57] |
| `restricted_claims.uk_prohibited_listings` | UK: listings must not claim that a product is intended for the diagnosis, cure, mitigation, treatment or prevention of disease, must not convey misleading product information, and imitation perfumes must not be described as 'similar to' or 'inspired by' an original fragrance or use its name. | - | mandatory | GB | beauty | [56] |
| `restricted_claims.teeth_whitening_peroxide` | Teeth-whitening products that contain or release more than 0.1% hydrogen peroxide are not permitted (restricted to professional use). | 0.1 percent hydrogen peroxide | mandatory | GB, AE, SA | oral_care | [56] |
| `restricted_claims.ae_cosmetics` | UAE: only packaged beauty products that are appropriately described and labelled may be listed, and the seller must be approved by Amazon to sell in this category. Prohibited: expired, opened, unsealed or tester products, products with prohibited ingredients referenced in the Dubai Municipality label-assessment procedures, products claiming to contain snake oil, non-natural henna for skin. | - | mandatory | AE | beauty | [58] |
| `restricted_claims.sa_cosmetics` | Saudi Arabia: only packaged beauty products that are appropriately described and labelled may be listed, and the seller must be approved by Amazon to sell in this category; the same prohibited examples as the UAE apply. | - | mandatory | SA | beauty | [59] |
| `restricted_claims.in_cosmetics` | India: prohibited listings include products claiming to diagnose, cure, mitigate, treat or prevent disease unless approved by the food and drugs regulatory authorities, products barred from advertising under the Drugs and Magic Remedies (Objectionable Advertisement) Act, 1954, products banned by CDSCO, and expired, opened, unsealed or tester products. | - | mandatory | IN | beauty | [60] |
| `restricted_claims.before_after_images` | No explicit Amazon rule on before/after images for beauty products was found on the public pages retrieved. | - | informational | US, GB, AE, SA, IN | beauty | [16] (unverified) |
| `restricted_claims.ai_generated_content` | Sellers remain responsible for reviewing AI-generated listing and A+ suggestions: generated content can include features and claims that were not in the original listing and must be verified for accuracy and policy compliance before acceptance. | - | informational | US, GB, AE, SA, IN | all | [46] |

## 2. Walmart (US)

### 2.1 Marketplace sellers versus first-party suppliers

The rules below come from Walmart Marketplace Learn and therefore bind Marketplace sellers. Walmart's supplier-facing help (Supplier One, Retail Link) requires a login and could not be read, so no first-party content rules are asserted. What is public for suppliers is the developer documentation: the same product taxonomy with department mapping (Beauty is department 46) [96] and an on-request `PRODUCT_CONTENT_DATA` report that carries a Content Quality Score and insights for product name, key features, images and site description [98][99].

On Walmart.com, content from the brand owner or an authorized reseller takes priority: other sellers may find fields locked or see their content not published [70][84][83]. A rules engine should therefore distinguish 'content submitted' from 'content live'.

### 2.2 Rules

#### Title

| Rule id | Requirement | Value | Severity | Applies to | Source |
|---|---|---|---|---|---|
| `title.max_length` | Product titles must be brief and must not exceed 150 characters. | 150 characters | mandatory | marketplace_seller | [64] |
| `title.max_length.keyword_guide` | The Keyword optimization guide describes titles of more than 200 characters as excessively long (not recommended). | 200 characters | informational | marketplace_seller | [66] |
| `title.prohibited_caps_special_characters` | Titles must not be written in all caps and must not use special characters (examples given: ~ ! * $). | - | mandatory | marketplace_seller | [64] |
| `title.prohibited_promotional_claims` | Titles must not make promotional claims (examples: free shipping, Walmart fulfilled, hot sale, top rated, premium quality, best-selling, clearance, Black Friday, savings, low price). | - | mandatory | marketplace_seller | [64] |
| `title.prohibited_retailer_names` | Titles must not use 'Walmart' or any other retailer name unless licensed or part of the product's brand name. | - | mandatory | marketplace_seller | [64] |
| `title.prohibited_irrelevant_info_urls` | Titles must not include irrelevant information (coming soon, out-of-stock, discontinued) or URLs in any format, including Walmart.com. | - | mandatory | marketplace_seller | [64] |
| `title.no_years` | Titles must not include years (for example 2025, 2024) unless the content standards for the item's product type recommend it. | - | mandatory | marketplace_seller | [64] |
| `title.no_keyword_repetition` | Titles must be clear and descriptive without repetitive keywords, multiple brands or multiple product types; repeating keywords and phrases multiple times is prohibited. | - | mandatory | marketplace_seller | [64] |
| `title.capitalization_and_attribute_values` | Use proper capitalization and include relevant values that describe key attributes (for example 5 in, 4 count, 12 oz). | - | recommended | marketplace_seller | [64] |
| `title.style_guide_formula` | The product name should contain the attributes defined in Walmart's style guides (content standards) for the product type, in the expected order. | - | recommended | marketplace_seller | [94] |

#### Description

| Rule id | Requirement | Value | Severity | Applies to | Source |
|---|---|---|---|---|---|
| `description.min_words` | Write the description as one paragraph with a minimum of 150 words; word-count requirements vary by product category. | 150 words | recommended | marketplace_seller | [64] |
| `description.no_lists` | The description must not use bullet points or numbered lists. | - | mandatory | marketplace_seller | [64] |
| `description.prohibited_content` | The description must not contain: claims of competitor exclusivity; Walmart or other retailer names (unless licensed or part of the brand name); promotional claims; authenticity claims without Walmart's approval (food excepted); irrelevant information; external URLs unless legally required; emojis or special characters; a product different from the one in the title; excessive keyword repetition. | - | mandatory | marketplace_seller | [64] |
| `description.content` | Describe the item's features and benefits, including product name, brand and keywords customers are likely to search for. | - | recommended | marketplace_seller | [64] |
| `description.max_length` | A maximum description length is not stated on the public pages retrieved. | - | informational | marketplace_seller | [91] (unverified) |

#### Bullet points / key features

| Rule id | Requirement | Value | Severity | Applies to | Source |
|---|---|---|---|---|---|
| `bullets.min_count` | List three to 10 of the most important benefits and features as key features, most important first (minimum 3). | 3 key features | recommended | marketplace_seller | [64] |
| `bullets.max_count` | List three to 10 of the most important benefits and features as key features (maximum 10). | 10 key features | recommended | marketplace_seller | [64] |
| `bullets.max_length` | Each key feature must not exceed 80 characters, spaces included. | 80 characters per key feature | mandatory | marketplace_seller | [64] |
| `bullets.prohibited_formatting` | Key features must not use emojis or special characters, special characters as bullet points, HTML or other text formatting, or numbered lists. | - | mandatory | marketplace_seller | [64] |
| `bullets.prohibited_content` | Key features must not contain competitor-exclusivity claims, Walmart or other retailer names, promotional claims, irrelevant information, external URLs (unless legally required), a product different from the title, or excessive keyword repetition. | - | mandatory | marketplace_seller | [64] |
| `bullets.style` | Use short phrases and avoid repetitive keywords. | - | recommended | marketplace_seller | [64] |

#### Attributes

| Rule id | Requirement | Value | Severity | Applies to | Source |
|---|---|---|---|---|---|
| `attributes.required_by_product_type` | Attributes are required for every item. The product category, product type group and product type chosen at setup determine the applicable attributes; each product type has its own required attributes and supported values, published in the item spec. | - | mandatory | all | [96] |
| `attributes.value_validity` | Attribute values must be relevant to the attribute and match its unit of measure; using text where numbers are expected (or vice versa) and incorrect filler values are prohibited. | - | mandatory | marketplace_seller | [64] |
| `attributes.completeness` | Fill in as many attributes as possible when accurate information is available. | - | recommended | marketplace_seller | [64] |
| `attributes.cosmetics_labeling` | Listings for cosmetics (a restricted category) must include labeling that complies with the FD&C Act and FDA rules: product identity, net quantity, ingredient list, directions or instructions for use, and manufactured/distributed-by information. | - | mandatory | beauty, marketplace_seller | [81] |
| `attributes.prop65_warning` | If a product contains a chemical on the California Proposition 65 list and is shipped to California, the required warning must be provided on the product listing (California Warning Text field); otherwise the product must be restricted from sale in California. | - | mandatory | marketplace_seller | [82] |
| `attributes.beauty_specific_fields` | Which beauty-specific attributes (ingredients, scent, hair type, skin type, expiry, country of origin, count) are required per product type is not listed on the public pages retrieved. | - | informational | beauty | [96] (unverified) |

#### Identifiers (GTIN / barcode / brand)

| Rule id | Requirement | Value | Severity | Applies to | Source |
|---|---|---|---|---|---|
| `identifiers.product_id_required` | Every item sold on Walmart Marketplace must have a product ID of an accepted type: GTIN (14 digits), UPC (12 digits), ISBN (10 or 13 digits, books only) or EAN (13 digits). Model numbers and SKU numbers are not valid product IDs. | - | mandatory | marketplace_seller | [73] |
| `identifiers.gs1_validation` | Walmart cross-references product IDs with the GS1 database; IDs not recognized by GS1, used for the wrong product type, or registered to a different brand or company are invalid. Listings with invalid product IDs are removed and may lead to account suspension or termination. | - | mandatory | marketplace_seller | [73] |
| `identifiers.one_id_per_product` | Use exactly one product identifier per product at setup, entered as digits only (no dashes or spaces); each product needs its own unique ID and reuse of a product ID for a different item is strictly prohibited. | - | mandatory | marketplace_seller | [73] |
| `identifiers.gtin_exemption` | Products without a manufacturer-issued GTIN (for example private-label or handmade products) may qualify for a GTIN exemption, requested during item setup (Product ID Type 'GTIN', Product Identifier 'CUSTOM') or in the GTIN exemptions dashboard; the approved brand and product type must then be used at setup. | - | informational | marketplace_seller | [75] |
| `identifiers.gtin_exemption_scope` | An item set up under a GTIN exemption must use the same brand and product type that were approved for the exemption. | - | mandatory | marketplace_seller | [74] |
| `identifiers.duplicate_listings` | Creating duplicate listings is a policy violation: duplicates are unpublished, and items unpublished for more than 90 days are retired from the catalog. Items sharing a product ID are merged into one listing. | - | mandatory | marketplace_seller | [78] |
| `identifiers.brand_portal` | Walmart Brand Portal registration requires an active USPTO trademark with a seven-digit registration number; the brand's acting brand owner and authorized resellers get priority for item content. | - | informational | brand_registered | [83] |

#### Images - main image and technical specifications

| Rule id | Requirement | Value | Severity | Applies to | Source |
|---|---|---|---|---|---|
| `images_main.background` | Main images must show the item on a seamless white background (RGB 255/255/255); images of larger items may show the item in an expected environment. | - | mandatory | marketplace_seller | [65] |
| `images_main.no_watermark_name_logo` | The main image must not contain watermarks, the seller's name or the seller's logo. | - | mandatory | marketplace_seller | [65] |
| `images_main.no_extra_accessories` | The main image must not show accessories that are not included with the item; avoid positioning too many props in the image. | - | mandatory | marketplace_seller | [65] |
| `images_main.frame_fill` | Crop the item as close as possible to the image frame, avoid excessive background space and do not upscale smaller images. | - | recommended | marketplace_seller | [65] |
| `images.recommended_px` | Image pixel dimensions: 2200 x 2200 pixels. | 2200 pixels | recommended | marketplace_seller | [65] |
| `images.zoom_threshold_px` | Minimum pixel dimensions for zoom: 1500 x 1500 pixels. | 1500 pixels | recommended | marketplace_seller | [65] |
| `images.aspect_ratio` | Image aspect ratio must be 1:1 (square). | - | mandatory | marketplace_seller | [65] |
| `images.file_formats` | Accepted image formats: JPEG, JPG, PNG, BMP. GIF images are not permitted. Colour format RGB, bit depth 8 bits per pixel. | - | mandatory | marketplace_seller | [65] |
| `images.max_file_size` | Image file size must be 5 MB or less. | 5 MB | mandatory | marketplace_seller | [65] |
| `images.placeholder` | If no image is available, only the designated Walmart placeholder image may be used; the item is not published until the placeholder is replaced with an actual product image. Stock photos are not allowed. | - | mandatory | marketplace_seller | [65] |

#### Images - additional

| Rule id | Requirement | Value | Severity | Applies to | Source |
|---|---|---|---|---|---|
| `images.swatch_px` | Swatch images: 100 x 100 pixels; provide swatch images where applicable. | 100 pixels | recommended | marketplace_seller | [65] |
| `images.min_count` | Upload a minimum of four images for each listing. | 4 images | recommended | marketplace_seller | [65] |
| `images.max_count` | The maximum number of images per listing is not stated on the public pages retrieved. | - | informational | marketplace_seller | [65] (unverified) |
| `images_secondary.content_rules` | All images must correspond with the product name, type and key attributes; no duplicate images; in focus and professionally lit; no claims or promotional language; no Walmart or other retailer or e-commerce platform logos or names; no languages other than English; no out-of-stock or sold-out imagery; no descriptions of item condition; AI-generated images must be truthful, accurate and not misleading. | - | mandatory | marketplace_seller | [65] |
| `images.url_requirements` | When images are supplied by URL, the URL must end in an image file type, be publicly accessible, use port 8080, 80, 443 or 8443, and contain no query string; HTML pages and Dropbox URLs are not supported. | - | mandatory | marketplace_seller | [65] |

#### Video

| Rule id | Requirement | Value | Severity | Applies to | Source |
|---|---|---|---|---|---|
| `video.eligibility` | All Marketplace sellers can add a product video through the Media Library in Seller Center (Catalog > Media Library) or the Rich Media API; the item must already exist in the catalog and be in New condition. | - | informational | marketplace_seller | [68] |
| `video.max_file_size` | A video uploaded in the Media Library must be 100 MB or less. | 100 MB | mandatory | marketplace_seller | [69] |
| `video.title_max_length` | The video title cannot be longer than 200 characters. | 200 characters | mandatory | marketplace_seller | [69] |
| `video.one_video_per_item` | A catalog item can have one associated video; submitting a new video replaces the existing one. A video can be associated with up to 50 catalog items (GTINs). | 1 videos per item | mandatory | marketplace_seller | [95] |
| `video.captions` | A .vtt (WebVTT) caption file is recommended with each video submission. GIF imagery is not permitted as rich media. | - | recommended | marketplace_seller | [68] |
| `video.format_duration` | Accepted video file formats, resolution and duration limits are not stated on the public pages retrieved. | - | informational | marketplace_seller | [68] (unverified) |

#### Enhanced content

| Rule id | Requirement | Value | Severity | Applies to | Source |
|---|---|---|---|---|---|
| `enhanced_content.brand_highlights_eligibility` | Brand Highlights (images, videos and text that tell the brand story) are available to brand owners registered in Brand Portal with no recorded intellectual-property or Trust and Safety policy violation; only the seller's published items in new condition for which the seller is the brand owner can be linked. | - | mandatory | brand_registered | [68] |
| `enhanced_content.policy` | Rich media must comply with Walmart policies; AI-generated content must be accurate, truthful and rights-compliant; Walmart may unpublish rich media that violates policy. | - | mandatory | marketplace_seller | [68] |
| `enhanced_content.module_specs` | Module types, image sizes and text limits for Brand Highlights are not published on the pages retrieved. | - | informational | brand_registered | [69] (unverified) |
| `enhanced_content.partners` | Content-syndication partners for rich media are not named on the current public pages; Walmart only states that Approved Solution Providers can be used to outsource content updates. | - | informational | all | [70] (unverified) |

#### SEO / keywords

| Rule id | Requirement | Value | Severity | Applies to | Source |
|---|---|---|---|---|---|
| `seo.keyword_placement` | Keywords belong in the product title, description and key features; select one or two primary keywords and use each once in the title, description and key features. | - | recommended | marketplace_seller | [66] |
| `seo.keyword_stuffing` | Do not repeat the same word in a single title or description and do not include keywords that are not relevant to the item. | - | recommended | marketplace_seller | [66] |
| `seo.unique_content` | Use engaging words that are useful to the customer and unique to Walmart.com rather than copied from other online retailers. | - | recommended | marketplace_seller | [66] |
| `seo.categorization` | Choose the correct product category, product type group and product type; categorization and attribution determine how items appear in search and browse. | - | recommended | marketplace_seller | [67] |

#### Variants, bundles and multipacks

| Rule id | Requirement | Value | Severity | Applies to | Source |
|---|---|---|---|---|---|
| `variants.variant_group` | Each variant is a separate item. All items in a variant group must share the same variantGroupId and the same variantAttributeNames, provide values for the same variant attributes, represent a unique combination of values and include exactly one primary variant; an item can belong to only one variant group. | - | mandatory | all | [97] |
| `variants.management` | Variant groups can be created from the Catalog page, by uploading a template in Seller Center or through APIs, and can later be edited, combined, split or extended with new variant attributes. | - | informational | marketplace_seller | [76] |
| `variants.max_variant_attributes` | Up to three variant attributes can be used per variant group, and each must exist in the item's Visible section or the submission fails. | 3 variant attributes | mandatory | all | [97] |
| `variants.virtual_packs_and_bundles` | A virtual pack sells the same product in different quantities (same product ID); a virtual bundle sells different complementary products as one offer (each with its own product ID). Virtual bundles are invitation-only. | - | informational | marketplace_seller | [77] |

#### Language

| Rule id | Requirement | Value | Severity | Applies to | Source |
|---|---|---|---|---|---|
| `language.english_only` | All product labels, information and images in a Walmart.com listing must be in English. Title, description and key features may use another language only where it is part of the item or brand name; information may appear in other languages if it also appears in English. | - | mandatory | marketplace_seller | [79] |

#### Approval, moderation and timelines

| Rule id | Requirement | Value | Severity | Applies to | Source |
|---|---|---|---|---|---|
| `approval.item_setup_time` | After submitting an item or a content update, status is tracked in the Activity Feed; updates may take up to 24 hours, longer if data errors are detected. | 24 hours | informational | marketplace_seller | [72] |
| `approval.content_update_time` | Content updates submitted in Seller Center may take up to 24 hours and are tracked in the Activity feed; updates for Walmart-fulfilled items must be made with a spreadsheet. | 24 hours | informational | marketplace_seller | [71] |
| `approval.content_priority` | Walmart selects the best content for each item attribute and gives priority to content from brand owners and their authorized resellers; without those privileges some content fields, including blank fields, are locked and submitted content may not be published. | - | informational | marketplace_seller | [70] |
| `approval.category_preapproval` | Items in certain categories require pre-approval before they can be offered, including topical products, fragrances, ingestible products and select product types within personal care and beauty, OTC drugs and medical devices. | - | mandatory | beauty, marketplace_seller | [79] |
| `approval.listing_quality_refresh` | Listing Quality scores are calculated daily; updated scores may not appear immediately and newly published offers may take up to a week to be reflected in the dashboard. | 7 days | informational | marketplace_seller | [86] |

#### Restricted claims and prohibited content

| Rule id | Requirement | Value | Severity | Applies to | Source |
|---|---|---|---|---|---|
| `restricted_claims.cosmetics_restricted_category` | Cosmetics is a restricted Marketplace category limited to certain sellers who complete an enhanced vetting programme; cosmetics must comply with the FD&C Act, FDA regulations (including facility registration, product listing and good manufacturing practice) and FTC advertising law. | - | mandatory | beauty, marketplace_seller | [81] |
| `restricted_claims.disease_claims` | A product presented as a cosmetic must not claim, explicitly or implicitly, in labels, labeling or advertising to diagnose, cure, mitigate, treat or prevent diseases, illnesses, ailments, infections or viruses; such products are treated as unapproved drugs. | - | mandatory | beauty, marketplace_seller | [81] |
| `restricted_claims.truthful_cosmetic_claims` | All cosmetic claims on labels and on Walmart.com must be truthful and not misleading and must not claim to affect the structure or function of the body. Named problem claims: a specific improvement ('reduce wrinkles by 99 percent'), permanent or long-lasting results, fake or misleading before-and-after images, and 'natural' or 'clean' claims without competent and reliable scientific evidence. | - | mandatory | beauty, marketplace_seller | [81] |
| `restricted_claims.skin_whitening` | Skin whitening and skin lightening products and claims are banned, as are cosmetics containing more than 1 ppm mercury; products with skin-brightening claims are restricted and require enhanced vetting with laboratory testing. | - | mandatory | skin_care, marketplace_seller | [81] |
| `restricted_claims.general_product_claims` | Listings may contain only truthful claims. Made-in-the-USA claims must be consistent across images, packaging and attributes; 'biodegradable', 'degradable', 'compostable' and 'decomposable' claims are restricted; products containing PFAS-type 'forever chemicals' are restricted. | - | mandatory | marketplace_seller | [80] |
| `restricted_claims.authenticity_and_exclusivity` | Do not make authenticity claims ('authentic ...', '100% authenticated ...') unless Walmart has approved the claim or the item is a food product, and do not claim competitor exclusivity. | - | mandatory | marketplace_seller | [64] |
| `restricted_claims.ai_generated_content` | AI-generated content must be truthful, accurate and not misleading; the seller must review and substantiate it before publication. AI content that misrepresents a product, makes unsubstantiated or unsafe claims or fabricates reviews or endorsements is prohibited. | - | mandatory | marketplace_seller | [64] |
| `restricted_claims.antibacterial_pesticide` | No Walmart Marketplace page stating a rule for 'anti-bacterial' or pesticide-type claims in beauty listings was retrieved. | - | informational | beauty, marketplace_seller | [79] (unverified) |

## 3. noon (UAE and Saudi Arabia)

### 3.1 Notes

- noon separates **Seller SKUs** (ZSKU: the seller owns and edits the content, noon approves it) from **noon SKUs** (NSKU: noon-controlled brands, content owned and modified by noon) [114][117]. The rules below are for Seller SKUs.
- **UAE versus Saudi Arabia**: content rules and language requirements are the same in both countries [105]. Differences are in gating documents (Saudi hair personal care needs an SFDA certification document; Saudi fragrance needs a Ministry of Commerce product registration document) [114] and in country-specific prohibited products and keywords (for example 'Christmas', 'Halloween' and 'Easter' in Saudi Arabia) [115].
- Several noon articles give two different numbers for the same limit; both are recorded and the stricter one is marked as the safe target (see section 7).

### 3.2 Rules

#### Title

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `title.max_length` | The title should be between 5 and 200 characters long (upper bound). | 200 characters | mandatory | AE, SA | marketplace_seller | [100] |
| `title.max_length.qc_example` | The article's 'Title too long' rejection example states that the title must not exceed 160 characters. | 160 characters | recommended | AE, SA | marketplace_seller | [100] |
| `title.min_length` | The title should be between 5 and 200 characters long (lower bound). | 5 characters | mandatory | AE, SA | marketplace_seller | [100] |
| `title.min_length.qc_example` | The article's 'Title too short' rejection example states that the title should not be less than 20 characters. | 20 characters | recommended | AE, SA | marketplace_seller | [100] |
| `title.product_type_required` | The title must contain the product type or sub-type and the product's top features while staying as short as possible. | - | mandatory | AE, SA | marketplace_seller | [100] |
| `title.prohibited_special_characters` | Titles must not include special characters (examples: @ ^ * # &). | - | mandatory | AE, SA | marketplace_seller | [100] |
| `title.capitalization` | Do not use ALL CAPS; capitalize only the first letter of each word except prepositions, conjunctions and articles. Acronyms (UAE, HP, LED) may be upper case and product series must be written as the brand writes them. | - | mandatory | AE, SA | marketplace_seller | [100] |
| `title.prohibited_promotional_content` | Titles must not include promotional phrases, prices, shipping options or irrelevant search keywords. | - | mandatory | AE, SA | marketplace_seller | [100] |
| `title.prohibited_words` | Titles must not contain prohibited, banned or restricted words. | - | mandatory | AE, SA | marketplace_seller | [100] |
| `title.no_repetition` | Titles must not contain repetitive words. Do not repeat attributes that noon concatenates into the displayed title automatically (for example the colour name is appended as a suffix in apparel). | - | mandatory | AE, SA | marketplace_seller | [100] |
| `title.spelling_grammar` | Titles must be free of spelling errors and grammatically correct. | - | mandatory | AE, SA | marketplace_seller | [100] |
| `title.consistency` | Product information in the title must be identical to the specifications, feature bullets and long description, and images must depict the product described in the title (for example the same pack quantity). | - | mandatory | AE, SA | marketplace_seller | [100] |
| `title.no_brand_name` | The article lists the brand name among items a title should not include. | - | recommended | AE, SA | marketplace_seller | [100] |
| `title.concise` | Keep titles concise, well written, easy to read and unique; mention only important features and move extra information to the feature bullets (avoid keyword stuffing). | - | recommended | AE, SA | marketplace_seller | [100] |

#### Description

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `description.min_length` | A good product description must not be less than 250 characters. | 250 characters | recommended | AE, SA | marketplace_seller | [101] |
| `description.max_length` | A product description should not exceed 4000 characters. | 4000 characters | recommended | AE, SA | marketplace_seller | [101] |
| `description.prohibited_content` | Descriptions must not contain price, shipping or warranty information, brand history or seller information, prohibited or restricted content, emojis, links to a store or other websites, HTML tags, ALL CAPS text or bold/italic styling, and must not contradict the title, images, feature bullets or specifications. | - | mandatory | AE, SA | marketplace_seller | [101] |
| `description.style` | Descriptions should be unique to the product, useful, clear, grammatically correct and place the most important information first; avoid generic text. | - | recommended | AE, SA | marketplace_seller | [101] |

#### Bullet points / key features

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `bullets.recommended_count` | Write 5 feature bullets (product highlights) per product, focused on the key selling points. | 5 bullets | recommended | AE, SA | marketplace_seller | [101] |
| `bullets.max_length` | Feature bullets must not exceed 250 characters per bullet point. | 250 characters per bullet | mandatory | AE, SA | marketplace_seller | [101] |
| `bullets.prohibited_content` | Feature bullets must not include sales or promotional information, special characters (examples: ^ 1/2 @ * # $), references to other marketplaces ('Sold on Amazon', 'Namshi'), emojis, links to a store, contact information or external websites, or HTML tags. | - | mandatory | AE, SA | marketplace_seller | [101] |
| `bullets.accuracy_and_uniqueness` | Feature bullets must match the title and specifications, must not repeat the same information across bullets and must be free of grammatical and spelling errors. | - | mandatory | AE, SA | marketplace_seller | [101] |
| `bullets.format` | Capitalize the first letter of each bullet, do not end a bullet with punctuation, use semicolons to separate phrases, keep bullets brief yet descriptive and put the most important features first. | - | recommended | AE, SA | marketplace_seller | [101] |

#### Attributes

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `attributes.mandatory_completeness` | Mandatory attributes are defined per category or sub-category and must be 100% complete before a Seller SKU is submitted to noon's quality check. | 100 percent of mandatory attributes | mandatory | AE, SA | marketplace_seller | [107] |
| `attributes.core_category_brand` | Category and brand are core Seller SKU information; if they are chosen incorrectly the SKU is rejected and a new SKU must be created. | - | mandatory | AE, SA | marketplace_seller | [107] |
| `attributes.valid_values` | For attributes with a drop-down list, select only existing values; enter each value under the correct attribute header; values must not contradict the official brand website. | - | mandatory | AE, SA | marketplace_seller | [108] |
| `attributes.formatting` | Attribute values must be correctly spelled and capitalized (not ALL CAPS, not all lower case) and must not repeat the same data across attributes (for example model name versus model number). | - | mandatory | AE, SA | marketplace_seller | [108] |
| `attributes.brand_value` | Write the brand name exactly as the manufacturer writes it; for an unbranded or generic product set the brand to 'generic' (not 'N/A', 'No brand' or 'unbranded'). | - | mandatory | AE, SA | marketplace_seller | [109] |
| `attributes.optional` | Fill in as many optional attributes as possible; noon shows the percentage of optional attributes completed and says it improves the overall quality of the Seller SKU. | - | recommended | AE, SA | marketplace_seller | [108] |
| `attributes.beauty_specific_fields` | The mandatory attributes for beauty categories (ingredients, scent, hair type, skin type, expiry or shelf life, country of origin, unit count) are not listed on the public help pages retrieved. | - | informational | AE, SA | beauty, marketplace_seller | [108] (unverified) |

#### Identifiers (GTIN / barcode / brand)

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `identifiers.barcode_required` | A barcode on every unit is mandatory for products sold through Fulfilled by noon or Fulfilled by Partner; each SKU, including each size or colour version, must have its own unique barcode mapped in Seller Lab. | - | mandatory | AE, SA | marketplace_seller | [110] |
| `identifiers.barcode_format` | If the product has no manufacturer barcode (EAN/UPC), create a custom alphanumeric barcode of up to 16 characters or use the Partner SKU or model number; do not use symbols (+ / - % &) or spaces. | 16 characters | mandatory | AE, SA | marketplace_seller | [110] |
| `identifiers.gtin` | A GTIN is entered 'if applicable' during SKU creation and is also used as the partner barcode in the bulk template; noon does not state that a GS1-registered GTIN is required to list. | - | informational | AE, SA | marketplace_seller | [112] |
| `identifiers.duplicate_sku` | Creating duplicate listings of the same SKU is prohibited; noon may delist the duplicate or the entire partner catalog. | - | mandatory | AE, SA | marketplace_seller | [114] |
| `identifiers.brand_registration` | A brand that does not yet exist on noon must be registered and approved before its products can go live; some brands and categories are gated and only whitelisted sellers may sell them. | - | mandatory | AE, SA | marketplace_seller | [114] |

#### Images - main image and technical specifications

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `images_main.required` | At least one good-quality image is needed for a Seller SKU to go live. | 1 images | mandatory | AE, SA | marketplace_seller | [107] |
| `images_main.background` | The primary image must have a pure white background (for fashion a light grey background is recommended). | - | mandatory | AE, SA | marketplace_seller | [102] |
| `images_main.front_view_single` | The primary image must be a front view of the product, must not be a lifestyle image, must not combine multiple views of the product, and may have only light shadows (no hard shadows or reflections). | - | mandatory | AE, SA | marketplace_seller | [102] |
| `images_main.no_packaging` | The product must be displayed outside its packaging in the primary image: no boxes, bags, cases or brand or swing tags. | - | mandatory | AE, SA | marketplace_seller | [102] |
| `images_main.not_cropped` | The primary image must show the entire product; cropped or half images are not allowed. | - | mandatory | AE, SA | marketplace_seller | [102] |
| `images.file_format` | Images must be submitted in JPEG or JPG format only. | - | mandatory | AE, SA | marketplace_seller | [102] |
| `images.min_width_px` | Image width must be at least 660 pixels. | 660 pixels | mandatory | AE, SA | marketplace_seller | [102] |
| `images.aspect_ratio` | The width-to-height ratio of an image must be at least 0.5. | 0.5 width/height ratio (minimum) | mandatory | AE, SA | marketplace_seller | [102] |
| `images.resolution_ppi` | Image resolution must be at least 72 PPI. | 72 ppi | mandatory | AE, SA | marketplace_seller | [102] |
| `images.max_file_size` | An image must not exceed 10 MB. | 10 MB | mandatory | AE, SA | marketplace_seller | [102] |
| `images.frame_fill` | The product must cover at least 70-80% of the image frame. | 70 percent of image frame | mandatory | AE, SA | marketplace_seller | [102] |
| `images.zoom_threshold` | A pixel threshold for image zoom is not documented; noon links clarity when zoomed to the 72 PPI minimum. | - | informational | AE, SA | marketplace_seller | [102] (unverified) |

#### Images - additional

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `images.recommended_count` | Upload a minimum of 3 high-quality images showing different angles, sizes and textures. | 3 images | recommended | AE, SA | marketplace_seller | [102] |
| `images.max_count` | The single-SKU creation flow accepts 1 to 9 product images. | 9 images | mandatory | AE, SA | marketplace_seller | [112] |
| `images_secondary.content_rules` | Images must match the title and description and be high-resolution photographs (no CAD drawings, thumbnails or illustrations). They must not contain logos, watermarks, seller names, unwanted text or objects, borders, price or warranty information, manufacturing or expiry dates, accessories that are not included, placeholder images or duplicates. | - | mandatory | AE, SA | marketplace_seller | [102] |
| `images_secondary.sequence` | Standard image order: front view, back view, side view, other angles, details, usage. | - | recommended | AE, SA | marketplace_seller | [102] |

#### Video

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `video.eligibility` | Video upload in Seller Lab is enabled only for a limited group of sellers (phased rollout). Sellers without the 'Add video' button can send the file through a Seller Support ticket for the catalog team to upload. | - | informational | AE, SA | marketplace_seller | [103] |
| `video.file_formats` | Accepted video formats: MP4, MOV, WEBM (MP4 recommended). | - | mandatory | AE, SA | marketplace_seller | [103] |
| `video.min_resolution` | Minimum video resolution is 480p; 1080p or higher is recommended. | 480 p | mandatory | AE, SA | marketplace_seller | [103] |
| `video.max_file_size` | Maximum video file size is 5 GB (optimal: 10 MB). | 5 GB | mandatory | AE, SA | marketplace_seller | [103] |
| `video.max_duration` | Maximum video duration is 2.5 minutes (optimal: 30 seconds). | 2.5 minutes | mandatory | AE, SA | marketplace_seller | [103] |
| `video.language` | Videos must be in English or Arabic only. | - | mandatory | AE, SA | marketplace_seller | [103] |
| `video.prohibited_content` | Videos must not contain pricing or discounts, shipping information, customer reviews or ratings, guarantees or warranties, competitor comparisons, seller contact details, external links, QR codes or URLs, more than one brand logo on screen, copyrighted material without permission, or offensive, sexual or unsafe content. | - | mandatory | AE, SA | marketplace_seller | [103] |

#### Enhanced content

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `enhanced_content.format` | A+ content on noon currently supports image banners only; they appear on the product detail page under Product Features, immediately after the specifications, in top-to-bottom order. | - | informational | AE, SA | marketplace_seller | [104] |
| `enhanced_content.max_banners` | Up to 10 image banners can be added per product. | 10 banners | mandatory | AE, SA | marketplace_seller | [104] |
| `enhanced_content.banner_min_width_px` | A+ banner width must be at least 1800 pixels (recommended 2400, maximum 3600); height is dynamic. | 1800 pixels | mandatory | AE, SA | marketplace_seller | [104] |
| `enhanced_content.banner_max_width_px` | A+ banner width must not exceed 3600 pixels. | 3600 pixels | mandatory | AE, SA | marketplace_seller | [104] |
| `enhanced_content.banner_file` | A+ banners must be JPEG, PNG, WebP or AVIF, up to 10 MB per image, clear and not blurry or corrupted. | 10 MB | mandatory | AE, SA | marketplace_seller | [104] |
| `enhanced_content.no_carousel_duplicates` | Do not reuse images that are already in the product image carousel as A+ banners. | - | mandatory | AE, SA | marketplace_seller | [104] |
| `enhanced_content.bilingual_banners` | A+ banners can be added separately for English and Arabic. | - | informational | AE, SA | marketplace_seller | [104] |
| `enhanced_content.tips` | Avoid too much text inside banners, make them mobile-friendly, use high-resolution lifestyle imagery and keep a clear top-to-bottom story. | - | recommended | AE, SA | marketplace_seller | [104] |
| `enhanced_content.eligibility` | Eligibility criteria for A+ content on noon (for example brand ownership) are not stated on the public page. | - | informational | AE, SA | marketplace_seller | [104] (unverified) |

#### SEO / keywords

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `seo.backend_search_terms` | No backend or hidden search-term field is documented for noon listings. | - | informational | AE, SA | marketplace_seller | [100] (unverified) |
| `seo.no_keyword_stuffing` | Do not add irrelevant search keywords to the title or stuff it with features; extra information belongs in the feature bullets. | - | recommended | AE, SA | marketplace_seller | [100] |

#### Variants, bundles and multipacks

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `variants.sizes` | Sizes are added as child SKUs under a parent SKU; the description is shared across variations while price, stock and (for colours) images can differ per variant. | - | informational | AE, SA | marketplace_seller | [111] |
| `variants.groups` | Colour and other attribute variations are linked through Groups; the attribute axes are predetermined per category and only parent SKUs of the same brand can be added to the same group. | - | mandatory | AE, SA | marketplace_seller | [111] |
| `variants.creation_quota` | noon applies a monthly limit of up to 25,000 new products; size variants under one parent count as one product, each colour variant and each unlinked SKU counts individually. | 25000 new products per month | informational | AE, SA | marketplace_seller | [114] |
| `variants.bundles_multipacks` | No dedicated bundle or multipack listing policy is published; the only stated rule is that a bundle's primary image must show the full bundle. | - | informational | AE, SA | marketplace_seller | [102] (unverified) |

#### Language

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `language.english_mandatory` | UAE and Saudi Arabia: English content is mandatory for every Seller SKU and must be approved for the product to go live. | - | mandatory | AE, SA | marketplace_seller | [105] |
| `language.arabic_optional` | UAE and Saudi Arabia: Arabic content is optional, but noon advises providing at least the Arabic title; with English-only content the product may be shown only on the English site and hidden from the Arabic one. | - | recommended | AE, SA | marketplace_seller | [105] |
| `language.no_translation_service` | noon does not translate Seller SKU content: free-text fields such as title, description and feature bullets must be written by the seller in each language; only standardized drop-down values are translated automatically. | - | informational | AE, SA | marketplace_seller | [117] |
| `language.content_export` | The Content Export import in Seller Lab downloads all content of a Partner SKU in English and Arabic so that missing translations can be added and re-uploaded in bulk. | - | informational | AE, SA | marketplace_seller | [106] |

#### Approval, moderation and timelines

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `approval.qc_required` | Every Seller SKU is reviewed by noon's content quality team; the content must be QC-approved before the product can go live. Statuses: Content Pending, QC Pending, Approved, Rejected, shown separately for English and Arabic. | - | mandatory | AE, SA | marketplace_seller | [107] |
| `approval.qc_time` | noon aims to approve or reject Seller SKU content within 2 business days of submission. | 2 business days | informational | AE, SA | marketplace_seller | [107] |
| `approval.go_live_conditions` | A listed product goes live only when content is QC-approved, price and stock are set, a barcode is mapped to each SKU, the seller is whitelisted for gated brands or categories and (for Fulfilled by Partner) the warehouse is approved. | - | mandatory | AE, SA | marketplace_seller | [114] |
| `approval.authorized_channels` | SKU creation and updates are allowed only through Seller Lab, the NIS bulk upload, noon's public APIs or integrations supported by noon; other channels violate the listing policy. | - | mandatory | AE, SA | marketplace_seller | [114] |
| `approval.beauty_gating_documents` | Beauty categories are gated. UAE (Fragrance, Hair personal care, Colour cosmetics, Electronic personal care): trade licence, VAT certificate, brand authorization letter and invoice from an authorized distributor. KSA Hair personal care: the same plus an SFDA certification document. KSA Fragrance: the same plus a product registration document (Ministry of Commerce). KSA Colour cosmetics and Electronic personal care: the four basic documents. | - | mandatory | AE, SA | beauty, marketplace_seller | [114] |

#### Restricted claims and prohibited content

| Rule id | Requirement | Value | Severity | Countries | Applies to | Source |
|---|---|---|---|---|---|---|
| `restricted_claims.prohibited_keywords` | Listing content and images must not contain words from noon's Prohibited Keywords List, pharmaceutical names and ingredients banned by the UAE Ministry of Health and Prevention (MOHAP), or country-specific restricted keywords; detected keywords cause rejection ('Banned Products - This type of products should not be listed'). | - | mandatory | AE, SA | marketplace_seller | [116] |
| `restricted_claims.ksa_restricted_keywords` | Saudi Arabia: the keywords 'Christmas', 'Merry Christmas', 'Halloween' and 'Easter' are restricted in titles, descriptions, tags and imagery, and rainbow-coloured products and non-Islamic religious symbols are prohibited. | - | mandatory | SA | marketplace_seller | [115] |
| `restricted_claims.promotional_and_marketplace_references` | No sales or promotional wording, prices, shipping or warranty information in titles, bullets, descriptions or images, and no references to other marketplaces. | - | mandatory | AE, SA | marketplace_seller | [101] |
| `restricted_claims.health_claims` | Product videos must avoid unverified medical or health claims (examples: 'cures headaches', 'heals skin conditions'), must not promote weight loss without the diet-and-exercise qualifier and must not present the product as a substitute for medical advice or treatment. | - | mandatory | AE, SA | beauty, marketplace_seller | [103] |
| `restricted_claims.environmental_and_endorsements` | In videos, environmental claims such as 'eco-friendly' or 'biodegradable' must be backed by credible evidence, and endorsements and testimonials must be truthful and comply with local advertising regulations. | - | mandatory | AE, SA | marketplace_seller | [103] |
| `restricted_claims.expired_products_and_dates` | Expired products are banned, and product images must not show manufacturing or expiry dates. | - | mandatory | AE, SA | marketplace_seller | [116] |
| `restricted_claims.before_after_and_drug_claims_text` | No explicit noon rule on before/after images, 'anti-bacterial' wording or drug claims in the text of beauty listings was found on the public pages retrieved. | - | informational | AE, SA | beauty, marketplace_seller | [116] (unverified) |

## 4. Official listing-quality signals - what really exists and how to get it

### 4.1 Amazon

| Official name | What it measures | Components | Access | Who | Source |
|---|---|---|---|---|---|
| Listing Quality Indicator (Enhance Listings) | How complete and correct a product detail page is compared with best-in-class listings in similar categories. It is a directional indicator; it does not account for price, fulfilment or seasonality. | Two pillars: Content quality (titles, bullet points, key attributes - correctness, completeness, policy compliance) and Multimedia quality (image and A+ content quality and completeness). Result is one of five categories: Poor, Fair, Good, Great, Optimized - not a number. | seller_portal_only | Selling partners in Seller Central: Manage Products > Enhance tab (per-ASIN side panel with factors and AI-generated suggestions; 'Improve listing quality in bulk'). | [46] |
| Listing quality (seven key components) | Amazon's published definition of a quality listing. | Title, bullet points, attributes, images, video, A+ Content and search optimization. | none | Public guidance page. | [44] |
| Listings Items API - listing issues | Validation and catalog-pipeline issues on a seller SKU that can make a listing inactive, suppressed from search or otherwise deficient. | Issue list per SKU with code, message, severity (ERROR and WARNING appear in the documentation examples), affected attribute names, issue categories (for example INVALID_PRICE) and enforcement actions (the notification example lists SEARCH_SUPPRESSED, LISTING_SUPPRESSED, ATTRIBUTE_SUPPRESSED and CATALOG_ITEM_REMOVED). Synchronous issues on submission; asynchronous issues after processing. | api API/reference: https://developer-docs.amazon.com/sp-api/docs/listings-items-api-v2021-08-01-reference | SP-API developers and integrators acting for a selling partner. | [51] |
| Search suppression / 'Fix' tab and Suppressed Listings Report | Listings hidden from search and browse because required elements are missing or policies are violated (main image, category/item type, title, unit count for consumables, title policy violations). | List of suppressed listings with reasons and next steps. | downloadable_report API/reference: https://developer-docs.amazon.com/sp-api/docs/report-type-values-inventory | Sellers in Seller Central (Manage Products > Fix tab; 'Search suppressed and inactive listings') and SP-API users via report type GET_MERCHANTS_LISTINGS_FYP_REPORT (Suppressed Listings Report, tab-delimited, one store per report). | [52] |
| A+ Content Manager - Content Quality Analysis | Quality of published A+ content: readability, information completeness, visual presentation and conversion effectiveness, assessed by an AI system; low-quality A+ may be shown collapsed by default. | Personalized recommendations and status per A+ project (details only inside the tool). | seller_portal_only | Brand-registered sellers and vendors with A+ Content Manager access. | [27] |
| Image 'Content compliance issues' report (Submission status) | Images that failed technical or policy checks after upload. | Per-file failure reasons (for example non-white background, text or watermark on main image, cropped product). | seller_portal_only | Sellers in Seller Central (Submission status > Content compliance issues report type). | [17] |
| Retail readiness score | No official Amazon score with this name was found. | Not applicable. | none | Not applicable. | [44] (unverified) |

What this means in practice:

- The **Listing Quality Indicator** is the only official Amazon rating of listing quality. Amazon describes it as measuring 'how complete and correct your product detail page is' on two pillars (content quality; multimedia quality) and as 'a directional indicator rather than a predictor of visibility or sales' [46]. The same text is on the US, UK, India, UAE and Saudi help sites. It can only be read in Seller Central; no report or API endpoint for it is documented.
- Amazon's public definition of a quality listing has **seven components**: title, bullet points, attributes, images, video, A+ Content and search optimization [44][45]. This is a framework, not a score.
- For automation, use **listing issues**: `getListingsItem` or `searchListingsItems` with `includedData=issues`, the `LISTINGS_ITEM_ISSUES_CHANGE` notification, JSON_LISTINGS_FEED processing reports and `mode=VALIDATION_PREVIEW` [51][50]. Issues carry a severity and, where applicable, enforcement actions (search suppressed, listing suppressed, attribute suppressed, catalog item removed). They tell you what is wrong, not how good the listing is.
- **Search suppression** is visible in Manage Products > Fix and through the Suppressed Listings Report (`GET_MERCHANTS_LISTINGS_FYP_REPORT`) [48][49][52]. Manage Products has three tabs - All, Fix (issues blocking sales or visibility) and Enhance (improvement opportunities) [47].
- No official 'retail readiness score' or 'Listing Quality Dashboard' could be confirmed on current public pages.

### 4.2 Walmart

| Official name | What it measures | Components | Access | Who | Source |
|---|---|---|---|---|---|
| Listing Quality score (Listing Quality dashboard) | Quality of an item's listing; exists per item and for the whole catalog (catalog score = average of item scores). Higher scores support visibility and Pro Seller eligibility. | Five component categories per the seller guide (2026-04-09): Content quality (item name, description, key features, images); Price competitiveness; Shipping; Published & in stock (last seven days); Ratings & reviews. A component shown as N/A is excluded from the score. In the Shipping row Walmart adds that items weighing more than 50 pounds or listed at $10 or less 'aren't included in your Listing Quality score calculations'. | api API/reference: https://developer.walmart.com/us-marketplace/reference/getlistingqualityscore | Marketplace sellers in Seller Center (Growth > Listing Quality) and sellers or approved Solution Providers with Marketplace API keys. | [85] |
| Item listing quality report (LISTING_QUALITY) | Daily snapshot of listing-quality scores, score drivers, issues and recommended actions for all published listings. | Columns include LISTING_QUALITY_SCORE, CONTENT_QUALITY_SCORE, PRICE_COMPETITIVENESS_SCORE, SHIPPING_SCORE, PUBLISHED_IN_STOCK_SCORE, RATINGS_REVIEWS_SCORE (each 0-100), per-component impact (LOW, MEDIUM, HIGH, ZERO), ISSUE_PRIORITY, rating value and count, 30-day orders, conversion, GMV and page views. | downloadable_report API/reference: https://developer.walmart.com/us-marketplace/docs/request-an-item-listing-quality-report | Sellers and approved Solution Providers via the On Request Reports API (POST /v3/reports/reportRequests?reportType=LISTING_QUALITY&reportVersion=v1). | [93] |
| Content quality report (CONTENT_QUALITY) | Attribute-level content issues that reduce the Content Quality score. | One row per item and GTIN with product_attribute_name, product_attribute_value, product_attribute_score, product_impact_to_score (LOW, MEDIUM, HIGH), attribute_issue_title and attribute_issue_description (sample issues: TITLE_FORMULA_VIOLATION, TITLE_ORDER_VIOLATION). | downloadable_report API/reference: https://developer.walmart.com/us-marketplace/docs/request-a-content-quality-report | Sellers and approved Solution Providers via the On Request Reports API (reportType=CONTENT_QUALITY&reportVersion=v1). | [94] |
| Unpublished item insights | Why items are unpublished. | Counts of unpublished items per reason code and item detail per reason code. | api API/reference: https://developer.walmart.com/us-marketplace/docs/insights-api-overview | Sellers and approved Solution Providers with Marketplace API keys. | [91] |
| Content Quality Score (first-party suppliers) | Content quality of items a supplier sells to Walmart, reported per GTIN-14. | Content Quality Score (0 to 1 scoring) with Product Name Insights, Key Features Insights, Images Insights and Site Description Insights, plus customer rating and number of reviews. | downloadable_report API/reference: https://developer.walmart.com/suppliers/docs/item-report-product-content-data | First-party suppliers and drop-ship vendors via the 1P Supplier On Request Reports API (report type PRODUCT_CONTENT_DATA, version 1; refreshed every 24 hours). | [98] |

What this means in practice:

- Walmart is the only one of the three with an official **numeric** score. The seller guide (updated 2026-04-09) lists five components; the score exists per item and per catalog, the catalog score being the average of item scores [85].
- Everything is retrievable: the seller-level score (`GET /v3/insights/items/listingQuality/score`), item-level details (`POST /v3/insights/items/listingQuality/items`), and the `LISTING_QUALITY` and `CONTENT_QUALITY` on-request reports [88][89][92][93][94]. The content-quality report gives a score, an impact level and an issue description per attribute.
- **Naming conflict to handle in the product**: developer guides still describe the dimensions as Content, Discoverability, Offer, Ratings and Reviews, with post-purchase quality reported separately [88][90][91], while the seller guide and report columns use Content quality, Price competitiveness, Shipping, Published & in stock and Ratings & reviews [85][93]. Map both vocabularies to the same fields.
- In Seller Center the dashboard also offers 'Fix issues' per item and a Bulk Attribute Editor that generates a spreadsheet filtered to 'attributes with issues' [86][87].
- First-party suppliers have a **Content Quality Score** on a 0-to-1 scale in the `PRODUCT_CONTENT_DATA` report [98]. Its criteria are not public.

### 4.3 noon

| Official name | What it measures | Components | Access | Who | Source |
|---|---|---|---|---|---|
| Content status and Completeness (Seller Lab content check) | Where a Seller SKU is in noon's content review and how much of its content has been provided. | Content status per language (English, Arabic): Content Pending, QC Pending, Approved, Rejected. Completeness percentages: all attributes, mandatory attributes (must be 100% to enter QC), optional attributes. Image status (uploaded or not), Brand status (approved or not). Rejection reasons formatted as 'Attribute - issue' (Categorization, Brand, Title, Image, Feature Bullets/Description), split into fatal content rejections and suggestions for improvement. | seller_portal_only | Sellers in Seller Lab (Content tab of each Seller SKU). | [107] |
| Content API - GetContent | The same diagnostics programmatically: content completeness, missing and invalid attributes, QC status and rejection reasons, and per-image review results. | Per language (LANGUAGE_EN, LANGUAGE_AR): content.completeness, missing_attributes, invalid_attributes; qc.status (QC_STATUS_NOT_ELIGIBLE, QC_STATUS_PENDING, QC_STATUS_APPROVED, QC_STATUS_REJECTED), qc.rejection_reasons, qc.comment; overall_status (ACTIVE, INACTIVE). Per image: review_status (PENDING, VALID, INVALID), visibility and issues (code, message). | api API/reference: https://noon-docs.noonpartners.dev/docs/api-reference/content/content-service-get-content | Sellers and integrators with noon API credentials (POST https://noon-api-gateway.noon.partners/content/v1/product/content/get). | [120] |
| Listing or content quality score | No official numeric listing-quality score for noon was found. | Not applicable. | none | Not applicable. | [108] (unverified) |
| Seller Rating and Seller Controllable Returns classification | Seller and product quality indicators used for governance, not listing-content quality. | Seller Rating (minimum 3.0 expected); Seller Controllable Returns classification per offer or brand (Fair, Poor, Very Poor). | seller_portal_only | Sellers in Seller Lab (Account Health & Performance: Reputation Management and Returns Reduction dashboards). | [118] |

What this means in practice:

- noon's official diagnostics are a **status and completeness model**, not a score: content status per language, completeness percentages, and rejection reasons split into fatal rejections and suggestions [107].
- The same data is available through the **Content API** (`GetContent`), together with per-image review results [120][121].
- Seller Rating and the Seller Controllable Returns classification are governance indicators for the seller, not for listing content [118]. Vantage analytics offers a 'Search Query Score' for keywords, which is a search metric rather than a content score [119].

### 4.4 Terms that should not be presented as official metrics

**Amazon**

- **LQI / Listing Quality Index (Amazon)** - Not an Amazon metric. It is a SellerApp score: 'Listing quality index (LQI) is a weighted score assigned to the product listing based on 6 different sections' (bullet points, description, images, fulfilment method, reviews, rating), shown in the SellerApp dashboard. Amazon's own term is 'Listing Quality Indicator', which is a five-level category, not an index. [62]
- **Listing Optimization Score (LOS)** - A Jungle Scout Listing Builder feature that scores how well a draft listing follows optimization best practices. Third-party, not issued by Amazon. [63]
- **Amazon listing quality score (numeric 0-100)** - Amazon does not publish a numeric listing-quality score for sellers; the official indicator is categorical (Poor, Fair, Good, Great, Optimized). Numeric scores come from third-party tools. (Walmart, by contrast, does publish a numeric Listing Quality score.) [46]
- **Listing Quality Dashboard (Amazon)** - Legacy tool name that does not appear on any public Seller Central help page retrieved on 2026-11-26; the current official location is Manage Products > Enhance tab ('Enhance Listings'). [44]
- **Retail readiness score** - No official Amazon score of this name could be verified; treat as an informal advertising checklist concept. [44]

**Walmart**

- **'Content & Discoverability, Offer, Ratings & Reviews, Post-Purchase Quality' as the current Listing Quality components** - Older component breakdown that still appears in Walmart developer guides; the current seller guide (2026-04-09) names five components: Content quality, Price competitiveness, Shipping, Published & in stock, Ratings & reviews. [90]
- **Walmart 'A+ content' / 'Enhanced Brand Content'** - Not Walmart's terminology on the pages retrieved. The official names are 'Rich media', 'Video' and 'Brand Highlights'. [68]
- **A single Walmart 'Content Quality Score' for all partners** - Two different official measures exist: the Marketplace 'Content quality' component (0-100) of the Listing Quality score, and the first-party supplier 'Content Quality Score' (0 to 1) in the PRODUCT_CONTENT_DATA report. [98]

**noon**

- **noon listing quality score / content score** - Not a documented noon metric. noon exposes content completeness percentages, a per-language QC status and rejection reasons (Seller Lab and the Content API). [107]
- **Rich Card** - Older help-centre wording for the set of detail-page banners; the current feature is called 'A+ content' and has different limits. [101]

## 5. Enhanced content

| | Amazon | Walmart | noon |
|---|---|---|---|
| Official name | A+ Content: Basic A+, Premium A+, A+ Brand Story [23] | Rich media: Video and Brand Highlights [68] | A+ content (image banners) [104] |
| Who can use it | Brand owners and authorized resellers with the brand in Brand Registry; no extra criteria or cost for Premium [23] | Video: all sellers. Brand Highlights: Brand Portal brand owners without IP or Trust and Safety violations [68] | Not stated; available from the product's Content tab in Seller Lab [104] |
| How it is submitted | A+ Content Manager in Seller Central or Vendor Central [25][23] | Media Library in Seller Center, or Rich Media API (videos) [69][95] | Seller Lab > Catalog > product > Content > Additional Media [104] |
| Limits | Basic 5 modules (970 x 300 images); Premium 7 modules (1464 x 600), video, hotspots, carousel; Brand Story up to 19 cards; images under 2 MB; 20 pending submissions [23] | Video 100 MB or less, title up to 200 characters, one video per item; video to 50 GTINs and Brand Highlights to 500 GTINs at a time [69][95] | Up to 10 banners; width 1800-3600 px (2400 recommended); JPEG, PNG, WebP or AVIF; 10 MB each [104] |
| Comparison charts | Yes, same-brand products only [24] | Not documented | Not available (banners only) |
| Prohibited content | Pricing and promotions, competitor comparisons, links, warranties, shipping details, time-sensitive wording, unsubstantiated or boastful claims, disease claims [23][24] | Must follow Walmart policies; AI-generated content must be truthful [68] | No duplicate carousel images; no dedicated claims list published [104] |
| Review | Up to 7 business days, then live within 24 hours [26] | Not stated | Pending QC, Approved or Rejected; time not stated [104] |

Notes: Amazon's A+ guide is identical on the five country sites; the detailed claims rules were read on the US guidelines page only [24]. Walmart's current pages do not name any content-syndication partner for rich media. noon's older 'Rich Card' banner specification (2000 x 1000 px, 6 to 13 banners) still appears in another article [101].

## 6. Restricted claims for beauty and personal care

| Claim or content type | Amazon | Walmart | noon |
|---|---|---|---|
| Disease, drug or medical claims | Prohibited without FDA approval (US); UK and India pages prohibit claims to diagnose, cure, mitigate, treat or prevent disease [53][55][56][60] | Prohibited for cosmetics; such products fall under drug or medical-device policies [81] | Explicit rule only for videos ('cures headaches', 'heals skin conditions'); text is policed through prohibited keyword lists [103][116] |
| 'Anti-bacterial', 'anti-microbial', 'anti-fungal' | Listed among terms products cannot claim (US); prohibited in bullet points on all five sites; pesticidal claims need FIFRA compliance (US) [53][14][54] | No rule found on the pages retrieved | No rule found on the pages retrieved |
| Cosmetic versus drug wording | 'Reduce the appearance of wrinkles' allowed, 'eliminate wrinkles' not [55] | Same example; no specific-percentage or permanent-result promises [81] | Not documented |
| Before/after images | No explicit rule found | 'Fake or misleading before and after images' named as a problem claim [81] | No explicit rule found |
| Skin whitening or lightening | Skin-lightening products need third-party testing and certification (US) [55] | Banned; brightening claims restricted with enhanced vetting [81] | Not documented |
| Environmental claims | Must be substantiated; 'eco-friendly' prohibited in bullets and in A+ [53][14][24] | 'Biodegradable', 'compostable' and similar are restricted [80] | Need credible evidence (videos) [103] |
| Competitor or retailer references | No competitor comparisons in bullets or A+; no other brands in search terms [14][23][29] | No retailer names, no competitor-exclusivity claims [64] | No references to other marketplaces; no competitor comparisons in videos [101][103] |
| Promotional language | Not in titles, bullets, images or A+ [1][9] | Not in title, description or key features (list of banned phrases) [64] | Not in titles, bullets, descriptions, images or videos [100][101] |
| Guarantees, testimonials, reviews | Not in listing content; guarantees only if honoured in full (US) [9][54] | Authenticity claims need approval; fabricated reviews or endorsements prohibited [64] | No guarantees or customer reviews in videos; no warranty information in descriptions or images [103][101][102] |

**Regulatory notes that the retailers themselves cite**

- **Amazon US**: Federal Food, Drug, and Cosmetic Act, Fair Packaging and Labeling Act and MoCRA; no FDA logo and no 'FDA approved' claim without approval; label images on request with a US contact for adverse events, ingredient list, net contents and warnings; FDA Forms 5066 and 5067 for skin-lightening products; state laws (California, Washington, Maryland, New York and others) are applied by Amazon itself [55].
- **Amazon UK**: UK (GB) Cosmetics Regulation - UK-based Cosmetics responsible person, notification on the UK Submit Cosmetic Product Notification service, product information file, labelling; Northern Ireland follows the EU regulation and CPNP [56][57].
- **Amazon UAE**: approval to sell in the category; Dubai Municipality circulars and label-assessment procedures and EU Regulation 1223/2009 are cited as references [58]. No ESMA, ECAS or MoIAT registration requirement is mentioned on the page.
- **Amazon Saudi Arabia**: approval to sell in the category; SFDA cosmetics department, SFDA product notification system and SASO standards are cited as references [59].
- **Amazon India**: Drugs and Cosmetics Act 1940, Drugs and Magic Remedies (Objectionable Advertisement) Act 1954, products banned by CDSCO [60].
- **Walmart**: cosmetics are a restricted category with enhanced vetting; FD&C Act, FDA facility registration, product listing and good manufacturing practice, FTC advertising law; listing must show product identity, net quantity, ingredient list, directions and manufacturer or distributor; California Proposition 65 warnings where applicable [81][82].
- **noon**: gated beauty categories with whitelisting documents - in Saudi Arabia an SFDA certification document for hair personal care and a Ministry of Commerce product registration document for fragrance; UAE Ministry of Health and Prevention (MOHAP) banned pharmaceutical terms [114][116].

## 7. Conflicts and inconsistencies found in official sources

| # | Retailer | Conflict | How it is recorded |
|---|---|---|---|
| 1 | Amazon | UAE and Saudi title pages say titles must not exceed 75 characters 'in all of our worldwide stores', keep a '200 or fewer characters' sentence and have no Item highlights; the US, UK and India pages say the requirements apply to all stores except Saudi Arabia, Egypt, Turkiye and the UAE [4][5][1] | 75 = recommended for AE/SA; 200 = informational ceiling |
| 2 | Amazon | Search terms 'less than 250 bytes' on search pages versus 'length limit of 200 bytes' in the Attributes guide error table [33][34] | 249 bytes mandatory, conflict in notes |
| 3 | Amazon | India: Shoppable video guide (MOV/MP4, 5 GB) versus India detail-page video policy (500 MB, other formats, English only) [22][11] | Both recorded; India policy flagged |
| 4 | Amazon | 'Suppressed listings' page still refers to titles under 80 or 130 characters [48] | Not used as a rule |
| 5 | Walmart | Title limit 150 characters (product details policy) versus 'more than 200 characters' (keyword guide) [64][66] | 150 mandatory; 200 informational |
| 6 | Walmart | Listing Quality components named differently in the seller guide and in developer docs [85][90] | Both vocabularies documented |
| 7 | noon | Title 5-200 characters versus 'must not exceed 160' and 'not less than 20' in the same article [100] | 200 and 5 mandatory; 160 and 20 recommended |
| 8 | noon | Video: 5 GB and 2.5 minutes (video article) versus under 8 MB and under 2 minutes (feature bullets article) [103][101] | Video article used; older values in notes |
| 9 | noon | A+ banners: up to 10, width 1800-3600 px versus 6-13 banners at 2000 x 1000 px [104][101] | A+ article used; older values in notes |
| 10 | noon | Mandatory template fields shown as green in one article and red in another [108][113] | Noted, no rule depends on it |

## 8. What could not be verified

**Amazon**

- Whether the 75-character title limit and Item highlights apply on amazon.ae and amazon.sa (official pages conflict).
- Beauty-specific required attributes (ingredients, scent, hair type, skin type, expiry, country of origin) and per-product-type character limits for bullets and descriptions: these sit in login-gated templates and the Product Type Definitions API.
- The Beauty category style guide PDF (any main-image exceptions for beauty packaging).
- Maximum number of images per listing, a product-image file-size limit and any required aspect ratio.
- Which language or languages are mandatory on amazon.ae and amazon.sa and how Amazon translates between English and Arabic.
- Any rule on before/after images.
- An official 'retail readiness' definition or score; five candidate Amazon Ads URLs returned 404.
- Vendor Central (first-party) content rules.
- A+ claims rules and the cosmetics, claims, bundling, variation and multipack pages outside the US (recorded as US-only).

**Walmart**

- First-party supplier content rules and scoring criteria (Supplier One and Retail Link are login-gated; supplierhelp.walmart.com rendered blank).
- Category 'Content Standards' for beauty product types (title formulas, description lengths, image counts, attributes): the public link returns 'No Data found'.
- Video formats and duration limits, Brand Highlights module specifications, maximum image count, maximum description length, Listing Quality component weights.
- Any current rich-media syndication partner programme.
- Rules for 'anti-bacterial' or pesticide-type claims in beauty listings.
- A 2026-03-26 release note on changes to the content and price components (seen only in a search snippet).

**noon**

- The prohibited keyword lists, MOHAP-banned terms and country-specific restrictions (linked Google Sheets were not retrieved).
- Mandatory attributes for beauty categories (templates and ListCategoryAttributes need credentials).
- Eligibility for A+ content and for video beyond 'limited group of sellers'.
- Which of the conflicting title, video and banner limits the system actually enforces.
- GS1 verification of GTINs, bundle or multipack policy, any backend search-term field.
- Rules on before/after images and drug claims in listing text.
- Content standards for noon's own retail or noon-controlled-brand listings.

## 9. Sources

All sources were accessed on 2026-11-26. 'n.d.' means the page shows no publication or update date. Seller Central help pages exist per country; where the text was identical the US URL is listed once and the rule notes say which country versions were compared.

1. Product title requirements and guidelines (United States) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GYTR6SYGFA5E3EQC>
2. Product title requirements and guidelines (United Kingdom) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.co.uk/help/hub/reference/external/GYTR6SYGFA5E3EQC>
3. Product title requirements and guidelines (India) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.in/help/hub/reference/external/GYTR6SYGFA5E3EQC>
4. Product title requirements and guidelines (United Arab Emirates) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.ae/help/hub/reference/external/GYTR6SYGFA5E3EQC>
5. Product title requirements and guidelines (Saudi Arabia) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.sa/help/hub/reference/external/GYTR6SYGFA5E3EQC>
6. Updates to improve your product titles begin on July 27 (News_Amazon announcement) - Amazon Seller Forums (News_Amazon) (date: 2026-06-10 (updated); accessed 2026-11-26). <https://sellercentral.amazon.com/seller-forums/discussions/t/145b6d0f-999c-4555-896c-c694bda2e470>
7. Answers to your product title update questions (News_Amazon announcement) - Amazon Seller Forums (News_Amazon) (date: n.d. (shown as 'updated 4 months ago' on 2026-11-26); accessed 2026-11-26). <https://sellercentral.amazon.com/seller-forums/discussions/t/302aaac6-6f2b-4d86-bcd2-36fe24f0e6cd>
8. New product title requirements effective from January 21, 2025 (News_Amazon announcement) - Amazon Seller Forums (News_Amazon) (date: n.d. (shown as '2 years ago' on 2026-11-26); accessed 2026-11-26). <https://sellercentral.amazon.in/seller-forums/discussions/t/6cae8579-d09f-484d-98ca-a2b057c175a2>
9. Product detail page rules (United States) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G200390640>
10. Product detail page rules (United Kingdom) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.co.uk/help/hub/reference/external/G200390640>
11. Product detail page rules (India) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.in/help/hub/reference/external/G200390640>
12. Product detail page rules (United Arab Emirates) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.ae/help/hub/reference/external/G200390640>
13. Product detail page rules (Saudi Arabia) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.sa/help/hub/reference/external/G200390640>
14. Product bullet point requirements - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GX5L8BF8GLMML6CX>
15. Optimize your product discoverability - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G10471>
16. Product image guide - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G1881>
17. Image suppression - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GT8RSE9S9NK4LP6Z>
18. Technical image file requirements - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G9FUUH87RBNXGKB7>
19. Upload images - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GUGPCYWV2P8KVFUT>
20. Multipack imaging standards - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G94GSFMC79RSLDBY>
21. Diversity imaging for Beauty ASINs - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GFF8UGBF86Y9GY9N>
22. Shoppable video guide - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GUZBYWTTVULY6C9Y>
23. A+ Content guide - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GLG4RQK2Y2RJADU4>
24. A+ content guidelines - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GGW8U76SSNTRTBX7>
25. Create A+ content - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G202134820>
26. Content publishing status and content rejection - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GAEAQB7QC4G5Z2LC>
27. A+ content FAQ & troubleshooting - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G202102960>
28. Search optimization - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GNYWHX2TP7C8GXHK>
29. Use search terms effectively (United States) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G23501>
30. Use search terms effectively (India) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.in/help/hub/reference/external/G23501>
31. Use search terms effectively (United Kingdom) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.co.uk/help/hub/reference/external/G23501>
32. Use search terms effectively (United Arab Emirates) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.ae/help/hub/reference/external/G23501>
33. Keyword attributes explained - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GF2C2L6RCFZGWBXC>
34. Attributes guide - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GBWHYLJ7NNQMXBAQ>
35. Conditional Unit Count based on Item Form, Normalized Value of Size, Item Form, Number of Items and Net Content details - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G2RCDMZR4SKGQFAY>
36. Listing requirements: Product IDs (GTINs) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G200317470>
37. Product ID (GTIN) requirements by category - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G200317520>
38. Valid UPCs - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GLE2KYT2UVPMTYGS>
39. List products that do not have a product ID (UPC, EAN, JAN, or ISBN) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G200426310>
40. UPC Guidelines for multi-packs - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G200492770>
41. Product variations overview - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GH3RMVV3ZDYRRQ5S>
42. Variation display and customer experience - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G7UJDST28Q5Y7PWY>
43. Product bundling policy - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G200442350>
44. Listing quality - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G200786710>
45. Listing quality guidelines - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GC3QAQ8CCXUG5RE4>
46. Enhance Listings - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G88AQCL62ED7WDGA>
47. Manage Products dashboard guide - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GMZU6QTPKCVGLXKS>
48. Suppressed listings - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G200898440>
49. My ASIN is unsearchable - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GHGHDMU4X5K9QGCV>
50. Listings APIs - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/GD76M4FUWL4NEU32>
51. Manage Listings Issues - Amazon Selling Partner API documentation (URL redirects to developer-docs.amazon) (date: n.d. (shown as 'Updated 8 days ago' on 2026-11-26); accessed 2026-11-26). <https://developer-docs.amazon.com/sp-api/docs/manage-listings-issues>
52. Inventory Reports - Amazon Selling Partner API documentation (URL redirects to developer-docs.amazon) (date: n.d. (shown as 'Updated 29 days ago' on 2026-11-26); accessed 2026-11-26). <https://developer-docs.amazon.com/sp-api/docs/report-type-values-inventory>
53. Misleading and prohibited claims - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G202024200>
54. General Listing Restrictions - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G201707070>
55. Cosmetics, skin, and hair care (United States) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.com/help/hub/reference/external/G200164470>
56. Cosmetics (United Kingdom) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.co.uk/help/hub/reference/external/G201743980>
57. UK requirements for cosmetic products - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.co.uk/help/hub/reference/external/GURBES6E6XZAB8GN>
58. Cosmetics (United Arab Emirates) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.ae/help/hub/reference/external/G201743980>
59. Cosmetics (Saudi Arabia) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.sa/help/hub/reference/external/G201743980>
60. Cosmetics, skin, and hair care (India) - Amazon Seller Central (public help) (date: n.d.; accessed 2026-11-26). <https://sellercentral.amazon.in/help/hub/reference/external/G200164470>
61. Product listing guide (Amazon.ae) - Amazon (sell.amazon.ae) (date: n.d.; accessed 2026-11-26). <https://sell.amazon.ae/content/listing-guide>
62. Amazon Listing Quality (LQI) Overview - SellerApp (third-party tool vendor) (date: n.d.; accessed 2026-11-26). <https://www.sellerapp.com/help/docs/lqi-overview/>
63. Listing Builder: Guide to the Listing Optimization Score - Jungle Scout (third-party tool vendor) (date: n.d.; accessed 2026-11-26). <https://support.junglescout.com/hc/en-us/articles/360012759473>
64. Product details policy - Walmart Marketplace Learn (date: 2026-10-06; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Item%20setup/Item%20content,%20imagery,%20and%20media/Product-Detail-Page:-overview>
65. Product detail page: Image guidelines & requirements - Walmart Marketplace Learn (date: 2026-05-12; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Item%20setup/Item%20content,%20imagery,%20and%20media/Product-detail-page:-Image-guidelines-&-requirements>
66. Product detail page: Keyword optimization - Walmart Marketplace Learn (date: 2026-04-14; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Item%20setup/Item%20content,%20imagery,%20and%20media/Product-detail-page:-Keyword-optimization>
67. Product detail page: Item attribution & categorization - Walmart Marketplace Learn (date: 2024-10-18; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Item%20setup/Item%20content,%20imagery,%20and%20media/Product-detail-page:-Item-attribution-&-categorization>
68. Product detail page: Rich media - Walmart Marketplace Learn (date: 2026-11-12; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Item%20setup/Item%20content,%20imagery,%20and%20media/Product-detail-page:-rich-media>
69. Product detail page: Media Library - Walmart Marketplace Learn (date: 2026-10-19; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Item%20setup/Item%20content,%20imagery,%20and%20media/How-to-navigate-the-Media-Library>
70. How to update content: Overview - Walmart Marketplace Learn (date: 2026-04-03; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Item%20setup/Item%20content,%20imagery,%20and%20media/How-to-update-content:-Overview>
71. Update item content individually in Seller Center - Walmart Marketplace Learn (date: 2026-04-03; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Catalog%20management/Item%20management/Update-item-content-individually-in-Seller-Center>
72. Add a single item: Full setup - Walmart Marketplace Learn (date: 2026-09-24; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Item%20setup/Item%20setup%20methods/Add-a-New-Item:-Create-a-new-item>
73. Product identifier (GTIN, UPC, ISBN or EAN) policy - Walmart Marketplace Learn (date: 2026-09-02; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Policies%20&%20standards/Product%20listings/Choose-a-product-identifier>
74. GTIN exemptions: Overview - Walmart Marketplace Learn (date: 2026-10-30; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Item%20setup/Troubleshooting/gtin-exemptions-overview>
75. Request a GTIN exemption - Walmart Marketplace Learn (date: 2026-09-02; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Item%20setup/Troubleshooting/request-a-gtin-exemption>
76. Product variant groups: Overview - Walmart Marketplace Learn (date: 2025-07-02; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Item%20setup/Variant%20management/Product-variant-groups:-Overview>
77. Virtual bundles: Overview - Walmart Marketplace Learn (date: 2026-10-26; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Item%20setup/Packs%20&%20bundles/add-multiple-items-virtual-bundles>
78. Duplicate listings policy - Walmart Marketplace Learn (date: 2026-09-02; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Policies%20&%20standards/Product%20listings/duplicate-listings-policy>
79. Prohibited Products Policy: Overview - Walmart Marketplace Learn (date: 2026-06-05; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Policies%20&%20standards/Prohibited%20products%20&%20brands/Prohibited-products-policy:-overview>
80. Prohibited Products Policy: Product claims - Walmart Marketplace Learn (date: 2026-11-05; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Policies%20&%20standards/Prohibited%20products%20&%20brands/prohibited-products-policy-product-claims>
81. Prohibited Products Policy: Cosmetic Products - Walmart Marketplace Learn (date: 2026-07-09; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Prohibited-Products-Policy:-Cosmetic-products>
82. Proposition 65 - Walmart Marketplace Learn (date: 2025-12-11; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Policies%20&%20standards/Prohibited%20products%20&%20brands/Proposition-65>
83. Brand Portal: Overview - Walmart Marketplace Learn (date: 2026-11-06; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Getting%20started/Brand%20management/brand-portal-overview>
84. Troubleshoot content errors - Walmart Marketplace Learn (date: 2026-01-29; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Catalog%20management/Troubleshooting/troubleshooting-content-errors>
85. Listing Quality: Overview - Walmart Marketplace Learn (date: 2026-04-09; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Growth%20opportunities/Listing%20Quality/Listing-quality-and-rewards-dashboard>
86. Listing Quality: Fix issues - Walmart Marketplace Learn (date: 2026-09-28; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/listing-quality-fix-issues>
87. Listing Quality: Bulk Attribute Editor - Walmart Marketplace Learn (date: 2026-09-25; accessed 2026-11-26). <https://marketplacelearn.walmart.com/guides/Growth%20opportunities/Listing%20Quality/Bulk-attribute-editor>
88. Retrieve Listing Quality score - Walmart Developer Portal (Marketplace) (date: n.d. (shown as 'Updated 8 months ago' on 2026-11-26); accessed 2026-11-26). <https://developer.walmart.com/us-marketplace/docs/get-sellers-listing-quality-score>
89. Seller Listing Quality Score (API reference) - Walmart Developer Portal (Marketplace) (date: n.d. (shown as 'Updated 6 months ago' on 2026-11-26); accessed 2026-11-26). <https://developer.walmart.com/us-marketplace/reference/getlistingqualityscore>
90. Monitor item listing quality - Walmart Developer Portal (Marketplace) (date: n.d. (shown as 'Updated 13 days ago' on 2026-11-26); accessed 2026-11-26). <https://developer.walmart.com/us-marketplace/docs/monitor-item-listing-quality>
91. Insights API overview - Walmart Developer Portal (Marketplace) (date: n.d. (shown as 'Updated 8 months ago' on 2026-11-26); accessed 2026-11-26). <https://developer.walmart.com/us-marketplace/docs/insights-api-overview>
92. Filter for item Listing Quality metrics - Walmart Developer Portal (Marketplace) (date: n.d. (shown as 'Updated 28 days ago' on 2026-11-26); accessed 2026-11-26). <https://developer.walmart.com/us-marketplace/docs/filter-for-item-listing-quality-metrics>
93. Request an item listing quality report - Walmart Developer Portal (Marketplace) (date: n.d. (shown as 'Updated 3 months ago' on 2026-11-26); accessed 2026-11-26). <https://developer.walmart.com/us-marketplace/docs/request-an-item-listing-quality-report>
94. Request a content quality report - Walmart Developer Portal (Marketplace) (date: n.d. (shown as 'Updated 3 months ago' on 2026-11-26); accessed 2026-11-26). <https://developer.walmart.com/us-marketplace/docs/request-a-content-quality-report>
95. Rich media management - Walmart Developer Portal (Marketplace) (date: n.d. (shown as 'Updated 13 days ago' on 2026-11-26); accessed 2026-11-26). <https://developer.walmart.com/us-marketplace/docs/rich-media-management>
96. Understanding the requirements for listing an item - Walmart Developer Portal (Marketplace) (date: n.d. (shown as 'Updated 13 days ago' on 2026-11-26); accessed 2026-11-26). <https://developer.walmart.com/us-marketplace/docs/understanding-the-requirements-for-listing-an-item>
97. Setting up multiple variants of an item - Walmart Developer Portal (Marketplace) (date: n.d. (shown as 'Updated 15 days ago' on 2026-11-26); accessed 2026-11-26). <https://developer.walmart.com/us-marketplace/docs/setting-up-multiple-variants-of-an-item>
98. Item product content data report - Walmart Developer Portal (1P Suppliers) (date: n.d. (shown as 'Updated 8 months ago' on 2026-11-26); accessed 2026-11-26). <https://developer.walmart.com/suppliers/docs/item-report-product-content-data>
99. On Request Reports API overview - Walmart Developer Portal (1P Suppliers) (date: n.d.; accessed 2026-11-26). <https://developer.walmart.com/suppliers/docs/on-request-reports-api-overview>
100. Title requirements and rejection reasons for the seller SKU - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/title-requirements-and-rejection-reasons-for-the-seller-sku>
101. Feature bullets (product highlights) and description for the seller SKU - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/feature-bullets-product-highlights-and-description-for-the-seller-sku>
102. Image requirements and rejection reasons for the seller SKU - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/image-requirements-and-rejection-reasons-for-the-seller-sku>
103. Video guidelines and rejection reasons for seller SKUs - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/video-guidelines-and-rejection-reasons-for-seller-skus>
104. A+ content on noon: Enhancing your product pages - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/a-content-on-noon-enhancing-your-product-pages>
105. Seller SKU content language requirements - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/seller-sku-content-language-requirements>
106. Seller SKU content export and translation - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/seller-sku-content-export-and-translation>
107. Seller SKU content quality - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/seller-sku-content-quality>
108. The seller SKU product attributes - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/the-seller-sku-product-attributes>
109. The seller SKU brand - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/the-seller-sku-brand>
110. Barcode requirements - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/barcode-requirements>
111. Creating product variations: adding sizes, colors, and other attributes - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/creating-product-variations-adding-sizes-colors-and-other-attributes>
112. Single SKU creation - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/single-sku-creation>
113. Seller SKU bulk creation - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/seller-sku-bulk-creation>
114. Product listing policy - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/product-listing-policy>
115. Prohibited products - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/prohibited-products>
116. Guidelines for prohibited items and keywords - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/guidelines-for-prohibited-items-and-keywords>
117. Listing products on noon - FAQs - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/product-listing/listing-products-on-noon-faq>
118. Product quality control policy - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/program-policies/product-quality-control-policy>
119. Vantage analytics: Your ultimate brand analytics hub - noon Seller Help Center (date: n.d.; accessed 2026-11-26). <https://helpcenter.noon.partners/en/category/reports-and-analytics/noon-vantage-your-ultimate-brand-analytics-hub>
120. Content API (overview) - noon API Documentation (date: n.d.; accessed 2026-11-26). <https://noon-docs.noonpartners.dev/docs/content/content-api>
121. GetContent (Content API reference) - noon API Documentation (date: n.d.; accessed 2026-11-26). <https://noon-docs.noonpartners.dev/docs/api-reference/content/content-service-get-content>
