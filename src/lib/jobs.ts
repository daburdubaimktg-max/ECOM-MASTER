import { and, eq, lt, sql } from 'drizzle-orm';
import { getDb, rowsOf, schema } from '@/db/client';

/**
 * A small database-backed job queue.
 *
 * Why not just do the work inside the web request? Reading a 100-page brand book and computing
 * embeddings takes several seconds; the upload should return immediately and the work should
 * survive a crash and retry on failure. The same queue will later run data collection, scoring
 * and report generation, triggered on a schedule.
 */
const jobs = schema.backgroundJobs;

export type JobHandler = (payload: Record<string, unknown>, job: { id: string; organisationId: string | null; attempt: number }) => Promise<void>;

const handlers = new Map<string, JobHandler>();

export function registerJobHandler(type: string, handler: JobHandler): void {
  handlers.set(type, handler);
}

export async function enqueueJob(input: { type: string; payload?: Record<string, unknown>; organisationId?: string | null; maxAttempts?: number }): Promise<string> {
  const db = await getDb();
  const [row] = await db
    .insert(jobs)
    .values({ type: input.type, payload: input.payload ?? {}, organisationId: input.organisationId ?? null, maxAttempts: input.maxAttempts ?? 3 })
    .returning({ id: jobs.id });
  return row.id;
}

const STALE_LOCK_MS = 15 * 60 * 1000;

async function claimNext(): Promise<typeof jobs.$inferSelect | null> {
  const db = await getDb();
  const result = await db.execute(sql`
    update background_jobs
       set status = 'running', locked_at = now(), attempts = attempts + 1
     where id = (
       select id from background_jobs
        where status = 'queued' and run_after <= now()
        order by created_at
        limit 1
        for update skip locked
     )
    returning id`);
  const id = rowsOf<{ id: string }>(result)[0]?.id;
  if (!id) return null;
  const rows = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  return rows[0] ?? null;
}

export type JobRunReport = { processed: number; succeeded: number; failed: number; retried: number };

let running: Promise<JobRunReport> | null = null;

/** Process queued jobs until the queue is empty (or `limit` is reached). Safe to call from several places at once. */
export function runPendingJobs(limit = 25): Promise<JobRunReport> {
  if (running) return running;
  running = (async () => {
    const report: JobRunReport = { processed: 0, succeeded: 0, failed: 0, retried: 0 };
    const db = await getDb();
    // Jobs left "running" by a crashed process go back in the queue.
    await db
      .update(jobs)
      .set({ status: 'queued', lockedAt: null })
      .where(and(eq(jobs.status, 'running'), lt(jobs.lockedAt, new Date(Date.now() - STALE_LOCK_MS))));

    while (report.processed < limit) {
      const job = await claimNext();
      if (!job) break;
      report.processed++;
      const handler = handlers.get(job.type);
      try {
        if (!handler) throw new Error(`No handler registered for job type "${job.type}"`);
        await handler(job.payload, { id: job.id, organisationId: job.organisationId, attempt: job.attempts });
        await db.update(jobs).set({ status: 'succeeded', finishedAt: new Date(), lockedAt: null, lastError: null }).where(eq(jobs.id, job.id));
        report.succeeded++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (job.attempts < job.maxAttempts) {
          const delayMs = 30_000 * 2 ** (job.attempts - 1);
          await db
            .update(jobs)
            .set({ status: 'queued', lockedAt: null, lastError: message.slice(0, 2000), runAfter: new Date(Date.now() + delayMs) })
            .where(eq(jobs.id, job.id));
          report.retried++;
        } else {
          await db.update(jobs).set({ status: 'failed', finishedAt: new Date(), lockedAt: null, lastError: message.slice(0, 2000) }).where(eq(jobs.id, job.id));
          report.failed++;
        }
      }
    }
    return report;
  })().finally(() => {
    running = null;
  });
  return running;
}

export async function jobQueueSummary(organisationId: string) {
  const db = await getDb();
  return db
    .select({ type: jobs.type, status: jobs.status, n: sql<number>`count(*)::int` })
    .from(jobs)
    .where(eq(jobs.organisationId, organisationId))
    .groupBy(jobs.type, jobs.status);
}
