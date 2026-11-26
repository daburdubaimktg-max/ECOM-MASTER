# Appendix C2 - Product-content requirements: regional retailers and marketplaces

**Scope:** beauty and personal care (hair care, skin care, oral care) listings on Takealot, Jumia, Flipkart, Shopee, Lazada and TikTok Shop (Tier A, researched in depth) and on Nykaa, Boots, Superdrug, Tesco, Target, Ulta Beauty, Carrefour UAE, Nahdi, Clicks, Dis-Chem, Watsons Malaysia, plus brief notes on Amazon.co.za, Makro Marketplace, Konga and Kilimall (Tier B).  
**Research date:** 2026-11-26 - every source below was retrieved, or attempted, on that day; pages that could not be read are marked as such and are never cited for a rule.  
**Machine-readable rules:** one JSON file per retailer in `data/research/requirements/` (same content as the tables here, plus notes per rule).

## How to read this appendix

- **Level** is the severity recorded for the rules engine. *mandatory* = the source states a hard requirement (a listing is rejected, blocked or in breach of policy without it); *recommended* = published best practice or a listing-quality criterion that does not block a listing; *informational* = context, process facts or statements that something is not published.
- **Verification** - unless flagged, a rule was read today in an official seller document, help page or API reference. "(secondary source)" means a content partner or other third party describing the retailer's rule; "(unverified)" means the statement could not be confirmed in an official source today and must not be enforced.
- **Scope** shows where a rule is narrower than the whole platform (country, category, seller type).
- Numbers in square brackets refer to the numbered source list at the end.

**Method and its limits.** Pages were retrieved by direct request and, for JavaScript sites, a headless browser. No account was created or used, and bot-protection pages were not circumvented - sites that refused automated access are listed under "What could not be verified". Web search was available only at the start of the session (Takealot, part of Jumia and Flipkart); the shared search budget was then exhausted, so later research relied on official sites reachable directly, their own navigation and their API references. This mainly reduced what could be found for Flipkart and the Tier B retailers.

## At a glance

| Platform | Countries | Tier | Public documentation | Rules recorded (mandatory / recommended / informational) | Official quality score | Enhanced content |
|---|---|---|---|---|---|---|
| Takealot | ZA | A | full | 60 / 8 / 6 | Listing quality score (api); Listing Quality score shown in the Seller Portal (seller portal only, unverified) | unknown |
| Jumia | NG, KE | A | partial | 22 / 15 / 15 | Content Score (none); QC status (api) | unknown |
| Flipkart | IN | A | minimal | 6 / 10 / 4 | Listing Quality Score (seller portal only, unverified) | yes |
| Shopee | MY | A | full | 20 / 23 / 13 | Listing quality level (api) | yes |
| Lazada | MY | A | partial | 36 / 10 / 9 | Content Score (api); QC Alert / Violation (seller portal only) | yes |
| TikTok Shop | US, GB, MY, SA | A | full | 34 / 24 / 4 | Listing quality tier (api); Product diagnosis (api) | unknown |
| Nykaa | IN | B | none | 0 / 0 / 0 | No official score found | unknown |
| Boots | GB | B | minimal | 0 / 0 / 2 | No official score found | unknown |
| Superdrug | GB | B | none | 0 / 0 / 0 | No official score found | unknown |
| Tesco | GB | B | minimal | 0 / 0 / 3 | No official score found | unknown |
| Target | US | B | partial | 5 / 0 / 4 | Target Content Score (seller portal only, secondary quote) | yes |
| Ulta Beauty | US | B | minimal | 2 / 0 / 2 | No official score found | yes |
| Carrefour UAE (Majid Al Futtaim) | AE | B | none | 0 / 0 / 0 | No official score found | unknown |
| Nahdi (Al Nahdi Medical Company) | SA | B | none | 0 / 0 / 0 | No official score found | unknown |
| Clicks | ZA | B | none | 0 / 0 / 0 | No official score found | unknown |
| Dis-Chem | ZA | B | minimal | 0 / 0 / 1 | No official score found | unknown |
| Watsons Malaysia | MY | B | none | 0 / 0 / 0 | No official score found | unknown |
| Other marketplaces - brief notes (Amazon.co.za, Makro Marketplace, Konga, Kilimall) | ZA, NG, KE | B | partial | 10 / 3 / 2 | No official score found | unknown |

**TikTok Shop market check (2026-11-26).** United States, United Kingdom and Malaysia: confirmed - all three are in the market selector on the official seller portal and have live Academy sites [113]. Saudi Arabia: named as a market in the Partner API documentation (cash-on-delivery field) [99] but absent from the portal's market selector, and no Saudi Academy site was reachable - treat as unconfirmed for content rules. United Arab Emirates: not listed anywhere in the official material retrieved.

## Requirements by retailer

### 1. Takealot

**Countries:** ZA  
**Public documentation level:** full  
**How brands deliver content:** Self-service Takealot Seller Portal (marketplace sellers): products are created via the "Add a Product" page or a category loadsheet, and existing pages are changed through an Edit Request. Every submission passes an automated System Review and a manual Quality Review by Takealot's Catalogue Team. Takealot states there is no Catalogue (content) API for sellers - the public APIs cover offers, sales, shipments and returns only. Retail suppliers (first-party) also submit loadsheets and are told to contact Takealot retail / cataloguelistings@takealot.com for barcode problems. No content-syndication partner route is publicly documented.

**Languages:**

- ZA: en - No sentence says "English only", but only numbers, basic punctuation and Latin letters are accepted in product information (Russian, Chinese and Arabic characters are named as not allowed) and, for food, product information, attributes and ingredients must be in English. [1]

