import type { Metadata } from 'next';
import { PlannedModuleView } from '@/components/planned/planned-module';
import { PageBoundary } from '@/components/ui/page-boundary';
import { requireContext } from '@/lib/auth/server';
import { PLANNED_MODULES } from '@/lib/planned-modules';

const planned = PLANNED_MODULES['recommendations'];

export const metadata: Metadata = { title: planned.title };

async function Content() {
  await requireContext();
  return <PlannedModuleView module={planned} />;
}

export default function RecommendationsPage() {
  return (
    <PageBoundary>
      <Content />
    </PageBoundary>
  );
}
