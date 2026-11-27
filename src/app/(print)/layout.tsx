import type { ReactNode } from 'react';

/** Pages made for printing or saving as PDF: no navigation, plain white page. */
export default function PrintLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-white text-ink print:bg-white">{children}</div>;
}