| Rule | Requirement | Value | Level | Scope | Source |
|---|---|---|---|---|---|
| `title.max_length` | Title length cannot exceed 75 characters. | 75 characters | mandatory | all | [1] |
| `title.full_unique_product_name` | The title must reference the full unique product name so that customers can search for it. | - | mandatory | all | [1] |
| `title.structure` | Build the title as: Brand name + Product name + Model name or number + Variant/Colour/Capacity + Unit Size / Quantity (as applicable). | - | mandatory | all | [1] |
| `title.beauty_structure` | Health & Beauty title format: Brand + Product Title + Size (examples: "Outback Pain Relief Roll On - 50ml", "Aragan Secret Treatment Oil - 100ml"). | - | recommended | beauty | [3] |
| `title.no_all_caps` | No use of ALL CAPITAL LETTERS in titles, subtitles or Key Selling Features. | - | mandatory | all | [1] |
| `title.capitalisation` | Capitalise the first letter of each word; do not capitalise conjunctions, articles or prepositions with fewer than five letters. | - | recommended | all | [1] |
| `title.numerals_and_abbreviations` | Use numerals (2 instead of two), state the number of items in a bundled product (e.g. pack of 10) and do not use abbreviations except for units of measure. | - | recommended | all | [1] |
| `title.no_contact_details` | Telephone numbers, physical mail addresses, email addresses or website URLs are not allowed in the product description, title or subtitle (they may appear on product packaging). | - | mandatory | all | [1] |
| `title.no_replica_terms` | The words "replica", "copy" or "generic" may not be used in titles and descriptions; a title may not claim to be a replica or copy of a competitor brand. Generic or unbranded products may only say "compatible with" another brand, and the branded name may not lead the title. | - | mandatory | all | [1] |
| `title.subtitle_max_length` | Subtitle length cannot exceed 110 characters. | 110 characters | mandatory | all | [1] |
| `seo.subtitle_keywords` | Use the subtitle for pack sizes, compatibility, keywords relating to the product, and the model number when it does not fit in the title. | - | recommended | all | [1] |
| `seo.descriptive_title` | Non-descriptive titles prevent customers from finding the product; follow the title formula so the product can be found with key search terms. | - | informational | all | [1] |
| `description.min_length` | Key Selling Features (the product description) must contain a minimum of 200 characters; a character is a letter, number, space or punctuation mark. | 200 characters | mandatory | all | [1] |
| `description.no_html` | No HTML or JavaScript in Key Selling Features (product descriptions). | - | mandatory | all | [1] |
| `description.no_attachments` | No fact sheets or PDF sheets may be attached. | - | mandatory | all | [1] |
| `bullets.format` | Structure Key Selling Features with the heading "Features:" and one dash (-) per feature, then "Specifications:" with one dash per specification; start each dash with a capital letter, write fragments without ending punctuation, write numbers as numerals and include product features/specifications only (no company-specific information). | - | recommended | all | [1] |
| `attributes.required_fields` | Product attributes specified as required (highlighted in red on the loadsheet / after the Main and Lowest Category are selected) must be completed in the format provided. | - | mandatory | all | [1] |
| `attributes.category` | Every product must have a Main and a Lowest Category chosen from the Global Category Tree Look-Up. | - | mandatory | all | [1] |
| `attributes.brand` | A brand may be entered in the brand attribute only if the brand logo is imprinted on the product and visible in the submitted imagery (or, where that is not possible, images of branded packaging are supplied). Where a bundle contains multiple brands the brand attribute must be left blank. | - | mandatory | all | [1] |
| `attributes.whats_in_the_box` | "What's in the Box" is required in certain categories and highly recommended in all others. | - | recommended | all | [1] |
| `attributes.expiry_date_on_pack` | Products in categories subject to expiry-date rules must carry a clear expiry date on the physical packaging, and the expiry date must be more than the category's stated number of days after delivery. | - | mandatory | all | [1] |
| `attributes.min_shelf_life_days.toothpaste` | Minimum remaining shelf life at delivery for Health > Oral Care > Toothpaste: 90 days. | 90 days | mandatory | oral care | [5] |
| `attributes.min_shelf_life_days.mouthwash` | Minimum remaining shelf life at delivery for Health > Oral Care > Mouthwash: 120 days. | 120 days | mandatory | oral care | [5] |
| `attributes.min_shelf_life_days.skin_care` | Minimum remaining shelf life at delivery for the listed Health > Cosmetics > Skin Care categories (facial cleansers, exfoliators & scrubs, lotion & moisturizer, lip balms & treatments, aftersun, tanning products): 365 days. | 365 days | mandatory | skin care | [5] |
| `attributes.medicine_ingredients` | For products in Medicine & Related Products categories (topical substances, vitamins & supplements): the list of ingredients must be provided as attribute information as per SAHPRA. | - | mandatory | all | [1] |
| `identifiers.barcode_if_present` | If the product has a scannable barcode (12-13 digits) it must be included in the submission; if it has none, leave the field blank and a Marketplace Product Label is assigned. | - | mandatory | marketplace sellers | [1] |
| `identifiers.barcode_max_length` | Barcodes are limited to 20 characters. | 20 characters | mandatory | all | [1] |
| `identifiers.retail_supplier_barcode` | Retail suppliers without a barcode should contact Takealot retail or cataloguelistings@takealot.com before submitting a loadsheet. | - | informational | 1P vendors | [1] |
| `images.format` | Only JPEG (.jpg/.jpeg) and PNG image files are accepted; PNGs may not have transparent backgrounds. | - | mandatory | all | [1] |
| `images.min_side_px` | Images may be no shorter than 600 px on any side. | 600 pixels | mandatory | all | [1] |
| `images.max_side_px` | Images may be no longer than 5000 px on any side. | 5000 pixels | mandatory | all | [1] |
| `images.max_file_size_mb` | Maximum image file size is 10 MB. | 10 MB | mandatory | all | [1] |
| `images.min_dpi` | Images must be high resolution with a minimum of 72 DPI. | 72 DPI | mandatory | all | [1] |
| `images.colour_mode` | Colour mode must be sRGB. | - | mandatory | all | [1] |
| `images.frame_fill_min_percent` | The product must fill at least 85% of the frame length or width. | 85 percent | mandatory | all | [1] |
| `images.frame_fill_max_percent` | The product must fill no more than 95% of the frame length or width. | 95 percent | mandatory | all | [1] |
| `images.aspect_ratio` | Submit images as close to a square aspect ratio as possible, or in 4:3, 3:2, 16:9, 5:3 or 5:4. | - | recommended | all | [1] |
| `images.recommended_count` | Upload at least 5 high-quality images per product showing different angles, sizes, textures, etc. | 5 images | recommended | all | [1] |
| `images.min_count.hair_care` | Minimum required images for Beauty > Hair Care > Shampoo, Conditioner, Shampoo & Conditioner, Treatments, Hair Colour, Gels & Wax and Hair Serum: 3. | 3 images | mandatory | hair care | [6] |
| `images.min_count.skin_care` | Minimum required images for Beauty > Skin Care (cleansers, exfoliators & scrubs, masks, moisturisers, toners, treatments, sets) and Beauty > Lip & Skin Care (body and facial care): 3. | 3 images | mandatory | skin care | [6] |
| `images.min_count.oral_care` | Minimum required images for Beauty > Oral Care > Toothpaste, Mouthwash, Floss and Whitening: 3. | 3 images | mandatory | oral care | [6] |
| `images.owned_or_licensed` | All images must be owned by the seller, or the seller must have the right to use them. | - | mandatory | all | [1] |
| `images.no_promotional_content` | No reviews, quotes, testimonials, advertisements, promotional material (e.g. "% off", "Save", "Buy 3 for the Price of 2") or watermarks on any image, photo or video. Product descriptors on packaging such as size, number of units, pack type, quantity and flavour are allowed. | - | mandatory | all | [1] |
| `images.direct_public_links` | Image links on a loadsheet must be publicly accessible, direct image URLs starting with http:// or https://; Google Drive, Facebook and Dropbox links should not be used. | - | mandatory | all | [2] |
| `images_main.background` | Primary image background must be solid white only (RGB 255,255,255 / #ffffff). | - | mandatory | all | [1] |
| `images_main.no_borders` | No borders are allowed on the primary image. | - | mandatory | all | [1] |
| `images_main.photographs_only` | Only photographs are permitted for the primary image - no CAD drawings, thumbnails or illustrations. | - | mandatory | all | [1] |
| `images_main.shadows` | Only light, believable shadows or reflections are allowed on the primary image. | - | mandatory | all | [1] |
| `images_main.content` | The primary image must show the entire single unused product (or the full bundle), only what the customer will receive, with no lifestyle context; lifestyle images must be secondary images. | - | mandatory | all | [1] |
| `images_main.beauty_multiple_angles` | Beauty products may show multiple angles on the primary image (listed product-specific exception). | - | informational | beauty | [1] |
| `images_main.colour_swatch` | Cosmetics and nail polish may show one colour swatch per primary image; the swatch may not be larger than the product. Painted items such as hands are allowed on secondary images only. | 1 swatches | mandatory | beauty | [1] |
| `images_main.bundle_full_contents` | For bundles the primary image must depict the full bundle. Images may show a "+" sign, but the title and description may not use the word "Free". | - | mandatory | all | [1] |
| `images_secondary.allowed_content` | Secondary images may be photographs, drawings, illustrations, lifestyle images, cropped or close-up images, images with other objects for scale, and images with text and demonstrative graphics - as long as they depict the unused product. | - | informational | all | [1] |
| `images_secondary.not_recoloured_duplicate` | A secondary image may not be the same image as the primary image in a different colour; each additional image must show the same product the customer will receive. | - | mandatory | all | [1] |
| `images_secondary.no_logos_badges` | Logos and badges are not allowed as a secondary image. | - | mandatory | all | [1] |
| `images_secondary.no_collage` | A secondary image must not be a collage. | - | mandatory | all | [2] |
| `images_secondary.medicine_ingredients_photo` | Medicine & Related Products (topical substances, vitamins & supplements) must have a secondary image listing all active ingredients and their quantities; it must be a photo of the actual product/packaging - digital images of the ingredient information are not allowed. | - | mandatory | all | [1] |
| `video.youtube_link_only` | A product video is submitted as a YouTube link only (Video Link field on Add a Product, the loadsheet, or an Edit Request). | - | mandatory | all | [1] |
| `video.max_length_minutes` | Video length must be three minutes at maximum. | 3 minutes | mandatory | all | [1] |
| `video.dimensions` | Video width and height must be within the set dimensions (640 x 360). | - | mandatory | all | [1] |
| `video.no_watermarks_or_offsite` | The video must be free from watermarks, logos or symbols, relate only to the product on sale, be high quality, and may not direct customers away from Takealot. | - | mandatory | all | [1] |
| `video.no_promotional_content` | No reviews, quotes, testimonials, advertisements, promotional material, offer information (stock, price, condition), alternative ordering information or time-sensitive information in the video. | - | mandatory | all | [1] |
| `variants.size_colour_must_be_variants` | All products in the same range that vary in size and/or colour must be listed as variants under a single listing; new variant products submitted as separate listings are rejected. | - | mandatory | all | [1] |
| `variants.images` | Variants that look different (e.g. colours) need their own image on each variant line; variants that look the same (e.g. sizes) need one image on the first variant line. | - | informational | all | [2] |
| `variants.no_low_value_bundles` | Creating bundles with low-value items (e.g. pens, stickers, keyrings) in order to create an exclusive listing is prohibited. | - | mandatory | all | [1] |
| `variants.bulk_packs` | For identical items sold in bulk/cases the title, Key Selling Features and "What's in the Box" must reflect the full offer; one product image is sufficient. | - | mandatory | all | [1] |
| `language.latin_characters_only` | Only numbers, basic punctuation and upper/lower-case Latin characters are accepted in product information; e.g. Russian, Chinese and Arabic characters are not allowed. | - | mandatory | all | [1] |
| `approval.review_process` | Every catalogue submission goes through an automated System Review (including image validation at upload) and a Quality Review by the Catalogue Team; the seller receives an email summary and downloads a Results File (with a Rejection tab) from the Catalogue Submission page. If one image of a product fails, the whole product is rejected. | - | informational | all | [1] |
| `restricted_claims.skin_whitening_terms` | The terms "whitening", "lightening" and "bleacher" may not be used for skin products (for discolorations, dark spots, etc.) in product titles, descriptions or images; "brightening" may be used instead. | - | mandatory | skin care | [4] |
| `restricted_claims.health_terms` | In health products the following terms and claims (and wording of similar meaning) may not be used: Magical; Miracle/Miraculous; The only product to use; World's Best; 100% Safe; No side effects; Guaranteed; Other drugs or products cannot compare with it; Sensational relief; The number 1 (unless substantiated); Efficacious/Effective; Perpetual Youth; any reference to the cure, treatment or diagnosis of a disease unless specifically provided for. | - | mandatory | all | [1] |
| `restricted_claims.no_offer_or_promo_text` | Product information may not contain offer information (stock on hand, price, product condition), alternative ordering or shipping information (links to other sites, "free shipping"), time-sensitive information, reviews, quotes, testimonials, solicitations for reviews, or promotional wording such as "% off" / "Save". | - | mandatory | all | [1] |
| `restricted_claims.no_offensive_content` | No pornographic, obscene or offensive content or language in any product information or media. | - | mandatory | all | [1] |
| `restricted_claims.complementary_medicine_disclaimer` | Complementary medicines / health supplements (unscheduled) must carry Takealot's prescribed SAHPRA disclaimer text in the description. | - | mandatory | all | [1] |
| `restricted_claims.medical_device_licence` | Products classified as medical devices may be listed only with a valid SAHPRA medical device licence and only if Class A or B; a prescribed disclaimer must be added to the description. | - | mandatory | all | [1] |

**Enhanced content:** unknown. Not publicly documented. No A+/enhanced-content programme is described in the catalogue rules, images guide or API documentation retrieved. The standard product page fields are title, subtitle, Key Selling Features (plain text - no HTML or JavaScript), What's in the Box, attributes, images and one YouTube video link; fact sheets and PDFs are not accepted. [1]

**Official quality signals:**

- **Listing quality score (API field "listing_quality"; "also known as the catalogue quality score")** - Official description: "an indicator of how well the offer is listed on the Takealot platform, based on factors such as completeness of information, image quality, and other relevant criteria. A higher score indicates a better listing quality." Components: Not itemised officially. The API documentation gives only "completeness of information, image quality, and other relevant criteria" and says the score is "typically calculated by Takealot's internal algorithms". Access: api (API reference: https://marketplace-api.takealot.com/v1/docs). Who: Any seller account owner: an API key is generated in the API Access section of the Seller Portal and sent in the X-API-Key header.. Verification: official document. Read-only integer returned on offer objects (GET /offers and GET /offers/{offer_id}; selectable through the "fields" parameter). The documented example value is 85; the scale (0-100 or other) is not stated. The older Seller API (seller-api.takealot.com, Swagger 2.0) has no such field. [7]
- **Listing Quality score shown in the Seller Portal (0-3) - as reported by a third party** - Per-offer listing quality grade displayed on the offer detail page of the Seller Portal. Components: Reported as four factors - title, images, attributes, description - graded 0 (unacceptable) to 3 (excellent). Access: seller portal only. Who: Logged-in Takealot sellers. Verification: unverified. From a third-party blog that cites no Takealot documentation; the 0-3 scale conflicts with the example value 85 in the official API documentation, so the two may be different presentations of the same metric. Could not be verified without a seller login. [9]

**Limitations:** The Seller Help Centre (help.takealot.com) blocks automated access (HTTP 403), so the rules were read from the official documents Takealot publishes through Google Docs/Sheets, which carry the same titles and version numbers as the help-centre articles; anything that exists only inside the help centre or the logged-in Seller Portal (loadsheet field limits per category, mandatory-attribute lists, "What's in the Box" mandatory categories, content review turnaround times) was not seen. Two linked documents are old (title guidelines 2019; excluded products 2022). No official source was found for enhanced/A+ content, for the scale and components of the listing-quality score, or for a catalogue review SLA. Takealot does not publish a cosmetic-ingredient-list requirement; the only ingredient rules found apply to medicine-type and food categories. Web search was unavailable for part of the session (shared search budget exhausted), so some secondary checks could not be repeated.

**Sources consulted for this retailer:** [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]

### 2. Jumia

**Countries:** NG, KE  
**Public documentation level:** partial  
**How brands deliver content:** Self-service Jumia Vendor Center (one system for all Jumia countries): single "Add a Product" form, category Excel template import/export, or the Vendor Center API (product create/update feeds). Every creation or edit is validated automatically and then passes Jumia content Quality Check (QC) before it is published. Field-level limits (name, description, highlights) are defined per category attribute set inside Vendor Center / the API and are not published on the public VendorHub pages. Regulated categories (food, cosmetics, etc.) are limited to local sellers and Jumia-managed accounts according to the local policy pages; cross-border sellers use Jumia Global (vendor.jumia.com) with its own guidelines. Brand owners and authorised distributors/resellers can apply for Official Store status.

**Languages:**

- NG: en - Jumia Global beauty guideline: Senegal and Cote d'Ivoire must list products in French, "other countries must use English"; the Vendor API takes name and description "in default English language" with optional translations. [32]
- KE: en - Same statement as for Nigeria. No local-language (e.g. Swahili) requirement is published. [32]

| Rule | Requirement | Value | Level | Scope | Source |
|---|---|---|---|---|---|
| `title.composition` | Product name is given in English and should consist of the actual product name plus, if available, colour, edition and speciality. | - | recommended | all | [34] |
| `title.length_limits` | Product-name length limits are not published on VendorHub; attribute validation (min/max length, character type, list values) is defined per category attribute set and is enforced at submission. | - | informational | all | [13] |
| `title.no_other_platform_names` | Names and brands of other platforms may not be used in product names, descriptions or details. | - | recommended | marketplace sellers | [27] |
| `title.images_must_match` | All product images must match the product's title. | - | mandatory | all | [11] |
| `description.content` | Provide a clear and detailed description of the product; the description should give the customer useful information to support a purchase. | - | recommended | all | [19] |
| `description.no_chinese` | Product descriptions must not use Chinese; images must not contain Chinese characters or watermarks. | - | recommended | marketplace sellers | [27] |
| `description.beauty_ingredients_inci` | Beauty products: give the ingredient list in the description, with all ingredients in descending order of concentration using INCI names, plus usage instructions and other relevant information (template also shows a "Free From" list). | - | recommended | beauty; marketplace sellers | [32] |
| `bullets.beauty_highlights_structure` | Beauty products: write Product Highlights as USP 1, USP 2, USP 3, then Variant, Volume/Size, Age of Use, Choking Hazard (if applicable) and Allergens. | - | recommended | beauty; marketplace sellers | [32] |
| `attributes.mandatory_fields` | All mandatory attribute fields of the category must be filled with valid data (data type, list values, length); otherwise the creation/update request is blocked with an error (form), an error report (file import) or an error message (API). | - | mandatory | all | [19] |
| `attributes.category_specific` | Attribute fields depend on the product category; some are common (colour, dimensions) and others category-specific. Use metric units (cm, m, L, kg). | - | informational | all | [13] |
| `attributes.category_level` | Select the most precise (lowest-level) category; choosing a higher-level category is likely to be judged an incorrect category and fail content QC. | - | recommended | marketplace sellers | [30] |
| `attributes.nafdac_registration` | Nigeria: edible, pharmaceutical and beauty products (including but not limited to lotions, lipsticks, powders, deodorants, nail polish and aerosol cans) all require NAFDAC Registration Numbers. | - | mandatory | NG; beauty | [13] |
| `attributes.regulatory_registration_field` | Products in food-and-drug-agency regulated categories (e.g. foods, alcohol, cosmetics, tobacco) must have valid local registrations; the listing includes a mandatory field for the registration number. | - | mandatory | all | [22] |
| `attributes.regulated_categories_local_sellers_only` | All listings in food-and-drug-agency regulated product categories are limited to local sellers and Jumia-managed accounts only. | - | informational | all | [21] |
| `attributes.kebs_pvoc_cross_border` | Kenya (cross-border FBJ beauty sellers): certification requirement is the KEBS PVOC Certificate of Conformity (CoC); Nigeria: NAFDAC certification. Jumia does not provide certification services. | - | informational | beauty; marketplace sellers | [32] |
| `attributes.shelf_life_inbound` | Beauty stock sent to Jumia warehouses (FBJ) must have remaining shelf life of more than half its total shelf life and not less than 6 months. | 6 months | informational | beauty; marketplace sellers | [32] |
| `attributes.brand` | Select the correct brand from the platform database (create the brand first if missing); using a restricted "Generic" brand may need approval, and an authorisation letter may be required for branded products. | - | mandatory | all | [19] |
| `identifiers.gtin_mandatory` | gtin_barcode is a mandatory field at product creation for all products that have a barcode printed on their packaging; Jumia maintains a list of brands and categories for which it is mandatory. | - | mandatory | all | [15] |
| `identifiers.gtin_unique_per_account` | Each GTIN is unique to a product: a seller cannot create more than one product with the same gtin_barcode in the same Jumia account. | - | mandatory | all | [15] |
| `identifiers.gtin_exemption` | A GTIN exemption can be requested only for brands where Jumia requires barcodes but the items carry no manufacturer barcode; photos of all sides of the product are needed. | - | informational | all | [15] |
| `images.min_resolution_px` | Minimum image resolution is 500 x 500 px. | 500 pixels | mandatory | all | [11] |
| `images.max_resolution_px` | Maximum image resolution is 3,000 x 3,000 px. | 3000 pixels | mandatory | all | [11] |
| `images.recommended_resolution_px` | Images larger than 1,000 px on each side are recommended. | 1000 pixels | recommended | all | [11] |
| `images.min_count` | At least 1 image is required. | 1 images | mandatory | all | [11] |
| `images.recommended_count` | 6 images and a YouTube video id are recommended. | 6 images | recommended | all | [11] |
| `images.format` | Accepted file formats: JPEG (.jpg/.jpeg), TIFF (.tif) or PNG (.png); JPEG is recommended. | - | mandatory | all | [11] |
| `images.quality` | Images must be clear and unpixellated with no stretched or squashed edges; no watermark is recommended on any image. | - | mandatory | all | [11] |
| `images.file_name` | Image file name is composed of the product identifier, the variant code and the file extension (e.g. sellersku124.main.jpg for the main image). | - | informational | all | [11] |
| `images_main.background` | Main image must have a pure-white background (RGB 255, 255, 255). | - | mandatory | all | [11] |
| `images_main.product_fill_percent` | Main image must show the product as more than 80% of the image, with the entire product inside the frame. | 80 percent | mandatory | all | [11] |
| `images_main.no_text_or_graphics` | Main image must not have text, logos, borders, colour blocks, watermarks or other graphics covering the product or in the background. | - | mandatory | all | [11] |
| `images_main.no_extra_items_or_multi_view` | Main image must not show accessories that are not included, must not include multiple product views in a single image, and must be a realistic professional image (not a placeholder). | - | mandatory | all | [11] |
| `images.no_reviews_claims_badges` | No image may include customer reviews, five-star imagery, claims (e.g. free shipping), seller-specific information, pricing details, or Jumia badges (or anything confusingly similar). | - | mandatory | all | [11] |
| `images.no_nudity_mannequins_used_look` | No image may contain nudity or sexually suggestive content, visible mannequins, or products that look second-hand or used. | - | mandatory | all | [11] |
| `images_secondary.recommended_views` | Recommended views for consumables: front view (product and key size/pieces information), back view (manufacturer details / composition) and an out-of-packaging view; for other general merchandise: front, back, side, detail, functionality and styled shots. | - | recommended | all | [11] |
| `video.youtube_id` | Video is supplied as a YouTube video id alongside the images (recommended, not required). | - | recommended | all | [11] |
| `seo.attributes_for_search` | Complete attributes so customers can find the product through Jumia search and filters; GTINs are said to improve grouping and search visibility. | - | recommended | all | [13] |
| `seo.no_keyword_misspelling` | Use correctly spelled words; avoid incorrect or variant spellings. | - | recommended | marketplace sellers | [33] |
| `variants.single_variation_only` | Jumia supports a single variation only: a product may vary by one criterion (e.g. size) and not by two (e.g. size and colour). | - | mandatory | all | [17] |
| `variants.no_appearance_variations` | Variations share one common image set, so only attributes that do not change the product's appearance (size, power, capacity) can be variations; colour and shape cannot. | - | mandatory | all | [17] |
| `variants.same_product_family` | Variations must be fundamentally the same product, under the same brand, able to share a single title; do not group different products on one page. | - | mandatory | all | [17] |
| `approval.qc_required` | Every product creation or update request passes a content quality check before it is published; statuses are "pending QC", "approved" and "rejected", and rejection reasons are shown per product and can be exported to Excel/CSV. | - | informational | all | [19] |
| `approval.timeline_local` | Changes may take up to several days to reflect on the app and website because of the quality check. | - | informational | all | [19] |
| `approval.timeline_manual_review` | Product review is either automatic (results within a short time) or manual, which requires 1-2 business days. | 2 business days | informational | marketplace sellers | [30] |
| `approval.auto_rules` | Restriction rules (e.g. blacklisted keywords, categories or brands prohibited in specific countries) must pass for a creation/update to succeed; review rules then set the product to auto-approved, auto-rejected or Pending QC (manual). | - | informational | marketplace sellers | [29] |
| `approval.unapproved_cleanup_90_days` | A listing that is never approved and never active within 90 days of creation is removed; it is flagged "Pending Deletion" from day 60. | 90 days | informational | KE | [23] |
| `approval.official_store_eligibility` | Official Store status is open only to the brand owner or an officially authorised distributor/reseller with a Letter of Authorization or trademark proof; only approved SKUs are eligible and the store must keep a vendor score and customer rating of at least 4.0. | - | informational | all | [24] |
| `approval.physical_qc_matches_listing` | At drop-off Jumia checks that the physical product matches the product page (brand, colour, size, model, other specifications); mismatches fail the quality check. | - | informational | all | [26] |
| `restricted_claims.advertising_words` | Product content may not use marketing-status words such as "promotion" or "best-selling", unsubstantiated statements such as "free shipping" or "100% original", or misleading phrases such as "colors are random", "as shown in the picture" or "contact us". | - | recommended | marketplace sellers | [33] |
| `restricted_claims.sensitive_keywords` | Keywords relating to sensitive country/religion/belief topics, indecent or vulgar language, counterfeit brand spellings, dangerous or prohibited goods, and content that misleads consumers can cause QC failure. | - | recommended | marketplace sellers | [30] |
| `restricted_claims.beauty_prohibited_ingredients` | Commonly prohibited cosmetic contents (reference list): whitening products containing hydroquinone, products containing corticosteroids, heavy metals (lead, mercury, arsenic, cadmium), hydrogen peroxide whitening products, and additives such as formaldehyde, benzene, phthalates and high-dose PPD. | - | informational | beauty; marketplace sellers | [32] |
| `restricted_claims.prohibited_categories` | Prescription medicines and medical devices are always prohibited from sale on Jumia; counterfeit and used products are prohibited. | - | mandatory | all | [21] |

**Enhanced content:** unknown. Not publicly documented. No A+/enhanced-content programme, module list or eligibility rule appears on VendorHub NG/KE, Jumia Global VendorHub or in the Vendor API. Product content is name, description, highlights, attributes, up to 8 images and an optional YouTube video. The Official Store programme (brand owner or authorised distributor) is a seller badge with performance standards, not a content format. [19]

**Official quality signals:**

- **Content Score** - Jumia Global describes it as product content parameters "such as images, descriptions, and product names" meeting the platform's requirements; a good Content Score is listed as a way to improve the QC approval rate. Components: Not itemised in current documentation. Access: none. Who: Not currently viewable by sellers. Verification: official document. The Jumia Global FAQ (2026-05-08) answers "Where can I check the Content Score product score?" with "This function is under development." The older Seller Center exposed a Content Score per product, but its documentation pages were unreachable or returned 404 on 2026-11-26, so their thresholds are not recorded. [31]
- **QC status (content Quality Check status and rejection reasons)** - Whether a product creation/update passed Jumia content QC, and why it was rejected. Components: Status values NOT_READY_TO_QC, PENDING, APPROVED, REJECTED; rejectionReason and rejectionComment (up to 5 rejection reasons shown in the portal). Access: api (API reference: https://vendorcenter.jumia.com/api-docs/). Who: Sellers in Vendor Center (Manage Products > QC status; export of rejected products to Excel/CSV) and authorised Vendor API applications (GET /catalog/products with the qcStatus filter).. Verification: official document. A pass/fail diagnostic, not a graded score. Also available as a downloadable report (Import/Export > Export products, filter "Rejected"; reasons are in the last columns). [34]

**Limitations:** Public VendorHub pages for Nigeria and Kenya cover images, attributes, GTINs, variations, QC and policy, but they publish no character limits for product name, description or highlights - those are set per category in Vendor Center templates and the attribute-set API, which need a seller login. Several rules come from the Jumia Global VendorHub (cross-border sellers) and are flagged as such; they may not be enforced identically for local sellers. Kenya-specific regulatory fields (KEBS, Pharmacy and Poisons Board) are not named on Jumia Kenya pages - only the generic "mandatory field for the FDA registration number". The legacy Content Score pages (guide.sellercenter.jumia.com, contentguidelines.jumia.com.ng / .co.ke, a vendorhub.jumia.ug course) were unreachable or 404, and current documentation says the Content Score view is under development. The Seller Score (shipping speed, average product rating, quality return rate, cancellation rate) is a seller-level performance score, not a content score. No enhanced-content programme and no video specification were found.

**Sources consulted for this retailer:** [11] [12] [13] [14] [15] [16] [17] [18] [19] [20] [21] [22] [23] [24] [25] [26] [27] [28] [29] [30] [31] [32] [33] [34]

### 3. Flipkart

**Countries:** IN  
**Public documentation level:** minimal  
**How brands deliver content:** Self-service Flipkart Seller Hub (seller.flipkart.com). A seller first obtains brand approval from Flipkart's Brand Regulation Team, then either matches ("latches" onto) a product that already exists in the Flipkart catalogue or creates a new product - one at a time (Listings > Add New Product) or with the bulk listing Excel template. Submissions go to Flipkart's quality check (QC) team before going live. Detailed field limits, image specifications and the listing-quality view sit behind the Seller Hub login (Learning Center) and are not on the public site. Flipkart sells paid content help: Premium Catalog Services (photo/video shoots, rich product description, catalogue enrichment, 360/AR) and the Ignite programme for new sellers. The public Seller API (v3) manages listings (price, stock, shipping, status) rather than catalogue content.

**Languages:**

- IN: en - Not stated in the public pages retrieved. The public Seller Hub, its guidance and all examples are in English; Flipkart publishes no rule on Hindi or regional-language listing content. [35]

| Rule | Requirement | Value | Level | Scope | Source |
|---|---|---|---|---|---|
| `title.clear_keyword_friendly` | Write a clear, descriptive, keyword-friendly product title; avoid vague names (e.g. "T-shirt") and include differentiators such as colour, size and style. | - | recommended | all | [35] |
| `title.concise_with_main_keywords` | Keep the title concise yet descriptive and integrate the main keywords customers are likely to search for; keep it succinct so it is easily scannable. | - | recommended | all | [36] |
| `description.features_usage_benefits` | Description should highlight features, usage and benefits in a concise, customer-focused manner; use bullet points to break down information. | - | recommended | all | [36] |
| `bullets.beauty_highlights` | Beauty listings: specify major highlights / key features (e.g. waterproof, long-lasting) and accurate basic details - brand name, product type, quantity and, where relevant, the skin type the product is for. | - | recommended | beauty | [42] |
| `attributes.detailed_product_information` | New products need complete information - description, dimensions, features, images and usage instructions - plus details such as size, model, colour and brand. | - | mandatory | all | [41] |
| `attributes.hsn_code` | An HSN code (tax classification) must be supplied for each listing. | - | mandatory | all | [35] |
| `attributes.category_approval` | Some categories require prior quality approval, certifications or documents before listings can go live. | - | mandatory | all | [40] |
| `attributes.cosmetics_licensing` | Cosmetics of Indian origin may be sold only if manufactured by a licensed manufacturer and labelled and packed as per the Cosmetics Rules, 2020; cosmetics of foreign origin only if imported under a valid registration and labelled as per the Cosmetics Rules, 2020. | - | mandatory | beauty | [45] |
| `attributes.beauty_replacement_policy` | Beauty listings should mention replacement-policy details, if any. | - | recommended | beauty | [42] |
| `identifiers.brand_approval` | Brand approval from Flipkart's Brand Regulation Team is required before listing; if the brand already exists on Flipkart it can be selected, otherwise approval must be requested (a "Generic" option exists where applicable). | - | mandatory | all | [40] |
| `identifiers.gtin` | GTIN/EAN requirements are not published on the public Seller Hub pages. | - | informational (unverified) | all | [35] |
| `images_main.white_background` | Upload high-resolution product images on a white background; add lifestyle shots where possible. | - | recommended | all | [35] |
| `images.multiple_angles` | Use clear, professional, high-resolution images taken from multiple angles that show all relevant details and use cases; blurry or low-resolution photos should be avoided. | - | recommended | all | [36] |
| `images.third_party_specs` | Reported by an integrator (not confirmed by Flipkart): JPEG only; minimum 2 and maximum 5 images; primary image on a white background; 1000 x 1000 px recommended. | - | informational (unverified) | all | [49] |
| `video.concise` | Keep product videos concise and to the point, consistent in style and of high production quality. | - | recommended | all | [38] |
| `seo.keywords_natural` | Use relevant keywords naturally in titles and descriptions; do keyword research with the tools on the Flipkart seller dashboard. | - | recommended | all | [36] |
| `seo.complete_information` | Precise and comprehensive product information with clear images can increase visibility on the platform (Flipkart states "by up to 15%"). | - | informational | all | [41] |
| `variants.group_under_one_listing` | Group variations of the same product (e.g. sizes, colours) under a single parent listing instead of listing each variant separately. | - | recommended | all | [39] |
| `approval.qc_review` | After submission the listing goes to Flipkart Seller Hub's quality check: the QC team reviews images, descriptions and compliance, and the product goes live after approval. | - | informational | all | [35] |
| `restricted_claims.cosmetics_prohibited` | Prohibited cosmetics include: products with stem-cell extracts; cosmetics that require a prescription or medical supervision; tampered, expired, misbranded, counterfeit or adulterated cosmetics, testers and samples; and cosmetics containing regulated ingredients (e.g. arsenic, lead, mercury compounds, hydroquinone, chloroform) above the limits in cosmetic law read with IS 4707 (parts 1 and 2). | - | mandatory | beauty | [45] |

**Enhanced content:** yes - Rich Product Description. Sold as part of the paid, voluntary Flipkart Premium Catalog Services. The brochure states it "is applicable across products which are feature rich and requires further explanation" and "is not applicable for accessories". Self-service eligibility (e.g. for approved brands) is not publicly documented. The brochure shows a before/after product page with image-and-text feature blocks under the description; the brochure price is Rs 720. Related paid services in the same brochure: Catalog Enrichment, Style Note, Infographics Callout (Rs 150 for 4 callouts), Product 360 View, model/product photo shoots, 360 video shoots and AR/3D modelling. Module specifications (image sizes, text limits) are not published. [44]

**Official quality signals:**

- **Listing Quality Score (LQS) - name as used by third parties** - Reported as a per-listing completeness and accuracy rating that Seller Hub shows against each listing, with "improve quality" prompts for low-scoring products. Components: Reported inputs: attribute completeness, images, title and description, and accuracy against the actual product. Flipkart does not publish the formula or weights. Access: seller portal only. Who: Logged-in Flipkart sellers (Seller Hub listings view). Verification: unverified. No official Flipkart Seller Hub page describing the score could be retrieved publicly, so name, scale and components are unverified. Supporting evidence: Flipkart Commerce Cloud's search documentation lists "LQS" as a ranking signal - "Completeness of the product listing: title richness, image count, attribute fill rate. Incomplete listings are demoted." The public Marketplace Seller API v3 Listing Management reference contains no listing-quality field. [48]

**Limitations:** Flipkart keeps its listing rules (title and description limits, image dimensions and counts, mandatory attributes per vertical, brand-approval documents, QC rejection reasons, the listing-quality view) inside the logged-in Seller Hub and its Learning Center; the public site offers only general best-practice blogs, FAQs, the prohibited-items list and service brochures. Consequently almost every rule here is "recommended" and no numeric limit is recorded as mandatory. The only numeric image figures found are from a third-party integrator and are marked unverified. The Listing Quality Score is widely reported by third parties but could not be confirmed from an official seller-facing page. Regulatory fields (CDSCO import registration, BIS/IS 4707, manufacturing licence numbers) are referenced only as legal eligibility conditions, not as listing attributes. The Rich Product Description information comes from a 2023 brochure that is still linked from the live site. Web search was unavailable for most of the Flipkart research (shared search budget exhausted), which limited the discovery of further official documents.

**Sources consulted for this retailer:** [35] [36] [37] [38] [39] [40] [41] [42] [43] [44] [45] [46] [47] [48] [49]

### 4. Shopee

**Countries:** MY  
**Public documentation level:** full  
**How brands deliver content:** Self-service: Shopee Seller Centre (Add New Product, batch/mass upload), the Shopee App, or the Shopee Open Platform API (v2.product.add_item / update_item) through an ERP or in-house system. A listing can be linked to a Shopee Standard Product (SSP) so that category, key attributes and variation types are auto-filled from Shopee's standardised record. Listings are not pre-approved in the documentation retrieved; Shopee reviews listings after publication and bans, delists, deboosts or deletes those that break its policies. A brand lists through a shop that it or its distributor operates (Shopee Mall is the brand-store programme named in the hub); no content-syndication partner route is publicly documented.

**Languages:**

- MY: en, ms - Listings are commonly written in English, Bahasa Malaysia or Chinese. CPETTR 2024 requires seller information and the description of a product's main characteristics in Bahasa Malaysia (other languages may be added), but Shopee reports that enforcement is postponed until further notice (update dated 20 June 2025) and offers in-app automatic translation of descriptions into Bahasa Malaysia. [64]

| Rule | Requirement | Value | Level | Scope | Source |
|---|---|---|---|---|---|
| `title.min_length` | Product title should be at least 10 characters long. | 10 characters | recommended | all | [50] |
| `title.max_length` | The maximum product-name length for Malaysia is not stated in the Seller Education Hub; name length limits are returned per shop/category by the Open API get_item_limit call (item_name_length_limit). | - | informational | all | [71] |
| `title.structure` | Product name format: Brand + Product model + Specification + Size (e.g. "Innisfree Green Tea Cleansing Foam (30ml)"). | - | recommended | all | [53] |
| `title.include_type_or_brand` | The title should include the product type or brand name. | - | recommended | all | [50] |
| `title.capitalisation` | Capitalise the first letter of each word; do not use all caps for a word except brand names (e.g. ZARA, ASUS). | - | recommended | all | [53] |
| `title.no_promotional_text` | Do not include subjective commentary or promotional messages such as "Hot Item", "Best Seller", "Sale", "Free Shipping", or the price, in the product name. | - | recommended | all | [53] |
| `title.no_symbols_emoticons` | Do not use emoticons, hashtags or symbols such as } ~ $ ^ { < ! * # @ ; % > in the product name. | - | recommended | all | [53] |
| `title.no_exaggerated_words` | No exaggerated words and no excessive or irrelevant search terms in the title. | - | recommended | all | [50] |
| `title.no_keyword_spam` | Irrelevant search terms may not be included in the product title or description (keyword spam); spam listings are banned or deleted and can incur penalty points. | - | mandatory | all | [63] |
| `title.function_stated` | The function of the product must be stated clearly in the product title and description; insufficient or unclear information is treated as improper content. | - | mandatory | all | [59] |
| `title.new_packaging_tag` | When FMCG packaging has changed, add a short tag such as [New Packaging] or [Updated Design] to the title and show an old-vs-new comparison image. | - | recommended | all | [61] |
| `description.min_length_or_image` | Description should contain at least 60 characters or include at least 1 description image. | 60 characters | recommended | all | [50] |
| `description.content` | A complete description covers detailed product specifications (material, weight, dimensions, ingredients, etc.), uses and benefits, and warranties/manuals where applicable. | - | recommended | all | [52] |
| `description.length_limits` | Description length limits for Malaysia are not stated in the Seller Education Hub; they are returned per shop by the Open API get_item_limit call (item_description_length_limit, extended_description_limit). | - | informational | all | [71] |
| `bullets.none` | No separate bullet-point / highlights field is documented for Shopee listings; key points belong in the description and attributes. | - | informational | all | [52] |
| `attributes.correct_category` | Products must be listed in the correct category; wrong categorisation can lead to deboosting, account suspension or balance deductions. | - | mandatory | all | [66] |
| `attributes.brand_and_key_attributes` | Fill in brand information and key attributes, with at least 3 attributes per listing. | 3 attributes | recommended | all | [50] |
| `attributes.cosmetic_npra_notification` | Cosmetic products listed on Shopee Malaysia must have a product notification number issued by the NPRA (format NOTYYMMXXXXXK); unnotified cosmetics are deleted and the seller may be penalised. | - | mandatory | beauty | [60] |
| `attributes.medicinal_registration_numbers` | When listing medical devices or medicinal products (health supplements, OTC drugs), the seller must provide the MDA medical device registration number or NPRA product registration number (MAL...), and the advertisement approval number where relevant. | - | mandatory | all | [60] |
| `attributes.product_certification` | For products with safety/health standards set by an authority, CPETTR 2024 calls for the certification details to be provided/uploaded in the listing. | - | informational | all | [64] |
| `identifiers.gtin_rule_by_category` | GTIN requirements are category-specific: the Open API returns a gtin_validation_rule of Mandatory (valid GTIN required), Flexible (valid GTIN or "00" to declare none) or Optional. | - | informational | all | [71] |
| `images.max_count` | Up to nine images (including the cover image) can be uploaded per product, plus additional images for variations. | 9 images | mandatory | all | [55] |
| `images.min_count` | A minimum number of images is required for the "Qualified" level; the number varies by category. | - | recommended | all | [50] |
| `images_main.min_dimension_px` | Cover image: minimum image dimension 500 x 500 pixels. | 500 pixels | recommended | all | [55] |
| `images_main.min_dpi` | Cover image: minimum image resolution 72 dpi. | 72 DPI | recommended | all | [55] |
| `images_main.background` | Cover image: well-focused shot in a well-lit environment, preferably against a white background, frontal or 30-degree angle. | - | recommended | all | [55] |
| `images_main.product_fill_percent` | Cover image: the product should cover at least 70% of the image; avoid zoomed-in and cropped photos. | 70 percent | recommended | all | [55] |
| `images_main.no_text_or_graphics` | Cover image: show the product and its brand clearly, show only the product featured in the listing, and avoid adding text or graphics. | - | recommended | all | [55] |
| `images.quality_criteria` | Images should show the complete product without white borders or edges, be clear, have a clean background and carry no watermark covering the product. | - | recommended | all | [50] |
| `images.ratio_3_4` | Images can optionally be uploaded in a 3:4 display ratio (tick "3:4 Image" when adding the listing; the image is auto-cropped). | - | recommended | all | [56] |
| `images_secondary.content` | Additional images should show the product from different angles, product specifications, how to use the product, and product variations. | - | recommended | all | [55] |
| `video.max_count` | Only one video can be uploaded per listing (1 Cover Video); it plays before the cover photo on the product page. | 1 videos | mandatory | all | [58] |
| `video.duration_min_seconds` | Video duration must be at least 10 seconds. | 10 seconds | mandatory | all | [58] |
| `video.duration_max_seconds` | Video duration must be at most 60 seconds. | 60 seconds | mandatory | all | [58] |
| `video.format` | Video format: MP4 only. | - | mandatory | all | [58] |
| `video.max_file_size_mb` | Video size: maximum 30 MB. | 30 MB | mandatory | all | [58] |
| `video.max_resolution_px` | Video resolution must not exceed 1280 x 1280 pixels. | 1280 pixels | mandatory | all | [58] |
| `video.needed_for_excellent` | Uploading a video is the criterion for reaching the "Excellent" listing-quality level for new items. | - | recommended | all | [51] |
| `enhanced_content.description_images_max_count` | Up to 12 images can be added inside the product description (feature available to selected sellers). | 12 images | informational | all | [54] |
| `enhanced_content.description_image_min_px` | Description images must be at least 1000 px x 32 px, with an aspect ratio between 0.5 and 32. | 1000 pixels | informational | all | [54] |
| `enhanced_content.description_image_max_mb` | A description image file cannot be larger than 2 MB. | 2 MB | informational | all | [54] |
| `seo.attributes_and_category` | Accurate attributes and the right category improve search accuracy and visibility; a structured, accurate name increases product exposure. | - | recommended | all | [52] |
| `seo.link_standard_product` | Linking a listing to a Shopee Standard Product (SSP) is promoted as boosting visibility and campaign eligibility; category, key attributes and variation types are then locked to the SSP record. | - | informational | all | [65] |
| `variants.max_types` | A product can have up to 2 variation types (e.g. colour and size). | 2 variation types | mandatory | all | [57] |
| `variants.no_separate_listings` | Do not create separate listings for similar products that differ only by variation such as size or colour - set product variations instead; duplicates are treated as spam listings. | - | mandatory | all | [63] |
| `variants.standardised` | Use standardised variations; "non-standardised variations" is flagged as an issue to fix by Product Optimiser. | - | recommended | all | [50] |
| `language.bahasa_malaysia_cpettr` | CPETTR 2024: seller information and the description of the main characteristics of products are to be provided in Bahasa Malaysia (brand names excluded); other languages may be added and no language order is prescribed. Product images need not be translated. | - | informational | all | [64] |
| `approval.post_listing_review` | No pre-publication approval step is described; listings that violate listing policies or local regulations are delisted, banned or deleted. Some banned/delisted listings can be edited and resubmitted for Shopee's review by a deadline, otherwise they are deleted. | - | informational | all | [67] |
| `approval.item_card_appeal_days` | Item Card (preview card) violations limit a listing's traffic; the seller can appeal within 14 days or edit the listing to trigger re-evaluation. Appeals usually take less than one week. | 14 days | informational | all | [68] |
| `restricted_claims.health_claims` | Content for medicines, supplements and/or cosmetics must not make unsubstantiated or exaggerated health claims (unless approved by the authorities), in particular claims related to the 20 types of illnesses described by Malaysia's Ministry of Health; this applies to the product title, images and description. | - | mandatory | beauty | [59] |
| `restricted_claims.advertisement_approval` | Medical devices and medicinal products that require advertisement approval (MDA / Medicine Advertisement Board) must not be listed without it. | - | mandatory | all | [60] |
| `restricted_claims.cosmetic_prohibited_ingredients` | Shopee may remove listings of notified cosmetic products that the Ministry of Health flags as containing prohibited ingredients. | - | informational | beauty | [60] |
| `restricted_claims.misleading_or_objectionable` | Listing content must not be misleading about the product received, obscene, vulgar, discriminatory or otherwise objectionable, and must not promote illegal activities. | - | mandatory | all | [59] |
| `restricted_claims.palm_oil` | Listings may not contain statements that discriminate against, or discourage buyers from consuming, palm oil products. | - | mandatory | all | [59] |
| `restricted_claims.no_off_platform_contact` | Listings may not carry personal contact information or direct buyers to third-party channels (WhatsApp, LINE, Facebook, other websites) to transact outside Shopee. | - | mandatory | all | [69] |
| `restricted_claims.packaging_authenticity_claims` | When describing updated packaging, do not disparage the older packaging or state that only the new design is "100% authentic" or that older versions are "no longer sold". | - | mandatory | all | [61] |

**Enhanced content:** yes - Images in the product description ("Add Images" in Product Description; Open API: extended description). "Currently available for selected sellers" (Seller Education Hub, 2024-12-13). Selection criteria are not published. Text description interleaved with up to 12 images (uploaded or built with the Image Creator templates); each image at least 1000 px x 32 px, aspect ratio 0.5-32, max 2 MB. No module library comparable to A+ content is documented. [54]

**Official quality signals:**

- **Listing quality level (shown through Product Optimiser / the Smart Diagnosis column; Open API name: content quality level)** - How complete and high-quality a listing's content is. Levels: Excellent, Qualified, and (API) To Be Improved; the API also returns NONE for deleted or banned items. Components: New items (created within 90 days) - Qualified: title (min 10 characters, no excessive/irrelevant search terms, no exaggerated words, includes product type or brand), description (min 60 characters or 1 description image), images (category minimum count, complete product without white borders, clear, clean background, no watermark over the product); Excellent: a video. Items older than 90 days additionally: brand information, key attributes, at least 3 attributes, size chart, standardised variations, correct category. API issue types: TOO_FEW_IMAGES, WRONG_CATEGORY, TOO_FEW_ATTRIBUTES_FOR_QUALIFIED, LACK_OF_SIZE_CHART, LACK_OF_STANDARD_VARIATION, LACK_BRAND, TOO_SHORT_DESCRIPTION, TOO_SHORT_OR_TOO_LONG_NAME, WRONG_WEIGHT, LACK_OF_VIDEO, TOO_FEW_ATTRIBUTES_FOR_EXCELLENT. Access: api (API reference: https://open.shopee.com/documents/v2/v2.product.get_item_content_diagnosis_result?module=89&type=1). Who: Sellers in Seller Centre (My Products > Smart Diagnosis; Product Optimiser tasks) and authorised Open Platform apps (ERP System, Seller In House System, Product Management app types).. Verification: official document. POST /api/v2/product/get_item_content_diagnosis_result returns quality_level (0 NONE, 1 TO_BE_IMPROVED, 2 QUALIFIED, 3 EXCELLENT) with unfinished tasks and suggestions for up to 48 item ids; a companion call get_item_list_by_content_diagnosis is listed in the same API module. The thresholds in the API samples (name 25-100 characters, description 100 characters, 3 images) differ from the Malaysian guide (10 and 60 characters), so thresholds should be read per market. [70]

**Limitations:** Rules come from Shopee Malaysia's public Seller Education Hub and the Shopee Open Platform reference. The hard upload limits for Malaysia (maximum title and description length, minimum image count per category, GTIN rule per category) are not printed in the hub; they are served per shop by the get_item_limit API or shown in Seller Centre, so no maximum title length is recorded. Most content rules are published as best practice or as listing-quality criteria, hence "recommended". Two articles carry their rules inside images and were read from screenshots. A linked "listing optimisation best practices" Google document required a login and was not read. No expiry-date or shelf-life listing rule, no ingredient-list requirement for cosmetics and no Shopee Mall-specific content standard were found in the pages retrieved. Singapore, Indonesia and other Shopee markets were out of scope.

**Sources consulted for this retailer:** [50] [51] [52] [53] [54] [55] [56] [57] [58] [59] [60] [61] [62] [63] [64] [65] [66] [67] [68] [69] [70] [71]

### 5. Lazada

**Countries:** MY  
**Public documentation level:** partial  
**How brands deliver content:** Self-service: Lazada Seller Center (Products > Manage Products > Add Products for single upload, Bulk Manage > Bulk Add with a category Excel template), the Lazada seller app, or the Lazada Open Platform API (CreateProduct / UpdateProduct, with images and videos first uploaded to Lazada). Product descriptions are decorated with the built-in Lorikeet tool. A semi-automated Quality Check runs at creation and again after go-live; rejected or flagged products appear under the Violation / QC Alert tabs. Health-category listings require seller whitelisting. A brand lists through a Marketplace or LazMall store that it or its distributor operates; no content-syndication partner route is publicly documented.

**Languages:**

- MY: en, ms - Content Score title guidance says "Name your product in English"; Lorikeet supports a default language (English) and local language (Bahasa Malaysia). Lazada's CPETTR 2024 article says product titles and descriptions must be written in Bahasa Melayu (other languages allowed in addition) but notes the 24 June 2025 deadline "has been postponed until further notice" and that an AI translation feature is being rolled out. [90]

| Rule | Requirement | Value | Level | Scope | Source |
|---|---|---|---|---|---|
| `title.max_length` | Product name: mandatory, maximum 255 characters. | 255 characters | mandatory | all | [93] |
| `title.recommended_length` | Product name should be within the recommended length; the Content Score API sample indicator reads "Suggest title length between 20 and 150". | - | recommended | all | [91] |
| `title.english` | Name your product in English (Title Score guideline). | - | recommended | all | [72] |
| `title.capitalisation` | Capitalise the first letter of each word except for specific brand names (e.g. GAP, ROLEX). | - | recommended | all | [72] |
| `title.relevant_brands_keywords` | Include only relevant brands (use "For", "Applicable to", "Compatible to" for compatible brands) and avoid duplicate or irrelevant keywords. | - | recommended | all | [72] |
| `title.no_promotional_statements` | The product title must not contain promotional statements such as "Free shipping", "In stock", "Hot sale" or "Best-selling". | - | mandatory | all | [85] |
| `title.no_comparative_superlative` | The product title must not contain comparative or superlative statements (e.g. "better than Brand A", "100% effective"). | - | mandatory | all | [85] |
| `title.no_repeated_or_irrelevant_keywords` | The product title must be straightforward and factual, consist only of relevant keywords, and not contain repeated keywords or irrelevant brand names. | - | mandatory | all | [85] |
| `title.no_special_characters` | The product title must not contain special characters such as emojis, emoticons or other special symbols. | - | mandatory | all | [85] |
| `title.short_shelf_life_tag` | Products with naturally short shelf life or sold as short-dated clearance (e.g. cosmetics and skincare clearance) must state the expiry period in the title and description, e.g. "[EXD: 31/12/2025] PRODUCT NAME". | - | mandatory | beauty | [84] |
| `description.max_length` | Long description: maximum 25,000 characters; HTML tags are allowed; only Lazada-hosted image URLs may be used (no external URLs). | 25,000 characters | mandatory | all | [93] |
| `description.min_words_and_image` | A good product description has a minimum of 30 words and at least 1 image (Content Score - Content Completeness). | 30 words | recommended | all | [72] |
| `description.html_formatting` | Basic HTML is supported in the long description (e.g. <b> for bold, <br> for line breaks). | - | informational | all | [75] |
| `description.expiry_check_guidance` | For expirable products the description must guide the buyer on how to check the production/expiry date on the package. | - | mandatory | beauty | [84] |
| `description.accuracy` | Product content must be accurate, clear and precise; check country of origin, functions and regulatory approvals before listing; material information such as product suitability or side effects must not be omitted. | - | mandatory | all | [85] |
| `bullets.highlights_count` | Short description (highlights): provide at least 3 and up to 8 bullet points. | 3 bullets | recommended | all | [74] |
| `bullets.highlights_format` | Highlights must be an HTML bullet list: the short description is text only (images and URLs are filtered out) and can only use <ul><li> or <ol><li>. | - | mandatory | all | [93] |
| `attributes.mandatory` | All compulsory attributes (marked with a red asterisk under Key Product Information) must be completed; key-property fill rate also counts towards Content Score. | - | mandatory | all | [72] |
| `attributes.brand` | Brand is mandatory (select brand_id from Lazada's brand list or request a new brand); "No Brand" cannot be selected for LazMall stores, and the brand attribute must match the product actually offered. | - | mandatory | all | [93] |
| `attributes.last_level_category` | The product must be placed in the last-level (leaf) category; wilful miscategorisation leads to deactivation plus a non-compliance point. | - | mandatory | all | [92] |
| `attributes.warranty` | Warranty information is a mandatory attribute for all products regardless of category; "What's in the box" (package content) should match what the customer receives. | - | mandatory | all | [74] |
| `attributes.product_license_number` | Sellers must enter the pharmaceutical product, cosmetic or medical device registration/notification number issued by NPRA or MDA in the "Product License" attribute under the specification section when listing. | - | mandatory | beauty | [83] |
| `attributes.expiry_date_on_pack` | Expirable products (including cosmetics and skincare) must have a clearly visible, legible expiry date printed on the packaging in DD/MM/YYYY or MM/YYYY format. | - | mandatory | beauty | [84] |
| `attributes.min_remaining_shelf_life` | Products shipped to buyers must have at least 2/3 of their shelf life remaining on delivery; where there is no production date, cosmetics need at least 1.5 years from delivery date to expiry date. | 18 months | mandatory | beauty | [84] |
| `attributes.health_category_whitelist` | Only whitelisted sellers may upload listings under the Health category; whitelisting of a new seller takes 3-5 working days. | - | mandatory | all | [86] |
| `identifiers.gtin` | No GTIN/EAN requirement is stated in the help articles or the create-product guide retrieved; the API only reports an error when an EAN code already exists. | - | informational (unverified) | all | [92] |
| `images.min_side_px` | Minimum image width and height: 330 px. | 330 pixels | mandatory | all | [94] |
| `images.max_side_px` | Maximum image width and height: 5000 px. | 5000 pixels | mandatory | all | [94] |
| `images.max_file_size_mb` | Maximum image file size: 3,145,728 bytes (3 MB). | 3 MB | mandatory | all | [94] |
| `images.format` | Supported image formats: JPG and PNG. | - | mandatory | all | [94] |
| `images.max_count` | A maximum of 8 images can be uploaded per product, and up to 8 images per SKU/variation option. | 8 images | mandatory | all | [93] |
| `images.min_count` | Provide a minimum of 3 main images (Seller Center upload step and Content Score completeness indicator). | 3 images | recommended | all | [80] |
| `images_main.no_before_after_or_testimonials` | The main product image must feature the main product and must not include "before and after" comparison images, testimonials, irrelevant images, or overclaiming/exaggerated claims or "effects". | - | mandatory | all | [85] |
| `images_main.no_animation` | The main product image must not be an animated image (GIF or video format). | - | mandatory | all | [85] |
| `images_main.no_pure_text` | Content Score flags a main image detected as a pure-text image ("Pure text image detected. Please upload another image."). | - | informational | all | [91] |
| `images.long_image_3_4` | A "long image" in 3:4 aspect ratio can be added or auto-generated from the first product image for certain categories (buyer promotion image). | - | recommended | all | [78] |
| `images_main.background` | Main-image background and composition rules (e.g. white background) are in the login-gated "Product Image & Quality Guideline" and could not be read. | - | informational (unverified) | all | [96] |
| `video.upload_and_audit` | Product video is optional; it is uploaded to Lazada's Media Center (Video Uploader or API) and can be attached to a product only once its status is AUDIT_SUCCESS. | - | informational | all | [93] |
| `video.max_file_size_mb` | Maximum video size: 100 MB (API upload). | 100 MB | mandatory | all | [95] |
| `enhanced_content.lorikeet_components` | Lorikeet (Advanced Mode) builds the product description from Image components (single 1:1 image, dual 3:4 images, triple 1:1 images), a Text & Image component (rich text) and a Free Design component. | - | informational | all | [81] |
| `enhanced_content.lorikeet_recommended` | Use the Lorikeet tool to decorate the product description. | - | recommended | all | [74] |
| `seo.keywords_and_attributes` | Mandatory attributes are the keywords/specifications customers use to search, browse and filter; describe the product in detail with high-quality images and impactful keywords to raise the content score. | - | recommended | all | [72] |
| `seo.no_keyword_stuffing` | Avoid duplicate or irrelevant keywords and irrelevant brand names in the title. | - | mandatory | all | [85] |
| `variants.levels` | Up to 2 levels of variation can be created (seller-defined variation), available for all categories. | 2 variation levels | mandatory | all | [82] |
| `variants.options_per_level` | Up to 20 options are allowed per variation level. | 20 options | mandatory | all | [82] |
| `variants.same_title_and_description` | Product variations should share the same product title and description and vary only in colours, sizes or technical characteristics; listing an add-on or unrelated cheaper item as a variation is prohibited (an add-on may be sold as a bundle that includes the main product). | - | mandatory | all | [85] |
| `variants.no_listing_switching` | Changing an existing listing to a different or newer product is not allowed; a different product needs a new listing. Wilful duplication of listings leads to deactivation plus a non-compliance point. | - | mandatory | all | [85] |
| `language.bahasa_melayu_cpettr` | CPETTR 2024 (per Lazada): product titles and descriptions must be written in Bahasa Melayu, with translations in other languages allowed in addition; registration/licence numbers for certified products must be visible on the product page. | - | informational | all | [90] |
| `approval.qc_process` | Products are reviewed by a semi-automated Quality Check: rejected products appear under the Violation tab with rejection reasons, and post-live checks can still take down prohibited SKUs after they have gone live. | - | informational | all | [79] |
| `approval.qc_alert_grace_days` | Brand-mismatched products flagged in the QC Alert tab are deactivated and locked (+2 non-compliance points) if not edited or deleted within 7 days. | 7 days | informational | all | [87] |
| `restricted_claims.medical_claims` | Product pictures and descriptions count as advertisements: they must not contain medical claims referring, directly or indirectly, to the prevention, treatment or diagnosis of diseases and conditions, or to purposes prohibited by the Medicines (Advertisement and Sale) Act 1956; fake medical claims on non-medical products are prohibited. | - | mandatory | beauty | [89] |
| `restricted_claims.no_false_or_exaggerated` | No false, exaggerated or unverifiable claims (e.g. "miracle cures"), and no competitive claims or superlatives such as "best", "#1", "better than" without scientific or technical evidence. | - | mandatory | all | [85] |
| `restricted_claims.no_offsite_promotion` | Content must not promote or refer users to non-Lazada platforms through links, QR codes or embedded hyperlinks, and must not contain obscene, distasteful, vulgar, discriminating or unlawful material. | - | mandatory | all | [85] |
| `restricted_claims.no_lazmall_marks` | Stores that are not LazMall-certified may not display the LazMall logo, badges or similar marks in product images, descriptions or videos. | - | mandatory | all | [85] |
| `restricted_claims.unnotified_cosmetics` | Cosmetics that have not been notified to the Director of Pharmaceutical Services must not be listed and must be taken down immediately if discovered. | - | mandatory | beauty | [83] |

**Enhanced content:** yes - Lorikeet. Available in Seller Center to sellers generally (Products > Add Products > Product Description); no eligibility restriction is stated. Advanced Mode components can be edited only on the web version of Seller Center. Image components (single 1:1, dual 3:4, triple 1:1), Text & Image component with rich text, Free Design component with free text and image layers, pre-configured templates; content can be set in English and Bahasa Malaysia. Image pixel sizes and text limits per component are not published. [81]

**Official quality signals:**

- **Content Score** - Official description: "a feature that guides you on how to maintain a high-standard of product information that will help you to improve your product's searchability and sales conversion, by providing indicators on your product's quality." Components: Content Completeness (mandatory attributes and key-property fill rate; description of at least 30 words and 1 image; at least 3 main images), Content Quality - Image Score (number and quality of images, promotional square/long images), Content Quality - Title Score (English, recommended length, capitalisation, relevant brands/keywords, no promotional messages, no emojis). Access: api (API reference: https://open.lazada.com/apps/doc/api?path=%2Fproduct%2Fcontent%2Fscore%2Fget). Who: Sellers in Seller Center (Edit Products page, Product Management page, and Products > Manage Products > Product Optimizer) and authorised Open Platform apps via GetProductContentScore (item_id required).. Verification: official document. The API returns score and total per product plus per-indicator items (itemTitle, group, indicators with a "critical" flag, per-image results). The sample response shows score 50 of total 110, so the scale is not a fixed 0-100; the Product Optimizer help article refers to an "Excellent" content score band. Other band names and thresholds are not published in the pages retrieved. [72]
- **QC Alert / Violation (product quality control alerts)** - Products flagged for policy or quality problems (e.g. brand mismatch, product-quality issues from ratings, returns and complaints) with a grace period and suggested action. Components: In Alert and Punished tabs with re-assessment dates; rejection reasons under the Violation tab. Access: seller portal only. Who: Sellers in Seller Center (Products > Manage Products > QC Alert / Violation). Verification: official document. A compliance diagnostic rather than a content score. The Open Platform product API list also contains GetQCAlertProducts and GetPreQcRules, which were not examined in detail. [87]

**Limitations:** Lazada University lessons that hold the detailed content standards ("Content Score Guideline", "Product Image & Quality Guideline", "Product Title Quality Guideline") redirect to the Seller Center sign-up page, so main-image style rules (background, text overlays), the official Content Score bands/weights and category-specific title lengths could not be read; the rules here come from the public Seller Center Help Center and the Open Platform documentation. API limits (255-character name, 25,000-character description, 330-5000 px images, 3 MB) are system maximums and may be stricter in the Seller Center form for a given category. Most help articles carry an identical 2024-11-26 update stamp, so their true age is unclear (one is internally marked 2021). Video duration/format limits, GTIN rules and LazMall-specific content standards were not found. The Bahasa Melayu requirement stems from CPETTR 2024, whose enforcement Lazada reports as postponed.

**Sources consulted for this retailer:** [72] [73] [74] [75] [76] [77] [78] [79] [80] [81] [82] [83] [84] [85] [86] [87] [88] [89] [90] [91] [92] [93] [94] [95] [96]

### 6. TikTok Shop

**Countries:** US, GB, MY, SA  
**Public documentation level:** full  
**How brands deliver content:** Self-service TikTok Shop Seller Center per market (Products > Manage Products > Add new product, bulk templates), or the TikTok Shop Partner Center Open API (Create Product / Edit Product) through an ERP, connector or agency. Listings are audited before going live; restricted categories (including beauty in some markets) need documents uploaded through the Qualification Center / Product Compliance section. Seller Center offers a Product Optimizer and AI description tools. A brand lists through its own shop, directly or with a TikTok Shop partner/agency; no retailer-style content-syndication route is documented. Market check on 2026-11-26: the United States, United Kingdom and Malaysia are in the market selector on seller.tiktok.com and have Academy sites; Saudi Arabia is named as a market in the Partner API documentation (cash-on-delivery field) but is not in that selector and no Saudi Academy site was reachable; the United Arab Emirates appears in neither.

**Languages:**

- US: en - Not stated explicitly in the US pages retrieved; the API locale for the market is en-US and all US guidance is in English. [99]
- GB: en - UK policy: "Product details must be in one of the official languages of the destination market and supported by TikTok Shop." [104]
- MY: en, ms, zh - Title, description and text inside product images must use at least one supported language: English, Bahasa Melayu or Chinese. Unsupported languages are tolerated on packaging, for registered brand names, or when accompanied by a translation. [109]
- SA: not documented - Not documented in the pages retrieved: the Create Product API locale list contains no Arabic locale and no Saudi Academy or policy site could be reached. [99]

| Rule | Requirement | Value | Level | Scope | Source |
|---|---|---|---|---|---|
| `title.max_length` | Product title is required and may be at most 255 characters. | 255 characters | mandatory | all | [99] |
| `title.min_length_other_regions` | In markets other than DE, ES, FR, IE, IT, JP, UK, US, BR and MX the title must be at least 25 characters. | 25 characters | mandatory | MY/SA | [99] |
| `title.us_good_tier_length` | For the Good listing-quality tier the title has at least 25 characters (maximum 255). | 25 characters | recommended | US | [101] |
| `title.row_recommended_min_length` | Outside the US (except Japan) the diagnosis recommends extending the title to at least 40 characters. | 40 characters | recommended | GB/MY | [97] |
| `title.my_recommended_length` | Malaysia Academy guidance: use 25-80 characters for the product title. | 80 characters | recommended | MY | [112] |
| `title.content` | The title must be complete, accurate and concise and include: brand name (only if authorised to sell the brand), product type, main material or ingredient (if applicable), key features (e.g. colour, function, variant) and quantity or volume (e.g. net weight, capacity, pack size). | - | recommended | MY | [108] |
| `title.prohibited_content` | Titles must not contain marketing material or promotions (e.g. "x% off"), a seller URL or seller name, branding or references to "TikTok" (without prior authorisation) or other e-commerce platforms/websites, or symbols and special characters. | - | mandatory | GB/MY | [104] |
| `title.us_no_clickbait` | Title should have no clickbait language (promotions, "best seller"/exclusivity, discounts or sales), no references to variants or inventory (e.g. "Available in red, green...", "5 sizes available", "Low stock") and no word or phrase repeated 4 or more times. | - | recommended | US | [101] |
| `title.identifies_product` | Title must include words that identify the product (e.g. "Tshirt", "Smartphone", "lipstick"). | - | recommended | all | [97] |
| `title.style` | Use standard letters and numbers (no non-linguistic ASCII characters such as Æ, Š, Œ), Arabic numerals for quantities ("2" not "two") and abbreviated units of measure ("cm", "oz", "in"); special symbols are acceptable only when meaningful (e.g. "&"). | - | recommended | US | [101] |
| `title.my_no_subjective_terms` | Do not use subjective or time-sensitive evaluation terms (e.g. "best-selling", "best", "worth it"), exaggerated statements (e.g. "the best in the country", "the biggest") or marketing content ("x% discount", "100% quality guarantee", "free shipping"). | - | recommended | MY | [112] |
| `description.max_length` | Description is HTML with a maximum length of 10,000 characters; images must use TikTok Shop image URLs, with at most 30 <img> tags, each image under 4000 px. | 10,000 characters | mandatory | all | [99] |
| `description.min_words` | Product descriptions must not be less than 30 words. | 30 words | mandatory | GB/MY | [104] |
| `description.us_min_characters` | For the Fair tier and above the description should be valid and at least 80 characters long and/or contain images; it must not be just a link. | 80 characters | recommended | US | [97] |
| `description.row_min_characters` | Outside the US (except Japan) the diagnosis recommends a description of at least 500 characters, with line breaks for readability. | 500 characters | recommended | GB/MY | [97] |
| `description.recommended_structure` | Provide a detailed description (ideally over 300 characters) with 3-5 key selling points, each under 250 characters, with supporting images of 1600 x 1600 px. | - | recommended | all | [99] |
| `description.us_good_tier_format` | For the Good tier: keep paragraphs under 400 characters, use sentence case (no all caps), include at least 3 images if no text description is given, and remove duplicate, mock-up or placeholder images. | - | recommended | US | [97] |
| `description.legal_information` | The description must describe the main characteristics completely and accurately, include information required by law (e.g. product safety information, specifications, warnings) and list all included freebies and accessories. | - | mandatory | GB/MY | [104] |
| `description.beauty_good_tier_content` | Beauty and personal care listings should state product benefits (the Good-tier category requirement for Beauty & Personal Care), the target user group (e.g. skin type: dry, normal, oily), the primary ingredients and the full ingredient list, and measurements such as size, volume or weight. | - | recommended | US; beauty | [97] |
| `description.my_beauty_content` | Malaysia Academy guidance for beauty descriptions: product parameters (place of manufacture, components, weight), target use, benefits, usage instructions, important information (allergens, best-use period, storage conditions) and shade display for make-up. | - | recommended | MY; beauty | [112] |
| `bullets.key_product_features` | Key Product Features (shown in the "Product highlight" module): no more than 5 items and no more than 1,500 characters in total. | 5 items | mandatory | all | [99] |
| `attributes.required_attributes` | Attributes marked as required for the product's leaf category must be provided, otherwise the listing fails; the category must be a leaf category. | - | mandatory | all | [99] |
| `attributes.certifications` | Certifications required for restricted categories must be attached (maximum 10 per product); requirements per category are returned by Get Category Rules, and restricted categories need approval through the Qualification Center. | - | mandatory | all | [100] |
| `attributes.us_beauty_qualification` | US beauty and personal care: sellers may be required to pass category qualification - manufacturers/importers/repackers with proof of FDA registration (or a MoCRA exemption self-attestation), the cosmetic product label (product name, net contents, ingredient list, manufacturer/distributor name and address, warnings) and, for OTC products, the Drug Facts label; resellers with a purchase invoice issued within 365 days plus the labels. | - | informational | US; beauty | [103] |
| `attributes.uk_cosmetic_compliance` | UK (and EU) cosmetics: when listing, sellers must submit the Cosmetic Product Safety Report (full or appropriately redacted), SCPN (Great Britain) / CPNP (EU, Northern Ireland) notification proof, Responsible Person information and clear images or a PDF of the physical product label and packaging; a Safety Data Sheet only for dangerous goods. | - | mandatory | GB; beauty | [105] |
| `attributes.us_shelf_life_days` | US beauty and personal care products should have at least 365 days of remaining shelf life on delivery; if less, this must be clearly disclosed before purchase and in the listing; products more than 3 years old or past their expiration/"best before" date must not be sold. | 365 days | mandatory | US; beauty | [103] |
| `attributes.uk_expiry_labelling` | UK: beauty and personal care products with a limited shelf life must display an expiration date on the packaging or label; expired products must not be listed and the product detail page must be kept up to date for short-shelf-life products. | - | mandatory | GB; beauty | [107] |
| `identifiers.brand_authorisation` | A brand name may be used only with the brand owner's authorisation; unauthorised brands are not displayed on TikTok Shop. | - | mandatory | all | [99] |
| `identifiers.gtin` | GTIN/identifier-code requirements were not established: the SKU-level identifier fields of the Create Product API were not expanded in the page retrieved. | - | informational (unverified) | all | [99] |
| `images.max_count` | A maximum of 9 images can be shown in the product image gallery. | 9 images | mandatory | all | [99] |
| `images.api_min_dimension_px` | Gallery image dimensions must be between 300 x 300 px and 4000 x 4000 px. | 300 pixels | mandatory | all | [99] |
| `images.api_max_dimension_px` | Gallery images may be at most 4000 x 4000 px. | 4000 pixels | mandatory | all | [99] |
| `images.uk_min_dimension_px` | UK policy: each image must be at least 800 x 800 pixels. | 800 pixels | mandatory | GB | [104] |
| `images.my_min_dimension_px` | Malaysia policy: images must be at least 600 x 600 pixels. | 600 pixels | mandatory | MY | [108] |
| `images.us_main_min_resolution_px` | US: the first/main image should have a resolution greater than 600 x 600 pixels. | 600 pixels | recommended | US | [101] |
| `images.recommended_count` | Use a minimum of 5 product images. | 5 images | recommended | all | [99] |
| `images.in_colour_and_distinct` | All images must be in colour (no black-and-white), high quality (not blurred or pixelated) and each should show a different angle or feature; avoid several images of the same angle. | - | mandatory | GB/MY | [104] |
| `images_main.front_view` | One image is selected as the main image and it must show the front view of the product; additional images show other views, features and included accessories. | - | mandatory | GB/MY | [104] |
| `images_main.background` | The first image should have a white background (plain, solid-colour background at minimum). | - | recommended | all | [99] |
| `images_main.my_product_fill_percent` | Malaysia policy: in the main image the product must fill at least 60% of the frame and be shown in full (not cropped). | 60 percent | mandatory | MY | [108] |
| `images_main.no_text_logos_watermarks` | The first image must not contain text, logos, watermarks, borders, graphics covering the product, promotion stickers (e.g. "free shipping", "best sale"), collages or staging with multiple product variants, and must show the whole product prominently. | - | recommended | US | [101] |
| `images.uk_no_text_watermark_background` | UK policy: the product image background must not contain pixelated blocks, text or watermarks other than product branding or logos. | - | mandatory | GB | [104] |
| `images_main.local_language_only` | Outside the US the diagnosis recommends that the first image use the local language only. | - | recommended | GB/MY | [97] |
| `images.no_digital_renderings` | US: product images must be valid, not corrupted and not digital renderings; images must not be altered to hide part of the product. | - | recommended | US | [101] |
| `images_secondary.my_beauty_sequence` | Malaysia Academy suggestion for beauty: image 1 front view; image 2 ingredients selling point; image 3 benefit/effect comparison; image 4 target use; image 5 how to use; image 6 details such as specification and form. | - | recommended | MY; beauty | [112] |
| `video.max_count` | Up to one (1) video may be uploaded per product listing. | 1 videos | mandatory | GB/MY | [104] |
| `video.max_file_size_mb` | Uploaded product videos must not exceed 5 MB. | 5 MB | mandatory | GB/MY | [104] |
| `video.recommended_specs` | Recommended product video: aspect ratio 1:1, resolution HD 720p or higher, duration 20-60 seconds. | - | recommended | all | [99] |
| `seo.search_terms` | Search terms (not shown to consumers): a maximum of 15 terms and no more than 250 characters in total; they must be consistent with the product description. | 15 terms | mandatory | all | [99] |
| `seo.keywords` | Add the SEO keywords suggested by the platform (diagnosis item SEO_DIAGNOSTIC_ITEM; the API returns suggested seo_words). | - | recommended | GB/MY | [97] |
| `variants.one_product_one_listing` | A product detail page may contain only one product; each product may have only one listing (no duplicates); variations such as sizes, colours and flavours must be included within the one listing; unrelated products (e.g. different lipstick brands) may not share a listing. | - | mandatory | GB/MY | [104] |
| `variants.max_skus` | Maximum SKUs per product: 300 for BR, EU, JP, MX, UK and US; 100 for other regions. | 300 SKUs | mandatory | US/GB | [99] |
| `variants.uk_bundle_labels` | UK cosmetics sold as a bundle set: upload the label image for each product individually and clearly distinguish each item. | - | mandatory | GB; beauty | [105] |
| `language.my_supported` | Malaysia: title, description and text in product images must be written in at least one supported language - English, Bahasa Melayu or Chinese. | - | mandatory | MY | [109] |
| `language.uk_official` | UK: product details must be in one of the official languages of the destination market that is supported by TikTok Shop. | - | mandatory | GB | [104] |
| `approval.audit_and_qualification` | Products are audited before going live; products in invite-only or restricted categories stay unlisted until the seller is approved through the Qualification Center, and TikTok Shop may request further documents during review or after a product is live. | - | informational | US | [102] |
| `approval.uk_cosmetics_enforcement` | UK cosmetics: new listings may be rejected and existing products delisted if required compliance documents are missing, invalid, illegible or do not match the product; appeals can be filed within 180 days (72 hours encouraged). | 180 days | informational | GB; beauty | [105] |
| `restricted_claims.uk_medical_claims` | UK: listings (title, description, images, packaging, videos) must not state or imply that a product can cure, heal, treat or prevent diseases or medical conditions, alleviate symptoms, or affect bodily functions or structures; beauty products must not claim to treat or remove skin conditions (e.g. eczema, psoriasis) or to stop hair loss. | - | mandatory | GB; beauty | [106] |
| `restricted_claims.uk_before_after` | UK: before-and-after photos for cosmetics should reflect genuine average results, not be digitally altered, not show permanent or biological changes, include the disclaimer "Results may vary by individual", state the timeframe and reference supporting studies. | - | recommended | GB; beauty | [106] |
| `restricted_claims.us_skin_whitening` | US: products that aim to bleach, whiten, lighten or reduce overall melanin in the skin are strictly prohibited; products that enhance brightness, even skin tone or reduce dark spots are permitted. | - | mandatory | US; skin care | [103] |
| `restricted_claims.us_unverified_medical` | US: beauty and personal care products that claim medical applications not verified by the FDA, or that are not labelled correctly as both a cosmetic and a drug, are prohibited. | - | mandatory | US; beauty | [103] |
| `restricted_claims.my_used_or_repackaged` | Malaysia: used cosmetics and other used beauty products, and unlabelled or seller-repackaged consumer goods (including beauty/personal care products), are prohibited. | - | mandatory | MY; beauty | [111] |

**Enhanced content:** unknown. No separate enhanced-content (A+ style) programme or eligibility rule is documented in the Academy or Partner Center pages retrieved. Every seller's standard description is rich content: HTML up to 10,000 characters with up to 30 images, plus up to 5 Key Product Features shown in a "Product highlight" module, up to 9 gallery images and one video. [99]

**Official quality signals:**

- **Listing quality tier (Poor / Fair / Good)** - How well a product detail page meets TikTok Shop's listing-quality standards; United States only. Components: Title (no clickbait, no variant/stock references, no repetition, 25-255 characters), images (main image shows the whole product, white/plain background, no text/watermarks/borders/collages/promotion stickers, resolution above 600x600, 5 or more images), attributes (required attributes; at least one key attribute), description (valid, at least 80 characters and/or images) and category-specific information (for Beauty & Personal Care: product advantages or benefits). Access: api (API reference: https://partner.tiktokshop.com/docv2/page/listing-quality-diagnosis). Who: US sellers in Seller Center (Product Optimizer / listing quality view) and authorised Partner API apps with the Product Optimization scope.. Verification: official document. API: Search Products (v202312) can filter by listing quality tier, Get Product (v202309) returns the tier, and Get Product Diagnoses (v202405, GET /product/202405/products/diagnoses, up to 200 live product ids) returns listing_quality.current_tier and remaining_recommendations. A product reaches Good once all Fair and Good recommendations are addressed. [101]
- **Product diagnosis (Check Product Listing / Get Product Diagnoses / Product Optimizer)** - Field-level content issues and optimisation suggestions for a listing, in all regions. Components: Diagnosis codes per field - title, description, attributes, size chart, main images - with "how to solve" text, plus suggested SEO words and auto-generated title/description/image suggestions. Access: api (API reference: https://partner.tiktokshop.com/docv2/page/get-product-diagnoses-202405). Who: Sellers in Seller Center (Product Optimizer) and authorised Partner API apps (scope Product Optimization, seller.product.optimize).. Verification: official document. Outside the US there are no tiers, only recommendations (e.g. title at least 40 characters, description at least 500 characters, 5 or more images, local language in the first image). The API notes that these quality issues do not block listing; Check Product Listing (v202309) verifies hard listing requirements before publication. [98]

**Limitations:** Market coverage: only the United States, United Kingdom and Malaysia could be confirmed from live official seller sites; Saudi Arabia rests on a single API-documentation reference and no Saudi-specific content rules (including Arabic language rules) were found; no evidence of a UAE marketplace was found. Rules differ by market and by source type: Partner API limits are hard validations, Academy "policy" pages are enforceable rules, and listing-quality criteria are scored recommendations - the notes say which is which. The 5 MB video cap appears in the UK and Malaysia policy pages but not in the API reference, so it may be outdated. Malaysian pages were read in Bahasa Melayu and translated. No NPRA-notification rule for cosmetics was found in the Malaysian TikTok Shop pages opened (category qualification pages were not all read), and SKU-level GTIN rules were not established. Partner Center pages carry no publication dates. Review turnaround times are not published.

**Sources consulted for this retailer:** [97] [98] [99] [100] [101] [102] [103] [104] [105] [106] [107] [108] [109] [110] [111] [112] [113]

### 7. Nykaa

**Countries:** IN  
**Public documentation level:** none  
**How brands deliver content:** Not publicly documented and not verifiable in this session. Every Nykaa page tried - including the public "sell on Nykaa" landing page and seller.nykaa.com - refused automated access on 2026-11-26 (HTTP 403/503), so the onboarding route, the content template and any supplier portal could not be read. Unverified background (not retrieved today): Nykaa is understood to list beauty brands through brand/distributor onboarding handled by its category and catalogue teams rather than through an open self-service marketplace; treat this as a hypothesis to confirm with Nykaa or the brand's distributor.

**Languages:**

- IN: not documented - Not publicly documented (pages not retrievable). 

*No rules recorded - nothing could be verified from an official or quoting source (see limitations).*

**Enhanced content:** unknown. Not publicly documented.  

**Official quality signals:**

- No official score found. No official content or listing-quality score is documented in the public pages that could be retrieved.

**Limitations:** No Nykaa requirement could be verified: all official pages refused automated access and no reachable secondary source that quotes Nykaa's rules was identified. The rules array is therefore empty. Indian regulatory expectations for cosmetics (e.g. CDSCO import registration, BIS standards) are legal requirements, but no source retrieved today shows which of them Nykaa requires as listing data. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.

**Sources consulted for this retailer:** [114] [115]

### 8. Boots

**Countries:** GB  
**Public documentation level:** minimal  
**How brands deliver content:** First-party supplier model. Boots states that new "goods for resale" products are submitted through RangeMe, a third-party product-discovery platform used by Boots UK buyers. Existing suppliers work through the Boots supplier website (suppliers.boots-uk.com), which holds the Supplier Manual pages behind a login issued by the supplier's Boots contact. Product-content specifications (titles, images, copy, enhanced content) are not public, and no content-syndication partner could be confirmed from a page retrieved today. boots.com itself refused automated access on 2026-11-26, so any marketplace or seller pages there could not be checked.

**Languages:**

- GB: en - Not stated in the pages retrieved; the supplier pages and site are in English. [116]

| Rule | Requirement | Value | Level | Scope | Source |
|---|---|---|---|---|---|
| `approval.new_product_submission` | New product submissions for Boots (goods for resale) are made through RangeMe; Boots states it is under no obligation to review a submission. | - | informational | 1P vendors | [116] |
| `approval.supplier_manual_gated` | Working requirements for existing suppliers are set out in Supplier Manual pages on the Boots supplier website, accessible only with a login provided by the supplier's Boots contact. | - | informational | 1P vendors | [118] |

**Enhanced content:** unknown. Not publicly documented.  [116]

**Official quality signals:**

- No official score found. No official content or listing-quality score is documented in the public pages that could be retrieved.

**Limitations:** Only the supplier-onboarding route could be verified. Boots' content standards (title structure, image specifications, ingredient and claims rules, enhanced content, any content-partner requirement) sit behind the supplier portal login or on boots.com pages that refused automated access. Whether Boots runs a third-party marketplace on boots.com could not be verified today. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.

**Sources consulted for this retailer:** [116] [117] [118] [119]

### 9. Superdrug

**Countries:** GB  
**Public documentation level:** none  
**How brands deliver content:** Not publicly verifiable in this session: every superdrug.com page tried (including /marketplace and seller pages) refused automated access on 2026-11-26 (HTTP 403 "Access Denied"). Unverified background (not retrieved today): Superdrug is understood to operate both a first-party supplier model and a curated third-party marketplace; the onboarding route and content template for either could not be read.

**Languages:**

- GB: not documented - Not publicly documented (pages not retrievable). 

*No rules recorded - nothing could be verified from an official or quoting source (see limitations).*

**Enhanced content:** unknown. Not publicly documented.  

**Official quality signals:**

- No official score found. No official content or listing-quality score is documented in the public pages that could be retrieved.

**Limitations:** No Superdrug requirement could be verified; the rules array is empty. The official site blocks automated access and no reachable secondary source quoting Superdrug's content rules was identified. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.

**Sources consulted for this retailer:** [120]

### 10. Tesco

**Countries:** GB  
**Public documentation level:** minimal  
**How brands deliver content:** Two routes, both gated. (1) First-party suppliers: Tesco directs prospective UK suppliers to apply through RangeMe, and existing suppliers work through the Tesco Partners Toolkit (toolkit.tesco.com), a sign-in hub "for Suppliers, Marketplace Sellers and other Tesco partners". (2) Tesco Marketplace third-party sellers apply at toolkit.tesco.com/seller/apply-to-sell and then use the same toolkit (seller contact: the Tesco seller experience team). Product-content specifications are inside the toolkit and are not public. NIQ Brandbank shows the Tesco logo among its partners, which suggests a content-capture relationship, but no page retrieved today states that Tesco suppliers must deliver content through Brandbank.

**Languages:**

- GB: en - Not stated in the pages retrieved. [121]

| Rule | Requirement | Value | Level | Scope | Source |
|---|---|---|---|---|---|
| `approval.supplier_application` | Prospective UK product suppliers apply to Tesco through RangeMe; Republic of Ireland/Central Europe and clothing suppliers use the Tesco "Red Door" form. | - | informational | 1P vendors | [121] |
| `approval.marketplace_application` | Third-party sellers apply to sell on Tesco Marketplace through the Tesco Partners Toolkit application page; Tesco says it works with sellers who share its values on quality, trust and reliable customer service. | - | informational | marketplace sellers | [121] |
| `approval.toolkit_gated` | Tools and requirements for suppliers and marketplace sellers are held in the Tesco Partners Toolkit, which requires a partner sign-in (suppliers request access; marketplace sellers contact the seller experience team). | - | informational | all | [122] |

**Enhanced content:** unknown. Not publicly documented.  [122]

**Official quality signals:**

- No official score found. No official content or listing-quality score is documented in the public pages that could be retrieved.

**Limitations:** Tesco's product-content rules for both suppliers and Marketplace sellers are inside the login-gated Partners Toolkit; tesco.com pages refused automated access. Only the application routes were verified. The NIQ Brandbank link rests on a logo on a partner page, not on a stated requirement. No official content score was found. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.

**Sources consulted for this retailer:** [121] [122] [123] [124]

### 11. Target

**Countries:** US  
**Public documentation level:** partial  
**How brands deliver content:** Two routes. (1) Target Plus (third-party marketplace): invite-only; a brand applies, Target reviews within 30 days and approved sellers follow a structured 75-day onboarding. Sellers must integrate through an approved Channel Partner (listed partners include Acenda, Akeneo, Base.com, ChannelEngine, Feedonomics, Goflow, Mirakl Connect and Rithum) and use the Target Plus portal. (2) First-party vendors: item data and content are set up in Target's own vendor systems or syndicated through content partners - Syndigo (core content: marketing copy, feature bullets, images, video, item attributes; rich media / enhanced content; label information) and Salsify (direct connection announced with Target in 2020; enhanced content). Core content goes through Target's Data Review before publication. Target's own style guides and item-setup rules are in login-gated vendor systems and are not public.

**Languages:**

- US: en - Not stated as a content rule; Target Plus requires sellers to support English-speaking onboarding and support calls. [125]

| Rule | Requirement | Value | Level | Scope | Source |
|---|---|---|---|---|---|
| `identifiers.gs1_upc` | All Target Plus products must have GS1-certified UPCs. | - | mandatory | marketplace sellers | [125] |
| `attributes.brand_authorisation` | Target Plus sellers must be able to provide a Trademark Certificate (owners or manufacturers) or a Letter of Authorization (resellers). | - | mandatory | marketplace sellers | [125] |
| `attributes.compliance_registrations` | Target Plus sellers must register any ESN/Hazmat items with UL-WERCSmart (WERCS) and any necessary items with the third-party supplement provider Label Insights. | - | mandatory | marketplace sellers | [125] |
| `attributes.integration_channel_partner` | Target Plus sellers must be able to integrate via an approved Channel Partner. | - | mandatory | marketplace sellers | [125] |
| `attributes.label_information` | Legally mandated label data - ingredient lists, drug facts, fact panels, nutrition labels and allergen statements - is displayed under the "Drug Fact" or "Label Info" tabs of Target product pages and must be supplied in screen-readable format. | - | informational (secondary source) | beauty; 1P vendors | [128] |
| `approval.target_plus_onboarding` | Target Plus is invite-only: applications are reviewed within 30 days, onboarding follows a 75-day timeline, and a dedicated resource must resolve item-setup errors within 1 day. | 75 days | informational | marketplace sellers | [125] |
| `approval.data_review` | All core content (marketing copy, feature bullets, images, video, item attributes) is subject to Target's Data Review process before publication; enhanced content can be edited and republished without Target Data Review. | - | informational (secondary source) | 1P vendors | [128] |
| `variants.one_seller_per_sku` | On Target Plus each SKU has one dedicated seller. | - | informational | marketplace sellers | [126] |
| `attributes.size_chart_grid` | Size charts for wearable items must be provided in a grid (non-image) format. | - | mandatory | marketplace sellers | [125] |

**Enhanced content:** yes - Enhanced Content / Rich Media (delivered through content partners). Not stated by Target publicly. Syndigo and Salsify both offer it for Target.com product pages to their brand customers. Syndigo: rich media and interactive content on the product page (visual descriptions, interactive product tours); a separate solution from core content. Salsify: below-the-fold enhanced content built in its Enhanced Content Experience Builder. Target's own module specifications are not public. [128]

**Official quality signals:**

- **Target Content Score (as named by Syndigo; Salsify refers to the "Target scorecard")** - A Target measure of vendor content quality; Syndigo states that Enhanced Content "forms a large part of your Target Content Score". Components: Not publicly documented. Enhanced/rich content is the only component named. Access: seller portal only. Who: Target vendors (presumed to be shown in Target's vendor systems; not verified). Verification: secondary quote. Known only from content-partner pages; Target publishes no description, scale or access method. The access method is an assumption. [128]

**Limitations:** Target's item-setup and content style guides (title, bullets, image and video specifications, beauty attribute requirements) are in login-gated vendor systems and were not retrieved; nothing numeric about content could be verified. Verified facts are limited to Target Plus eligibility requirements and to what content partners Syndigo and Salsify publish. The "Target Content Score" is attested only by a partner page. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.

**Sources consulted for this retailer:** [125] [126] [127] [128] [129] [130]

### 12. Ulta Beauty

**Countries:** US  
**Public documentation level:** minimal  
**How brands deliver content:** Two routes. (1) Ulta Beauty Marketplace (third-party, curated): a brand applies; after approval and signing the Marketplace agreement it uploads products, prices and images with the help of Ulta's onboarding team, and Ulta reviews items before they go live on Ulta.com; the brand ships orders itself from US warehouses. (2) First-party brands: the vendor route and content template are not public (the Ulta supplier page returned an error page). Syndigo offers enhanced content for Ulta product pages ("Engaging Hero" and "In-Line" content) to its brand customers.

**Languages:**

- US: en - Not stated in the pages retrieved. [131]

| Rule | Requirement | Value | Level | Scope | Source |
|---|---|---|---|---|---|
| `identifiers.upc_required` | All Ulta Beauty Marketplace items, including bundles, must have a UPC. | - | mandatory | marketplace sellers | [131] |
| `approval.curated_and_reviewed` | Ulta Beauty Marketplace is not open to everyone: brands are selected, the proposed assortment is reviewed with the Marketplace team against Ulta Beauty product standards, and Ulta reviews items before they go live on Ulta.com. | - | informational | marketplace sellers | [131] |
| `approval.us_only` | Marketplace sellers must be US-registered businesses fulfilling from US-based warehouses and shipping within 2 business days. | - | informational | marketplace sellers | [131] |
| `variants.bundles_need_upc` | Bundles sold on Ulta Beauty Marketplace need their own UPC. | - | mandatory | marketplace sellers | [131] |

**Enhanced content:** yes - Enhanced Content & Rich Media (via Syndigo: "Engaging Hero" and "In-Line" content). Not stated by Ulta publicly; offered to brands through Syndigo. Syndigo lists 360-degree videos, comparison charts, lifestyle images and interactive content for Ulta product pages. Ulta's own module specifications are not public. [132]

**Official quality signals:**

- No official score found. No official content or listing-quality score is documented in the public pages that could be retrieved.

**Limitations:** Ulta publishes eligibility and logistics requirements for its Marketplace but no content specification (titles, images, ingredient or claims rules); those are handled with its onboarding team. The first-party vendor content route could not be verified. Enhanced content is attested by a content-partner page only. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.

**Sources consulted for this retailer:** [131] [132] [133]

### 13. Carrefour UAE (Majid Al Futtaim)

**Countries:** AE  
**Public documentation level:** none  
**How brands deliver content:** Not verifiable in this session: carrefouruae.com returned empty pages or gateway errors to every request and no Majid Al Futtaim marketplace seller documentation could be reached. Syndigo publishes Carrefour pages, but they do not mention the UAE or Majid Al Futtaim, so they are not treated as evidence for this market. The seller-onboarding route, content template and language rules (English/Arabic) therefore remain unconfirmed.

**Languages:**

- AE: not documented - Not publicly documented (pages not retrievable). 

*No rules recorded - nothing could be verified from an official or quoting source (see limitations).*

**Enhanced content:** unknown. Not publicly documented.  

**Official quality signals:**

- No official score found. No official content or listing-quality score is documented in the public pages that could be retrieved.

**Limitations:** No Carrefour UAE requirement could be verified; the rules array is empty. The official site could not be loaded and no reachable secondary source quoting its rules was identified. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.

**Sources consulted for this retailer:** [134] [135]

### 14. Nahdi (Al Nahdi Medical Company)

**Countries:** SA  
**Public documentation level:** none  
**How brands deliver content:** Not publicly documented. The Nahdi corporate site (nahdi.sa) was reachable but has no supplier page (the suppliers URL returns 404) and the Nahdi Online storefront shows no seller, supplier or marketplace links. How brands deliver content - presumably through Nahdi's commercial/category team or a local distributor - could not be confirmed from any page retrieved today.

**Languages:**

- SA: ar, en - Observation only: the storefront is served in Arabic and English (ar-sa / en-sa paths). No content-language rule for suppliers is published. [137]

*No rules recorded - nothing could be verified from an official or quoting source (see limitations).*

**Enhanced content:** unknown. Not publicly documented.  [137]

**Official quality signals:**

- No official score found. No official content or listing-quality score is documented in the public pages that could be retrieved.

**Limitations:** No Nahdi content requirement is published in the pages that could be reached; the rules array is empty. Saudi regulatory requirements (e.g. SFDA product listing for cosmetics) were not found stated as Nahdi listing requirements. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.

**Sources consulted for this retailer:** [136] [137]

### 15. Clicks

**Countries:** ZA  
**Public documentation level:** none  
**How brands deliver content:** Not verifiable in this session. The Clicks Group corporate site links suppliers to clicks.co.za/supplier-development, which refused automated access on 2026-11-26 (HTTP 403). No supplier portal documentation, content template or content-partner arrangement could be read.

**Languages:**

- ZA: not documented - Not publicly documented (pages not retrievable). [138]

*No rules recorded - nothing could be verified from an official or quoting source (see limitations).*

**Enhanced content:** unknown. Not publicly documented.  [138]

**Official quality signals:**

- No official score found. No official content or listing-quality score is documented in the public pages that could be retrieved.

**Limitations:** No Clicks requirement could be verified; the rules array is empty. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.

**Sources consulted for this retailer:** [138] [139]

### 16. Dis-Chem

**Countries:** ZA  
**Public documentation level:** minimal  
**How brands deliver content:** First-party supplier model. Dis-Chem's group site runs a "Supplier Information Portal" page asking prospective suppliers to email the marketing team with company and product details for evaluation by its buyers. No self-service listing tool, content template or content-partner route is published; listing content for dischem.co.za is presumably agreed with the buying/e-commerce team after acceptance (not confirmed). The customer site dischem.co.za refused automated access on 2026-11-26.

**Languages:**

- ZA: en - Not stated as a rule; the supplier page is in English. [140]

| Rule | Requirement | Value | Level | Scope | Source |
|---|---|---|---|---|---|
| `approval.supplier_enquiry` | Prospective suppliers submit an enquiry by email with company name and description, contact details, product name and function, proposal, similar products on the market and any other relevant files. | - | informational | 1P vendors | [140] |

**Enhanced content:** unknown. Not publicly documented.  [140]

**Official quality signals:**

- No official score found. No official content or listing-quality score is documented in the public pages that could be retrieved.

**Limitations:** Only the supplier-enquiry route is public. No content specification, regulatory data requirement or quality score for Dis-Chem listings was found. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.

**Sources consulted for this retailer:** [140] [141]

### 17. Watsons Malaysia

**Countries:** MY  
**Public documentation level:** none  
**How brands deliver content:** Not verifiable in this session: watsons.com.my and the A.S. Watson group site refused automated access on 2026-11-26 (HTTP 403 "Access Denied"). How brands deliver content (supplier portal, category team, distributor or any seller programme) could not be read.

**Languages:**

- MY: not documented - Not publicly documented (pages not retrievable). 

*No rules recorded - nothing could be verified from an official or quoting source (see limitations).*

**Enhanced content:** unknown. Not publicly documented.  

**Official quality signals:**

- No official score found. No official content or listing-quality score is documented in the public pages that could be retrieved.

**Limitations:** No Watsons Malaysia requirement could be verified; the rules array is empty. Malaysian cosmetics must by law be notified to the NPRA, but no source retrieved today shows how Watsons collects the notification number. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.

**Sources consulted for this retailer:** [142] [143]

### 18. Other marketplaces - brief notes (Amazon.co.za, Makro Marketplace, Konga, Kilimall)

**Countries:** ZA, NG, KE  
**Public documentation level:** partial  
**How brands deliver content:** Amazon.co.za: self-service Seller Central (South Africa) with public help pages; standard Amazon listing tools. Makro Marketplace (Massmart, South Africa): self-service seller portal at seller.makro.co.za - register, complete the profile, then list by "latching" onto an existing product or creating a single listing; the portal is served from Flipkart-hosted assets, and its listing rules are behind the login. Konga (Nigeria): self-service Seller HQ (shq.konga.com) with a public Seller Handbook. Kilimall (Kenya): seller centre at seller.kilimall.ke requires login; no public listing guidance was found.

**Languages:**

- ZA: en - Amazon.co.za help pages and the Makro seller portal are in English; no language rule was retrieved. [144]
- NG: en - Konga's handbook is in English; no language rule is stated. [147]
- KE: not documented - Kilimall: not publicly documented. [148]

| Rule | Requirement | Value | Level | Scope | Source |
|---|---|---|---|---|---|
| `amazon_za.title.max_length` | Amazon.co.za: product titles must not have more than 75 characters, including spaces, for all product types except media. | 75 characters | mandatory | ZA; marketplace sellers | [144] |
| `amazon_za.bullets.item_highlights_max_length` | Amazon.co.za: "item highlights" are used for additional descriptive features and have a limit of 125 characters, including spaces. | 125 characters | mandatory | ZA; marketplace sellers | [144] |
| `amazon_za.title.capitalisation` | Amazon.co.za: capitalise only the first letter of each word; no all-capitals; no emojis, emoticons or symbols at the beginning of words (titles, bullet points and descriptions). | - | mandatory | ZA; marketplace sellers | [144] |
| `amazon_za.description.no_html` | Amazon.co.za: no HTML, JavaScript or other code in product detail pages; line breaks (</br>) are allowed in the description. | - | mandatory | ZA; marketplace sellers | [144] |
| `amazon_za.restricted_claims.prohibited_content` | Amazon.co.za: titles, descriptions, bullet points and images may not contain obscene or offensive content, phone numbers, addresses, email addresses or URLs, availability/price/condition details, links to other sites, reviews or testimonials, requests for reviews, adverts, promotional material or watermarks, or time-sensitive information. | - | mandatory | ZA; marketplace sellers | [144] |
| `amazon_za.identifiers.gtin_authorised` | Amazon.co.za: only GTINs that the seller owns or is authorised to use may be listed; GTINs must be purchased directly from GS1 or used with the prefix owner's authorisation - unauthorised GTINs are blocked. | - | mandatory | ZA; marketplace sellers | [144] |
| `amazon_za.images.min_longest_side_px` | Amazon.co.za: images must be at least 500 pixels and at most 10,000 pixels on the longest side; 1,000+ pixels is recommended to enable zoom. | 500 pixels | mandatory | ZA; marketplace sellers | [145] |
| `amazon_za.images_main.background` | Amazon.co.za: the main image must have a pure white background (RGB 255, 255, 255), show the product as 85% of the image and in full, show it only once, and exclude packaging (unless an important feature), props and mannequins. | - | mandatory | ZA; marketplace sellers | [145] |
| `amazon_za.images.count` | Amazon.co.za: at least one compliant main image is required; at least six additional images and one video are recommended. | 1 images | mandatory | ZA; marketplace sellers | [145] |
| `amazon_za.images.no_text_badges` | Amazon.co.za: no image may show customer reviews, five-star imagery, claims (e.g. free shipping), seller-specific information, text or pricing details (swatch image only), Amazon logos or Amazon-style badges. | - | mandatory | ZA; marketplace sellers | [145] |
| `konga.images.min_dimension_px` | Konga: images should be of highest quality at 500 x 500 pixels or more, always with a white or clear background. | 500 pixels | recommended | NG; marketplace sellers | [147] |
| `konga.title.content` | Konga: an effective title uses descriptive keywords, includes the brand name and specifics such as size, colour or model number, and avoids profane or obscene language. | - | recommended | NG; marketplace sellers | [147] |
| `konga.description.min_words` | Konga: describe the item in at least 200 words, in your own unique wording rather than the manufacturer's description, with bold headers at font size 12 or 14 at most and unique identifiers (brand, manufacturer, ISBN, etc.). | 200 words | recommended | NG; marketplace sellers | [147] |
| `konga.approval.statuses` | Konga: product statuses in Seller HQ are live on site, under review, rejected, paused and sold out; more than two cases of inaccurate listing in a month lead to store suspension until listing training is attended. | - | informational | NG; marketplace sellers | [147] |
| `makro.approval.listing_route` | Makro Marketplace: sellers register, complete their profile, then list by latching onto an existing product or creating a single listing, and activate products to start selling. | - | informational | ZA; marketplace sellers | [146] |

**Enhanced content:** unknown. Not researched in depth for these marketplaces. Amazon's A+ Content for South Africa was not retrieved; Makro, Konga and Kilimall publish nothing on enhanced content.  [144]

**Official quality signals:**

- No official score found. No official content or listing-quality score is documented in the public pages that could be retrieved. Amazon Seller Central tools such as listing-quality dashboards were not researched for South Africa; Makro, Konga and Kilimall publish no score.

**Limitations:** Brief notes only, as requested. Amazon.co.za: two help pages were read (detail page rules, image guide); bullet-point, A+ content, video and category style-guide pages were not. The 75-character title rule is quoted from the South African help page as rendered on 2026-11-26. Makro Marketplace: only the public landing page is available; listing rules are behind the seller login. Konga: rules come from the 2024 Seller Handbook and are worded as advice. Kilimall: no public seller documentation was found. NAFDAC or KEBS listing requirements for Konga and Kilimall were not found. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.

**Sources consulted for this retailer:** [144] [145] [146] [147] [148]

## Official listing-quality signals by platform

| Platform | Official name | What it measures and components | Access | API reference | Verification | Source |
|---|---|---|---|---|---|---|
| Takealot | Listing quality score (API field "listing_quality"; "also known as the catalogue quality score") | Official description: "an indicator of how well the offer is listed on the Takealot platform, based on factors such as completeness of information, image quality, and other relevant criteria. A higher score indicates a better listing quality." Components: Not itemised officially. The API documentation gives only "completeness of information, image quality, and other relevant criteria" and says the score is "typically calculated by Takealot's internal algorithms". | api | https://marketplace-api.takealot.com/v1/docs | official document | [7] |
| Takealot | Listing Quality score shown in the Seller Portal (0-3) - as reported by a third party | Per-offer listing quality grade displayed on the offer detail page of the Seller Portal. Components: Reported as four factors - title, images, attributes, description - graded 0 (unacceptable) to 3 (excellent). | seller portal only | - | unverified | [9] |
| Jumia | Content Score | Jumia Global describes it as product content parameters "such as images, descriptions, and product names" meeting the platform's requirements; a good Content Score is listed as a way to improve the QC approval rate. Components: Not itemised in current documentation. | none | - | official document | [31] |
| Jumia | QC status (content Quality Check status and rejection reasons) | Whether a product creation/update passed Jumia content QC, and why it was rejected. Components: Status values NOT_READY_TO_QC, PENDING, APPROVED, REJECTED; rejectionReason and rejectionComment (up to 5 rejection reasons shown in the portal). | api | https://vendorcenter.jumia.com/api-docs/ | official document | [34] |
| Flipkart | Listing Quality Score (LQS) - name as used by third parties | Reported as a per-listing completeness and accuracy rating that Seller Hub shows against each listing, with "improve quality" prompts for low-scoring products. Components: Reported inputs: attribute completeness, images, title and description, and accuracy against the actual product. Flipkart does not publish the formula or weights. | seller portal only | - | unverified | [48] |
| Shopee | Listing quality level (shown through Product Optimiser / the Smart Diagnosis column; Open API name: content quality level) | How complete and high-quality a listing's content is. Levels: Excellent, Qualified, and (API) To Be Improved; the API also returns NONE for deleted or banned items. Components: New items (created within 90 days) - Qualified: title (min 10 characters, no excessive/irrelevant search terms, no exaggerated words, includes product type or brand), description (min 60 characters or 1 description image), images (category minimum count, complete product without white borders, clear, clean background, no watermark over the product); Excellent: a video. Items older than 90 days additionally: brand information, key attributes, at least 3 attributes, size chart, standardised variations, correct category. API issue types: TOO_FEW_IMAGES, WRONG_CATEGORY, TOO_FEW_ATTRIBUTES_FOR_QUALIFIED, LACK_OF_SIZE_CHART, LACK_OF_STANDARD_VARIATION, LACK_BRAND, TOO_SHORT_DESCRIPTION, TOO_SHORT_OR_TOO_LONG_NAME, WRONG_WEIGHT, LACK_OF_VIDEO, TOO_FEW_ATTRIBUTES_FOR_EXCELLENT. | api | https://open.shopee.com/documents/v2/v2.product.get_item_content_diagnosis_result?module=89&type=1 | official document | [70] |
| Lazada | Content Score | Official description: "a feature that guides you on how to maintain a high-standard of product information that will help you to improve your product's searchability and sales conversion, by providing indicators on your product's quality." Components: Content Completeness (mandatory attributes and key-property fill rate; description of at least 30 words and 1 image; at least 3 main images), Content Quality - Image Score (number and quality of images, promotional square/long images), Content Quality - Title Score (English, recommended length, capitalisation, relevant brands/keywords, no promotional messages, no emojis). | api | https://open.lazada.com/apps/doc/api?path=%2Fproduct%2Fcontent%2Fscore%2Fget | official document | [72] |
| Lazada | QC Alert / Violation (product quality control alerts) | Products flagged for policy or quality problems (e.g. brand mismatch, product-quality issues from ratings, returns and complaints) with a grace period and suggested action. Components: In Alert and Punished tabs with re-assessment dates; rejection reasons under the Violation tab. | seller portal only | - | official document | [87] |
| TikTok Shop | Listing quality tier (Poor / Fair / Good) | How well a product detail page meets TikTok Shop's listing-quality standards; United States only. Components: Title (no clickbait, no variant/stock references, no repetition, 25-255 characters), images (main image shows the whole product, white/plain background, no text/watermarks/borders/collages/promotion stickers, resolution above 600x600, 5 or more images), attributes (required attributes; at least one key attribute), description (valid, at least 80 characters and/or images) and category-specific information (for Beauty & Personal Care: product advantages or benefits). | api | https://partner.tiktokshop.com/docv2/page/listing-quality-diagnosis | official document | [101] |
| TikTok Shop | Product diagnosis (Check Product Listing / Get Product Diagnoses / Product Optimizer) | Field-level content issues and optimisation suggestions for a listing, in all regions. Components: Diagnosis codes per field - title, description, attributes, size chart, main images - with "how to solve" text, plus suggested SEO words and auto-generated title/description/image suggestions. | api | https://partner.tiktokshop.com/docv2/page/get-product-diagnoses-202405 | official document | [98] |
| Nykaa | No official score found | - | none | - | - |  |
| Boots | No official score found | - | none | - | - | [116] |
| Superdrug | No official score found | - | none | - | - |  |
| Tesco | No official score found | - | none | - | - | [122] |
| Target | Target Content Score (as named by Syndigo; Salsify refers to the "Target scorecard") | A Target measure of vendor content quality; Syndigo states that Enhanced Content "forms a large part of your Target Content Score". Components: Not publicly documented. Enhanced/rich content is the only component named. | seller portal only | - | secondary quote | [128] |
| Ulta Beauty | No official score found | - | none | - | - | [131] |
| Carrefour UAE (Majid Al Futtaim) | No official score found | - | none | - | - |  |
| Nahdi (Al Nahdi Medical Company) | No official score found | - | none | - | - | [137] |
| Clicks | No official score found | - | none | - | - | [138] |
| Dis-Chem | No official score found | - | none | - | - | [140] |
| Watsons Malaysia | No official score found | - | none | - | - |  |
| Other marketplaces - brief notes (Amazon.co.za, Makro Marketplace, Konga, Kilimall) | No official score found | - | none | - | - | [144] |

Reading the table: an **API** entry means the score or diagnostic can be pulled programmatically by an authorised seller application (Takealot, Shopee, Lazada, TikTok Shop; Jumia exposes only a pass/fail QC status). Flipkart's score and Target's content score are known only from third-party or partner descriptions and were not confirmed in an official seller-facing source.

## Enhanced content support by platform

| Platform | Supported | Official name | Eligibility | Modules / notes | Source |
|---|---|---|---|---|---|
| Takealot | unknown | - | Not publicly documented. No A+/enhanced-content programme is described in the catalogue rules, images guide or API documentation retrieved. | The standard product page fields are title, subtitle, Key Selling Features (plain text - no HTML or JavaScript), What's in the Box, attributes, images and one YouTube video link; fact sheets and PDFs are not accepted. | [1] |
| Jumia | unknown | - | Not publicly documented. No A+/enhanced-content programme, module list or eligibility rule appears on VendorHub NG/KE, Jumia Global VendorHub or in the Vendor API. | Product content is name, description, highlights, attributes, up to 8 images and an optional YouTube video. The Official Store programme (brand owner or authorised distributor) is a seller badge with performance standards, not a content format. | [19] |
| Flipkart | yes | Rich Product Description | Sold as part of the paid, voluntary Flipkart Premium Catalog Services. The brochure states it "is applicable across products which are feature rich and requires further explanation" and "is not applicable for accessories". Self-service eligibility (e.g. for approved brands) is not publicly documented. | The brochure shows a before/after product page with image-and-text feature blocks under the description; the brochure price is Rs 720. Related paid services in the same brochure: Catalog Enrichment, Style Note, Infographics Callout (Rs 150 for 4 callouts), Product 360 View, model/product photo shoots, 360 video shoots and AR/3D modelling. Module specifications (image sizes, text limits) are not published. | [44] |
| Shopee | yes | Images in the product description ("Add Images" in Product Description; Open API: extended description) | "Currently available for selected sellers" (Seller Education Hub, 2024-12-13). Selection criteria are not published. | Text description interleaved with up to 12 images (uploaded or built with the Image Creator templates); each image at least 1000 px x 32 px, aspect ratio 0.5-32, max 2 MB. No module library comparable to A+ content is documented. | [54] |
| Lazada | yes | Lorikeet | Available in Seller Center to sellers generally (Products > Add Products > Product Description); no eligibility restriction is stated. Advanced Mode components can be edited only on the web version of Seller Center. | Image components (single 1:1, dual 3:4, triple 1:1), Text & Image component with rich text, Free Design component with free text and image layers, pre-configured templates; content can be set in English and Bahasa Malaysia. Image pixel sizes and text limits per component are not published. | [81] |
| TikTok Shop | unknown | - | No separate enhanced-content (A+ style) programme or eligibility rule is documented in the Academy or Partner Center pages retrieved. | Every seller's standard description is rich content: HTML up to 10,000 characters with up to 30 images, plus up to 5 Key Product Features shown in a "Product highlight" module, up to 9 gallery images and one video. | [99] |
| Nykaa | unknown | - | Not publicly documented. | - |  |
| Boots | unknown | - | Not publicly documented. | - | [116] |
| Superdrug | unknown | - | Not publicly documented. | - |  |
| Tesco | unknown | - | Not publicly documented. | - | [122] |
| Target | yes | Enhanced Content / Rich Media (delivered through content partners) | Not stated by Target publicly. Syndigo and Salsify both offer it for Target.com product pages to their brand customers. | Syndigo: rich media and interactive content on the product page (visual descriptions, interactive product tours); a separate solution from core content. Salsify: below-the-fold enhanced content built in its Enhanced Content Experience Builder. Target's own module specifications are not public. | [128] |
| Ulta Beauty | yes | Enhanced Content & Rich Media (via Syndigo: "Engaging Hero" and "In-Line" content) | Not stated by Ulta publicly; offered to brands through Syndigo. | Syndigo lists 360-degree videos, comparison charts, lifestyle images and interactive content for Ulta product pages. Ulta's own module specifications are not public. | [132] |
| Carrefour UAE (Majid Al Futtaim) | unknown | - | Not publicly documented. | - |  |
| Nahdi (Al Nahdi Medical Company) | unknown | - | Not publicly documented. | - | [137] |
| Clicks | unknown | - | Not publicly documented. | - | [138] |
| Dis-Chem | unknown | - | Not publicly documented. | - | [140] |
| Watsons Malaysia | unknown | - | Not publicly documented. | - |  |
| Other marketplaces - brief notes (Amazon.co.za, Makro Marketplace, Konga, Kilimall) | unknown | - | Not researched in depth for these marketplaces. Amazon's A+ Content for South Africa was not retrieved; Makro, Konga and Kilimall publish nothing on enhanced content. | - | [144] |

"unknown" means no official statement either way was found; it is not evidence that the platform has no enhanced content.

## What could not be verified / is not public

**Sites that refused automated access or could not be loaded on 2026-11-26 (not read, not bypassed):**

- Takealot Seller Help Centre (help.takealot.com) - HTTP 403 bot protection; the same documents were read from Takealot's published Google Docs/Sheets.
- Flipkart Seller Hub Learning Center - behind seller login; only the public pre-login site, blog, brochures and API reference were read.
- Lazada University lessons (Content Score Guideline, Product Image & Quality Guideline, Product Title Quality Guideline) - redirect to Seller Center sign-up.
- Jumia legacy Content Score pages (guide.sellercenter.jumia.com, contentguidelines.jumia.com.ng / .co.ke, vendorhub.jumia.ug course) - unreachable or 404.
- Nykaa (nykaa.com, seller.nykaa.com) - HTTP 403 / 503.
- Boots customer site (boots.com) and supplier manual - bot-protection interstitial; supplier manual behind login.
- Superdrug (superdrug.com) - HTTP 403.
- Tesco customer site (tesco.com) and Tesco Partners Toolkit content - HTTP 403; toolkit behind partner sign-in.
- Target vendor systems and style guides - login-gated; not attempted.
- Ulta Beauty supplier page - error page.
- Carrefour UAE (carrefouruae.com) - empty responses / HTTP 502.
- Clicks supplier development page (clicks.co.za) - HTTP 403.
- Dis-Chem customer site (dischem.co.za) - bot-protection challenge.
- Watsons Malaysia and A.S. Watson Group sites - HTTP 403.
- Kilimall seller centre - login only; no public documentation.

**Open points by platform:**

- **Takealot:** The Seller Help Centre (help.takealot.com) blocks automated access (HTTP 403), so the rules were read from the official documents Takealot publishes through Google Docs/Sheets, which carry the same titles and version numbers as the help-centre articles; anything that exists only inside the help centre or the logged-in Seller Portal (loadsheet field limits per category, mandatory-attribute lists, "What's in the Box" mandatory categories, content review turnaround times) was not seen. Two linked documents are old (title guidelines 2019; excluded products 2022). No official source was found for enhanced/A+ content, for the scale and components of the listing-quality score, or for a catalogue review SLA. Takealot does not publish a cosmetic-ingredient-list requirement; the only ingredient rules found apply to medicine-type and food categories. Web search was unavailable for part of the session (shared search budget exhausted), so some secondary checks could not be repeated.
- **Jumia:** Public VendorHub pages for Nigeria and Kenya cover images, attributes, GTINs, variations, QC and policy, but they publish no character limits for product name, description or highlights - those are set per category in Vendor Center templates and the attribute-set API, which need a seller login. Several rules come from the Jumia Global VendorHub (cross-border sellers) and are flagged as such; they may not be enforced identically for local sellers. Kenya-specific regulatory fields (KEBS, Pharmacy and Poisons Board) are not named on Jumia Kenya pages - only the generic "mandatory field for the FDA registration number". The legacy Content Score pages (guide.sellercenter.jumia.com, contentguidelines.jumia.com.ng / .co.ke, a vendorhub.jumia.ug course) were unreachable or 404, and current documentation says the Content Score view is under development. The Seller Score (shipping speed, average product rating, quality return rate, cancellation rate) is a seller-level performance score, not a content score. No enhanced-content programme and no video specification were found.
- **Flipkart:** Flipkart keeps its listing rules (title and description limits, image dimensions and counts, mandatory attributes per vertical, brand-approval documents, QC rejection reasons, the listing-quality view) inside the logged-in Seller Hub and its Learning Center; the public site offers only general best-practice blogs, FAQs, the prohibited-items list and service brochures. Consequently almost every rule here is "recommended" and no numeric limit is recorded as mandatory. The only numeric image figures found are from a third-party integrator and are marked unverified. The Listing Quality Score is widely reported by third parties but could not be confirmed from an official seller-facing page. Regulatory fields (CDSCO import registration, BIS/IS 4707, manufacturing licence numbers) are referenced only as legal eligibility conditions, not as listing attributes. The Rich Product Description information comes from a 2023 brochure that is still linked from the live site. Web search was unavailable for most of the Flipkart research (shared search budget exhausted), which limited the discovery of further official documents.
- **Shopee:** Rules come from Shopee Malaysia's public Seller Education Hub and the Shopee Open Platform reference. The hard upload limits for Malaysia (maximum title and description length, minimum image count per category, GTIN rule per category) are not printed in the hub; they are served per shop by the get_item_limit API or shown in Seller Centre, so no maximum title length is recorded. Most content rules are published as best practice or as listing-quality criteria, hence "recommended". Two articles carry their rules inside images and were read from screenshots. A linked "listing optimisation best practices" Google document required a login and was not read. No expiry-date or shelf-life listing rule, no ingredient-list requirement for cosmetics and no Shopee Mall-specific content standard were found in the pages retrieved. Singapore, Indonesia and other Shopee markets were out of scope.
- **Lazada:** Lazada University lessons that hold the detailed content standards ("Content Score Guideline", "Product Image & Quality Guideline", "Product Title Quality Guideline") redirect to the Seller Center sign-up page, so main-image style rules (background, text overlays), the official Content Score bands/weights and category-specific title lengths could not be read; the rules here come from the public Seller Center Help Center and the Open Platform documentation. API limits (255-character name, 25,000-character description, 330-5000 px images, 3 MB) are system maximums and may be stricter in the Seller Center form for a given category. Most help articles carry an identical 2024-11-26 update stamp, so their true age is unclear (one is internally marked 2021). Video duration/format limits, GTIN rules and LazMall-specific content standards were not found. The Bahasa Melayu requirement stems from CPETTR 2024, whose enforcement Lazada reports as postponed.
- **TikTok Shop:** Market coverage: only the United States, United Kingdom and Malaysia could be confirmed from live official seller sites; Saudi Arabia rests on a single API-documentation reference and no Saudi-specific content rules (including Arabic language rules) were found; no evidence of a UAE marketplace was found. Rules differ by market and by source type: Partner API limits are hard validations, Academy "policy" pages are enforceable rules, and listing-quality criteria are scored recommendations - the notes say which is which. The 5 MB video cap appears in the UK and Malaysia policy pages but not in the API reference, so it may be outdated. Malaysian pages were read in Bahasa Melayu and translated. No NPRA-notification rule for cosmetics was found in the Malaysian TikTok Shop pages opened (category qualification pages were not all read), and SKU-level GTIN rules were not established. Partner Center pages carry no publication dates. Review turnaround times are not published.
- **Nykaa:** No Nykaa requirement could be verified: all official pages refused automated access and no reachable secondary source that quotes Nykaa's rules was identified. The rules array is therefore empty. Indian regulatory expectations for cosmetics (e.g. CDSCO import registration, BIS standards) are legal requirements, but no source retrieved today shows which of them Nykaa requires as listing data. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.
- **Boots:** Only the supplier-onboarding route could be verified. Boots' content standards (title structure, image specifications, ingredient and claims rules, enhanced content, any content-partner requirement) sit behind the supplier portal login or on boots.com pages that refused automated access. Whether Boots runs a third-party marketplace on boots.com could not be verified today. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.
- **Superdrug:** No Superdrug requirement could be verified; the rules array is empty. The official site blocks automated access and no reachable secondary source quoting Superdrug's content rules was identified. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.
- **Tesco:** Tesco's product-content rules for both suppliers and Marketplace sellers are inside the login-gated Partners Toolkit; tesco.com pages refused automated access. Only the application routes were verified. The NIQ Brandbank link rests on a logo on a partner page, not on a stated requirement. No official content score was found. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.
- **Target:** Target's item-setup and content style guides (title, bullets, image and video specifications, beauty attribute requirements) are in login-gated vendor systems and were not retrieved; nothing numeric about content could be verified. Verified facts are limited to Target Plus eligibility requirements and to what content partners Syndigo and Salsify publish. The "Target Content Score" is attested only by a partner page. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.
- **Ulta Beauty:** Ulta publishes eligibility and logistics requirements for its Marketplace but no content specification (titles, images, ingredient or claims rules); those are handled with its onboarding team. The first-party vendor content route could not be verified. Enhanced content is attested by a content-partner page only. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.
- **Carrefour UAE (Majid Al Futtaim):** No Carrefour UAE requirement could be verified; the rules array is empty. The official site could not be loaded and no reachable secondary source quoting its rules was identified. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.
- **Nahdi (Al Nahdi Medical Company):** No Nahdi content requirement is published in the pages that could be reached; the rules array is empty. Saudi regulatory requirements (e.g. SFDA product listing for cosmetics) were not found stated as Nahdi listing requirements. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.
- **Clicks:** No Clicks requirement could be verified; the rules array is empty. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.
- **Dis-Chem:** Only the supplier-enquiry route is public. No content specification, regulatory data requirement or quality score for Dis-Chem listings was found. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.
- **Watsons Malaysia:** No Watsons Malaysia requirement could be verified; the rules array is empty. Malaysian cosmetics must by law be notified to the NPRA, but no source retrieved today shows how Watsons collects the notification number. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.
- **Other marketplaces - brief notes (Amazon.co.za, Makro Marketplace, Konga, Kilimall):** Brief notes only, as requested. Amazon.co.za: two help pages were read (detail page rules, image guide); bullet-point, A+ content, video and category style-guide pages were not. The 75-character title rule is quoted from the South African help page as rendered on 2026-11-26. Makro Marketplace: only the public landing page is available; listing rules are behind the seller login. Konga: rules come from the 2024 Seller Handbook and are worded as advice. Kilimall: no public seller documentation was found. NAFDAC or KEBS listing requirements for Konga and Kilimall were not found. Web search was unavailable when this retailer was researched (shared search budget exhausted), so discovery relied on directly reachable official and content-partner pages.

**Cross-cutting uncertainties:**

- Hard character limits are published for Takealot (title 75, subtitle 110, description minimum 200), Lazada (API maximums) and TikTok Shop (API ranges); for Jumia, Shopee Malaysia and Flipkart the binding limits are category-specific and visible only in the seller tools or APIs.
- Regulatory identifiers are explicitly required as listing data only where shown: NAFDAC numbers (Jumia Nigeria), a "Product License" attribute with the NPRA/MDA number (Lazada Malaysia), NPRA notification for cosmetics (Shopee Malaysia), UK/EU cosmetic compliance documents (TikTok Shop UK). No source showed KEBS as a Jumia Kenya listing field, CDSCO/BIS as a Flipkart or Nykaa listing field, or SFDA as a Nahdi requirement.
- Listing-quality thresholds differ between a platform's seller guide and its API samples (Shopee) and between markets (TikTok Shop); thresholds should be read per market rather than hard-coded.
- Several official pages are old or undated (Takealot title guide 2019, Lazada help articles with a bulk 2024 timestamp, Flipkart catalogue brochure 2023); rules from them are flagged in the JSON notes.

## Sources

"n.d." = no publication or update date shown. Entries marked "not read" are pages that refused automated access or required a login; they are listed for transparency only.

1. Takealot. *Catalogue Product Information Rules & Requirements (2025 | Version 1.47)*. https://docs.google.com/document/d/e/2PACX-1vRepfABQ4NhZ4e1HnZwK5f-lPb6S-nQs9Ljo0XPw0xjE70aI26M3jJ7mwAcFFOBdkxBb7cz8Apca0uF/pub. Date: May 2025. Accessed 2026-11-26. Note: Official document published via Google Docs; same title and version string as Seller Help Centre article 25985928059548.
2. Takealot. *Quick Start Product Images Guide (2026 | Version 1.2)*. https://docs.google.com/document/d/e/2PACX-1vRPhUYyIlA-GH-XnXpXBrHn8IQD8tnBwyIckoXmhaq4U24isKb85KMObRwwjiibkgja77nO57pKRV0B/pub. Date: April 2026. Accessed 2026-11-26. Note: Linked from the Catalogue Product Information Rules & Requirements document.
3. Takealot. *Product Title Guidelines (2019 | Version 1.0)*. https://docs.google.com/document/d/e/2PACX-1vSiSrjuNGiy09LOVbf8Vw3Ul7EOZDqgQNywCRHQUIFWvo5JwIJJUhqCSzJ3d7XJUZreqBDOvMICryg5/pub. Date: August 2019. Accessed 2026-11-26. Note: Linked from the rules document as the "Product Titles Guide". Old (2019) but still the linked reference.
4. Takealot. *Excluded Products, Prohibited Content & Policy Violations (2021 | Version 1.3.12)*. https://docs.google.com/document/d/e/2PACX-1vQusQISj5V187ZE_7yfzC3UaT0jTCpMNpMPv52IKlPHFODpYG754wc-0fTn70ZeuUPM7El-lfRwORWr/pub. Date: September 2022. Accessed 2026-11-26. Note: Linked from the rules document.
5. Takealot. *Expiry Date Category (minimum shelf life per category)*. https://docs.google.com/spreadsheets/d/1Z0b1LrZnNW-Y-izfmiiKxuIyEO9X2Xfay7DJzfByP68/edit#gid=0. Date: n.d. Accessed 2026-11-26. Note: Google Sheet linked from the rules document; read via its public CSV export.
6. Takealot. *Global Category Tree Look-Up (minimum required images per category)*. https://docs.google.com/spreadsheets/d/1VEB7LNp2-kN2Qx9IZrmuJYrc0UCCkVtoiGXsEtSjorA/edit?gid=1477115144#gid=1477115144. Date: n.d. Accessed 2026-11-26. Note: Google Sheet linked from the rules document; read via its public CSV export.
7. Takealot. *Takealot Marketplace API (1.0.0) - API documentation*. https://marketplace-api.takealot.com/v1/docs. Date: n.d. Accessed 2026-11-26. Note: OpenAPI 3.1.1 document rendered with Redoc.
8. Takealot. *Takealot Seller API (Swagger 2.0 definition)*. https://seller-api.takealot.com/api-docs/swagger.json. Date: n.d. Accessed 2026-11-26. Note: Older Offers/Sales API; contains no listing-quality field.
9. Gadjet (third-party seller tool). *Takealot listing quality decoded: the 0-3 score, and why only your title actually moves search*. https://www.gadjet.ai/blog/takealot-listing-quality-score. Date: 2026-04-07 (updated 2026-10-20). Accessed 2026-11-26. Note: Secondary source; cites no Takealot documentation.
10. Takealot. *Catalogue Product Information Rules & Requirements (Seller Help Centre article, "2025 | Version 1.47")*. https://help.takealot.com/hc/en-us/articles/25985928059548-Catalogue-Product-Information-Rules-Requirements. Date: n.d. Access attempted 2026-11-26 (not read). Note: Returned HTTP 403 (bot protection) to automated access on 2026-11-26; not read directly.
11. Jumia Nigeria. *Product images - Jumia VendorHub NG*. https://vendorhub.jumia.com.ng/product-images/. Date: 2024-07-19. Accessed 2026-11-26.
12. Jumia Kenya. *Product images - Jumia VendorHub KE*. https://vendorhub.jumia.co.ke/product-images/. Date: 2024-07-19. Accessed 2026-11-26. Note: Text identical to the Nigeria page.
13. Jumia Nigeria. *Product attributes - Jumia VendorHub NG*. https://vendorhub.jumia.com.ng/product-attributes/. Date: 2024-07-19 (modified 2025-10-22). Accessed 2026-11-26.
14. Jumia Kenya. *Product attributes - Jumia VendorHub KE*. https://vendorhub.jumia.co.ke/product-attributes/. Date: 2024-07-19 (modified 2024-09-03). Accessed 2026-11-26. Note: Has no regulatory (NAFDAC/KEBS) section.
15. Jumia Nigeria. *GTIN barcodes - Jumia VendorHub NG*. https://vendorhub.jumia.com.ng/gtin-barcodes/. Date: 2024-07-19 (modified 2024-12-03). Accessed 2026-11-26.
16. Jumia Kenya. *GTIN barcodes - Jumia VendorHub KE*. https://vendorhub.jumia.co.ke/gtin-barcodes/. Date: 2024-07-19 (modified 2024-12-04). Accessed 2026-11-26.
17. Jumia Nigeria. *Product Variations - Jumia VendorHub NG*. https://vendorhub.jumia.com.ng/product-variations/. Date: 2024-07-19. Accessed 2026-11-26.
18. Jumia Kenya. *Product Variations - Jumia VendorHub KE*. https://vendorhub.jumia.co.ke/product-variations/. Date: 2024-07-19 (modified 2026-08-07). Accessed 2026-11-26.
19. Jumia Nigeria. *Product creation/update status - Jumia VendorHub NG*. https://vendorhub.jumia.com.ng/product-creation-update-status/. Date: 2024-07-19 (modified 2026-07-02). Accessed 2026-11-26.
20. Jumia Kenya. *Product creation/update status - Jumia VendorHub KE*. https://vendorhub.jumia.co.ke/product-creation-update-status/. Date: 2024-07-19. Accessed 2026-11-26.
21. Jumia Nigeria. *Prohibited and Restricted Products Policy - Jumia VendorHub NG*. https://vendorhub.jumia.com.ng/prohibited-products/. Date: 2024-06-30 (modified 2026-07-22). Accessed 2026-11-26.
22. Jumia Kenya. *Prohibited and Restricted products - Jumia VendorHub KE*. https://vendorhub.jumia.co.ke/prohibited-and-restricted-products/. Date: 2024-07-19 (modified 2026-08-21). Accessed 2026-11-26.
23. Jumia Kenya. *Keeping Your Catalog Healthy: 90-Day Cleanup for Unapproved Listings - Jumia VendorHub KE*. https://vendorhub.jumia.co.ke/keeping-your-catalog-healthy-90-day-cleanup-for-unapproved-listings/. Date: 2026-08-05. Accessed 2026-11-26.
24. Jumia Kenya. *Official Store Standards Framework: Eligibility, Performance & Compliance Requirements - Jumia VendorHub KE*. https://vendorhub.jumia.co.ke/official-store-standards-framework-eligibility-performance-compliance-requirements/. Date: 2026-07-28. Accessed 2026-11-26.
25. Jumia Nigeria. *What is Seller Score? - Jumia VendorHub NG*. https://vendorhub.jumia.com.ng/seller-score-2/. Date: 2024-07-01 (modified 2026-04-21). Accessed 2026-11-26.
26. Jumia Nigeria. *Quality Check - Jumia VendorHub NG*. https://vendorhub.jumia.com.ng/quality-check/. Date: 2024-06-30 (modified 2025-03-19). Accessed 2026-11-26.
27. Jumia Global. *Product Listing Guideline - Jumia Global VendorHub*. https://vendor.jumia.com/en/product-listing-guideline/. Date: 2026-03-24 (modified 2026-06-02). Accessed 2026-11-26. Note: Jumia Global = cross-border (international) sellers.
28. Jumia Global. *Product Image Guidelines - Jumia Global VendorHub*. https://vendor.jumia.com/en/product-image-guidelines/. Date: 2026-03-16 (modified 2026-11-05). Accessed 2026-11-26.
29. Jumia Global. *Content Quality Control (Content QC) - Jumia Global VendorHub*. https://vendor.jumia.com/en/content-quality-control-content-qc/. Date: 2026-03-20 (modified 2026-11-06). Accessed 2026-11-26.
30. Jumia Global. *Product Audit Timeliness/Results View - Jumia Global VendorHub*. https://vendor.jumia.com/en/product-audit-timeliness-results-view/. Date: 2026-04-15 (modified 2026-11-05). Accessed 2026-11-26.
31. Jumia Global. *FAQ about Product Management - Jumia Global VendorHub*. https://vendor.jumia.com/en/faq-about-product-management/. Date: 2026-05-08. Accessed 2026-11-26.
32. Jumia Global. *2026 JG FBJ Beauty Product Guidelines - Jumia Global VendorHub*. https://vendor.jumia.com/en/2026-jg-fbj-beauty-product-guidelines/. Date: 2026-03-23 (modified 2026-11-05). Accessed 2026-11-26. Note: Written for FBJ (Fulfilled by Jumia) cross-border sellers.
33. Jumia Global. *Product Restricted Keywords Rules - Jumia Global VendorHub*. https://vendor.jumia.com/en/product-restricted-wordingsproduct-restricted-wordings-rules-rules/. Date: 2026-03-16 (modified 2026-11-05). Accessed 2026-11-26.
34. Jumia. *VC - Global Product Management (GPM) & Global Order Processing (GOP) API (OpenAPI definition, version "latest")*. https://vendorcenter.jumia.com/api-docs/. Date: n.d. Accessed 2026-11-26. Note: Read from the OpenAPI YAML files behind the documentation page (catalog/products, catalog/attribute-sets/{id}, feeds/products/create).
35. Flipkart Seller Hub (seller blog). *How to List Products on Flipkart Seller Hub?*. https://seller.flipkart.com/seller-blog/how-to-list-products-on-flipkart. Date: 2026-06-29. Accessed 2026-11-26.
36. Flipkart Seller Hub (seller blog). *Product Listing Optimisation: A Guide to Selling Online on Flipkart*. https://seller.flipkart.com/seller-blog/product-listing-optimisation. Date: 2024-11-20. Accessed 2026-11-26.
37. Flipkart Seller Hub (seller blog). *Product catalogs: A Guide to their Significance and Necessity*. https://seller.flipkart.com/seller-blog/product-catalogs. Date: 2024-08-12. Accessed 2026-11-26.
38. Flipkart Seller Hub (seller blog). *Why are Product Videos for E-Commerce Needed?*. https://seller.flipkart.com/seller-blog/product-videos-for-ecommerce. Date: 2025-10-28. Accessed 2026-11-26.
39. Flipkart Seller Hub (seller blog). *A Complete Guide to Creating Product Variations*. https://seller.flipkart.com/seller-blog/product-variations. Date: 2025-10-27. Accessed 2026-11-26.
40. Flipkart Seller Hub. *FAQs - Flipkart Seller Hub*. https://seller.flipkart.com/faq. Date: n.d. Accessed 2026-11-26.
41. Flipkart Seller Hub. *Sell Online - Start Selling Online on Flipkart Seller Hub*. https://seller.flipkart.com/sell-online. Date: n.d. Accessed 2026-11-26.
42. Flipkart Seller Hub. *Sell Beauty Products Online - How to Sell Cosmetics Online*. https://seller.flipkart.com/sell-online/sell-beauty-products-online. Date: n.d. Accessed 2026-11-26.
43. Flipkart Seller Hub. *Grow your Business with Flipkart Tools & Services*. https://seller.flipkart.com/grow. Date: n.d. Accessed 2026-11-26.
44. Flipkart Seller Hub. *Flipkart Premium Catalog Services (brochure)*. https://static-assets-web.flixcart.com/fk-sp-static/prelogin/Premium-Catalog-Services-brochure.pdf. Date: 2023-06-07 (PDF creation date). Accessed 2026-11-26. Note: Image-only PDF linked from the "Download Catalogue Brochure" button on seller.flipkart.com/grow; read from rendered pages.
45. Flipkart. *List of Prohibited Items on Flipkart*. https://static-assets-web.flixcart.com/fk-p-fk-sellerhub/images/List%20of%20Prohibited%20Items%20on%20Flipkart_1787822289.pdf. Date: 2026-08-26 (PDF creation date). Accessed 2026-11-26.
46. Flipkart. *Listing Management API Reference For Flipkart Marketplace (Developer API v3.0)*. https://seller.flipkart.com/api-docs/listing-api-docs/LMAPIRef.html. Date: n.d. (copyright 2017). Accessed 2026-11-26.
47. Flipkart Commerce Cloud. *Flipkart Commerce Cloud - Search documentation (overview)*. https://docs.flipkartcommercecloud.com/docs/digital-commerce/SEO/docs/overview. Date: n.d. (copyright 2026). Accessed 2026-11-26. Note: Documents FCC Search, a B2B product built on the engine that powers Flipkart - not the Seller Hub.
48. Blooprint (third-party marketplace services firm). *What is Listing Quality Score? Flipkart LQS*. https://blooprint.in/glossary/listing-quality-score/. Date: n.d. ("as of September 2026"). Accessed 2026-11-26. Note: Secondary; cites no Flipkart document.
49. Fynd (third-party commerce platform / integrator). *FAQ - Flipkart (listings management)*. https://documentation.fynd.com/commerce/docs/openapi/listings-management/flipkart/faq-flipkart. Date: n.d. Accessed 2026-11-26. Note: Secondary; does not cite or quote a Flipkart policy document.
50. Shopee Malaysia (Seller Education Hub). *Product Listing Quality Guide*. https://seller.shopee.com.my/edu/article/27971. Date: 2026-07-22. Accessed 2026-11-26.
51. Shopee Malaysia (Seller Education Hub). *Improve Your Listing Quality with Product Optimiser*. https://seller.shopee.com.my/edu/article/27972. Date: 2026-07-22. Accessed 2026-11-26.
52. Shopee Malaysia (Seller Education Hub). *Best practices for improving your listings*. https://seller.shopee.com.my/edu/article/367. Date: 2024-08-09. Accessed 2026-11-26.
53. Shopee Malaysia (Seller Education Hub). *Giving your product a structured name*. https://seller.shopee.com.my/edu/article/2222. Date: 2020-08-13. Accessed 2026-11-26. Note: Name format and examples are shown as an image; read from a screenshot.
54. Shopee Malaysia (Seller Education Hub). *Creating informative product descriptions*. https://seller.shopee.com.my/edu/article/2224. Date: 2024-12-13. Accessed 2026-11-26.
55. Shopee Malaysia (Seller Education Hub). *Uploading good quality images*. https://seller.shopee.com.my/edu/article/370. Date: 2024-11-19. Accessed 2026-11-26. Note: Cover-image table is an image; read from a screenshot.
56. Shopee Malaysia (Seller Education Hub). *What are the benefits of uploading product images in 3:4 display ratio?*. https://seller.shopee.com.my/edu/article/17260. Date: 2025-11-27. Accessed 2026-11-26.
57. Shopee Malaysia (Seller Education Hub). *FAQs on listing products*. https://seller.shopee.com.my/edu/article/15863. Date: 2025-10-27. Accessed 2026-11-26.
58. Shopee Malaysia (Seller Education Hub). *Driving greater sales with product videos (course "Improving your listings", lesson 2)*. https://seller.shopee.com.my/edu/courseDetail/132?lessonId=960. Date: n.d. Accessed 2026-11-26.
59. Shopee Malaysia (Seller Education Hub). *Guideline on Marketplace Listing Practices - Improper Content Listing*. https://seller.shopee.com.my/edu/article/21364. Date: 2024-07-11. Accessed 2026-11-26.
60. Shopee Malaysia (Seller Education Hub). *Medical Device / Health Supplement / Drug / Cosmetic Product Listings*. https://seller.shopee.com.my/edu/article/7259. Date: 2025-02-14. Accessed 2026-11-26.
61. Shopee Malaysia (Seller Education Hub). *Listing Guidelines - Updated Packaging for FMCG Products*. https://seller.shopee.com.my/edu/article/27456. Date: 2026-04-24. Accessed 2026-11-26.
62. Shopee Malaysia (Seller Education Hub). *What is keyword spam?*. https://seller.shopee.com.my/edu/article/1559. Date: 2020-08-05. Accessed 2026-11-26.
63. Shopee Malaysia (Seller Education Hub). *Spam Listings*. https://seller.shopee.com.my/edu/article/28442. Date: 2026-10-06. Accessed 2026-11-26.
64. Shopee Malaysia (Seller Education Hub). *Implementation of Consumer Protection (Electronic Trade Transaction) Regulations 2024 (CPETTR 2024)*. https://seller.shopee.com.my/edu/article/25285. Date: 2025-06-19. Accessed 2026-11-26.
65. Shopee Malaysia (Seller Education Hub). *How can I use Shopee Standard Product to help my listings gain more exposure?*. https://seller.shopee.com.my/edu/article/26128. Date: 2026-06-24. Accessed 2026-11-26.
66. Shopee Malaysia (Seller Education Hub). *Using the Product Category Guide*. https://seller.shopee.com.my/edu/article/6807. Date: 2025-10-24. Accessed 2026-11-26.
67. Shopee Malaysia (Seller Education Hub). *Why is my listing delisted/banned/deleted by Shopee?*. https://seller.shopee.com.my/edu/article/16486. Date: 2025-10-27. Accessed 2026-11-26.
68. Shopee Malaysia (Seller Education Hub). *What are Item Card Safety Violations*. https://seller.shopee.com.my/edu/article/27371. Date: 2026-05-05. Accessed 2026-11-26.
69. Shopee Malaysia (Seller Education Hub). *What are the prohibited advertisements?*. https://seller.shopee.com.my/edu/article/1551. Date: 2024-01-18. Accessed 2026-11-26.
70. Shopee Open Platform. *v2.product.get_item_content_diagnosis_result - API reference*. https://open.shopee.com/documents/v2/v2.product.get_item_content_diagnosis_result?module=89&type=1. Date: 2024-08-14 (update log: new API). Accessed 2026-11-26.
71. Shopee Open Platform. *v2.product.get_item_limit - API reference*. https://open.shopee.com/documents/v2/v2.product.get_item_limit?module=89&type=1. Date: 2025-01-08 (latest update-log entry). Accessed 2026-11-26.
72. Lazada Malaysia (Seller Center Help Center). *What is Content Score?*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027788&questionId=1000148759. Date: 2024-11-26. Accessed 2026-11-26. Note: Many help articles show the same "Updated at 2024-11-26" stamp, which looks like a bulk migration date rather than the date the rule was written.
73. Lazada Malaysia (Seller Center Help Center). *Product Optimizer*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027788&questionId=1000148345. Date: 2024-11-26. Accessed 2026-11-26.
74. Lazada Malaysia (Seller Center Help Center). *What are the best practices for product content?*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027789&questionId=1000148529. Date: 2024-11-26. Accessed 2026-11-26.
75. Lazada Malaysia (Seller Center Help Center). *HTML Tips and Tricks: Text Formatting*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027788&questionId=1000148516. Date: 2024-11-26. Accessed 2026-11-26.
76. Lazada Malaysia (Seller Center Help Center). *Lazada Video Uploader*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027788&questionId=1000148530. Date: 2024-11-26. Accessed 2026-11-26.
77. Lazada Malaysia (Seller Center Help Center). *FAQ - Thumbnail Image Removal*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027788&questionId=1000148192. Date: 2024-11-26. Accessed 2026-11-26.
78. Lazada Malaysia (Seller Center Help Center). *Batch Image Management - Adding Long Images*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027789&questionId=1000148441. Date: 2024-11-26. Accessed 2026-11-26.
79. Lazada Malaysia (Seller Center Help Center). *Why are my SKUs not live and how do I fix them?*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027789&questionId=1000148560. Date: 2024-11-26. Accessed 2026-11-26.
80. Lazada Malaysia (Seller Center Help Center). *How to upload product in Seller Center?*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027789&questionId=1000148630. Date: 2024-11-26. Accessed 2026-11-26.
81. Lazada Malaysia (Seller Center Help Center). *Quickly Edit Product Content with Lorikeet*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027781&questionId=1000148600. Date: 2024-11-26. Accessed 2026-11-26.
82. Lazada Malaysia (Seller Center Help Center). *Seller-Defined Variation*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027817&questionId=1000148702. Date: 2024-11-26. Accessed 2026-11-26.
83. Lazada Malaysia (Seller Center Help Center). *Product Listing Policy for Pharmaceutical Products, Cosmetic Products and Medical Devices*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027816&questionId=1000148366. Date: 2024-11-26 (text marked "Updated on 26.11.2021"). Accessed 2026-11-26.
84. Lazada Malaysia (Seller Center Help Center). *Product Expiry Date Policy*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027816&questionId=1000159594. Date: 2026-09-30. Accessed 2026-11-26.
85. Lazada Malaysia (Seller Center Help Center). *Inappropriate and Misleading Content Policy*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027816&questionId=1000148601. Date: 2026-06-03. Accessed 2026-11-26.
86. Lazada Malaysia (Seller Center Help Center). *Health Governance Policy*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027816&questionId=1000148196. Date: 2024-11-26. Accessed 2026-11-26.
87. Lazada Malaysia (Seller Center Help Center). *Brand Attribute Accuracy Policy*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027816&questionId=1000148483. Date: 2026-03-18. Accessed 2026-11-26.
88. Lazada Malaysia (Seller Center Help Center). *Content and Catalog Policy*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027816&questionId=1000148454. Date: 2024-11-26. Accessed 2026-11-26.
89. Lazada Malaysia (Seller Center Help Center). *Medical Claims Listing Guide*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027817&questionId=1000148285. Date: 2026-01-20. Accessed 2026-11-26.
90. Lazada Malaysia (Seller Center Help Center). *CPETTR: Consumer Protection (Electronic Trade Transactions) Regulations 2024*. https://sellercenter.lazada.com.my/helpcenter/s/faq/knowledge?m_station=faq&categoryId=1000027814&questionId=1000156240. Date: 2025-06-21. Accessed 2026-11-26.
91. Lazada Open Platform. *GetProductContentScore (/product/content/score/get) - API reference*. https://open.lazada.com/apps/doc/api?path=%2Fproduct%2Fcontent%2Fscore%2Fget. Date: 2023-05-24. Accessed 2026-11-26.
92. Lazada Open Platform. *CreateProduct (/product/create) - API reference*. https://open.lazada.com/apps/doc/api?path=%2Fproduct%2Fcreate. Date: 2022-07-14. Accessed 2026-11-26.
93. Lazada Open Platform. *Create product - Developer's Guide (field descriptions)*. https://open.lazada.com/apps/doc/doc?nodeId=30720&docId=120949. Date: 2026-07-15. Accessed 2026-11-26.
94. Lazada Open Platform. *Image Upload - Developer's Guide*. https://open.lazada.com/apps/doc/doc?nodeId=30718&docId=120947. Date: 2024-07-19. Accessed 2026-11-26.
95. Lazada Open Platform. *Video Upload - Developer's Guide*. https://open.lazada.com/apps/doc/doc?nodeId=30719&docId=120948. Date: 2024-07-19. Accessed 2026-11-26.
96. Lazada University Malaysia. *Lazada University course catalogue (listing of the lessons "Content Score Guideline", "Product Image & Quality Guideline" and "Product Title Quality Guideline")*. https://university.lazada.com.my/course/search?orderByField=most_viewed&q=content%20score&tabType=all. Date: 2026-09-03 (lesson listing date). Accessed 2026-11-26. Note: Only the catalogue listing was read; the lesson pages themselves (course/learn?id=14732, 1730, 1726) redirect to the Seller Center sign-up page.
97. TikTok Shop Partner Center (developer documentation). *Listing quality diagnosis*. https://partner.tiktokshop.com/docv2/page/listing-quality-diagnosis. Date: n.d. Accessed 2026-11-26.
98. TikTok Shop Partner Center (developer documentation). *Get Product Diagnoses (API v202405)*. https://partner.tiktokshop.com/docv2/page/get-product-diagnoses-202405. Date: n.d. Accessed 2026-11-26.
99. TikTok Shop Partner Center (developer documentation). *Create Product (API v202309)*. https://partner.tiktokshop.com/docv2/page/create-product-202309. Date: n.d. Accessed 2026-11-26.
100. TikTok Shop Partner Center (developer documentation). *Get Category Rules (API v202309)*. https://partner.tiktokshop.com/docv2/page/get-category-rules-202309. Date: n.d. Accessed 2026-11-26.
101. TikTok Shop Academy (United States). *Product Detail Pages & Listing Quality Guidelines*. https://seller-us.tiktok.com/university/essay?from=feature_guide&identity=1&knowledge_id=481891871868714&role=1. Date: 2026-07-08. Accessed 2026-11-26.
102. TikTok Shop Academy (United States). *Restricted Products Policy*. https://seller-us.tiktok.com/university/essay?identity=1&role=1&knowledge_id=3238037484275457&from=policy. Date: 2026-11-18. Accessed 2026-11-26.
103. TikTok Shop Academy (United States). *Beauty and Personal Care Products Requirements*. https://seller-us.tiktok.com/university/essay?knowledge_id=1789325403522858. Date: 2026-09-01. Accessed 2026-11-26.
104. TikTok Shop Academy (United Kingdom). *Best Practices for Product Listings*. https://seller-uk.tiktok.com/university/essay?knowledge_id=7753820806006530. Date: 2025-11-17. Accessed 2026-11-26.
105. TikTok Shop Academy (United Kingdom). *Compliance guidance for listing cosmetic products*. https://seller-uk.tiktok.com/university/essay?knowledge_id=683428434462486. Date: 2026-09-15. Accessed 2026-11-26.
106. TikTok Shop Academy (United Kingdom). *Prohibited Product Claims*. https://seller-uk.tiktok.com/university/essay?knowledge_id=8727540182861590&identity=1&role=1&from=policy. Date: 2025-08-23. Accessed 2026-11-26.
107. TikTok Shop Academy (United Kingdom). *Guide to Managing Product Expirations*. https://seller-uk.tiktok.com/university/essay?identity=1&role=1&knowledge_id=943555435415329&from=policy. Date: 2026-11-26. Accessed 2026-11-26.
108. TikTok Shop Academy (Malaysia). *Tajuk, Penerangan, Imej & Video Produk (Product Title, Description, Images & Video)*. https://seller-my.tiktok.com/university/essay?knowledge_id=4138822087902977. Date: 2026-04-26. Accessed 2026-11-26. Note: Read in Bahasa Melayu; rules translated by the researcher.
109. TikTok Shop Academy (Malaysia). *Bahasa Yang Disokong Untuk Penyenaraian Produk (Supported Languages for Product Listings)*. https://seller-my.tiktok.com/university/essay?knowledge_id=7753771778098945. Date: 2025-07-01. Accessed 2026-11-26. Note: Read in Bahasa Melayu.
110. TikTok Shop Academy (Malaysia). *Keperluan Tambahan untuk Menyenaraikan Beberapa Produk (Additional Requirements for Listing Multiple Products)*. https://seller-my.tiktok.com/university/essay?knowledge_id=4190460743943952. Date: 2025-07-01. Accessed 2026-11-26. Note: Read in Bahasa Melayu.
111. TikTok Shop Academy (Malaysia). *Produk Terlarang dan Tidak Disokong (Prohibited and Unsupported Products)*. https://seller-my.tiktok.com/university/essay?knowledge_id=6295179427776272. Date: 2026-07-14. Accessed 2026-11-26. Note: Read in Bahasa Melayu.
112. TikTok Shop Academy (Malaysia). *1.3 Product Listing Guidelines - Garis Panduan Menambahbaikan Kualiti PDP (PDP Quality Improvement Guidelines, parts 1-4)*. https://seller-my.tiktok.com/university/course?identity=1&role=1&learning_id=2679884703647489&from=course&content_id=1938751483905794. Date: 2024-12-24. Accessed 2026-11-26. Note: Read in Bahasa Melayu.
113. TikTok Shop. *TikTok Shop seller portal - market selector*. https://seller.tiktok.com/. Date: n.d. Accessed 2026-11-26. Note: Selector lists: United States, Mexico, Brazil; Global Selling, Philippines, Singapore, Thailand, Vietnam, Indonesia, Malaysia, Japan; United Kingdom, Germany, France, Spain, Ireland, Italy, Poland, Netherlands, Belgium, Austria, Portugal, Greece, Czech Republic, Hungary.
114. Nykaa. *Sell on Nykaa (landing page)*. https://www.nykaa.com/sell-on-nykaa/lp. Date: n.d. Access attempted 2026-11-26 (not read). Note: HTTP 403 "Access Denied" via direct fetch and HTTP 503 via the fetch tool; not read.
115. Nykaa. *Nykaa seller portal*. https://seller.nykaa.com/. Date: n.d. Access attempted 2026-11-26 (not read). Note: HTTP 403 "Access Denied"; not read.
116. Boots UK (corporate site). *Goods for resale - How to become a Goods for Resale supplier to Boots*. https://www.boots-uk.com/suppliers/goods-for-resale/. Date: n.d. Accessed 2026-11-26.
117. Boots UK (corporate site). *Suppliers*. https://www.boots-uk.com/suppliers/. Date: n.d. Accessed 2026-11-26.
118. Boots UK. *Suppliers (existing supplier portal with Supplier Manual pages; login required)*. https://suppliers.boots-uk.com/. Date: n.d. Accessed 2026-11-26. Note: Only the public login page was read.
119. Boots. *boots.com (customer site)*. https://www.boots.com/marketplace. Date: n.d. Access attempted 2026-11-26 (not read). Note: Returned a bot-protection interstitial ("Pardon Our Interruption"); not read.
120. Superdrug. *Superdrug Marketplace page*. https://www.superdrug.com/marketplace. Date: n.d. Access attempted 2026-11-26 (not read). Note: HTTP 403 "Access Denied" via direct fetch and the fetch tool; not read.
121. Tesco PLC. *Suppliers & Sellers*. https://www.tescoplc.com/contacts/suppliers-sellers. Date: n.d. Accessed 2026-11-26.
122. Tesco. *Tesco Partners Toolkit - sign-in page*. https://toolkit.tesco.com/. Date: n.d. Accessed 2026-11-26. Note: Only the public sign-in page was read.
123. Tesco. *Sell on Tesco Marketplace - Apply to sell*. https://toolkit.tesco.com/seller/apply-to-sell. Date: n.d. Accessed 2026-11-26.
124. NIQ Brandbank. *NIQ Brandbank - Partner Network*. https://nielseniq.com/global/en/landing-page/brandbank-partner-network/. Date: n.d. Accessed 2026-11-26. Note: The Tesco logo appears as an image; no accompanying text about Tesco.
125. Target. *Target Plus - Get ready to sell on Target Plus (eligibility requirements)*. https://plus.target.com/how-it-works. Date: n.d. Accessed 2026-11-26.
126. Target. *Target Plus - Marketplace for Sellers*. https://plus.target.com/. Date: n.d. Accessed 2026-11-26.
127. Target. *Target Plus - Our partners (Channel Partners and services)*. https://plus.target.com/service-providers. Date: n.d. Accessed 2026-11-26.
128. Syndigo (content partner). *Syndigo: Publish Rich Product Content on Target.com*. https://syndigo.com/target/. Date: 2025-12-31 (modified 2026-04-23). Accessed 2026-11-26.
129. Salsify (content partner). *Sell on Target With Salsify*. https://www.salsify.com/retailers/target. Date: n.d. Accessed 2026-11-26.
130. Salsify (content partner). *Salsify and Target Announce New Direct Connection*. https://www.salsify.com/blog/salsify-target-direct-connection. Date: 2020-03-02 (modified 2022-01-19). Accessed 2026-11-26.
131. Ulta Beauty. *Ulta Beauty Marketplace*. https://www.ulta.com/company/marketplace. Date: n.d. Accessed 2026-11-26.
132. Syndigo (content partner). *Syndigo: ULTA Product Content - Elevate ULTA Product Pages with Engaging Content*. https://syndigo.com/ulta/. Date: 2025-12-30 (modified 2026-02-06). Accessed 2026-11-26.
133. Ulta Beauty. *Ulta Beauty supplier page*. https://www.ulta.com/company/supplier. Date: n.d. Access attempted 2026-11-26 (not read). Note: Returned an "Our Apologies" error page; not read.
134. Majid Al Futtaim - Carrefour UAE. *Carrefour UAE website (sell-with-us / marketplace pages)*. https://www.carrefouruae.com/mafuae/en/sell-with-us. Date: n.d. Access attempted 2026-11-26 (not read). Note: Empty response / HTTP 502 on 2026-11-26; not read.
135. Syndigo (content partner). *Syndigo: Maximize Sales at Carrefour with Enhanced Product Content*. https://syndigo.com/carrefour/. Date: n.d. Accessed 2026-11-26. Note: Does not mention the UAE or Majid Al Futtaim.
136. Al Nahdi Medical Company. *Nahdi Medical Company (corporate site)*. https://www.nahdi.sa/en. Date: n.d. Accessed 2026-11-26. Note: No supplier or vendor information found; /en/suppliers returns 404.
137. Al Nahdi Medical Company. *Nahdi Pharmacy online store (home page)*. https://www.nahdionline.com/en-sa. Date: n.d. Accessed 2026-11-26. Note: No seller/supplier links found.
138. Clicks Group. *Clicks Group (corporate site) - "Suppliers" link*. https://www.clicksgroup.co.za/. Date: n.d. Accessed 2026-11-26. Note: Only the home page and its link to the supplier page were read.
139. Clicks. *Clicks supplier development page*. https://clicks.co.za/supplier-development. Date: n.d. Access attempted 2026-11-26 (not read). Note: HTTP 403 via direct fetch and the fetch tool; not read.
140. Dis-Chem Pharmacies. *Suppliers - Dis-Chem group (Supplier Information Portal)*. https://dischemgroup.com/suppliers/. Date: 2022-11-17 (modified 2024-07-05). Accessed 2026-11-26.
141. Dis-Chem Pharmacies. *dischem.co.za (customer site)*. https://www.dischem.co.za/. Date: n.d. Access attempted 2026-11-26 (not read). Note: Bot-protection challenge (HTTP 403); not read.
142. Watsons Malaysia (A.S. Watson Group). *Watsons Malaysia website*. https://www.watsons.com.my/. Date: n.d. Access attempted 2026-11-26 (not read). Note: HTTP 403 "Access Denied"; not read.
143. A.S. Watson Group. *A.S. Watson Group website*. https://www.aswatson.com/. Date: n.d. Access attempted 2026-11-26 (not read). Note: HTTP 403 "Access Denied"; not read.
144. Amazon Seller Central South Africa. *Product detail page rules (applies to selling in: South Africa)*. https://sellercentral.amazon.co.za/help/hub/reference/external/G200390640. Date: n.d. Accessed 2026-11-26.
145. Amazon Seller Central South Africa. *Product image guide (applies to selling in: South Africa)*. https://sellercentral.amazon.co.za/help/hub/reference/external/G1881. Date: n.d. Accessed 2026-11-26.
146. Massmart (Makro). *Makro Marketplace - seller portal landing page*. https://seller.makro.co.za/. Date: n.d. (copyright 2024). Accessed 2026-11-26.
147. Konga. *Konga Seller Handbook (updated 2024)*. https://www-konga-com-res.cloudinary.com/image/upload/v1707226589/sellerhq/docs/Updated_Seller_Handbook_2024.pdf. Date: 2024-02-06 (PDF creation date). Accessed 2026-11-26. Note: Linked from shq.konga.com.
148. Kilimall. *Kilimall Seller Center (login page)*. https://seller.kilimall.ke/login. Date: n.d. Accessed 2026-11-26. Note: Login page only; no public documentation.
