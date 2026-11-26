import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { and, eq, isNull } from 'drizzle-orm';
import { closeDb, getDb, schema } from '@/db/client';
import { displayPlatformName, ensureReferenceData, familyKeyFor } from '@/db/reference-data';
import type { RequestContext } from '@/lib/auth/context';
import { ForbiddenError } from '@/lib/auth/permissions';
import { createBrand } from '@/lib/services/brands';
import { addCustomMarketplace, getMarketplace, getRequirementSetByFamily, listMarketplaces, setBrandPresence, updateMarketplaceSettings } from '@/lib/services/marketplaces';
import { addMember, makeOrganisation } from '../helpers';

/**
 * These tests use small SYNTHETIC research files written to a temporary folder (clearly not real
 * market data) to prove the loader's behaviour: validation, calculated ranking, history and versioning.
 */
let dir: string;
let admin: RequestContext;

const platform = (name: string, scores: [number, number, number, number, number], extra: Record<string, unknown> = {}) => ({
  name,
  website: `https://${name.toLowerCase().replace(/[^a-z]/g, '')}.example`,
  operator: 'Test operator',
  status: 'active',
  platform_category: 'general_marketplace',
  marketplace_type: 'hybrid_1p_3p',
  beauty_relevance: 'high',
  pharmacy_relevance: 'low',
  estimated_market_importance: 'tier_1',
  consumer_reach_evidence: [{ claim: 'Synthetic test evidence', metric_type: 'monthly_visits', value: '1', period: 'test', nature: 'third_party_estimate', source_url: 'https://example.test/a', source_name: 'Test', source_date: '2026' }],
  competitor_presence: { level: 'high', note: 'test', source_urls: [] },
  data_access_method: 'official_api',
  api_availability: { public_seller_api: 'yes', note: 'test', docs_url: null },
  data_collection_feasibility: 'high',
  priority_scores: {
    ecommerce_significance: { score: scores[0], note: 'n' },
    beauty_category_relevance: { score: scores[1], note: 'n' },
    consumer_reach: { score: scores[2], note: 'n' },
    brand_competitor_coverage: { score: scores[3], note: 'n' },
    data_integration_feasibility: { score: scores[4], note: 'n' },
  },
  weighted_score: 1.0, // deliberately wrong: the loader must recalculate
  priority_rank: 99,
  is_top3: false,
  confidence: 'medium',
  sources: [{ url: 'https://example.test/source', title: 'Synthetic source', publisher: 'Test', published_date: '2026-01-01', accessed_date: '2026-11-26' }],
  ...extra,
});

function writeCountry(platforms: unknown[], researchDate = '2026-11-26') {
  fs.mkdirSync(path.join(dir, 'marketplaces'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'marketplaces', 'AE.json'),
    JSON.stringify({
      country_code: 'AE',
      country_name: 'United Arab Emirates',
      region: 'Middle East',
      research_date: researchDate,
      market_context: { summary: 'Synthetic test summary.', key_facts: [] },
      ranking_method_note: 'test',
      platforms,
    }),
  );
}

function writeRequirements(maxTitle: number) {
  fs.mkdirSync(path.join(dir, 'requirements'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'requirements', 'amazon.json'),
    JSON.stringify({
      marketplace: 'Amazon',
      research_date: '2026-11-26',
      applies_to_country_codes: ['AE'],
      rules: [
        { id: 'title.max_length', area: 'title', requirement: `Title must not exceed ${maxTitle} characters`, rule_type: 'max_length', value: maxTitle, unit: 'characters', severity: 'mandatory', applies_to_country_codes: ['AE'], source_url: 'https://example.test/rule', verification: 'official_document' },
        { id: 'images_main.background', area: 'images_main', requirement: 'Main image on a pure white background', rule_type: 'required', severity: 'mandatory', verification: 'secondary_quote' },
        { id: 'bogus.area', area: 'not_a_real_area', requirement: 'x', severity: 'mandatory' },
      ],
      official_quality_signals: [{ official_name: 'Synthetic Quality Signal', access_method: 'seller_portal_only', components: ['a', 'b'] }],
      limitations: 'Synthetic test file.',
    }),
  );
}

beforeAll(async () => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bie-research-'));
  admin = await makeOrganisation('Marketplace Org');
});

afterAll(async () => {
  await closeDb();
  fs.rmSync(dir, { recursive: true, force: true });
});

