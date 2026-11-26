# Security guide — how your information is protected, and what you need to do

Written for the product owner and whoever administers the system. The technical detail is in the [architecture document, section 10](../architecture/07-system-architecture.md#10-security-architecture).

---

## 1. What the product does for you

| Risk | What protects you |
|---|---|
| **Someone guesses a password** | Passwords are stored as one-way scrambles (scrypt), never as text. After 8 wrong attempts for one email address in 15 minutes, sign-in is refused for that address. Passwords must be at least 10 characters and very common passwords are refused |
| **A stolen or forgotten laptop** | Sign-ins expire after 14 days without use. Disabling an account signs the person out everywhere at once. Changing a password signs out every other device |
| **Someone sees more than they should** | Six roles, each with only the permissions it needs. Agency users see only the brands they are given. Every permission is checked on the server for every action, not just by hiding buttons — this is tested |
| **One organisation's data reaching another** | Every database query is limited to the signed-in person's organisation and permitted brands |
| **Changes nobody can account for** | Every change is recorded: who, when, what. The audit log cannot be edited or deleted, even by someone with direct database access |
| **A dangerous file is uploaded** | The real type of every file is checked from its contents, not its name; only document, image and video types are accepted; SVG images (which can contain scripts) are refused; sizes are limited; compressed documents are checked as they are opened so they cannot exhaust the server. Files are stored outside the website's folders and only signed-in people with access to the brand can download them |
| **Another website acting on your behalf** | Requests that change data are refused if they come from another website. The pages cannot be embedded in other sites |
| **Brand documents leaving the company** | Documents are read and searched on your own server. The search model runs locally. Nothing is sent to an outside AI service unless an Administrator switches on *External AI processing* — off by default, and the change is audited |
| **Secrets leaking** | Passwords for the database and future marketplace accounts live only in the server's settings, never in the code, the browser or the database |
| **Recovery links being abused** | Invitation and password-reset links are long random values; only a scrambled copy is stored; each works once and expires (7 days for invitations, 24 hours for resets) |
| **Shoppers' personal data** | The product stores none. When reviews are collected in Stage 4, reviewer names, photos and profile links will not be stored — the database has no place for them |

## 2. What you need to do

**Once, when going live**

1. Complete the first-time setup straight after deploying, so nobody else can claim the Administrator account.
2. Use HTTPS — the [deployment guide](deployment.md) covers it.
3. Store the database connection string and `JOBS_SECRET` only in your hosting provider's settings and your company password manager. **Never paste them into chat messages, emails, documents or AI tools.**
4. Have at least two Administrators, so one can help the other.
5. Test restoring a backup.

**Every time someone joins or leaves**

- Give each person the lowest role that lets them do their job. Most people need *Viewer*, *Analyst* or *Content Editor*; few need *Administrator*.
- Give agencies the *Agency Contributor* role and only the brands they work on.
- When someone leaves, **disable their account the same day** (Settings → Team). Their history stays in the audit log.
- If someone who knew `JOBS_SECRET` or the database password leaves, change those values ([how-to, section 8](how-to.md#8-look-after-automation)).

**Every month**

- Look through Settings → Team for accounts that are no longer needed.
- Skim the audit log for anything unexpected, such as role changes or password-reset links you did not create.
- Make sure software updates are being applied (see section 4).

**Before switching on external AI (Stage 5)**

Have the person responsible for data protection review the AI provider's commercial terms: whether your data is used to train models, how long it is kept, and in which country it is processed. Then an Administrator switches it on. The switch and every change to it are in the audit log.

**Before collecting competitor or review data (Stages 3–4)**

Agree the data-collection policy with legal counsel — [Deliverable 4, section 6](../research/04-api-data-feasibility.md#6-legal-and-terms-of-use-constraints--and-the-decision-you-need-to-make). The product will never log in to a marketplace as a shopper, solve CAPTCHAs or get round technical blocks.

## 3. What is not in place yet

Stated plainly so you can judge the risk:

| Not yet | Effect | Planned |
|---|---|---|
| Two-step verification and single sign-on | A password alone protects each account | Stage 6 |
| Database-level row security (Row Level Security) | Separation between organisations relies on the application's own checks, which are applied everywhere and tested, but have no second layer in the database | Stage 6 |
| Virus scanning of uploads | File types are strictly checked, but files are not scanned for malware. Downloaded files should be opened with the same care as email attachments | Stage 6 |
| Self-service password reset by email | An Administrator creates the reset link | Stage 5 |
| Encrypted storage of marketplace credentials | Not needed yet — no marketplace is connected | Stage 3 |
| An independent security review | Not done | Stage 6 |
| Rate limits on every page | Sign-in is limited; other pages rely on the hosting provider's protection | Stage 6 |

Until database-level row security is in place, **do not give anyone direct access to the database** unless they may see every organisation's data.

## 4. Software updates

The product is built from open-source components with pinned versions. `npm audit` currently reports four moderate findings, all in a development-only tool (the database migration generator) that does not run in production. Whoever maintains the product should run `npm audit` monthly, apply updates, and run all tests before deploying (`npm run typecheck && npm run lint && npm test && npm run test:e2e`).

## 5. If something goes wrong

| Situation | Do this |
|---|---|
| An account may be compromised | Disable it in Settings → Team (this signs it out everywhere), check the audit log for what it did, then re-enable it with a password-reset link once the person is reachable |
| The database password or `JOBS_SECRET` may have leaked | Change it at the database provider or in the hosting settings, update the application's environment variable, restart |
| A file was uploaded that should not have been | Delete it (Brand Manager or Administrator). Its passages are removed from search at the same time. The upload and the deletion stay in the audit log |
| Data was lost or damaged | Restore the most recent backup ([deployment guide, step 5](deployment.md#step-5--backups-and-a-test-restore)) |
| Personal data may have been exposed | Follow your company's data-breach procedure. The audit log shows every change and sign-in; it does not record who viewed what |
