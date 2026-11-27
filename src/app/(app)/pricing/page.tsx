import type { Metadata } from 'next';
import Link from 'next/link';
import { TrackForm } from '@/components/pricing/forms';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, EmptyState, formatDate, Notice, PageHeader, Stat } from '@/components/ui/primitives';
import { Provenance } from '@/components/ui/provenance';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { firstParam } from '@/lib/page-helpers';
import type { SearchParams } from '@/lib/page-helpers';
import { listPriceBoard, listPricingMarketplaces, pricingFormOptions } from '@/lib/services/pricing';
import type { PriceRow } from '@/lib/services/pricing';

export const metadata: Metadata = { title: 'Pricing Intelligence' };

const money = (value: number, currency: string) => `${currency} ${value.toFixed(2)}`;

function Change({ row }: { row: PriceRow }) {
  if (!row.latest || row.previousPrice === null) return <span className="text-ink-muted">—</span>;
  const diff = row.latest.price - row.previousPrice;
  if (Math.abs(diff) < 0.005) return <span className="text-ink-muted">No change</span>;
  const pct = (diff / row.previousPrice) * 100;
  return (
    <span className={diff > 0 ? 'text-signal-deep' : 'text-verified'}>
      {diff > 0 ? '▲' : '▼'} {Math.abs(pct).toFixed(1)}%
    </span>
  );
}

function IndexCell({ row }: { row: PriceRow }) {
  if (row.ownership === 'own') return <span className="text-ink-muted">—</span>;
  if (row.priceIndex === null) return <span className="text-[12px] text-ink-muted">{row.indexNote ?? '—'}</span>;
  const diff = row.priceIndex - 100;
  return (
    <span>
      <span className="num font-medium">{row.priceIndex.toFixed(0)}</span>
      <span className="block text-[12px] text-ink-muted">
        {Math.abs(diff) < 1 ? 'Same price per unit' : `We are ${Math.abs(diff).toFixed(0)}% ${diff > 0 ? 'dearer' : 'cheaper'}`}
        {row.indexNote ? ` · ${row.indexNote}` : ''}
      </span>
    </span>
  );
}

