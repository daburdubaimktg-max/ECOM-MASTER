import type { Metadata } from 'next';
import { ChangePasswordForm } from '@/components/settings/forms';
import { SettingsHeader } from '@/components/settings/settings-nav';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, Notice } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { ROLES } from '@/lib/auth/permissions';
import { requireContext } from '@/lib/auth/server';
import { listBrands } from '@/lib/services/brands';

export const metadata: Metadata = { title: 'Your account' };

async function Account() {
  const ctx = await requireContext();
  const role = ROLES[ctx.membership.role];
  const brands = ctx.membership.brandIds === null ? null : await listBrands(ctx, { includeArchived: true });

  return (
    <>
      <SettingsHeader current="/settings/account" canManageUsers={can(ctx, 'users.manage')} canViewAudit={can(ctx, 'audit.view')} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div className="space-y-6">
          <Card>
            <CardHeader index="01" title="Your account" description="Who you are signed in as. Ask an Administrator to change your role or the brands you can see." />
            <dl className="grid gap-x-8 gap-y-4 p-5 sm:grid-cols-2">
              <div>
                <dt className="label">Name</dt>
                <dd className="mt-1 text-[14.5px]">{ctx.user.name}</dd>
              </div>
              <div>
                <dt className="label">Email</dt>
                <dd className="num mt-1 text-[13px]">{ctx.user.email}</dd>
              </div>
              <div>
                <dt className="label">Role</dt>
                <dd className="mt-1.5">
                  <Badge tone={role.isExternal ? 'estimated' : 'ink'}>{role.name}</Badge>
                  <p className="mt-1.5 text-[13px] text-ink-muted">{role.description}</p>
                </dd>
              </div>
              <div>
                <dt className="label">Brands you can see</dt>
                <dd className="mt-1.5 text-[13.5px]">{brands === null ? 'All brands' : brands.map((b) => b.name).join(', ') || 'None yet'}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <CardHeader index="02" title="Change your password" description="You stay signed in on this device. Every other device is signed out." />
            <div className="max-w-[28rem] p-5">
              <ChangePasswordForm />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Notice title="Forgotten your password?">
            Ask an Administrator to create a password-reset link for you under Settings → Team. If you are the only Administrator and cannot sign in, the person who runs the server can create a
            link with the command <span className="num">npm run admin:reset-link</span> — see the setup guide.
          </Notice>
          <Notice title="Choosing a good password">Length matters more than symbols. A short sentence that only you would think of is both strong and easy to remember. Do not reuse a password from another site.</Notice>
        </div>
      </div>
    </>
  );
}

export default function AccountPage() {
  return (
    <PageBoundary>
      <Account />
    </PageBoundary>
  );
}
