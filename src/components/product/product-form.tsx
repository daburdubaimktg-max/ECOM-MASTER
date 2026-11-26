'use client';

import Link from 'next/link';
import { createProductAction, updateProductAction } from '@/app/actions/products';
import { ActionForm, Field, SelectInput, SubmitButton, TextArea, TextInput } from '@/components/ui/form';
import { buttonClass } from '@/components/ui/primitives';

export type ProductFormValues = {
  id?: string;
  brandId?: string;
  name?: string;
  subBrand?: string | null;
  category?: string | null;
  description?: string | null;
  benefits?: string[];
  ingredients?: string | null;
  directionsForUse?: string | null;
  warnings?: string | null;
  targetAudience?: string | null;
  status?: 'draft' | 'active' | 'discontinued';
};

export function ProductForm({ product, brands }: { product?: ProductFormValues; brands: { id: string; name: string }[] }) {
  const editing = Boolean(product?.id);
  return (
    <ActionForm action={editing ? updateProductAction : createProductAction} className="space-y-8">
      {(state) => {
        const e = state?.fieldErrors ?? {};
        return (
          <>
            {editing ? <input type="hidden" name="productId" value={product!.id} /> : null}
            <fieldset className="grid gap-5 md:grid-cols-2">
              <legend className="label mb-4 w-full border-b border-line pb-2">01 — Identity</legend>
              {editing ? null : (
                <Field label="Brand" name="brandId" error={e.brandId}>
                  <SelectInput name="brandId" defaultValue={product?.brandId ?? (brands.length === 1 ? brands[0].id : '')} required error={e.brandId}>
                    <option value="" disabled>
                      Choose a brand…
                    </option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </SelectInput>
                </Field>
              )}
              <Field label="Product name" name="name" hint="The parent product, without size or pack — sizes are added as SKUs." error={e.name}>
                <TextInput name="name" defaultValue={product?.name ?? ''} required maxLength={200} error={e.name} />
              </Field>
              <Field label="Sub-brand or range" name="subBrand" optional>
                <TextInput name="subBrand" defaultValue={product?.subBrand ?? ''} maxLength={120} />
              </Field>
              <Field label="Category" name="category" optional hint="e.g. Hair Care > Hair Oil">
                <TextInput name="category" defaultValue={product?.category ?? ''} maxLength={200} />
              </Field>
              <Field label="Status" name="status" hint="Draft records are labelled unverified in the knowledge base until made active.">
                <SelectInput name="status" defaultValue={product?.status ?? 'draft'}>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="discontinued">Discontinued</option>
                </SelectInput>
              </Field>
            </fieldset>

            <fieldset className="grid gap-5 md:grid-cols-2">
              <legend className="label mb-4 w-full border-b border-line pb-2">02 — Product information</legend>
              <div className="md:col-span-2">
                <Field label="Description" name="description" optional error={e.description}>
                  <TextArea name="description" defaultValue={product?.description ?? ''} rows={4} />
                </Field>
              </div>
              <Field label="Benefits" name="benefits" optional hint="One per line. To use a benefit in content it must also be an approved claim.">
                <TextArea name="benefits" defaultValue={(product?.benefits ?? []).join('\n')} rows={5} />
              </Field>
              <Field label="Ingredients" name="ingredients" optional hint="As printed on the pack.">
                <TextArea name="ingredients" defaultValue={product?.ingredients ?? ''} rows={5} />
              </Field>
              <Field label="Directions for use" name="directionsForUse" optional>
                <TextArea name="directionsForUse" defaultValue={product?.directionsForUse ?? ''} rows={3} />
              </Field>
              <Field label="Warnings" name="warnings" optional>
                <TextArea name="warnings" defaultValue={product?.warnings ?? ''} rows={3} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Target audience" name="targetAudience" optional>
                  <TextInput name="targetAudience" defaultValue={product?.targetAudience ?? ''} />
                </Field>
              </div>
            </fieldset>

            <div className="flex items-center gap-2 border-t border-line pt-5">
              <SubmitButton>{editing ? 'Save changes' : 'Create product'}</SubmitButton>
              <Link href={editing ? `/products/${product!.id}` : '/products'} className={buttonClass('ghost')}>
                Cancel
              </Link>
            </div>
          </>
        );
      }}
    </ActionForm>
  );
}
