import type { Metadata } from 'next';
import { PlannedModuleView } from '@/components/planned/planned-module';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, EmptyState, formatDateTime } from '@/components/ui/primitives';
import { Provenance } from '@/components/ui/provenance';
import { requireContext } from '@/lib/auth/server';
import { PLANNED_MODULES } from '@/lib/planned-modules';
import { recentJobs, systemStatus } from '@/lib/services/reference';

const planned = PLANNED_MODULES.automation;

export const metadata: Metadata = { title: planned.title };

const JOB_LABELS: Record<string, string> = {
  'asset.process': 'Read an uploaded document',
  'knowledge.embed': 'Prepare passages for meaning-based search',
};
const STATUS_TONE = { queued: 'calculated', running: 'calculated', succeeded: 'verified', failed: 'signal' } as const;

async function Content() {
  const ctx = await requireContext();
  const [jobs, status] = await Promise.all([recentJobs(ctx), systemStatus()]);
  return (
    <PlannedModuleView module={planned}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <CardHeader index="A" title="Background work — live" description="The job queue is already running. These are real jobs from your organisation." action={<Provenance kind="verified" />} />
          {jobs.length === 0 ? (
            <EmptyState title="No background jobs yet">Upload a document to a brand and its reading job will appear here.</EmptyState>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Status</th>
                  <th className="text-right">Attempts</th>
                  <th>Started</th>
                  <th>Finished</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      {JOB_LABELS[job.type] ?? job.type}
                      {job.lastError ? <p className="max-w-[26rem] text-[12px] text-signal-deep">{job.lastError}</p> : null}
                    </td>
                    <td>
                      <Badge tone={STATUS_TONE[job.status]}>{job.status}</Badge>
                    </td>
                    <td className="num text-right">{job.attempts}</td>
                    <td className="text-[12.5px] text-ink-muted">{formatDateTime(job.createdAt)}</td>
                    <td className="text-[12.5px] text-ink-muted">{formatDateTime(job.finishedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
        <Card>
          <CardHeader index="B" title="Scheduler" />
          <div className="space-y-3 px-5 py-4 text-[13.5px] text-ink-soft">
            <p>
              <Badge tone={status.schedulerConfigured ? 'verified' : 'estimated'}>{status.schedulerConfigured ? 'Heartbeat secured' : 'Heartbeat not configured'}</Badge>
            </p>
            <p>
              Recurring work is driven by a scheduler calling a secured address on this server every few minutes. Until one is configured, jobs still run immediately after the action
              that creates them — only retries and future scheduled collection depend on it.
            </p>
            <p className="text-ink-muted">Setup steps are in the guide “docs/guides/setup.md”.</p>
          </div>
        </Card>
      </div>
    </PlannedModuleView>
  );
}

export default function AutomationPage() {
  return (
    <PageBoundary>
      <Content />
    </PageBoundary>
  );
}
