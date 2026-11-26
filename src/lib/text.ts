/** Small, dependency-free text helpers shared across the app. */

export function slugify(input: string): string {
  return (
    input
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'item'
  );
}

export function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  return input.slice(0, Math.max(0, max - 1)).trimEnd() + '…';
}

export function cleanText(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const v = input.replace(/\u0000/g, '').trim();
  return v.length ? v : null;
}

export function titleCase(input: string): string {
  return input
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
