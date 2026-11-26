export type CountryOption = { code: string; name: string };

/** Checkboxes for "which markets does this apply to". Leaving all unticked means every market. */
export function MarketPicker({ countries, selected = [], name = 'marketCodes' }: { countries: CountryOption[]; selected?: string[]; name?: string }) {
  return (
    <fieldset>
      <legend className="mb-1.5 flex w-full items-baseline justify-between text-[13px] font-medium text-ink">
        <span>Markets</span>
        <span className="label !text-[9.5px]">None ticked = all markets</span>
      </legend>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 rounded-[4px] border border-line-strong bg-white px-3 py-2.5">
        {countries.map((country) => (
          <label key={country.code} className="flex items-center gap-1.5 text-[13px] text-ink-soft">
            <input type="checkbox" name={name} value={country.code} defaultChecked={selected.includes(country.code)} className="accent-[#16211c]" />
            {country.name}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
