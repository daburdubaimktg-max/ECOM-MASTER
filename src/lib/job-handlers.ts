import { registerJobHandler } from './jobs';

/**
 * Registers what each background job type does. Imported once by anything that runs jobs.
 * Handlers are loaded lazily so starting the app stays fast.
 */
let registered = false;

export function ensureJobHandlers(): void {
  if (registered) return;
  registered = true;

  registerJobHandler('asset.process', async (payload) => {
    const { processAsset } = await import('./services/assets');
    await processAsset(String(payload.assetId));
  });

  registerJobHandler('knowledge.embed', async (payload) => {
    const { embedPendingChunks } = await import('./services/knowledge');
    await embedPendingChunks(payload.organisationId ? String(payload.organisationId) : undefined);
  });
}
