import type { Metadata } from 'next';
import Link from 'next/link';
import { NewBookForm } from '@/components/books/book-editor';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, EmptyState, formatDate, Notice, PageHeader } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { BOOK_KINDS, listBooks } from '@/lib/services/books';
import { listBrands } from '@/lib/services/brands';

export const metadata: Metadata = { title: 'Brand Books' };

async function Books() {
  const ctx = await requireContext();
  const [books, brands] = await Promise.all([listBooks(ctx), listBrands(ctx)]);
  const canWrite = can(ctx, 'guideline.edit');
  return (
    <>
      <PageHeader
        eyebrow="Brand knowledge"
        title="Brand Books"
        description="Put together a brand book, or a launch book for a new product, from what the engine already knows: fonts, colours, key messages, approved claims, packshots and products. Print it or save it as a PDF."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Card>
          <CardHeader index="01" title="Books" />
          {books.length === 0 ? (
            <EmptyState title="No books yet">Create a brand book for each brand, and a launch book for each new product or range.</EmptyState>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Brand</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <Link href={`/books/${b.id}`} className="font-medium underline-offset-4 hover:underline">
                        {b.title}
                      </Link>
                      <p className="text-[12px] text-ink-muted">
                        {BOOK_KINDS[b.kind]}
                        {b.launchDate ? ` · launch ${b.launchDate}` : ''}
                      </p>
                    </td>
                    <td className="text-ink-soft">{b.brandName}</td>
                    <td>
                      <Badge tone={b.status === 'approved' ? 'verified' : 'neutral'}>{b.status === 'approved' ? 'Approved' : 'Draft'}</Badge>
                      <span className="num ml-1.5 text-[11px] text-ink-muted">v{b.version}</span>
                    </td>
                    <td className="num text-[12px] text-ink-muted">{formatDate(b.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
        <div className="space-y-4">
          {canWrite && brands.length ? (
            <Card>
              <CardHeader index="02" title="Start a new book" />
              <div className="p-5">
                <NewBookForm brands={brands.map((b) => ({ id: b.id, name: b.name }))} />
              </div>
            </Card>
          ) : null}
          {canWrite && !brands.length ? <Notice title="Create a brand first">Books belong to a brand. Create one under Brands.</Notice> : null}
          <Notice title="Built from approved knowledge">
            Only approved claims can go into a book, and the brand’s restricted claims are listed automatically as “never say”. Editing an approved book returns it to draft for a Brand Manager to
            approve again.
          </Notice>
        </div>
      </div>
    </>
  );
}

export default function BooksPage() {
  return (
    <PageBoundary>
      <Books />
    </PageBoundary>
  );
}
