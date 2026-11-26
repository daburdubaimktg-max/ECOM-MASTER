import { Readable } from 'node:stream';
import { NextResponse } from 'next/server';
import { ForbiddenError, NotFoundError } from '@/lib/auth/permissions';
import { getContext } from '@/lib/auth/server';
import { getAsset } from '@/lib/services/assets';
import { getStorage } from '@/lib/storage';

const INLINE_IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

/**
 * Serves a stored file to a signed-in user who is allowed to see its brand.
 * Files are always sent as downloads, except images requested with ?inline=1 (used for thumbnails).
 * Strict headers stop a browser from ever interpreting an uploaded file as a web page.
 */
export async function GET(request: Request, { params }: { params: Promise<{ assetId: string }> }) {
  const ctx = await getContext();
  if (!ctx) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  const { assetId } = await params;
  try {
    const asset = await getAsset(ctx, assetId);
    const storage = getStorage();
    const size = await storage.size(asset.storageKey);
    const inline = new URL(request.url).searchParams.get('inline') === '1' && INLINE_IMAGE_TYPES.has(asset.mimeType);
    const asciiName = asset.originalFilename.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_');
    const stream = Readable.toWeb(storage.stream(asset.storageKey)) as ReadableStream<Uint8Array>;
    return new Response(stream, {
      headers: {
        'Content-Type': inline ? asset.mimeType : 'application/octet-stream',
        'Content-Length': String(size),
        'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(asset.originalFilename)}`,
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    if (err instanceof NotFoundError || err instanceof ForbiddenError) return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    console.error('[download] unexpected error', err);
    return NextResponse.json({ error: 'The file could not be read.' }, { status: 500 });
  }
}
