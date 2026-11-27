'use server';

import { refresh } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireContext } from '@/lib/auth/server';
import { deleteBook, saveBook, setBookStatus } from '@/lib/services/books';
import { actionError, str, strList } from './_helpers';
import type { ActionState } from './_helpers';

/** Rows of repeating fields (fonts, colours) arrive as parallel lists: fontName[], fontRole[]… */
function rows<K extends string>(formData: FormData, prefix: string, keys: K[]): Record<K, string>[] {
  const lists = keys.map((k) => formData.getAll(`${prefix}${k[0].toUpperCase()}${k.slice(1)}`).map((v) => (typeof v === 'string' ? v : '')));
  const count = Math.max(0, ...lists.map((l) => l.length));
  return Array.from({ length: count }, (_, i) => Object.fromEntries(keys.map((k, j) => [k, lists[j][i] ?? ''])) as Record<K, string>);
}

function bookInput(formData: FormData) {
  return {
    kind: str(formData, 'kind'),
    title: str(formData, 'title'),
    subtitle: str(formData, 'subtitle'),
    launchDate: str(formData, 'launchDate'),
    marketCodes: strList(formData, 'marketCodes'),
    overview: str(formData, 'overview'),
    audience: str(formData, 'audience'),
    keyMessages: str(formData, 'keyMessages'),
    toneOfVoice: str(formData, 'toneOfVoice'),
    dosAndDonts: str(formData, 'dosAndDonts'),
    fonts: rows(formData, 'font', ['name', 'role', 'usage', 'link']),
    colours: rows(formData, 'colour', ['name', 'hex', 'usage']),
    claimIds: strList(formData, 'claimIds'),
    assetIds: strList(formData, 'assetIds'),
    productIds: strList(formData, 'productIds'),
  };
}

export async function createBookAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  let id: string;
  try {
    id = await saveBook(ctx, str(formData, 'brandId'), { kind: str(formData, 'kind'), title: str(formData, 'title') });
  } catch (err) {
    return actionError(err);
  }
  redirect(`/books/${id}`);
}

export async function saveBookAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await saveBook(ctx, str(formData, 'brandId'), bookInput(formData), str(formData, 'bookId'));
    refresh();
    return { ok: true, message: 'Saved as a draft. A Brand Manager approves it when it is ready.' };
  } catch (err) {
    return actionError(err);
  }
}

export async function setBookStatusAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await setBookStatus(ctx, str(formData, 'bookId'), str(formData, 'status') === 'approved' ? 'approved' : 'draft');
    refresh();
    return { ok: true };
  } catch (err) {
    return actionError(err);
  }
}

export async function deleteBookAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireContext();
  try {
    await deleteBook(ctx, str(formData, 'bookId'));
  } catch (err) {
    return actionError(err);
  }
  redirect('/books');
}
