import type { Metadata } from 'next';
import Link from 'next/link';
import { deleteClaimAction } from '@/app/actions/brands';
import { BrandHeader } from '@/components/brand/brand-header';
import { ClaimForm, ClaimReview } from '@/components/brand/claim-forms';
import { InlineAction } from '@/components/ui/form';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, EmptyState, formatDate, Notice } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { CLAIM_TYPE_LABELS } from '@/lib/labels';
import { loadOrNotFound } from '@/lib/page-helpers';
import { getBrand, listClaims } from '@/lib/services/brands';
import { listCountries } from '@/lib/services/marketplaces';
import { listProducts } from '@/lib/services/products';

export const metadata: Metadata = { title: 'Brand claims' };

const STATUS = {
  approved: { title: 'Approved claims', tone: 'verified', blurb: 'May be used in content for the markets listed.' },
  unverified: { title: 'Awaiting review', tone: 'estimated', blurb: 'Proposed but not yet approved. Never used in generated content.' },
  restricted: { title: 'Restricted claims', tone: 'signal', blurb: 'Must not be used. Content is checked against these.' },
} as const;

async function Claims({ params }: { params: Promise<{ brandId: string }> }) {
  const ctx = await requireContext();
  const { brandId } = await params;
  const brand = await loadOrNotFound(() => getBrand(ctx, brandId));
  const [claims, countries, products] = await Promise.all([listClaims(ctx, brand.id), listCountries(), listProducts(ctx, { brandId: brand.id })]);
  const canPropose = can(ctx, 'claim.propose');
  const canApprove = can(ctx, 'claim.approve');

  return (
    <>
      <BrandHeader brand={brand} current="claims" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="space-y-6">
          {(['unverified', 'approved', 'restricted'] as const).map((status, i) => {
            const rows = claims.filter((c) => c.claim.status === status);
            const meta = STATUS[status];
            return (
              <Card key={status}>
                <CardHeader index={`0${i + 1}`} title={meta.title} description={meta.blurb} action={<Badge tone={meta.tone}>{rows.length}</Badge>} />
                {rows.length === 0 ? (
                  <EmptyState title={status === 'unverified' ? 'Nothing waiting for review' : status === 'approved' ? 'No approved claims yet' : 'No restricted claims recorded'}>
                    {status === 'restricted'
                      ? 'Record the claims your regulatory or legal team has ruled out, so that people and AI are both warned.'
                      : status === 'approved'
                        ? 'Propose claims, then have a Brand Manager approve them.'
                        : undefined}
                  </EmptyState>
                ) : (
                  <ul className="divide-y divide-line">
                    {rows.map(({ claim, productName, reviewerName }) => (
                      <li key={claim.id} className="px-5 py-4">
                        <p className="font-display text-[19px] leading-snug text-ink">&ldquo;{claim.claimText}&rdquo;</p>
                        {claim.status === 'restricted' && claim.restrictionReason ? (
                          <p className="mt-1.5 border-l-2 border-signal pl-3 text-[13px] text-signal-deep">Reason: {claim.restrictionReason}</p>
                        ) : null}
                        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <Badge>{CLAIM_TYPE_LABELS[claim.claimType] ?? claim.claimType}</Badge>
                          <span className="text-[12.5px] text-ink-muted">
                            {productName ? (
                              <>
                                Product:{' '}
                                <Link href={`/products/${claim.productId}`} className="underline decoration-line-strong underline-offset-2 hover:text-signal">
                                  {productName}
                                </Link>
                              </>
                            ) : (
                              'Whole brand'
                            )}
                            {' · '}
                            {claim.marketCodes?.length ? `Markets: ${claim.marketCodes.join(', ')}` : 'All markets'}
                          </span>
                        </div>
                        {claim.substantiation ? <p className="mt-2 text-[13px] text-ink-soft">Substantiation: {claim.substantiation}</p> : null}
                        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                          <p className="label !text-[9.5px]">
                            {claim.reviewedAt ? `Reviewed by ${reviewerName ?? 'a former member'} on ${formatDate(claim.reviewedAt)}` : `Proposed ${formatDate(claim.createdAt)}`}
                          </p>
                          <div className="flex flex-wrap items-start justify-end gap-1">
                            {canApprove ? <ClaimReview claimId={claim.id} status={claim.status} /> : null}
                            {canApprove || (canPropose && claim.status === 'unverified' && claim.createdBy === ctx.user.id) ? (
                              <InlineAction action={deleteClaimAction} fields={{ claimId: claim.id }} confirm="Delete this claim? This is recorded in the audit log.">
                                Delete
                              </InlineAction>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          {canPropose ? (
            <Card>
              <CardHeader index="04" title="Propose a claim" description="New claims always start as unverified." />
              <div className="p-5">
                <ClaimForm brandId={brand.id} countries={countries} products={products.map((p) => ({ id: p.id, name: p.name }))} />
              </div>
            </Card>
          ) : null}
          <Notice title="Why claims are controlled">
            When the engine writes product content it may only use approved claims that are valid for the target market, and it is checked against the restricted list. It never invents benefits or ingredients.
          </Notice>
        </div>
      </div>
    </>
  );
}

export default function ClaimsPage({ params }: { params: Promise<{ brandId: string }> }) {
  return (
    <PageBoundary>
      <Claims params={params} />
    </PageBoundary>
  );
}
