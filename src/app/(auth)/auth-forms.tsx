'use client';

import { acceptInviteAction, resetPasswordAction, setupAction, signInAction } from '@/app/actions/auth';
import { ActionForm, Field, SubmitButton, TextInput } from '@/components/ui/form';

export function SignInForm() {
  return (
    <ActionForm action={signInAction} className="space-y-4">
      <Field label="Email" name="email">
        <TextInput name="email" type="email" autoComplete="username" required autoFocus />
      </Field>
      <Field label="Password" name="password">
        <TextInput name="password" type="password" autoComplete="current-password" required />
      </Field>
      <SubmitButton pendingLabel="Signing in…" className="w-full !py-2.5">
        Sign in
      </SubmitButton>
    </ActionForm>
  );
}

export function SetupForm() {
  return (
    <ActionForm action={setupAction} className="space-y-4">
      {(state) => (
        <>
          <Field label="Company or organisation name" name="organisationName" error={state?.fieldErrors?.organisationName}>
            <TextInput name="organisationName" autoComplete="organization" required autoFocus error={state?.fieldErrors?.organisationName} />
          </Field>
          <Field label="Your name" name="name" error={state?.fieldErrors?.name}>
            <TextInput name="name" autoComplete="name" required error={state?.fieldErrors?.name} />
          </Field>
          <Field label="Work email" name="email" error={state?.fieldErrors?.email}>
            <TextInput name="email" type="email" autoComplete="username" required error={state?.fieldErrors?.email} />
          </Field>
          <Field label="Password" name="password" hint="At least 10 characters. A short sentence works well." error={state?.fieldErrors?.password}>
            <TextInput name="password" type="password" autoComplete="new-password" required minLength={10} error={state?.fieldErrors?.password} />
          </Field>
          <SubmitButton pendingLabel="Creating…" className="w-full !py-2.5">
            Create organisation
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

export function AcceptInviteForm({ token }: { token: string }) {
  return (
    <ActionForm action={acceptInviteAction} className="space-y-4">
      {(state) => (
        <>
          <input type="hidden" name="token" value={token} />
          <Field label="Your name" name="name" error={state?.fieldErrors?.name}>
            <TextInput name="name" autoComplete="name" required autoFocus error={state?.fieldErrors?.name} />
          </Field>
          <Field label="Choose a password" name="password" hint="At least 10 characters. A short sentence works well." error={state?.fieldErrors?.password}>
            <TextInput name="password" type="password" autoComplete="new-password" required minLength={10} error={state?.fieldErrors?.password} />
          </Field>
          <SubmitButton pendingLabel="Joining…" className="w-full !py-2.5">
            Join
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  return (
    <ActionForm action={resetPasswordAction} className="space-y-4">
      {(state) => (
        <>
          <input type="hidden" name="token" value={token} />
          <Field label="New password" name="password" hint="At least 10 characters. A short sentence works well." error={state?.fieldErrors?.password}>
            <TextInput name="password" type="password" autoComplete="new-password" required minLength={10} autoFocus error={state?.fieldErrors?.password} />
          </Field>
          <Field label="New password again" name="confirmPassword" error={state?.fieldErrors?.confirmPassword}>
            <TextInput name="confirmPassword" type="password" autoComplete="new-password" required minLength={10} error={state?.fieldErrors?.confirmPassword} />
          </Field>
          <SubmitButton pendingLabel="Saving…" className="w-full !py-2.5">
            Set new password
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}
