'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireContext } from '@/lib/auth/server';
import { recordPrice, stopTracking, trackCompetitorProduct, trackOwnSku } from '@/lib/services/pricing';
import { actionError, str } from './_helpers';
import type { ActionState } from './_helpers';

export async function trackPriceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    if (str(formData, 'whose') === 'competitor') {
      await trackCompetitorProduct(ctx, {
        brandId: str(formData, 'brandId'),
        competitorId: str(formData, 'competitorId'),
        name: str(formData, 'name'),
        sizeValue: str(formData, 'sizeValue') || null,
        sizeUnit: str(formData, 'sizeUnit'),
        packQuantity: str(formData, 'packQuantity') || 1,
        comparableSkuId: str(formData, 'comparableSkuId') || null,
        marketplaceId: str(formData, 'marketplaceId'),
        externalId: str(formData, 'externalId'),
        url: str(formData, 'url'),
      });
    } else {
      await trackOwnSku(ctx, { skuId: str(formData, 'skuId'), marketplaceId: str(formData, 'marketplaceId'), externalId: str(formData, 'externalId'), url: str(formData, 'url') });
    }
    refresh();
    return { ok: true, message: 'Added to the price board. Record its first price from the board.' };
  } catch (err) {
    return actionError(err);
  }
}

export async function recordPriceAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await recordPrice(ctx, str(formData, 'listingId'), {
      observedOn: str(formData, 'observedOn'),
      currencyCode: str(formData, 'currencyCode'),
      listPrice: str(formData, 'listPrice'),
      salePrice: str(formData, 'salePrice'),
      promotionText: str(formData, 'promotionText'),
      source: str(formData, 'source'),
      note: str(formData, 'note'),
    });
    refresh();
    return { ok: true, message: 'Price recorded.' };
  } catch (err) {
    return actionError(err);
  }
}

export async function stopTrackingAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await stopTracking(ctx, str(formData, 'listingId'));
  } catch (err) {
    return actionError(err);
  }
  redirect('/pricing');
}
