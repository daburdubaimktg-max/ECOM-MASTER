import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { PrintButton } from '@/components/books/print-button';
import { requireContext } from '@/lib/auth/server';
import { loadOrNotFound } from '@/lib/page-helpers';
import { BOOK_KINDS, getBookContents } from '@/lib/services/books';
import { listCountries } from '@/lib/services/marketplaces';

export const metadata: Metadata = { title: 'Brand book' };

const lines = (value: string | null) => (value ?? '').split('\n').map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);

function Chapter({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="break-inside-avoid-page border-t border-ink/15 py-10 print:py-7">
      <p className="num text-[11px] tracking-[0.2em] text-signal">{number}</p>
      <h2 className="mt-1 font-display text-[30px] font-light leading-tight">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

async function PrintBook({ params }: { params: Promise<{ bookId: string }> }) {
  const ctx = await requireContext();
  const { bookId } = await params;
  const c = await loadOrNotFound(() => getBookContents(ctx, bookId));
  const { book, brand } = c;
  const countries = book.marketCodes?.length ? (await listCountries()).filter((x) => book.marketCodes!.includes(x.code)).map((x) => x.name) : [];
  let n = 0;
  const next = () => String(++n).padStart(2, '0');
  const messages = lines(book.keyMessages);
  const rules = lines(book.dosAndDonts);

  return (
    <article className="mx-auto max-w-[900px] px-10 py-10 print:max-w-none print:px-0 print:py-0">
      <div className="mb-8 flex items-center justify-between gap-4 print:hidden">
        <Link href={`/books/${book.id}`} className="text-[13px] underline underline-offset-4">
          ← Back to editing
        </Link>
        <PrintButton />
      </div>

      {book.status !== 'approved' ? (
        <p className="mb-6 border-l-2 border-signal bg-signal-soft px-3 py-2 text-[13px] text-signal-deep">DRAFT — not yet approved. Do not share outside the team.</p>
      ) : null}

      <header className="flex min-h-[60vh] flex-col justify-between border-b border-ink/15 pb-10 print:min-h-[85vh] print:break-after-page">
        <p className="label">{BOOK_KINDS[book.kind]} · {brand.name}</p>
        <div>
          <h1 className="font-display text-[64px] font-light leading-[1.02] tracking-tight">{book.title}</h1>
          {book.subtitle ? <p className="mt-4 max-w-[60ch] text-[19px] text-ink-soft">{book.subtitle}</p> : null}
          {book.colours.length ? (
            <div className="mt-10 flex gap-2">
              {book.colours.map((col) => (
                <span key={col.hex + col.name} className="h-5 w-16 rounded-full" style={{ background: col.hex }} />
              ))}
            </div>
          ) : null}
        </div>
        <dl className="grid grid-cols-3 gap-6 text-[13px]">
          <div>
            <dt className="label">{book.kind === 'launch_book' ? 'Launch' : 'Version'}</dt>
            <dd className="mt-1">{book.kind === 'launch_book' ? (book.launchDate ?? 'Date to be confirmed') : `Version ${book.version}`}</dd>
          </div>
          <div>
            <dt className="label">Markets</dt>
            <dd className="mt-1">{countries.length ? countries.join(', ') : 'All markets'}</dd>
          </div>
          <div>
            <dt className="label">Status</dt>
            <dd className="mt-1">{book.status === 'approved' ? `Approved ${book.approvedAt?.toISOString().slice(0, 10)}` : 'Draft'}</dd>
          </div>
        </dl>
      </header>

      {book.overview || book.audience ? (
        <Chapter number={next()} title={book.kind === 'launch_book' ? 'The launch' : 'The brand'}>
          {book.overview ? <p className="max-w-[68ch] whitespace-pre-line text-[16px] leading-relaxed" dir="auto">{book.overview}</p> : null}
          {book.audience ? (
            <div className="mt-6">
              <p className="label">Who it is for</p>
              <p className="mt-2 max-w-[68ch] whitespace-pre-line text-[15px] leading-relaxed text-ink-soft" dir="auto">{book.audience}</p>
            </div>
          ) : null}
        </Chapter>
      ) : null}

      {messages.length ? (
        <Chapter number={next()} title="Key messages">
          <ol className="space-y-4">
            {messages.map((m, i) => (
              <li key={i} className="flex gap-4 text-[19px] font-light leading-snug" dir="auto">
                <span className="num pt-1 text-[12px] text-signal">{String(i + 1).padStart(2, '0')}</span>
                {m}
              </li>
            ))}
          </ol>
        </Chapter>
      ) : null}

      {book.toneOfVoice || rules.length ? (
        <Chapter number={next()} title="How we speak">
          {book.toneOfVoice ? <p className="max-w-[68ch] whitespace-pre-line text-[15.5px] leading-relaxed" dir="auto">{book.toneOfVoice}</p> : null}
          {rules.length ? (
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {rules.map((r, i) => (
                <li key={i} className="border-l-2 border-ink/20 pl-3 text-[14px]" dir="auto">
                  {r}
                </li>
              ))}
            </ul>
          ) : null}
        </Chapter>
      ) : null}

      {book.fonts.length ? (
        <Chapter number={next()} title="Typography">
          <div className="grid gap-5 sm:grid-cols-2">
            {book.fonts.map((f, i) => (
              <div key={i} className="rounded-[6px] border border-ink/15 p-5">
                <p className="label">{f.role}</p>
                <p className="mt-2 text-[40px] leading-none" style={{ fontFamily: `"${f.name}", var(--font-display)` }}>
                  Aa
                </p>
                <p className="mt-3 text-[18px] font-medium">{f.name}</p>
                {f.usage ? <p className="mt-1 text-[13.5px] text-ink-soft">{f.usage}</p> : null}
                {f.link ? <p className="num mt-2 break-all text-[11px] text-ink-muted">{f.link}</p> : null}
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11.5px] text-ink-muted">The “Aa” sample shows the real typeface only on computers where it is installed.</p>
        </Chapter>
      ) : null}

      {book.colours.length ? (
        <Chapter number={next()} title="Colour">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {book.colours.map((col, i) => (
              <div key={i}>
                <div className="aspect-[4/3] rounded-[6px] border border-ink/10 print:[print-color-adjust:exact]" style={{ background: col.hex }} />
                <p className="mt-2 text-[14px] font-medium">{col.name}</p>
                <p className="num text-[12px] text-ink-muted">{col.hex}</p>
                {col.usage ? <p className="text-[12.5px] text-ink-soft">{col.usage}</p> : null}
              </div>
            ))}
          </div>
        </Chapter>
      ) : null}

      {c.images.length ? (
        <Chapter number={next()} title="Packshots">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
            {c.images.map((img) => (
              <figure key={img.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/assets/${img.id}/download?inline=1`} alt={img.title} className="aspect-square w-full rounded-[6px] bg-paper object-contain" />
                <figcaption className="mt-1.5 text-[12px] text-ink-muted">
                  {img.title}
                  {img.width && img.height ? ` · ${img.width}×${img.height}px` : ''}
                </figcaption>
              </figure>
            ))}
          </div>
        </Chapter>
      ) : null}

      {c.products.length ? (
        <Chapter number={next()} title={book.kind === 'launch_book' ? 'The range' : 'Products'}>
          <div className="space-y-5">
            {c.products.map((p) => (
              <div key={p.id} className="border-l-2 border-signal pl-4">
                <p className="text-[18px] font-medium">{p.name}</p>
                {p.category ? <p className="label mt-0.5">{p.category}</p> : null}
                {p.description ? <p className="mt-2 max-w-[68ch] text-[14.5px] leading-relaxed text-ink-soft" dir="auto">{p.description}</p> : null}
              </div>
            ))}
          </div>
        </Chapter>
      ) : null}

      {c.approvedClaims.length || c.restrictedClaims.length ? (
        <Chapter number={next()} title="What we say — and never say">
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="label text-verified">Approved claims</p>
              {c.approvedClaims.length ? (
                <ul className="mt-3 space-y-3">
                  {c.approvedClaims.map((cl) => (
                    <li key={cl.id} className="text-[15px]" dir="auto">
                      “{cl.claimText}”
                      <span className="mt-0.5 block text-[11.5px] text-ink-muted">{cl.marketCodes?.length ? cl.marketCodes.join(' · ') : 'All markets'}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[13.5px] text-ink-muted">No approved claims selected.</p>
              )}
            </div>
            <div>
              <p className="label text-signal-deep">Never say</p>
              {c.restrictedClaims.length ? (
                <ul className="mt-3 space-y-3">
                  {c.restrictedClaims.map((cl) => (
                    <li key={cl.id} className="text-[15px]" dir="auto">
                      <span className="line-through decoration-signal">“{cl.claimText}”</span>
                      {cl.restrictionReason ? <span className="mt-0.5 block text-[12px] text-ink-muted">{cl.restrictionReason}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-[13.5px] text-ink-muted">No restricted claims recorded.</p>
              )}
            </div>
          </div>
        </Chapter>
      ) : null}

      <footer className="border-t border-ink/15 pt-5 text-[11px] text-ink-muted">
        {brand.name} · {book.title} · version {book.version} · {book.status === 'approved' ? 'approved' : 'draft'} · produced with the Brand Intelligence Engine
      </footer>
    </article>
  );
}

export default function Page({ params }: { params: Promise<{ bookId: string }> }) {
  return (
    <Suspense fallback={<div className="p-10 text-ink-muted">Preparing the book…</div>}>
      <PrintBook params={params} />
    </Suspense>
  );
}
