import { bigserial, boolean, index, integer, jsonb, pgTable, primaryKey, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { createdAt, id, timestamptz, updatedAt } from './_shared';

export type OrganisationSettings = {
  /** When false (default) no brand content is ever sent to an external AI provider. */
  allowExternalAi?: boolean;
  defaultCountryCodes?: string[];
};

export const organisations = pgTable('organisations', {
  id: id(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  settings: jsonb().$type<OrganisationSettings>().notNull().default({}),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const users = pgTable('users', {
  id: id(),
  /** Always stored lower-case. */
  email: text().notNull().unique(),
  name: text().notNull(),
  passwordHash: text().notNull(),
  status: text().$type<'active' | 'disabled'>().notNull().default('active'),
  lastLoginAt: timestamptz(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

/** Reference list of the six system roles. Permissions are enforced in code (src/lib/auth/permissions.ts). */
export const roles = pgTable('roles', {
  key: text().primaryKey(),
  name: text().notNull(),
  description: text().notNull(),
  rank: integer().notNull(),
  isExternal: boolean().notNull().default(false),
});

export const memberships = pgTable(
  'memberships',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleKey: text()
      .notNull()
      .references(() => roles.key),
    /** 'all' = every brand in the organisation; 'restricted' = only brands listed in membership_brand_access. */
    brandScope: text().$type<'all' | 'restricted'>().notNull().default('all'),
    invitedBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex('memberships_org_user_uq').on(t.organisationId, t.userId)],
);

export const membershipBrandAccess = pgTable(
  'membership_brand_access',
  {
    membershipId: uuid()
      .notNull()
      .references(() => memberships.id, { onDelete: 'cascade' }),
    /** FK to brands.id is added in SQL migration order; kept as uuid here to avoid a circular import. */
    brandId: uuid().notNull(),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.membershipId, t.brandId] })],
);

export const sessions = pgTable(
  'sessions',
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    /** SHA-256 of the session token. The raw token only ever lives in the user's cookie. */
    tokenHash: text().notNull().unique(),
    expiresAt: timestamptz().notNull(),
    lastSeenAt: timestamptz(),
    ip: text(),
    userAgent: text(),
    createdAt: createdAt(),
  },
  (t) => [index('sessions_user_idx').on(t.userId)],
);

export const invitations = pgTable(
  'invitations',
  {
    id: id(),
    organisationId: uuid()
      .notNull()
      .references(() => organisations.id, { onDelete: 'cascade' }),
    email: text().notNull(),
    roleKey: text()
      .notNull()
      .references(() => roles.key),
    brandScope: text().$type<'all' | 'restricted'>().notNull().default('all'),
    brandIds: jsonb().$type<string[]>().notNull().default([]),
    tokenHash: text().notNull().unique(),
    invitedBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    expiresAt: timestamptz().notNull(),
    acceptedAt: timestamptz(),
    revokedAt: timestamptz(),
    createdAt: createdAt(),
  },
  (t) => [index('invitations_org_idx').on(t.organisationId)],
);

/**
 * One-time links that let a person set a new password. Created by an Administrator for a team member,
 * or from the server command line when the only Administrator is locked out. Only a hash of the
 * link's token is stored, and a link works once and for 24 hours.
 */
export const passwordResets = pgTable(
  'password_resets',
  {
    id: id(),
    userId: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text().notNull().unique(),
    /** The Administrator who created the link; null when it was created from the server command line. */
    createdBy: uuid().references(() => users.id, { onDelete: 'set null' }),
    expiresAt: timestamptz().notNull(),
    usedAt: timestamptz(),
    createdAt: createdAt(),
  },
  (t) => [index('password_resets_user_idx').on(t.userId)],
);

/** Sign-in attempts, used only for rate limiting and security review. */
export const loginAttempts = pgTable(
  'login_attempts',
  {
    id: bigserial({ mode: 'number' }).primaryKey(),
    email: text().notNull(),
    ip: text(),
    success: boolean().notNull(),
    createdAt: createdAt(),
  },
  (t) => [index('login_attempts_email_idx').on(t.email, t.createdAt)],
);

/** Append-only record of who did what. Rows are never updated or deleted by the application. */
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: bigserial({ mode: 'number' }).primaryKey(),
    organisationId: uuid().references(() => organisations.id, { onDelete: 'cascade' }),
    actorUserId: uuid().references(() => users.id, { onDelete: 'set null' }),
    /** Human-readable actor at the time of the event (survives user deletion); 'system' for automated actions. */
    actorLabel: text().notNull(),
    action: text().notNull(),
    entityType: text().notNull(),
    entityId: text(),
    summary: text().notNull(),
    metadata: jsonb().$type<Record<string, unknown>>().notNull().default({}),
    ip: text(),
    createdAt: createdAt(),
  },
  (t) => [
    index('audit_logs_org_created_idx').on(t.organisationId, t.createdAt),
    index('audit_logs_entity_idx').on(t.entityType, t.entityId),
  ],
);
