'use server';

import { refresh } from 'next/cache';
import { requireContext } from '@/lib/auth/server';
import { createInvitation, revokeInvitation, setMemberStatus, updateMember, updateOrganisationSettings } from '@/lib/services/team';
import { actionError, publicBaseUrl, str, strList } from './_helpers';
import type { ActionState } from './_helpers';

export async function inviteMemberAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    const invitation = await createInvitation(ctx, { email: str(formData, 'email'), roleKey: str(formData, 'roleKey'), brandIds: strList(formData, 'brandIds') });
    const base = await publicBaseUrl();
    refresh();
    return {
      ok: true,
      message: 'Invitation created. Copy the link below and send it to the person — it is shown only once and expires in 7 days.',
      data: { link: `${base}/invite/${invitation.token}`, email: str(formData, 'email') },
    };
  } catch (err) {
    return actionError(err);
  }
}

export async function revokeInvitationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await revokeInvitation(ctx, str(formData, 'invitationId'));
    refresh();
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function updateMemberAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await updateMember(ctx, str(formData, 'membershipId'), { roleKey: str(formData, 'roleKey'), brandIds: strList(formData, 'brandIds') });
    refresh();
    return { ok: true, message: 'Member updated.' };
  } catch (err) {
    return actionError(err);
  }
}

export async function setMemberStatusAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await setMemberStatus(ctx, str(formData, 'userId'), str(formData, 'status') === 'disabled' ? 'disabled' : 'active');
    refresh();
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function updateOrganisationAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await updateOrganisationSettings(ctx, { name: str(formData, 'name'), allowExternalAi: formData.get('allowExternalAi') === 'on' });
    refresh();
    return { ok: true, message: 'Settings saved.' };
  } catch (err) {
    return actionError(err);
  }
}
