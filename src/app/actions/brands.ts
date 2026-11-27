'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireContext } from '@/lib/auth/server';
import {
  addCompetitor,
  createBrand,
  deleteClaim,
  removeCompetitor,
  reviewClaim,
  saveClaim,
  saveGuideline,
  setBrandStatus,
  setGuidelineStatus,
  updateBrand,
} from '@/lib/services/brands';
import { actionError, kickJobs, str, strList } from './_helpers';
import type { ActionState } from './_helpers';

function brandInput(formData: FormData) {
  return {
    name: str(formData, 'name'),
    tagline: str(formData, 'tagline'),
    description: str(formData, 'description'),
    website: str(formData, 'website'),
    positioning: str(formData, 'positioning'),
    personality: str(formData, 'personality'),
    toneOfVoice: str(formData, 'toneOfVoice'),
    targetAudience: str(formData, 'targetAudience'),
    visualGuidelines: str(formData, 'visualGuidelines'),
  };
}

export async function createBrandAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  let brandId: string;
  try {
    brandId = (await createBrand(ctx, brandInput(formData))).id;
    kickJobs();
  } catch (err) {
    return actionError(err);
  }
  redirect(`/brands/${brandId}`);
}

export async function updateBrandAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  const brandId = str(formData, 'brandId');
  try {
    await updateBrand(ctx, brandId, brandInput(formData));
    kickJobs();
  } catch (err) {
    return actionError(err);
  }
  redirect(`/brands/${brandId}`);
}

export async function setBrandStatusAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await setBrandStatus(ctx, str(formData, 'brandId'), str(formData, 'status') === 'archived' ? 'archived' : 'active');
    refresh();
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function saveGuidelineAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await saveGuideline(
      ctx,
      str(formData, 'brandId'),
      {
        section: str(formData, 'section') as never,
        title: str(formData, 'title'),
        body: str(formData, 'body'),
        marketCodes: strList(formData, 'marketCodes'),
      },
      str(formData, 'guidelineId') || undefined,
    );
    kickJobs();
    refresh();
    return { ok: true, message: 'Guideline saved as a draft. A Brand Manager can approve it.' };
  } catch (err) {
    return actionError(err);
  }
}

export async function setGuidelineStatusAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  const status = str(formData, 'status');
  try {
    await setGuidelineStatus(ctx, str(formData, 'guidelineId'), status === 'approved' ? 'approved' : status === 'retired' ? 'retired' : 'draft');
    refresh();
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function saveClaimAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await saveClaim(
      ctx,
      str(formData, 'brandId'),
      {
        claimText: str(formData, 'claimText'),
        claimType: (str(formData, 'claimType') || 'benefit') as never,
        productId: str(formData, 'productId') || null,
        marketCodes: strList(formData, 'marketCodes'),
        substantiation: str(formData, 'substantiation'),
      },
      str(formData, 'claimId') || undefined,
    );
    kickJobs();
    refresh();
    return { ok: true, message: 'Claim recorded as unverified. It can be used in content only after it is approved.' };
  } catch (err) {
    return actionError(err);
  }
}

export async function reviewClaimAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await reviewClaim(ctx, str(formData, 'claimId'), {
      status: str(formData, 'status') as never,
      restrictionReason: str(formData, 'restrictionReason'),
    });
    refresh();
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function deleteClaimAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await deleteClaim(ctx, str(formData, 'claimId'));
    refresh();
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function addCompetitorAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await addCompetitor(ctx, str(formData, 'brandId'), {
      name: str(formData, 'name'),
      parentCompany: str(formData, 'parentCompany'),
      website: str(formData, 'website'),
      notes: str(formData, 'notes'),
    });
    refresh();
    return { ok: true, message: 'Competitor added.' };
  } catch (err) {
    return actionError(err);
  }
}

export async function removeCompetitorAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await removeCompetitor(ctx, str(formData, 'brandId'), str(formData, 'competitorId'));
    refresh();
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}