describe('loading marketplace research', () => {
  it('recalculates scores and ranks from the criterion scores instead of trusting the file', async () => {
    writeCountry([
      platform('Amazon.ae', [5, 3, 5, 4, 2]), // 3.75
      platform('Beauty Specialist', [3, 5, 4, 5, 4]), // 4.20
      platform('Pharmacy Chain', [2, 4, 3, 3, 2]), // 2.85
      platform('Tiny Shop', [1, 1, 1, 1, 1]), // 1.00
    ]);
    const db = await getDb();
    const report = await ensureReferenceData(db, dir);
    expect(report.marketplaceFilesLoaded).toEqual(['AE.json']);

    const rows = await listMarketplaces(admin, { countryCode: 'AE' });
    expect(rows.map((r) => [r.name, r.priorityRank, r.weightedScore, r.isTop3])).toEqual([
      ['Beauty Specialist', 1, 4.2, true],
      ['Amazon.ae', 2, 3.75, true],
      ['Pharmacy Chain', 3, 2.85, true],
      ['Tiny Shop', 4, 1, false],
    ]);
    expect(rows.find((r) => r.name === 'Amazon.ae')?.familyKey).toBe('amazon');
  });

  it('keeps evidence and sources with each platform', async () => {
    const rows = await listMarketplaces(admin, { countryCode: 'AE', q: 'beauty' });
    const detail = await getMarketplace(admin, rows[0].id);
    expect(detail.evidence[0]).toMatchObject({ nature: 'third_party_estimate', sourceUrl: 'https://example.test/a' });
    expect(detail.sources[0].url).toBe('https://example.test/source');
    expect(detail.history).toHaveLength(1);
  });

  it('does nothing when the same file is loaded again', async () => {
    const db = await getDb();
    const report = await ensureReferenceData(db, dir);
    expect(report.marketplaceFilesLoaded).toEqual([]);
  });

  it('adds history instead of overwriting when research is updated, and un-ranks platforms that disappeared', async () => {
    writeCountry(
      [platform('Amazon.ae', [5, 5, 5, 5, 5]), platform('Beauty Specialist', [3, 5, 4, 5, 4]), platform('Pharmacy Chain', [2, 4, 3, 3, 2])],
      '2027-02-01',
    );
    const db = await getDb();
    await ensureReferenceData(db, dir);
    const rows = await listMarketplaces(admin, { countryCode: 'AE' });
    expect(rows[0]).toMatchObject({ name: 'Amazon.ae', priorityRank: 1, weightedScore: 5 });
    const tiny = rows.find((r) => r.name === 'Tiny Shop')!;
    expect(tiny).toMatchObject({ priorityRank: null, isTop3: false });
    const amazon = await getMarketplace(admin, rows[0].id);
    expect(amazon.history.map((h) => h.researchDate)).toEqual(['2027-02-01', '2026-11-26']);
    const research = await db.select().from(schema.countryResearch).where(eq(schema.countryResearch.countryCode, 'AE'));
    expect(research.filter((r) => r.isCurrent)).toHaveLength(1);
    expect(research).toHaveLength(2);
  });

  it('rejects a malformed file with a clear reason and leaves existing data untouched', async () => {
    fs.writeFileSync(path.join(dir, 'marketplaces', 'SA.json'), JSON.stringify({ country_code: 'SA', platforms: [] }));
    const db = await getDb();
    const report = await ensureReferenceData(db, dir);
    expect(report.skipped[0].file).toBe('SA.json');
    expect(report.skipped[0].reason).toMatch(/invalid marketplace research file/);
    expect(await listMarketplaces(admin, { countryCode: 'SA' })).toEqual([]);
    fs.rmSync(path.join(dir, 'marketplaces', 'SA.json'));
  });
});

describe('requirements library versioning', () => {
  it('loads rules with their sources, drops rules it cannot classify, and links them to the retailer', async () => {
    writeRequirements(200);
    const db = await getDb();
    const report = await ensureReferenceData(db, dir);
    expect(report.requirementFilesLoaded).toEqual(['amazon.json']);
    expect(report.warnings).toEqual(['amazon.json: 1 malformed rule(s) left out']);
    const library = await getRequirementSetByFamily(admin, 'amazon');
    expect(library.set).toMatchObject({ version: 1, status: 'current', marketplaceName: 'Amazon' });
    expect(library.rules.map((r) => r.ruleKey).sort()).toEqual(['images_main.background', 'title.max_length']);
    expect(library.rules.find((r) => r.ruleKey === 'title.max_length')).toMatchObject({ value: 200, unit: 'characters', severity: 'mandatory', verification: 'official_document' });
    expect(library.signals[0]).toMatchObject({ officialName: 'Synthetic Quality Signal', components: 'a; b' });

    const amazon = (await listMarketplaces(admin, { countryCode: 'AE', q: 'amazon' }))[0];
    const detail = await getMarketplace(admin, amazon.id);
    expect(detail.requirementSet?.set.version).toBe(1);
  });

  it('creates version 2 when the rules change and keeps version 1 as superseded', async () => {
    writeRequirements(150);
    const db = await getDb();
    await ensureReferenceData(db, dir);
    const library = await getRequirementSetByFamily(admin, 'amazon');
    expect(library.set.version).toBe(2);
    expect(library.rules.find((r) => r.ruleKey === 'title.max_length')?.value).toBe(150);
    expect(library.versions.map((v) => [v.version, v.status])).toEqual([
      [2, 'current'],
      [1, 'superseded'],
    ]);
    const oldRules = await db
      .select({ value: schema.requirementRules.value })
      .from(schema.requirementRules)
      .innerJoin(schema.requirementSets, eq(schema.requirementSets.id, schema.requirementRules.setId))
      .where(and(eq(schema.requirementSets.version, 1), eq(schema.requirementRules.ruleKey, 'title.max_length')));
    expect(oldRules[0].value).toBe(200);
  });
});

