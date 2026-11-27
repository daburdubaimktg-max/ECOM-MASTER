import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { z } from 'zod';
import { getDb, schema } from '@/db/client';
import type { BookColour, BookFont } from '@/db/schema';
import type { RequestContext } from '@/lib/auth/context';
import { assertBrandAccess, assertCan } from '@/lib/auth/context';
import { NotFoundError, ValidationError } from '@/lib/auth/permissions';
import { audit } from './audit';
import { getBrand } from './brands';

/**
 * BRAND BOOKS — brand books and launch books put together from what the engine already knows:
 * fonts, colours, key messages, approved claims, packshots and products.
 *
 * Rules: only APPROVED claims can be placed in a book; restricted claims are listed automatically as
 * "never say"; a claim that stops being approved after it was added is left out of the book and
 * flagged. Editing an approved book returns it to draft. Writing needs `guideline.edit`, approving
 * needs `guideline.approve` — so proposing and approving stay separate.
 */
const bb = schema.brandBooks;

export const BOOK_KINDS = { brand_book: 'Brand book', launch_book: 'Launch book' } as const;
export type BookKind = keyof typeof BOOK_KINDS;
export const FONT_ROLES = ['Headlines', 'Body text', 'Accent', 'Packaging', 'Arabic', 'Other'] as const;

const text = (max: number) =>
  z
    .string()
    .max(max, `Keep this under ${max} characters.`)
    .nullish()
    .transform((v) => (v && v.trim() ? v.trim() : null));

const HEX = /^#[0-9a-fA-F]{6}$/;

/** An optional field: a missing or malformed value becomes `fallback` instead of failing the whole form. */
function lenient<T>(schema: z.ZodType<T>, fallback: T) {
  return z
    .unknown()
    .optional()
    .transform((v): T => {
      const r = schema.safeParse(v);
      return r.success ? r.data : fallback;
    });
}

export const bookInputSchema = z.object({
  kind: lenient(z.enum(['brand_book', 'launch_book']), 'brand_book' as const),
  title: z.string().trim().min(2, 'Give the book a title.').max(160),
  subtitle: text(240),
  launchDate: text(40),
  marketCodes: z
    .array(z.string().trim().toUpperCase().length(2))
    .nullish()
    .transform((v) => (v && v.length ? [...new Set(v)] : null)),
  overview: text(6000),
  audience: text(3000),
  keyMessages: text(4000),
  toneOfVoice: text(3000),
  dosAndDonts: text(4000),
  fonts: lenient(z.array(z.object({ name: z.string().trim().max(80), role: z.string().trim().max(40), usage: text(300), link: text(500) })), []).transform(
    (list) => list.filter((f) => f.name.length > 0).slice(0, 12) as BookFont[],
  ),
  colours: lenient(z.array(z.object({ name: z.string().trim().max(60), hex: z.string().trim(), usage: text(200) })), []).transform((list) =>
    list.filter((c) => c.name.length > 0 || c.hex.length > 0).slice(0, 16),
  ),
  claimIds: lenient(z.array(z.string().uuid()), []),
  assetIds: lenient(z.array(z.string().uuid()), []),
  productIds: lenient(z.array(z.string().uuid()), []),
});
export type BookInput = z.input<typeof bookInputSchema>;

function issue(error: z.ZodError): ValidationError {
  const first = error.issues[0];
  return new ValidationError(first?.message ?? 'Please check the form.', { [String(first?.path[0] ?? '_')]: first?.message ?? '' });
}

/** Keeps only references that really belong to this brand, and only approved claims. */
async function cleanReferences(brandId: string, data: { claimIds: string[]; assetIds: string[]; productIds: string[] }) {
  const db = await getDb();
  const [claims, assets, products] = await Promise.all([
    data.claimIds.length
      ? db.select({ id: schema.brandClaims.id, status: schema.brandClaims.status }).from(schema.brandClaims).where(and(eq(schema.brandClaims.brandId, brandId), inArray(schema.brandClaims.id, data.claimIds)))
      : [],
    data.assetIds.length
      ? db.select({ id: schema.brandAssets.id, mimeType: schema.brandAssets.mimeType }).from(schema.brandAssets).where(and(eq(schema.brandAssets.brandId, brandId), inArray(schema.brandAssets.id, data.assetIds)))
      : [],
    data.productIds.length ? db.select({ id: schema.products.id }).from(schema.products).where(and(eq(schema.products.brandId, brandId), inArray(schema.products.id, data.productIds))) : [],
  ]);
  if (claims.some((c) => c.status !== 'approved')) {
    throw new ValidationError('Only approved claims can be placed in a book. Ask a Brand Manager to approve the claim first.', { claimIds: 'Only approved claims.' });
  }
  if (assets.some((a) => !a.mimeType.startsWith('image/'))) throw new ValidationError('Only images can be used as packshots.', { assetIds: 'Only images.' });
  const keep = (ids: string[], found: { id: string }[]) => ids.filter((id) => found.some((f) => f.id === id));
  return { claimIds: keep(data.claimIds, claims), assetIds: keep(data.assetIds, assets), productIds: keep(data.productIds, products) };
}

