'use client';

import Link from 'next/link';
import { createBrandAction, updateBrandAction } from '@/app/actions/brands';
import { ActionForm, Field, SubmitButton, TextArea, TextInput } from '@/components/ui/form';
import { buttonClass } from '@/components/ui/primitives';

export type BrandFormValues = {
  id?: string;
  name?: string | null;
  tagline?: string | null;
  description?: string | null;
  website?: string | null;
  positioning?: string | null;
  personality?: string | null;
  toneOfVoice?: string | null;
  targetAudience?: string | null;
  visualGuidelines?: string | null;
};

export function BrandForm({ brand }: { brand?: BrandFormValues }) {
  const editing = Boolean(brand?.id);
  return (
    <ActionForm action={editing ? updateBrandAction : createBrandAction} className="space-y-8">
      {(state) => {
        const e = state?.fieldErrors ?? {};
        return (
          <>
            {editing ? <input type="hidden" name="brandId" value={brand!.id} /> : null}
            <fieldset className="grid gap-5 md:grid-cols-2">
              <legend className="label mb-4 w-full border-b border-line pb-2">01 — Identity</legend>
              <Field label="Brand name" name="name" error={e.name}>
                <TextInput name="name" defaultValue={brand?.name ?? ''} required maxLength={120} error={e.name} autoFocus={!editing} />
              </Field>
              <Field label="Tagline" name="tagline" optional error={e.tagline}>
                <TextInput name="tagline" defaultValue={brand?.tagline ?? ''} maxLength={200} />
              </Field>
              <div className="md:col-span-2">
                <Field label="What the brand is" name="description" optional hint="Two or three sentences a new team member could read to understand the brand." error={e.description}>
                  <TextArea name="description" defaultValue={brand?.description ?? ''} rows={3} />
                </Field>
              </div>
              <Field label="Website" name="website" optional error={e.website}>
                <TextInput name="website" type="url" placeholder="https://" defaultValue={brand?.website ?? ''} error={e.website} />
              </Field>
            </fieldset>

            <fieldset className="grid gap-5 md:grid-cols-2">
              <legend className="label mb-4 w-full border-b border-line pb-2">02 — Positioning and voice</legend>
              <Field label="Positioning" name="positioning" optional hint="Who it is for, what it offers and why it is different.">
                <TextArea name="positioning" defaultValue={brand?.positioning ?? ''} rows={5} />
              </Field>
              <Field label="Personality" name="personality" optional hint="The character of the brand, e.g. warm, expert, playful.">
                <TextArea name="personality" defaultValue={brand?.personality ?? ''} rows={5} />
              </Field>
              <Field label="Tone of voice" name="toneOfVoice" optional hint="How the brand writes and speaks. Include words to use and words to avoid.">
                <TextArea name="toneOfVoice" defaultValue={brand?.toneOfVoice ?? ''} rows={5} />
              </Field>
              <Field label="Target audience" name="targetAudience" optional hint="The people the brand is speaking to.">
                <TextArea name="targetAudience" defaultValue={brand?.targetAudience ?? ''} rows={5} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Visual guidelines" name="visualGuidelines" optional hint="Colours, logo use, photography style. Upload the full brand book under Documents & media.">
                  <TextArea name="visualGuidelines" defaultValue={brand?.visualGuidelines ?? ''} rows={4} />
                </Field>
              </div>
            </fieldset>

            <div className="flex items-center gap-2 border-t border-line pt-5">
              <SubmitButton>{editing ? 'Save changes' : 'Create brand'}</SubmitButton>
              <Link href={editing ? `/brands/${brand!.id}` : '/brands'} className={buttonClass('ghost')}>
                Cancel
              </Link>
            </div>
          </>
        );
      }}
    </ActionForm>
  );
}
