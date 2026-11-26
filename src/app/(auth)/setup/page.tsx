import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { hasAnyOrganisation } from '@/lib/auth/session';
import { SetupForm } from '../auth-forms';

export const metadata: Metadata = { title: 'First-time setup' };

async function Gate() {
  await connection(); // always check the live database, never a pre-built copy of this page
  if (await hasAnyOrganisation()) redirect('/sign-in');
  return null;
}

export default function SetupPage() {
  return (
    <>
      <Suspense fallback={null}>
        <Gate />
      </Suspense>
      <p className="label flex items-center gap-2">
        <span aria-hidden className="inline-block h-px w-6 bg-signal" />
        First-time setup
      </p>
      <h1 className="mt-2 text-[32px] leading-tight font-normal">Create your organisation</h1>
      <p className="mt-2 mb-7 text-ink-soft">
        You will be its first Administrator. Everyone else joins by invitation, with the role you give them.
      </p>
      <SetupForm />
    </>
  );
}
