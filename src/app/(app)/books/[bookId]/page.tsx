import type { Metadata } from 'next';
import { deleteBookAction, setBookStatusAction } from '@/app/actions/books';
import { BookEditor } from '@/components/books/book-editor';
import { InlineAction } from '@/components/ui/form';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, formatDate, LinkButton, Notice, PageHeader } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { loadOrNotFound } from '@/lib/page-helpers';
import { BOOK_KINDS, bookOptions, getBookContents } from '@/lib/services/books';
import { listCountries } from '@/lib/services/marketplaces';

export const metadata: Metadata = { title: 'Brand book' };

async function BookPage({ params }: { params: Promise<{ bookId: string }> }) {
  const ctx = await requireContext();
  const { bookId } = await params;
  const contents = await loadOrNotFound(() => getBookContents(ctx, bookId));
  const { book, brand } = contents;
  const [options, countries] = await Promise.all([bookOptions(ctx, book.brandId), listCountries()]);
  const canWrite = can(ctx, 'guideline.edit');
  const canApprove = can(ctx, 'guideline.approve');
  return (
    <>
      <PageHeader
        eyebrow={`${BOOK_KINDS[book.kind]} · ${brand.name}`}
        title={book.title}
        description={book.subtitle ?? undefined}
        actions={
          <LinkButton href={`/print/books/${book.id}`} variant="secondary">
            View and print
          </LinkButton>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <div className="p-5">
            {canWrite ? (
              <BookEditor
                book={book}
                countries={countries.map((c) => ({ code: c.code, name: c.name }))}
                claims={options.claims}
                images={options.images}
                products={options.products}
              />
            ) : (
              <p className="text-[13.5px] text-ink-muted">You can view and print this book. Editing needs the Content Editor, Brand Manager or Administrator role.</p>
            )}
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader title="Status" />
            <div className="space-y-3 p-5 text-[13.5px]">
              <p>
                <Badge tone={book.status === 'approved' ? 'verified' : 'neutral'}>{book.status === 'approved' ? 'Approved' : 'Draft'}</Badge>
                <span className="num ml-2 text-[12px] text-ink-muted">version {book.version}</span>
              </p>
              {book.status === 'approved' ? (
                <p className="text-ink-muted">
                  Approved by {contents.approverName ?? 'a former member'} on {formatDate(book.approvedAt)}.
                </p>
              ) : (
                <p className="text-ink-muted">A draft. A Brand Manager approves it when it is ready to share.</p>
              )}
              {canApprove ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {book.status === 'draft' ? (
                    <InlineAction action={setBookStatusAction} fields={{ bookId: book.id, status: 'approved' }} variant="primary">
                      Approve
                    </InlineAction>
                  ) : (
                    <InlineAction action={setBookStatusAction} fields={{ bookId: book.id, status: 'draft' }} variant="secondary">
                      Back to draft
                    </InlineAction>
                  )}
                  <InlineAction action={deleteBookAction} fields={{ bookId: book.id }} variant="danger" confirm={`Delete "${book.title}"? This cannot be undone.`}>
                    Delete
                  </InlineAction>
                </div>
              ) : null}
            </div>
          </Card>
          {contents.excludedClaims.length ? (
            <Notice tone="signal" title="Claims left out of the book">
              {contents.excludedClaims.length === 1 ? 'One claim is' : `${contents.excludedClaims.length} claims are`} no longer approved, or not valid in this book’s markets, so{' '}
              {contents.excludedClaims.length === 1 ? 'it is' : 'they are'} not printed: {contents.excludedClaims.map((c) => `“${c.claimText}”`).join(', ')}.
            </Notice>
          ) : null}
          <Notice title="Saving as PDF">Open “View and print”, then use your browser’s Print command and choose “Save as PDF”.</Notice>
        </div>
      </div>
    </>
  );
}

export default function Page({ params }: { params: Promise<{ bookId: string }> }) {
  return (
    <PageBoundary>
      <BookPage params={params} />
    </PageBoundary>
  );
}
