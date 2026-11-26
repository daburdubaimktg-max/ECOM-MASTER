import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { getPasswordResetByToken } from '@/lib/services/account';
import { ResetPasswordForm } from '../../auth-forms';

export const metadata: Metadata = { title: 'Set a new password' };

async function Reset({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  await connection(); // always check the live database: a link works once and expires
  const reset = await getPasswordResetByToken(token);
  if (!reset) {
    return (
      <>
        <h1 className="text-[30px] leading-tight font-normal">This link is not valid</h1>
        <p className="mt-3 text-ink-soft">It may have expired or been used already. Ask your administrator to create a new password-reset link.</p>
        <Link href="/sign-in" className="mt-6 inline-block underline underline-offset-4 hover:text-signal">
          Go to sign in
        </Link>
      </>
    );
  }
  return (
    <>
      <p className="label flex items-center gap-2">
        <span aria-hidden className="inline-block h-px w-6 bg-signal" />
        Password reset
      </p>
      <h1 className="mt-2 text-[30px] leading-tight font-normal">Set a new password</h1>
      <p className="mt-2 mb-7 text-ink-soft">
        For <strong className="font-medium text-ink">{reset.name}</strong> (<span className="num text-[13px]">{reset.email}</span>). You will be signed out on every device and can then sign in
        with the new password.
      </p>
      <ResetPasswordForm token={token} />
    </>
  );
}

export default function ResetPage({ params }: { params: Promise<{ token: string }> }) {
  return (
    <Suspense fallback={<div className="skeleton h-64" />}>
      <Reset params={params} />
    </Suspense>
  );
}
