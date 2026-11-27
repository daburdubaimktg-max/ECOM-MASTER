'use client';

import { addCompetitorAction } from '@/app/actions/brands';
import { ActionForm, Field, SubmitButton, TextInput } from '@/components/ui/form';

export function CompetitorForm({ brandId }: { brandId: string }) {
  return (
    <ActionForm action={addCompetitorAction} className="space-y-4" resetOnSuccess>
      {(state) => (
        <>
          <input type="hidden" name="brandId" value={brandId} />
          <Field label="Competitor brand" name="name" error={state?.fieldErrors?.name}>
            <TextInput name="name" required maxLength={120} error={state?.fieldErrors?.name} />
          </Field>
          <Field label="Parent company" name="parentCompany" optional>
            <TextInput name="parentCompany" maxLength={200} />
          </Field>
          <Field label="Website" name="website" optional>
            <TextInput name="website" placeholder="https://" />
          </Field>
          <Field label="Notes" name="notes" optional hint="Why it matters: where it competes, at what price point.">
            <TextInput name="notes" />
          </Field>
          <SubmitButton>Add competitor</SubmitButton>
        </>
      )}
    </ActionForm>
  );
}
