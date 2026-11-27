import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, EmptyState, Notice, PageHeader } from '@/components/ui/primitives';
import { Provenance } from '@/components/ui/provenance';
import { requireContext } from '@/lib/auth/server';
import { label, SOURCE_TYPE_LABELS } from '@/lib/labels';
import { firstParam } from '@/lib/page-helpers';
import type { SearchParams } from '@/lib/page-helpers';
import { listBrands } from '@/lib/services/brands';
import { knowledgeStats, searchKnowledge } from '@/lib/services/knowledge';
import type { SearchResult } from '@/lib/services/knowledge';

export const metadata: Metadata = { title: 'Knowledge Search' };

/** Turns "[[word]]" markers from the search engine into highlights. Text is never treated as HTML. */
function Highlighted({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const pattern = /\[\[([\s\S]+?)\]\]/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    parts.push(<mark key={match.index}>{match[1]}</mark>);
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

const TRUST = {
  approved: { label: 'Approved', tone: 'verified' },
  unverified: { label: 'Unverified', tone: 'estimated' },
  restricted: { label: 'Restricted — do not use', tone: 'signal' },
} as const;

function sourceHref(result: SearchResult): string {
  switch (result.sourceType) {
    case 'asset':
      return `/brands/${result.brandId}/assets`;
    case 'guideline':
      return `/brands/${result.brandId}/guidelines`;
    case 'claim':
      return `/brands/${result.brandId}/claims`;
    case 'product':
      return result.productId ? `/products/${result.productId}` : `/brands/${result.brandId}`;
    default:
      return `/brands/${result.brandId}`;
  }
}

async function Knowledge({ searchParams }: { searchParams: SearchParams }) {
  const ctx = await requireContext();
  const sp = await searchParams;
  const q = firstParam(sp.q).trim();
  const brandParam = firstParam(sp.brand);
  const approvedOnly = firstParam(sp.trust) === 'approved';
  const brands = await listBrands(ctx, { includeArchived: true });
  const brandId = brands.some((b) => b.id === brandParam) ? brandParam : '';
  const brandName = new Map(brands.map((b) => [b.id, b.name]));

  const [response, stats] = await Promise.all([
    q ? searchKnowledge(ctx, { query: q, brandId: brandId || undefined, trust: approvedOnly ? ['approved'] : undefined, limit: 15 }) : Promise.resolve(null),
    knowledgeStats(ctx, brandId || undefined),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Brand knowledge"
        title="Knowledge Search"
        description="Ask in your own words. The engine searches brand profiles, guidelines, claims, product records and every uploaded document, and always shows where each answer comes from and whether it is approved."
      />

      <form method="get" className="card mb-6 p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[16rem] flex-1">
            <label htmlFor="kq" className="label mb-1 block">
              Question or keywords
            </label>
            <input id="kq" name="q" defaultValue={q} autoFocus={!q} placeholder="e.g. which words must we avoid?  ·  ingredients of the hair oil  ·  “pure white background”" className="field-input !py-2.5 text-[15px]" />
          </div>
          <div>
            <label htmlFor="kbrand" className="label mb-1 block">
              Brand
            </label>
            <select id="kbrand" name="brand" defaultValue={brandId} className="field-input !w-auto min-w-[10rem] !py-2.5">
              <option value="">All brands</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 pb-2.5 text-[13.5px] text-ink-soft">
            <input type="checkbox" name="trust" value="approved" defaultChecked={approvedOnly} className="accent-[#16211c]" />
            Approved knowledge only
          </label>
          <button className="rounded-[4px] bg-ink px-5 py-2.5 text-[14px] font-medium text-paper hover:bg-signal">Search</button>
        </div>
      </form>

      {response ? (
        <>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13.5px] text-ink-soft">
              <span className="num">{response.results.length}</span> {response.results.length === 1 ? 'passage' : 'passages'} for <strong className="font-medium text-ink">&ldquo;{q}&rdquo;</strong>
              {response.total > response.results.length ? <> (best of {response.total})</> : null}
            </p>
            <Badge tone={response.mode === 'keyword_and_meaning' ? 'calculated' : 'missing'}>
              {response.mode === 'keyword_and_meaning' ? 'Keyword + meaning search' : 'Keyword search only'}
            </Badge>
          </div>
          {response.modeNote ? (
            <div className="mb-4">
              <Notice tone="estimated">{response.modeNote}</Notice>
            </div>
          ) : null}
          {response.results.length === 0 ? (
            <div className="card">
              <EmptyState title="Nothing found">
                The knowledge base has no passage matching this. Try different words{approvedOnly ? ', or untick “Approved knowledge only”' : ''}. If the information should exist, upload the document that contains it.
              </EmptyState>
            </div>
          ) : (
            <ol className="stagger space-y-3" data-testid="search-results">
              {response.results.map((result, i) => (
                <li key={result.id} className="card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="label flex flex-wrap items-center gap-x-2">
                        <span className="num text-signal">{String(i + 1).padStart(2, '0')}</span>
                        {label(SOURCE_TYPE_LABELS, result.sourceType)}
                        <span aria-hidden>·</span>
                        {brandName.get(result.brandId) ?? 'Brand'}
                      </p>
                      <h2 className="mt-1 font-sans text-[15.5px] font-semibold tracking-normal text-ink">
                        <Link href={sourceHref(result)} className="hover:text-signal">
                          {result.title}
                        </Link>
                        {result.locator ? <span className="num ml-2 text-[12px] font-normal text-ink-muted">{result.locator}</span> : null}
                      </h2>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Badge tone={TRUST[result.trust].tone}>{TRUST[result.trust].label}</Badge>
                      <Badge title="How this passage was found">{result.match === 'both' ? 'Keyword + meaning' : result.match === 'keyword' ? 'Keyword' : 'Meaning'}</Badge>
                    </div>
                  </div>
                  <p className="mt-3 max-w-[90ch] border-l-2 border-line pl-4 text-[14.5px] leading-relaxed whitespace-pre-line text-ink-soft" dir="auto">
                    <Highlighted text={result.snippet} />
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-[12.5px]">
                    <Link href={sourceHref(result)} className="underline decoration-line-strong underline-offset-4 hover:text-signal">
                      Open source record
                    </Link>
                    {result.assetId ? (
                      <a href={`/api/assets/${result.assetId}/download`} className="underline decoration-line-strong underline-offset-4 hover:text-signal">
                        Download original file
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <Card>
            <CardHeader index="01" title="What is in the knowledge base" description={brandId ? `For ${brandName.get(brandId)}` : 'Across the brands you can access'} action={<Provenance kind="calculated" />} />
            {stats.total === 0 ? (
              <EmptyState title="The knowledge base is empty">Create a brand, add products and upload the brand book — each becomes searchable straight away.</EmptyState>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Trust</th>
                    <th className="text-right">Passages</th>
                    <th className="text-right">Meaning-search ready</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.breakdown
                    .slice()
                    .sort((a, b) => a.sourceType.localeCompare(b.sourceType) || a.trust.localeCompare(b.trust))
                    .map((row) => (
                      <tr key={`${row.sourceType}-${row.trust}`}>
                        <td>{label(SOURCE_TYPE_LABELS, row.sourceType)}</td>
                        <td>
                          <Badge tone={TRUST[row.trust].tone}>{TRUST[row.trust].label}</Badge>
                        </td>
                        <td className="num text-right">{row.passages}</td>
                        <td className="num text-right">{row.embedded}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </Card>
          <div className="space-y-4">
            <Notice title="How search works">
              Two methods run together. <strong className="font-medium text-ink">Keyword</strong> search finds the exact words (and their grammatical forms) in English and Arabic.{' '}
              <strong className="font-medium text-ink">Meaning</strong> search finds passages that say the same thing in different words. Both run on your own server.
            </Notice>
            <Notice title="Trust labels" tone="verified">
              <span className="font-medium text-ink">Approved</span> — brand profile, approved guidelines and claims, active products, and documents a Brand Manager approved as a source.{' '}
              <span className="font-medium text-ink">Unverified</span> — everything else. <span className="font-medium text-ink">Restricted</span> — claims that must not be used.
            </Notice>
          </div>
        </div>
      )}
    </>
  );
}

export default function KnowledgePage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <PageBoundary>
      <Knowledge searchParams={searchParams} />
    </PageBoundary>
  );
}
