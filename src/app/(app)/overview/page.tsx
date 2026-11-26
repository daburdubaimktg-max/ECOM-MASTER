import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, formatDateTime, PageHeader, Stat } from '@/components/ui/primitives';
import { Provenance, ProvenanceLegend } from '@/components/ui/provenance';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { listAuditLog } from '@/lib/services/audit';
import { listBrands } from '@/lib/services/brands';
import { knowledgeStats } from '@/lib/services/knowledge';
import { listMarketplaces, marketplaceStats } from '@/lib/services/marketplaces';
import { catalogueStats } from '@/lib/services/products';

export const metadata: Metadata = { title: 'Overview' };

/** Metrics the specification asks for that need marketplace data which is not collected yet. */
const NOT_YET: { label: string; stage: number; note: string }[] = [
  { label: 'Listings monitored', stage: 3, note: 'Listing monitoring has not started.' },
  { label: 'Average internal listing quality score', stage: 4, note: 'Needs monitored listings to score.' },
  { label: 'Official marketplace score coverage', stage: 4, note: 'No marketplace account is connected.' },
  { label: 'Average product rating', stage: 4, note: 'No rating data through current integrations.' },
  { label: 'Review volume', stage: 4, note: 'No review data through current integrations.' },
  { label: 'Listing improvement opportunities', stage: 5, note: 'Produced by the recommendation engine.' },
  { label: 'Competitor changes', stage: 4, note: 'Competitor listings are not monitored yet.' },
  { label: 'Weekly intelligence alerts', stage: 5, note: 'Produced by scheduled automation.' },
];