async function Pricing({ searchParams }: { searchParams: SearchParams }) {
  const ctx = await requireContext();
  const sp = await searchParams;
  const brandId = firstParam(sp.brand);
  const country = firstParam(sp.country);
  const canManage = can(ctx, 'marketplace.manage');
  const [rows, options, markets] = await Promise.all([listPriceBoard(ctx, { brandId: brandId || undefined, countryCode: country || undefined }), pricingFormOptions(ctx), listPricingMarketplaces(ctx)]);
  const countries = [...new Set(markets.map((m) => m.countryCode))];
  const priced = rows.filter((r) => r.latest);
  const compared = rows.filter((r) => r.priceIndex !== null);
  const onPromotion = priced.filter((r) => r.latest?.salePrice !== null && r.latest?.salePrice !== undefined);

  return (
    <>
      <PageHeader
        eyebrow="Market"
        title="Pricing Intelligence"
        description="What your products and your competitors’ cost on each marketplace, how prices move, and who is cheaper per 100 ml or 100 g. Every price is dated and shows where it came from; nothing is estimated."
      />

      <div className="stagger mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Products on the board" value={rows.length} hint={`${rows.filter((r) => r.ownership === 'own').length} ours · ${rows.filter((r) => r.ownership === 'competitor').length} competitors`} marker={<Provenance kind="verified" compact />} />
        <Stat label="With a recorded price" value={priced.length} hint={rows.length - priced.length ? `${rows.length - priced.length} not recorded yet` : 'All have a price'} marker={<Provenance kind="verified" compact />} />
        <Stat label="On promotion now" value={onPromotion.length} hint="Latest price is a promotional price" marker={<Provenance kind="verified" compact />} />
        <Stat label="Like-for-like comparisons" value={compared.length} hint="Competitor vs our SKU, same marketplace and currency" marker={<Provenance kind="calculated" compact />} />
      </div>

      <form method="get" className="mb-5 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="brand" className="label mb-1 block">
            Brand
          </label>
          <select id="brand" name="brand" defaultValue={brandId} className="field-input !w-auto">
            <option value="">All brands</option>
            {options.brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="country" className="label mb-1 block">
            Country
          </label>
          <select id="country" name="country" defaultValue={country} className="field-input !w-auto">
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <button className="rounded-[4px] border border-line-strong bg-card px-3.5 py-2 text-[13.5px] font-medium hover:border-ink">Apply</button>
      </form>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Card>
          <CardHeader index="01" title="Price board" description="Our SKUs, each followed by the competitor products compared with it. Open a row to record a price or see its history." />
          {rows.length === 0 ? (
            <EmptyState title="Nothing on the price board yet">
              Add one of your SKUs and a competitor product on the same marketplace, then record what each costs. The board then shows who is cheaper per 100 ml or 100 g.
            </EmptyState>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Marketplace</th>
                    <th className="text-right">Latest price</th>
                    <th className="text-right">Per unit</th>
                    <th>Change</th>
                    <th>Price index</th>
                    <th>Seen</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.listingId} data-testid="price-row">
                      <td className={row.ownership === 'competitor' ? 'pl-8' : ''}>
                        <Link href={`/pricing/${row.listingId}`} className="font-medium underline-offset-4 hover:underline">
                          {row.ownership === 'competitor' ? `${row.competitorName} — ` : ''}
                          {row.name}
                        </Link>
                        <p className="text-[12px] text-ink-muted">
                          {row.ownership === 'own' ? <Badge tone="ink">Ours</Badge> : <Badge tone="estimated">Competitor</Badge>} {row.detail}
                        </p>
                      </td>
                      <td className="text-ink-soft">
                        {row.marketplaceName}
                        <span className="num ml-1 text-[11px] text-ink-muted">{row.countryCode}</span>
                      </td>
                      <td className="text-right">
                        {row.latest ? (
                          <>
                            <span className="num font-medium">{money(row.latest.price, row.latest.currencyCode)}</span>
                            {row.latest.salePrice !== null ? <span className="num block text-[12px] text-ink-muted line-through">{money(row.latest.listPrice ?? 0, row.latest.currencyCode)}</span> : null}
                          </>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[12.5px] text-ink-muted">
                            <Provenance kind="missing" compact /> Not recorded
                          </span>
                        )}
                      </td>
                      <td className="text-right">
                        {row.unitPrice !== null && row.latest ? (
                          <span className="num text-[13px]" title={row.size?.base.label}>
                            {money(row.unitPrice, row.latest.currencyCode)}
                            <span className="block text-[11px] text-ink-muted">{row.size?.base.label}</span>
                          </span>
                        ) : (
                          <span className="text-ink-muted">—</span>
                        )}
                      </td>
                      <td className="text-[13px]">
                        <Change row={row} />
                      </td>
                      <td className="text-[13px]">
                        <IndexCell row={row} />
                      </td>
                      <td className="num text-[12px] text-ink-muted">{row.latest ? formatDate(row.latest.observedAt) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <div className="space-y-4">
          {canManage ? (
            <Card>
              <CardHeader index="02" title="Add a product to track" description="Ours or a competitor’s, on one marketplace." />
              <div className="p-5">
                <TrackForm brands={options.brands.map((b) => ({ id: b.id, label: b.name }))} skus={options.skus} competitors={options.competitors} markets={markets} />
              </div>
            </Card>
          ) : null}
          <Notice title="How to read the price index">
            Our price per 100 ml (or 100 g, or per item) divided by the competitor’s, × 100. <strong>Above 100</strong>: we are dearer. <strong>Below 100</strong>: we are cheaper. It is only shown when
            both products are on the same marketplace, in the same currency, with comparable pack sizes.
          </Notice>
          <Notice title="Where the prices come from">
            Today prices are recorded by your team from a website check, a seller-portal report or a distributor. When marketplace connections arrive (Stage 3) they will add prices automatically,
            labelled with their own source, and both kinds will sit side by side in the same history.
          </Notice>
        </div>
      </div>
    </>
  );
}

export default function PricingPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <PageBoundary>
      <Pricing searchParams={searchParams} />
    </PageBoundary>
  );
}
