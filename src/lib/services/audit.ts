import { and, desc, eq, lt } from 'drizzle-orm';
import { getDb, schema } from '@/db/client';
import type { DbOrTx } from '@/db/client';
import type { RequestContext } from '@/lib/auth/context';
import { assertCan } from '@/lib/auth/context';

export type AuditEvent = {
  action: string;
  entityType: string;
  entityId?: string | null;
  summary: string;
  metadata?: Record<string, unknown>;
};

/** Record who did what. Pass the transaction (`tx`) so the log entry commits or rolls back with the change. */
export async function audit(ctx: RequestContext, event: AuditEvent, tx?: DbOrTx): Promise<void> {
  const db = tx ?? (await getDb());
  await db.insert(schema.auditLogs).values({
    organisationId: ctx.organisation.id,
    actorUserId: ctx.user.id,
    actorLabel: ctx.user.name,
    action: event.action,
    entityType: event.entityType,
    entityId: event.entityId ?? null,
    summary: event.summary,
    metadata: event.metadata ?? {},
    ip: ctx.ip ?? null,
  });
}

export async function listAuditLog(ctx: RequestContext, options: { limit?: number; beforeId?: number; entityType?: string } = {}) {
  assertCan(ctx, 'audit.view');
  const db = await getDb();
  const limit = Math.min(Math.max(options.limit ?? 100, 1), 500);
  return db
    .select()
    .from(schema.auditLogs)
    .where(
      and(
        eq(schema.auditLogs.organisationId, ctx.organisation.id),
        options.beforeId ? lt(schema.auditLogs.id, options.beforeId) : undefined,
        options.entityType ? eq(schema.auditLogs.entityType, options.entityType) : undefined,
      ),
    )
    .orderBy(desc(schema.auditLogs.id))
    .limit(limit);
}
