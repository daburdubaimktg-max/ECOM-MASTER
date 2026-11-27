'use client';

import { addCustomMarketplaceAction, setBrandPresenceAction, updateMarketplaceSettingsAction } from '@/app/actions/marketplaces';
import { ActionForm, Field, SelectInput, SubmitButton, TextInput } from '@/components/ui/form';
import { MARKETPLACE_TYPE_LABELS, PLATFORM_CATEGORY_LABELS } from '@/lib/labels';

export function TrackingForm({ marketplaceId, status, notes }: { marketplaceId: string; status: string; notes: string | null }) {
  return (
    <ActionForm action={updateMarketplaceSettingsAction} className="space-y-3">
      <input type="hidden" name="marketplaceId" value={marketplaceId} />
      <Field label="Do we track this platform?" name="monitoringStatus">
        <SelectInput name="monitoringStatus" defaultValue={status}>
          <option value="not_monitored">Not tracked</option>
          <option value="planned">Planned</option>
          <option value="active">Tracked</option>
        </SelectInput>
      </Field>
      <Field label="Notes" name="notes" optional>
        <TextInput name="notes" defaultValue={notes ?? ''} placeholder="e.g. start once the distributor shares access" />
      </Field>
      <SubmitButton variant="secondary">Save</SubmitButton>
    </ActionForm>
  );
}

export function PresenceForm({
  marketplaceId,
  brands,
  current,
}: {
  marketplaceId: string;
  brands: { id: string; name: string }[];
  current: Record<string, { presence: string; sellingModel: string; notes: string | null }>;
}) {
  return (
    <ul className="divide-y divide-line">
      {brands.map((brand) => {
        const value = current[brand.id] ?? { presence: 'unknown', sellingModel: 'unknown', notes: null };
        return (
          <li key={brand.id} className="px-5 py-4">
            <ActionForm action={setBrandPresenceAction}>
              <input type="hidden" name="marketplaceId" value={marketplaceId} />
              <input type="hidden" name="brandId" value={brand.id} />
              <p className="mb-2 text-[14px] font-medium">{brand.name}</p>
              <div className="flex flex-wrap items-end gap-2">
                <div>
                  <label className="label mb-1 block" htmlFor={`presence-${brand.id}`}>
                    Sold here?
                  </label>
                  <select id={`presence-${brand.id}`} name="presence" defaultValue={value.presence} className="field-input !w-auto !py-1.5 text-[13px]">
                    <option value="unknown">Not known</option>
                    <option value="present">Yes</option>
                    <option value="absent">No</option>
                  </select>
                </div>
                <div>
                  <label className="label mb-1 block" htmlFor={`model-${brand.id}`}>
                    Sold by
                  </label>
                  <select id={`model-${brand.id}`} name="sellingModel" defaultValue={value.sellingModel} className="field-input !w-auto !py-1.5 text-[13px]">
                    <option value="unknown">Not known</option>
                    <option value="own_seller_account">Our own seller account</option>
                    <option value="first_party_vendor">The retailer buys from us</option>
                    <option value="distributor">A distributor</option>
                  </select>
                </div>
                <SubmitButton variant="secondary" className="!py-1.5 !text-[12.5px]">
                  Save
                </SubmitButton>
              </div>
            </ActionForm>
          </li>
        );
      })}
    </ul>
  );
}

export function CustomMarketplaceForm({ countries }: { countries: { code: string; name: string }[] }) {
  return (
    <ActionForm action={addCustomMarketplaceAction} className="grid gap-4 md:grid-cols-3">
      {(state) => {
        const e = state?.fieldErrors ?? {};
        return (
          <>
            <Field label="Platform name" name="name" error={e.name}>
              <TextInput name="name" required maxLength={120} error={e.name} />
            </Field>
            <Field label="Country" name="countryCode" error={e.countryCode}>
              <SelectInput name="countryCode" defaultValue="" required>
                <option value="" disabled>
                  Choose…
                </option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Website" name="website" optional error={e.website}>
              <TextInput name="website" placeholder="https://" error={e.website} />
            </Field>
            <Field label="Kind of platform" name="platformCategory">
              <SelectInput name="platformCategory" defaultValue="general_marketplace">
                {Object.entries(PLATFORM_CATEGORY_LABELS).map(([value, text]) => (
                  <option key={value} value={value}>
                    {text}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Business model" name="marketplaceType">
              <SelectInput name="marketplaceType" defaultValue="first_party_retailer">
                {Object.entries(MARKETPLACE_TYPE_LABELS).map(([value, text]) => (
                  <option key={value} value={value}>
                    {text}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <Field label="Why add it?" name="notes" optional>
              <TextInput name="notes" placeholder="e.g. requested by the Kenya sales team" />
            </Field>
            <div className="md:col-span-3">
              <SubmitButton>Add platform</SubmitButton>
            </div>
          </>
        );
      }}
    </ActionForm>
  );
}
