import type { Metadata } from 'next';
import Link from 'next/link';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, EmptyState, formatDate, Notice, PageHeader } from '@/components/ui/primitives';
import { requireContext } from '@/lib/auth/server';
import { listRequirementSets } from '@/lib/services/marketplaces';

export const metadata: Metadata = { title: 'Requirements library' };

const DOC_LEVEL_TONE = { full: 'verified', partial: 'estimated', minimal: 'missing', none: 'missing' } as const;

async function Requirements() {
  const ctx = await requireContext();
  const sets = await listRequirementSets(ctx);
  return (
    <>
      <PageHeader
        eyebrow="Marketplace intelligence"
        title="Requirements library"
        description="What each retailer actually requires of a product listing — titles, images, attributes, barcodes, enhanced content, restricted claims — with the official source of every rule. Listings and generated content are checked against these rules, and each change creates a new version."
        actions={
          <Link href="/marketplaces" className="text-[13.5px] underline decoration-line-strong underline-offset-4 hover:text-signal">
            Back to marketplaces
          </Link>
        }
      />
      {sets.length === 0 ? (
        <div className="card">
          <EmptyState title="No requirement libraries loaded yet">Requirement research files have not been loaded into this database.</EmptyState>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Retailer</th>
                <th>Countries</th>
                <th className="text-right">Rules</th>
                <th className="text-right">Mandatory</th>
                <th className="text-right">From official documents</th>
                <th>Official quality score</th>
                <th>Public documentation</th>
                <th>Version</th>
              </tr>
            </thead>
            <tbody>
              {sets.map((set) => (
                <tr key={set.id}>
                  <td>
                    <Link href={`/marketplaces/requirements/${set.familyKey}`} className="font-medium hover:text-signal">
                      {set.marketplaceName}
                    </Link>
                  </td>
                  <td className="num text-[12.5px] text-ink-soft">{set.appliesToCountryCodes.join(' · ') || '—'}</td>
                  <td className="num text-right">{set.ruleCount}</td>
                  <td className="num text-right">{set.mandatoryRuleCount}</td>
                  <td className="num text-right">
                    {set.officialRuleCount}/{set.ruleCount}
                  </td>
                  <td>{set.signalCount > 0 ? <Badge tone="verified">{set.signalCount} documented</Badge> : <Badge tone="missing">None found</Badge>}</td>
                  <td>
                    {set.publicDocumentationLevel ? (
                      <Badge tone={DOC_LEVEL_TONE[set.publicDocumentationLevel as keyof typeof DOC_LEVEL_TONE] ?? 'neutral'}>{set.publicDocumentationLevel}</Badge>
                    ) : (
                      <span className="text-ink-muted">—</span>
                    )}
                  </td>
                  <td className="num text-[12.5px] text-ink-soft">
                    v{set.version} · {formatDate(set.researchDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Notice title="Mandatory versus recommended">
          A <strong className="font-medium text-ink">mandatory</strong> rule is one the retailer enforces: breaking it can get a listing rejected or hidden. A{' '}
          <strong className="font-medium text-ink">recommended</strong> rule is the retailer&rsquo;s own best practice. Only rules with a source are stored.
        </Notice>
        <Notice title="Retailers with little public documentation" tone="estimated">
          Some retailers publish their content rules only inside supplier portals. For those the library says so plainly and records how brands normally deliver content, instead of guessing at rules.
        </Notice>
      </div>
    </>
  );
}

export default function RequirementsPage() {
  return (
    <PageBoundary>
      <Requirements />
    </PageBoundary>
  );
}
