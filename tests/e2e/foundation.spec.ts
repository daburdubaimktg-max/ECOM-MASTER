import path from 'node:path';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

/**
 * One continuous journey through the first build, in the order a new team would use it.
 * Each step maps to an MVP acceptance criterion from the product specification.
 * All data created here is fictional ("Demo Botanics").
 */
const FIXTURES = path.join(__dirname, '..', 'fixtures');
const ADMIN = { email: 'asha@example.test', password: 'a long demo passphrase' };

test.describe.configure({ mode: 'serial' });

let page: Page;
let brandUrl = '';
let productUrl = '';
let inviteLink = '';
const browserErrors: string[] = [];

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  page.on('pageerror', (error) => browserErrors.push(String(error)));
  page.on('response', (response) => {
    if (response.status() >= 500) browserErrors.push(`HTTP ${response.status()} ${response.url()}`);
  });
});

test.afterAll(async () => {
  await page.close();
});

const save = (name: string | RegExp) => page.locator('main').getByRole('button', { name });

test('first run: an empty installation asks for the first Administrator, and rejects a weak password', async () => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/setup$/);
  await page.fill('input[name=organisationName]', 'Demo Consumer Brands');
  await page.fill('input[name=name]', 'Asha Admin');
  await page.fill('input[name=email]', ADMIN.email);
  await page.fill('input[name=password]', 'short');
  await save('Create organisation').click();
  await expect(page.getByText('Use at least 10 characters.').first()).toBeVisible();
  // what was typed is kept after an error
  await expect(page.locator('input[name=organisationName]')).toHaveValue('Demo Consumer Brands');
  await page.fill('input[name=password]', ADMIN.password);
  await save('Create organisation').click();
  await expect(page).toHaveURL(/\/overview$/);
  await expect(page.getByRole('heading', { name: 'Good to see you, Asha.' })).toBeVisible();
});

test('setup cannot be repeated once an organisation exists', async ({ browser }) => {
  const anonymous = await browser.newPage();
  await anonymous.goto('/setup');
  await expect(anonymous).toHaveURL(/\/sign-in$/);
  await anonymous.goto('/brands');
  await expect(anonymous).toHaveURL(/\/sign-in$/);
  await anonymous.close();
});

test('criterion 1 — create a brand', async () => {
  await page.goto('/brands/new');
  await page.fill('input[name=name]', 'Demo Botanics');
  await page.fill('input[name=tagline]', 'Everyday botanical care (demonstration brand)');
  await page.fill('textarea[name=positioning]', 'Affordable, plant-based hair and personal care for families.');
  await page.fill('textarea[name=toneOfVoice]', 'Warm and plain, like a knowledgeable friend. We never exaggerate.');
  await save('Create brand').click();
  await expect(page).toHaveURL(/\/brands\/[0-9a-f-]{36}$/);
  brandUrl = page.url();
  await expect(page.getByRole('heading', { name: 'Demo Botanics' })).toBeVisible();
  await expect(page.getByText('Affordable, plant-based hair and personal care for families.')).toBeVisible();
});

test('guidelines are drafts until a Brand Manager approves them', async () => {
  await page.goto(`${brandUrl}/guidelines`);
  await page.fill('input[name=title]', 'Words we never use');
  await page.fill('textarea[name=body]', 'Never use miracle, cure, guaranteed or instant.');
  await save('Add guideline').click();
  await expect(page.getByText('Guideline saved as a draft')).toBeVisible();
  const row = page.locator('li', { hasText: 'Words we never use' }).first();
  await expect(row.getByText('Draft', { exact: true })).toBeVisible();
  await row.getByRole('button', { name: 'Approve' }).click();
  await expect(row.getByText('Approved', { exact: true })).toBeVisible();
});

test('claims: proposed claims start unverified; approving and restricting are explicit decisions', async () => {
  await page.goto(`${brandUrl}/claims`);
  await page.fill('textarea[name=claimText]', 'Enriched with almond oil and coconut oil');
  await save('Propose claim').click();
  await expect(page.getByText('Claim recorded as unverified')).toBeVisible();
  await page.fill('textarea[name=claimText]', 'Cures dandruff permanently');
  await save('Propose claim').click();
  await expect(page.locator('section', { hasText: 'Awaiting review' }).getByText('Cures dandruff permanently')).toBeVisible();

  await page.locator('li', { hasText: 'Enriched with almond oil' }).getByRole('button', { name: 'Approve' }).click();
  await expect(page.locator('section', { hasText: 'Approved claims' }).getByText('Enriched with almond oil')).toBeVisible();

  await page.locator('li', { hasText: 'Cures dandruff' }).getByRole('button', { name: 'Restrict…' }).click();
  await save('Mark as restricted').click();
  await expect(page.getByText('A reason is required.')).toBeVisible();
  await page.fill('input[name=restrictionReason]', 'Medical claim — not permitted for cosmetics.');
  await save('Mark as restricted').click();
  await expect(page.getByText('Reason: Medical claim — not permitted for cosmetics.')).toBeVisible();
});

