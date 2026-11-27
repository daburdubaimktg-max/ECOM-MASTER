import type { PriorityCriterion, PriorityScores } from '@/db/schema';

/**
 * Marketplace priority framework, version 1.
 *
 * Each platform is scored 1–5 on five criteria by the researcher, with a written evidence note for each.
 * The weighted score and the rank are then CALCULATED here — never typed in by hand — so anyone can
 * reproduce a ranking from the stored criterion scores.
 *
 * These weights are an internal judgement about what matters for a beauty / personal-care brand.
 * They are not market shares and not an industry standard.
 */
export const PRIORITY_FRAMEWORK_VERSION = 1;

export const PRIORITY_WEIGHTS: Record<PriorityCriterion, number> = {
  ecommerce_significance: 0.2,
  beauty_category_relevance: 0.25,
  consumer_reach: 0.2,
  brand_competitor_coverage: 0.15,
  data_integration_feasibility: 0.2,
};

export const PRIORITY_CRITERIA_LABELS: Record<PriorityCriterion, { label: string; question: string }> = {
  ecommerce_significance: {
    label: 'E-commerce significance',
    question: "How important is the platform in the country's online retail overall?",
  },
  beauty_category_relevance: {
    label: 'Beauty & personal-care relevance',
    question: 'How important is it for mass-market hair, skin and oral care specifically?',
  },
  consumer_reach: { label: 'Consumer reach', question: 'How large is its evidenced audience?' },
  brand_competitor_coverage: {
    label: 'Brand & competitor coverage',
    question: 'How broad is the range of relevant brands and products listed?',
  },
  data_integration_feasibility: {
    label: 'Data & integration feasibility',
    question: 'How realistically can listing, price and review data be obtained legitimately?',
  },
};

export const PRIORITY_CRITERIA = Object.keys(PRIORITY_WEIGHTS) as PriorityCriterion[];

function clampScore(n: unknown): number {
  const v = typeof n === 'number' ? n : Number(n);
  if (!Number.isFinite(v)) return 1;
  return Math.min(5, Math.max(1, v));
}

export function weightedPriorityScore(scores: PriorityScores): number {
  let total = 0;
  for (const criterion of PRIORITY_CRITERIA) {
    total += clampScore(scores[criterion]?.score) * PRIORITY_WEIGHTS[criterion];
  }
  return Math.round(total * 100) / 100;
}

export type Rankable = { key: string; scores: PriorityScores };
export type Ranked = { key: string; weightedScore: number; rank: number; isTop3: boolean };

/**
 * Rank platforms within one country. Highest weighted score first; ties are broken by
 * beauty relevance, then consumer reach, then name (so the order is always deterministic).
 */
export function rankPlatforms(items: Rankable[]): Ranked[] {
  const scored = items.map((item) => ({
    key: item.key,
    weightedScore: weightedPriorityScore(item.scores),
    beauty: clampScore(item.scores.beauty_category_relevance?.score),
    reach: clampScore(item.scores.consumer_reach?.score),
  }));
  scored.sort(
    (a, b) =>
      b.weightedScore - a.weightedScore || b.beauty - a.beauty || b.reach - a.reach || a.key.localeCompare(b.key),
  );
  return scored.map((s, i) => ({ key: s.key, weightedScore: s.weightedScore, rank: i + 1, isTop3: i < 3 }));
}
