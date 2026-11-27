import { afterAll, describe, expect, it } from 'vitest';
import { sql } from 'drizzle-orm';
import { closeDb, getDb, rowsOf, schema } from '@/db/client';

afterAll(async () => {
  await closeDb();
});

describe('database', () => {
  it('applies every migration and loads the six roles and nine launch countries', async () => {
    const db = await getDb();
    const roles = await db.select().from(schema.roles);
    expect(roles.map((r) => r.key).sort()).toEqual(
      ['administrator', 'agency_contributor', 'analyst', 'brand_manager', 'content_editor', 'viewer'].sort(),
    );
    const countries = await db.select().from(schema.countries);
    expect(countries.filter((c) => c.isInitialMarket)).toHaveLength(9);
  });

  it('has the vector extension available', async () => {
    const db = await getDb();
    const res = await db.execute(sql`select '[1,2,3]'::vector <=> '[1,2,3]'::vector as distance`);
    expect(Number(rowsOf<{ distance: number }>(res)[0].distance)).toBe(0);
  });

  it('refuses to modify the audit log', async () => {
    const db = await getDb();
    await db.insert(schema.auditLogs).values({ actorLabel: 'test', action: 'test.event', entityType: 'test', summary: 'hello' });
    await expect(db.execute(sql`update audit_logs set summary = 'tampered'`)).rejects.toThrow();
    await expect(db.execute(sql`delete from audit_logs`)).rejects.toThrow();
    const rows = await db.select().from(schema.auditLogs);
    expect(rows[0].summary).toBe('hello');
  });
});
