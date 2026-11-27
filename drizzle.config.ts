import { defineConfig } from 'drizzle-kit';

// Used only to GENERATE SQL migration files from the schema (npm run db:generate).
// Applying migrations is done by scripts/migrate.ts or automatically in embedded mode.
export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/index.ts',
  out: './drizzle',
  casing: 'snake_case',
});
