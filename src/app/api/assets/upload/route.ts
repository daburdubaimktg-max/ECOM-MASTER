import { NextResponse } from 'next/server';
import { after } from 'next/server';
import { ForbiddenError, NotFoundError, ValidationError } from '@/lib/auth/permissions';
import { assertSameOrigin, getContext } from '@/lib/auth/server';
import { env } from '@/lib/env';
import { ensureJobHandlers } from '@/lib/job-handlers';
import { runPendingJobs } from '@/lib/jobs';
import { uploadAsset } from '@/lib/services/assets';

/**
 * Receives one uploaded file. The file is checked (size, real type), stored, and — for documents —
 * queued to be read and added to the knowledge base after this response has been sent.
 */
export async function POST(request: Request) {
  const ctx = await getContext();
  if (!ctx) return NextResponse.json({ error: 'Your session has ended. Please sign in again.' }, { status: 401 });
  if (!(await assertSameOrigin(request))) return NextResponse.json({ error: 'Request not allowed from this origin.' }, { status: 403 });

  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > env.maxUploadBytes + 1024 * 1024) {
    return NextResponse.json({ error: `The file is larger than the ${Math.round(env.maxUploadBytes / 1024 / 1024)} MB limit.` }, { status: 413 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: 'The upload could not be read. Please try again.' }, { status: 400 });
  }
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Choose a file to upload.' }, { status: 400 });
  if (file.size > env.maxUploadBytes) {
    return NextResponse.json({ error: `"${file.name}" is larger than the ${Math.round(env.maxUploadBytes / 1024 / 1024)} MB limit.` }, { status: 413 });
  }

  try {
    const asset = await uploadAsset(ctx, {
      brandId: String(form.get('brandId') ?? ''),
      productId: form.get('productId') ? String(form.get('productId')) : null,
      kind: String(form.get('kind') ?? 'other'),
      title: form.get('title') ? String(form.get('title')) : null,
      filename: file.name,
      bytes: new Uint8Array(await file.arrayBuffer()),
    });
    after(async () => {
      try {
        ensureJobHandlers();
        await runPendingJobs();
      } catch (err) {
        console.error('[jobs] run failed', err);
      }
    });
    return NextResponse.json({ ok: true, asset: { id: asset.id, title: asset.title, processingStatus: asset.processingStatus } });
  } catch (err) {
    if (err instanceof ValidationError) return NextResponse.json({ error: err.message }, { status: 422 });
    if (err instanceof ForbiddenError) return NextResponse.json({ error: err.message }, { status: 403 });
    if (err instanceof NotFoundError) return NextResponse.json({ error: err.message }, { status: 404 });
    console.error('[upload] unexpected error', err);
    return NextResponse.json({ error: 'The file could not be saved. Please try again.' }, { status: 500 });
  }
}
