import { Badge, SourceLink } from '@/components/ui/primitives';
import { Provenance } from '@/components/ui/provenance';

export type QualitySignal = {
  id: string;
  officialName: string;
  whatItMeasures: string | null;
  components: string | null;
  accessMethod: string | null;
  apiReferenceUrl: string | null;
  whoCanAccess: string | null;
  sourceUrl: string | null;
  verification: string | null;
  notes: string | null;
};

const ACCESS_LABELS: Record<string, string> = {
  api: 'Available by API',
  downloadable_report: 'Downloadable report',
  seller_portal_only: 'Seller portal only',
};

/**
 * What a retailer itself publishes about listing quality. Signals a seller can actually reach are
 * shown first; anything that could not be found, or exists only as a name, is listed separately so
 * that "we looked and found nothing" is never confused with a real score.
 */
export function QualitySignals({ signals, compact = false }: { signals: QualitySignal[]; compact?: boolean }) {
  const reachable = signals.filter((s) => (s.accessMethod ?? 'none') !== 'none');
  const notReachable = signals.filter((s) => (s.accessMethod ?? 'none') === 'none' && !/^no official score/i.test(s.officialName));
  return (
    <div>
      {reachable.length === 0 ? (
        <p className="flex gap-2 px-5 py-4 text-[13.5px] text-ink-muted">
          <span className="mt-0.5">
            <Provenance kind="missing" compact />
          </span>
          No official listing-quality score that a seller can access was found in public documentation. None will be shown for this retailer unless one is obtained through an authorised route.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {reachable.map((signal) => (
            <li key={signal.id} className="px-5 py-4">
              <p className="text-[14px] font-medium text-ink">{signal.officialName}</p>
              {signal.whatItMeasures ? <p className="mt-1 text-[13px] text-ink-soft">{signal.whatItMeasures}</p> : null}
              {!compact && signal.components ? <p className="mt-1 text-[12.5px] text-ink-muted">Components: {signal.components}</p> : null}
              <p className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge tone={signal.accessMethod === 'api' ? 'verified' : 'estimated'}>{ACCESS_LABELS[signal.accessMethod ?? ''] ?? signal.accessMethod}</Badge>
                {signal.verification === 'official_document' ? (
                  <Badge tone="verified">Official document</Badge>
                ) : signal.verification === 'secondary_quote' ? (
                  <Badge tone="estimated">Reported by a partner, not by the retailer</Badge>
                ) : (
                  <Badge tone="missing">Unverified</Badge>
                )}
              </p>
              {signal.whoCanAccess ? <p className="mt-1.5 text-[12.5px] text-ink-muted">{signal.whoCanAccess}</p> : null}
              {!compact && signal.notes ? <p className="mt-1 text-[12.5px] text-ink-muted">{signal.notes}</p> : null}
              <p className="mt-1.5 flex flex-wrap gap-3 text-[12.5px]">
                {signal.sourceUrl ? <SourceLink href={signal.sourceUrl}>Source</SourceLink> : null}
                {signal.apiReferenceUrl ? <SourceLink href={signal.apiReferenceUrl}>API reference</SourceLink> : null}
              </p>
            </li>
          ))}
        </ul>
      )}
      {!compact && notReachable.length ? (
        <div className="border-t border-line px-5 py-4">
          <p className="label mb-2">Looked for, but not available to sellers</p>
          <ul className="space-y-2.5">
            {notReachable.map((signal) => (
              <li key={signal.id} className="text-[13px]">
                <span className="font-medium text-ink-soft">{signal.officialName}</span>
                <span className="text-ink-muted"> — {signal.notes ?? signal.whatItMeasures ?? 'Not accessible.'}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
