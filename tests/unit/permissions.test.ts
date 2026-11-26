import { describe, expect, it } from 'vitest';
import { PERMISSIONS, permissionsOf, roleHasPermission, ROLE_KEYS, ROLES } from '@/lib/auth/permissions';

describe('role permissions', () => {
  it('gives the Administrator every permission', () => {
    for (const permission of PERMISSIONS) expect(roleHasPermission('administrator', permission)).toBe(true);
  });

  it('keeps the Viewer strictly read-only', () => {
    const writes = permissionsOf('viewer').filter((p) => !p.endsWith('.view'));
    expect(writes).toEqual([]);
  });

  it('lets only Administrators manage users and organisation settings', () => {
    for (const role of ROLE_KEYS) {
      expect(roleHasPermission(role, 'users.manage')).toBe(role === 'administrator');
      expect(roleHasPermission(role, 'org.manage')).toBe(role === 'administrator');
    }
  });

  it('separates proposing from approving: Content Editors and Agencies cannot approve anything', () => {
    for (const role of ['content_editor', 'agency_contributor'] as const) {
      expect(roleHasPermission(role, 'claim.propose')).toBe(true);
      expect(roleHasPermission(role, 'claim.approve')).toBe(false);
      expect(roleHasPermission(role, 'guideline.approve')).toBe(false);
      expect(roleHasPermission(role, 'content.approve')).toBe(false);
      expect(roleHasPermission(role, 'asset.approve_source')).toBe(false);
    }
    expect(roleHasPermission('brand_manager', 'claim.approve')).toBe(true);
  });

  it('marks only the agency role as external, with no access to audit logs, marketplaces or product editing', () => {
    expect(ROLE_KEYS.filter((r) => ROLES[r].isExternal)).toEqual(['agency_contributor']);
    for (const permission of ['audit.view', 'product.edit', 'marketplace.manage', 'brand.edit', 'asset.delete'] as const) {
      expect(roleHasPermission('agency_contributor', permission)).toBe(false);
    }
  });

  it('only refers to permissions that exist', () => {
    for (const role of ROLE_KEYS) {
      for (const permission of permissionsOf(role)) expect(PERMISSIONS).toContain(permission);
    }
  });
});
