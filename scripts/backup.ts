/**
 * Copies the built-in database and uploaded files to a dated folder in "backups".
 *
 *     npm run backup
 *
 * Run it while the app is STOPPED (the office start files do this automatically before starting).
 * The 14 most recent backups are kept; older ones are deleted. The downloaded search model is not
 * copied — it is downloaded again if needed.
 *
 * To restore: stop the app, rename the ".data" folder (do not delete it yet), copy the chosen backup
 * folder in its place and rename it ".data", then start the app.
 */
import './_env';
import fs from 'node:fs';
import path from 'node:path';

const KEEP = 14;
const dataDir = path.resolve(process.env.BIE_DATA_DIR?.trim() || '.data');
const backupRoot = path.resolve(process.env.BIE_BACKUP_DIR?.trim() || 'backups');

if (process.env.DATABASE_URL?.trim()) {
  console.log('This installation uses an external PostgreSQL database. Back it up with your database provider instead.');
  process.exit(0);
}
if (!fs.existsSync(path.join(dataDir, 'pglite'))) {
  console.log(`Nothing to back up yet (no database in ${dataDir}).`);
  process.exit(0);
}
const lock = path.join(dataDir, 'database.lock');
if (fs.existsSync(lock) && Date.now() - fs.statSync(lock).mtimeMs < 12_000) {
  console.error('The app is running. Stop it first, then run the backup again — copying a database that is in use can produce a damaged copy.');
  process.exit(1);
}

const stamp = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '-');
const target = path.join(backupRoot, `backup_${stamp}`);
fs.mkdirSync(target, { recursive: true });
for (const part of ['pglite', 'uploads']) {
  const from = path.join(dataDir, part);
  if (fs.existsSync(from)) fs.cpSync(from, path.join(target, part), { recursive: true });
}
const all = fs
  .readdirSync(backupRoot)
  .filter((name) => name.startsWith('backup_'))
  .sort();
for (const old of all.slice(0, Math.max(0, all.length - KEEP))) fs.rmSync(path.join(backupRoot, old), { recursive: true, force: true });
console.log(`Backup saved to ${target} (keeping the ${KEEP} most recent).`);
