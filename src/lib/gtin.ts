/**
 * GTIN (Global Trade Item Number) validation — the barcode numbers known as EAN, UPC and ITF-14.
 *
 * A GTIN is 8, 12, 13 or 14 digits. The last digit is a check digit calculated from the others
 * with the GS1 modulo-10 algorithm (weights 3 and 1, alternating from the right-most data digit).
 * Passing this check means the number is well-formed — it does NOT prove the number is registered
 * with GS1 or belongs to this product.
 */
export type GtinFormat = 'GTIN-8' | 'GTIN-12' | 'GTIN-13' | 'GTIN-14';

export type GtinCheck =
  | { valid: true; format: GtinFormat; digits: string; gtin14: string }
  | { valid: false; reason: string };

const FORMATS: Record<number, GtinFormat> = { 8: 'GTIN-8', 12: 'GTIN-12', 13: 'GTIN-13', 14: 'GTIN-14' };

/** Calculates the check digit for the data digits (everything except the last digit). */
export function gtinCheckDigit(dataDigits: string): number {
  let sum = 0;
  for (let i = dataDigits.length - 1, weight = 3; i >= 0; i--, weight = weight === 3 ? 1 : 3) {
    sum += (dataDigits.charCodeAt(i) - 48) * weight;
  }
  return (10 - (sum % 10)) % 10;
}

export function checkGtin(input: string): GtinCheck {
  const digits = String(input ?? '').replace(/[\s-]/g, '');
  if (!digits) return { valid: false, reason: 'No barcode number entered.' };
  if (!/^\d+$/.test(digits)) return { valid: false, reason: 'A GTIN contains digits only.' };
  const format = FORMATS[digits.length];
  if (!format) {
    return { valid: false, reason: `A GTIN has 8, 12, 13 or 14 digits — this one has ${digits.length}.` };
  }
  if (/^0+$/.test(digits)) return { valid: false, reason: 'A GTIN cannot be all zeros.' };
  const expected = gtinCheckDigit(digits.slice(0, -1));
  const actual = digits.charCodeAt(digits.length - 1) - 48;
  if (expected !== actual) {
    return { valid: false, reason: `Check digit is wrong: expected ${expected}, found ${actual}. Please re-check the barcode.` };
  }
  return { valid: true, format, digits, gtin14: digits.padStart(14, '0') };
}

/** Two barcodes refer to the same item when their 14-digit forms are equal (e.g. a UPC-A and its EAN-13 form). */
export function sameGtin(a: string, b: string): boolean {
  const ca = checkGtin(a);
  const cb = checkGtin(b);
  return ca.valid && cb.valid && ca.gtin14 === cb.gtin14;
}
