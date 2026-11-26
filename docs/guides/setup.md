# Setup guide — run the product on your own computer

This guide assumes no technical background. It takes about fifteen minutes, most of it waiting for downloads. Nothing here costs money, needs an account or sends your data anywhere.

To put the product on the internet for your team, use the [deployment guide](deployment.md) instead — but do this first; it is the quickest way to see what you have.

> **Tested on:** Linux, with Node.js 22. Windows and macOS use the same commands and the same components and should behave identically, but they were not tested in this build. If a step fails on your computer, the [troubleshooting table](#10-if-something-goes-wrong) covers the usual causes.

---

## 1. What you need

| | |
|---|---|
| A computer | Windows, macOS or Linux, with about 1 GB of free disk space |
| **Node.js, version 22 or newer** | The program that runs the product. Download the "LTS" installer from [nodejs.org](https://nodejs.org) and accept the defaults |
| The product's files | From GitHub — see step 2 |

You do **not** need a database, a hosting account or any API keys.

**To check Node.js is installed**, open a terminal (on Windows: press Start, type *PowerShell*, press Enter; on a Mac: open *Terminal* from Applications → Utilities) and type:

```bash
node --version
```

It should print a number starting with `v22` or higher.

## 2. Get the files

On the repository's GitHub page, press the green **Code** button and choose **Download ZIP**. Unzip it somewhere easy to find, such as your Documents folder.

*(If you use Git, clone the repository instead; the result is the same.)*

## 3. Start the product

In the terminal, move into the folder you unzipped. Type `cd`, a space, then drag the folder onto the terminal window and press Enter. Then run these two commands, one after the other.

Install the components — once only, and it takes a few minutes:

```bash
npm install
```

Start the product:

```bash
npm run dev
```

When it prints `Ready`, open **<http://localhost:3000>** in your web browser.

Leave the terminal window open while you use the product. To stop it, click in the terminal and press **Ctrl + C**. To start it again later, repeat `npm run dev` from the same folder.

## 4. First-time setup

The first screen asks for four things:

| Field | What to enter |
|---|---|
| Company or organisation name | Shown at the top of the product |
| Your name | Shown next to everything you do in the audit log |
| Work email | What you will sign in with. No email is sent |
| Password | At least 10 characters. A short sentence works well |

You become the **Administrator**. Nobody else can create an account by themselves — you invite people from **Settings → Team**.

This screen appears only once. After that, the address goes straight to sign-in.

## 5. See it with example content

To look around before entering your own information, add the fictional demonstration brand:

1. Stop the product (**Ctrl + C** in the terminal).
2. Run:

```bash
npm run db:seed:demo
```

3. Start it again with `npm run dev`.

This adds "Demo Botanics" — two products, four SKUs, three claims, two guidelines and five documents, all invented and all flagged **Demonstration data**. It adds no marketplace figures of any kind. Remove it at any time by archiving the brand.

What to try:

- **Knowledge Search** — type *almond oil*, or a question such as *what must we never say?*
- **Brands → Demo Botanics → Claims** — approve the claim waiting for review
- **Marketplace Intelligence** — choose a country; open a platform to see its evidence and sources
- **Marketplace Intelligence → Requirements library** — open *Amazon* or *Noon*
- **Settings → Audit log** — everything that has just happened

## 6. Where your information is kept

Everything lives in a folder called **`.data`** inside the product's folder:

| Inside `.data` | Contains |
|---|---|
| `pglite` | The database |
| `uploads` | Every file you uploaded |
| `models` | The language model that powers meaning-based search (about 130 MB, downloaded once) |

**To back up** a local installation: stop the product and copy the `.data` folder somewhere safe. **To restore:** stop the product and put the copy back.

**To start again from nothing** — this permanently deletes the local database and uploads:

```bash
npm run db:reset -- --yes
```

This local arrangement is for trying the product and for development. For real, shared use, connect a proper database as described in the [deployment guide](deployment.md); **Settings → Organisation & system** shows which kind of database is in use.

## 7. Meaning-based search and the internet

The first time a document is uploaded or a search is made, the product downloads a small open language model (about 130 MB) so that search can match meaning as well as exact words. After that it works offline, and your documents are never sent anywhere.

If your network blocks the download, keyword search still works and the screen says which methods were used. To switch the download off entirely, see `EMBEDDINGS_PROVIDER` below.

## 8. Settings you can change

None are required. To change one, create a text file called **`.env.local`** in the product's folder (the file `.env.example` is a template you can copy), add the line, save, and restart the product.

| Setting | What it does | If you leave it out |
|---|---|---|
| `DATABASE_URL` | Connects a real PostgreSQL database | The built-in development database is used |
| `BIE_DATA_DIR` | Where the `.data` folder lives | `.data` in the product's folder |
| `MAX_UPLOAD_MB` | Largest file that can be uploaded | 50 |
| `EMBEDDINGS_PROVIDER` | `local` for meaning-based search on this computer; `none` for keyword search only | `local` |
| `JOBS_SECRET` | The password a scheduler uses to trigger background work (section 9) | Background work still runs straight after each action |
| `APP_URL` | Your installation's address, used only when printing a recovery link | `http://localhost:3000` |
| `COOKIE_SECURE` | Set to `false` only to test a production build on your own computer | Secure cookies in production |

**Never put passwords or keys anywhere except this file or your hosting provider's settings page.** `.env.local` is never uploaded to GitHub — the repository is set up to ignore it.

## 9. Background work and the scheduler

Some work happens in the background — today, reading uploaded documents and preparing them for search. It starts by itself straight after you upload, so **on your own computer there is nothing to set up.**

A *scheduler* becomes useful once the product is hosted for your team, and necessary from Stage 3 when listing data is collected on a timetable. A scheduler is simply something that calls one address every few minutes. That call retries anything that failed, runs anything due and tidies up expired sign-ins.

**To set it up on a hosted installation:**

1. Create a long random secret. Any password generator will do; a developer can run:

```bash
openssl rand -hex 32
```

2. Save it as `JOBS_SECRET` in your hosting provider's settings for the product (their page for *environment variables* or *secrets*), and restart the product.
3. Create a scheduled task that runs every five minutes and makes this request, replacing the address and the secret:

```bash
curl -X POST -H "Authorization: Bearer YOUR_SECRET" https://your-address/api/jobs/tick
```

Most hosting providers offer scheduled tasks ("cron jobs") that can run exactly this command. If you use **n8n**, add a *Schedule* trigger every five minutes followed by an *HTTP Request* step: method POST, the address above, and a header named `Authorization` with the value `Bearer YOUR_SECRET`.

4. Check it: **Automation** in the product shows *Heartbeat secured* and lists recent background work.

Until a secret is set, the address refuses every call, so it cannot be misused.

## 10. If something goes wrong

| What you see | Cause | What to do |
|---|---|---|
| `node` or `npm` "is not recognized" or "command not found" | Node.js is not installed, or the terminal was open before you installed it | Install it from nodejs.org, then close and reopen the terminal |
| A message that Node.js is too old | Version below 22 | Install the current LTS version |
| "Port 3000 is in use" | Another program, or a second copy of the product, is using that address | Stop the other copy, or use the alternative address the terminal prints |
| "The built-in database is already in use by another running copy of the app" | Two things tried to open the database — usually running `db:seed:demo` or another command while the product is running | Stop the product first (Ctrl + C), run the command, start again |
| Meaning-based search shows as unavailable | The language model could not be downloaded | Check the internet connection and search again; or accept keyword-only search |
| An uploaded PDF shows "No selectable text was found" | It is a scan — pictures of pages | It is stored and can be downloaded, but cannot be searched yet. Text recognition is planned for Stage 4. If you have the original Word or PowerPoint file, upload that |
| "This file type … is not supported" or "The file type could not be recognised" on upload | The file is not what its name says, or is a type the product does not accept | Accepted: PDF, Word, PowerPoint, Excel, text, common image and video formats. The type is judged from the file's contents, not its name |
| "Older Office formats (.doc, .xls, .ppt) are not supported" | The file was saved in the pre-2007 Office format | Open it and use *Save as* to save it as .docx, .xlsx or .pptx |
| You cannot sign in | Wrong password, or eight wrong attempts in fifteen minutes | Wait fifteen minutes, or see section 11 |
| The page looks unstyled or broken after an update | The browser kept an old copy | Refresh with Ctrl + Shift + R (Cmd + Shift + R on a Mac) |

## 11. If you forget your password

**A team member:** an Administrator opens **Settings → Team**, expands the person's entry, and presses **Create password-reset link**. The link is shown once; send it to the person. It works once, for 24 hours, and lets them choose a new password.

**The only Administrator:** nobody inside the product can help, so recovery is done from the computer or server where the product is installed:

1. If you are using the built-in development database, stop the product first.
2. Run, with your own email address:

```bash
npm run admin:reset-link -- you@your-company.com
```

3. It prints a link. Start the product again if you stopped it, open the link, and choose a new password.

Anyone who can run that command already controls the installation, so it asks for no password — but it is written to the audit log like everything else.

**To change a password you do know:** **Settings → Your account**.

## 12. Updating to a newer version

1. Stop the product.
2. Replace the product's files with the new version — download the new ZIP and copy your `.data` folder and `.env.local` file across, or `git pull` if you use Git.
3. Run `npm install`, then `npm run dev`.

With the built-in database, any changes to the database's structure are applied automatically when the product starts, and updated research files are loaded as new dated versions without overwriting the old ones.

## 13. For developers: checking that everything works

```bash
npm run typecheck
```

```bash
npm run lint
```

```bash
npm test
```

```bash
npm run test:e2e
```

All four must pass before a change is described as working. The browser tests build the product and drive it in a real browser; they use their own separate database folder (`.data-e2e`) and do not touch your data.
