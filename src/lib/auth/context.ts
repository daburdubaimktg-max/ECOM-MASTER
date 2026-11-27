import { ForbiddenError, roleHasPermission, ROLES } from './permissions';
import type { Permission, RoleKey } from './permissions';
import type { OrganisationSettings } from '@/db/schema';

/**
 * Who is making the current request. Every service function receives one of these and uses it to
 * (1) scope all queries to the caller's organisation, (2) check permissions and (3) write the audit log.
 */
export type RequestContext = {
  user: { id: string; name: string; email: string };
  organisation: { id: string; name: string; slug: string; settings: OrganisationSettings };
  membership: {
    id: string;
    role: RoleKey;
    /** null = may access every brand in the organisation; otherwise only these brand ids. */
    brandIds: string[] | null;
  };
  ip?: string | null;
};

export function can(ctx: RequestContext, permission: Permission): boolean {
  return roleHasPermission(ctx.membership.role, permission);
}

export function assertCan(ctx: RequestContext, permission: Permission): void {
  if (!can(ctx, permission)) {
    throw new ForbiddenError(
      `Your role (${ROLES[ctx.membership.role].name}) does not allow this action. Ask an administrator if you need access.`,
    );
  }
}

export function canAccessBrand(ctx: RequestContext, brandId: string): boolean {
  return ctx.membership.brandIds === null || ctx.membership.brandIds.includes(brandId);
}

export function assertBrandAccess(ctx: RequestContext, brandId: string): void {
  if (!canAccessBrand(ctx, brandId)) {
    // Deliberately the same message as "does not exist" so brand names are not revealed.
    throw new ForbiddenError('This brand does not exist or you do not have access to it.');
  }
}
