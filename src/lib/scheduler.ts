import { purgeExpiredSessions, purgeOldLoginAttempts } from '@/lib/auth/session';
import { ensureJobHandlers } from '@/lib/job-handlers';
import { runPendingJobs } from '@/lib/jobs';

/**
 * The built-in scheduler, for installations that run on one computer (BUILT_IN_SCHEDULER=true).
 * It does the same work as an outside scheduler calling /api/jobs/tick: retries failed jobs, runs
 * anything due, and tidies up expired sign-ins. Hosted installations use the heartbeat instead.
 */
const INTERVAL_MS = 5 * 60 * 1000;
let started = false;

export function startBuiltInScheduler(): void {
  if (started) return;
  started = true;
  const tick = async () => {
    try {
      ensureJobHandlers();
      const report = await runPendingJobs(100);
      await purgeExpiredSessions();
      await purgeOldLoginAttempts();
      if (report.processed) console.log(`[scheduler] ${report.succeeded} succeeded, ${report.failed} failed, ${report.retried} to retry`);
    } catch (err) {
      console.error('[scheduler] run failed', err);
    }
  };
  setTimeout(() => void tick(), 30_000).unref();
  setInterval(() => void tick(), INTERVAL_MS).unref();
  console.log('[scheduler] built-in scheduler on: background work runs every 5 minutes');
}
