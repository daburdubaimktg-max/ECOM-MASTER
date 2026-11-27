import type { Metadata } from 'next';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { deleteProductAction, deleteSkuAction, removeAttributeAction, removeIdentifierAction } from '@/app/actions/products';
import { AttributeForm, AvailabilityForm, IdentifierForm, SkuForm } from '@/components/product/sku-forms';
import { InlineAction } from '@/components/ui/form';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, EmptyState, formatDate, LinkButton, Notice, PageHeader } from '@/components/ui/primitives';
import { Provenance } from '@/components/ui/provenance';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { loadOrNotFound } from '@/lib/page-helpers';
import { listClaims } from '@/lib/services/brands';
import { listCountries } from '@/lib/services/marketplaces';
import { getProduct } from '@/lib/services/products';

export const metadata: Metadata = { title: 'Product' };

const STATUS_TONE = { active: 'verified', draft: 'estimated', discontinued: 'missing' } as const;
const IDENTIFIER_LABELS: Record<string, string> = {
  gtin: 'Barcode',
  asin: 'ASIN',
  marketplace_sku: 'Marketplace ID',
  manufacturer_part_number: 'Part no.',
  other: 'Other',
};

function Missing({ children = 'Not recorded' }: { children?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-ink-muted">
      <Provenance kind="missing" compact /> {children}
    </span>
  );
}

