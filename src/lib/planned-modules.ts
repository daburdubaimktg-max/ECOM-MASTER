/**
 * Honest descriptions of modules that are designed but not built yet.
 * Each page states what the module will do, what already exists underneath it, and what it needs
 * before work can start. Nothing here is presented as working functionality.
 */
export type PlannedModule = {
  key: string;
  title: string;
  eyebrow: string;
  stage: number;
  summary: string;
  willDo: string[];
  inPlace: string[];
  needs: string[];
};

export const PLANNED_MODULES: Record<string, PlannedModule> = {
  'digital-shelf': {
    key: 'digital-shelf',
    title: 'Digital Shelf',
    eyebrow: 'Market',
    stage: 3,
    summary:
      'Watches how your products — and your competitors’ — actually appear on each retailer: content, images, price, promotions and availability, with a dated snapshot of every observation so changes can be traced over time.',
    willDo: [
      'Map each SKU to its listing on every tracked retailer, using the barcode first and a confidence-scored match otherwise. Uncertain matches wait for a person to confirm them.',
      'Collect listing data on a schedule through the best available legitimate route for each retailer: official API, authorised data provider, or spreadsheet upload.',
      'Store every observation unchanged, alongside a normalised copy, and detect changes in titles, images, price, promotions and availability.',
      'Keep “we could not observe it” separate from “it is unavailable”, so a failed collection is never shown as an out-of-stock.',
    ],
    inPlace: [
      'Database tables for listings, snapshots, prices, availability, images and SKU matching.',
      'The marketplace database with data-access research for each platform.',
      'The background job queue that scheduled collection will run on.',
    ],
    needs: [
      'Your decision on which marketplaces to track first (set this on each platform’s page).',
      'How each brand is sold on those marketplaces — own seller account, vendor, or distributor — because that decides which official data routes are open.',
      'Barcodes on your SKUs, so listings can be matched reliably.',
    ],
  },
  'listing-quality': {
    key: 'listing-quality',
    title: 'Listing Quality',
    eyebrow: 'Market',
    stage: 4,
    summary:
      'Scores every listing three separate ways and never mixes them: the retailer’s own official score where one truly exists, an internal 0–100 score with a full explanation, and a competitive score against rival listings.',
    willDo: [
      'Import official quality scores only where a retailer really publishes one and you have authorised access. Where none exists the page says so; a score is never made up.',
      'Calculate an internal Listing Quality Score from stored listing data and versioned rules, showing for every component the weight, what was found, what is missing, why points were deducted and what to do.',
      'Make every score reproducible: the same stored inputs and the same rule version always give the same result.',
      'Re-check affected listings automatically when a retailer’s requirements change.',
    ],
    inPlace: [
      'The versioned requirements library with each retailer’s documented rules.',
      'Versioned scoring configuration (the proposed weights are shown below).',
      'Database tables for official scores, internal scores and their component breakdowns.',
    ],
    needs: ['Listing data from the Digital Shelf module (Stage 3).', 'Your review of the proposed weights for your categories.'],
  },
  reviews: {
    key: 'reviews',
    title: 'Reviews & Ratings',
    eyebrow: 'Market',
    stage: 4,
    summary:
      'Turns ratings, reviews and customer questions into themes you can act on — what people praise, what they complain about, and what they keep asking — for your products and your competitors’.',
    willDo: [
      'Track average rating and review volume over time where the retailer or data route provides them. Where they are not available the page says “unavailable through the current integration” — never zero.',
      'Classify reviews as positive, neutral, negative or mixed and group them into configurable themes, with AI assessments always labelled as such.',
      'Separate complaints about the product from complaints about the seller or delivery.',
      'Draft answers to customer questions from approved product information only, for a person to approve before anything is posted.',
    ],
    inPlace: [
      'Database tables for rating history, reviews, themes and questions. Reviewer names are never stored — only an anonymous fingerprint for de-duplication.',
      'A starting set of review themes for beauty and personal care (shown below).',
      'The approved-claims register that suggested answers will be grounded in.',
    ],
    needs: ['A decision on the review data route per marketplace (see the API and data feasibility report).', 'Your review of the theme list.'],
  },
  competitors: {
    key: 'competitors',
    title: 'Competitor Intelligence',
    eyebrow: 'Market',
    stage: 4,
    summary: 'Tracks competing products side by side with yours: price, promotions, ratings, content, imagery and claims, and produces a weekly summary of what changed.',
    willDo: [
      'Follow named competitor products on the same retailers and compare them like-for-like with your own listings.',
      'Flag price moves, new products, content improvements and review advantages.',
      'Show where a competitor’s content is stronger and what you could do about it.',
    ],
    inPlace: ['Competitor brands recorded against each of your brands.', 'Database tables for competitor products and their listings, prices and ratings.'],
    needs: ['Competitor brands entered on each brand’s Competitors tab.', 'Listing data from the Digital Shelf module (Stage 3).'],
  },
  'content-studio': {
    key: 'content-studio',
    title: 'Content Studio',
    eyebrow: 'Action',
    stage: 5,
    summary:
      'Writes marketplace-ready product content — titles, bullets, descriptions, keywords, FAQs, image and enhanced-content briefs — from your approved brand knowledge, checks it against each retailer’s rules, and routes it for approval.',
    willDo: [
      'Use only approved claims valid for the target market, follow the brand’s tone of voice, and flag missing information instead of inventing it.',
      'Cite the knowledge-base passages each piece of content was built from.',
      'Validate every draft against the retailer’s requirement library and show original and proposed content side by side.',
      'Keep every version — original, AI-generated, edited, approved — with who approved it and when. Nothing is ever published automatically.',
    ],
    inPlace: [
      'The brand knowledge base with approved, unverified and restricted labels on every passage.',
      'The requirements library to validate against.',
      'Database tables for content versions and approvals.',
      'An organisation-level switch that keeps brand content away from external AI services until an Administrator allows it.',
    ],
    needs: [
      'An AI provider account and API key, configured securely on the server.',
      'An Administrator’s decision to allow brand content to be processed by that provider.',
      'Approved claims and an approved brand book for each brand.',
    ],
  },
  recommendations: {
    key: 'recommendations',
    title: 'Recommendations',
    eyebrow: 'Action',
    stage: 5,
    summary: 'Converts what the engine observes into a prioritised to-do list: what is wrong, where, how sure we are, what to do and who should do it.',
    willDo: [
      'Raise recommendations from rules (for example a main image below the retailer’s minimum size) and from analysis (for example a complaint theme growing for four weeks).',
      'Give each one a severity, evidence, confidence, suggested action, effort estimate and owner, ranked with a transparent priority formula.',
      'Label any expected benefit as an estimate — never as a verified financial result.',
      'Turn accepted recommendations into assigned tasks and track them to completion.',
    ],
    inPlace: ['Database tables for recommendations and tasks.', 'Roles and permissions for assigning and approving work.'],
    needs: ['Listing, score and review data from Stages 3–4.'],
  },
  reports: {
    key: 'reports',
    title: 'Reports',
    eyebrow: 'Action',
    stage: 5,
    summary: 'A weekly intelligence report — executive summary, marketplaces, listing quality, customers, competitors and recommended actions — plus exports to PDF, Excel and CSV.',
    willDo: [
      'Compare each week with previous observations, like for like: same marketplace, product, country and collection method.',
      'Show the data collection dates and sources on every report.',
      'State plainly when no new data was collected in the period.',
    ],
    inPlace: ['Database table for generated reports.', 'The audit log, available now under Settings.'],
    needs: ['Collected data from Stages 3–4.', 'An email service, if reports should be emailed.'],
  },
  automation: {
    key: 'automation',
    title: 'Automation',
    eyebrow: 'System',
    stage: 5,
    summary: 'Runs the recurring work without anyone opening a retailer website: scheduled collection, change detection, scoring, review analysis and the weekly report.',
    willDo: [
      'Run every workflow on a schedule or on demand, with retries, rate limits, duplicate detection, validation and failure alerts.',
      'Log every run so you can see what was collected, what failed and why.',
      'Let you set different frequencies per marketplace or brand.',
    ],
    inPlace: [
      'A background job queue with retries — already used to read uploaded documents (live status below).',
      'A secured heartbeat endpoint that a scheduler calls to drive recurring work.',
      'Database tables for workflows, collection runs and their logs.',
    ],
    needs: ['A scheduler pointed at the heartbeat endpoint (your hosting platform’s cron, or n8n).', 'Data source decisions from Stage 3.'],
  },
};
