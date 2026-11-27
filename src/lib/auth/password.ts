import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';

/**
 * Password hashing with scrypt (built into Node.js — no third-party code).
 * Parameters follow the OWASP Password Storage Cheat Sheet option N=2^15, r=8, p=3.
 * Stored format: scrypt$N$r$p$<salt base64>$<hash base64>
 */
const N = 32768;
const R = 8;
const P = 3;
const KEY_LENGTH = 64;
const MAX_MEM = 96 * 1024 * 1024;

function derive(password: string, salt: Buffer, n: number, r: number, p: number, keylen: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password.normalize('NFKC'), salt, keylen, { N: n, r, p, maxmem: MAX_MEM }, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, N, R, P, KEY_LENGTH);
  return ['scrypt', N, R, P, salt.toString('base64'), key.toString('base64')].join('$');
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, n, r, p, saltB64, hashB64] = parts;
  const expected = Buffer.from(hashB64, 'base64');
  if (expected.length === 0) return false;
  try {
    const actual = await derive(password, Buffer.from(saltB64, 'base64'), Number(n), Number(r), Number(p), expected.length);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

const COMMON_PASSWORDS = new Set([
  'password',
  'password1',
  'password123',
  '1234567890',
  '12345678910',
  'qwertyuiop',
  'letmein123',
  'welcome123',
  'iloveyou123',
  'admin12345',
  'changeme123',
]);

/** Returns a human-readable problem, or null when the password is acceptable. */
export function passwordProblem(password: string, context: { email?: string; name?: string } = {}): string | null {
  if (password.length < 10) return 'Use at least 10 characters.';
  if (password.length > 200) return 'Use at most 200 characters.';
  const lower = password.toLowerCase();
  if (COMMON_PASSWORDS.has(lower)) return 'That password is too common. Choose something less predictable.';
  if (/^(.)\1+$/.test(password)) return 'Do not use a single repeated character.';
  const emailLocal = context.email?.split('@')[0]?.toLowerCase();
  if (emailLocal && emailLocal.length >= 4 && lower.includes(emailLocal)) return 'Do not include your email name in the password.';
  return null;
}
