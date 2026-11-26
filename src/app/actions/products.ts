'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { ValidationError } from '@/lib/auth/permissions';
import { requireContext } from '@/lib/auth/server';
import {
  addIdentifier,
  createProduct,
  deleteProduct,
  deleteSku,
  importProductsCsv,
  removeAttribute,
  removeIdentifier,
  saveSku,
  setAttribute,
  setAvailability,
  updateProduct,
} from '@/lib/services/products';
import { actionError, kickJobs, str, strList } from './_helpers';
import type { ActionState } from './_helpers';

function productInput(formData: FormData) {
  return {
    name: str(formData, 'name'),
    subBrand: str(formData, 'subBrand'),
    category: str(formData, 'category'),
    description: str(formData, 'description'),
    benefits: str(formData, 'benefits')
      .split('\n')
      .map((line) => line.replace(/^[\s•\-–*]+/, '').trim())
      .filter(Boolean),
    ingredients: str(formData, 'ingredients'),
    directionsForUse: str(formData, 'directionsForUse'),
    warnings: str(formData, 'warnings'),
    targetAudience: str(formData, 'targetAudience'),
    status: (str(formData, 'status') || 'draft') as 'draft' | 'active' | 'discontinued',
  };
}

export async function createProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  let productId: string;
  try {
    const brandId = str(formData, 'brandId');
    if (!brandId) throw new ValidationError('Choose the brand this product belongs to.', { brandId: 'Choose a brand.' });
    productId = (await createProduct(ctx, brandId, productInput(formData))).id;
    kickJobs();
  } catch (err) {
    return actionError(err);
  }
  redirect(`/products/${productId}`);
}

export async function updateProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  const productId = str(formData, 'productId');
  try {
    await updateProduct(ctx, productId, productInput(formData));
    kickJobs();
  } catch (err) {
    return actionError(err);
  }
  redirect(`/products/${productId}`);
}

export async function deleteProductAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await deleteProduct(ctx, str(formData, 'productId'));
  } catch (err) {
    return actionError(err);
  }
  redirect('/products');
}

export async function saveSkuAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await saveSku(
      ctx,
      str(formData, 'productId'),
      {
        skuCode: str(formData, 'skuCode'),
        variantName: str(formData, 'variantName'),
        sizeValue: str(formData, 'sizeValue'),
        sizeUnit: str(formData, 'sizeUnit'),
        packQuantity: str(formData, 'packQuantity') || 1,
        gtin: str(formData, 'gtin'),
      },
      str(formData, 'skuId') || undefined,
    );
    kickJobs();
    refresh();
    return { ok: true, message: 'SKU saved.' };
  } catch (err) {
    return actionError(err);
  }
}

export async function deleteSkuAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await deleteSku(ctx, str(formData, 'skuId'));
    kickJobs();
    refresh();
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function addIdentifierAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await addIdentifier(ctx, str(formData, 'skuId'), {
      type: str(formData, 'type') as never,
      value: str(formData, 'value'),
      countryCode: str(formData, 'countryCode'),
    });
    refresh();
    return { ok: true, message: 'Identifier added.' };
  } catch (err) {
    return actionError(err);
  }
}

export async function removeIdentifierAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await removeIdentifier(ctx, str(formData, 'identifierId'));
    refresh();
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function setAttributeAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await setAttribute(ctx, str(formData, 'productId'), { key: str(formData, 'key'), value: str(formData, 'value'), unit: str(formData, 'unit') });
    kickJobs();
    refresh();
    return { ok: true, message: 'Attribute saved.' };
  } catch (err) {
    return actionError(err);
  }
}

export async function removeAttributeAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await removeAttribute(ctx, str(formData, 'attributeId'));
    refresh();
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function setAvailabilityAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await setAvailability(ctx, str(formData, 'productId'), strList(formData, 'countryCodes'));
    refresh();
    return { ok: true, message: 'Markets saved.' };
  } catch (err) {
    return actionError(err);
  }
}

const MAX_CSV_BYTES = 3 * 1024 * 1024;

/** Step 1 (check) and step 2 (import) of the CSV import share this action; `mode` says which. */
export async function importProductsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    const brandId = str(formData, 'brandId');
    if (!brandId) throw new ValidationError('Choose the brand to import into.', { brandId: 'Choose a brand.' });
    const file = formData.get('file');
    if (!(file instanceof File) || file.size === 0) throw new ValidationError('Choose a CSV file to import.', { file: 'Choose a file.' });
    if (file.size > MAX_CSV_BYTES) throw new ValidationError('The file is larger than 3 MB. Split it into smaller files.');
    const text = new TextDecoder('utf-8').decode(await file.arrayBuffer());
    const dryRun = str(formData, 'mode') !== 'import';
    const report = await importProductsCsv(ctx, brandId, text, { dryRun });
    if (!dryRun) {
      kickJobs();
      refresh();
    }
    return { ok: true, data: { report } };
  } catch (err) {
    return actionError(err);
  }
}
