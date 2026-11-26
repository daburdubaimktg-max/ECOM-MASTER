import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { purgeExpiredSessions, purgeOldLoginAttempts } from '@/lib/auth/session';
import { env } from '@/lib/env';
import { ensureJobHandlers } from '@/lib/job-handlers';
import { runPendingJobs } from '@/lib/jobs';

/**
 * The heartbeat for background work. An external scheduler (the hosting platform's cron, n8n, or a
 * simple timer) calls this every few minutes with the shared secret:
 *
 *   curl -X POST -H "Authorization: Bearer $JOBS_SECRET" https://your-app/api/jobs/tick
 *
 * It retries failed jobs, processes anything queued and tidies up expired sessions. In later stages
 * it will also start scheduled data collection and the weekly report.
 */
export async function POST(request: Request) {
  const secret = env.jobsSecret;
  if (!secret) return NextResponse.json({ error: 'JOBS_SECRET is not configured on this server.' }, { status: 503 });
  const provided = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ?? '';
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: 'Not authorised.' }, { status: 401 });

  ensureJobHandlers();
  const report = await runPendingJobs(100);
  await purgeExpiredSessions();
  await purgeOldLoginAttempts();
  return NextResponse.json({ ok: true, ...report });
}
