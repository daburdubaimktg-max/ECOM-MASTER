import { describe, expect, it } from 'vitest';
import type { PriorityScores } from '@/db/schema';
import { PRIORITY_WEIGHTS, rankPlatforms, weightedPriorityScore } from '@/lib/marketplace-priority';

const scores = (e: number, b: number, r: number, c: number, d: number): PriorityScores => ({
  ecommerce_significance: { score: e, note: '' },
  beauty_category_relevance: { score: b, note: '' },
  consumer_reach: { score: r, note: '' },
  brand_competitor_coverage: { score: c, note: '' },
  data_integration_feasibility: { score: d, note: '' },
});

describe('marketplace priority framework', () => {
  it('uses weights that add up to exactly 1', () => {
    const total = Object.values(PRIORITY_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(Math.round(total * 1000) / 1000).toBe(1);
  });

  it('calculates the weighted score to two decimals', () => {
    expect(weightedPriorityScore(scores(5, 5, 5, 5, 5))).toBe(5);
    expect(weightedPriorityScore(scores(1, 1, 1, 1, 1))).toBe(1);
    // 5*0.20 + 4*0.25 + 5*0.20 + 4*0.15 + 3*0.20 = 4.2
    expect(weightedPriorityScore(scores(5, 4, 5, 4, 3))).toBe(4.2);
  });

  it('does not let the biggest general marketplace win automatically: a beauty specialist can outrank it', () => {
    const ranked = rankPlatforms([
      { key: 'general-giant', scores: scores(5, 3, 5, 4, 2) }, // 3.75
      { key: 'beauty-specialist', scores: scores(3, 5, 4, 5, 4) }, // 4.20
    ]);
    expect(ranked[0].key).toBe('beauty-specialist');
  });

  it('breaks ties by beauty relevance, then reach, then name, and flags exactly the top three', () => {
    const ranked = rankPlatforms([
      { key: 'd', scores: scores(4, 4, 4, 4, 4) },
      { key: 'c', scores: scores(4, 4, 4, 4, 4) },
      { key: 'b', scores: scores(3, 5, 4, 4, 3.75) },
      { key: 'a', scores: scores(1, 1, 1, 1, 1) },
    ]);
    expect(ranked.map((r) => r.key)).toEqual(['b', 'c', 'd', 'a']);
    expect(ranked.filter((r) => r.isTop3).map((r) => r.key)).toEqual(['b', 'c', 'd']);
    expect(ranked.map((r) => r.rank)).toEqual([1, 2, 3, 4]);
  });

  it('clamps out-of-range criterion scores instead of producing impossible totals', () => {
    expect(weightedPriorityScore(scores(9, 9, 9, 9, 9))).toBe(5);
    expect(weightedPriorityScore(scores(-3, 0, 0, 0, 0))).toBe(1);
  });
});
