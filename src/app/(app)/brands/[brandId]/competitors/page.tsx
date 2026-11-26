import type { Metadata } from 'next';
import { removeCompetitorAction } from '@/app/actions/brands';
import { BrandHeader } from '@/components/brand/brand-header';
import { CompetitorForm } from '@/components/brand/competitor-form';
import { InlineAction } from '@/components/ui/form';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Card, CardHeader, EmptyState, Notice, SourceLink } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { loadOrNotFound } from '@/lib/page-helpers';
import { getBrand, listCompetitors } from '@/lib/services/brands';

export const metadata: Metadata = { title: 'Competitors' };

async function Competitors({ params }: { params: Promise<{ brandId: string }> }) {
  const ctx = await requireContext();
  const { brandId } = await params;
  const brand = await loadOrNotFound(() => getBrand(ctx, brandId));
  const competitors = await listCompetitors(ctx, brand.id);
  const canManage = can(ctx, 'competitor.manage');
  return (
    <>
      <BrandHeader brand={brand} current="competitors" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Card>
          <CardHeader index="01" title="Competitor brands" description={`The brands ${brand.name} is compared against. Their product listings will be tracked when monitoring begins (Stage 3).`} />
          {competitors.length === 0 ? (
            <EmptyState title="No competitors recorded">List the brands you compete with most directly in each market.</EmptyState>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Parent company</th>
                  <th>Notes</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {competitors.map((c) => (
                  <tr key={c.id}>
                    <td className="font-medium">
                      {c.name}
                      {c.website ? (
                        <p className="text-[12.5px] font-normal">
                          <SourceLink href={c.website}>{c.website.replace(/^https?:\/\//, '')}</SourceLink>
                        </p>
                      ) : null}
                    </td>
                    <td className="text-ink-soft">{c.parentCompany ?? '—'}</td>
                    <td className="max-w-[24rem] text-ink-soft">{c.notes ?? '—'}</td>
                    <td className="text-right">
                      {canManage ? (
                        <InlineAction action={removeCompetitorAction} fields={{ brandId: brand.id, competitorId: c.id }} confirm={`Remove ${c.name} from this brand's competitors?`}>
                          Remove
                        </InlineAction>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
        <div className="space-y-4">
          {canManage ? (
            <Card>
              <CardHeader index="02" title="Add a competitor" />
              <div className="p-5">
                <CompetitorForm brandId={brand.id} />
              </div>
            </Card>
          ) : null}
          <Notice title="What comes next">
            Competitor products, prices, ratings and content comparisons belong to Competitor Intelligence (Stage 4). The list you build here is its starting point.
          </Notice>
        </div>
      </div>
    </>
  );
}

export default function CompetitorsPage({ params }: { params: Promise<{ brandId: string }> }) {
  return (
    <PageBoundary>
      <Competitors params={params} />
    </PageBoundary>
  );
}
