# Coin purchase — web flow

How the `/coins/` page upgrades from a "Coming soon" placeholder into a real Razorpay-backed buy flow once Phase 9 lands.

## Two purchase paths in Mitraa

| Path                | Where                       | Processor                  | Backend table updated         |
|---------------------|-----------------------------|----------------------------|-------------------------------|
| **In-app purchase** | Mitraa Android app          | Google Play Billing        | `transactions` + `wallets`    |
| **Web purchase**    | `mitraa.shop/coins/`        | Razorpay (cards / UPI / netbanking) | `transactions` + `wallets` |

Both end up writing to the same `transactions` and `wallets` tables. The user sees one combined balance.

## Architecture

```
  browser (/coins/ React page)
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

## What's already in place

The `/coins/` route is structured to flip from "Coming soon" to "Buy now" with **zero markup changes**:

- [`app/coins/page.tsx`](./app/coins/page.tsx) — server component with metadata (`<title>`, OG, description).
- [`app/coins/CoinsClient.tsx`](./app/coins/CoinsClient.tsx) — client component that already contains the complete fetch-create-open-verify flow. The `handleBuy()` function is fully written.
- [`components/CoinCard.tsx`](./components/CoinCard.tsx) — branches on `COIN_PURCHASE_ENABLED` to render either a disabled "Coming soon" CTA or a real `<button>` wired to `onBuy(pack)`.
- [`lib/constants.ts`](./lib/constants.ts) — `COIN_PURCHASE_ENABLED` flips to `true` automatically as soon as `NEXT_PUBLIC_RAZORPAY_KEY_ID` is present at build time.
- [`lib/coinPackages.ts`](./lib/coinPackages.ts) — mirrors the backend `coin_packages` seed from migration 0006.

## What to add in Phase 9

| Where                                 | What |
|---------------------------------------|------|
| `marketing/app/layout.tsx`            | Add the Razorpay checkout.js `<script>` tag (or inject it on the `/coins/` page only) |
| `marketing/app/login/page.tsx`        | Replace placeholder with Firebase Web SDK phone-OTP flow; on success store the app JWT |
| `marketing/lib/api.ts` (new)          | Tiny `fetchAuthed()` helper that adds `Authorization: Bearer <jwt>` to backend requests |
| `marketing/app/wallet/page.tsx`       | Replace placeholder with `GET /api/wallet` rendering + "Top up" CTA |
| `backend/src/routes/orders.ts` (new)  | `POST /api/orders/create`, `POST /api/orders/verify`, `POST /api/orders/webhook` |
| `backend/src/services/razorpay.ts` (new) | Creates orders, verifies HMAC signatures, fetches payment status |
| Hostinger build env                   | Set `NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx` before running `npm run build`. The page auto-flips to live mode. |

## What stays the same

- All the JSX in `app/coins/page.tsx` and `CoinCard.tsx`.
- The `coin_packages` table seed in backend migration `0006`.
- The `transactions` and `wallets` schema.
- Auth model: same JWT the mobile app uses (already issued by `/api/auth/verify-otp`).

## Razorpay test mode → live mode

- During Phase 9 development we use Razorpay test keys (`rzp_test_*`). All transactions stay in their dashboard's Test mode.
- Going live needs:
  - KYC complete on the Razorpay dashboard
  - Activation of the account by Razorpay
  - Production keys (`rzp_live_*`) put into the build env (never committed)
  - Webhook URL configured: `https://api.mitraa.shop/api/orders/webhook` with the webhook secret
