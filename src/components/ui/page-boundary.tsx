import { Suspense } from 'react';
import type { ReactNode } from 'react';

export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading" className="animate-fade">
      <div className="skeleton h-3 w-32" />
      <div className="skeleton mt-4 h-9 w-80 max-w-full" />
      <div className="skeleton mt-3 h-4 w-[34rem] max-w-full" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-28" />
        ))}
      </div>
      <div className="skeleton mt-6 h-64" />
    </div>
  );
}

/**
 * Every page renders its data inside this boundary. The skeleton is sent instantly; the page's
 * content (which needs the signed-in user and the database) streams in as soon as it is ready.
 */
export function PageBoundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}
