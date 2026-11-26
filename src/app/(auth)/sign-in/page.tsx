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

export default function SignInPage() {
  return (
    <>
      <Suspense fallback={null}>
        <Gate />
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
