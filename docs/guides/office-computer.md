# Run it on an office computer — free

Your team uses the app through a free link from Cloudflare, while the app and all its data stay on one computer in your office. There is no monthly fee and no hosting account.

**Good for:** a pilot, or a small team. **The catch:** the computer must stay switched on and awake while people use the app. Also, the free link's address changes every time the app is restarted. For an address that never changes, see [section 8](#8-a-permanent-address-optional).

> **What was tested.** The start file was run end to end on Linux: backup, preparing the app, start-up and the built-in background work. The app was also tested with requests arriving the way a Cloudflare link delivers them: those were accepted, while requests from other websites were refused. **Not tested:** the Windows start file, and Cloudflare's program itself, which could not be installed in the test environment. If something does not work the first time, the messages in the window say why. Paste them to your AI assistant or developer.

---

## 1. What you need

| | |
|---|---|
| A computer that can stay on during working hours | Windows 10/11 or a Mac, with at least 8 GB of memory and 2 GB of free disk space. A desktop is better than a laptop that gets carried home |
| **Node.js** (free) | Download the "LTS" installer from [nodejs.org](https://nodejs.org) and accept the defaults |
| **Cloudflare's link program, `cloudflared`** (free, no account needed) | Installed once — see step 3 |
| The app's files | From GitHub — see step 2 |

## 2. Get the app's files

1. On GitHub, open the **ECOM-MASTER** repository and make sure the branch selector shows **main**.
2. Press the green **Code** button → **Download ZIP**.
3. Unzip it to a permanent place, for example `Documents\BrandIntelligence` (Windows) or `Documents/BrandIntelligence` (Mac). **Don't run it from the Downloads folder** or from inside the ZIP.

## 3. Install the Cloudflare link program — once

**Windows:** press Start, type *PowerShell*, press Enter, and type:

```bash
winget install --id Cloudflare.cloudflared
```

Close the window when it finishes.

**Mac:** this uses Homebrew, a free installer for Mac programs. If you don't have Homebrew, follow the one-line instruction on [brew.sh](https://brew.sh) first. Then, in *Terminal*, type:

```bash
brew install cloudflared
```

You can skip this step to begin with. The app then works on this computer only, and the start window explains how to add the link later.

## 4. Start the app

**Windows:** double-click **`start-office.cmd`** in the app's folder. If Windows shows *"Windows protected your PC"*, press **More info → Run anyway**.

**Mac:** double-click **`start-office.command`**. The first time, macOS may refuse to open it. If so, right-click (or Control-click) the file, choose **Open**, then confirm.

The start file then does everything on its own:

1. **The first time only,** it installs the app's components (a few minutes).
2. **Backs up your data** into the `backups` folder.
3. **Prepares the app** (1–2 minutes).
4. **Starts the app.** On Windows a second window opens for it; keep it open.
5. **Opens the free Cloudflare link.** Look in the window for an address like `https://word-word-word.trycloudflare.com`.

**Keep the windows open.** Closing them stops the app for everyone.

## 5. First time: set it up and invite the team

1. On the office computer, open **<http://localhost:3000>**.
2. Create your organisation and your Administrator account. Do this **before** you send the link to anyone.
3. Go to **Settings → Team** and create invitation links for your colleagues.
4. Send each colleague two things:
   - **the Cloudflare address**, so they can reach the app;
   - **their own invitation link**, with the start of the address changed to the Cloudflare one. The app writes invitation links with the address you're using on the office computer, so they begin `http://localhost:3000`. Replace that part with the Cloudflare address. For example, `http://localhost:3000/invite/abc…` becomes `https://word-word-word.trycloudflare.com/invite/abc…`.

   To avoid editing links, open the app on the office computer through the Cloudflare address instead of `localhost` before creating invitations. The links will then already be correct.
5. Everyone signs in with their own email and password.

## 6. Every day

- **Keep the computer awake.**
  - Windows: *Settings → System → Power* → set *Sleep* to **Never** while plugged in.
  - Mac: *System Settings → Displays → Advanced*, or *Energy*, → turn on **Prevent automatic sleeping when the display is off**.
- **Start the app automatically when the computer starts (optional).**
  - Windows: press **Windows key + R**, type `shell:startup`, press Enter, and put a shortcut to `start-office.cmd` in the folder that opens.
  - Mac: *System Settings → General → Login Items* → **+** → choose `start-office.command`.
- **After every restart, the Cloudflare address changes.** Copy the new one from the window and send it to the team, for example pinned in your team chat.

The app's background work, such as reading uploaded documents and retrying anything that failed, runs by itself every five minutes. **Automation** in the app shows *Built in · every 5 minutes*.

## 7. Backups

- **A backup is made automatically every time you start the app.** The 14 most recent are kept in the `backups` folder inside the app's folder; older ones are deleted.
- **Once a week, copy the `backups` folder somewhere safe** — your company's OneDrive, Google Drive or SharePoint. If the computer's disk fails, that copy is what you restore from.
- To make a backup at any other moment: close the app's windows first, then in a terminal opened in the app's folder type `npm run backup`.

**To restore a backup:**
1. Close the app's windows.
2. In the app's folder, rename `.data` to `.data-old`. On Windows, folders starting with a dot are visible; on a Mac, press Cmd + Shift + . in Finder to show them.
3. Copy the backup folder you want (for example `backups/backup_2026-11-27_09-00`) into the app's folder, and rename the copy to `.data`.
4. Start the app.
5. Once you're happy everything is there, delete `.data-old`.

## 8. A permanent address (optional)

The free *quick* link changes on every restart, and Cloudflare offers it with no guarantee that it stays up. For an address that never changes, such as `intelligence.your-company.com`, there are two routes:

- **Your company's domain is already managed in Cloudflare**, or can be moved there; Cloudflare's basic plan is free. Your IT team sets up a *named Cloudflare Tunnel* to this computer. It is the same `cloudflared` program, set up once with an account.
- **Or move to paid hosting** — about $15 a month — using the [deployment guide](deployment.md).

After switching to a permanent address, open the file `start-office.cmd` (or `start-office.command`) in a text editor. On the line `ALLOWED_ORIGINS=*.trycloudflare.com`, add your address after a comma, for example `*.trycloudflare.com,intelligence.your-company.com`.

## 9. Updating to a new version

1. Close the app's windows.
2. Download the new ZIP from GitHub (step 2) and unzip it to a **new** folder.
3. Copy the **`.data`** and **`backups`** folders from the old folder into the new one.
4. Double-click the start file in the new folder. Changes to the database's structure are applied automatically.
5. When everything works, delete the old folder.

## 10. Security — please read

- **All your brand information lives on this one computer.** Switch on disk encryption (Windows: *BitLocker* or *Device encryption*; Mac: *FileVault*). Use a computer that only trusted people can sign in to.
- **Anyone who has the Cloudflare address can reach the sign-in page.** They cannot see anything without an account, and accounts exist only by invitation. Still, share the address only inside the team.
- Every person has their own account. Never share one account between people: the audit log records who did what.
- When someone leaves, disable their account the same day (*Settings → Team*).

## 11. If something goes wrong

| What you see | What to do |
|---|---|
| "Node.js is not installed" | Install it from nodejs.org, then double-click the start file again |
| "The app is running. Stop it first, then run the backup again" | The app is already running, perhaps in another window. Close all its windows and start again |
| "Preparing the app failed" | Open `.office-build.log` in the app's folder and send its contents to your AI assistant or developer |
| "The app did not start" | Open `.office-app.log` in the app's folder; often port 3000 is already in use by another program |
| The team's link does not open | The link changes on every restart: check the newest address in the window. Make sure the computer is awake and the windows are open |
| Colleagues can open the app but saving or signing in fails | The address they use must be allowed. Check the `ALLOWED_ORIGINS` line in the start file (section 8) |
| A colleague forgot their password | *Settings → Team* → open their entry → **Create password-reset link**. Change the start of the link to the Cloudflare address, as in section 5 |
| You forgot the Administrator password | Close the app's windows. In a terminal in the app's folder type `npm run admin:reset-link -- you@company.com`, start the app, and open the printed link, with `http://localhost:3000` at the start |
