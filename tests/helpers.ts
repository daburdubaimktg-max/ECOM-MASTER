import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/db/client';
import type { RequestContext } from '@/lib/auth/context';
import type { RoleKey } from '@/lib/auth/permissions';
import { setStorageRootForTests } from '@/lib/storage';
import { slugify } from '@/lib/text';

let counter = 0;

/** Creates an organisation directly in the database and returns an Administrator context for it. */
export async function makeOrganisation(name = 'Test Organisation'): Promise<RequestContext> {
  const db = await getDb();
  counter++;
  const [org] = await db
    .insert(schema.organisations)
    .values({ name, slug: `${slugify(name)}-${counter}-${Date.now()}` })
    .returning();
  return addMember(org.id, 'administrator');
}

export async function addMember(organisationId: string, role: RoleKey, brandIds: string[] | null = null): Promise<RequestContext> {
  const db = await getDb();
  counter++;
  const [org] = await db.select().from(schema.organisations).where(eq(schema.organisations.id, organisationId));
  const [user] = await db
    .insert(schema.users)
    .values({ email: `user${counter}-${Date.now()}@example.test`, name: `Test ${role} ${counter}`, passwordHash: 'not-a-real-hash' })
    .returning();
  const [membership] = await db
    .insert(schema.memberships)
    .values({ organisationId, userId: user.id, roleKey: role, brandScope: brandIds === null ? 'all' : 'restricted' })
    .returning();
  if (brandIds?.length) {
    await db.insert(schema.membershipBrandAccess).values(brandIds.map((brandId) => ({ membershipId: membership.id, brandId })));
  }
  return {
    user: { id: user.id, name: user.name, email: user.email },
    organisation: { id: org.id, name: org.name, slug: org.slug, settings: org.settings ?? {} },
    membership: { id: membership.id, role, brandIds },
    ip: '127.0.0.1',
  };
}

export function useTempStorage(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'bie-test-uploads-'));
  setStorageRootForTests(dir);
  return dir;
}

export function fixture(name: string): Uint8Array {
  return new Uint8Array(fs.readFileSync(path.join(__dirname, 'fixtures', name)));
}

export function fixturePath(name: string): string {
  return path.join(__dirname, 'fixtures', name);
}
