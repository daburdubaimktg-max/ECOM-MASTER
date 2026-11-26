'use server';

import { refresh } from 'next/cache';
import { readSessionToken, requireContext } from '@/lib/auth/server';
import { changeOwnPassword, createPasswordResetLink } from '@/lib/services/account';
import { actionError, publicBaseUrl, str } from './_helpers';
import type { ActionState } from './_helpers';

export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  const newPassword = str(formData, 'newPassword');
  if (newPassword !== str(formData, 'confirmPassword')) {
    const message = 'The two new passwords do not match.';
    return { ok: false, error: message, fieldErrors: { confirmPassword: message } };
  }
  try {
    await changeOwnPassword(ctx, { currentPassword: str(formData, 'currentPassword'), newPassword, keepSessionToken: await readSessionToken() });
    return { ok: true, message: 'Password changed. You stay signed in here; every other device has been signed out.' };
  } catch (err) {
    return actionError(err);
  }
}

export async function createResetLinkAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    const reset = await createPasswordResetLink(ctx, str(formData, 'userId'));
    const base = await publicBaseUrl();
    refresh();
    return {
      ok: true,
      message: `Send this link to ${reset.name}. It is shown only once, works once and expires in 24 hours.`,
      data: { link: `${base}/reset/${reset.token}` },
    };
  } catch (err) {
    return actionError(err);
  }
}
