/**
 * EMERGENCY RECOVERY — creates a one-time password-reset link for one account.
 *
 *     npm run admin:reset-link -- person@example.com
 *
 * Use it when an Administrator has forgotten their password and nobody else can create a reset
 * link for them in Settings → Team. It must be run on the server (or the computer) where the app is
 * installed. Whoever can do that already controls the installation, so no password is asked for —
 * but the event is recorded in the audit log.
 *
 * The link works once and expires after 24 hours. With the built-in development database, stop the
 * app first: only one program can open that database at a time.
 */
import './_env';
async function main() {
  const email = process.argv.slice(2).find((arg) => !arg.startsWith('-'));
  if (!email) {
    console.log('Give the email address of the account, for example:\n\n  npm run admin:reset-link -- person@example.com\n');
    process.exit(1);
  }
  const { closeDb } = await import('../src/db/client');
  const { createPasswordResetFromCommandLine } = await import('../src/lib/services/account');
  const result = await createPasswordResetFromCommandLine(email);
  await closeDb();
  if (!result) {
    console.log(`\nNo active account was found for "${email}". Check the spelling. A disabled account cannot be reset — re-enable it first.\n`);
    process.exit(1);
  }
  const base = (process.env.APP_URL?.trim() || 'http://localhost:3000').replace(/\/+$/, '');
  console.log(`\nPassword-reset link for ${result.name}:\n\n  ${base}/reset/${result.token}\n`);
  console.log(`It works once and expires on ${result.expiresAt.toUTCString()}.`);
  if (!process.env.APP_URL?.trim()) {
    console.log('If the app is not at http://localhost:3000, replace that part with the address you normally use to open it.');
  }
  console.log('Opening the link lets its holder choose a new password, so send it only to the account owner.\n');
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  // The "database already in use" message is an instruction for the reader, not a crash report.
  console.error(/already in use/.test(message) ? `\n${message}\n` : err);
  process.exit(1);
});
