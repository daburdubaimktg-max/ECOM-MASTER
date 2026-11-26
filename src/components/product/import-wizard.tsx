'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { importProductsAction } from '@/app/actions/products';
import { submitKeepingValues } from '@/components/ui/form';
import type { ImportReport } from '@/lib/services/products';

/**
 * Two steps: (1) "Check file" reads the spreadsheet and reports what would happen without saving
 * anything; (2) "Import" saves it. Rows with problems are skipped and listed; good rows still import.
 */
export function ImportWizard({ brands }: { brands: { id: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState(importProductsAction, null);
  const [mode, setMode] = useState<'check' | 'import'>('check');
  // A check result only counts for the exact file and brand it was run on.
  const [checkedKey, setCheckedKey] = useState<string | null>(null);
  const [currentKey, setCurrentKey] = useState<string>('');
  const report = state?.ok ? (state.data?.report as ImportReport | undefined) : undefined;
  const canImport = Boolean(report?.dryRun && report.rows > 0 && checkedKey !== null && checkedKey === currentKey);

  function keyOf(form: HTMLFormElement): string {
    const file = (form.elements.namedItem('file') as HTMLInputElement | null)?.files?.[0];
    const brand = (form.elements.namedItem('brandId') as HTMLSelectElement | null)?.value ?? '';
    return file ? `${brand}:${file.name}:${file.size}:${file.lastModified}` : '';
  }

  return (
    <form
      action={formAction}
      className="space-y-6"
      onChange={(event) => setCurrentKey(keyOf(event.currentTarget))}
      onSubmit={(event) => {
        const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        const nextMode = submitter?.value === 'import' ? 'import' : 'check';
        setMode(nextMode);
        const key = keyOf(event.currentTarget);
        setCurrentKey(key);
        setCheckedKey(nextMode === 'check' ? key : null);
        submitKeepingValues(event, formAction);
      }}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="brandId" className="mb-1.5 block text-[13px] font-medium">
            Import into brand
          </label>
          <select id="brandId" name="brandId" required defaultValue={brands.length === 1 ? brands[0].id : ''} className="field-input">
            <option value="" disabled>
              Choose a brand…
            </option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="file" className="mb-1.5 block text-[13px] font-medium">
            Spreadsheet saved as CSV
          </label>
          <input id="file" name="file" type="file" accept=".csv,text/csv" required className="field-input !p-1.5 text-[13px] file:mr-3 file:rounded-[3px] file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-[12.5px] file:text-paper" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="submit" name="mode" value="check" disabled={pending} className="rounded-[4px] border border-line-strong bg-card px-3.5 py-2 text-[13.5px] font-medium hover:border-ink disabled:opacity-50">
          {pending && mode === 'check' ? 'Checking…' : '1 · Check file'}
        </button>
        <button type="submit" name="mode" value="import" disabled={pending || !canImport} className="rounded-[4px] bg-ink px-3.5 py-2 text-[13.5px] font-medium text-paper hover:bg-signal disabled:cursor-not-allowed disabled:opacity-40">
          {pending && mode === 'import' ? 'Importing…' : '2 · Import'}
        </button>
        <span className="text-[12.5px] text-ink-muted">Checking saves nothing. Import becomes available after a check.</span>
      </div>

      {state && !state.ok && state.error ? (
        <p role="alert" className="border-l-2 border-signal bg-signal-soft px-3 py-2 text-[13px] text-signal-deep">
          {state.error}
        </p>
      ) : null}

      {report ? (
        <div className="rounded-md border border-line bg-paper/60 p-5" data-testid="import-report">
          <p className="label">{report.dryRun ? 'Check result — nothing has been saved' : 'Import complete'}</p>
          <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {[
              ['Rows read', report.rows],
              [report.dryRun ? 'Products to create' : 'Products created', report.productsCreated],
              [report.dryRun ? 'Products to update' : 'Products updated', report.productsUpdated],
              [report.dryRun ? 'SKUs to create' : 'SKUs created', report.skusCreated],
              [report.dryRun ? 'SKUs to update' : 'SKUs updated', report.skusUpdated],
            ].map(([label, value]) => (
              <div key={label as string}>
                <dd className="font-display text-[30px] leading-none font-light">{value}</dd>
                <dt className="label mt-1.5 !text-[9.5px]">{label}</dt>
              </div>
            ))}
          </dl>
          {report.issues.length ? (
            <div className="mt-5">
              <p className="text-[13.5px] font-medium text-signal-deep">
                {report.issues.length} row{report.issues.length === 1 ? '' : 's'} {report.dryRun ? 'will be skipped' : 'skipped'}:
              </p>
              <ul className="mt-2 max-h-64 space-y-1 overflow-y-auto text-[13px]">
                {report.issues.map((issue, i) => (
                  <li key={i} className="flex gap-3 border-l-2 border-signal bg-card px-3 py-1.5">
                    <span className="num shrink-0 text-ink-muted">Row {issue.row}</span>
                    <span>{issue.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mt-4 text-[13.5px] text-verified">No problems found in the file.</p>
          )}
          {!report.dryRun ? (
            <Link href="/products" className="mt-4 inline-block text-[13.5px] underline underline-offset-4 hover:text-signal">
              View the catalogue
            </Link>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
