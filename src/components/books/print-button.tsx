'use client';

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="rounded-[4px] bg-ink px-4 py-2 text-[13.5px] font-medium text-paper hover:bg-signal">
      Print or save as PDF
    </button>
  );
}
