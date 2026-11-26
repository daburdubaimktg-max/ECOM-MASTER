'use client';

import { addIdentifierAction, saveSkuAction, setAttributeAction, setAvailabilityAction } from '@/app/actions/products';
import { ActionForm, Field, SelectInput, SubmitButton, TextInput } from '@/components/ui/form';

const UNITS = ['ml', 'l', 'g', 'kg', 'oz', 'fl oz', 'count', 'pcs'];

export function SkuForm({ productId }: { productId: string }) {
  return (
    <ActionForm action={saveSkuAction} resetOnSuccess>
      {(state) => {
        const e = state?.fieldErrors ?? {};
        return (
          <>
            <input type="hidden" name="productId" value={productId} />
            <div className="grid gap-3 md:grid-cols-6">
              <div className="md:col-span-2">
                <Field label="SKU code" name="skuCode" error={e.skuCode}>
                  <TextInput name="skuCode" required maxLength={80} placeholder="e.g. HO-ALM-200" className="num" error={e.skuCode} />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Variant" name="variantName" optional hint="Scent, shade or formulation">
                  <TextInput name="variantName" maxLength={120} placeholder="e.g. Almond" />
                </Field>
              </div>
              <Field label="Size" name="sizeValue" optional error={e.sizeValue}>
                <TextInput name="sizeValue" inputMode="decimal" placeholder="200" className="num" error={e.sizeValue} />
              </Field>
              <Field label="Unit" name="sizeUnit" optional>
                <SelectInput name="sizeUnit" defaultValue="ml">
                  {UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Units per pack" name="packQuantity" hint="2 for a twin pack" error={e.packQuantity}>
                <TextInput name="packQuantity" type="number" min={1} defaultValue={1} className="num" error={e.packQuantity} />
              </Field>
              <div className="md:col-span-3">
                <Field label="Barcode (GTIN / EAN / UPC)" name="gtin" optional hint="8, 12, 13 or 14 digits — the check digit is verified." error={e.gtin}>
                  <TextInput name="gtin" inputMode="numeric" className="num" placeholder="e.g. 6291000000000" error={e.gtin} />
                </Field>
              </div>
              <div className="flex items-start pt-[1.55rem] md:col-span-2">
                <SubmitButton>Add SKU</SubmitButton>
              </div>
            </div>
          </>
        );
      }}
    </ActionForm>
  );
}

export function IdentifierForm({ skuId }: { skuId: string }) {
  return (
    <ActionForm action={addIdentifierAction} resetOnSuccess successMessage={false} className="mt-2">
      <input type="hidden" name="skuId" value={skuId} />
      <div className="flex flex-wrap items-center gap-2">
        <select name="type" aria-label="Identifier type" defaultValue="asin" className="field-input !w-auto !py-1.5 text-[12.5px]">
          <option value="gtin">Barcode (GTIN)</option>
          <option value="asin">Amazon ASIN</option>
          <option value="marketplace_sku">Marketplace product ID</option>
          <option value="manufacturer_part_number">Manufacturer part no.</option>
          <option value="other">Other</option>
        </select>
        <input name="value" aria-label="Identifier value" required placeholder="Value" className="field-input num !w-44 !py-1.5 text-[12.5px]" />
        <input name="countryCode" aria-label="Country code (optional)" maxLength={2} placeholder="Country (AE)" className="field-input num !w-28 !py-1.5 text-[12.5px] uppercase" />
        <SubmitButton variant="secondary" className="!py-1.5 !text-[12.5px]">
          Add
        </SubmitButton>
      </div>
    </ActionForm>
  );
}

export function AttributeForm({ productId }: { productId: string }) {
  return (
    <ActionForm action={setAttributeAction} resetOnSuccess successMessage={false}>
      <input type="hidden" name="productId" value={productId} />
      <div className="flex flex-wrap items-end gap-2">
        <div className="min-w-[9rem] flex-1">
          <label htmlFor="attr-key" className="label mb-1 block">
            Attribute
          </label>
          <input id="attr-key" name="key" required placeholder="e.g. Hair type" className="field-input !py-1.5 text-[13px]" />
        </div>
        <div className="min-w-[9rem] flex-1">
          <label htmlFor="attr-value" className="label mb-1 block">
            Value
          </label>
          <input id="attr-value" name="value" required placeholder="e.g. Dry, damaged" className="field-input !py-1.5 text-[13px]" />
        </div>
        <div className="w-20">
          <label htmlFor="attr-unit" className="label mb-1 block">
            Unit
          </label>
          <input id="attr-unit" name="unit" placeholder="—" className="field-input !py-1.5 text-[13px]" />
        </div>
        <SubmitButton variant="secondary" className="!py-2 !text-[12.5px]">
          Save
        </SubmitButton>
      </div>
    </ActionForm>
  );
}

export function AvailabilityForm({ productId, countries, selected }: { productId: string; countries: { code: string; name: string }[]; selected: string[] }) {
  return (
    <ActionForm action={setAvailabilityAction}>
      <input type="hidden" name="productId" value={productId} />
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {countries.map((country) => (
          <label key={country.code} className="flex items-center gap-1.5 text-[13px] text-ink-soft">
            <input type="checkbox" name="countryCodes" value={country.code} defaultChecked={selected.includes(country.code)} className="accent-[#16211c]" />
            {country.name}
          </label>
        ))}
      </div>
      <SubmitButton variant="secondary" className="mt-4 !py-1.5 !text-[12.5px]">
        Save markets
      </SubmitButton>
    </ActionForm>
  );
}
