# Coin purchase — web flow

How `coins.html` upgrades from a "Coming soon" placeholder into a real Razorpay-backed buy flow once Phase 9 lands. **Pure static + vanilla JS** — no framework required.

## Two purchase paths in Mitraa

| Path                | Where               | Processor                  | Backend table updated         |
|---------------------|---------------------|----------------------------|-------------------------------|
| **In-app purchase** | Mitraa Android app  | Google Play Billing        | `transactions` + `wallets`    |
| **Web purchase**    | `mitraa.shop/coins.html` | Razorpay (cards / UPI / netbanking) | `transactions` + `wallets` |

Both end up writing to the same `transactions` and `wallets` tables. The user sees one combined balance.

## Architecture

```
  browser (coins.html)
      │
      │  1. user clicks "Buy 1,200 coins"
      ▼
  POST https://api.mitraa.shop/api/orders/create
      Authorization: Bearer <app JWT>
      Body:        { "packageId": "<uuid>" }
      │
      │  backend (Phase 9):
      │   - looks up coin_packages by id
      │   - creates a Razorpay order via Razorpay Orders API
      │   - inserts a pending row in `transactions`
      │   - returns { orderId, keyId, amount, currency, packageId }
      ▼
  Razorpay.open({ key: keyId, order_id: orderId, ... })   // checkout.js opens modal
      │
      │  user pays (UPI / card / netbanking)
      ▼
  Razorpay calls success handler in the browser with
  { razorpay_payment_id, razorpay_order_id, razorpay_signature }
      │
      ▼
  POST https://api.mitraa.shop/api/orders/verify
      Body: those three fields
      │
      │  backend:
      │   - HMAC-SHA256 verifies the signature
      │   - marks transaction = success, credits wallet
      │   - returns { ok, balanceCoins }
      ▼
  page updates UI ("1,200 coins added")

  In parallel:
  Razorpay → POST https://api.mitraa.shop/api/orders/webhook
      backend re-verifies signature; idempotent
      so even if the browser callback is lost, the payment lands.
```

## Files we add in Phase 9

| File                              | Purpose |
|-----------------------------------|---------|
| `coins-buy.js`                    | Browser side: fetches the order from `/api/orders/create`, opens Razorpay checkout, posts the result to `/api/orders/verify`, updates the UI. |
| `coins-auth.js`                   | Tiny helper: phone OTP via Firebase Auth web SDK, exchanges Firebase ID token for app JWT via `/api/auth/verify-otp`, stores it in `sessionStorage`. |
| `src/routes/orders.ts` (backend)  | `POST /api/orders/create`, `POST /api/orders/verify`, `POST /api/orders/webhook`. |
| `src/services/razorpay.ts` (backend) | Creates orders, verifies signatures, fetches payment status. |

## What stays the same

- All the markup in `coins.html` (`<article class="coin-card">` blocks).
- The `coin_packages` table seed in migration `0006`.
- The `transactions` and `wallets` schema.
- Auth model: same JWT the mobile app uses (already issued by `/api/auth/verify-otp`).

## Switching from "Coming soon" to "Buy"

1. Replace the disabled anchor `<a class="btn ..." aria-disabled="true">Coming soon</a>` with a real button:
   ```html
   <button class="btn btn-primary buy-btn" data-package-id="{{coin_package.id}}">
     Buy now
   </button>
   ```
2. Render the package id from the backend. Two options:
   - **Static build**: a small Node script that pulls `coin_packages` rows from the dev DB and bakes them into `coins.html` at build time.
   - **Dynamic JS**: on page load, `coins-buy.js` calls `GET /api/coin-packages` and renders the cards client-side.
   
   The dynamic JS path is cleaner once the API exists.
3. Uncomment the two `<script>` tags at the bottom of `coins.html`.

## Razorpay test mode → live mode

- During Phase 9 development we use Razorpay test keys (`rzp_test_*`). All transactions stay in their dashboard's Test mode.
- Going live needs:
  - KYC complete on the Razorpay dashboard
  - Activation of the account by Razorpay
  - Production keys (`rzp_live_*`) put into the backend `.env` via AWS Secrets Manager / EC2 env (never committed)
  - Webhook URL configured: `https://api.mitraa.shop/api/orders/webhook` with the webhook secret

## Why not Next.js?

Razorpay's checkout works as a script-tag import. The only backend interaction is two `fetch()` calls (`create` + `verify`). Adding React/Next adds 200+ KB and a deploy target change for ~50 lines of vanilla JS. We can revisit if the marketing site grows enough features to justify it (referral landing pages, blog, A/B testing).

## Auth on the web

Phone OTP works on the web with Firebase Auth's JS SDK. The user enters their phone, gets an SMS, enters the OTP, and the SDK returns a Firebase ID token. That token is exchanged for an app JWT via the existing `POST /api/auth/verify-otp` endpoint. Same model as the mobile app.
