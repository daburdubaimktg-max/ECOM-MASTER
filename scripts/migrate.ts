/**
 * Applies database migrations and loads reference data.
 *
 *   Embedded mode (no DATABASE_URL): this happens automatically when the app starts; the script is optional.
 *   PostgreSQL mode: run `npm run db:migrate` on every deployment, before starting the app.
 */
import './_env';
import path from 'node:path';

function explainExtensionProblem(err: unknown): string | null {
  const text = `${(err as { message?: string })?.message ?? ''} ${JSON.stringify((err as { cause?: unknown })?.cause ?? '')}`;
  const code = (err as { cause?: { code?: string }; code?: string })?.cause?.code ?? (err as { code?: string })?.code;
  if (code === '42501' || /superuser to create this extension|permission denied to create extension/i.test(text)) {
    return [
      '',
      'The database user is not allowed to switch on the two extensions this product needs.',
      'Ask whoever administers the database to run these two commands once, as an administrator,',
      'in this database — then run "npm run db:migrate" again:',
      '',
      '    CREATE EXTENSION IF NOT EXISTS vector;',
      '    CREATE EXTENSION IF NOT EXISTS pg_trgm;',
      '',
      '(Managed PostgreSQL services normally let the standard database user enable extensions from their',
      'dashboard or with the same commands — see your provider\'s documentation for "pgvector".)',
      '',
    ].join('\n');
  }
  if (code === '0A000' || /extension "vector" is not available|could not open extension control file/i.test(text)) {
    return [
      '',
      'This PostgreSQL server does not have the "pgvector" extension installed.',
      'Use a PostgreSQL service that includes pgvector (Supabase, Neon, Railway, AWS RDS, Azure, Google Cloud SQL),',
      'or install the "pgvector" package on your own server, then run "npm run db:migrate" again.',
      '',
    ].join('\n');
  }
  return null;
}

async function main() {
  const url = process.env.DATABASE_URL?.trim();
  if (url) {
    const { Pool } = await import('pg');
    const { drizzle } = await import('drizzle-orm/node-postgres');
    const { migrate } = await import('drizzle-orm/node-postgres/migrator');
    const useSsl = !/localhost|127\.0\.0\.1|sslmode=disable/.test(url);
    const pool = new Pool({
      connectionString: url,
      ssl: useSsl ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' } : undefined,
    });
    console.log('Applying migrations to PostgreSQL…');
    try {
      await migrate(drizzle(pool, { casing: 'snake_case' }), { migrationsFolder: path.join(process.cwd(), 'drizzle') });
    } finally {
      await pool.end();
    }
    process.env.DB_AUTO_MIGRATE = 'false';
  } else {
    console.log('No DATABASE_URL set — using the built-in development database in the .data folder.');
  }
  const { getDb, closeDb } = await import('../src/db/client');
  const { ensureReferenceData } = await import('../src/db/reference-data');
  const db = await getDb();
  const report = await ensureReferenceData(db);
  console.log('Database is up to date.');
  console.log(
    `Reference data: ${report.marketplaceFilesLoaded.length} marketplace file(s) and ${report.requirementFilesLoaded.length} requirement file(s) newly loaded.`,
  );
  for (const skipped of report.skipped) console.log(`  SKIPPED ${skipped.file}: ${skipped.reason}`);
  for (const warning of report.warnings) console.log(`  WARNING ${warning}`);
  await closeDb();
}

main().catch((err) => {
  const explanation = explainExtensionProblem(err);
  const message = err instanceof Error ? err.message : String(err);
  if (explanation) console.error(explanation);
  else if (/already in use/.test(message)) console.error(`\n${message}\n`);
  else console.error(err);
  process.exit(1);
});
