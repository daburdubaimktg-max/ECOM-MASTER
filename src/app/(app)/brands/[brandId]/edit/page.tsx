import type { Metadata } from 'next';
import { BrandForm } from '@/components/brand/brand-form';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Notice, PageHeader } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { getBrand } from '@/lib/services/brands';
import { loadOrNotFound } from '@/lib/page-helpers';

export const metadata: Metadata = { title: 'Edit brand' };

async function EditBrand({ params }: { params: Promise<{ brandId: string }> }) {
  const ctx = await requireContext();
  const { brandId } = await params;
  const brand = await loadOrNotFound(() => getBrand(ctx, brandId));
  return (
    <>
      <PageHeader eyebrow="Brand" title={`Edit ${brand.name}`} description="Changes are recorded in the audit log and update the knowledge base immediately." />
      {can(ctx, 'brand.edit') ? (
        <div className="card p-6 lg:p-8">
          <BrandForm brand={brand} />
        </div>
      ) : (
        <Notice tone="signal" title="You cannot edit this brand">
          Your role does not include editing brand profiles.
        </Notice>
      )}
    </>
  );
}

export default function EditBrandPage({ params }: { params: Promise<{ brandId: string }> }) {
  return (
    <PageBoundary>
      <EditBrand params={params} />
    </PageBoundary>
  );
}
