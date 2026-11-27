import type { Metadata } from 'next';
import Link from 'next/link';
import { stopTrackingAction } from '@/app/actions/pricing';
import { RecordPriceForm } from '@/components/pricing/forms';
import { InlineAction } from '@/components/ui/form';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, EmptyState, formatDate, Notice, PageHeader, SourceLink } from '@/components/ui/primitives';
import { Provenance } from '@/components/ui/provenance';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { loadOrNotFound } from '@/lib/page-helpers';
import { currencyFor, getPriceItem, PRICE_SOURCES, unitPrice } from '@/lib/services/pricing';

export const metadata: Metadata = { title: 'Price history' };

async function PriceItem({ params }: { params: Promise<{ listingId: string }> }) {
  const ctx = await requireContext();
  const { listingId } = await params;
  const { row, history } = await loadOrNotFound(() => getPriceItem(ctx, listingId));
  const canManage = can(ctx, 'marketplace.manage');
  const currency = row.latest?.currencyCode ?? (await currencyFor(row.countryCode)) ?? '';
  return (
    <>
      <PageHeader
        eyebrow={`Pricing · ${row.marketplaceName} · ${row.countryCode}`}
        title={`${row.ownership === 'competitor' ? `${row.competitorName} — ` : ''}${row.name}`}
        description={row.detail || undefined}
        actions={
          <Link href="/pricing" className="text-[13px] underline underline-offset-4">
            Price board
          </Link>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="space-y-6">
          {canManage ? (
            <Card>
              <CardHeader index="01" title="Record a price" description="Each price is kept as a dated record. Nothing is overwritten." />
              <div className="p-5">
                <RecordPriceForm listingId={row.listingId} currency={currency} sources={PRICE_SOURCES} />
              </div>
            </Card>
          ) : null}
          <Card>
            <CardHeader index="02" title="Price history" action={<Provenance kind="verified" />} />
            {history.length === 0 ? (
              <EmptyState title="No price recorded yet">The price for this product on {row.marketplaceName} has not been recorded. It is shown as not recorded — never as zero.</EmptyState>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Seen</th>
                    <th className="text-right">Price paid</th>
                    <th className="text-right">Regular</th>
                    <th className="text-right">Per unit</th>
                    <th>Promotion</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => {
                    const paid = h.salePrice ?? h.listPrice;
                    const per = unitPrice(paid, row.size);
                    const raw = (h.raw ?? {}) as { source?: keyof typeof PRICE_SOURCES; enteredBy?: string; note?: string };
                    return (
                      <tr key={h.id}>
                        <td className="num text-[12.5px]">{formatDate(h.observedAt)}</td>
                        <td className="num text-right font-medium">
                          {h.currencyCode} {paid?.toFixed(2)}
                        </td>
                        <td className="num text-right text-ink-muted">{h.salePrice !== null ? `${h.currencyCode} ${h.listPrice?.toFixed(2)}` : '—'}</td>
                        <td className="num text-right text-[12.5px]">{per !== null ? `${h.currencyCode} ${per.toFixed(2)}` : '—'}</td>
                        <td className="text-[13px] text-ink-soft">{h.promotionText ?? (h.salePrice !== null ? 'Promotional price' : '—')}</td>
                        <td className="text-[12.5px] text-ink-muted">
                          {raw.source ? PRICE_SOURCES[raw.source] : 'Recorded by your team'}
                          {raw.enteredBy ? ` · ${raw.enteredBy}` : ''}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader title="About this product" />
            <dl className="space-y-3 p-5 text-[13.5px]">
              <div>
                <dt className="label">Whose</dt>
                <dd className="mt-1">{row.ownership === 'own' ? <Badge tone="ink">Ours — {row.brandName}</Badge> : <Badge tone="estimated">Competitor of {row.brandName}</Badge>}</dd>
              </div>
              <div>
                <dt className="label">Compared per</dt>
                <dd className="mt-1">{row.size ? row.size.base.label.replace('per ', '') : 'No comparable pack size recorded'}</dd>
              </div>
              {row.url ? (
                <div>
                  <dt className="label">Product page</dt>
                  <dd className="mt-1 break-all">
                    <SourceLink href={row.url}>{row.url.replace(/^https?:\/\//, '')}</SourceLink>
                  </dd>
                </div>
              ) : null}
            </dl>
          </Card>
          {row.ownership === 'competitor' && row.priceIndex !== null ? (
            <Notice title="Price index">
              <span className="num">{row.priceIndex.toFixed(0)}</span> — per unit we are {row.priceIndex >= 100 ? `${(row.priceIndex - 100).toFixed(0)}% dearer` : `${(100 - row.priceIndex).toFixed(0)}% cheaper`} than this
              product on {row.marketplaceName}, using the latest recorded price of each.
            </Notice>
          ) : null}
          {canManage ? (
            <InlineAction action={stopTrackingAction} fields={{ listingId: row.listingId }} confirm="Remove this product from the price board? Its price history is kept." variant="danger">
              Stop tracking
            </InlineAction>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default function PriceItemPage({ params }: { params: Promise<{ listingId: string }> }) {
  return (
    <PageBoundary>
      <PriceItem params={params} />
    </PageBoundary>
  );
}
