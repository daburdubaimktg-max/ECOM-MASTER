import type { Metadata } from 'next';
import Link from 'next/link';
import { PresenceForm, TrackingForm } from '@/components/marketplace/forms';
import { QualitySignals } from '@/components/marketplace/quality-signals';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, EmptyState, formatDate, Notice, PageHeader, SourceLink } from '@/components/ui/primitives';
import { Provenance } from '@/components/ui/provenance';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { DATA_ACCESS_LABELS, EVIDENCE_NATURE, IMPORTANCE_LABELS, label, MARKETPLACE_TYPE_LABELS, PLATFORM_CATEGORY_LABELS } from '@/lib/labels';
import { PRIORITY_CRITERIA, PRIORITY_CRITERIA_LABELS, PRIORITY_WEIGHTS } from '@/lib/marketplace-priority';
import { loadOrNotFound } from '@/lib/page-helpers';
import { listBrands } from '@/lib/services/brands';
import { getMarketplace } from '@/lib/services/marketplaces';

export const metadata: Metadata = { title: 'Platform' };

const LEVEL_TONE = { high: 'verified', medium: 'estimated', low: 'missing', none: 'missing', unknown: 'missing' } as const;

function Note({ title, level, children }: { title: string; level?: string | null; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 px-5 py-4 md:grid-cols-[13rem_1fr] md:gap-6">
      <dt>
        <span className="label block pt-0.5">{title}</span>
        {level ? (
          <span className="mt-1.5 inline-block">
            <Badge tone={LEVEL_TONE[level as keyof typeof LEVEL_TONE] ?? 'neutral'}>{level.replace(/_/g, ' ')}</Badge>
          </span>
        ) : null}
      </dt>
      <dd className="text-[14px] text-ink-soft">{children}</dd>
    </div>
  );
}

