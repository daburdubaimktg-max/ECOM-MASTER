import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md">
        <p className="label flex items-center gap-2">
          <span aria-hidden className="inline-block h-px w-6 bg-signal" />
          Not found
        </p>
        <h1 className="mt-2 text-[34px] leading-tight font-normal">This page does not exist — or you do not have access to it.</h1>
        <p className="mt-3 text-ink-soft">If you expected to see something here, ask an administrator to check your role and the brands you are assigned to.</p>
        <Link href="/overview" className="mt-6 inline-block rounded-[4px] bg-ink px-4 py-2 text-[13.5px] font-medium text-paper hover:bg-signal">
          Go to the overview
        </Link>
      </div>
    </main>
  );
}
