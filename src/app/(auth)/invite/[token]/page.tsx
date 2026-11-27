import type { Metadata } from 'next';
import Link from 'next/link';
import { connection } from 'next/server';
import { Suspense } from 'react';
import { getInvitationByToken } from '@/lib/services/team';
import { AcceptInviteForm } from '../../auth-forms';

export const metadata: Metadata = { title: 'Accept invitation' };

async function Invitation({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  await connection(); // always check the live database: an invitation can expire or be withdrawn at any moment
  const invitation = await getInvitationByToken(token);
  if (!invitation) {
    return (
      <>
        <h1 className="text-[30px] leading-tight font-normal">This invitation is not valid</h1>
        <p className="mt-3 text-ink-soft">
          The link may have expired, been used already or been withdrawn. Ask your administrator to send a new one.
        </p>
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
        Invitation
      </p>
      <h1 className="mt-2 text-[30px] leading-tight font-normal">Join {invitation.organisationName}</h1>
      <p className="mt-2 mb-7 text-ink-soft">
        You have been invited as <strong className="font-medium text-ink">{invitation.roleName}</strong> with the email{' '}
        <span className="num text-[13px]">{invitation.email}</span>.
      </p>
      <AcceptInviteForm token={token} />
    </>
  );
}

export default function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  return (
    <Suspense fallback={<div className="skeleton h-64" />}>
      <Invitation params={params} />
    </Suspense>
  );
}
