import type { Metadata } from 'next';
import { Fragment } from 'react';
import { SettingsHeader } from '@/components/settings/settings-nav';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { roleHasPermission, ROLE_KEYS, ROLES } from '@/lib/auth/permissions';
import type { Permission } from '@/lib/auth/permissions';
import { requireContext } from '@/lib/auth/server';

export const metadata: Metadata = { title: 'Roles & permissions' };

const GROUPS: { title: string; items: [Permission, string][] }[] = [
  {
    title: 'Organisation',
    items: [
      ['org.manage', 'Change organisation settings'],
      ['users.manage', 'Invite people, change roles, disable accounts'],
      ['audit.view', 'Read the audit log'],
    ],
  },
  {
    title: 'Brand knowledge',
    items: [
      ['brand.view', 'See brands'],
      ['brand.create', 'Create brands'],
      ['brand.edit', 'Edit brand profiles'],
      ['brand.archive', 'Archive brands'],
      ['guideline.edit', 'Write and edit guidelines (as drafts)'],
      ['guideline.approve', 'Approve or retire guidelines'],
      ['claim.propose', 'Propose claims'],
      ['claim.approve', 'Approve or restrict claims'],
      ['asset.view', 'See and download documents'],
      ['asset.upload', 'Upload documents and media'],
      ['asset.approve_source', 'Approve a document as an authoritative source'],
      ['asset.delete', 'Delete documents'],
      ['competitor.manage', 'Manage competitor lists'],
    ],
  },
  {
    title: 'Product catalogue',
    items: [
      ['product.view', 'See products'],
      ['product.edit', 'Create and edit products and SKUs'],
      ['product.import', 'Import products from a spreadsheet'],
      ['product.delete', 'Delete products'],
    ],
  },
  {
    title: 'Marketplaces',
    items: [
      ['marketplace.view', 'See marketplace research and requirements'],
      ['marketplace.manage', 'Set tracking, brand presence, add platforms'],
    ],
  },
  {
    title: 'Later stages',
    items: [
      ['content.generate', 'Generate content with AI'],
      ['content.edit', 'Edit content drafts'],
      ['content.approve', 'Approve content'],
      ['recommendation.manage', 'Work on recommendations'],
      ['report.view', 'See reports'],
      ['automation.manage', 'Manage automation'],
    ],
  },
];

async function Roles() {
  const ctx = await requireContext();
  return (
    <>
      <SettingsHeader current="/settings/roles" canManageUsers={can(ctx, 'users.manage')} canViewAudit={can(ctx, 'audit.view')} />
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ROLE_KEYS.map((key) => (
          <div key={key} className={`card p-5 ${ctx.membership.role === key ? '!border-ink' : ''}`}>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[19px] font-normal">{ROLES[key].name}</h2>
              <span className="flex gap-1.5">
                {ROLES[key].isExternal ? <Badge tone="estimated">External</Badge> : null}
                {ctx.membership.role === key ? <Badge tone="ink">Your role</Badge> : null}
              </span>
            </div>
            <p className="mt-1.5 text-[13.5px] text-ink-soft">{ROLES[key].description}</p>
          </div>
        ))}
      </div>
      <Card className="overflow-x-auto">
        <CardHeader
          index="01"
          title="What each role can do"
          description="The same rules are enforced on the server for every action — hiding a button is never the only protection. Proposing and approving are always separate permissions."
        />
        <table className="data-table">
          <thead>
            <tr>
              <th>Permission</th>
              {ROLE_KEYS.map((key) => (
                <th key={key} className="text-center">
                  {ROLES[key].name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((group) => (
              <Fragment key={group.title}>
                <tr>
                  <td colSpan={ROLE_KEYS.length + 1} className="!bg-paper-deep/50 !py-2">
                    <span className="label">{group.title}</span>
                  </td>
                </tr>
                {group.items.map(([permission, text]) => (
                  <tr key={permission}>
                    <td>{text}</td>
                    {ROLE_KEYS.map((key) => (
                      <td key={key} className="text-center">
                        {roleHasPermission(key, permission) ? (
                          <span className="text-verified" aria-label="Allowed">
                            ●
                          </span>
                        ) : (
                          <span className="text-line-strong" aria-label="Not allowed">
                            ·
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export default function RolesPage() {
  return (
    <PageBoundary>
      <Roles />
    </PageBoundary>
  );
}
