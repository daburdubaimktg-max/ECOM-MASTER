'use client';

import { useState } from 'react';
import { changePasswordAction, createResetLinkAction } from '@/app/actions/account';
import { inviteMemberAction, updateMemberAction, updateOrganisationAction } from '@/app/actions/settings';
import { ActionForm, Field, SelectInput, SubmitButton, TextInput } from '@/components/ui/form';

type RoleOption = { key: string; name: string; description: string; isExternal: boolean };
type BrandOption = { id: string; name: string };

export function OrganisationForm({ name, allowExternalAi, canEdit }: { name: string; allowExternalAi: boolean; canEdit: boolean }) {
  return (
    <ActionForm action={updateOrganisationAction} className="space-y-5">
      {(state) => (
        <>
          <Field label="Organisation name" name="name" error={state?.fieldErrors?.name}>
            <TextInput name="name" defaultValue={name} required maxLength={120} disabled={!canEdit} />
          </Field>
          <fieldset className="rounded-[4px] border border-line-strong bg-white p-4">
            <legend className="px-1 text-[13px] font-medium">External AI processing</legend>
            <label className="flex items-start gap-3">
              <input type="checkbox" name="allowExternalAi" defaultChecked={allowExternalAi} disabled={!canEdit} className="mt-1 accent-[#16211c]" />
              <span className="text-[13.5px] text-ink-soft">
                <span className="font-medium text-ink">Allow brand content to be sent to an external AI provider</span>
                <br />
                Off by default. While off, documents and brand knowledge are processed only on this server and AI content generation (Stage 5) stays disabled. Switch on only after your
                organisation has approved the provider&rsquo;s data handling terms. Every change is recorded in the audit log.
              </span>
            </label>
          </fieldset>
          {canEdit ? <SubmitButton>Save settings</SubmitButton> : <p className="text-[12.5px] text-ink-muted">Only Administrators can change these settings.</p>}
        </>
      )}
    </ActionForm>
  );
}

function BrandChecks({ brands, selected = [] }: { brands: BrandOption[]; selected?: string[] }) {
  if (!brands.length) return <p className="text-[12.5px] text-ink-muted">No brands exist yet.</p>;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
      {brands.map((brand) => (
        <label key={brand.id} className="flex items-center gap-1.5 text-[13px] text-ink-soft">
          <input type="checkbox" name="brandIds" value={brand.id} defaultChecked={selected.includes(brand.id)} className="accent-[#16211c]" />
          {brand.name}
        </label>
      ))}
    </div>
  );
}

export function InviteForm({ roles, brands }: { roles: RoleOption[]; brands: BrandOption[] }) {
  const [roleKey, setRoleKey] = useState('viewer');
  const [copied, setCopied] = useState(false);
  const role = roles.find((r) => r.key === roleKey);
  return (
    <ActionForm action={inviteMemberAction} className="space-y-4" successMessage={false}>
      {(state) => {
        const link = state?.ok ? (state.data?.link as string | undefined) : undefined;
        return (
          <>
            <Field label="Email" name="email" error={state?.fieldErrors?.email}>
              <TextInput name="email" type="email" required placeholder="name@company.com" error={state?.fieldErrors?.email} />
            </Field>
            <Field label="Role" name="roleKey" hint={role?.description}>
              <SelectInput name="roleKey" value={roleKey} onChange={(e) => setRoleKey(e.target.value)}>
                {roles.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.name}
                    {r.isExternal ? ' (external)' : ''}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <fieldset>
              <legend className="mb-1.5 flex w-full items-baseline justify-between text-[13px] font-medium">
                <span>Limit to brands</span>
                <span className="label !text-[9.5px]">{role?.isExternal ? 'Required for external roles' : 'None ticked = all brands'}</span>
              </legend>
              <div className="rounded-[4px] border border-line-strong bg-white px-3 py-2.5">
                <BrandChecks brands={brands} />
              </div>
              {state?.fieldErrors?.brandIds ? <p className="mt-1 text-[12.5px] text-signal-deep">{state.fieldErrors.brandIds}</p> : null}
            </fieldset>
            <SubmitButton pendingLabel="Creating…">Create invitation link</SubmitButton>
            {link ? (
              <div className="border-l-2 border-verified bg-verified-soft px-3 py-3" data-testid="invite-link-box">
                <p className="text-[13px] text-verified">{state?.message}</p>
                <div className="mt-2 flex gap-2">
                  <input readOnly value={link} aria-label="Invitation link" data-testid="invite-link" onFocus={(e) => e.currentTarget.select()} className="field-input num !py-1.5 text-[12px]" />
                  <button
                    type="button"
                    onClick={() => {
                      void navigator.clipboard?.writeText(link).then(() => setCopied(true));
                    }}
                    className="shrink-0 rounded-[4px] bg-ink px-3 text-[12.5px] text-paper hover:bg-signal"
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            ) : null}
          </>
        );
      }}
    </ActionForm>
  );
}

