# Brand Intelligence Engine

One place that knows what a brand stands for, what it sells, which claims are approved, where its
products are sold online — and, as later stages are built, how they are presented, what customers say
and what the brand team should do next. E-commerce is the first application; the same knowledge base
is designed to serve social, advertising and creative work later.

> **Status: Build 1 — the working foundation.** Everything described under "What works today" is built
> and tested. Listing monitoring, scoring, AI content and automation are designed (and their database
> tables exist) but are **not built yet**; the app says so on each of those screens.

## Start here

| If you want to… | Read |
|---|---|
| Understand the research and the recommendations | [`docs/README.md`](docs/README.md) — the ten deliverables |
| Run the product on your computer | [`docs/guides/setup.md`](docs/guides/setup.md) |
| Add brands, products, marketplaces, requirements | [`docs/guides/how-to.md`](docs/guides/how-to.md) |
| Put it on the internet for your team | [`docs/guides/deployment.md`](docs/guides/deployment.md) |
| Know how your data is protected | [`docs/guides/security.md`](docs/guides/security.md) |

## Run it in three commands

You need [Node.js 22 or newer](https://nodejs.org). Nothing else — no database to install, no accounts, no API keys.

```bash
npm install
```

```bash
npm run dev
```

Open <http://localhost:3000>. The first screen asks you to create your organisation and administrator
account. To see the product with example content, stop the app (Ctrl+C) and run:

```bash
npm run db:seed:demo
```

This adds a fictional brand, "Demo Botanics", clearly flagged as demonstration data.

## What works today

- **Sign-in, roles and audit log** — six roles (Administrator, Brand Manager, Content Editor, Analyst,
  Agency Contributor, Viewer), invitation links, brand-level access for agencies, password change and
  recovery, and a tamper-proof record of every change.
- **Brands** — profile, guidelines (draft → approved), claims (unverified → approved or restricted,
  per market), competitors.
- **Product catalogue** — products, variants, SKUs and multipacks, barcodes with check-digit
  validation, marketplace identifiers, attributes, markets; spreadsheet import with a "check first" step.
- **Documents & media** — upload PDF, Word, PowerPoint, Excel, text, images, videos. Documents are read
  automatically and become searchable; the true file type is verified from the file's contents.
- **Knowledge search** — keyword + meaning search in English and Arabic across everything, running on
  your own server, with the source, page and trust label on every result.
- **Marketplace intelligence** — 130 researched platforms in nine countries, ranked by a published,
  reproducible formula, each with evidence and sources; your own tracking decisions on top.
- **Requirements library** — versioned, sourced content rules per retailer, and the official
  listing-quality scores each retailer really exposes.

## What is not built yet

Digital shelf monitoring (Stage 3), listing quality scoring, review and competitor intelligence
(Stage 4), AI content generation, recommendations, reports and scheduled automation (Stage 5).
See [`docs/product/09-roadmap.md`](docs/product/09-roadmap.md). **No marketplace API or data provider
is connected, and the app contains no marketplace metrics.**

## Everyday commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the app for development at http://localhost:3000 |
| `npm run build` then `npm start` | Build and run the production version |
| `npm test` | Run the automated unit and integration tests |
| `npm run test:e2e` | Run the browser tests against a production build |
| `npm run typecheck` / `npm run lint` | Check the code for mistakes |
| `npm run db:migrate` | Update a PostgreSQL database and load research data (production) |
| `npm run db:seed:demo` | Add the fictional demonstration brand |
| `npm run db:reset -- --yes` | Delete the development database and start again |
| `npm run admin:reset-link -- you@company.com` | Emergency: create a password-reset link when no Administrator can sign in |
| `npm run db:generate` | (Developers) create a migration after changing the database design |

## How information is labelled

Every figure in the product carries one of five markers, and they are never mixed:

| Marker | Meaning |
|---|---|
| ● Verified | From an authoritative source, or entered and approved by your team |
| ◆ Calculated | Computed from stored data with a published, versioned formula |
| ✦ AI-assessed | A judgement by an AI model — always reviewed by a person |
| ◐ Estimated | A third-party or analyst estimate, not a measured figure |
| ○ Not available | No data through current integrations — a gap, never a zero |

## Repository layout

```
docs/            The ten deliverables, guides and screenshots
data/research/   Research data files (marketplaces, requirements, vendors, APIs, open source)
src/db/          Database design (schema), connection and research-data loader
src/lib/         Business logic: services, sign-in and permissions, documents, search, jobs
src/app/         Screens, form actions and API routes
src/components/  Interface building blocks
drizzle/         Database migrations (SQL)
scripts/         Maintenance commands
tests/           Unit, integration and browser tests, plus fictional test documents
```

## Technology, briefly

Next.js 16 and React 19 (TypeScript) for the app; PostgreSQL with pgvector for data and search
(a built-in PostgreSQL runs automatically in development); Drizzle ORM; a small multilingual language
model that runs on the server for meaning-based search. The reasons for each choice are in
[`docs/architecture/07-system-architecture.md`](docs/architecture/07-system-architecture.md).
