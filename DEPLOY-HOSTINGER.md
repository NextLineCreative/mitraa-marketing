# Deploying the Mitraa marketing site to Hostinger

We build the Next.js site locally into a static `out/` folder, then upload its
contents to your Hostinger hosting's `public_html/` directory.

## One-time prerequisites

1. You own `mitraa.shop` at Hostinger (already done).
2. You have a Hostinger hosting plan (Premium / Business / Cloud / VPS — any of them works for static files).
3. The domain `mitraa.shop` is "added" to that hosting plan inside hPanel:
   - Sign in at **https://hpanel.hostinger.com**
   - Open **Hosting → (your plan)**
   - Open **Domains → Add Domain**, enter `mitraa.shop`, complete the steps.
   - Hostinger will auto-configure the DNS A records pointing to the hosting server (this replaces the GitHub Pages records — if you already added the four `185.199.x.x` records, delete them).

## Step 1 — build locally

```bash
cd marketing
npm install           # only the first time
npm run build         # produces ./out/ with all static HTML/CSS/JS
```

After this `out/` looks like:

```
out/
├── index.html
├── 404.html
├── coins/index.html
├── privacy/index.html
├── terms/index.html
├── refund/index.html
├── login/index.html
├── wallet/index.html
├── favicon.svg
├── logo.svg
└── _next/...           # JS + CSS chunks
```

## Step 2 — upload to Hostinger

Three ways. Pick whichever is easiest.

### Option A — File Manager (easiest, no extra software)

1. hPanel → **Hosting** → your plan → **File Manager**.
2. Open `public_html/` (this is the document root for `mitraa.shop`).
3. Delete the default `default.php` / placeholder files if present.
4. Click **Upload** and select all contents of your local `marketing/out/` directory.
   - If the upload UI accepts folders, drag the whole `out/` contents in.
   - Otherwise, zip the contents of `out/` (NOT the `out` folder itself), upload the zip to `public_html/`, then right-click → **Extract**.
5. Verify `public_html/index.html` exists at the top level.
6. Browse to `https://mitraa.shop/` — site is live.

### Option B — SFTP / FTP

Hostinger gives you FTP credentials in **hPanel → Hosting → (plan) → Advanced → FTP Accounts**.

```bash
# Using rsync (Mac/Linux/WSL):
rsync -avz --delete marketing/out/ <ftp_user>@<ftp_host>:public_html/

# Or any FTP client (FileZilla, Cyberduck, WinSCP):
#   Host: <Hostinger FTP host>
#   User: <FTP username>
#   Pass: <FTP password>
#   Port: 21 (FTP) or 22 (SFTP)
#   Remote dir: /public_html/
```

### Option C — Hostinger CLI (only on VPS plans)

If you have a Hostinger VPS, SSH in and use `git pull` + `npm run build` directly on the server. Out of scope for this MVP.

## Step 3 — confirm

After upload, open these URLs in a browser. All should return HTTP 200:

- `https://mitraa.shop/`
- `https://mitraa.shop/coins/`
- `https://mitraa.shop/privacy/`     ← this is the URL Firebase needs
- `https://mitraa.shop/terms/`
- `https://mitraa.shop/refund/`
- `https://mitraa.shop/login/`       (placeholder; for Phase 9)
- `https://mitraa.shop/wallet/`      (placeholder; for Phase 9)

If you get **404** on `/coins/` but `/` works, your host doesn't auto-serve `index.html` from subdirectories — drop a small `.htaccess` at `public_html/.htaccess`:

```apache
DirectoryIndex index.html
RewriteEngine On

# 1) If path doesn't end with / and there's a matching .html, internally serve it
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]
```

(Apache 2.4 default on Hostinger Premium/Business does handle index.html in subdirs. This `.htaccess` is only needed if you see 404s.)

## Step 4 — SSL

Hostinger auto-issues a free Let's Encrypt SSL cert for `mitraa.shop` once the domain is linked to a hosting plan. If `https://` isn't working yet, in hPanel go to **Hosting → SSL/TLS** and click **Install free SSL** for `mitraa.shop`. Then enable **Force HTTPS**.

## Updating the site later

```bash
cd marketing
git pull
npm install     # if package.json changed
npm run build
# upload the new out/ over the old public_html/ contents
```

For convenience, the `npm run build` step creates the deploy-ready folder in
**~3 seconds**. Any change to text, prices, or pages = rebuild + re-upload.

## When Razorpay arrives (Phase 9)

Before building, set these env vars in your shell so the `/coins` page becomes
a real buy flow instead of "Coming soon":

```bash
NEXT_PUBLIC_API_URL=https://api.mitraa.shop NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx npm run build
```

Then re-upload `out/`. Nothing else changes.

## Why not auto-deploy via Hostinger's Git integration?

Hostinger has a "Git" feature in hPanel, but it only does `git pull` — not
`npm install && npm run build`. Since this site is Next.js, the build step is
required. So the workflow is: build on your laptop, upload the result.

If you want full automation later, options:
- Move from Hostinger shared hosting to **Hostinger VPS** + a small Node CI script.
- Switch the marketing site to **Vercel** (free; auto-builds on `git push`).
  Domain stays at Hostinger; only the DNS A record changes to point at Vercel.
