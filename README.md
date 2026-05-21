# mitraa-marketing

Public marketing + legal + (later) coin-purchase site for **Mitraa**.

Served at: `https://mitraa.shop`
GitHub Pages backup URL: `https://nextlinecreative.github.io/mitraa-marketing/` (301s to apex when CNAME is present)

## Pages

| File           | Path             | Purpose                                                 | Status     |
|----------------|------------------|---------------------------------------------------------|------------|
| `index.html`   | `/`              | Pre-launch landing                                       | Live       |
| `privacy.html` | `/privacy.html`  | Privacy Policy (IT Act, IT Rules 2021, DPDP-aware)       | Live       |
| `terms.html`   | `/terms.html`    | Terms of Service                                         | Live       |
| `refund.html`  | `/refund.html`   | Refund & Cancellation Policy (Razorpay-compliant)        | Live       |
| `coins.html`   | `/coins.html`    | Buy coins flow (placeholder until Razorpay lands)        | Coming soon|

## Required: fill in the placeholders

All pages contain `{{PLACEHOLDER}}` tokens that **must** be replaced before going live. Single source of truth → see `placeholders.json`. After editing, run:

```bash
node scripts/fill-placeholders.js   # writes the rendered pages in place
```

Tokens used across the site:

| Token                     | Suggested value                    | Where it appears |
|---------------------------|------------------------------------|------------------|
| `{{COMPANY_NAME}}`        | Your legally registered entity name | All pages — registered legal entity |
| `{{REGISTERED_ADDRESS}}`  | "12 Some Street, Bengaluru 560001" | Privacy, ToS, Refund — corporate address |
| `{{JURISDICTION_CITY}}`   | "Bengaluru" or "Mumbai"            | ToS — courts + arbitration seat |
| `{{CONTACT_EMAIL}}`       | "hello@mitraa.shop"                | Index — press/partnerships |
| `{{SUPPORT_EMAIL}}`       | "support@mitraa.shop"              | Index, Refund — user support |
| `{{PRIVACY_EMAIL}}`       | "privacy@mitraa.shop"              | Privacy — rights requests |
| `{{LEGAL_EMAIL}}`         | "legal@mitraa.shop"                | ToS — disputes |
| `{{GRIEVANCE_EMAIL}}`     | "grievance@mitraa.shop"            | Privacy, Refund — IT Act grievance officer |
| `{{GRIEVANCE_OFFICER_NAME}}` | Person responsible              | Privacy — section 16 |

Until DNS/email is set up at Hostinger for `mitraa.shop`, you can point all of these at one existing inbox (e.g. `optimalaiproduction@gmail.com`) and update later.

## Important legal note

These pages are **templates adapted for Mitraa**. Before going live with real users, **have an Indian lawyer review**, particularly:

- Section 5 of `terms.html` (virtual coins / RBI PPI framing)
- Section 7 of `terms.html` (host payouts, TDS, independent contractor)
- Section 16 of `terms.html` (arbitration seat and venue)
- Section 16 of `privacy.html` (grievance officer — required by law)

## Local preview

Just open the HTML files in a browser. No build step.

## Hosting

Plain static HTML / CSS / SVG — deploys to any static host.

**Currently configured:** GitHub Pages on this repo's `main` branch, with
`CNAME=mitraa.shop`. GH Pages serves the apex `https://mitraa.shop/` once the
DNS records (see below) are in place.

### DNS records at Hostinger (for `mitraa.shop`)

| Type  | Name | Value                          | TTL  |
|-------|------|--------------------------------|------|
| A     | `@`  | `185.199.108.153`              | 3600 |
| A     | `@`  | `185.199.109.153`              | 3600 |
| A     | `@`  | `185.199.110.153`              | 3600 |
| A     | `@`  | `185.199.111.153`              | 3600 |
| CNAME | `www`| `nextlinecreative.github.io.`  | 3600 |

After DNS propagates (5–60 min), GitHub auto-provisions HTTPS via Let's Encrypt.

## Coin purchase plan

See [COIN_PURCHASE.md](COIN_PURCHASE.md) for how `coins.html` upgrades from a
"coming soon" page to a real Razorpay buy flow in Phase 9.
