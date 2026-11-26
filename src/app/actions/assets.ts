'use server';

import { refresh } from 'next/cache';
import { requireContext } from '@/lib/auth/server';
import { deleteAsset, reprocessAsset, setAssetTrust } from '@/lib/services/assets';
import { actionError, kickJobs, str } from './_helpers';
import type { ActionState } from './_helpers';

export async function setAssetTrustAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await setAssetTrust(ctx, str(formData, 'assetId'), str(formData, 'trustLevel') === 'approved_source' ? 'approved_source' : 'unverified');
    refresh();
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function reprocessAssetAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await reprocessAsset(ctx, str(formData, 'assetId'));
    kickJobs();
    refresh();
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function deleteAssetAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await deleteAsset(ctx, str(formData, 'assetId'));
    refresh();
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}
