import path from 'node:path';

/**
 * All runtime configuration in one place. Nothing here is ever sent to the browser.
 * See docs/guides/setup.md for what each setting means.
 */
export const env = {
  /** PostgreSQL connection string. When empty, the app uses its built-in embedded database (development mode). */
  get databaseUrl(): string | undefined {
    const v = process.env.DATABASE_URL?.trim();
    return v ? v : undefined;
  },
  /** Folder for the embedded database and locally stored uploads. */
  get dataDir(): string {
    return path.resolve(/* turbopackIgnore: true */ process.env.BIE_DATA_DIR?.trim() || '.data');
  },
  /** Use a throw-away in-memory database (automated tests). */
  get inMemoryDb(): boolean {
    return process.env.BIE_DB_MEMORY === '1';
  },
  get isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  },
  /** 'local' | 'none' — which embedding provider powers semantic search. */
  get embeddingsProvider(): 'local' | 'none' {
    const v = (process.env.EMBEDDINGS_PROVIDER || 'local').trim().toLowerCase();
    return v === 'none' ? 'none' : 'local';
  },
  get maxUploadBytes(): number {
    const mb = Number(process.env.MAX_UPLOAD_MB || 50);
    return (Number.isFinite(mb) && mb > 0 ? mb : 50) * 1024 * 1024;
  },
  /** Shared secret that lets an external scheduler (cron, n8n) trigger background work. */
  /** Run background work every five minutes inside the app itself (single-computer installations). */
  get builtInScheduler(): boolean {
    return process.env.BUILT_IN_SCHEDULER?.trim().toLowerCase() === 'true';
  },
  get jobsSecret(): string | undefined {
    const v = process.env.JOBS_SECRET?.trim();
    return v ? v : undefined;
  },
};
