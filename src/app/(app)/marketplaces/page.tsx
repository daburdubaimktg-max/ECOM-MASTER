import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { CustomMarketplaceForm } from '@/components/marketplace/forms';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, EmptyState, formatDate, LinkButton, Notice, PageHeader, Stat } from '@/components/ui/primitives';
import { Provenance } from '@/components/ui/provenance';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { DATA_ACCESS_LABELS, label, MARKETPLACE_TYPE_LABELS, PLATFORM_CATEGORY_LABELS } from '@/lib/labels';
import { PRIORITY_CRITERIA, PRIORITY_CRITERIA_LABELS, PRIORITY_WEIGHTS } from '@/lib/marketplace-priority';
import { firstParam } from '@/lib/page-helpers';
import type { SearchParams } from '@/lib/page-helpers';
import { getCountryResearch, listCountriesWithCounts, listMarketplaces, marketplaceStats } from '@/lib/services/marketplaces';

export const metadata: Metadata = { title: 'Marketplace Intelligence' };

const LEVEL_TONE = { high: 'verified', medium: 'estimated', low: 'missing', none: 'missing' } as const;

async function Marketplaces({ searchParams }: { searchParams: SearchParams }) {
  const ctx = await requireContext();
  const sp = await searchParams;
  const filters = {
    countryCode: firstParam(sp.country),
    category: firstParam(sp.category),
    type: firstParam(sp.type),
    priority: firstParam(sp.priority) === 'top3' ? ('top3' as const) : ('all' as const),
    dataAccess: firstParam(sp.access),
    monitoring: firstParam(sp.tracking),
    q: firstParam(sp.q),
  };
  const [countries, stats, platforms] = await Promise.all([listCountriesWithCounts(ctx), marketplaceStats(ctx), listMarketplaces(ctx, filters)]);
  const selectedCountry = countries.find((c) => c.code === filters.countryCode.toUpperCase());
  const research = selectedCountry ? await getCountryResearch(ctx, selectedCountry.code) : null;
  const researched = countries.filter((c) => c.platformCount > 0);
  const filtered = Object.entries(filters).some(([key, value]) => (key === 'priority' ? value === 'top3' : Boolean(value)));

  // With no country chosen and no filter, show a digest: the five highest-ranked platforms per country.
  const digest = !selectedCountry && !filtered;
  const DIGEST_SIZE = 5;
  const byCountry = new Map<string, { rows: typeof platforms; total: number }>();
  for (const platform of platforms) {
    const entry = byCountry.get(platform.countryCode) ?? { rows: [], total: 0 };
    entry.total++;
    if (!digest || entry.rows.length < DIGEST_SIZE) entry.rows.push(platform);
    byCountry.set(platform.countryCode, entry);
  }

  return (
    <>
      <PageHeader
        eyebrow="Market"
        title="Marketplace Intelligence"
        description="Where beauty and personal-care products are sold online in each market, ranked for relevance to your category with the evidence shown. Rankings are calculated from scored criteria — they are not market shares."
        actions={
          <LinkButton href="/marketplaces/requirements" variant="secondary">
            <BookOpen size={15} /> Requirements library
          </LinkButton>
        }
      />

      <div className="stagger mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Platforms researched" value={stats.platforms} hint="Each with sources and a confidence level" marker={<Provenance kind="verified" compact title="Counted from the research database." />} />
        <Stat label="Countries" value={stats.countries} hint={researched.map((c) => c.code).join(' · ') || 'No research loaded yet'} marker={<Provenance kind="verified" compact />} />
        <Stat label="With a public seller API" value={stats.withPublicApi} hint="Documented API a seller or partner can apply to use" marker={<Provenance kind="verified" compact />} />
        <Stat label="Tracked by your team" value={stats.tracked} hint="Platforms you have marked as tracked" marker={<Provenance kind="verified" compact />} />
      </div>

      {stats.platforms === 0 ? (
        <Notice tone="estimated" title="No marketplace research is loaded">
          The research data files have not been loaded into this database yet. Run <span className="num">npm run db:migrate</span> or restart the app in development mode.
        </Notice>
      ) : null}

      <nav aria-label="Countries" className="mb-4 flex flex-wrap gap-1.5">
        <Link href="/marketplaces" className={`rounded-full border px-3 py-1 text-[13px] transition-colors ${!selectedCountry ? 'border-ink bg-ink text-paper' : 'border-line-strong bg-card hover:border-ink'}`}>
          All countries
        </Link>
        {countries
          .filter((c) => c.platformCount > 0 || c.isInitialMarket)
          .map((country) => (
            <Link
              key={country.code}
              href={`/marketplaces?country=${country.code}`}
              className={`rounded-full border px-3 py-1 text-[13px] transition-colors ${selectedCountry?.code === country.code ? 'border-ink bg-ink text-paper' : 'border-line-strong bg-card hover:border-ink'}`}
            >
              {country.name} <span className="num ml-1 text-[11px] opacity-70">{country.platformCount}</span>
            </Link>
          ))}
      </nav>

      <form method="get" className="mb-5 flex flex-wrap items-end gap-3">
        {selectedCountry ? <input type="hidden" name="country" value={selectedCountry.code} /> : null}
        <div className="min-w-[12rem] flex-1">
          <label htmlFor="mq" className="label mb-1 block">
            Find a platform
          </label>
          <input id="mq" name="q" defaultValue={filters.q} placeholder="Name or operator" className="field-input" />
        </div>
        <div>
          <label htmlFor="category" className="label mb-1 block">
            Kind
          </label>
          <select id="category" name="category" defaultValue={filters.category} className="field-input !w-auto">
            <option value="">Any kind</option>
            {Object.entries(PLATFORM_CATEGORY_LABELS).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="type" className="label mb-1 block">
            Business model
          </label>
          <select id="type" name="type" defaultValue={filters.type} className="field-input !w-auto">
            <option value="">Any model</option>
            {Object.entries(MARKETPLACE_TYPE_LABELS).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="access" className="label mb-1 block">
            Data access
          </label>
          <select id="access" name="access" defaultValue={filters.dataAccess} className="field-input !w-auto">
            <option value="">Any</option>
            {Object.entries(DATA_ACCESS_LABELS).map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="priority" className="label mb-1 block">
            Priority
          </label>
          <select id="priority" name="priority" defaultValue={filters.priority} className="field-input !w-auto">
            <option value="all">All</option>
            <option value="top3">Top 3 per country</option>
          </select>
        </div>
        <div>
          <label htmlFor="tracking" className="label mb-1 block">
            Tracking
          </label>
          <select id="tracking" name="tracking" defaultValue={filters.monitoring} className="field-input !w-auto">
            <option value="">Any</option>
            <option value="active">Tracked</option>
            <option value="planned">Planned</option>
          </select>
        </div>
        <button className="rounded-[4px] border border-line-strong bg-card px-3.5 py-2 text-[13.5px] font-medium hover:border-ink">Apply</button>
        {filtered ? (
          <Link href="/marketplaces" className="py-2 text-[13px] text-ink-muted underline underline-offset-4 hover:text-ink">
            Clear
          </Link>
        ) : null}
      </form>

      {research ? (
        <div className="card mb-5 p-5">
          <p className="label flex items-center gap-2">
            Market context · {selectedCountry?.name} · researched {formatDate(research.researchDate)}
          </p>
          <p className="mt-2 max-w-[95ch] text-[14.5px] text-ink-soft">{research.summary}</p>
          {research.keyFacts.length ? (
            <ul className="mt-3 grid gap-x-8 gap-y-2 md:grid-cols-2">
              {research.keyFacts.slice(0, 6).map((fact, i) => (
                <li key={i} className="flex gap-2 text-[13px] text-ink-soft">
                  <span className="mt-0.5 shrink-0">
                    <Provenance kind={fact.nature === 'official_statistic' ? 'verified' : 'estimated'} compact title={fact.nature.replace(/_/g, ' ')} />
                  </span>
                  <span>
                    {fact.fact}{' '}
                    {/^https?:\/\//.test(fact.source_url) ? (
                      <a href={fact.source_url} target="_blank" rel="noopener noreferrer nofollow" title={fact.source_name} className="num text-[11px] text-ink-muted underline underline-offset-2 hover:text-signal">
                        {(fact.source_name || 'source').length > 70 ? `${(fact.source_name || 'source').slice(0, 68).trimEnd()}…` : fact.source_name || 'source'}
                        {fact.source_date && fact.source_date !== 'n.d.' ? `, ${fact.source_date}` : ''}
                      </a>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {platforms.length === 0 && stats.platforms > 0 ? (
        <div className="card">
          <EmptyState title="No platforms match these filters">Clear a filter to see more.</EmptyState>
        </div>
      ) : null}

      <div className="space-y-6">
        {[...byCountry.entries()].map(([code, { rows, total }]) => (
          <section key={code} className="card overflow-x-auto">
            <header className="flex items-baseline justify-between gap-3 border-b border-line px-5 py-3.5">
              <h2 className="text-[19px] font-normal">
                {rows[0].countryName}{' '}
                <span className="num ml-1 text-[12px] text-ink-muted">
                  {digest && total > rows.length ? `top ${rows.length} of ${total} platforms` : `${total} platform${total === 1 ? '' : 's'}`}
                </span>
              </h2>
              {!selectedCountry ? (
                <Link href={`/marketplaces?country=${code}`} className="text-[12.5px] text-ink-muted underline underline-offset-4 hover:text-signal">
                  {digest && total > rows.length ? `All ${total} platforms and market context` : 'Market context'}
                </Link>
              ) : null}
            </header>
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-12">Rank</th>
                  <th>Platform</th>
                  <th>Kind</th>
                  <th>Beauty relevance</th>
                  <th>Data access</th>
                  <th className="text-right">Priority score</th>
                  <th>Confidence</th>
                  <th>Tracking</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((platform) => (
                  <tr key={platform.id} data-testid="platform-row">
                    <td>
                      {platform.priorityRank ? (
                        <span className={`num inline-flex h-7 w-7 items-center justify-center rounded-full text-[12.5px] ${platform.isTop3 ? 'bg-signal font-medium text-white' : 'bg-paper-deep text-ink-soft'}`}>
                          {platform.priorityRank}
                        </span>
                      ) : (
                        <span className="text-ink-muted">—</span>
                      )}
                    </td>
                    <td>
                      <Link href={`/marketplaces/${platform.id}`} className="font-medium text-ink hover:text-signal">
                        {platform.name}
                      </Link>
                      <p className="text-[12.5px] text-ink-muted">{label(MARKETPLACE_TYPE_LABELS, platform.marketplaceType)}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {platform.origin === 'user_added' ? <Badge tone="missing">Added by your team · not researched</Badge> : null}
                        {platform.status !== 'active' ? <Badge tone="estimated">{platform.status.replace('_', ' ')}</Badge> : null}
                      </div>
                    </td>
                    <td className="text-ink-soft">{label(PLATFORM_CATEGORY_LABELS, platform.platformCategory)}</td>
                    <td>{platform.beautyRelevance ? <Badge tone={LEVEL_TONE[platform.beautyRelevance]}>{platform.beautyRelevance}</Badge> : <span className="text-ink-muted">—</span>}</td>
                    <td>
                      <span className="text-ink-soft">{label(DATA_ACCESS_LABELS, platform.dataAccessMethod)}</span>
                      {platform.publicSellerApi === 'yes' ? <p className="label mt-0.5 !text-[9.5px] !text-verified">Public seller API</p> : null}
                    </td>
                    <td className="text-right">
                      {platform.weightedScore !== null ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="num text-[15px] font-medium">{platform.weightedScore.toFixed(2)}</span>
                          <span className="num text-[11px] text-ink-muted">/5</span>
                          <Provenance kind="calculated" compact />
                        </span>
                      ) : (
                        <Provenance kind="missing" title="Not scored: no evidence-based research has been done for this platform." />
                      )}
                    </td>
                    <td>{platform.confidence ? <Badge tone={LEVEL_TONE[platform.confidence]}>{platform.confidence}</Badge> : <span className="text-ink-muted">—</span>}</td>
                    <td>
                      {platform.monitoringStatus === 'active' ? <Badge tone="verified">Tracked</Badge> : platform.monitoringStatus === 'planned' ? <Badge tone="calculated">Planned</Badge> : <span className="text-[12.5px] text-ink-muted">Not tracked</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            index="A"
            title="How the priority score is calculated"
            description="Each platform is scored 1–5 on five criteria, with a written evidence note for every score. The weighted total decides the rank; ties go to the platform with higher beauty relevance, then reach."
            action={<Provenance kind="calculated" />}
          />
          <table className="data-table">
            <thead>
              <tr>
                <th>Criterion</th>
                <th className="text-right">Weight</th>
              </tr>
            </thead>
            <tbody>
              {PRIORITY_CRITERIA.map((criterion) => (
                <tr key={criterion}>
                  <td>
                    <span className="font-medium">{PRIORITY_CRITERIA_LABELS[criterion].label}</span>
                    <p className="text-[12.5px] text-ink-muted">{PRIORITY_CRITERIA_LABELS[criterion].question}</p>
                  </td>
                  <td className="num text-right">{Math.round(PRIORITY_WEIGHTS[criterion] * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-line px-5 py-3 text-[12.5px] text-ink-muted">
            These weights are an internal judgement for beauty and personal care. They are not market shares and can be changed; the largest general marketplace is not ranked first automatically.
          </p>
        </Card>

        {can(ctx, 'marketplace.manage') ? (
          <Card>
            <CardHeader index="B" title="Add a platform we have not researched" description="It will be visible only to your organisation and will carry no score until it has been researched with evidence." />
            <div className="p-5">
              <CustomMarketplaceForm countries={countries.map((c) => ({ code: c.code, name: c.name }))} />
            </div>
          </Card>
        ) : null}
      </div>
    </>
  );
}

export default function MarketplacesPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <PageBoundary>
      <Marketplaces searchParams={searchParams} />
    </PageBoundary>
  );
}