async function Overview() {
  const ctx = await requireContext();
  const canMarket = can(ctx, 'marketplace.view');
  const [brands, catalogue, knowledge, market, topPlatforms, activity] = await Promise.all([
    listBrands(ctx),
    catalogueStats(ctx),
    knowledgeStats(ctx),
    canMarket ? marketplaceStats(ctx) : Promise.resolve(null),
    canMarket ? listMarketplaces(ctx, { priority: 'top3' }) : Promise.resolve([]),
    can(ctx, 'audit.view') ? listAuditLog(ctx, { limit: 8 }) : Promise.resolve([]),
  ]);
  const documents = brands.reduce((n, b) => n + b.assetCount, 0);
  const approvedClaims = brands.reduce((n, b) => n + b.approvedClaimCount, 0);
  const pendingClaims = brands.reduce((n, b) => n + b.pendingClaimCount, 0);
  const approvedPassages = knowledge.breakdown.filter((r) => r.trust === 'approved').reduce((n, r) => n + r.passages, 0);
  const firstBrand = brands[0];

  const steps = [
    { done: brands.length > 0, label: 'Create your first brand', href: '/brands/new', hint: 'Name, positioning and tone of voice.' },
    { done: catalogue.products > 0, label: 'Add products and SKUs', href: '/products', hint: 'One at a time or from a spreadsheet.' },
    { done: documents > 0, label: 'Upload the brand book', href: firstBrand ? `/brands/${firstBrand.id}/assets` : '/brands', hint: 'It becomes searchable within seconds.' },
    { done: approvedClaims > 0, label: 'Record and approve claims', href: firstBrand ? `/brands/${firstBrand.id}/claims` : '/brands', hint: 'What the brand may and may not say.' },
    { done: (market?.tracked ?? 0) > 0, label: 'Choose the marketplaces to track', href: '/marketplaces', hint: 'Start from the top three per country.' },
  ];
  const completed = steps.filter((s) => s.done).length;

  const byCountry = new Map<string, typeof topPlatforms>();
  for (const platform of topPlatforms) {
    const list = byCountry.get(platform.countryName) ?? [];
    list.push(platform);
    byCountry.set(platform.countryName, list);
  }

  return (
    <>
      <PageHeader
        eyebrow={`Overview · ${ctx.organisation.name}`}
        title={`Good to see you, ${ctx.user.name.split(' ')[0]}.`}
        description="What the engine knows today, what it does not know yet, and what to do next. Every figure is marked with where it comes from."
      />

      <div className="stagger grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Brands" value={brands.length} hint={brands.length ? brands.map((b) => b.name).slice(0, 3).join(' · ') : 'None yet'} marker={<Provenance kind="verified" compact />} />
        <Stat label="Products" value={catalogue.products} hint={`${catalogue.skus} SKUs · ${catalogue.withoutGtin} without a barcode`} marker={<Provenance kind="verified" compact />} />
        <Stat
          label="Knowledge passages"
          value={knowledge.total}
          hint={`${approvedPassages} approved · from ${documents} document${documents === 1 ? '' : 's'} and your records`}
          marker={<Provenance kind="calculated" compact />}
        />
        <Stat
          label="Marketplaces researched"
          value={market ? market.platforms : '—'}
          hint={market ? `${market.countries} countries · ${market.tracked} tracked by your team` : 'Not visible for your role'}
          marker={<Provenance kind="verified" compact />}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_25rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader
              index="01"
              title="Digital shelf metrics"
              description="These need marketplace data that is not being collected yet. They are shown as not available — never as zero."
              action={<Provenance kind="missing" />}
            />
            <ul className="grid gap-px bg-line sm:grid-cols-2">
              {NOT_YET.map((metric) => (
                <li key={metric.label} className="flex items-start justify-between gap-3 bg-card px-5 py-3.5">
                  <div>
                    <p className="text-[13.5px] font-medium text-ink">{metric.label}</p>
                    <p className="text-[12.5px] text-ink-muted">{metric.note}</p>
                  </div>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className="font-display text-[22px] leading-none text-line-strong">—</span>
                    <span className="label !text-[9px]">Stage {metric.stage}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>

          {canMarket ? (
            <Card>
              <CardHeader
                index="02"
                title="Priority platforms by country"
                description="The three highest-scoring platforms for beauty and personal care in each researched market. Scores are calculated from documented criteria; they are not market shares."
                action={
                  <Link href="/marketplaces" className="inline-flex items-center gap-1 text-[13px] underline decoration-line-strong underline-offset-4 hover:text-signal">
                    All platforms <ArrowRight size={13} />
                  </Link>
                }
              />
              {byCountry.size === 0 ? (
                <p className="px-5 py-5 text-[13.5px] text-ink-muted">Marketplace research has not been loaded yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th>1st</th>
                        <th>2nd</th>
                        <th>3rd</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...byCountry.entries()].map(([country, rows]) => (
                        <tr key={country}>
                          <td className="font-medium whitespace-nowrap">{country}</td>
                          {[0, 1, 2].map((i) => (
                            <td key={i}>
                              {rows[i] ? (
                                <>
                                  <Link href={`/marketplaces/${rows[i].id}`} className="hover:text-signal">
                                    {rows[i].name}
                                  </Link>
                                  <span className="num ml-2 text-[11.5px] text-ink-muted">{rows[i].weightedScore?.toFixed(2)}</span>
                                </>
                              ) : (
                                <span className="text-ink-muted">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          ) : null}

          <Card>
            <CardHeader index="03" title="How to read this product" description="Five markers, used everywhere." />
            <div className="p-5">
              <ProvenanceLegend />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Getting started" description={`${completed} of ${steps.length} done`} />
            <ol>
              {steps.map((step, i) => (
                <li key={step.label} className="border-b border-line last:border-b-0">
                  <Link href={step.href} className="group flex items-start gap-3 px-5 py-3.5 hover:bg-paper-deep/40">
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] ${
                        step.done ? 'border-verified bg-verified text-white' : 'border-line-strong text-ink-muted'
                      }`}
                    >
                      {step.done ? <Check size={11} strokeWidth={3} /> : <span className="num">{i + 1}</span>}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-[13.5px] font-medium ${step.done ? 'text-ink-muted line-through decoration-line-strong' : 'text-ink group-hover:text-signal'}`}>{step.label}</span>
                      <span className="block text-[12.5px] text-ink-muted">{step.hint}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </Card>

          {pendingClaims > 0 && can(ctx, 'claim.approve') ? (
            <div className="border-l-2 border-signal bg-card px-4 py-3">
              <p className="text-[13.5px] font-medium">
                {pendingClaims} claim{pendingClaims === 1 ? '' : 's'} waiting for your review
              </p>
              <p className="mt-0.5 text-[12.5px] text-ink-muted">Unverified claims are never used in content.</p>
              <ul className="mt-2 space-y-1">
                {brands
                  .filter((b) => b.pendingClaimCount > 0)
                  .map((b) => (
                    <li key={b.id}>
                      <Link href={`/brands/${b.id}/claims`} className="text-[13px] underline decoration-line-strong underline-offset-4 hover:text-signal">
                        {b.name} ({b.pendingClaimCount})
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ) : null}

          {activity.length ? (
            <Card>
              <CardHeader
                title="Recent activity"
                action={
                  <Link href="/settings/audit-log" className="text-[12.5px] underline decoration-line-strong underline-offset-4 hover:text-signal">
                    Audit log
                  </Link>
                }
              />
              <ul className="divide-y divide-line">
                {activity.map((entry) => (
                  <li key={entry.id} className="px-5 py-2.5">
                    <p className="text-[13px] text-ink-soft">{entry.summary}</p>
                    <p className="label mt-0.5 !text-[9.5px]">
                      {entry.actorLabel} · {formatDateTime(entry.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          <div className="flex items-center gap-2 text-[12.5px] text-ink-muted">
            <Badge tone="estimated">Build 1 · foundation</Badge> Stages 3–5 add monitoring, scoring, AI content and automation.
          </div>
        </div>
      </div>
    </>
  );
}

export default function OverviewPage() {
  return (
    <PageBoundary>
      <Overview />
    </PageBoundary>
  );
}