function validateColours(colours: { name: string; hex: string; usage: string | null }[]): BookColour[] {
  return colours.map((c) => {
    const hex = c.hex.startsWith('#') ? c.hex : `#${c.hex}`;
    if (!HEX.test(hex)) throw new ValidationError(`"${c.hex || c.name}" is not a colour code. Use the six-character form, e.g. #1F6B4A.`, { colours: 'Use a code like #1F6B4A.' });
    return { name: c.name || hex.toUpperCase(), hex: hex.toUpperCase(), usage: c.usage };
  });
}

export async function listBooks(ctx: RequestContext, filters: { brandId?: string } = {}) {
  assertCan(ctx, 'brand.view');
  if (filters.brandId) assertBrandAccess(ctx, filters.brandId);
  const db = await getDb();
  return db
    .select({ id: bb.id, title: bb.title, subtitle: bb.subtitle, kind: bb.kind, status: bb.status, version: bb.version, launchDate: bb.launchDate, updatedAt: bb.updatedAt, brandId: bb.brandId, brandName: schema.brands.name })
    .from(bb)
    .innerJoin(schema.brands, eq(schema.brands.id, bb.brandId))
    .where(
      and(
        eq(bb.organisationId, ctx.organisation.id),
        filters.brandId ? eq(bb.brandId, filters.brandId) : undefined,
        ctx.membership.brandIds !== null ? (ctx.membership.brandIds.length ? inArray(bb.brandId, ctx.membership.brandIds) : sql`false`) : undefined,
      ),
    )
    .orderBy(desc(bb.updatedAt));
}

export async function getBook(ctx: RequestContext, bookId: string) {
  assertCan(ctx, 'brand.view');
  if (!z.string().uuid().safeParse(bookId).success) throw new NotFoundError('Book not found.');
  const db = await getDb();
  const rows = await db.select().from(bb).where(and(eq(bb.id, bookId), eq(bb.organisationId, ctx.organisation.id))).limit(1);
  const book = rows[0];
  if (!book) throw new NotFoundError('Book not found.');
  assertBrandAccess(ctx, book.brandId);
  return book;
}

/** Everything needed to show a book: the book, its brand, and the claims, images and products it refers to. */
export async function getBookContents(ctx: RequestContext, bookId: string) {
  const book = await getBook(ctx, bookId);
  const brand = await getBrand(ctx, book.brandId);
  const db = await getDb();
  const [claims, restricted, images, products, approver] = await Promise.all([
    book.claimIds.length ? db.select().from(schema.brandClaims).where(inArray(schema.brandClaims.id, book.claimIds)) : [],
    db.select().from(schema.brandClaims).where(and(eq(schema.brandClaims.brandId, book.brandId), eq(schema.brandClaims.status, 'restricted'))),
    book.assetIds.length
      ? db
          .select({ id: schema.brandAssets.id, title: schema.brandAssets.title, width: schema.brandAssets.imageWidth, height: schema.brandAssets.imageHeight, kind: schema.brandAssets.kind })
          .from(schema.brandAssets)
          .where(inArray(schema.brandAssets.id, book.assetIds))
      : [],
    book.productIds.length ? db.select().from(schema.products).where(inArray(schema.products.id, book.productIds)) : [],
    book.approvedBy ? db.select({ name: schema.users.name }).from(schema.users).where(eq(schema.users.id, book.approvedBy)).limit(1) : [],
  ]);
  const inOrder = <T extends { id: string }>(ids: string[], list: T[]) => ids.map((id) => list.find((x) => x.id === id)).filter((x): x is T => Boolean(x));
  const ordered = inOrder(book.claimIds, claims);
  const marketsOk = (codes: string[] | null) => !book.marketCodes?.length || !codes?.length || book.marketCodes.some((m) => codes.includes(m));
  return {
    book,
    brand,
    approvedClaims: ordered.filter((c) => c.status === 'approved' && marketsOk(c.marketCodes)),
    /** Claims placed in the book that are no longer approved, or not valid in the book's markets — left out of the book. */
    excludedClaims: ordered.filter((c) => c.status !== 'approved' || !marketsOk(c.marketCodes)),
    restrictedClaims: restricted,
    images: inOrder(book.assetIds, images),
    products: inOrder(book.productIds, products),
    approverName: approver[0]?.name ?? null,
  };
}