test('criteria 3 and 4 — add a product with SKUs; barcodes are validated', async () => {
  await page.goto('/products/new');
  await page.fill('input[name=name]', 'Nourishing Hair Oil');
  await page.fill('input[name=category]', 'Hair Care > Hair Oil');
  await page.selectOption('select[name=status]', 'active');
  await page.fill('textarea[name=description]', 'A lightweight daily hair oil with almond and coconut that soothes a dry scalp.');
  await page.fill('textarea[name=benefits]', 'Soothes dry scalp\nAdds shine');
  await page.fill('textarea[name=ingredients]', 'Coconut oil, almond oil, fragrance');
  await save('Create product').click();
  await expect(page).toHaveURL(/\/products\/[0-9a-f-]{36}$/);
  productUrl = page.url();

  await page.fill('input[name=skuCode]', 'DB-HO-ALM-200');
  await page.fill('input[name=variantName]', 'Almond');
  await page.fill('input[name=sizeValue]', '200');
  await page.fill('input[name=gtin]', '4006381333932');
  await save('Add SKU').click();
  await expect(page.getByText(/Check digit is wrong: expected 1, found 2/).first()).toBeVisible();
  await expect(page.locator('input[name=skuCode]')).toHaveValue('DB-HO-ALM-200');

  await page.fill('input[name=gtin]', '4006381333931');
  await save('Add SKU').click();
  await expect(page.getByText('Check digit valid')).toBeVisible();

  await page.fill('input[name=skuCode]', 'DB-HO-ALM-200X2');
  await page.fill('input[name=variantName]', 'Almond');
  await page.fill('input[name=sizeValue]', '200');
  await page.fill('input[name=packQuantity]', '2');
  await save('Add SKU').click();
  await expect(page.getByText('× 2 multipack')).toBeVisible();

  await page.getByLabel('United Arab Emirates').check();
  await page.getByLabel('Saudi Arabia').check();
  await save('Save markets').click();
  await expect(page.getByText('Markets saved.')).toBeVisible();
});

