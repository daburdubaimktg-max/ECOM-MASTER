/** Plain-English labels for stored codes. */

export const PLATFORM_CATEGORY_LABELS: Record<string, string> = {
  general_marketplace: 'General marketplace',
  cross_border_marketplace: 'Cross-border marketplace',
  beauty_specialist: 'Beauty specialist',
  pharmacy_health: 'Pharmacy & health',
  grocery_supermarket: 'Grocery & supermarket',
  quick_commerce: 'Quick commerce',
  department_store_fashion: 'Department store & fashion',
  social_commerce: 'Social commerce',
  d2c_brand_site: 'Brand-owned site (D2C)',
  other: 'Other',
};

export const MARKETPLACE_TYPE_LABELS: Record<string, string> = {
  third_party_marketplace: 'Third-party marketplace',
  first_party_retailer: 'Retailer (buys and resells)',
  hybrid_1p_3p: 'Hybrid: retailer + marketplace',
  delivery_aggregator: 'Delivery app',
  social_commerce: 'Social commerce',
  d2c_brand_site: 'Brand-owned site',
};

export const DATA_ACCESS_LABELS: Record<string, string> = {
  official_api: 'Official API',
  seller_portal_export: 'Seller-portal exports',
  third_party_data_provider: 'Third-party data provider',
  public_web_pages: 'Public web pages',
  manual_only: 'Manual only',
  unknown: 'Unknown',
};

export const IMPORTANCE_LABELS: Record<string, string> = {
  tier_1: 'Tier 1 — market-shaping',
  tier_2: 'Tier 2 — significant',
  tier_3: 'Tier 3 — niche or emerging',
};

export const EVIDENCE_NATURE: Record<string, { label: string; dataClass: 'verified' | 'estimated' }> = {
  official_statistic: { label: 'Official statistic', dataClass: 'verified' },
  company_reported: { label: 'Company-reported', dataClass: 'estimated' },
  third_party_estimate: { label: 'Third-party estimate', dataClass: 'estimated' },
  analyst_estimate: { label: 'Analyst estimate', dataClass: 'estimated' },
};

export const REQUIREMENT_AREA_LABELS: Record<string, string> = {
  title: 'Product title',
  description: 'Description',
  bullets: 'Bullet points',
  attributes: 'Attributes',
  identifiers: 'Barcodes & identifiers',
  images_main: 'Main image',
  images_secondary: 'Secondary images',
  video: 'Video',
  enhanced_content: 'Enhanced content',
  seo: 'Search & keywords',
  variants: 'Variants & bundles',
  language: 'Language',
  approval: 'Approval process',
  restricted_claims: 'Restricted claims',
};

export const VERIFICATION_LABELS: Record<string, { label: string; tone: 'verified' | 'estimated' | 'missing' }> = {
  official_document: { label: 'Official document', tone: 'verified' },
  secondary_quote: { label: 'Quoted by a secondary source', tone: 'estimated' },
  unverified: { label: 'Unverified', tone: 'missing' },
};

export const SOURCE_TYPE_LABELS: Record<string, string> = {
  asset: 'Document',
  brand_profile: 'Brand profile',
  guideline: 'Guideline',
  claim: 'Claim',
  product: 'Product record',
};

export const ASSET_KIND_LABELS: Record<string, string> = {
  brand_book: 'Brand book',
  guideline_document: 'Guideline document',
  product_catalogue: 'Product catalogue',
  packaging: 'Packaging file',
  creative_brief: 'Creative brief',
  regulatory: 'Regulatory document',
  product_image: 'Product image',
  lifestyle_image: 'Lifestyle image',
  video: 'Video',
  other: 'Other',
};

export const GUIDELINE_SECTION_LABELS: Record<string, string> = {
  identity: 'Identity',
  positioning: 'Positioning',
  personality: 'Personality',
  tone_of_voice: 'Tone of voice',
  target_audience: 'Target audience',
  visual: 'Visual',
  approved_communication: 'Approved communication',
  dos_and_donts: "Do's and don'ts",
  language_and_localisation: 'Language & localisation',
  other: 'Other',
};

export const CLAIM_TYPE_LABELS: Record<string, string> = {
  benefit: 'Benefit',
  ingredient: 'Ingredient',
  efficacy: 'Efficacy',
  sensory: 'Sensory',
  comparative: 'Comparative',
  sustainability: 'Sustainability',
  regulatory: 'Regulatory',
  other: 'Other',
};

export function label(map: Record<string, string>, key: string | null | undefined, fallback = '—'): string {
  if (!key) return fallback;
  return map[key] ?? key.replace(/_/g, ' ');
}