export async function saveBook(ctx: RequestContext, brandId: string, input: BookInput, bookId?: string): Promise<string> {
  assertCan(ctx, 'guideline.edit');
  const brand = await getBrand(ctx, brandId);
  const parsed = bookInputSchema.safeParse(input);
  if (!parsed.success) throw issue(parsed.error);
  const colours = validateColours(parsed.data.colours);
  const refs = await cleanReferences(brandId, parsed.data);
  const values = { ...parsed.data, colours, ...refs };
  const db = await getDb();
  return db.transaction(async (tx) => {
    if (bookId) {
      const existing = await tx.select().from(bb).where(and(eq(bb.id, bookId), eq(bb.brandId, brandId))).limit(1);
      if (!existing[0]) throw new NotFoundError('Book not found.');
      // Approval refers to the exact content: any edit returns the book to draft.
      await tx
        .update(bb)
        .set({ ...values, status: 'draft', approvedBy: null, approvedAt: null, version: existing[0].status === 'approved' ? existing[0].version + 1 : existing[0].version, updatedAt: new Date() })
        .where(eq(bb.id, bookId));
      await audit(ctx, { action: 'book.updated', entityType: 'brand_book', entityId: bookId, summary: `Updated ${BOOK_KINDS[values.kind].toLowerCase()} "${values.title}" for ${brand.name}` }, tx);
      return bookId;
    }
    const [row] = await tx
      .insert(bb)
      .values({ ...values, organisationId: ctx.organisation.id, brandId, createdBy: ctx.user.id })
      .returning({ id: bb.id });
    await audit(ctx, { action: 'book.created', entityType: 'brand_book', entityId: row.id, summary: `Created ${BOOK_KINDS[values.kind].toLowerCase()} "${values.title}" for ${brand.name}` }, tx);
    return row.id;
  });
}

export async function setBookStatus(ctx: RequestContext, bookId: string, status: 'approved' | 'draft'): Promise<void> {
  assertCan(ctx, 'guideline.approve');
  const book = await getBook(ctx, bookId);
  const db = await getDb();
  await db
    .update(bb)
    .set(status === 'approved' ? { status, approvedBy: ctx.user.id, approvedAt: new Date(), updatedAt: new Date() } : { status, approvedBy: null, approvedAt: null, updatedAt: new Date() })
    .where(eq(bb.id, bookId));
  await audit(ctx, {
    action: status === 'approved' ? 'book.approved' : 'book.returned_to_draft',
    entityType: 'brand_book',
    entityId: bookId,
    summary: `${status === 'approved' ? 'Approved' : 'Returned to draft'} "${book.title}" (version ${book.version})`,
  });
}

export async function deleteBook(ctx: RequestContext, bookId: string): Promise<void> {
  assertCan(ctx, 'guideline.approve');
  const book = await getBook(ctx, bookId);
  const db = await getDb();
  await db.delete(bb).where(eq(bb.id, bookId));
  await audit(ctx, { action: 'book.deleted', entityType: 'brand_book', entityId: bookId, summary: `Deleted "${book.title}"` });
}

/** What can be placed in a book for this brand: approved claims, images and products. */
export async function bookOptions(ctx: RequestContext, brandId: string) {
  await getBrand(ctx, brandId);
  const db = await getDb();
  const [claims, images, products] = await Promise.all([
    db
      .select({ id: schema.brandClaims.id, claimText: schema.brandClaims.claimText, claimType: schema.brandClaims.claimType, marketCodes: schema.brandClaims.marketCodes })
      .from(schema.brandClaims)
      .where(and(eq(schema.brandClaims.brandId, brandId), eq(schema.brandClaims.status, 'approved'))),
    db
      .select({ id: schema.brandAssets.id, title: schema.brandAssets.title, kind: schema.brandAssets.kind })
      .from(schema.brandAssets)
      .where(and(eq(schema.brandAssets.brandId, brandId), sql`${schema.brandAssets.mimeType} like 'image/%'`))
      .orderBy(desc(schema.brandAssets.createdAt)),
    db.select({ id: schema.products.id, name: schema.products.name }).from(schema.products).where(eq(schema.products.brandId, brandId)).orderBy(schema.products.name),
  ]);
  return { claims, images, products };
}
