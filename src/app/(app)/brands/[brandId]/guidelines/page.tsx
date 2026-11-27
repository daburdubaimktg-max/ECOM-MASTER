import type { Metadata } from 'next';
import { setGuidelineStatusAction } from '@/app/actions/brands';
import { BrandHeader } from '@/components/brand/brand-header';
import { GuidelineForm } from '@/components/brand/guideline-form';
import { InlineAction } from '@/components/ui/form';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, EmptyState, formatDate, Notice } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { GUIDELINE_SECTION_LABELS as SECTION_LABELS } from '@/lib/labels';
import { loadOrNotFound } from '@/lib/page-helpers';
import { getBrand, listGuidelines } from '@/lib/services/brands';
import { listCountries } from '@/lib/services/marketplaces';

export const metadata: Metadata = { title: 'Brand guidelines' };

async function Guidelines({ params }: { params: Promise<{ brandId: string }> }) {
  const ctx = await requireContext();
  const { brandId } = await params;
  const brand = await loadOrNotFound(() => getBrand(ctx, brandId));
  const [guidelines, countries] = await Promise.all([listGuidelines(ctx, brand.id), listCountries()]);
  const canEdit = can(ctx, 'guideline.edit');
  const canApprove = can(ctx, 'guideline.approve');
  const live = guidelines.filter((g) => g.status !== 'retired');
  const retired = guidelines.filter((g) => g.status === 'retired');

  return (
    <>
      <BrandHeader brand={brand} current="guidelines" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <Card>
          <CardHeader
            index="01"
            title="Guidelines"
            description="Specific rules for how the brand communicates. Only approved guidelines are treated as authoritative; editing one returns it to draft until it is approved again."
          />
          {live.length === 0 ? (
            <EmptyState title="No guidelines yet">Add the rules a copywriter must follow — tone, words to avoid, how to name products, language rules per market.</EmptyState>
          ) : (
            <ul className="divide-y divide-line">
              {live.map((g) => (
                <li key={g.id} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="label">{SECTION_LABELS[g.section] ?? g.section}</p>
                      <h3 className="mt-0.5 font-sans text-[15px] font-semibold tracking-normal text-ink">{g.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={g.status === 'approved' ? 'verified' : 'estimated'}>{g.status === 'approved' ? 'Approved' : 'Draft'}</Badge>
                      <span className="num text-[11px] text-ink-muted">v{g.version}</span>
                    </div>
                  </div>
                  <p className="mt-2 max-w-[75ch] text-[14px] whitespace-pre-line text-ink-soft">{g.body}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="label !text-[9.5px]">
                      {g.marketCodes?.length ? `Markets: ${g.marketCodes.join(', ')}` : 'All markets'} · Updated {formatDate(g.updatedAt)}
                      {g.approvedAt ? ` · Approved ${formatDate(g.approvedAt)}` : ''}
                    </p>
                    {canApprove ? (
                      <div className="flex gap-1">
                        {g.status !== 'approved' ? (
                          <InlineAction action={setGuidelineStatusAction} fields={{ guidelineId: g.id, status: 'approved' }} variant="secondary">
                            Approve
                          </InlineAction>
                        ) : (
                          <InlineAction action={setGuidelineStatusAction} fields={{ guidelineId: g.id, status: 'draft' }}>
                            Back to draft
                          </InlineAction>
                        )}
                        <InlineAction action={setGuidelineStatusAction} fields={{ guidelineId: g.id, status: 'retired' }} confirm="Retire this guideline? It will no longer be used.">
                          Retire
                        </InlineAction>
                      </div>
                    ) : null}
                  </div>
                  {canEdit ? (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-[12.5px] text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink">Edit wording</summary>
                      <div className="mt-3 rounded border border-line bg-paper/60 p-4">
                        <GuidelineForm brandId={brand.id} countries={countries} guideline={{ id: g.id, section: g.section, title: g.title, body: g.body, marketCodes: g.marketCodes }} />
                      </div>
                    </details>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
          {retired.length ? (
            <details className="border-t border-line px-5 py-3">
              <summary className="label cursor-pointer">Retired guidelines ({retired.length})</summary>
              <ul className="mt-2 space-y-1.5 text-[13px] text-ink-muted">
                {retired.map((g) => (
                  <li key={g.id} className="flex items-center justify-between gap-3">
                    <span>
                      {g.title} <span className="num text-[11px]">v{g.version}</span>
                    </span>
                    {canApprove ? (
                      <InlineAction action={setGuidelineStatusAction} fields={{ guidelineId: g.id, status: 'draft' }}>
                        Restore as draft
                      </InlineAction>
                    ) : null}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </Card>

        <div>
          {canEdit ? (
            <Card>
              <CardHeader index="02" title="Add a guideline" description="Saved as a draft for a Brand Manager to approve." />
              <div className="p-5">
                <GuidelineForm brandId={brand.id} countries={countries} />
              </div>
            </Card>
          ) : (
            <Notice title="Read-only">Your role can read guidelines but not change them.</Notice>
          )}
        </div>
      </div>
    </>
  );
}

export default function GuidelinesPage({ params }: { params: Promise<{ brandId: string }> }) {
  return (
    <PageBoundary>
      <Guidelines params={params} />
    </PageBoundary>
  );
}
