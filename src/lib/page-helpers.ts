import 'server-only';
import { notFound } from 'next/navigation';
import { ForbiddenError, NotFoundError } from '@/lib/auth/permissions';

/**
 * Loads a record for a page. "Does not exist" and "exists but you may not see it" both show the
 * same not-found page, so the existence of records is never revealed to people without access.
 */
export async function loadOrNotFound<T>(load: () => Promise<T>): Promise<T> {
  try {
    return await load();
  } catch (err) {
    if (err instanceof NotFoundError || err instanceof ForbiddenError) notFound();
    throw err;
  }
}

export function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export type SearchParams = Promise<Record<string, string | string[] | undefined>>;
