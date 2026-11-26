import { defineConfig } from '@playwright/test';

const PORT = 3210;

/**
 * End-to-end tests: a real browser drives a real production build of the app against a throw-away
 * database folder (.data-e2e). Run with `npm run test:e2e`.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 180_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    viewport: { width: 1440, height: 900 },
    trace: 'off',
  },
  webServer: {
    command: `node -e "require('fs').rmSync('.data-e2e',{recursive:true,force:true})" && npx next build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}/api/health`,
    timeout: 600_000,
    reuseExistingServer: false,
    env: {
      BIE_DATA_DIR: '.data-e2e',
      COOKIE_SECURE: 'false',
      // Keyword search only, so the tests never depend on downloading a language model.
      EMBEDDINGS_PROVIDER: 'none',
    },
  },
});
