import type { Metadata } from 'next';
import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { setBrandStatusAction } from '@/app/actions/brands';
import { BrandHeader } from '@/components/brand/brand-header';
import { InlineAction } from '@/components/ui/form';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Card, CardHeader, LinkButton, SourceLink } from '@/components/ui/primitives';
import { Provenance } from '@/components/ui/provenance';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { loadOrNotFound } from '@/lib/page-helpers';
import { getBrand, listBrands } from '@/lib/services/brands';
import { knowledgeStats } from '@/lib/services/knowledge';

export const metadata: Metadata = { title: 'Brand profile' };

const FIELDS = [
  { key: 'description', label: 'What the brand is' },
  { key: 'positioning', label: 'Positioning' },
  { key: 'personality', label: 'Personality' },
  { key: 'toneOfVoice', label: 'Tone of voice' },
  { key: 'targetAudience', label: 'Target audience' },
  { key: 'visualGuidelines', label: 'Visual guidelines' },
] as const;

async function BrandProfile({ params }: { params: Promise<{ brandId: string }> }) {
  const ctx = await requireContext();
  const { brandId } = await params;
  const brand = await loadOrNotFound(() => getBrand(ctx, brandId));
  const [stats, summaries] = await Promise.all([knowledgeStats(ctx, brand.id), listBrands(ctx, { includeArchived: true })]);
  const summary = summaries.find((b) => b.id === brand.id);
  const filled = FIELDS.filter((f) => brand[f.key]).length;
  const approvedPassages = stats.breakdown.filter((r) => r.trust === 'approved').reduce((n, r) => n + r.passages, 0);

  return (
    <>
      <BrandHeader
        brand={brand}
        current="profile"
        actions={
          can(ctx, 'brand.edit') ? (
            <LinkButton href={`/brands/${brand.id}/edit`} variant="secondary">
              <Pencil size={14} /> Edit profile
            </LinkButton>
          ) : null
        }
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <CardHeader
            index="01"
            title="Brand profile"
            description="Written and maintained by your Brand Managers. This is treated as approved brand knowledge."
            action={<Provenance kind="verified" title="Entered and maintained by your Brand Managers." />}
          />
          <dl className="divide-y divide-line">
            {FIELDS.map((field) => (
              <div key={field.key} className="grid gap-1 px-5 py-4 md:grid-cols-[12rem_1fr] md:gap-6">
                <dt className="label pt-1">{field.label}</dt>
                <dd className="text-[14.5px] whitespace-pre-line text-ink">
                  {brand[field.key] ?? (
                    <span className="inline-flex items-center gap-2 text-ink-muted">
                      <Provenance kind="missing" compact /> Not written yet
                    </span>
                  )}
                </dd>
              </div>
            ))}
            {brand.website ? (
              <div className="grid gap-1 px-5 py-4 md:grid-cols-[12rem_1fr] md:gap-6">
                <dt className="label pt-1">Website</dt>
                <dd>
                  <SourceLink href={brand.website}>{brand.website}</SourceLink>
                </dd>
              </div>
            ) : null}
          </dl>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader index="02" title="Readiness" description="How much the engine has to work with." action={<Provenance kind="calculated" />} />
            <ul className="divide-y divide-line text-[13.5px]">
              {[
                ['Profile sections written', `${filled} of ${FIELDS.length}`, `/brands/${brand.id}/edit`],
                ['Products', String(summary?.productCount ?? 0), `/products?brand=${brand.id}`],
                ['Approved claims', String(summary?.approvedClaimCount ?? 0), `/brands/${brand.id}/claims`],
                ['Claims awaiting review', String(summary?.pendingClaimCount ?? 0), `/brands/${brand.id}/claims`],
                ['Documents & media', String(summary?.assetCount ?? 0), `/brands/${brand.id}/assets`],
              ].map(([label, value, href]) => (
                <li key={label}>
                  <Link href={href} className="flex items-center justify-between px-5 py-2.5 hover:bg-paper-deep/40">
                    <span className="text-ink-soft">{label}</span>
                    <span className="num text-ink">{value}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader index="03" title="Knowledge base" description="Searchable passages held for this brand." action={<Provenance kind="calculated" />} />
            <div className="px-5 py-4">
              <p className="font-display text-[38px] leading-none font-light">{stats.total}</p>
              <p className="mt-1.5 text-[12.5px] text-ink-muted">
                passages · {approvedPassages} approved · {stats.embedded} ready for meaning-based search
              </p>
              <form action="/knowledge" method="get" className="mt-4 flex gap-2">
                <input type="hidden" name="brand" value={brand.id} />
                <input name="q" placeholder={`Search ${brand.name}…`} aria-label={`Search ${brand.name}`} className="field-input !py-1.5 text-[13px]" />
                <button className="rounded-[4px] bg-ink px-3 text-[13px] text-paper hover:bg-signal">Search</button>
              </form>
            </div>
          </Card>

          {can(ctx, 'brand.archive') ? (
            <div className="flex justify-end">
              <InlineAction
                action={setBrandStatusAction}
                fields={{ brandId: brand.id, status: brand.status === 'active' ? 'archived' : 'active' }}
                variant="ghost"
                confirm={brand.status === 'active' ? `Archive ${brand.name}? It is hidden from lists but nothing is deleted.` : undefined}
              >
                {brand.status === 'active' ? 'Archive this brand' : 'Restore this brand'}
              </InlineAction>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

export default function BrandPage({ params }: { params: Promise<{ brandId: string }> }) {
  return (
    <PageBoundary>
      <BrandProfile params={params} />
    </PageBoundary>
  );
}
