import { headers } from 'next/headers';
import { unstable_rethrow } from 'next/navigation';
import { after } from 'next/server';
import { ForbiddenError, NotFoundError, ValidationError } from '@/lib/auth/permissions';
import { ensureJobHandlers } from '@/lib/job-handlers';
import { runPendingJobs } from '@/lib/jobs';

/** What every form action returns, so forms can show a message next to the right field. */
export type ActionState = {
  ok: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
  data?: Record<string, unknown>;
} | null;

export function actionError(err: unknown): ActionState {
  unstable_rethrow(err); // let the framework handle redirects and "not found"
  if (err instanceof ValidationError) return { ok: false, error: err.message, fieldErrors: err.fieldErrors };
  if (err instanceof ForbiddenError || err instanceof NotFoundError) return { ok: false, error: err.message };
  console.error('[action] unexpected error', err);
  return { ok: false, error: 'Something went wrong on our side. Nothing was saved — please try again.' };
}

/** Start processing queued background jobs once the response has been sent. */
export function kickJobs(): void {
  after(async () => {
    try {
      ensureJobHandlers();
      await runPendingJobs();
    } catch (err) {
      console.error('[jobs] run failed', err);
    }
  });
}

export function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export function strList(formData: FormData, key: string): string[] {
  return formData.getAll(key).filter((v): v is string => typeof v === 'string' && v.length > 0);
}

/** The address people use to reach this installation, for building one-time links to hand out. */
export async function publicBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const protocol = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') || host.startsWith('127.') ? 'http' : 'https');
  return `${protocol}://${host}`;
}
