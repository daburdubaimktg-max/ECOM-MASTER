import Link from 'next/link';
import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { Search } from 'lucide-react';
import { ActiveNav, NavItems } from '@/components/shell/nav';
import { OrganisationName, UserPanel, UserPanelSkeleton } from '@/components/shell/user-panel';

/**
 * The application frame: navigation rail, search bar and the page area.
 * The frame itself is static and appears instantly; anything that depends on who is signed in
 * (user panel, organisation name, page content) streams in behind a placeholder.
 */
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen lg:flex">
      <aside className="flex flex-col bg-rail text-rail-ink lg:fixed lg:inset-y-0 lg:left-0 lg:w-[252px]">
        <Link href="/overview" className="block px-6 pt-6 pb-5">
          <span className="block font-mono text-[9.5px] uppercase tracking-[0.2em] text-signal">Brand</span>
          <span className="mt-0.5 block font-display text-[22px] leading-[1.05] font-light tracking-tight text-white">
            Intelligence
            <br />
            Engine
          </span>
        </Link>
        <Suspense fallback={<NavItems pathname={null} />}>
          <ActiveNav />
        </Suspense>
        <Suspense fallback={<UserPanelSkeleton />}>
          <UserPanel />
        </Suspense>
      </aside>

      <div className="min-w-0 flex-1 lg:pl-[252px]">
        <div className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1280px] items-center gap-6 px-6 py-3 lg:px-10">
            <form action="/knowledge" method="get" role="search" className="relative max-w-xl flex-1">
              <Search aria-hidden size={15} strokeWidth={1.7} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-ink-muted" />
              <input
                type="search"
                name="q"
                aria-label="Search the brand knowledge base"
                placeholder="Search the brand knowledge base — guidelines, claims, products, documents…"
                className="w-full rounded-[4px] border border-line-strong bg-card py-2 pr-3 pl-9 text-[13.5px] placeholder:text-ink-muted/80 focus:border-ink focus:outline-none"
              />
            </form>
            <p className="label hidden max-w-[16rem] truncate md:block">
              <Suspense fallback={null}>
                <OrganisationName />
              </Suspense>
            </p>
          </div>
        </div>
        <main className="mx-auto max-w-[1280px] px-6 py-9 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
