import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { getContext } from '@/lib/auth/server';
import { hasAnyOrganisation } from '@/lib/auth/session';
import { SignInForm } from '../auth-forms';

export const metadata: Metadata = { title: 'Sign in' };

async function Gate() {
  await connection(); // always check the live database, never a pre-built copy of this page
  if (!(await hasAnyOrganisation())) redirect('/setup');
  if (await getContext()) redirect('/overview');
  return null;
}

async function ResetNotice({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  if (sp.reset !== 'done') return null;
  return (
    <p role="status" className="mb-5 border-l-2 border-verified bg-verified-soft px-3 py-2 text-[13px] text-verified">
      Your password has been changed. Sign in with the new one.
    </p>
  );
}

export default function SignInPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <>
      <Suspense fallback={null}>
        <Gate />
      </Suspense>
      <Suspense fallback={null}>
        <ResetNotice searchParams={searchParams} />
      </Suspense>
      <p className="label flex items-center gap-2">
        <span aria-hidden className="inline-block h-px w-6 bg-signal" />
        Welcome back
      </p>
      <h1 className="mt-2 text-[32px] leading-tight font-normal">Sign in</h1>
      <p className="mt-2 mb-7 text-ink-soft">Use the email and password for your organisation&rsquo;s workspace.</p>
      <SignInForm />
      <p className="mt-6 text-[12.5px] text-ink-muted">No account? Access is by invitation only — ask your administrator for an invitation link.</p>
    </>
  );
}
