# mitraa-marketing

Marketing + legal + (later) coin-purchase site for **Mitraa**.

Production: `https://mitraa.shop` — hosted on **Hostinger**.

Stack: **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS** → exported to plain static HTML/CSS/JS for any static host.

## Pages

| Route        | Source                          | Purpose                                                  |
|--------------|---------------------------------|----------------------------------------------------------|
| `/`          | `app/page.tsx`                  | Landing page (pre-launch)                                |
| `/coins/`    | `app/coins/`                    | Buy coins — locked "Coming soon" until Razorpay (Phase 9) |
| `/privacy/`  | `app/privacy/page.tsx`          | Privacy Policy (IT Act + DPDP-aware) — Firebase needs this URL |
| `/terms/`    | `app/terms/page.tsx`            | Terms of Service                                         |
| `/refund/`   | `app/refund/page.tsx`           | Refund Policy (Razorpay-compliant)                       |
| `/login/`    | `app/login/page.tsx`            | Phone OTP web login (placeholder for Phase 9)            |
| `/wallet/`   | `app/wallet/page.tsx`           | Wallet view (placeholder for Phase 9)                    |

## Local development

```bash
npm install
npm run dev        # http://localhost:4000
```

Hot reload, type checks, the works.

## Build

```bash
npm run build      # produces ./out with all static HTML/JS/CSS
```

The `out/` directory is the only thing you upload to Hostinger.

```bash
npm run serve:out  # local preview of the static export at http://localhost:4000
```

## Deployment

See **[DEPLOY-HOSTINGER.md](DEPLOY-HOSTINGER.md)** for step-by-step Hostinger upload instructions, DNS setup, and `.htaccess` notes.

## Folder layout

```
marketing/
├── app/                       # Next.js App Router pages
│   ├── layout.tsx              # site shell (Header + Footer)
│   ├── page.tsx                # /
│   ├── coins/{page,CoinsClient}.tsx
│   ├── privacy/page.tsx
│   ├── terms/page.tsx
│   ├── refund/page.tsx
│   ├── login/page.tsx
│   ├── wallet/page.tsx
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LegalDoc.tsx            # wrapper for privacy/terms/refund
│   └── CoinCard.tsx
├── lib/
│   ├── constants.ts            # SITE, LEGAL, EMAILS, API, RAZORPAY
│   └── coinPackages.ts         # mirrors backend seed
├── public/
│   ├── favicon.svg
│   └── logo.svg
├── next.config.js              # output: 'export', trailingSlash: true
├── tailwind.config.ts
├── postcss.config.mjs
├── tsconfig.json
└── package.json
```

## Configuration

All site-wide values live in [`lib/constants.ts`](./lib/constants.ts):

- `SITE.url`, `SITE.brand`, `SITE.tagline`
- `LEGAL.companyName`, `LEGAL.registeredAddress`, `LEGAL.jurisdictionCity`, `LEGAL.grievanceOfficerName`
- `EMAILS.contact`, `EMAILS.support`, `EMAILS.privacy`, `EMAILS.legal`, `EMAILS.grievance`
- `API.baseUrl` (defaults to `https://api.mitraa.shop`)
- `RAZORPAY.keyId` (read from `NEXT_PUBLIC_RAZORPAY_KEY_ID` build env)

### Required: fill these before going live

`lib/constants.ts` currently has placeholder strings prefixed with `__`:

| Constant                     | What to put                       |
|------------------------------|-----------------------------------|
| `LEGAL.companyName`          | Your registered entity, e.g. `Mitraa Technologies Pvt. Ltd.` |
| `LEGAL.grievanceOfficerName` | Real person's name (legally required by IT Rules 2021) |

Already locked in:
- `LEGAL.registeredAddress` → `312, World Tech Park, Gurgaon, Haryana`
- `LEGAL.jurisdictionCity`  → `Gurugram`
- All five `EMAILS.*` → `*@mitraa.shop`

## Important legal note

The Privacy Policy, ToS, and Refund Policy are **templates adapted for Mitraa**. Before going live with real users, **have an Indian lawyer review**, particularly:

- Section 5 of `app/terms/page.tsx` (virtual coins / RBI PPI framing)
- Section 7 of `app/terms/page.tsx` (host payouts, TDS, independent contractor)
- Section 16 of `app/terms/page.tsx` (arbitration seat and venue)
- Section 16 of `app/privacy/page.tsx` (grievance officer — legally required)

## Coin purchase plan

See [COIN_PURCHASE.md](COIN_PURCHASE.md) for how `/coins/` upgrades from a
"Coming soon" stub to a real Razorpay buy flow in Phase 9 — and why we
intentionally don't move the marketing site to a SSR host like Vercel.