describe("an organisation's own marketplace decisions", () => {
  it('records tracking status and how a brand is sold there without touching the shared research', async () => {
    const brand = await createBrand(admin, { name: 'Demo Botanics' });
    const amazon = (await listMarketplaces(admin, { countryCode: 'AE', q: 'amazon' }))[0];
    await updateMarketplaceSettings(admin, amazon.id, { monitoringStatus: 'planned', notes: 'Start in Q1' });
    await setBrandPresence(admin, { brandId: brand.id, marketplaceId: amazon.id, presence: 'present', sellingModel: 'distributor' });
    const detail = await getMarketplace(admin, amazon.id);
    expect(detail.settings).toMatchObject({ monitoringStatus: 'planned', notes: 'Start in Q1' });
    expect(detail.presence[0]).toMatchObject({ brandName: 'Demo Botanics', presence: 'present', sellingModel: 'distributor' });

    const other = await makeOrganisation('Another Org');
    const theirs = await getMarketplace(other, amazon.id);
    expect(theirs.settings).toBeNull();
    expect(theirs.presence).toEqual([]);
    expect(await listMarketplaces(admin, { monitoring: 'planned' })).toHaveLength(1);
  });

  it('lets a team add an un-researched platform that only they can see, with no invented score', async () => {
    const custom = await addCustomMarketplace(admin, { name: 'Local Beauty Store', countryCode: 'AE', website: 'https://local.example', platformCategory: 'beauty_specialist', marketplaceType: 'first_party_retailer', notes: 'Suggested by sales team' });
    expect(custom).toMatchObject({ origin: 'user_added', weightedScore: null, priorityRank: null, isTop3: false });
    const other = await makeOrganisation('Yet Another Org');
    expect((await listMarketplaces(other, { countryCode: 'AE' })).some((r) => r.name === 'Local Beauty Store')).toBe(false);
    const db = await getDb();
    const reference = await db.select().from(schema.marketplaces).where(and(isNull(schema.marketplaces.organisationId), eq(schema.marketplaces.slug, 'local-beauty-store')));
    expect(reference).toEqual([]);
  });

  it('requires permission to change marketplace settings', async () => {
    const viewer = await addMember(admin.organisation.id, 'viewer');
    const amazon = (await listMarketplaces(viewer, { countryCode: 'AE', q: 'amazon' }))[0];
    await expect(updateMarketplaceSettings(viewer, amazon.id, { monitoringStatus: 'active' })).rejects.toBeInstanceOf(ForbiddenError);
  });
});

describe('platform display names', () => {
  it('drops a bracketed web address but keeps brackets that carry information', () => {
    expect(displayPlatformName('Boots (boots.com)')).toBe('Boots');
    expect(displayPlatformName('Amazon (amazon.com)')).toBe('Amazon');
    expect(displayPlatformName('Morrisons (groceries.morrisons.com)')).toBe('Morrisons');
    expect(displayPlatformName('TikTok Shop (UK)')).toBe('TikTok Shop (UK)');
    expect(displayPlatformName('Noon (incl. Noon Minutes / Supermall)')).toBe('Noon (incl. Noon Minutes / Supermall)');
    expect(displayPlatformName('Takealot')).toBe('Takealot');
  });
});

describe('retailer family mapping', () => {
  it('maps country sites to the right requirements library and leaves unknown platforms unmapped', () => {
    expect(familyKeyFor('Amazon.ae', 'AE')).toBe('amazon');
    expect(familyKeyFor('Amazon.co.za', 'ZA')).toBe('amazon');
    expect(familyKeyFor('Noon', 'SA')).toBe('noon');
    expect(familyKeyFor('Noon (incl. Noon Minutes / Supermall)', 'AE')).toBe('noon');
    expect(familyKeyFor('Noon Minutes', 'AE')).toBeNull();
    expect(familyKeyFor('Flipkart (flipkart.com, including Flipkart Minutes)', 'IN')).toBe('flipkart');
    expect(familyKeyFor('Boots', 'GB')).toBe('boots');
    expect(familyKeyFor('Boots UAE', 'AE')).toBeNull();
    expect(familyKeyFor('Watsons UAE', 'AE')).toBeNull();
    expect(familyKeyFor('TikTok Shop (UK)', 'GB')).toBe('tiktok-shop');
    expect(familyKeyFor('Carrefour UAE', 'AE')).toBe('carrefour-uae');
    expect(familyKeyFor('Carrefour Kenya', 'KE')).toBeNull();
    expect(familyKeyFor('Watsons Malaysia', 'MY')).toBe('watsons-my');
    expect(familyKeyFor('Some New Shop', 'AE')).toBeNull();
  });
});