async function Marketplace({ params }: { params: Promise<{ marketplaceId: string }> }) {
  const ctx = await requireContext();
  const { marketplaceId } = await params;
  const detail = await loadOrNotFound(() => getMarketplace(ctx, marketplaceId));
  const { marketplace: m, evidence, sources, settings, history, presence, requirementSet } = detail;
  const brands = can(ctx, 'marketplace.manage') ? await listBrands(ctx) : [];
  const researched = m.origin === 'research';

  return (
    <>
      <PageHeader
        eyebrow={`Platform · ${detail.countryName}`}
        title={
          <span className="flex flex-wrap items-center gap-3">
            {m.name}
            {m.isTop3 ? <Badge tone="signal">Top 3 priority in {m.countryCode}</Badge> : null}
            {!researched ? <Badge tone="missing">Added by your team · not researched</Badge> : null}
            {m.status !== 'active' ? <Badge tone="estimated">{m.status.replace('_', ' ')}</Badge> : null}
          </span>
        }
        description={
          <>
            {label(PLATFORM_CATEGORY_LABELS, m.platformCategory)} · {label(MARKETPLACE_TYPE_LABELS, m.marketplaceType)}
            {m.operator ? ` · operated by ${m.operator}` : ''}
          </>
        }
        actions={
          <>
            {m.website ? <SourceLink href={m.website}>{m.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}</SourceLink> : null}
            <Link href={`/marketplaces?country=${m.countryCode}`} className="text-[13.5px] underline decoration-line-strong underline-offset-4 hover:text-signal">
              All platforms in {detail.countryName}
            </Link>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-6">
          {researched && m.priorityScores ? (
            <Card>
              <CardHeader
                index="01"
                title="Priority score"
                description="Researcher scores (1–5) with their reasons, combined with fixed weights. The total and the rank are calculated, so they can be reproduced."
                action={
                  <span className="flex items-center gap-2">
                    <span className="font-display text-[34px] leading-none font-light">{m.weightedScore?.toFixed(2)}</span>
                    <span className="num text-[12px] text-ink-muted">/ 5</span>
                    <Provenance kind="calculated" />
                  </span>
                }
              />
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Criterion</th>
                      <th className="text-right">Weight</th>
                      <th>Score</th>
                      <th>Evidence note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRIORITY_CRITERIA.map((criterion) => {
                      const entry = m.priorityScores![criterion];
                      return (
                        <tr key={criterion}>
                          <td className="font-medium whitespace-nowrap">{PRIORITY_CRITERIA_LABELS[criterion].label}</td>
                          <td className="num text-right">{Math.round(PRIORITY_WEIGHTS[criterion] * 100)}%</td>
                          <td>
                            <span className="flex items-center gap-2 whitespace-nowrap">
                              <span aria-hidden className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <span key={n} className={`h-3.5 w-2 rounded-[1px] ${n <= Math.round(entry?.score ?? 0) ? 'bg-ink' : 'bg-line'}`} />
                                ))}
                              </span>
                              <span className="num text-[12.5px]">{entry?.score ?? '—'}</span>
                            </span>
                          </td>
                          <td className="min-w-[18rem] text-[13px] text-ink-soft">{entry?.note || '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3 text-[13px] text-ink-soft">
                <span>
                  Rank <span className="num font-medium text-ink">{m.priorityRank ?? '—'}</span> in {detail.countryName} · research confidence{' '}
                  <Badge tone={LEVEL_TONE[(m.confidence ?? 'unknown') as keyof typeof LEVEL_TONE]}>{m.confidence ?? 'not stated'}</Badge>
                </span>
                <span className="label !text-[9.5px]">Researched {formatDate(m.lastResearchDate)}</span>
              </div>
              {m.priorityRationale || m.confidenceNote ? (
                <div className="space-y-2 border-t border-line px-5 py-4 text-[13.5px] text-ink-soft">
                  {m.priorityRationale ? <p>{m.priorityRationale}</p> : null}
                  {m.confidenceNote ? <p className="text-ink-muted">Confidence: {m.confidenceNote}</p> : null}
                </div>
              ) : null}
            </Card>
          ) : (
            <Notice tone="estimated" title="This platform has not been researched">
              It was added by your team, so it has no priority score, evidence or sources. Scores are only ever produced from documented research — they are never guessed.
            </Notice>
          )}

          <Card>
            <CardHeader index="02" title="Reach and importance" description="Every figure is labelled with what kind of number it is. Company-reported and third-party figures are estimates, not verified market shares." />
            {evidence.length === 0 ? (
              <EmptyState title="No reach evidence recorded">
                <span className="inline-flex items-center gap-2">
                  <Provenance kind="missing" compact /> No credible public figure was found for this platform.
                </span>
              </EmptyState>
            ) : (
              <ul className="divide-y divide-line">
                {evidence.map((item) => {
                  const nature = EVIDENCE_NATURE[item.nature] ?? { label: item.nature.replace(/_/g, ' '), dataClass: 'estimated' as const };
                  return (
                    <li key={item.id} className="px-5 py-3.5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <p className="max-w-[70ch] text-[14px] text-ink">{item.claim}</p>
                        <span className="flex shrink-0 items-center gap-1.5">
                          <Provenance kind={nature.dataClass} />
                          <Badge>{nature.label}</Badge>
                        </span>
                      </div>
                      <p className="mt-1 text-[12.5px] text-ink-muted">
                        {item.value ? <span className="num text-ink-soft">{item.value}</span> : null}
                        {item.period ? ` · ${item.period}` : ''}
                        {item.sourceUrl ? (
                          <>
                            {' · '}
                            <SourceLink href={item.sourceUrl}>{item.sourceName || 'source'}</SourceLink>
                          </>
                        ) : item.sourceName ? (
                          ` · ${item.sourceName}`
                        ) : null}
                        {item.sourceDate ? ` (${item.sourceDate})` : ''}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
            <dl className="divide-y divide-line border-t border-line">
              {m.estimatedMarketImportance ? (
                <Note title="Market importance (estimate)">
                  <span className="mb-1 flex items-center gap-2">
                    <Provenance kind="estimated" /> {label(IMPORTANCE_LABELS, m.estimatedMarketImportance)}
                  </span>
                  {m.marketImportanceNote}
                </Note>
              ) : m.marketImportanceNote ? (
                <Note title="Notes">{m.marketImportanceNote}</Note>
              ) : null}
              {m.beautyRelevance ? (
                <Note title="Beauty & personal care" level={m.beautyRelevance}>
                  {m.beautyRelevanceNote ?? '—'}
                </Note>
              ) : null}
              {m.pharmacyRelevance ? (
                <Note title="Pharmacy relevance" level={m.pharmacyRelevance}>
                  {m.pharmacyRelevanceNote ?? '—'}
                </Note>
              ) : null}
              {m.competitorPresenceLevel ? (
                <Note title="Competitor presence" level={m.competitorPresenceLevel}>
                  {m.competitorPresenceNote ?? '—'}
                </Note>
              ) : null}
              {m.productCoverageNote ? <Note title="Product coverage">{m.productCoverageNote}</Note> : null}
            </dl>
          </Card>

          <Card>
            <CardHeader index="03" title="Getting data from this platform" description="What is realistically and legitimately possible. This decides how listings here can be monitored." />
            <dl className="divide-y divide-line">
              <Note title="Main route">{label(DATA_ACCESS_LABELS, m.dataAccessMethod, 'Not assessed')}</Note>
              <Note title="Public seller API" level={m.publicSellerApi === 'yes' ? 'high' : m.publicSellerApi === 'no' ? 'low' : 'unknown'}>
                {m.apiNote ?? '—'}
                {m.apiDocsUrl ? (
                  <p className="mt-1">
                    <SourceLink href={m.apiDocsUrl}>API documentation</SourceLink>
                  </p>
                ) : null}
              </Note>
              {m.dataCollectionFeasibility ? (
                <Note title="Feasibility" level={m.dataCollectionFeasibility}>
                  {m.dataCollectionFeasibilityNote ?? '—'}
                </Note>
              ) : null}
            </dl>
          </Card>

          {requirementSet ? (
            <Card>
              <CardHeader
                index="04"
                title="Content requirements"
                description={`${requirementSet.rules.length} documented rules for ${requirementSet.set.marketplaceName} · version ${requirementSet.set.version}`}
                action={
                  <Link href={`/marketplaces/requirements/${requirementSet.set.familyKey}`} className="text-[13px] underline decoration-line-strong underline-offset-4 hover:text-signal">
                    Open the full library
                  </Link>
                }
              />
              <p className="label px-5 pt-4">Official quality scores this retailer exposes</p>
              <QualitySignals signals={requirementSet.signals} compact />
            </Card>
          ) : null}

          <Card>
            <CardHeader index="05" title="Sources" description="Where the research on this page comes from." action={<Badge>{sources.length}</Badge>} />
            {sources.length === 0 ? (
              <EmptyState title="No sources recorded" />
            ) : (
              <ol className="divide-y divide-line">
                {sources.map((source, i) => (
                  <li key={source.id} className="flex gap-3 px-5 py-2.5 text-[13px]">
                    <span className="num shrink-0 text-ink-muted">[{i + 1}]</span>
                    <span className="min-w-0">
                      <SourceLink href={source.url}>{source.title || source.url}</SourceLink>
                      <span className="text-ink-muted">
                        {source.publisher ? ` — ${source.publisher}` : ''}
                        {source.publishedDate ? `, ${source.publishedDate}` : ''}
                        {source.accessedDate ? ` · accessed ${source.accessedDate}` : ''}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader index="06" title="Your decision" description="Recorded for your organisation only; it does not change the research." />
            <div className="p-5">
              {can(ctx, 'marketplace.manage') ? (
                <TrackingForm marketplaceId={m.id} status={settings?.monitoringStatus ?? 'not_monitored'} notes={settings?.notes ?? null} />
              ) : (
                <p className="text-[13.5px] text-ink-soft">
                  {settings?.monitoringStatus === 'active' ? 'Tracked' : settings?.monitoringStatus === 'planned' ? 'Planned' : 'Not tracked'}
                  {settings?.notes ? ` — ${settings.notes}` : ''}
                </p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader index="07" title="Are our brands sold here?" description="Whether you sell here yourself or through a distributor decides which official data routes are open to you." />
            {can(ctx, 'marketplace.manage') ? (
              brands.length ? (
                <PresenceForm
                  marketplaceId={m.id}
                  brands={brands.map((b) => ({ id: b.id, name: b.name }))}
                  current={Object.fromEntries(presence.map((p) => [p.brandId, { presence: p.presence, sellingModel: p.sellingModel, notes: p.notes }]))}
                />
              ) : (
                <p className="px-5 py-4 text-[13.5px] text-ink-muted">Create a brand first.</p>
              )
            ) : presence.length ? (
              <ul className="divide-y divide-line">
                {presence.map((p) => (
                  <li key={p.brandId} className="flex items-center justify-between px-5 py-3 text-[13.5px]">
                    <span>{p.brandName}</span>
                    <Badge tone={p.presence === 'present' ? 'verified' : 'missing'}>{p.presence === 'present' ? p.sellingModel.replace(/_/g, ' ') : p.presence}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-4 text-[13.5px] text-ink-muted">Not recorded yet.</p>
            )}
          </Card>

          <Card>
            <CardHeader index="08" title="Research history" />
            {history.length ? (
              <ul className="divide-y divide-line">
                {history.map((h) => (
                  <li key={h.id} className="flex items-center justify-between px-5 py-2.5 text-[13px]">
                    <span>Research dated {formatDate(h.researchDate)}</span>
                    <span className="label !text-[9.5px]">loaded {formatDate(h.createdAt)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-4 text-[13.5px] text-ink-muted">No research has been recorded.</p>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

export default function MarketplacePage({ params }: { params: Promise<{ marketplaceId: string }> }) {
  return (
    <PageBoundary>
      <Marketplace params={params} />
    </PageBoundary>
  );
}
