'use client';

import { useState } from 'react';
import { createBookAction, saveBookAction } from '@/app/actions/books';
import { ActionForm, Field, SelectInput, SubmitButton, TextArea, TextInput } from '@/components/ui/form';

type Font = { name: string; role: string; usage: string | null; link: string | null };
type Colour = { name: string; hex: string; usage: string | null };
type Book = {
  id: string;
  brandId: string;
  kind: string;
  title: string;
  subtitle: string | null;
  launchDate: string | null;
  marketCodes: string[] | null;
  overview: string | null;
  audience: string | null;
  keyMessages: string | null;
  toneOfVoice: string | null;
  dosAndDonts: string | null;
  fonts: Font[];
  colours: Colour[];
  claimIds: string[];
  assetIds: string[];
  productIds: string[];
};

const FONT_ROLES = ['Headlines', 'Body text', 'Accent', 'Packaging', 'Arabic', 'Other'];

/** Stable keys so removing a row never shifts typed values into the wrong row. */
let nextKey = 0;
const keyed = <T,>(item: T) => ({ ...item, _k: ++nextKey });

export function NewBookForm({ brands }: { brands: { id: string; name: string }[] }) {
  return (
    <ActionForm action={createBookAction} className="space-y-4">
      {(state) => (
        <>
          <Field label="Brand" name="brandId">
            <SelectInput name="brandId" required>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Type" name="kind">
            <SelectInput name="kind" defaultValue="brand_book">
              <option value="brand_book">Brand book</option>
              <option value="launch_book">Launch book — for a new product or range</option>
            </SelectInput>
          </Field>
          <Field label="Title" name="title" error={state?.fieldErrors?.title}>
            <TextInput name="title" required maxLength={160} placeholder="e.g. Almond Hair Oil launch, March 2027" error={state?.fieldErrors?.title} />
          </Field>
          <SubmitButton pendingLabel="Creating…">Create book</SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

function Section({ index, title, hint, children }: { index: string; title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-line pt-5">
      <legend className="flex items-baseline gap-2.5 pr-3 text-[16px] font-medium">
        <span className="num text-[11px] font-normal text-signal">{index}</span>
        {title}
      </legend>
      {hint ? <p className="mb-3 max-w-[70ch] text-[13px] text-ink-muted">{hint}</p> : null}
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

function Checks({ name, items, selected, empty }: { name: string; items: { id: string; label: React.ReactNode }[]; selected: string[]; empty: string }) {
  if (!items.length) return <p className="text-[13px] text-ink-muted">{empty}</p>;
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <label key={item.id} className="flex items-start gap-2 rounded-[4px] border border-line bg-white px-3 py-2 text-[13.5px] hover:border-ink">
          <input type="checkbox" name={name} value={item.id} defaultChecked={selected.includes(item.id)} className="mt-1 accent-[#16211c]" />
          <span>{item.label}</span>
        </label>
      ))}
    </div>
  );
}

export function BookEditor({
  book,
  countries,
  claims,
  images,
  products,
}: {
  book: Book;
  countries: { code: string; name: string }[];
  claims: { id: string; claimText: string; claimType: string; marketCodes: string[] | null }[];
  images: { id: string; title: string }[];
  products: { id: string; name: string }[];
}) {
  const [fonts, setFonts] = useState(() => (book.fonts.length ? book.fonts : [{ name: '', role: 'Headlines', usage: null, link: null } as Font]).map(keyed));
  const [colours, setColours] = useState(() => (book.colours.length ? book.colours : [{ name: '', hex: '', usage: null } as Colour]).map(keyed));
  const [kind, setKind] = useState(book.kind);
  return (
    <ActionForm action={saveBookAction} className="space-y-7">
      {(state) => (
        <>
          <input type="hidden" name="bookId" value={book.id} />
          <input type="hidden" name="brandId" value={book.brandId} />

          <Section index="01" title="Cover">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Type" name="kind">
                <SelectInput name="kind" value={kind} onChange={(e) => setKind(e.target.value)}>
                  <option value="brand_book">Brand book</option>
                  <option value="launch_book">Launch book</option>
                </SelectInput>
              </Field>
              <Field label="Title" name="title" error={state?.fieldErrors?.title}>
                <TextInput name="title" defaultValue={book.title} required maxLength={160} error={state?.fieldErrors?.title} />
              </Field>
              <Field label="Subtitle" name="subtitle" optional>
                <TextInput name="subtitle" defaultValue={book.subtitle ?? ''} maxLength={240} />
              </Field>
              {kind === 'launch_book' ? (
                <Field label="Launch date" name="launchDate" optional hint="e.g. March 2027">
                  <TextInput name="launchDate" defaultValue={book.launchDate ?? ''} maxLength={40} />
                </Field>
              ) : null}
            </div>
            <fieldset>
              <legend className="mb-1.5 flex w-full items-baseline justify-between text-[13px] font-medium">
                <span>Markets</span>
                <span className="label !text-[9.5px]">None ticked = all markets</span>
              </legend>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                {countries.map((c) => (
                  <label key={c.code} className="flex items-center gap-1.5 text-[13px] text-ink-soft">
                    <input type="checkbox" name="marketCodes" value={c.code} defaultChecked={book.marketCodes?.includes(c.code)} className="accent-[#16211c]" />
                    {c.name}
                  </label>
                ))}
              </div>
            </fieldset>
          </Section>

          <Section index="02" title="The story" hint="Write in plain sentences. Put each key message on its own line.">
            <Field label={kind === 'launch_book' ? 'What we are launching and why' : 'What the brand stands for'} name="overview" optional>
              <TextArea name="overview" defaultValue={book.overview ?? ''} rows={5} />
            </Field>
            <Field label="Who it is for" name="audience" optional>
              <TextArea name="audience" defaultValue={book.audience ?? ''} rows={3} />
            </Field>
            <Field label="Key messages" name="keyMessages" optional hint="One per line.">
              <TextArea name="keyMessages" defaultValue={book.keyMessages ?? ''} rows={4} />
            </Field>
            <Field label="Tone of voice" name="toneOfVoice" optional>
              <TextArea name="toneOfVoice" defaultValue={book.toneOfVoice ?? ''} rows={3} />
            </Field>
            <Field label="Do’s and don’ts" name="dosAndDonts" optional hint="One per line.">
              <TextArea name="dosAndDonts" defaultValue={book.dosAndDonts ?? ''} rows={4} />
            </Field>
          </Section>

          <Section index="03" title="Fonts" hint="The typefaces and where each is used. Add a link to where the font is licensed or downloaded.">
            {fonts.map((font, i) => (
              <div key={font._k} className="grid items-end gap-3 rounded-[4px] border border-line bg-white p-3 sm:grid-cols-[1.2fr_1fr_1.6fr_1.4fr_auto]">
                <Field label="Font" name={`fontName-${i}`}>
                  <input name="fontName" defaultValue={font.name} placeholder="e.g. Fraunces" className="field-input" aria-label="Font name" />
                </Field>
                <Field label="Used for" name={`fontRole-${i}`}>
                  <select name="fontRole" defaultValue={font.role} className="field-input" aria-label="Font role">
                    {FONT_ROLES.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                </Field>
                <Field label="How" name={`fontUsage-${i}`}>
                  <input name="fontUsage" defaultValue={font.usage ?? ''} placeholder="e.g. Pack name, light weight" className="field-input" aria-label="Font usage" />
                </Field>
                <Field label="Link" name={`fontLink-${i}`}>
                  <input name="fontLink" defaultValue={font.link ?? ''} placeholder="https://" className="field-input" aria-label="Font link" />
                </Field>
                <button type="button" onClick={() => setFonts(fonts.filter((_, j) => j !== i))} className="pb-2 text-[12.5px] text-ink-muted underline underline-offset-4 hover:text-signal">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setFonts([...fonts, keyed<Font>({ name: '', role: 'Body text', usage: null, link: null })])} className="text-[13px] underline underline-offset-4 hover:text-signal">
              + Add a font
            </button>
          </Section>

          <Section index="04" title="Colours" hint="Use the six-character colour code from the design files, e.g. #1F6B4A.">
            {state?.fieldErrors?.colours ? <p className="text-[12.5px] text-signal-deep">{state.fieldErrors.colours}</p> : null}
            {colours.map((colour, i) => (
              <div key={colour._k} className="grid items-end gap-3 rounded-[4px] border border-line bg-white p-3 sm:grid-cols-[auto_1.2fr_1fr_2fr_auto]">
                <span aria-hidden className="mb-1 h-9 w-9 rounded-full border border-line-strong" style={{ background: /^#?[0-9a-fA-F]{6}$/.test(colour.hex) ? (colour.hex.startsWith('#') ? colour.hex : `#${colour.hex}`) : 'transparent' }} />
                <Field label="Name" name={`colourName-${i}`}>
                  <input name="colourName" defaultValue={colour.name} placeholder="e.g. Leaf green" className="field-input" aria-label="Colour name" />
                </Field>
                <Field label="Code" name={`colourHex-${i}`}>
                  <input
                    name="colourHex"
                    defaultValue={colour.hex}
                    placeholder="#1F6B4A"
                    className="field-input num"
                    aria-label="Colour code"
                    onChange={(e) => setColours(colours.map((c, j) => (j === i ? { ...c, hex: e.target.value } : c)))}
                  />
                </Field>
                <Field label="Used for" name={`colourUsage-${i}`}>
                  <input name="colourUsage" defaultValue={colour.usage ?? ''} placeholder="e.g. Primary, backgrounds" className="field-input" aria-label="Colour usage" />
                </Field>
                <button type="button" onClick={() => setColours(colours.filter((_, j) => j !== i))} className="pb-2 text-[12.5px] text-ink-muted underline underline-offset-4 hover:text-signal">
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={() => setColours([...colours, keyed<Colour>({ name: '', hex: '', usage: null })])} className="text-[13px] underline underline-offset-4 hover:text-signal">
              + Add a colour
            </button>
          </Section>

          <Section index="05" title="Claims" hint="Only approved claims can be chosen. Restricted claims are added to the book automatically as “never say”.">
            {state?.fieldErrors?.claimIds ? <p className="text-[12.5px] text-signal-deep">{state.fieldErrors.claimIds}</p> : null}
            <Checks
              name="claimIds"
              selected={book.claimIds}
              empty="This brand has no approved claims yet. Propose and approve them under Brands → Claims."
              items={claims.map((c) => ({
                id: c.id,
                label: (
                  <>
                    “{c.claimText}”<span className="label ml-2 !text-[9.5px]">{c.marketCodes?.length ? c.marketCodes.join(' · ') : 'All markets'}</span>
                  </>
                ),
              }))}
            />
          </Section>

          <Section index="06" title="Packshots and images" hint="Choose from the images uploaded under Brands → Documents & media.">
            {images.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((img) => (
                  <label key={img.id} className="group cursor-pointer rounded-[4px] border border-line bg-white p-2 text-[12.5px] has-[:checked]:border-ink">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/api/assets/${img.id}/download?inline=1`} alt={img.title} className="aspect-square w-full rounded-[3px] bg-paper object-contain" loading="lazy" />
                    <span className="mt-1.5 flex items-center gap-1.5">
                      <input type="checkbox" name="assetIds" value={img.id} defaultChecked={book.assetIds.includes(img.id)} className="accent-[#16211c]" />
                      <span className="truncate">{img.title}</span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-ink-muted">No images uploaded for this brand yet. Upload packshots under Brands → Documents & media.</p>
            )}
          </Section>

          <Section index="07" title="Products" hint="Their descriptions, benefits and pack sizes are taken from the Product Catalogue.">
            <Checks name="productIds" selected={book.productIds} empty="No products for this brand yet." items={products.map((p) => ({ id: p.id, label: p.name }))} />
          </Section>

          <div className="sticky bottom-0 -mx-5 border-t border-line bg-card/95 px-5 py-3 backdrop-blur">
            <SubmitButton pendingLabel="Saving…">Save draft</SubmitButton>
          </div>
        </>
      )}
    </ActionForm>
  );
}
