'use client';

/** Shown when a page fails unexpectedly. Technical details go to the server log, not to the screen. */
export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="max-w-xl">
      <p className="label flex items-center gap-2">
        <span aria-hidden className="inline-block h-px w-6 bg-signal" />
        Something went wrong
      </p>
      <h1 className="mt-2 text-[30px] leading-tight font-normal">This page could not be shown.</h1>
      <p className="mt-3 text-ink-soft">Nothing was changed or lost. Try again; if it keeps happening, tell your administrator and quote the reference below.</p>
      {error.digest ? <p className="num mt-3 text-[12px] text-ink-muted">Reference: {error.digest}</p> : null}
      <button onClick={reset} className="mt-6 rounded-[4px] bg-ink px-4 py-2 text-[13.5px] font-medium text-paper hover:bg-signal">
        Try again
      </button>
    </div>
  );
}
