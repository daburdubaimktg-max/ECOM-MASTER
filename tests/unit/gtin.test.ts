import { describe, expect, it } from 'vitest';
import { checkGtin, gtinCheckDigit, sameGtin } from '@/lib/gtin';

describe('GTIN validation', () => {
  it('accepts well-known valid barcodes of each length', () => {
    expect(checkGtin('4006381333931')).toMatchObject({ valid: true, format: 'GTIN-13', gtin14: '04006381333931' });
    expect(checkGtin('036000291452')).toMatchObject({ valid: true, format: 'GTIN-12', gtin14: '00036000291452' });
    expect(checkGtin('73513537')).toMatchObject({ valid: true, format: 'GTIN-8' });
    expect(checkGtin('10036000291459')).toMatchObject({ valid: true, format: 'GTIN-14' });
  });

  it('ignores spaces and hyphens', () => {
    expect(checkGtin('4006381-333931 ').valid).toBe(true);
    expect(checkGtin('0 36000 29145 2').valid).toBe(true);
  });

  it('rejects a wrong check digit and explains the expected one', () => {
    const result = checkGtin('4006381333932');
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.reason).toContain('expected 1');
  });

  it('rejects wrong lengths, letters, empty input and all zeros', () => {
    expect(checkGtin('12345').valid).toBe(false);
    expect(checkGtin('40063813339AB').valid).toBe(false);
    expect(checkGtin('').valid).toBe(false);
    expect(checkGtin('0000000000000').valid).toBe(false);
  });

  it('computes a check digit that always validates, and any single-digit change is caught', () => {
    for (const data of ['629100000001', '890100000042', '500000000000', '123456789012', '999999999999']) {
      const full = data + gtinCheckDigit(data);
      expect(checkGtin(full).valid).toBe(true);
      for (let i = 0; i < full.length; i++) {
        const changed = full.slice(0, i) + ((Number(full[i]) + 1) % 10) + full.slice(i + 1);
        expect(checkGtin(changed).valid).toBe(false);
      }
    }
  });

  it('treats a UPC-A and its zero-padded EAN-13 form as the same item', () => {
    expect(sameGtin('036000291452', '0036000291452')).toBe(true);
    expect(sameGtin('036000291452', '4006381333931')).toBe(false);
  });
});
