/**
 * Role-based access control. This file is the single source of truth for who may do what.
 * The interface hides what a user cannot do, but every server action and API route ALSO checks
 * the permission here before touching data.
 */
export const ROLE_KEYS = [
  'administrator',
  'brand_manager',
  'content_editor',
  'analyst',
  'agency_contributor',
  'viewer',
] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export const PERMISSIONS = [
  // organisation
  'org.manage',
  'users.manage',
  'audit.view',
  // brand knowledge base
  'brand.view',
  'brand.create',
  'brand.edit',
  'brand.archive',
  'guideline.edit',
  'guideline.approve',
  'claim.propose',
  'claim.approve',
  'asset.view',
  'asset.upload',
  'asset.delete',
  'asset.approve_source',
  'competitor.manage',
  // product catalogue
  'product.view',
  'product.edit',
  'product.delete',
  'product.import',
  // marketplaces
  'marketplace.view',
  'marketplace.manage',
  // later stages (declared now so roles are complete from day one)
  'content.generate',
  'content.edit',
  'content.approve',
  'recommendation.manage',
  'report.view',
  'automation.manage',
] as const;
export type Permission = (typeof PERMISSIONS)[number];

type RoleDefinition = {
  name: string;
  description: string;
  rank: number;
  /** External roles (agencies) are always restricted to explicitly assigned brands. */
  isExternal: boolean;
  permissions: readonly Permission[] | 'all';
};

const VIEW: Permission[] = ['brand.view', 'asset.view', 'product.view', 'marketplace.view', 'report.view'];

export const ROLES: Record<RoleKey, RoleDefinition> = {
  administrator: {
    name: 'Administrator',
    description: 'Full control: organisation settings, users and every brand.',
    rank: 100,
    isExternal: false,
    permissions: 'all',
  },
  brand_manager: {
    name: 'Brand Manager',
    description:
      'Owns brand information: manages brands, products and assets, approves claims, guidelines and content.',
    rank: 80,
    isExternal: false,
    permissions: [
      ...VIEW,
      'audit.view',
      'brand.create',
      'brand.edit',
      'brand.archive',
      'guideline.edit',
      'guideline.approve',
      'claim.propose',
      'claim.approve',
      'asset.upload',
      'asset.delete',
      'asset.approve_source',
      'competitor.manage',
      'product.edit',
      'product.delete',
      'product.import',
      'marketplace.manage',
      'content.generate',
      'content.edit',
      'content.approve',
      'recommendation.manage',
      'automation.manage',
    ],
  },
  content_editor: {
    name: 'Content Editor',
    description: 'Creates and edits product information and content. Cannot approve claims, guidelines or content.',
    rank: 60,
    isExternal: false,
    permissions: [
      ...VIEW,
      'guideline.edit',
      'claim.propose',
      'asset.upload',
      'product.edit',
      'product.import',
      'content.generate',
      'content.edit',
    ],
  },
  analyst: {
    name: 'Analyst',
    description: 'Reads everything, manages marketplace tracking and competitors, works on recommendations.',
    rank: 50,
    isExternal: false,
    permissions: [...VIEW, 'audit.view', 'competitor.manage', 'marketplace.manage', 'recommendation.manage'],
  },
  agency_contributor: {
    name: 'Agency Contributor',
    description:
      'External partner. Sees only the brands they are assigned to; can upload assets and propose content for review.',
    rank: 30,
    isExternal: true,
    permissions: ['brand.view', 'asset.view', 'product.view', 'asset.upload', 'claim.propose', 'content.edit'],
  },
  viewer: {
    name: 'Viewer',
    description: 'Read-only access.',
    rank: 10,
    isExternal: false,
    permissions: VIEW,
  },
};

export function isRoleKey(value: unknown): value is RoleKey {
  return typeof value === 'string' && (ROLE_KEYS as readonly string[]).includes(value);
}

export function roleHasPermission(role: RoleKey, permission: Permission): boolean {
  const def = ROLES[role];
  return def.permissions === 'all' || def.permissions.includes(permission);
}

export function permissionsOf(role: RoleKey): Permission[] {
  const def = ROLES[role];
  return def.permissions === 'all' ? [...PERMISSIONS] : [...def.permissions];
}

export class ForbiddenError extends Error {
  constructor(message = 'You do not have permission to do this.') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Not found.') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  fieldErrors: Record<string, string>;
  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.fieldErrors = fieldErrors;
  }
}
