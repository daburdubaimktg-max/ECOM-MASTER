import { PageHeader, Tabs } from '@/components/ui/primitives';

export function SettingsHeader({ current, canManageUsers, canViewAudit }: { current: string; canManageUsers: boolean; canViewAudit: boolean }) {
  const items = [
    { href: '/settings', label: 'Organisation & system' },
    ...(canManageUsers ? [{ href: '/settings/team', label: 'Team' }] : []),
    { href: '/settings/roles', label: 'Roles & permissions' },
    ...(canViewAudit ? [{ href: '/settings/audit-log', label: 'Audit log' }] : []),
    { href: '/settings/account', label: 'Your account' },
  ];
  return (
    <PageHeader eyebrow="System" title="Settings" description="Who can do what, how the system is running, and a complete record of changes.">
      <Tabs items={items} current={current} />
    </PageHeader>
  );
}
