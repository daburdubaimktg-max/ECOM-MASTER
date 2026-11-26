import type { Metadata } from 'next';
import Link from 'next/link';
import { SettingsHeader } from '@/components/settings/settings-nav';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, EmptyState, formatDateTime, Notice } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { firstParam } from '@/lib/page-helpers';
import type { SearchParams } from '@/lib/page-helpers';
import { listAuditLog } from '@/lib/services/audit';

export const metadata: Metadata = { title: 'Audit log' };

const ENTITY_TYPES = ['organisation', 'user', 'invitation', 'brand', 'guideline', 'claim', 'asset', 'competitor', 'product', 'sku', 'marketplace'];
const PAGE_SIZE = 100;

async function AuditLog({ searchParams }: { searchParams: SearchParams }) {
  const ctx = await requireContext();
  if (!can(ctx, 'audit.view')) {
    return (
      <>
        <SettingsHeader current="/settings/audit-log" canManageUsers={can(ctx, 'users.manage')} canViewAudit={false} />
        <Notice tone="signal" title="Not available for your role">
          The audit log is visible to Administrators, Brand Managers and Analysts.
        </Notice>
      </>
    );
  }
  const sp = await searchParams;
  const entityType = ENTITY_TYPES.includes(firstParam(sp.type)) ? firstParam(sp.type) : '';
  const before = Number(firstParam(sp.before)) || undefined;
  const rows = await listAuditLog(ctx, { limit: PAGE_SIZE, beforeId: before, entityType: entityType || undefined });
  const last = rows[rows.length - 1];

  return (
    <>
      <SettingsHeader current="/settings/audit-log" canManageUsers={can(ctx, 'users.manage')} canViewAudit />
      <Card className="overflow-x-auto">
        <CardHeader
          index="01"
          title="Audit log"
          description="Every change, who made it and when. Entries cannot be edited or deleted — the database itself rejects any attempt."
          action={
            <form method="get" className="flex items-center gap-2">
              <label htmlFor="type" className="label">
                Show
              </label>
              <select id="type" name="type" defaultValue={entityType} className="field-input !w-auto !py-1.5 text-[13px]">
                <option value="">Everything</option>
                {ENTITY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <button className="rounded-[4px] border border-line-strong bg-card px-3 py-1.5 text-[13px] hover:border-ink">Apply</button>
            </form>
          }
        />
        {rows.length === 0 ? (
          <EmptyState title="No entries" />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Who</th>
                <th>What happened</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="num text-[12px] whitespace-nowrap text-ink-muted">{formatDateTime(row.createdAt)}</td>
                  <td className="whitespace-nowrap">{row.actorLabel}</td>
                  <td>
                    {row.summary}
                    <p className="num text-[11px] text-ink-muted">{row.action}</p>
                  </td>
                  <td>
                    <Badge>{row.entityType}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {rows.length === PAGE_SIZE && last ? (
          <div className="border-t border-line px-5 py-3">
            <Link href={`/settings/audit-log?before=${last.id}${entityType ? `&type=${entityType}` : ''}`} className="text-[13px] underline underline-offset-4 hover:text-signal">
              Older entries
            </Link>
          </div>
        ) : null}
      </Card>
    </>
  );
}

export default function AuditLogPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <PageBoundary>
      <AuditLog searchParams={searchParams} />
    </PageBoundary>
  );
}
