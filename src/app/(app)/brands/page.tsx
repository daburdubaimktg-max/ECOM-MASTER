import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, EmptyState, formatDate, LinkButton, PageHeader } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { listBrands } from '@/lib/services/brands';

export const metadata: Metadata = { title: 'Brands' };

async function Brands() {
  const ctx = await requireContext();
  const brands = await listBrands(ctx, { includeArchived: true });
  const canCreate = can(ctx, 'brand.create');
  return (
    <>
      <PageHeader
        eyebrow="Brand knowledge"
        title="Brands"
        description="Everything the engine knows about each brand: its positioning and voice, the claims it may and may not make, and its source documents."
        actions={
          canCreate ? (
            <LinkButton href="/brands/new">
              <Plus size={15} /> New brand
            </LinkButton>
          ) : null
        }
      />
      {brands.length === 0 ? (
        <div className="card">
          <EmptyState
            title="No brands yet"
            action={canCreate ? <LinkButton href="/brands/new">Create your first brand</LinkButton> : undefined}
          >
            {canCreate
              ? 'Start by creating a brand. You can then add its products, upload the brand book and record approved claims.'
              : 'You have not been given access to any brand yet. Ask your administrator.'}
          </EmptyState>
        </div>
      ) : (
        <ul className="stagger grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {brands.map((brand) => (
            <li key={brand.id}>
              <Link href={`/brands/${brand.id}`} className="card group flex h-full flex-col p-5 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ink">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-[24px] leading-tight font-normal text-ink">{brand.name}</h2>
                  <ArrowUpRight size={17} className="mt-1 shrink-0 text-line-strong transition-colors group-hover:text-signal" />
                </div>
                <p className="mt-1 min-h-[1.4rem] text-[13.5px] text-ink-muted">{brand.tagline}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {brand.isDemo ? <Badge tone="estimated">Demonstration data</Badge> : null}
                  {brand.status === 'archived' ? <Badge tone="missing">Archived</Badge> : null}
                </div>
                <dl className="mt-auto grid grid-cols-4 gap-2 border-t border-line pt-4">
                  {[
                    ['Products', brand.productCount],
                    ['Documents', brand.assetCount],
                    ['Approved claims', brand.approvedClaimCount],
                    ['To review', brand.pendingClaimCount],
                  ].map(([label, value]) => (
                    <div key={label as string}>
                      <dd className="font-display text-[26px] leading-none font-light">{value}</dd>
                      <dt className="label mt-1.5 !text-[9px]">{label}</dt>
                    </div>
                  ))}
                </dl>
                <p className="label mt-4 !text-[9.5px]">Updated {formatDate(brand.updatedAt)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function BrandsPage() {
  return (
    <PageBoundary>
      <Brands />
    </PageBoundary>
  );
}
