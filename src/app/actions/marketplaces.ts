'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireContext } from '@/lib/auth/server';
import { addCustomMarketplace, setBrandPresence, updateMarketplaceSettings } from '@/lib/services/marketplaces';
import { actionError, str } from './_helpers';
import type { ActionState } from './_helpers';

export async function updateMarketplaceSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await updateMarketplaceSettings(ctx, str(formData, 'marketplaceId'), { monitoringStatus: str(formData, 'monitoringStatus'), notes: str(formData, 'notes') });
    refresh();
    return { ok: true, message: 'Tracking decision saved.' };
  } catch (err) {
    return actionError(err);
  }
}

export async function setBrandPresenceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await setBrandPresence(ctx, {
      brandId: str(formData, 'brandId'),
      marketplaceId: str(formData, 'marketplaceId'),
      presence: str(formData, 'presence'),
      sellingModel: str(formData, 'sellingModel') || 'unknown',
      notes: str(formData, 'notes'),
    });
    refresh();
    return { ok: true, message: 'Saved.' };
  } catch (err) {
    return actionError(err);
  }
}

export async function addCustomMarketplaceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  let id: string;
  try {
    const row = await addCustomMarketplace(ctx, {
      name: str(formData, 'name'),
      countryCode: str(formData, 'countryCode'),
      website: str(formData, 'website'),
      platformCategory: str(formData, 'platformCategory') as never,
      marketplaceType: str(formData, 'marketplaceType') as never,
      notes: str(formData, 'notes'),
    });
    id = row.id;
  } catch (err) {
    return actionError(err);
  }
  redirect(`/marketplaces/${id}`);
}