test('criterion 3 — import products from a spreadsheet: check first, then import; bad rows are reported', async () => {
  await page.goto('/products/import');
  await page.setInputFiles('input[name=file]', path.join(FIXTURES, 'demo-products.csv'));
  await save(/Check file/).click();
  const report = page.getByTestId('import-report');
  await expect(report.getByText('Check result — nothing has been saved')).toBeVisible();
  // "Nourishing Hair Oil" already exists from the previous step, so its SKU codes clash or update.
  await expect(report.getByText(/Row 6/)).toBeVisible();
  await expect(report.getByText('Size must be a positive number.')).toBeVisible();
  await save(/Import/).click();
  await expect(report.getByText('Import complete')).toBeVisible();
  await page.goto('/products');
  await expect(page.getByRole('link', { name: 'Herbal Toothpaste' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Nourishing Hair Oil' })).toBeVisible();
});

test('criterion 2 — upload a brand book and other documents; they are read and indexed', async () => {
  await page.goto(`${brandUrl}/assets`);
  await page.locator('[data-ready=true]').waitFor();
  await page.setInputFiles('[data-testid=asset-file-input]', [
    path.join(FIXTURES, 'demo-brand-book.pdf'),
    path.join(FIXTURES, 'demo-product-catalogue.docx'),
    path.join(FIXTURES, 'demo-range-presentation.pptx'),
    path.join(FIXTURES, 'demo-claims-register.xlsx'),
    path.join(FIXTURES, 'demo-hero-image.png'),
  ]);
  await expect(page.locator('li', { hasText: 'demo-hero-image.png — Uploaded.' })).toBeVisible({ timeout: 60_000 });
  const bookRow = page.locator('tr', { hasText: 'demo-brand-book' });
  await expect(bookRow.getByText('Searchable')).toBeVisible({ timeout: 60_000 });
  await expect(bookRow.getByText(/4 passages from 4 pages/)).toBeVisible();
  await expect(page.locator('tr', { hasText: 'demo-range-presentation' }).getByText(/from 3 slides/)).toBeVisible({ timeout: 60_000 });
  await expect(page.locator('tr', { hasText: 'demo-hero-image' }).getByText('1600×1600px')).toBeVisible();
  await expect(page.locator('tr', { hasText: 'demo-hero-image' }).getByText('Stored only')).toBeVisible();

  // Until approved, a document's passages are labelled unverified.
  await expect(bookRow.getByText('Unverified')).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await bookRow.getByRole('button', { name: 'Approve as source' }).click();
  await expect(bookRow.getByText('Approved source')).toBeVisible();
});

test('a file that is not what it claims to be is refused', async () => {
  await page.goto(`${brandUrl}/assets`);
  await page.locator('[data-ready=true]').waitFor();
  await page.setInputFiles('[data-testid=asset-file-input]', {
    name: 'brand-book.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0xff, 0xff, 0x00, 0x00]),
  });
  await expect(page.locator('li', { hasText: 'brand-book.pdf' }).getByText(/not supported/)).toBeVisible();
});

test('knowledge search answers with the passage, its source, page and trust label', async () => {
  await page.goto('/knowledge?q=' + encodeURIComponent('which words should we avoid'));
  const results = page.getByTestId('search-results');
  await expect(results).toBeVisible();
  const fromBook = results.locator('li', { hasText: 'demo-brand-book' }).first();
  await expect(fromBook.getByText('p. 2')).toBeVisible();
  await expect(fromBook.getByText('Approved', { exact: true })).toBeVisible();
  await expect(results.locator('mark').first()).toBeVisible();

  await page.goto('/knowledge?q=' + encodeURIComponent('cures dandruff'));
  await expect(page.getByTestId('search-results').getByText('Restricted — do not use').first()).toBeVisible();

  await page.goto('/knowledge?q=' + encodeURIComponent('فروة الرأس الجافة'));
  await expect(page.getByTestId('search-results').getByText('demo-product-catalogue').first()).toBeVisible();

  await page.goto('/knowledge?q=' + encodeURIComponent('cryptocurrency mining'));
  await expect(page.getByText('Nothing found')).toBeVisible();
});

test('criterion 6 — record a competitor for the brand', async () => {
  await page.goto(`${brandUrl}/competitors`);
  await page.fill('input[name=name]', 'Example Rival (demo)');
  await page.fill('input[name=parentCompany]', 'Example Holdings');
  await save('Add competitor').click();
  await expect(page.locator('td', { hasText: 'Example Rival (demo)' })).toBeVisible();
});

test('criterion 5 — marketplaces are mapped by country with evidence, a calculated rank and sources', async () => {
  await page.goto('/marketplaces');
  await expect(page.getByRole('heading', { name: 'Marketplace Intelligence' })).toBeVisible();
  for (const country of ['United Arab Emirates', 'Saudi Arabia', 'South Africa', 'United States', 'United Kingdom', 'India', 'Kenya', 'Nigeria', 'Malaysia']) {
    await expect(page.getByRole('navigation', { name: 'Countries' }).getByRole('link', { name: new RegExp(country) })).toBeVisible();
  }
  await page.getByRole('navigation', { name: 'Countries' }).getByRole('link', { name: /United Arab Emirates/ }).click();
  await expect(page).toHaveURL(/country=AE/);
  await expect(page.getByText(/Market context · United Arab Emirates/i)).toBeVisible();
  const rows = page.getByTestId('platform-row');
  await expect(rows.first()).toBeVisible();
  expect(await rows.count()).toBeGreaterThanOrEqual(10);

  await rows.first().getByRole('link').first().click();
  await expect(page).toHaveURL(/\/marketplaces\/[0-9a-f-]{36}$/);
  await expect(page.getByRole('heading', { name: 'Priority score' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sources' })).toBeVisible();
  await expect(page.getByText('Top 3 priority in AE')).toBeVisible();

  await page.selectOption('select[name=monitoringStatus]', 'planned');
  await page.locator('section', { hasText: 'Your decision' }).getByRole('button', { name: 'Save' }).click();
  await expect(page.getByText('Tracking decision saved.')).toBeVisible();
  const presence = page.locator('li', { hasText: 'Demo Botanics' });
  await presence.locator('select[name=presence]').selectOption('present');
  await presence.locator('select[name=sellingModel]').selectOption('distributor');
  await presence.getByRole('button', { name: 'Save' }).click();
  await expect(presence.getByText('Saved.')).toBeVisible();

  await page.goto('/marketplaces?tracking=planned');
  await expect(page.getByTestId('platform-row')).toHaveCount(1);
});

test('the requirements library shows sourced rules and the official quality scores that really exist', async () => {
  await page.goto('/marketplaces/requirements');
  await expect(page.getByRole('link', { name: 'Amazon', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Walmart', exact: true }).click();
  await expect(page).toHaveURL(/requirements\/walmart$/);
  await expect(page.getByRole('heading', { name: 'Official quality scores' })).toBeVisible();
  await expect(page.getByText('Official document').first()).toBeVisible();
  await expect(page.getByText('mandatory', { exact: true }).first()).toBeVisible();
});

test('metrics that need marketplace data are shown as not available — never as zero', async () => {
  await page.goto('/overview');
  const shelf = page.locator('section', { hasText: 'Digital shelf metrics' });
  await expect(shelf.getByText('Listings monitored')).toBeVisible();
  await expect(shelf.getByText('Average product rating')).toBeVisible();
  await expect(shelf.getByText('Not available').first()).toBeVisible();
  await page.goto('/listing-quality');
  await expect(page.getByText('This module is not built yet.')).toBeVisible();
});

test('every change is in the audit log', async () => {
  await page.goto('/settings/audit-log');
  for (const text of ['Created brand "Demo Botanics"', 'Marked claim as RESTRICTED', 'Uploaded "demo-brand-book.pdf"', 'Approved "demo-brand-book" as an authoritative brand source', 'Imported products for Demo Botanics']) {
    await expect(page.getByText(text, { exact: false }).first()).toBeVisible();
  }
});

test('an Administrator invites a Viewer by link', async () => {
  await page.goto('/settings/team');
  await page.fill('input[name=email]', 'vera@example.test');
  await page.selectOption('select[name=roleKey]', 'viewer');
  await save('Create invitation link').click();
  inviteLink = await page.getByTestId('invite-link').inputValue();
  expect(inviteLink).toMatch(/\/invite\/[\w-]{20,}$/);
});

test('the Viewer can read but not change anything — in the interface and on the server', async ({ browser }) => {
  const context = await browser.newContext();
  const viewer = await context.newPage();
  await viewer.goto(inviteLink);
  await expect(viewer.getByRole('heading', { name: 'Join Demo Consumer Brands' })).toBeVisible();
  await viewer.fill('input[name=name]', 'Vera Viewer');
  await viewer.fill('input[name=password]', 'another long passphrase');
  await viewer.locator('main').getByRole('button', { name: 'Join' }).click();
  await expect(viewer).toHaveURL(/\/overview$/);

  await viewer.goto(brandUrl);
  await expect(viewer.getByRole('heading', { name: 'Demo Botanics' })).toBeVisible();
  await expect(viewer.getByRole('link', { name: 'Edit profile' })).toHaveCount(0);
  await viewer.goto(`${brandUrl}/edit`);
  await expect(viewer.getByText('You cannot edit this brand')).toBeVisible();
  await viewer.goto(productUrl);
  await expect(viewer.getByRole('button', { name: 'Add SKU' })).toHaveCount(0);
  await viewer.goto('/settings/team');
  await expect(viewer.getByText('Administrators only')).toBeVisible();
  await viewer.goto('/settings/audit-log');
  await expect(viewer.getByText('Not available for your role')).toBeVisible();

  // The server refuses too, even if the request is made directly.
  const brandId = brandUrl.split('/').pop()!;
  const upload = await viewer.request.post('/api/assets/upload', {
    headers: { origin: new URL(viewer.url()).origin },
    multipart: { brandId, kind: 'other', file: { name: 'note.txt', mimeType: 'text/plain', buffer: Buffer.from('A plain note about shampoo.') } },
  });
  expect(upload.status()).toBe(403);

  // An invitation link works once only.
  const second = await browser.newPage();
  await second.goto(inviteLink);
  await expect(second.getByRole('heading', { name: 'This invitation is not valid' })).toBeVisible();
  await second.close();
  await context.close();
});

test('requests from another website are refused, and files need a signed-in user', async ({ browser, baseURL }) => {
  const brandId = brandUrl.split('/').pop()!;
  const crossSite = await page.request.post('/api/assets/upload', {
    headers: { origin: 'https://evil.example' },
    multipart: { brandId, kind: 'other', file: { name: 'note.txt', mimeType: 'text/plain', buffer: Buffer.from('A plain note about shampoo.') } },
  });
  expect(crossSite.status()).toBe(403);

  const anonymous = await browser.newContext();
  const download = await anonymous.request.get(`${baseURL}/api/assets/00000000-0000-4000-8000-000000000000/download`, { maxRedirects: 0 });
  expect(download.status()).toBe(401);
  const tick = await anonymous.request.post(`${baseURL}/api/jobs/tick`);
  expect([401, 503]).toContain(tick.status());
  await anonymous.close();
});

test('signing out ends the session', async () => {
  await page.goto('/overview');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.goto('/brands');
  await expect(page).toHaveURL(/\/sign-in$/);
  await page.fill('input[name=email]', ADMIN.email);
  await page.fill('input[name=password]', 'the wrong password');
  await save('Sign in').click();
  await expect(page.getByText('The email or password is not correct.')).toBeVisible();
  await page.fill('input[name=email]', ADMIN.email);
  await page.fill('input[name=password]', ADMIN.password);
  await save('Sign in').click();
  await expect(page).toHaveURL(/\/overview$/);
});

test('no page crashed and the server returned no errors during the whole journey', async () => {
  expect(browserErrors).toEqual([]);
});
