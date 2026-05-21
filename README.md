# mitraa-marketing

Public marketing + legal site for **Mitraa**.

Served at: `https://mitraa.nextlinecreative.in`

## Pages

| File             | Path           | Purpose |
|------------------|----------------|---------|
| `index.html`     | `/`            | Home / pre-launch landing |
| `privacy.html`   | `/privacy.html`| Privacy Policy (IT Act, IT Rules 2021, DPDP-aware) |
| `terms.html`     | `/terms.html`  | Terms of Service |
| `refund.html`    | `/refund.html` | Refund & Cancellation Policy (Razorpay-compliant) |

## Required: fill in the placeholders

All four pages contain `{{PLACEHOLDER}}` tokens that **must** be replaced before going live.
Single source of truth → see `placeholders.json`. After editing, run:

```bash
node scripts/fill-placeholders.js   # writes the rendered pages in place
```

Tokens used across the site:

| Token                     | Example                            | Where it appears |
|---------------------------|------------------------------------|------------------|
| `{{COMPANY_NAME}}`        | "NextLine Creative Pvt. Ltd."      | All pages — registered legal entity |
| `{{REGISTERED_ADDRESS}}`  | "12 Some Street, Bengaluru 560001" | Privacy, ToS, Refund — corporate address |
| `{{JURISDICTION_CITY}}`   | "Bengaluru" or "Mumbai"            | ToS — courts + arbitration seat |
| `{{CONTACT_EMAIL}}`       | "hello@nextlinecreative.in"        | Index — press/partnerships |
| `{{SUPPORT_EMAIL}}`       | "support@nextlinecreative.in"      | Index, Refund — user support |
| `{{PRIVACY_EMAIL}}`       | "privacy@nextlinecreative.in"      | Privacy — DPIA / rights requests |
| `{{LEGAL_EMAIL}}`         | "legal@nextlinecreative.in"        | ToS — disputes |
| `{{GRIEVANCE_EMAIL}}`     | "grievance@nextlinecreative.in"    | Privacy, Refund — IT Act grievance officer |
| `{{GRIEVANCE_OFFICER_NAME}}` | "Kuldeep ..."                   | Privacy — section 16 |

Until DNS/email is set up, you can point everything at one address (e.g.
`optimalaiproduction@gmail.com` or `kuldeep@optimalrealty.in`). Final hosting
should give you proper `@nextlinecreative.in` mailboxes.

## Important legal note

These pages are **templates adapted for Mitraa**. Before going live with real
users, **have an Indian lawyer review**, particularly:

- Section 5 of `terms.html` (virtual coins / RBI PPI framing)
- Section 7 of `terms.html` (host payouts, TDS, independent contractor)
- Section 16 of `terms.html` (arbitration seat and venue)
- Section 16 of `privacy.html` (grievance officer — required by law)

## Local preview

Just open the HTML files in a browser. No build step.

## Hosting

This is plain static HTML/CSS/SVG and deploys anywhere:

- **GitHub Pages** — free, easy custom domain (CNAME + GH Pages settings)
- **Cloudflare Pages** — free, automatic SSL, fast global CDN
- **Netlify** — free, click-to-deploy, atomic deploys

DNS pointer needed at your registrar:
```
mitraa.nextlinecreative.in   CNAME   <provider host>
```
