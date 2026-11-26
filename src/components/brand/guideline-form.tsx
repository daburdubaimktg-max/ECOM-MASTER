'use client';

import { saveGuidelineAction } from '@/app/actions/brands';
import { ActionForm, Field, SelectInput, SubmitButton, TextArea, TextInput } from '@/components/ui/form';
import { GUIDELINE_SECTION_LABELS as SECTION_LABELS } from '@/lib/labels';
import { MarketPicker } from './market-picker';
import type { CountryOption } from './market-picker';

export function GuidelineForm({
  brandId,
  countries,
  guideline,
}: {
  brandId: string;
  countries: CountryOption[];
  guideline?: { id: string; section: string; title: string; body: string; marketCodes: string[] | null };
}) {
  return (
    <ActionForm action={saveGuidelineAction} className="space-y-4" resetOnSuccess={!guideline}>
      {(state) => {
        const e = state?.fieldErrors ?? {};
        return (
          <>
            <input type="hidden" name="brandId" value={brandId} />
            {guideline ? <input type="hidden" name="guidelineId" value={guideline.id} /> : null}
            <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
              <Field label="Section" name="section" error={e.section}>
                <SelectInput name="section" defaultValue={guideline?.section ?? 'tone_of_voice'}>
                  {Object.entries(SECTION_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </SelectInput>
              </Field>
              <Field label="Short title" name="title" error={e.title}>
                <TextInput name="title" defaultValue={guideline?.title ?? ''} placeholder="e.g. Words we never use" required maxLength={200} error={e.title} />
              </Field>
            </div>
            <Field label="Guideline" name="body" hint="Write it as an instruction a copywriter — or the AI — can follow." error={e.body}>
              <TextArea name="body" defaultValue={guideline?.body ?? ''} rows={4} required error={e.body} />
            </Field>
            <MarketPicker countries={countries} selected={guideline?.marketCodes ?? []} />
            <SubmitButton>{guideline ? 'Save new version' : 'Add guideline'}</SubmitButton>
          </>
        );
      }}
    </ActionForm>
  );
}
