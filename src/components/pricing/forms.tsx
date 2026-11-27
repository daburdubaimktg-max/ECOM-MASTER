'use client';

import { useState } from 'react';
import { recordPriceAction, trackPriceAction } from '@/app/actions/pricing';
import { ActionForm, Field, SelectInput, SubmitButton, TextInput } from '@/components/ui/form';

type Option = { id: string; label: string };
type Market = { id: string; name: string; countryCode: string; tracking: string | null };

function MarketplaceSelect({ markets, error }: { markets: Market[]; error?: string }) {
  const byCountry = new Map<string, Market[]>();
  for (const m of markets) byCountry.set(m.countryCode, [...(byCountry.get(m.countryCode) ?? []), m]);
  return (
    <Field label="Marketplace" name="marketplaceId" error={error}>
      <SelectInput name="marketplaceId" required defaultValue="">
        <option value="" disabled>
          Choose…
        </option>
        {[...byCountry.entries()].map(([country, list]) => (
          <optgroup key={country} label={country}>
            {list.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
                {m.tracking === 'active' ? ' — tracked' : ''}
              </option>
            ))}
          </optgroup>
        ))}
      </SelectInput>
    </Field>
  );
}

export function TrackForm({
  brands,
  skus,
  competitors,
  markets,
}: {
  brands: Option[];
  skus: (Option & { brandId: string })[];
  competitors: { id: string; name: string; brandId: string }[];
  markets: Market[];
}) {
  const [whose, setWhose] = useState<'own' | 'competitor'>('own');
  const [brandId, setBrandId] = useState(brands[0]?.id ?? '');
  const brandSkus = skus.filter((s) => s.brandId === brandId);
  const brandCompetitors = competitors.filter((c) => c.brandId === brandId);
  return (
    <ActionForm action={trackPriceAction} className="space-y-4" resetOnSuccess>
      {(state) => (
        <>
          <fieldset className="flex gap-1 rounded-[4px] border border-line-strong bg-white p-1 text-[13px]">
            <legend className="sr-only">Whose product</legend>
            {(['own', 'competitor'] as const).map((value) => (
              <label key={value} className={`flex-1 cursor-pointer rounded-[3px] px-3 py-1.5 text-center ${whose === value ? 'bg-ink text-paper' : 'text-ink-soft hover:bg-paper-deep'}`}>
                <input type="radio" name="whose" value={value} checked={whose === value} onChange={() => setWhose(value)} className="sr-only" />
                {value === 'own' ? 'Our product' : 'Competitor product'}
              </label>
            ))}
          </fieldset>
          <Field label="Brand" name="brandId">
            <SelectInput name="brandId" value={brandId} onChange={(e) => setBrandId(e.target.value)}>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </SelectInput>
          </Field>
          {whose === 'own' ? (
            <Field label="Our SKU" name="skuId" error={state?.fieldErrors?.skuId} hint={brandSkus.length ? undefined : 'This brand has no SKUs yet — add them in the Product Catalogue.'}>
              <SelectInput name="skuId" required defaultValue="">
                <option value="" disabled>
                  Choose…
                </option>
                {brandSkus.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </SelectInput>
            </Field>
          ) : (
            <>
              <Field label="Competitor brand" name="competitorId" error={state?.fieldErrors?.competitorId} hint={brandCompetitors.length ? undefined : 'Add competitor brands first under Brands → Competitors.'}>
                <SelectInput name="competitorId" required defaultValue="">
                  <option value="" disabled>
                    Choose…
                  </option>
                  {brandCompetitors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Product name" name="name" error={state?.fieldErrors?.name}>
                <TextInput name="name" required maxLength={200} placeholder="e.g. Argan Repair Hair Oil" error={state?.fieldErrors?.name} />
              </Field>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Size" name="sizeValue">
                  <TextInput name="sizeValue" inputMode="decimal" placeholder="200" />
                </Field>
                <Field label="Unit" name="sizeUnit">
                  <SelectInput name="sizeUnit" defaultValue="ml">
                    {['ml', 'l', 'g', 'kg', 'oz', 'fl oz', 'count', 'pcs'].map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </SelectInput>
                </Field>
                <Field label="Pack" name="packQuantity">
                  <TextInput name="packQuantity" inputMode="numeric" defaultValue="1" />
                </Field>
              </div>
              <Field label="Compare with our SKU" name="comparableSkuId" optional hint="Needed to show which of the two is cheaper per 100 ml / 100 g.">
                <SelectInput name="comparableSkuId" defaultValue="">
                  <option value="">Not compared</option>
                  {brandSkus.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </>
          )}
          <MarketplaceSelect markets={markets} error={state?.fieldErrors?.marketplaceId} />
          <Field label="Product page address" name="url" optional>
            <TextInput name="url" placeholder="https://" />
          </Field>
          <SubmitButton pendingLabel="Adding…">Add to price board</SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

export function RecordPriceForm({ listingId, currency, sources }: { listingId: string; currency: string; sources: Record<string, string> }) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <ActionForm action={recordPriceAction} className="space-y-3" resetOnSuccess>
      {(state) => (
        <>
          <input type="hidden" name="listingId" value={listingId} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Field label="Date seen" name="observedOn" error={state?.fieldErrors?.observedOn}>
              <TextInput name="observedOn" type="date" defaultValue={today} max={today} required />
            </Field>
            <Field label="Currency" name="currencyCode" error={state?.fieldErrors?.currencyCode}>
              <TextInput name="currencyCode" defaultValue={currency} maxLength={3} required className="uppercase" />
            </Field>
            <Field label="Regular price" name="listPrice" error={state?.fieldErrors?.listPrice}>
              <TextInput name="listPrice" inputMode="decimal" required placeholder="24.00" error={state?.fieldErrors?.listPrice} />
            </Field>
            <Field label="Promotional price" name="salePrice" optional error={state?.fieldErrors?.salePrice}>
              <TextInput name="salePrice" inputMode="decimal" placeholder="19.50" error={state?.fieldErrors?.salePrice} />
            </Field>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Promotion" name="promotionText" optional>
              <TextInput name="promotionText" maxLength={300} placeholder="e.g. Buy 2 get 1 free" />
            </Field>
            <Field label="Where the price came from" name="source">
              <SelectInput name="source" defaultValue="website_check">
                {Object.entries(sources).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>
          <SubmitButton pendingLabel="Saving…">Record price</SubmitButton>
        </>
      )}
    </ActionForm>
  );
}
