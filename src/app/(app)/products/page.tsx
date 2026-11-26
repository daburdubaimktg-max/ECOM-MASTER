import type { Metadata } from 'next';
import Link from 'next/link';
import { FileSpreadsheet, Plus } from 'lucide-react';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, EmptyState, LinkButton, PageHeader, Stat } from '@/components/ui/primitives';
import { Provenance } from '@/components/ui/provenance';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { firstParam } from '@/lib/page-helpers';
import type { SearchParams } from '@/lib/page-helpers';
import { listBrands } from '@/lib/services/brands';
import { catalogueStats, listProducts } from '@/lib/services/products';

export const metadata: Metadata = { title: 'Product Catalogue' };

const STATUS_TONE = { active: 'verified', draft: 'estimated', discontinued: 'missing' } as const;

async function Products({ searchParams }: { searchParams: SearchParams }) {
  const ctx = await requireContext();
  const sp = await searchParams;
  const q = firstParam(sp.q);
  const brandId = firstParam(sp.brand);
  const status = firstParam(sp.status);
  const brands = await listBrands(ctx);
  const validBrand = brands.some((b) => b.id === brandId) ? brandId : '';
  const [products, stats] = await Promise.all([listProducts(ctx, { q, brandId: validBrand || undefined, status: status || undefined }), catalogueStats(ctx)]);
  const canEdit = can(ctx, 'product.edit');
  const filtered = Boolean(q || validBrand || status);

  return (
    <>
      <PageHeader
        eyebrow="Brand knowledge"
        title="Product Catalogue"
        description="The master record of what each brand sells: product information, pack sizes, SKU codes and barcodes. This is what marketplace listings will be compared against."
        actions={
          <>
            {can(ctx, 'product.import') ? (
              <LinkButton href="/products/import" variant="secondary">
                <FileSpreadsheet size={15} /> Import from spreadsheet
              </LinkButton>
            ) : null}
            {canEdit ? (
              <LinkButton href={`/products/new${validBrand ? `?brand=${validBrand}` : ''}`}>
                <Plus size={15} /> New product
              </LinkButton>
            ) : null}
          </>
        }
      />

      <div className="stagger mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Products" value={stats.products} hint={`${stats.active} active`} marker={<Provenance kind="verified" compact />} />
        <Stat label="SKUs" value={stats.skus} hint="Sellable units, including multipacks" marker={<Provenance kind="verified" compact />} />
        <Stat label="SKUs without a barcode" value={stats.withoutGtin} hint="A barcode is the most reliable way to match a SKU to marketplace listings" marker={<Provenance kind="calculated" compact />} />
        <Stat label="Products without a description" value={stats.withoutDescription} hint="Content checks need the approved description" marker={<Provenance kind="calculated" compact />} />
      </div>

      <form method="get" className="mb-4 flex flex-wrap items-end gap-3">
        <div className="min-w-[14rem] flex-1">
          <label htmlFor="q" className="label mb-1 block">
            Find
          </label>
          <input id="q" name="q" defaultValue={q} placeholder="Product name, SKU code or barcode" className="field-input" />
        </div>
        <div>
          <label htmlFor="brand" className="label mb-1 block">
            Brand
          </label>
          <select id="brand" name="brand" defaultValue={validBrand} className="field-input !w-auto min-w-[10rem]">
            <option value="">All brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="label mb-1 block">
            Status
          </label>
          <select id="status" name="status" defaultValue={status} className="field-input !w-auto">
            <option value="">Any</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>
        <button className="rounded-[4px] border border-line-strong bg-card px-3.5 py-2 text-[13.5px] font-medium hover:border-ink">Apply</button>
        {filtered ? (
          <Link href="/products" className="py-2 text-[13px] text-ink-muted underline underline-offset-4 hover:text-ink">
            Clear
          </Link>
        ) : null}
      </form>

      <div className="card overflow-x-auto">
        {products.length === 0 ? (
          <EmptyState
            title={filtered ? 'No products match' : 'No products yet'}
            action={!filtered && canEdit ? <LinkButton href="/products/new">Add your first product</LinkButton> : undefined}
          >
            {filtered ? 'Try a different search or clear the filters.' : brands.length === 0 ? 'Create a brand first, then add its products.' : 'Add products one at a time, or import a spreadsheet with one row per SKU.'}
          </EmptyState>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Category</th>
                <th className="text-right">SKUs</th>
                <th className="text-right">With barcode</th>
                <th>Record</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const checks = [product.hasDescription, product.benefitCount > 0, product.hasIngredients, product.skuCount > 0, product.skuCount > 0 && product.gtinCount >= product.skuCount];
                const done = checks.filter(Boolean).length;
                return (
                  <tr key={product.id}>
                    <td>
                      <Link href={`/products/${product.id}`} className="font-medium text-ink hover:text-signal">
                        {product.name}
                      </Link>
                      {product.subBrand ? <p className="text-[12.5px] text-ink-muted">{product.subBrand}</p> : null}
                      {product.isDemo ? (
                        <p className="mt-1">
                          <Badge tone="estimated">Demonstration data</Badge>
                        </p>
                      ) : null}
                    </td>
                    <td className="text-ink-soft">{product.brandName}</td>
                    <td className="text-ink-soft">{product.category ?? <span className="text-ink-muted">—</span>}</td>
                    <td className="num text-right">{product.skuCount}</td>
                    <td className="num text-right">
                      {product.gtinCount}/{product.skuCount}
                    </td>
                    <td>
                      <span className="flex items-center gap-2" title="Calculated: description, benefits, ingredients, at least one SKU, every SKU has a barcode">
                        <span aria-hidden className="flex gap-0.5">
                          {checks.map((ok, i) => (
                            <span key={i} className={`h-3 w-1.5 rounded-[1px] ${ok ? 'bg-calculated' : 'bg-line'}`} />
                          ))}
                        </span>
                        <span className="num text-[12px] text-ink-muted">{done}/5</span>
                      </span>
                    </td>
                    <td>
                      <Badge tone={STATUS_TONE[product.status]}>{product.status}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {products.length ? (
        <p className="mt-3 flex items-center gap-2 text-[12.5px] text-ink-muted">
          <Provenance kind="calculated" compact /> &ldquo;Record&rdquo; counts five basics: description, benefits, ingredients, at least one SKU, and a barcode on every SKU.
        </p>
      ) : null}
    </>
  );
}

export default function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <PageBoundary>
      <Products searchParams={searchParams} />
    </PageBoundary>
  );
}
