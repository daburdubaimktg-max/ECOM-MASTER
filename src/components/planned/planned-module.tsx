import type { ReactNode } from 'react';
import { Badge, Card, CardHeader, PageHeader } from '@/components/ui/primitives';
import type { PlannedModule } from '@/lib/planned-modules';

const STAGE_NAMES: Record<number, string> = {
  3: 'E-commerce intelligence',
  4: 'Intelligence and scoring',
  5: 'AI and automation',
  6: 'Production readiness',
};

/** The page shown for a module that is designed but not yet built. */
export function PlannedModuleView({ module, children }: { module: PlannedModule; children?: ReactNode }) {
  return (
    <>
      <PageHeader
        eyebrow={module.eyebrow}
        title={
          <span className="flex flex-wrap items-center gap-3">
            {module.title}
            <Badge tone="estimated">
              Planned · Stage {module.stage} — {STAGE_NAMES[module.stage]}
            </Badge>
          </span>
        }
        description={module.summary}
      />
      <div className="mb-6 border-l-2 border-estimated bg-card px-4 py-3 text-[13.5px] text-ink-soft">
        <strong className="font-medium text-ink">This module is not built yet.</strong> Nothing on this page is live marketplace data. It shows what the module will do, what
        is already in place for it, and what it needs from you.
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader index="01" title="What it will do" />
          <ul className="divide-y divide-line">
            {module.willDo.map((item) => (
              <li key={item} className="px-5 py-3 text-[13.5px] text-ink-soft">
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader index="02" title="Already in place" />
          <ul className="divide-y divide-line">
            {module.inPlace.map((item) => (
              <li key={item} className="flex gap-2.5 px-5 py-3 text-[13.5px] text-ink-soft">
                <span aria-hidden className="mt-0.5 text-verified">
                  ●
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader index="03" title="What it needs first" />
          <ul className="divide-y divide-line">
            {module.needs.map((item) => (
              <li key={item} className="flex gap-2.5 px-5 py-3 text-[13.5px] text-ink-soft">
                <span aria-hidden className="mt-0.5 text-signal">
                  →
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      {children ? <div className="mt-6 space-y-6">{children}</div> : null}
    </>
  );
}
