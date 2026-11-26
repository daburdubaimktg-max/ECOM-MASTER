import type { Metadata } from 'next';
import Link from 'next/link';
import { PlannedModuleView } from '@/components/planned/planned-module';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader, EmptyState, SourceLink } from '@/components/ui/primitives';
import { Provenance } from '@/components/ui/provenance';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { PLANNED_MODULES } from '@/lib/planned-modules';
import { getActiveLqsRule, listOfficialQualitySignals } from '@/lib/services/reference';
import { titleCase } from '@/lib/text';

const planned = PLANNED_MODULES['listing-quality'];

export const metadata: Metadata = { title: planned.title };

async function Content() {
  const ctx = await requireContext();
  const [rule, signals] = await Promise.all([getActiveLqsRule(ctx), can(ctx, 'marketplace.view') ? listOfficialQualitySignals(ctx) : Promise.resolve([])]);
  const weights = rule ? Object.entries(rule.weights) : [];
  const total = weights.reduce((sum, [, weight]) => sum + Number(weight), 0);
  return (
    <PlannedModuleView module={planned}>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            index="A"
            title="Proposed internal score weights"
            description={rule ? `${rule.name} · version ${rule.version}. These are internal weights — not official retailer weightings — and can be changed per marketplace and category.` : undefined}
            action={<Badge tone="calculated">Configuration</Badge>}
          />
          {weights.length ? (
            <table className="data-table">
              <tbody>
                {weights.map(([dimension, weight]) => (
                  <tr key={dimension}>
                    <td>{titleCase(dimension)}</td>
                    <td className="w-1/2">
                      <span aria-hidden className="block h-2 rounded-sm bg-paper-deep">
                        <span className="block h-2 rounded-sm bg-ink" style={{ width: `${(Number(weight) / Math.max(...weights.map(([, w]) => Number(w)))) * 100}%` }} />
                      </span>
                    </td>
                    <td className="num text-right">{weight}%</td>
                  </tr>
                ))}
                <tr>
                  <td className="font-medium">Total</td>
                  <td />
                  <td className="num text-right font-medium">{total}%</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <EmptyState title="No scoring configuration loaded" />
          )}
        </Card>

        <Card>
          <CardHeader
            index="B"
            title="Official quality scores that really exist"
            description="From the requirements research: what each retailer itself publishes about listing quality, and how it can be reached."
            action={<Provenance kind="verified" title="Taken from each retailer's own documentation; see the source links." />}
          />
          {signals.length ? (
            <ul className="divide-y divide-line">
              {signals.map((signal, i) => (
                <li key={i} className="px-5 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-[13.5px]">
                      <Link href={`/marketplaces/requirements/${signal.familyKey}`} className="font-medium hover:text-signal">
                        {signal.marketplaceName}
                      </Link>{' '}
                      — {signal.officialName}
                    </p>
                    <Badge tone={signal.accessMethod === 'api' ? 'verified' : signal.accessMethod === 'none' ? 'missing' : 'estimated'}>{(signal.accessMethod ?? 'unknown').replace(/_/g, ' ')}</Badge>
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-ink-muted">
                    {signal.whoCanAccess}
                    {signal.sourceUrl ? (
                      <>
                        {' · '}
                        <SourceLink href={signal.sourceUrl}>source</SourceLink>
                      </>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No official signals recorded yet">They appear here once the requirements research is loaded.</EmptyState>
          )}
        </Card>
      </div>
    </PlannedModuleView>
  );
}

export default function ListingQualityPage() {
  return (
    <PageBoundary>
      <Content />
    </PageBoundary>
  );
}
