'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileBarChart,
  Gauge,
  Globe2,
  LayoutDashboard,
  Lightbulb,
  Package,
  PenLine,
  ScanSearch,
  Search,
  Settings,
  Stamp,
  Star,
  Swords,
  Workflow,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NAV_GROUPS } from '@/lib/navigation';

const ICONS: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  brands: Stamp,
  products: Package,
  search: Search,
  marketplaces: Globe2,
  shelf: ScanSearch,
  quality: Gauge,
  reviews: Star,
  competitors: Swords,
  content: PenLine,
  recommendations: Lightbulb,
  reports: FileBarChart,
  automation: Workflow,
  settings: Settings,
};

/** The navigation list. `pathname` is null while the page shell is being prepared (no item highlighted yet). */
export function NavItems({ pathname }: { pathname: string | null }) {
  return (
    <nav aria-label="Main" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:flex-1 lg:space-y-5 lg:overflow-y-auto lg:pb-6">
      {NAV_GROUPS.map((group, groupIndex) => (
        <div key={group.label ?? groupIndex} className="flex shrink-0 gap-1 lg:block">
          {group.label ? (
            <p className="mb-1.5 hidden px-3 font-mono text-[9.5px] uppercase tracking-[0.14em] text-rail-muted lg:block">{group.label}</p>
          ) : null}
          <ul className="flex gap-1 lg:block lg:space-y-px">
            {group.items.map((item) => {
              const Icon = ICONS[item.icon] ?? LayoutDashboard;
              const active = pathname !== null && (pathname === item.href || pathname.startsWith(`${item.href}/`));
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`group relative flex items-center gap-2.5 rounded-[4px] px-3 py-[7px] text-[13.5px] whitespace-nowrap transition-colors ${
                      active ? 'bg-rail-soft text-white' : 'text-rail-ink/80 hover:bg-rail-soft/60 hover:text-white'
                    }`}
                  >
                    {active ? <span aria-hidden className="absolute top-1.5 bottom-1.5 left-0 hidden w-[2px] rounded-full bg-signal lg:block" /> : null}
                    <Icon aria-hidden size={15} strokeWidth={1.6} className={active ? 'text-signal' : 'text-rail-muted group-hover:text-rail-ink'} />
                    <span className="flex-1">{item.label}</span>
                    {item.stage ? (
                      <span title={`Planned for build stage ${item.stage}`} className="hidden rounded-sm border border-rail-line px-1 font-mono text-[9px] uppercase tracking-wider text-rail-muted lg:inline">
                        S{item.stage}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function ActiveNav() {
  return <NavItems pathname={usePathname()} />;
}
