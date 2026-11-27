import type { DataClass } from '@/db/schema';

/**
 * The five kinds of information the product shows, and how each is marked.
 * These markers appear next to every metric so that a verified fact, a calculation,
 * an AI judgement, an estimate and a gap in the data can never be mistaken for one another.
 */
export const PROVENANCE: Record<DataClass, { label: string; glyph: string; description: string; text: string; bg: string }> = {
  verified: {
    label: 'Verified',
    glyph: '●',
    description: 'Taken directly from an authoritative source or entered and approved by your team.',
    text: 'text-verified',
    bg: 'bg-verified-soft',
  },
  calculated: {
    label: 'Calculated',
    glyph: '◆',
    description: 'Computed by the system from stored data using a published, versioned formula.',
    text: 'text-calculated',
    bg: 'bg-calculated-soft',
  },
  ai_assessed: {
    label: 'AI-assessed',
    glyph: '✦',
    description: 'A judgement made by an AI model. Useful, but must be reviewed by a person.',
    text: 'text-ai',
    bg: 'bg-ai-soft',
  },
  estimated: {
    label: 'Estimated',
    glyph: '◐',
    description: 'An estimate from a third party or analyst — not a measured or verified figure.',
    text: 'text-estimated',
    bg: 'bg-estimated-soft',
  },
  missing: {
    label: 'Not available',
    glyph: '○',
    description: 'No data through the current integrations. This is a gap, not a zero.',
    text: 'text-missing',
    bg: 'bg-missing-soft',
  },
};

export function Provenance({ kind, compact = false, title }: { kind: DataClass; compact?: boolean; title?: string }) {
  const p = PROVENANCE[kind];
  return (
    <span
      title={title ?? `${p.label}: ${p.description}`}
      className={`inline-flex items-center gap-1 rounded-sm ${compact ? '' : `${p.bg} px-1.5 py-0.5`} ${p.text} font-mono text-[10.5px] font-medium uppercase tracking-[0.06em] whitespace-nowrap`}
    >
      <span aria-hidden className="text-[9px] leading-none">
        {p.glyph}
      </span>
      {compact ? <span className="sr-only">{p.label}</span> : p.label}
    </span>
  );
}

export function ProvenanceLegend() {
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {(Object.keys(PROVENANCE) as DataClass[]).map((kind) => (
        <div key={kind} className="border-l-2 border-line pl-3">
          <dt>
            <Provenance kind={kind} />
          </dt>
          <dd className="mt-1 text-[12.5px] leading-snug text-ink-muted">{PROVENANCE[kind].description}</dd>
        </div>
      ))}
    </dl>
  );
}
