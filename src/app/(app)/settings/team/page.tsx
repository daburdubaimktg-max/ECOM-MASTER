import type { Metadata } from 'next';
import { revokeInvitationAction, setMemberStatusAction } from '@/app/actions/settings';
import { InviteForm, MemberRoleForm, ResetLinkForm } from '@/components/settings/forms';
import { SettingsHeader } from '@/components/settings/settings-nav';
import { InlineAction } from '@/components/ui/form';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, formatDate, Notice } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { ROLE_KEYS, ROLES } from '@/lib/auth/permissions';
import { requireContext } from '@/lib/auth/server';
import { listBrands } from '@/lib/services/brands';
import { listInvitations, listMembers } from '@/lib/services/team';

export const metadata: Metadata = { title: 'Team' };

async function Team() {
  const ctx = await requireContext();
  if (!can(ctx, 'users.manage')) {
    return (
      <>
        <SettingsHeader current="/settings/team" canManageUsers={false} canViewAudit={can(ctx, 'audit.view')} />
        <Notice tone="signal" title="Administrators only">
          Only Administrators can see and manage the team.
        </Notice>
      </>
    );
  }
  const [members, invitations, brands] = await Promise.all([listMembers(ctx), listInvitations(ctx), listBrands(ctx, { includeArchived: true })]);
  const roles = ROLE_KEYS.map((key) => ({ key, name: ROLES[key].name, description: ROLES[key].description, isExternal: ROLES[key].isExternal }));
  const brandOptions = brands.map((b) => ({ id: b.id, name: b.name }));
  const brandName = new Map(brandOptions.map((b) => [b.id, b.name]));
  const pending = invitations.filter((invitation) => invitation.isPending);

  return (
    <>
      <SettingsHeader current="/settings/team" canManageUsers canViewAudit={can(ctx, 'audit.view')} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader index="01" title="Members" action={<Badge>{members.length}</Badge>} />
            <ul className="divide-y divide-line">
              {members.map((member) => (
                <li key={member.membershipId} className="px-5 py-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[14.5px] font-medium">
                        {member.name} {member.userId === ctx.user.id ? <span className="label ml-1">You</span> : null}
                      </p>
                      <p className="num text-[12.5px] text-ink-muted">{member.email}</p>
                      <p className="label mt-1 !text-[9.5px]">
                        Joined {formatDate(member.createdAt)} · last sign-in {formatDate(member.lastLoginAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge tone={ROLES[member.roleKey].isExternal ? 'estimated' : 'ink'}>{ROLES[member.roleKey].name}</Badge>
                      {member.brandScope === 'restricted' ? <Badge tone="calculated">{member.brandIds.map((id) => brandName.get(id) ?? '?').join(', ') || 'No brands'}</Badge> : <Badge>All brands</Badge>}
                      {member.status === 'disabled' ? <Badge tone="signal">Disabled</Badge> : null}
                    </div>
                  </div>
                  {member.userId !== ctx.user.id ? (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-[12.5px] text-ink-muted underline decoration-line-strong underline-offset-4 hover:text-ink">Change role, access or password</summary>
                      <div className="mt-3 flex flex-wrap items-start justify-between gap-4 rounded border border-line bg-paper/60 p-4">
                        <MemberRoleForm membershipId={member.membershipId} roleKey={member.roleKey} brandIds={member.brandIds} roles={roles} brands={brandOptions} />
                        <InlineAction
                          action={setMemberStatusAction}
                          fields={{ userId: member.userId, status: member.status === 'active' ? 'disabled' : 'active' }}
                          variant={member.status === 'active' ? 'danger' : 'secondary'}
                          confirm={member.status === 'active' ? `Disable ${member.name}'s account? They are signed out immediately.` : undefined}
                        >
                          {member.status === 'active' ? 'Disable account' : 'Re-enable account'}
                        </InlineAction>
                      </div>
                      {member.status === 'active' ? (
                        <div className="mt-3 rounded border border-line bg-paper/60 p-4">
                          <ResetLinkForm userId={member.userId} name={member.name} />
                        </div>
                      ) : null}
                    </details>
                  ) : null}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHeader index="02" title="Pending invitations" action={<Badge>{pending.length}</Badge>} />
            {pending.length === 0 ? (
              <p className="px-5 py-4 text-[13.5px] text-ink-muted">No invitations are waiting to be accepted.</p>
            ) : (
              <ul className="divide-y divide-line">
                {pending.map((invitation) => (
                  <li key={invitation.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                    <div>
                      <p className="num text-[13px]">{invitation.email}</p>
                      <p className="label mt-0.5 !text-[9.5px]">
                        {ROLES[invitation.roleKey as keyof typeof ROLES]?.name ?? invitation.roleKey} · expires {formatDate(invitation.expiresAt)}
                      </p>
                    </div>
                    <InlineAction action={revokeInvitationAction} fields={{ invitationId: invitation.id }} confirm="Withdraw this invitation? The link will stop working.">
                      Withdraw
                    </InlineAction>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader index="03" title="Invite someone" description="Creates a one-time link for you to send. People cannot sign up on their own." />
            <div className="p-5">
              <InviteForm roles={roles} brands={brandOptions} />
            </div>
          </Card>
          <Notice title="External partners">
            Agency Contributors see only the brands you tick. They can upload files and propose content, but cannot approve anything, edit products or see the audit log.
          </Notice>
        </div>
      </div>
    </>
  );
}

export default function TeamPage() {
  return (
    <PageBoundary>
      <Team />
    </PageBoundary>
  );
}
