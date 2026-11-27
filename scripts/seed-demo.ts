/**
 * Adds a clearly labelled DEMONSTRATION brand ("Demo Botanics") so you can see how the product looks
 * with content in it. Everything it creates is fictional and is flagged "Demonstration data" in the
 * interface. It adds NO marketplace metrics of any kind.
 *
 * Run it after you have completed the first-time setup screen:   npm run db:seed:demo
 * It is safe to run twice: if the demo brand already exists it does nothing.
 */
import './_env';
import fs from 'node:fs';
import path from 'node:path';
import { and, eq } from 'drizzle-orm';

const FIXTURES = path.join(process.cwd(), 'tests', 'fixtures');
const DEMO_BRAND = 'Demo Botanics';

async function main() {
  const { getDb, closeDb, schema } = await import('../src/db/client');
  const { createBrand, saveGuideline, setGuidelineStatus, saveClaim, reviewClaim, addCompetitor } = await import('../src/lib/services/brands');
  const { importProductsCsv, listProducts, saveSku, getProduct } = await import('../src/lib/services/products');
  const { uploadAsset, setAssetTrust, listAssets } = await import('../src/lib/services/assets');
  const { ensureJobHandlers } = await import('../src/lib/job-handlers');
  const { runPendingJobs } = await import('../src/lib/jobs');
  const { gtinCheckDigit } = await import('../src/lib/gtin');

  const db = await getDb();
  const admins = await db
    .select({
      userId: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      orgId: schema.organisations.id,
      orgName: schema.organisations.name,
      orgSlug: schema.organisations.slug,
      settings: schema.organisations.settings,
      membershipId: schema.memberships.id,
    })
    .from(schema.memberships)
    .innerJoin(schema.users, eq(schema.users.id, schema.memberships.userId))
    .innerJoin(schema.organisations, eq(schema.organisations.id, schema.memberships.organisationId))
    .where(and(eq(schema.memberships.roleKey, 'administrator'), eq(schema.users.status, 'active')))
    .orderBy(schema.memberships.createdAt)
    .limit(1);
  const admin = admins[0];
  if (!admin) {
    console.log('No organisation exists yet. Start the app, complete the first-time setup screen, then run this again.');
    await closeDb();
    return;
  }
  const ctx = {
    user: { id: admin.userId, name: admin.name, email: admin.email },
    organisation: { id: admin.orgId, name: admin.orgName, slug: admin.orgSlug, settings: admin.settings ?? {} },
    membership: { id: admin.membershipId, role: 'administrator' as const, brandIds: null },
    ip: null,
  };

  const existing = await db
    .select({ id: schema.brands.id })
    .from(schema.brands)
    .where(and(eq(schema.brands.organisationId, admin.orgId), eq(schema.brands.name, DEMO_BRAND)))
    .limit(1);
  if (existing.length) {
    console.log(`"${DEMO_BRAND}" already exists in ${admin.orgName} — nothing to do.`);
    await closeDb();
    return;
  }

  console.log(`Adding demonstration data to "${admin.orgName}"…`);
  const brand = await createBrand(
    ctx,
    {
      name: DEMO_BRAND,
      tagline: 'Everyday botanical care — a fictional brand for demonstration',
      description: 'Demo Botanics is not a real company. It exists only to show how the Brand Intelligence Engine works.',
      positioning: 'Affordable, plant-based hair and personal care for families who want natural ingredients without compromising on results.',
      personality: 'Warm, knowledgeable, down to earth.',
      toneOfVoice: 'We speak warmly and plainly, like a knowledgeable friend. We explain what an ingredient does instead of using jargon. We never exaggerate.',
      targetAudience: 'Households looking for everyday hair, skin and oral care with familiar botanical ingredients.',
      visualGuidelines: 'Leaf green on warm cream. Marketplace main images on a pure white background with the full pack visible.',
    },
    { isDemo: true },
  );

  const guideline = await saveGuideline(ctx, brand.id, { section: 'tone_of_voice', title: 'Words we never use', body: 'Never use miracle, cure, guaranteed or instant.' });
  await setGuidelineStatus(ctx, guideline.id, 'approved');
  await saveGuideline(ctx, brand.id, { section: 'language_and_localisation', title: 'Arabic listings', body: 'Product names stay in English; descriptions are written in Modern Standard Arabic.', marketCodes: ['AE', 'SA'] });

  const report = await importProductsCsv(ctx, brand.id, fs.readFileSync(path.join(FIXTURES, 'demo-products.csv'), 'utf8'));
  await db.update(schema.products).set({ isDemo: true }).where(eq(schema.products.brandId, brand.id));
  const products = await listProducts(ctx, { brandId: brand.id });

  // Demonstration barcodes: made-up numbers with a valid check digit, on some SKUs only.
  const oil = products.find((p) => p.name === 'Nourishing Hair Oil');
  if (oil) {
    const detail = await getProduct(ctx, oil.id);
    let n = 1;
    for (const sku of detail.skus.slice(0, 2)) {
      const data = `20000000${String(n++).padStart(4, '0')}`;
      await saveSku(
        ctx,
        oil.id,
        { skuCode: sku.skuCode, variantName: sku.variant.name, sizeValue: sku.variant.sizeValue ? Number(sku.variant.sizeValue) : null, sizeUnit: sku.variant.sizeUnit, packQuantity: sku.packQuantity, gtin: data + gtinCheckDigit(data) },
        sku.id,
      );
    }
  }

  const approved = await saveClaim(ctx, brand.id, { claimText: 'Enriched with almond oil and coconut oil', claimType: 'ingredient', productId: oil?.id, substantiation: 'Demonstration formulation sheet.' });
  await reviewClaim(ctx, approved.id, { status: 'approved' });
  const restricted = await saveClaim(ctx, brand.id, { claimText: 'Cures dandruff', claimType: 'efficacy' });
  await reviewClaim(ctx, restricted.id, { status: 'restricted', restrictionReason: 'Medical claim — not permitted for cosmetic products.' });
  await saveClaim(ctx, brand.id, { claimText: 'Helps reduce hair breakage caused by dryness', claimType: 'efficacy', productId: oil?.id });

  await addCompetitor(ctx, brand.id, { name: 'Example Rival (demo)', parentCompany: 'Example Holdings', notes: 'Fictional competitor for demonstration.' });

  const files: [string, string][] = [
    ['demo-brand-book.pdf', 'brand_book'],
    ['demo-product-catalogue.docx', 'product_catalogue'],
    ['demo-range-presentation.pptx', 'other'],
    ['demo-claims-register.xlsx', 'regulatory'],
    ['demo-hero-image.png', 'product_image'],
  ];
  for (const [filename, kind] of files) {
    await uploadAsset(ctx, { brandId: brand.id, kind, filename, bytes: new Uint8Array(fs.readFileSync(path.join(FIXTURES, filename))) });
  }
  ensureJobHandlers();
  const jobs = await runPendingJobs(50);
  const assets = await listAssets(ctx, { brandId: brand.id });
  const book = assets.find((a) => a.asset.originalFilename === 'demo-brand-book.pdf');
  if (book) await setAssetTrust(ctx, book.asset.id, 'approved_source');

  // A demonstration launch book, built only from the approved claim and the uploaded packshot.
  const { saveBook } = await import('../src/lib/services/books');
  const packshot = assets.find((a) => a.asset.originalFilename === 'demo-hero-image.png');
  await saveBook(ctx, brand.id, {
    kind: 'launch_book',
    title: 'Nourishing Hair Oil — launch book',
    subtitle: 'A fictional launch, to show how launch books work',
    launchDate: 'Spring 2027',
    marketCodes: ['AE', 'SA'],
    overview: 'A lightweight daily hair oil with almond and coconut, for families who want familiar botanical ingredients without a heavy feel.',
    audience: 'Households in the Gulf looking for everyday hair care with natural ingredients.',
    keyMessages: 'Lightweight, never greasy\nFamiliar botanical ingredients\nFor the whole family',
    toneOfVoice: 'Warm and plain, like a knowledgeable friend. We explain what an ingredient does instead of using jargon.',
    dosAndDonts: 'Do show the full pack on a white background\nDo name the ingredients\nDon’t promise medical results\nDon’t use the words miracle, cure or guaranteed',
    fonts: [
      { name: 'Fraunces', role: 'Headlines', usage: 'Pack name and titles', link: 'https://fonts.google.com/specimen/Fraunces' },
      { name: 'IBM Plex Sans', role: 'Body text', usage: 'Descriptions and bullets', link: 'https://fonts.google.com/specimen/IBM+Plex+Sans' },
    ],
    colours: [
      { name: 'Leaf green', hex: '#1F6B4A', usage: 'Primary' },
      { name: 'Warm cream', hex: '#F5F1E8', usage: 'Backgrounds' },
      { name: 'Almond', hex: '#C89B6D', usage: 'Accents' },
    ],
    claimIds: [approved.id],
    assetIds: packshot ? [packshot.asset.id] : [],
    productIds: oil ? [oil.id] : [],
  });

  console.log(`Done. Created the brand "${DEMO_BRAND}" with ${report.productsCreated} products, ${report.skusCreated} SKUs, 3 claims, 2 guidelines, ${files.length} documents and a launch book.`);
  console.log(`Background jobs: ${jobs.succeeded} succeeded, ${jobs.failed} failed.`);
  console.log('Everything is flagged "Demonstration data". To remove it, archive or delete the brand in the app.');
  await closeDb();
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  // The "database already in use" message is an instruction for the reader, not a crash report.
  console.error(/already in use/.test(message) ? `\n${message}\n` : err);
  process.exit(1);
});
