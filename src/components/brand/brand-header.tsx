import Link from 'next/link';
import { Badge, PageHeader, Tabs } from '@/components/ui/primitives';
import type { ReactNode } from 'react';

export type BrandHeaderData = {
  id: string;
  name: string;
  tagline: string | null;
  status: 'active' | 'archived';
  isDemo: boolean;
};

export function BrandHeader({
  brand,
  current,
  actions,
}: {
  brand: BrandHeaderData;
  current: 'profile' | 'guidelines' | 'claims' | 'assets' | 'competitors';
  actions?: ReactNode;
}) {
  const base = `/brands/${brand.id}`;
  const tabs = [
    { key: 'profile', href: base, label: 'Profile' },
    { key: 'guidelines', href: `${base}/guidelines`, label: 'Guidelines' },
    { key: 'claims', href: `${base}/claims`, label: 'Claims' },
    { key: 'assets', href: `${base}/assets`, label: 'Documents & media' },
    { key: 'competitors', href: `${base}/competitors`, label: 'Competitors' },
  ];
  return (
    <PageHeader
      eyebrow="Brand"
      title={
        <span className="flex flex-wrap items-center gap-3">
          {brand.name}
          {brand.isDemo ? <Badge tone="estimated">Demonstration data</Badge> : null}
          {brand.status === 'archived' ? <Badge tone="missing">Archived</Badge> : null}
        </span>
      }
      description={brand.tagline ?? undefined}
      actions={
        <>
          <Link href={`/products?brand=${brand.id}`} className="text-[13.5px] underline decoration-line-strong underline-offset-4 hover:text-signal">
            Products of this brand
          </Link>
          {actions}
        </>
      }
    >
      <Tabs items={tabs} current={tabs.find((t) => t.key === current)!.href} />
    </PageHeader>
  );
}
