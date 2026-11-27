import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

/**
 * Security headers applied to every response.
 * The Content-Security-Policy allows inline scripts because the framework needs them without a
 * per-request nonce; a strict nonce-based policy is part of Stage 6 (production hardening).
 */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      `connect-src 'self'${isDev ? ' ws: wss:' : ''}`,
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  devIndicators: false,
  experimental: {
    // Spreadsheet imports are sent through a server action; allow files up to 4 MB.
    serverActions: { bodySizeLimit: '4mb' },
  },
  // These packages contain native code or WebAssembly and must be loaded by Node.js directly.
  serverExternalPackages: [
    '@electric-sql/pglite',
    '@electric-sql/pglite-pgvector',
    '@huggingface/transformers',
    'onnxruntime-node',
    'sharp',
    'pg',
    'unpdf',
  ],
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  async redirects() {
    return [{ source: '/', destination: '/overview', permanent: false }];
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
