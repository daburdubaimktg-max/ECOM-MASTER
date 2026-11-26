import { z } from 'zod';
import { DATA_ACCESS_METHODS, MARKETPLACE_TYPES, PLATFORM_CATEGORIES, REQUIREMENT_AREAS } from './schema';

/**
 * The shape of the research data files in /data/research. These are validated before loading so a
 * malformed file is rejected with a clear message instead of silently corrupting the reference database.
 */
const text = z.string().trim();
const optionalText = z
  .union([z.string(), z.number(), z.boolean()])
  .nullish()
  .transform((v) => (v === null || v === undefined ? null : String(v).trim() || null));

const levelHML = z.enum(['high', 'medium', 'low']);

/**
 * An array where one malformed item is dropped on its own instead of invalidating the whole list.
 * (The loader reports how many items were dropped, so nothing disappears silently.)
 */
function tolerantArray<T extends z.ZodType>(item: T) {
  return z
    .array(z.unknown())
    .catch([])
    .transform((items) =>
      items.flatMap((raw) => {
        const parsed = item.safeParse(raw);
        return parsed.success ? [parsed.data as z.output<T>] : [];
      }),
    );
}

const criterionScore = z.object({
  score: z.coerce.number().min(1).max(5),
  note: text.catch(''),
});

export const sourceSchema = z.object({
  url: text.min(1),
  title: optionalText,
  publisher: optionalText,
  published_date: optionalText,
  accessed_date: optionalText,
});

export const evidenceSchema = z.object({
  claim: text.min(1),
  metric_type: optionalText,
  value: optionalText,
  period: optionalText,
  nature: text.catch('third_party_estimate'),
  source_url: optionalText,
  source_name: optionalText,
  source_date: optionalText,
});

export const platformSchema = z.object({
  name: text.min(1),
  website: optionalText,
  operator: optionalText,
  status: z.enum(['active', 'winding_down', 'unclear']).catch('active'),
  platform_category: z.enum(PLATFORM_CATEGORIES).catch('other'),
  marketplace_type: z.enum(MARKETPLACE_TYPES).catch('first_party_retailer'),
  beauty_relevance: levelHML.nullish().catch(null),
  beauty_relevance_note: optionalText,
  pharmacy_relevance: z.enum(['high', 'medium', 'low', 'none']).nullish().catch(null),
  pharmacy_relevance_note: optionalText,
  estimated_market_importance: z.enum(['tier_1', 'tier_2', 'tier_3']).nullish().catch(null),
  market_importance_note: optionalText,
  consumer_reach_evidence: tolerantArray(evidenceSchema),
  competitor_presence: z
    .object({
      level: z.enum(['high', 'medium', 'low', 'unknown']).catch('unknown'),
      note: optionalText,
      source_urls: z.array(z.string()).catch([]),
    })
    .catch({ level: 'unknown', note: null, source_urls: [] }),
  product_coverage_note: optionalText,
  data_access_method: z.enum(DATA_ACCESS_METHODS).catch('unknown'),
  api_availability: z
    .object({
      public_seller_api: z.enum(['yes', 'no', 'unknown']).catch('unknown'),
      note: optionalText,
      docs_url: optionalText,
    })
    .catch({ public_seller_api: 'unknown', note: null, docs_url: null }),
  data_collection_feasibility: levelHML.nullish().catch(null),
  data_collection_feasibility_note: optionalText,
  priority_scores: z.object({
    ecommerce_significance: criterionScore,
    beauty_category_relevance: criterionScore,
    consumer_reach: criterionScore,
    brand_competitor_coverage: criterionScore,
    data_integration_feasibility: criterionScore,
  }),
  weighted_score: z.coerce.number().nullish(),
  priority_rank: z.coerce.number().nullish(),
  is_top3: z.boolean().nullish(),
  priority_rationale: optionalText,
  confidence: levelHML.catch('low'),
  confidence_note: optionalText,
  sources: tolerantArray(sourceSchema),
  last_research_date: optionalText,
});
export type ResearchPlatform = z.infer<typeof platformSchema>;

export const countryFileSchema = z.object({
  country_code: z.string().trim().length(2).toUpperCase(),
  country_name: text.min(1),
  region: text.min(1),
  research_date: text.regex(/^\d{4}-\d{2}-\d{2}$/),
  market_context: z.object({
    summary: text.min(1),
    key_facts: z
      .array(
        z.object({
          fact: text,
          nature: text.catch('third_party_estimate'),
          source_url: text.catch(''),
          source_name: text.catch(''),
          source_date: text.catch(''),
        }),
      )
      .catch([]),
  }),
  ranking_method_note: optionalText,
  platforms: tolerantArray(platformSchema).refine((list) => list.length > 0, 'no valid platforms'),
});
export type CountryResearchFile = z.infer<typeof countryFileSchema>;

export const requirementRuleSchema = z.object({
  id: text.min(1),
  area: z.enum(REQUIREMENT_AREAS),
  requirement: text.min(1),
  rule_type: text.catch('other'),
  value: z
    .union([z.number(), z.string()])
    .nullish()
    .transform((v) => {
      if (v === null || v === undefined || v === '') return null;
      const n = typeof v === 'number' ? v : Number(v);
      return Number.isFinite(n) ? n : null;
    }),
  unit: optionalText,
  severity: z.enum(['mandatory', 'recommended', 'informational']).catch('informational'),
  applies_to_country_codes: z.array(z.string()).catch([]),
  applies_to_category: optionalText,
  seller_type: optionalText,
  effective_date: optionalText,
  source_url: optionalText,
  source_title: optionalText,
  source_date: optionalText,
  verification: z.enum(['official_document', 'secondary_quote', 'unverified']).catch('unverified'),
  notes: optionalText,
});

export const qualitySignalSchema = z.object({
  official_name: text.min(1),
  what_it_measures: optionalText,
  components: z
    .union([z.string(), z.array(z.string())])
    .nullish()
    .transform((v) => (Array.isArray(v) ? v.join('; ') : v ? String(v) : null)),
  access_method: optionalText,
  api_reference_url: optionalText,
  who_can_access: optionalText,
  source_url: optionalText,
  verification: optionalText,
  notes: optionalText,
});

export const requirementFileSchema = z.object({
  marketplace: text.min(1),
  research_date: text.regex(/^\d{4}-\d{2}-\d{2}$/),
  applies_to_country_codes: z.array(z.string()).catch([]),
  category_scope: optionalText,
  public_documentation_level: optionalText,
  how_brands_deliver_content: optionalText,
  languages: z
    .array(
      z.object({
        country_code: z.string(),
        languages: z.array(z.string()).catch([]),
        note: z.string().optional().catch(undefined),
        source_url: z.string().optional().catch(undefined),
      }),
    )
    .catch([]),
  rules: tolerantArray(requirementRuleSchema),
  enhanced_content: z.record(z.string(), z.unknown()).nullish().catch(null),
  official_quality_signals: tolerantArray(qualitySignalSchema),
  non_official_terms_to_avoid: z
    .array(z.object({ term: text, what_it_actually_is: text.catch(''), source_url: z.string().optional().catch(undefined) }))
    .catch([]),
  limitations: optionalText,
});
export type RequirementFile = z.infer<typeof requirementFileSchema>;