export function MemberRoleForm({
  membershipId,
  roleKey,
  brandIds,
  roles,
  brands,
}: {
  membershipId: string;
  roleKey: string;
  brandIds: string[];
  roles: RoleOption[];
  brands: BrandOption[];
}) {
  return (
    <ActionForm action={updateMemberAction} className="space-y-3">
      <input type="hidden" name="membershipId" value={membershipId} />
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="label mb-1 block" htmlFor={`role-${membershipId}`}>
            Role
          </label>
          <select id={`role-${membershipId}`} name="roleKey" defaultValue={roleKey} className="field-input !w-auto !py-1.5 text-[13px]">
            {roles.map((r) => (
              <option key={r.key} value={r.key}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <SubmitButton variant="secondary" className="!py-1.5 !text-[12.5px]">
          Save
        </SubmitButton>
      </div>
      <div>
        <p className="label mb-1">Limit to brands (none ticked = all brands)</p>
        <BrandChecks brands={brands} selected={brandIds} />
      </div>
    </ActionForm>
  );
}

/** A one-time link, shown once, with a copy button. */
function OneTimeLink({ link, label, testId }: { link: string; label: string; testId: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-2 flex gap-2">
      <input readOnly value={link} aria-label={label} data-testid={testId} onFocus={(e) => e.currentTarget.select()} className="field-input num !py-1.5 text-[12px]" />
      <button
        type="button"
        onClick={() => {
          void navigator.clipboard?.writeText(link).then(() => setCopied(true));
        }}
        className="shrink-0 rounded-[4px] bg-ink px-3 text-[12.5px] text-paper hover:bg-signal"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

export function ChangePasswordForm() {
  return (
    <ActionForm action={changePasswordAction} className="space-y-4" resetOnSuccess>
      {(state) => (
        <>
          <Field label="Current password" name="currentPassword" error={state?.fieldErrors?.currentPassword}>
            <TextInput name="currentPassword" type="password" autoComplete="current-password" required error={state?.fieldErrors?.currentPassword} />
          </Field>
          <Field label="New password" name="newPassword" hint="At least 10 characters. A short sentence works well." error={state?.fieldErrors?.newPassword}>
            <TextInput name="newPassword" type="password" autoComplete="new-password" required minLength={10} error={state?.fieldErrors?.newPassword} />
          </Field>
          <Field label="New password again" name="confirmPassword" error={state?.fieldErrors?.confirmPassword}>
            <TextInput name="confirmPassword" type="password" autoComplete="new-password" required minLength={10} error={state?.fieldErrors?.confirmPassword} />
          </Field>
          <SubmitButton pendingLabel="Changing…">Change password</SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

/** Administrators: create a one-time password-reset link for a team member. */
export function ResetLinkForm({ userId, name }: { userId: string; name: string }) {
  return (
    <ActionForm action={createResetLinkAction} successMessage={false}>
      {(state) => {
        const link = state?.ok ? (state.data?.link as string | undefined) : undefined;
        return (
          <>
            <input type="hidden" name="userId" value={userId} />
            <SubmitButton variant="secondary" pendingLabel="Creating…" className="!py-1.5 !text-[12.5px]">
              Create password-reset link
            </SubmitButton>
            <p className="mt-1.5 max-w-[34rem] text-[12px] text-ink-muted">For when {name} has forgotten their password. You send them the link; they choose a new password themselves.</p>
            {link ? (
              <div className="mt-2 border-l-2 border-verified bg-verified-soft px-3 py-3" data-testid="reset-link-box">
                <p className="text-[13px] text-verified">{state?.message}</p>
                <OneTimeLink link={link} label="Password-reset link" testId="reset-link" />
              </div>
            ) : null}
          </>
        );
      }}
    </ActionForm>
  );
}
