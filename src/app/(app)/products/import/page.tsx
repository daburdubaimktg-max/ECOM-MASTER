import type { Metadata } from 'next';
import { Download } from 'lucide-react';
import { ImportWizard } from '@/components/product/import-wizard';
import { PageBoundary } from '@/components/ui/page-boundary';
import { Card, CardHeader, Notice, PageHeader } from '@/components/ui/primitives';
import { can } from '@/lib/auth/context';
import { requireContext } from '@/lib/auth/server';
import { listBrands } from '@/lib/services/brands';
import { PRODUCT_CSV_COLUMNS } from '@/lib/services/products';

export const metadata: Metadata = { title: 'Import products' };

const COLUMN_HELP: Record<string, string> = {
  product_name: 'Required. Rows with the same name belong to the same product.',
  sub_brand: 'Range or sub-brand.',
  category: 'e.g. Hair Care > Hair Oil',
  description: 'Approved product description.',
  benefits: 'Separate several with a | character.',
  ingredients: 'As printed on the pack.',
  directions_for_use: 'How to use the product.',
  target_audience: 'Who it is for.',
  status: 'draft, active or discontinued (blank = draft for new products).',
  variant_name: 'Scent, shade or formulation.',
  size_value: 'Number only, e.g. 200',
  size_unit: 'ml, g, l, kg, oz, count…',
  pack_quantity: 'Units per pack; 2 for a twin pack (blank = 1).',
  sku_code: 'Your SKU code. Must be unique. Leave blank for a row that only adds product information.',
  gtin: 'Barcode (8, 12, 13 or 14 digits). The check digit is verified.',
  countries: 'Two-letter codes separated by | — e.g. AE|SA|IN',
};

async function Import() {
  const ctx = await requireContext();
  const brands = await listBrands(ctx);
  return (
    <>
      <PageHeader
        eyebrow="Product catalogue"
        title="Import from a spreadsheet"
        description="Bring in many products at once: one row per SKU. Safe to repeat — existing products and SKUs are updated, never duplicated, and blank cells never erase information."
        actions={
          <a href="/api/products/template" className="inline-flex items-center gap-1.5 rounded-[4px] border border-line-strong bg-card px-3.5 py-2 text-[13.5px] font-medium hover:border-ink">
            <Download size={15} /> Download template
          </a>
        }
      />
      {!can(ctx, 'product.import') ? (
        <Notice tone="signal" title="You cannot import products">
          Your role does not include importing into the product catalogue.
        </Notice>
      ) : brands.length === 0 ? (
        <Notice title="Create a brand first">Products are imported into a brand.</Notice>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_26rem]">
          <Card>
            <CardHeader index="01" title="Check, then import" />
            <div className="p-5">
              <ImportWizard brands={brands.map((b) => ({ id: b.id, name: b.name }))} />
            </div>
          </Card>
          <Card>
            <CardHeader index="02" title="Columns" description="In Excel or Google Sheets choose “Save as / Download → CSV”." />
            <dl className="divide-y divide-line">
              {PRODUCT_CSV_COLUMNS.map((column) => (
                <div key={column} className="px-5 py-2.5">
                  <dt className="num text-[12.5px] font-medium text-ink">{column}</dt>
                  <dd className="text-[12.5px] text-ink-muted">{COLUMN_HELP[column]}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      )}
    </>
  );
}

export default function ImportPage() {
  return (
    <PageBoundary>
      <Import />
    </PageBoundary>
  );
}
