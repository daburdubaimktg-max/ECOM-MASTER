import type { Metadata } from 'next';
import { ProductForm } from '@/components/product/product-form';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Notice, PageHeader } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { loadOrNotFound } from '@/lib/page-helpers';
import { getProduct } from '@/lib/services/products';

export const metadata: Metadata = { title: 'Edit product' };

async function EditProduct({ params }: { params: Promise<{ productId: string }> }) {
  const ctx = await requireContext();
  const { productId } = await params;
  const { product, brandName } = await loadOrNotFound(() => getProduct(ctx, productId));
  return (
    <>
      <PageHeader eyebrow={brandName} title={`Edit ${product.name}`} />
      {can(ctx, 'product.edit') ? (
        <div className="card p-6 lg:p-8">
          <ProductForm brands={[]} product={product} />
        </div>
      ) : (
        <Notice tone="signal" title="You cannot edit products">
          Your role does not include editing the product catalogue.
        </Notice>
      )}
    </>
  );
}

export default function EditProductPage({ params }: { params: Promise<{ productId: string }> }) {
  return (
    <PageBoundary>
      <EditProduct params={params} />
    </PageBoundary>
  );
}
