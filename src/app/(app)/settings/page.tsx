import type { Metadata } from 'next';
import { SettingsHeader } from '@/components/settings/settings-nav';
import { OrganisationForm } from '@/components/settings/forms';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, Definition } from '@/components/ui/primitives';
import { ProvenanceLegend } from '@/components/ui/provenance';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { systemStatus } from '@/lib/services/reference';

export const metadata: Metadata = { title: 'Settings' };

async function Settings() {
  const ctx = await requireContext();
  const status = await systemStatus();
  return (
    <>
      <SettingsHeader current="/settings" canManageUsers={can(ctx, 'users.manage')} canViewAudit={can(ctx, 'audit.view')} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader index="01" title="Organisation" description="Applies to everyone in this workspace." />
          <div className="p-5">
            <OrganisationForm name={ctx.organisation.name} allowExternalAi={Boolean(ctx.organisation.settings.allowExternalAi)} canEdit={can(ctx, 'org.manage')} />
          </div>
        </Card>

        <Card>
          <CardHeader index="02" title="System status" description="How this installation is running right now." />
          <dl className="px-5 py-2">
            <Definition term="Database">
              {status.databaseMode === 'embedded' ? (
                <>
                  <Badge tone="estimated">Built-in development database</Badge>
                  <p className="mt-1 text-[12.5px] text-ink-muted">Data is stored in a folder on this machine. Fine for trying the product; connect a PostgreSQL database before real use.</p>
                </>
              ) : (
                <Badge tone="verified">PostgreSQL</Badge>
              )}
            </Definition>
            <Definition term="Meaning-based search">
              {status.embeddings.available ? (
                <>
                  <Badge tone="verified">Running on this server</Badge>
                  <p className="num mt-1 text-[12px] text-ink-muted">{status.embeddings.model}</p>
                </>
              ) : (
                <>
                  <Badge tone="missing">Not available</Badge>
                  <p className="mt-1 text-[12.5px] text-ink-muted">{status.embeddings.reason}</p>
                </>
              )}
            </Definition>
            <Definition term="External AI">
              <Badge tone={ctx.organisation.settings.allowExternalAi ? 'estimated' : 'verified'}>{ctx.organisation.settings.allowExternalAi ? 'Allowed by an Administrator' : 'Switched off'}</Badge>
              <p className="mt-1 text-[12.5px] text-ink-muted">No AI provider is connected in this build. Content generation arrives in Stage 5.</p>
            </Definition>
            <Definition term="File storage">
              {status.storage} · up to <span className="num">{status.maxUploadMb} MB</span> per file
            </Definition>
            <Definition term="Scheduler">
              <Badge tone={status.schedulerConfigured ? 'verified' : 'missing'}>{status.schedulerConfigured ? 'Heartbeat secured' : 'Not configured'}</Badge>
            </Definition>
            <Definition term="Marketplace integrations">
              <Badge tone="missing">None connected</Badge>
              <p className="mt-1 text-[12.5px] text-ink-muted">No marketplace API or data provider is connected. No listing, price or review data is being collected.</p>
            </Definition>
          </dl>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader index="03" title="How information is labelled" description="The five markers used throughout the product. They are never mixed." />
          <div className="p-5">
            <ProvenanceLegend />
          </div>
        </Card>
      </div>
    </>
  );
}

export default function SettingsPage() {
  return (
    <PageBoundary>
      <Settings />
    </PageBoundary>
  );
}
