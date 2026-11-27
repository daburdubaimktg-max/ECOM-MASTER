import { describe, expect, it } from 'vitest';
import { originAllowedByList } from '@/lib/origins';

describe('extra allowed origins (for tunnels and proxies)', () => {
  it('allows nothing extra unless configured', () => {
    expect(originAllowedByList('abc.trycloudflare.com', undefined)).toBe(false);
    expect(originAllowedByList('abc.trycloudflare.com', '')).toBe(false);
  });
  it('matches one label per *, and exact hosts', () => {
    const list = '*.trycloudflare.com, intelligence.example.com';
    expect(originAllowedByList('blue-cat-42.trycloudflare.com', list)).toBe(true);
    expect(originAllowedByList('INTELLIGENCE.example.com', list)).toBe(true);
    expect(originAllowedByList('trycloudflare.com', list)).toBe(false);
    expect(originAllowedByList('a.b.trycloudflare.com', list)).toBe(false);
    expect(originAllowedByList('evil.example', list)).toBe(false);
    expect(originAllowedByList('trycloudflare.com.evil.example', list)).toBe(false);
  });
});
