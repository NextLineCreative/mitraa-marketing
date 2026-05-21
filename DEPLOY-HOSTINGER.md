# Deploying the Mitraa marketing site to Hostinger (Node.js Web App)

The marketing site is a full **Next.js** app. We deploy it to Hostinger's
**Node.js Web App** runtime, which auto-builds from GitHub on every push.

You only do the setup below **once**. After that, every `git push` to
`mitraa-marketing` triggers a redeploy.

---

## Prerequisites

- Domain `mitraa.shop` is registered at Hostinger.
- A Hostinger plan that supports Node.js Web Apps (most paid plans do — Premium / Business / Cloud / VPS).
- The `mitraa-marketing` repo is public (it is) OR you'll grant Hostinger access to your GitHub account during the import step.

## One-time setup

### Step 1 — Start the Node.js Web App wizard
1. Sign in at **https://hpanel.hostinger.com**.
2. Open **Websites** (or **Hosting** depending on plan) → click **Deploy** / **Create web app** / **Add Website**.
3. Choose **Node.js Web App** (you've already seen this screen).
4. Click **Continue with GitHub** on the "Import Git repository" card.

### Step 2 — Authorise GitHub access
1. Hostinger redirects you to GitHub.
2. Click **Authorize Hostinger**.
3. Choose **Only select repositories** and pick `NextLineCreative/mitraa-marketing` (safer than granting all repos).
4. Click **Install & Authorize**.

### Step 3 — Configure the app
Hostinger should auto-detect Next.js. Confirm or set:

| Field             | Value                                                                |
|-------------------|----------------------------------------------------------------------|
| Repository        | `NextLineCreative/mitraa-marketing`                                  |
| Branch            | `main`                                                               |
| Root directory    | `/` (the repo root is the app root)                                  |
| Framework         | **Next.js**                                                          |
| Node version      | **20** (or the latest 20.x Hostinger offers)                         |
| Install command   | `npm ci` (preferred) or `npm install`                                |
| Build command     | `npm run build`                                                      |
| Start command     | `npm start`                                                          |
| Listen port       | Use the Hostinger-provided `$PORT` env (default — don't override)    |
| Environment vars  | (leave empty for now; we add `NEXT_PUBLIC_RAZORPAY_KEY_ID` in Phase 9) |

Hit **Deploy**.

The first deploy takes ~2–4 minutes (Hostinger clones, runs `npm ci`, then `next build`, then `npm start`). You'll see live logs.

### Step 4 — Attach the custom domain
1. Once the app is **Running**, Hostinger gives it a default URL like `xxx.hstn.me`.
2. In the Node.js Web App settings → **Domains** → **Attach a domain** → choose `mitraa.shop`.
3. Hostinger configures DNS automatically (it auto-edits the A record for `mitraa.shop` to point at the app's IP).
4. Hostinger auto-issues a Let's Encrypt SSL cert for `mitraa.shop`. This can take 5–15 min.
5. Optional: also attach `www.mitraa.shop` and set it to redirect to apex.

### Step 5 — Confirm everything

After ~10 min, all of these should return HTTP 200:

- `https://mitraa.shop/`
- `https://mitraa.shop/coins/`
- `https://mitraa.shop/privacy/`     ← the URL Firebase needs
- `https://mitraa.shop/terms/`
- `https://mitraa.shop/refund/`
- `https://mitraa.shop/login/`
- `https://mitraa.shop/wallet/`

---

## Ongoing updates

```bash
# Local
cd marketing
# edit code...
git add .
git commit -m "..."
git push origin main
```

Hostinger detects the push (via webhook GitHub installs during Step 2) and
redeploys automatically. Watch the build in **hPanel → (your app) → Deployments**.

Total time from `git push` to live: ~90 seconds.

---

## Environment variables for Phase 9 (Razorpay)

When Razorpay onboarding is done, add these in **hPanel → (your app) → Environment Variables**, then click **Redeploy** (or just push a commit):

| Key                              | Value                          |
|----------------------------------|--------------------------------|
| `NEXT_PUBLIC_API_URL`            | `https://api.mitraa.shop`      |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID`    | `rzp_live_xxxxx` (from Razorpay) |

The `/coins/` page automatically flips from "Coming soon" to a real buy
flow as soon as `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set.

---

## Troubleshooting

**Build fails with "Cannot find module 'next'":**
- Ensure Install command is `npm ci` or `npm install`, not just `npm`.

**Build succeeds but the app crashes on start:**
- Check the **Logs** tab. If you see `Error: listen EADDRINUSE`, you've hardcoded a port. The `start` script in this repo uses `next start` (no port flag), which respects Hostinger's `$PORT`.

**Domain attached but 404 or "Default page":**
- DNS may still be propagating. Wait 15 min and try in an incognito window.
- Double-check that the app status is **Running** (not Stopped or Crashed).

**`/privacy/` works but `/privacy` (no trailing slash) gives 308:**
- Expected. `next.config.js` sets `trailingSlash: true`. Hostinger / browsers handle the redirect transparently.

**Deploy webhook not firing on push:**
- Open **hPanel → (your app) → Settings → GitHub integration → Reconnect**.
- Or trigger a manual deploy from the **Deployments** tab.

---

## Why this is better than static + manual FTP

- No `npm run build` on your laptop before every change.
- No FTP credentials to manage.
- Built-in deploy history with one-click rollback.
- Full Next.js features available (server components, dynamic routes, server actions) — useful for Phase 9 when we add the buy flow.
- Same workflow you'll use for the admin panel later.
