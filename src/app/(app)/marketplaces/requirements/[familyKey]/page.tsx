import type { Metadata } from 'next';
import Link from 'next/link';
import { QualitySignals } from '@/components/marketplace/quality-signals';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, EmptyState, formatDate, Notice, PageHeader, SourceLink } from '@/components/ui/primitives';
import { requireContext } from '@/lib/auth/server';
import { label, REQUIREMENT_AREA_LABELS, VERIFICATION_LABELS } from '@/lib/labels';
import { loadOrNotFound } from '@/lib/page-helpers';
import { getRequirementSetByFamily } from '@/lib/services/marketplaces';
import { REQUIREMENT_AREAS } from '@/db/schema';

export const metadata: Metadata = { title: 'Retailer requirements' };

const SEVERITY_TONE = { mandatory: 'signal', recommended: 'calculated', informational: 'neutral' } as const;

function text(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

async function Library({ params }: { params: Promise<{ familyKey: string }> }) {
  const ctx = await requireContext();
  const { familyKey } = await params;
  const { set, rules, signals, versions } = await loadOrNotFound(() => getRequirementSetByFamily(ctx, familyKey));
  const enhanced = (set.enhancedContent ?? {}) as Record<string, unknown>;
  const byArea = REQUIREMENT_AREAS.map((area) => ({ area, rules: rules.filter((r) => r.area === area) })).filter((g) => g.rules.length);

  return (
    <>
      <PageHeader
        eyebrow="Requirements library"
        title={set.marketplaceName}
        description={
          <>
            {set.categoryScope ?? 'Content requirements'} · applies to {set.appliesToCountryCodes.join(', ') || 'see individual rules'}
          </>
        }
        actions={
          <>
            <Badge tone="ink">Version {set.version}</Badge>
            <span className="label">Researched {formatDate(set.researchDate)}</span>
            <Link href="/marketplaces/requirements" className="text-[13.5px] underline decoration-line-strong underline-offset-4 hover:text-signal">
              All retailers
            </Link>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-6">
          {set.howBrandsDeliverContent ? (
            <Notice title="How brands deliver content to this retailer">{set.howBrandsDeliverContent}</Notice>
          ) : null}

          {byArea.length === 0 ? (
            <div className="card">
              <EmptyState title="No rules are publicly documented">
                This retailer does not publish its content rules outside its supplier portal. See the limitations note for what is known.
              </EmptyState>
            </div>
          ) : (
            byArea.map((group, index) => (
              <Card key={group.area}>
                <CardHeader index={String(index + 1).padStart(2, '0')} title={label(REQUIREMENT_AREA_LABELS, group.area)} action={<Badge>{group.rules.length}</Badge>} />
                <ul className="divide-y divide-line">
                  {group.rules.map((rule) => {
                    const verification = VERIFICATION_LABELS[rule.verification] ?? VERIFICATION_LABELS.unverified;
                    return (
                      <li key={rule.id} className="px-5 py-3.5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <p className="max-w-[72ch] text-[14px] text-ink">{rule.requirement}</p>
                          <div className="flex shrink-0 items-center gap-1.5">
                            {rule.value !== null ? (
                              <span className="num rounded-sm bg-ink px-1.5 py-0.5 text-[11.5px] text-paper">
                                {rule.value}
                                {rule.unit ? ` ${rule.unit}` : ''}
                              </span>
                            ) : null}
                            <Badge tone={SEVERITY_TONE[rule.severity]}>{rule.severity}</Badge>
                          </div>
                        </div>
                        {rule.notes ? <p className="mt-1.5 max-w-[80ch] text-[13px] text-ink-muted">{rule.notes}</p> : null}
                        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-ink-muted">
                          <Badge tone={verification.tone}>{verification.label}</Badge>
                          {rule.sourceUrl ? <SourceLink href={rule.sourceUrl}>{rule.sourceTitle || 'Source'}</SourceLink> : (rule.sourceTitle ?? null)}
                          {rule.sourceDate ? <span>· {rule.sourceDate}</span> : null}
                          {rule.appliesToCountryCodes.length ? <span className="num">· {rule.appliesToCountryCodes.join(' ')}</span> : null}
                          {rule.sellerType && rule.sellerType !== 'all' ? <span>· {rule.sellerType.replace(/_/g, ' ')}</span> : null}
                          {rule.effectiveDate ? <span>· effective {rule.effectiveDate}</span> : null}
                          <span className="num opacity-60">· {rule.ruleKey}</span>
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            ))
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Official quality scores" description="Scores the retailer itself publishes. The engine never invents one." />
            <QualitySignals signals={signals} />
          </Card>

          <Card>
            <CardHeader title="Enhanced content" description="The retailer's equivalent of Amazon A+ Content, if it has one." />
            <div className="space-y-2 px-5 py-4 text-[13.5px] text-ink-soft">
              <p>
                <Badge tone={enhanced.supported === 'yes' ? 'verified' : enhanced.supported === 'no' ? 'missing' : 'estimated'}>
                  {enhanced.supported === 'yes' ? 'Supported' : enhanced.supported === 'no' ? 'Not offered' : 'Not publicly documented'}
                </Badge>
                {text(enhanced.official_name) ? <span className="ml-2 font-medium text-ink">{text(enhanced.official_name)}</span> : null}
              </p>
              {text(enhanced.eligibility) ? <p>{text(enhanced.eligibility)}</p> : null}
              {text(enhanced.modules_note) ? <p className="text-ink-muted">{text(enhanced.modules_note)}</p> : null}
              {text(enhanced.source_url) ? (
                <p>
                  <SourceLink href={text(enhanced.source_url)!}>Source</SourceLink>
                </p>
              ) : null}
            </div>
          </Card>

          {set.languages.length ? (
            <Card>
              <CardHeader title="Languages" />
              <ul className="divide-y divide-line">
                {set.languages.map((language, i) => (
                  <li key={i} className="px-5 py-3 text-[13px]">
                    <p>
                      <span className="num font-medium">{language.country_code}</span> — {language.languages.join(', ').toUpperCase()}
                    </p>
                    {language.note ? <p className="mt-0.5 text-ink-muted">{language.note}</p> : null}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {set.nonOfficialTerms?.length ? (
            <Card>
              <CardHeader title="Terms that are not official" description="Commonly used names that are not this retailer's own metrics." />
              <ul className="divide-y divide-line">
                {set.nonOfficialTerms.map((term, i) => (
                  <li key={i} className="px-5 py-3 text-[13px]">
                    <p className="font-medium text-ink">{term.term}</p>
                    <p className="text-ink-muted">{term.what_it_actually_is}</p>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {set.limitations ? (
            <Notice tone="estimated" title="Limitations of this research">
              {set.limitations}
            </Notice>
          ) : null}

          <Card>
            <CardHeader title="Version history" />
            <ul className="divide-y divide-line">
              {versions.map((version) => (
                <li key={version.version} className="flex items-center justify-between px-5 py-2.5 text-[13px]">
                  <span className="num">v{version.version}</span>
                  <span className="text-ink-muted">Researched {formatDate(version.researchDate)}</span>
                  <Badge tone={version.status === 'current' ? 'verified' : 'missing'}>{version.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function LibraryPage({ params }: { params: Promise<{ familyKey: string }> }) {
  return (
    <PageBoundary>
      <Library params={params} />
    </PageBoundary>
  );
}
