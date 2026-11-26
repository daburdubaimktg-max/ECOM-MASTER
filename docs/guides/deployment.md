# Deployment guide — put the product online for your team

> **Honest status.** Build 1 has been tested as a production build on a local computer, and against a local PostgreSQL 16 database with pgvector. **It has not yet been deployed to any hosting provider.** The steps below follow each provider's standard setup and the product's own requirements, but the provider-specific steps are marked **untested**. Expect to adjust small details the first time, and test with demonstration data before entering real brand information.

Cost estimates are in [Deliverable 8](../product/08-build-vs-buy.md#32-running-cost-recurring). The architecture is in [Deliverable 7](../architecture/07-system-architecture.md#11-deployment-architecture).

---

## 1. What the product needs from a host

| Need | Why |
|---|---|
| **Node.js 22 or newer** | Runs the application |
| **A long-running server with about 2 GB of memory** | The application keeps the search model in memory and runs background work. Serverless platforms that stop between requests are not suitable for Build 1 |
| **A persistent disk** (a few GB to start) | Uploaded files and the downloaded search model are stored on disk. Without a persistent disk, uploads disappear at every restart |
| **One instance only** | Until file storage moves to cloud storage (Stage 6), run a single copy of the application |
| **PostgreSQL 15 or newer with the `vector` and `pg_trgm` extensions** | The database. The built-in development database must not be used for real work |
| **HTTPS** | Sign-in cookies are only sent over secure connections in production |

## 2. Choose an approach

| | Managed hosting (**recommended**) | Self-hosting |
|---|---|---|
| What you do | Connect accounts and fill in settings pages | Rent a virtual server and install and maintain everything |
| Backups, security updates, HTTPS | Mostly handled for you | Your responsibility |
| Skills needed | Following this guide | A system administrator |
| Suggested providers | Database: Supabase (or Neon, Railway, AWS RDS, Azure, Google Cloud SQL — all offer pgvector). Application: Render or Railway | Any provider of virtual servers |

The rest of this guide uses **Supabase** for the database and **Render** for the application as the worked example, because both have clear pricing pages and both can run this product as it stands. Railway can host both parts instead; the settings are the same.

---

## 3. Managed hosting, step by step

### Accounts you need

| Account | Used for | Cost (public prices, 26 Nov 2026) |
|---|---|---|
| GitHub | Holds the code; the host deploys from it | Free |
| Supabase | The database | Free plan to try; Pro from $25 a month for real use (daily backups) |
| Render | The application server | Workspace plan plus a web service; a 2 GB instance is $25 a month |
| A domain name (optional) | Your own address, such as intelligence.your-company.com | Usually a few dollars a month |

### Step 1 — Create the database (Supabase) *(untested)*

1. Create a Supabase project. Choose the **region closest to your team**, or the one your company's data rules require. Save the database password it asks you to set in your password manager.
2. In the project, open the **SQL editor** and run:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

3. Open **Connect** (or *Project settings → Database*) and copy the **connection string**. Choose the *direct connection* or *session pooler* string — **not** the transaction pooler, because migrations need a full session. Replace `[YOUR-PASSWORD]` in it with the password from step 1.

Keep this connection string secret. It is the key to all your data.

### Step 2 — Create the application server (Render) *(untested)*

1. In Render, create a **Web Service** and connect it to the GitHub repository and branch.
2. Settings:

| Setting | Value |
|---|---|
| Runtime | Node |
| Build command | `npm ci && npm run build` |
| Start command | `npm run db:migrate && npm start` |
| Instance type | One with 2 GB of memory |
| Health check path | `/api/health` |

The start command updates the database and loads research data each time the application starts, then starts it. Running it repeatedly is safe.

3. Add a **persistent disk**: mount path `/var/data`, size 5 GB to start.
4. Add these **environment variables** (Render: *Environment*). This is the only place secrets go — never into the code or a file in the repository.

| Name | Value |
|---|---|
| `DATABASE_URL` | The connection string from step 1 |
| `BIE_DATA_DIR` | `/var/data` |
| `JOBS_SECRET` | A long random value — generate one with a password manager (40 or more random characters) |
| `NODE_VERSION` | `22` |
| `APP_URL` | The address the application will have, for example `https://intelligence.your-company.com` |

5. Deploy. The first start takes a few minutes. The first document upload or search also downloads the search model (about 130 MB) to the disk.

**If the database connection fails with a certificate error** ("self-signed certificate in certificate chain"): some managed databases use their own certificate authority. The safe fix is to use the provider's recommended connection string with `sslmode=require` and its certificate. As a temporary measure only, `DATABASE_SSL_REJECT_UNAUTHORIZED=false` makes the connection encrypted but skips checking who is on the other end; do not leave it that way.

### Step 3 — First sign-in

1. Open the address Render gives you (or your own domain once connected — Render's *Custom domains* settings explain the DNS record to add and provide HTTPS automatically).
2. The first-time setup screen appears. Create the organisation and your Administrator account **immediately**: until you do, anyone who finds the address could do it first.
3. **Settings → Organisation & system** should show *PostgreSQL* as the database, not the built-in development database.

### Step 4 — The scheduler *(untested)*

Create a scheduled task that calls the product every five minutes:

```bash
curl -fsS -X POST -H "Authorization: Bearer YOUR_JOBS_SECRET" https://YOUR-ADDRESS/api/jobs/tick
```

On Render this is a **Cron Job** service with the schedule `*/5 * * * *` and the command above (store the secret as an environment variable of the cron job and use `$JOBS_SECRET`). n8n, GitHub Actions on a schedule, or any monitoring service that can make a POST request also work. Check that **Automation** now shows *Heartbeat secured*.

### Step 5 — Backups, and a test restore

| What | How | Check |
|---|---|---|
| Database | Supabase Pro takes daily backups automatically (the free plan does not). Point-in-time recovery is a paid add-on | Once a quarter, restore a backup into a new, separate project and confirm you can sign in |
| Uploaded files | They are on the Render disk. Render takes daily disk snapshots | Keep the original files of important documents elsewhere as well (for example your company's shared drive) until Stage 6 moves files to cloud storage |
| Settings | Write the list of environment variables (names, not values) in your internal documentation; keep the values in your company password manager | — |

A backup that has never been restored is not a backup. Do the first test restore before entering real data.

### Step 6 — Monitoring

- Use the provider's uptime alert on `/api/health`, or a free external monitor, emailing the person responsible.
- Render shows the application's log; errors from background work appear there too.

### Updating

Push the change to the branch Render deploys from. Render builds it, and the start command applies any database changes and loads updated research files before the new version starts serving. Database changes are designed to be additive; still, take a manual backup before a release that includes a database migration (any change to the `drizzle/` folder).

---

## 4. Self-hosting *(untested)*

For a team with its own system administrator.

1. A Linux server (2 vCPU, 4 GB memory) with Node.js 22, PostgreSQL 16 and the `postgresql-16-pgvector` package.
2. As the PostgreSQL administrator, create a database and a user for the application, then in that database run the two `CREATE EXTENSION` commands from step 1 above. The application's user does not need superuser rights; `npm run db:migrate` prints these instructions if the extensions are missing.
3. Copy the code to the server, create `.env.local` with the variables from step 2 (with `DATABASE_URL` pointing at the local database and `BIE_DATA_DIR` at a directory outside the code folder), then run `npm ci`, `npm run build`, `npm run db:migrate`.
4. Run `npm start` under a process manager (systemd) so it restarts after a crash or reboot. It listens on port 3000.
5. Put a reverse proxy with automatic HTTPS (such as Caddy or nginx with Let's Encrypt) in front of it. Pass the `Host` and `X-Forwarded-Proto` headers.
6. Schedule the heartbeat with cron, as in step 4.
7. Back up nightly with `pg_dump`, plus the `BIE_DATA_DIR` folder, to storage on a different machine. Test a restore.
8. Apply operating-system security updates monthly.

---

## 5. Before real brand information goes in

- [ ] Setup completed and the Administrator account is yours
- [ ] Settings show PostgreSQL, not the development database
- [ ] HTTPS works and the address is the final one
- [ ] The scheduler shows *Heartbeat secured*
- [ ] A backup has been restored successfully at least once
- [ ] The secrets are stored only in the host's settings and your password manager
- [ ] *External AI processing* in Settings is **off** (it is off by default) until your organisation has approved a provider
- [ ] The [security guide](security.md) has been read by whoever owns the system
