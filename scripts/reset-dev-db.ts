/**
 * Deletes the built-in DEVELOPMENT database, uploaded files and downloaded models (the .data folder),
 * so the app starts again from the first-time setup screen.
 *
 *     npm run db:reset -- --yes
 *
 * It refuses to run when DATABASE_URL is set: it never touches a real PostgreSQL database.
 */
import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.resolve(process.env.BIE_DATA_DIR?.trim() || '.data');

if (process.env.DATABASE_URL?.trim()) {
  console.error('DATABASE_URL is set, so this is not the built-in development database. Nothing was deleted.');
  process.exit(1);
}
if (!process.argv.includes('--yes')) {
  console.log(`This will permanently delete everything in:\n  ${dataDir}\n\nIf you are sure, run:  npm run db:reset -- --yes`);
  process.exit(0);
}
if (path.parse(dataDir).root === dataDir || dataDir === path.resolve('.')) {
  console.error('Refusing to delete this folder.');
  process.exit(1);
}
for (const sub of ['pglite', 'uploads']) {
  fs.rmSync(path.join(dataDir, sub), { recursive: true, force: true });
}
console.log(`Development database and uploads deleted from ${dataDir}. (Downloaded language models were kept.) Start the app to set it up again.`);
