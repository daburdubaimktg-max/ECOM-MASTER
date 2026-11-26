import { NextResponse } from 'next/server';
import { getContext } from '@/lib/auth/server';
import { PRODUCT_CSV_TEMPLATE } from '@/lib/services/products';

/** The spreadsheet template for importing products (one row per SKU). */
export async function GET() {
  const ctx = await getContext();
  if (!ctx) return NextResponse.json({ error: 'Not signed in.' }, { status: 401 });
  return new Response(PRODUCT_CSV_TEMPLATE, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="product-import-template.csv"',
      'Cache-Control': 'private, no-store',
    },
  });
}
