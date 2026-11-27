'use client';

import { useState } from 'react';
import { reviewClaimAction, saveClaimAction } from '@/app/actions/brands';
import { ActionForm, Field, InlineAction, SelectInput, SubmitButton, TextArea, TextInput } from '@/components/ui/form';
import { CLAIM_TYPE_LABELS } from '@/lib/labels';
import { MarketPicker } from './market-picker';
import type { CountryOption } from './market-picker';

export function ClaimForm({
  brandId,
  countries,
  products,
}: {
  brandId: string;
  countries: CountryOption[];
  products: { id: string; name: string }[];
}) {
  return (
    <ActionForm action={saveClaimAction} className="space-y-4" resetOnSuccess>
      {(state) => {
        const e = state?.fieldErrors ?? {};
        return (
          <>
            <input type="hidden" name="brandId" value={brandId} />
            <Field label="Claim" name="claimText" hint="Write it exactly as it would appear in content." error={e.claimText}>
              <TextArea name="claimText" rows={2} required placeholder="e.g. Enriched with almond oil" error={e.claimText} />
            </Field>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Type" name="claimType">
                <SelectInput name="claimType" defaultValue="benefit">
                  {Object.entries(CLAIM_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Applies to" name="productId" error={e.productId}>
                <SelectInput name="productId" defaultValue="">
                  <option value="">The whole brand</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </div>
            <Field label="Substantiation" name="substantiation" optional hint="The evidence behind the claim: test report, formulation, regulatory approval.">
              <TextInput name="substantiation" placeholder="e.g. Formulation sheet rev. 4; consumer use test 2025" />
            </Field>
            <MarketPicker countries={countries} />
            <SubmitButton>Propose claim</SubmitButton>
          </>
        );
      }}
    </ActionForm>
  );
}

/** Approve / restrict / return-to-unverified controls for people who may approve claims. */
export function ClaimReview({ claimId, status }: { claimId: string; status: 'approved' | 'unverified' | 'restricted' }) {
  const [restricting, setRestricting] = useState(false);
  if (restricting) {
    return (
      <ActionForm action={reviewClaimAction} className="w-full max-w-md">
        {(state) => (
          <>
            <input type="hidden" name="claimId" value={claimId} />
            <input type="hidden" name="status" value="restricted" />
            <Field label="Why must this claim not be used?" name="restrictionReason" error={state?.fieldErrors?.restrictionReason}>
              <TextInput name="restrictionReason" placeholder="e.g. Medical claim — not permitted for cosmetics" required autoFocus />
            </Field>
            <div className="mt-2 flex gap-2">
              <SubmitButton variant="danger" className="!py-1.5 !text-[12.5px]">
                Mark as restricted
              </SubmitButton>
              <button type="button" onClick={() => setRestricting(false)} className="px-2 text-[12.5px] text-ink-muted hover:text-ink">
                Cancel
              </button>
            </div>
          </>
        )}
      </ActionForm>
    );
  }
  return (
    <div className="flex flex-wrap justify-end gap-1">
      {status !== 'approved' ? (
        <InlineAction action={reviewClaimAction} fields={{ claimId, status: 'approved' }} variant="secondary">
          Approve
        </InlineAction>
      ) : null}
      {status !== 'restricted' ? (
        <button type="button" onClick={() => setRestricting(true)} className="rounded-[4px] px-2.5 py-1.5 text-[12.5px] font-medium text-signal-deep hover:bg-signal-soft">
          Restrict…
        </button>
      ) : null}
      {status !== 'unverified' ? (
        <InlineAction action={reviewClaimAction} fields={{ claimId, status: 'unverified' }}>
          Back to unverified
        </InlineAction>
      ) : null}
    </div>
  );
}
