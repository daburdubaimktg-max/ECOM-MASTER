import type { Metadata } from 'next';
import { BrandForm } from '@/components/brand/brand-form';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Notice, PageHeader } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';

export const metadata: Metadata = { title: 'New brand' };

async function NewBrand() {
  const ctx = await requireContext();
  return (
    <>
      <PageHeader
        eyebrow="Brand knowledge"
        title="New brand"
        description="Only the name is required now. Everything else can be filled in later — the more the engine knows, the better its content and recommendations will be."
      />
      {can(ctx, 'brand.create') ? (
        <div className="card p-6 lg:p-8">
          <BrandForm />
        </div>
      ) : (
        <Notice tone="signal" title="You cannot create brands">
          Your role does not include creating brands. Ask an Administrator or Brand Manager.
        </Notice>
      )}
    </>
  );
}

export default function NewBrandPage() {
  return (
    <PageBoundary>
      <NewBrand />
    </PageBoundary>
  );
}
