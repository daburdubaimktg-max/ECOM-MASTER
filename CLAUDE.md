# Brand Intelligence Engine — notes for AI coding tools

Read `AGENTS.md` too: this project uses Next.js 16 with Cache Components, which differs from older
versions. Read the bundled guide in `node_modules/next/dist/docs/` before changing framework code.

## What this is
A brand knowledge base and e-commerce intelligence platform. The product owner is non-technical:
explain decisions in plain English, give exact step-by-step instructions, never ask for secrets in chat.
Full specification context: `docs/product/06-product-requirements.md`, roadmap: `docs/product/09-roadmap.md`.

## Non-negotiable product rules
1. **Five data classes, never mixed**: verified, calculated, ai_assessed, estimated, missing (`DataClass`).
   Missing data is shown as "not available" — never as zero. Use `<Provenance kind=…/>`.
2. **Never invent data.** No fabricated marketplace scores, metrics, prices or reviews — not for demos,
   not for tests. Demonstration data must be flagged `isDemo` and is limited to the fictional brand
   "Demo Botanics". Research data must carry source URLs.
3. **Official scores** are stored only when obtained through an authorised route. Internal scores must
   be reproducible from stored inputs and a versioned rule (`scoring_rules`).
4. **History is never overwritten.** Observations, research and requirement sets are append-only;
   new research = new snapshot / new version.
5. **Human approval** before anything is published; proposing and approving are separate permissions.
6. **No external AI calls** unless `organisation.settings.allowExternalAi` is true.
7. **Data collection order**: official API → authorised provider → retailer integration → permitted
   public collection → manual upload. Never bypass logins, CAPTCHAs or blocks.

## Architecture in one minute
- `src/db/schema/*` — the whole database (Drizzle ORM). Change schema → `npm run db:generate` → commit the SQL.
- `src/db/client.ts` — one interface, two engines: embedded PGlite (dev/tests) or PostgreSQL (`DATABASE_URL`).
- `src/lib/services/*` — ALL business logic. Every function takes a `RequestContext`, checks the
  permission (`assertCan`), scopes by `organisationId` and brand access, and writes the audit log.
- `src/app/actions/*` — thin server actions: `requireContext()` → service → `refresh()`/`redirect()`.
- `src/app/(app)/*` — pages. Each page is `<PageBoundary><AsyncContent/></PageBoundary>`; the async
  part starts with `await requireContext()`. Any server code that touches the database or the clock
  must first read the session or call `await connection()`.
- `data/research/*` — research files loaded as reference data (checksum-tracked, versioned).
- Constants shared by server and client components live in plain modules (`src/lib/labels.ts`),
  never in a `'use client'` file.
- Correlated SQL sub-queries must name the outer table explicitly (`"brands"."id"`).

## Before saying something works
`npm run typecheck && npm run lint && npm test && npm run test:e2e` — all must pass.
Do not claim an integration works until it has been exercised against the real service.
