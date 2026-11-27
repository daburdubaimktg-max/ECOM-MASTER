import type { Metadata } from 'next';
import { ProductForm } from '@/components/product/product-form';
import { PageBoundary } from '@/components/ui/page-boundary';
import { LinkButton, Notice, PageHeader } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { firstParam } from '@/lib/page-helpers';
import type { SearchParams } from '@/lib/page-helpers';
import { listBrands } from '@/lib/services/brands';

export const metadata: Metadata = { title: 'New product' };

async function NewProduct({ searchParams }: { searchParams: SearchParams }) {
  const ctx = await requireContext();
  const brands = await listBrands(ctx);
  const preselected = firstParam((await searchParams).brand);
  return (
    <>
      <PageHeader eyebrow="Product catalogue" title="New product" description="Create the parent product first. Sizes, packs and barcodes are added as SKUs on the next screen." />
      {!can(ctx, 'product.edit') ? (
        <Notice tone="signal" title="You cannot add products">
          Your role does not include editing the product catalogue.
        </Notice>
      ) : brands.length === 0 ? (
        <Notice title="Create a brand first">
          A product always belongs to a brand. <LinkButton href="/brands/new" variant="secondary" className="ml-2">Create a brand</LinkButton>
        </Notice>
      ) : (
        <div className="card p-6 lg:p-8">
          <ProductForm brands={brands.map((b) => ({ id: b.id, name: b.name }))} product={{ brandId: brands.some((b) => b.id === preselected) ? preselected : undefined }} />
        </div>
      )}
    </>
  );
}

export default function NewProductPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <PageBoundary>
      <NewProduct searchParams={searchParams} />
    </PageBoundary>
  );
}