async function Product({ params }: { params: Promise<{ productId: string }> }) {
  const ctx = await requireContext();
  const { productId } = await params;
  const { product, brandName, skus, attributes, availability } = await loadOrNotFound(() => getProduct(ctx, productId));
  const [countries, claims] = await Promise.all([listCountries(), listClaims(ctx, product.brandId, { productId: product.id })]);
  const canEdit = can(ctx, 'product.edit');
  const countryName = new Map(countries.map((c) => [c.code, c.name]));

  return (
    <>
      <PageHeader
        eyebrow={`Product · ${brandName}`}
        title={
          <span className="flex flex-wrap items-center gap-3">
            {product.name}
            <Badge tone={STATUS_TONE[product.status]}>{product.status}</Badge>
            {product.isDemo ? <Badge tone="estimated">Demonstration data</Badge> : null}
          </span>
        }
        description={[product.subBrand, product.category].filter(Boolean).join(' · ') || undefined}
        actions={
          <>
            <Link href={`/brands/${product.brandId}`} className="text-[13.5px] underline decoration-line-strong underline-offset-4 hover:text-signal">
              {brandName} brand profile
            </Link>
            {canEdit ? (
              <LinkButton href={`/products/${product.id}/edit`} variant="secondary">
                <Pencil size={14} /> Edit
              </LinkButton>
            ) : null}
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader index="01" title="Product information" description={`Master record · last updated ${formatDate(product.updatedAt)}`} action={<Provenance kind="verified" title="Entered and maintained by your team." />} />
            <dl className="divide-y divide-line">
              <div className="grid gap-1 px-5 py-4 md:grid-cols-[11rem_1fr] md:gap-6">
                <dt className="label pt-1">Description</dt>
                <dd className="whitespace-pre-line">{product.description ?? <Missing />}</dd>
              </div>
              <div className="grid gap-1 px-5 py-4 md:grid-cols-[11rem_1fr] md:gap-6">
                <dt className="label pt-1">Benefits</dt>
                <dd>
                  {product.benefits.length ? (
                    <ul className="space-y-1">
                      {product.benefits.map((benefit) => (
                        <li key={benefit} className="flex gap-2">
                          <span aria-hidden className="text-signal">
                            —
                          </span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Missing />
                  )}
                </dd>
              </div>
              <div className="grid gap-1 px-5 py-4 md:grid-cols-[11rem_1fr] md:gap-6">
                <dt className="label pt-1">Ingredients</dt>
                <dd className="whitespace-pre-line">{product.ingredients ?? <Missing />}</dd>
              </div>
              <div className="grid gap-1 px-5 py-4 md:grid-cols-[11rem_1fr] md:gap-6">
                <dt className="label pt-1">Directions for use</dt>
                <dd className="whitespace-pre-line">{product.directionsForUse ?? <Missing />}</dd>
              </div>
              {product.warnings ? (
                <div className="grid gap-1 px-5 py-4 md:grid-cols-[11rem_1fr] md:gap-6">
                  <dt className="label pt-1">Warnings</dt>
                  <dd className="whitespace-pre-line">{product.warnings}</dd>
                </div>
              ) : null}
              <div className="grid gap-1 px-5 py-4 md:grid-cols-[11rem_1fr] md:gap-6">
                <dt className="label pt-1">Target audience</dt>
                <dd>{product.targetAudience ?? <Missing />}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <CardHeader
              index="02"
              title="Pack sizes and SKUs"
              description="Each sellable unit, including multipacks, is one SKU with its own code and barcode. Barcodes are how the engine recognises the same product across retailers."
            />
            {skus.length === 0 ? (
              <EmptyState title="No SKUs yet">Add each size and pack you sell.</EmptyState>
            ) : (
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>SKU code</th>
                      <th>Variant</th>
                      <th>Size</th>
                      <th>Pack</th>
                      <th>Identifiers</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {skus.map((sku) => (
                      <tr key={sku.id}>
                        <td className="num font-medium">{sku.skuCode}</td>
                        <td>{sku.variant.name}</td>
                        <td className="num whitespace-nowrap">{sku.variant.sizeValue ? `${Number(sku.variant.sizeValue)} ${sku.variant.sizeUnit ?? ''}` : '—'}</td>
                        <td className="whitespace-nowrap">{sku.packQuantity > 1 ? <Badge tone="calculated">× {sku.packQuantity} multipack</Badge> : 'Single'}</td>
                        <td>
                          {sku.identifiers.length === 0 ? (
                            <Missing>No barcode</Missing>
                          ) : (
                            <ul className="space-y-1">
                              {sku.identifiers.map((identifier) => (
                                <li key={identifier.id} className="flex flex-wrap items-center gap-2">
                                  <span className="label !text-[9.5px]">{IDENTIFIER_LABELS[identifier.type] ?? identifier.type}</span>
                                  <span className="num text-[13px]">{identifier.value}</span>
                                  {identifier.countryCode ? <span className="num text-[11px] text-ink-muted">{identifier.countryCode}</span> : null}
                                  {identifier.type === 'gtin' && identifier.checkDigitValid ? (
                                    <Badge tone="calculated" title="The barcode's check digit is mathematically valid. This does not prove it is registered with GS1.">
                                      Check digit valid
                                    </Badge>
                                  ) : null}
                                  {canEdit ? (
                                    <InlineAction action={removeIdentifierAction} fields={{ identifierId: identifier.id }} confirm="Remove this identifier?" title="Remove identifier">
                                      ×
                                    </InlineAction>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          )}
                          {canEdit ? (
                            <details className="mt-1.5">
                              <summary className="cursor-pointer text-[12px] text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink">Add identifier</summary>
                              <IdentifierForm skuId={sku.id} />
                            </details>
                          ) : null}
                        </td>
                        <td className="text-right">
                          {canEdit ? (
                            <InlineAction action={deleteSkuAction} fields={{ skuId: sku.id }} confirm={`Delete SKU ${sku.skuCode}?`}>
                              Delete
                            </InlineAction>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {canEdit ? (
              <div className="border-t border-line bg-paper/50 p-5">
                <p className="label mb-3">Add a SKU</p>
                <SkuForm productId={product.id} />
              </div>
            ) : null}
          </Card>

          <Card>
            <CardHeader index="03" title="Attributes" description="Structured facts retailers ask for — hair type, scent, skin type, country of origin, shelf life." />
            {attributes.length ? (
              <table className="data-table">
                <tbody>
                  {attributes.map((attribute) => (
                    <tr key={attribute.id}>
                      <td className="label w-56 !py-3">{attribute.key}</td>
                      <td>
                        {attribute.value}
                        {attribute.unit ? ` ${attribute.unit}` : ''}
                      </td>
                      <td className="text-right">
                        {canEdit ? (
                          <InlineAction action={removeAttributeAction} fields={{ attributeId: attribute.id }} confirm={`Remove "${attribute.key}"?`}>
                            Remove
                          </InlineAction>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="No attributes yet" />
            )}
            {canEdit ? (
              <div className="border-t border-line bg-paper/50 p-5">
                <AttributeForm productId={product.id} />
              </div>
            ) : null}
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader index="04" title="Markets" description="Where this product is sold." />
            <div className="p-5">
              {canEdit ? (
                <AvailabilityForm productId={product.id} countries={countries} selected={availability.map((a) => a.countryCode)} />
              ) : availability.length ? (
                <ul className="space-y-1 text-[13.5px]">
                  {availability.map((a) => (
                    <li key={a.id}>{countryName.get(a.countryCode) ?? a.countryCode}</li>
                  ))}
                </ul>
              ) : (
                <Missing>No markets recorded</Missing>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader index="05" title="Claims for this product" action={<Badge>{claims.length}</Badge>} />
            {claims.length ? (
              <ul className="divide-y divide-line">
                {claims.map(({ claim }) => (
                  <li key={claim.id} className="px-5 py-3">
                    <p className="text-[13.5px]">&ldquo;{claim.claimText}&rdquo;</p>
                    <p className="mt-1">
                      <Badge tone={claim.status === 'approved' ? 'verified' : claim.status === 'restricted' ? 'signal' : 'estimated'}>{claim.status}</Badge>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-4 text-[13.5px] text-ink-muted">No claims are linked to this product yet.</p>
            )}
            <div className="border-t border-line px-5 py-3">
              <Link href={`/brands/${product.brandId}/claims`} className="text-[13px] underline decoration-line-strong underline-offset-4 hover:text-signal">
                Manage claims
              </Link>
            </div>
          </Card>

          <Notice title="Marketplace listings">
            Listings, official and internal quality scores, reviews and competitor products for this SKU will appear here once listing monitoring starts (Stages 3–4). No listing data has been collected yet.
          </Notice>

          {can(ctx, 'product.delete') ? (
            <div className="flex justify-end">
              <InlineAction action={deleteProductAction} fields={{ productId: product.id }} variant="danger" confirm={`Delete "${product.name}" and all its SKUs? This cannot be undone.`}>
                Delete product
              </InlineAction>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
  return (
    <PageBoundary>
      <Product params={params} />
    </PageBoundary>
  );
}
