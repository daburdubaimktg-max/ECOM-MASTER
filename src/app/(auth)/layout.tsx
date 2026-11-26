import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden overflow-hidden bg-rail p-12 text-rail-ink lg:flex lg:flex-col lg:justify-between">
        <div aria-hidden className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div aria-hidden className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full border border-rail-line" />
        <div aria-hidden className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full border border-signal/40" />
        <div className="relative">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-signal">Brand</span>
          <p className="mt-1 font-display text-[44px] leading-[1.02] font-light tracking-tight text-white">
            Intelligence
            <br />
            Engine
          </p>
        </div>
        <div className="relative max-w-md">
          <p className="font-display text-[22px] leading-snug font-light text-rail-ink">
            One place that knows what your brand stands for, what it sells, where it is sold and what to do next.
          </p>
          <ul className="mt-8 space-y-2.5 font-mono text-[11px] uppercase tracking-[0.08em] text-rail-muted">
            <li><span className="mr-2 text-verified">●</span>Verified facts</li>
            <li><span className="mr-2 text-[#6aa3df]">◆</span>Calculated scores</li>
            <li><span className="mr-2 text-[#b58be0]">✦</span>AI assessments, reviewed by people</li>
            <li><span className="mr-2 text-[#e0b25a]">◐</span>Estimates, labelled as estimates</li>
            <li><span className="mr-2">○</span>Missing data, never shown as zero</li>
          </ul>
        </div>
      </aside>
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[26rem] animate-rise">{children}</div>
      </main>
    </div>
  );
}
