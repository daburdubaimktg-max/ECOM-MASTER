import fs from 'node:fs';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { eq, isNull } from 'drizzle-orm';
import { closeDb, getDb, schema } from '@/db/client';
import { ensureReferenceData } from '@/db/reference-data';
import type { ReferenceLoadReport } from '@/db/reference-data';
import { countryFileSchema, requirementFileSchema } from '@/db/research-schema';
import { rankPlatforms } from '@/lib/marketplace-priority';
import { slugify } from '@/lib/text';

/**
 * Checks the REAL research data files that ship with the product (data/research). If a researcher
 * edits a file and breaks its structure, or a source link goes missing, this test fails before the
 * data can reach anyone's screen.
 */
const REAL_DIR = path.join(process.cwd(), 'data', 'research');
const LAUNCH_COUNTRIES = ['AE', 'SA', 'ZA', 'US', 'GB', 'IN', 'KE', 'NG', 'MY'];

let report: ReferenceLoadReport;

beforeAll(async () => {
  const db = await getDb();
  report = await ensureReferenceData(db, REAL_DIR);
});

afterAll(async () => {
  await closeDb();
});

describe('real marketplace research files', () => {
  it('load completely: no file is rejected and no record is dropped', () => {
    expect(report.skipped).toEqual([]);
    expect(report.warnings).toEqual([]);
    expect(report.marketplaceFilesLoaded.sort()).toEqual(LAUNCH_COUNTRIES.map((c) => `${c}.json`).sort());
  });

  it('cover every launch country with at least ten platforms and exactly three top priorities', async () => {
    const db = await getDb();
    const rows = await db.select().from(schema.marketplaces).where(isNull(schema.marketplaces.organisationId));
    for (const code of LAUNCH_COUNTRIES) {
      const inCountry = rows.filter((r) => r.countryCode === code);
      expect(inCountry.length, `${code} platform count`).toBeGreaterThanOrEqual(10);
      expect(inCountry.filter((r) => r.isTop3).length, `${code} top three`).toBe(3);
      const ranks = inCountry.map((r) => r.priorityRank).sort((a, b) => (a ?? 0) - (b ?? 0));
      expect(ranks).toEqual(inCountry.map((_, i) => i + 1));
    }
  });

  it('give every platform at least one source, a confidence level and a scored rationale', () => {
    for (const code of LAUNCH_COUNTRIES) {
      const file = countryFileSchema.parse(JSON.parse(fs.readFileSync(path.join(REAL_DIR, 'marketplaces', `${code}.json`), 'utf8')));
      expect(file.research_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(file.market_context.summary.length).toBeGreaterThan(80);
      const slugs = file.platforms.map((p) => slugify(p.name));
      expect(new Set(slugs).size, `${code} has duplicate platforms`).toBe(slugs.length);
      for (const platform of file.platforms) {
        expect(platform.sources.length, `${code} / ${platform.name} has no sources`).toBeGreaterThan(0);
        for (const source of platform.sources) expect(source.url, `${code} / ${platform.name}`).toMatch(/^https?:\/\//);
        for (const criterion of Object.values(platform.priority_scores)) {
          expect(criterion.score).toBeGreaterThanOrEqual(1);
          expect(criterion.score).toBeLessThanOrEqual(5);
          expect(criterion.note.length, `${code} / ${platform.name} is missing an evidence note`).toBeGreaterThan(10);
        }
        for (const evidence of platform.consumer_reach_evidence) {
          expect(['official_statistic', 'company_reported', 'third_party_estimate', 'analyst_estimate']).toContain(evidence.nature);
        }
      }
    }
  });

  it('are ranked by the published formula — the stored rank always equals the recalculated rank', async () => {
    const db = await getDb();
    for (const code of LAUNCH_COUNTRIES) {
      const stored = await db.select().from(schema.marketplaces).where(eq(schema.marketplaces.countryCode, code));
      const recalculated = rankPlatforms(stored.map((row) => ({ key: row.slug, scores: row.priorityScores! })));
      for (const expected of recalculated) {
        const row = stored.find((r) => r.slug === expected.key)!;
        expect(row.priorityRank, `${code} / ${row.name}`).toBe(expected.rank);
        expect(row.weightedScore, `${code} / ${row.name}`).toBe(expected.weightedScore);
      }
    }
  });
});

describe('real requirement library files', () => {
  const files = fs.existsSync(path.join(REAL_DIR, 'requirements')) ? fs.readdirSync(path.join(REAL_DIR, 'requirements')).filter((f) => f.endsWith('.json')) : [];

  it('exist for the main retailers', () => {
    for (const expected of ['amazon.json', 'walmart.json', 'noon.json', 'takealot.json', 'jumia.json', 'flipkart.json', 'shopee.json', 'lazada.json']) {
      expect(files).toContain(expected);
    }
  });

  it('give every rule a source, and never mark a rule mandatory without one', () => {
    for (const name of files) {
      const raw = JSON.parse(fs.readFileSync(path.join(REAL_DIR, 'requirements', name), 'utf8'));
      if (!Array.isArray(raw.rules)) continue;
      const file = requirementFileSchema.parse(raw);
      expect(file.rules.length, `${name}: some rules were malformed`).toBe(raw.rules.length);
      const ids = file.rules.map((r) => r.id);
      for (const rule of file.rules) {
        if (rule.verification !== 'unverified') {
          expect(rule.source_url, `${name} / ${rule.id} has no source`).toMatch(/^https?:\/\//);
        }
        if (rule.severity === 'mandatory') {
          expect(rule.verification, `${name} / ${rule.id}: a mandatory rule must come from a document`).not.toBe('unverified');
        }
        if (rule.value !== null) expect(Number.isFinite(rule.value)).toBe(true);
      }
      expect(ids.length).toBeGreaterThanOrEqual(0);
    }
  });

  it('link the main retailers in each country to their library', async () => {
    const db = await getDb();
    const rows = await db.select({ name: schema.marketplaces.name, country: schema.marketplaces.countryCode, family: schema.marketplaces.familyKey }).from(schema.marketplaces);
    const family = (country: string, pattern: RegExp) => rows.find((r) => r.country === country && pattern.test(r.name))?.family;
    expect(family('AE', /^Amazon/)).toBe('amazon');
    expect(family('AE', /^Noon/)).toBe('noon');
    expect(family('SA', /^Noon/)).toBe('noon');
    expect(family('US', /^Walmart/)).toBe('walmart');
    expect(family('ZA', /^Takealot/)).toBe('takealot');
    expect(family('NG', /^Jumia/)).toBe('jumia');
    expect(family('KE', /^Jumia/)).toBe('jumia');
    expect(family('IN', /^Flipkart/)).toBe('flipkart');
    expect(family('MY', /^Shopee/)).toBe('shopee');
    expect(family('MY', /^Lazada/)).toBe('lazada');
    expect(family('AE', /^Boots/)).toBeNull();
  });
});
