import type { Metadata } from 'next';
import { PlannedModuleView } from '@/components/planned/planned-module';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Badge, Card, CardHeader } from '@/components/ui/primitives';
import { requireContext } from '@/lib/auth/server';
import { PLANNED_MODULES } from '@/lib/planned-modules';
import { listReviewThemes } from '@/lib/services/reference';

const planned = PLANNED_MODULES.reviews;

export const metadata: Metadata = { title: planned.title };

async function Content() {
  const ctx = await requireContext();
  const themes = await listReviewThemes(ctx);
  return (
    <PlannedModuleView module={planned}>
      <Card>
        <CardHeader index="A" title="Review themes" description="The starting list reviews will be grouped into. It is configuration, not data — no reviews have been collected." action={<Badge tone="calculated">Configuration</Badge>} />
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {themes.map((theme) => (
            <li key={theme.id} className="bg-card px-5 py-3.5">
              <p className="text-[14px] font-medium">{theme.label}</p>
              <p className="mt-0.5 text-[12.5px] text-ink-muted">{theme.description}</p>
            </li>
          ))}
        </ul>
      </Card>
    </PlannedModuleView>
  );
}

export default function ReviewsPage() {
  return (
    <PageBoundary>
      <Content />
    </PageBoundary>
  );
}
