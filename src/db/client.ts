import fs from 'node:fs';
import path from 'node:path';
import type { PgDatabase, PgQueryResultHKT } from 'drizzle-orm/pg-core';
import { env } from '@/lib/env';
import * as schema from './schema';

/**
 * One database interface for two engines:
 *  - "embedded": PGlite, a real PostgreSQL compiled to run inside Node.js. Zero setup — used for local
 *    development and automated tests. Data lives in the .data folder.
 *  - "postgres": any PostgreSQL 15+ server with the pgvector extension (Supabase, Neon, Railway, RDS…),
 *    selected by setting DATABASE_URL. Used in production.
 * Both run the same SQL migrations from /drizzle, so behaviour is identical.
 */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;
export type Tx = Parameters<Parameters<Db['transaction']>[0]>[0];
export type DbOrTx = Db | Tx;

export type DbMode = 'embedded' | 'postgres';

type DbState = { db: Db; mode: DbMode; close: () => Promise<void> };

const globalRef = globalThis as unknown as { __bieDbState?: Promise<DbState> };

const MIGRATIONS_FOLDER = path.join(process.cwd(), 'drizzle');

const LOCK_HEARTBEAT_MS = 4_000;
const LOCK_STALE_MS = 12_000;

/**
 * The built-in database is a folder that only ONE running program may use at a time. A small lock
 * file (refreshed every few seconds) stops a second copy — for example a maintenance script started
 * while the app is running — from opening the same folder and damaging the data.
 */
async function acquireEmbeddedLock(dataDir: string): Promise<() => void> {
  const lockFile = path.join(dataDir, 'database.lock');
  const mine = `${process.pid}:${Math.random().toString(36).slice(2)}`;
  const readLock = (): { owner: string; ageMs: number } | null => {
    try {
      const stat = fs.statSync(lockFile);
      return { owner: fs.readFileSync(lockFile, 'utf8'), ageMs: Date.now() - stat.mtimeMs };
    } catch {
      return null;
    }
  };
  const deadline = Date.now() + LOCK_STALE_MS + 2_000;
  for (;;) {
    const current = readLock();
    if (!current || current.ageMs > LOCK_STALE_MS) break; // free, or left behind by a copy that is no longer running
    if (Date.now() > deadline) {
      throw new Error(
        'The built-in database is already in use by another running copy of the app. ' +
          'Stop the app first (or wait for it to stop), then run this command again. ' +
          `(Lock file: ${lockFile})`,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  fs.writeFileSync(lockFile, mine);
  const heartbeat = setInterval(() => {
    try {
      const now = new Date();
      fs.utimesSync(lockFile, now, now);
    } catch {
      /* the folder was removed; nothing to refresh */
    }
  }, LOCK_HEARTBEAT_MS);
  heartbeat.unref();
  const release = () => {
    clearInterval(heartbeat);
    try {
      if (fs.readFileSync(lockFile, 'utf8') === mine) fs.rmSync(lockFile, { force: true });
    } catch {
      /* already gone */
    }
  };
  process.once('exit', release);
  return release;
}

async function createEmbedded(): Promise<DbState> {
  const { PGlite } = await import('@electric-sql/pglite');
  const { vector } = await import('@electric-sql/pglite-pgvector');
  const { pg_trgm } = await import('@electric-sql/pglite/contrib/pg_trgm');
  const { drizzle } = await import('drizzle-orm/pglite');
  const { migrate } = await import('drizzle-orm/pglite/migrator');

  let location = 'memory://';
  let releaseLock: () => void = () => {};
  if (!env.inMemoryDb) {
    const dir = path.join(env.dataDir, 'pglite');
    fs.mkdirSync(dir, { recursive: true });
    releaseLock = await acquireEmbeddedLock(env.dataDir);
    location = dir;
  }
  try {
    const client = new PGlite(location, { extensions: { vector, pg_trgm } });
    await client.waitReady;
    const db = drizzle(client, { schema, casing: 'snake_case' }) as unknown as Db;
    await migrate(drizzle(client, { casing: 'snake_case' }), { migrationsFolder: MIGRATIONS_FOLDER });
    return {
      db,
      mode: 'embedded',
      close: async () => {
        await client.close();
        releaseLock();
      },
    };
  } catch (err) {
    releaseLock();
    throw err;
  }
}

async function createPostgres(url: string): Promise<DbState> {
  const { Pool } = await import('pg');
  const { drizzle } = await import('drizzle-orm/node-postgres');
  const useSsl = !/localhost|127\.0\.0\.1|sslmode=disable/.test(url);
  const pool = new Pool({
    connectionString: url,
    max: Number(process.env.DATABASE_POOL_MAX || 10),
    ssl: useSsl ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' } : undefined,
  });
  const db = drizzle(pool, { schema, casing: 'snake_case' }) as unknown as Db;
  if (process.env.DB_AUTO_MIGRATE === 'true') {
    const { migrate } = await import('drizzle-orm/node-postgres/migrator');
    await migrate(drizzle(pool, { casing: 'snake_case' }), { migrationsFolder: MIGRATIONS_FOLDER });
  }
  return { db, mode: 'postgres', close: () => pool.end() };
}

async function init(): Promise<DbState> {
  const state = env.databaseUrl ? await createPostgres(env.databaseUrl) : await createEmbedded();
  if (state.mode === 'embedded' || process.env.DB_AUTO_MIGRATE === 'true') {
    // Reference data (roles, countries, researched marketplaces, requirement libraries) ships with the
    // code as data files; load anything new. Safe to run repeatedly.
    const { ensureReferenceData } = await import('./reference-data');
    await ensureReferenceData(state.db);
  }
  return state;
}

function getState(): Promise<DbState> {
  if (!globalRef.__bieDbState) {
    globalRef.__bieDbState = init().catch((err) => {
      globalRef.__bieDbState = undefined;
      throw err;
    });
  }
  return globalRef.__bieDbState;
}

export async function getDb(): Promise<Db> {
  return (await getState()).db;
}

export async function getDbMode(): Promise<DbMode> {
  return (await getState()).mode;
}

/** Close the connection (scripts and tests). */
export async function closeDb(): Promise<void> {
  const pending = globalRef.__bieDbState;
  globalRef.__bieDbState = undefined;
  if (pending) {
    const state = await pending.catch(() => null);
    await state?.close();
  }
}

/** Rows of a raw SQL result — the same shape for both database engines. */
export function rowsOf<T = Record<string, unknown>>(result: unknown): T[] {
  return ((result as { rows?: T[] } | null)?.rows ?? []) as T[];
}

export { schema };
