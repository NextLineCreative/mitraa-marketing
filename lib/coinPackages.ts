// Mirrors the backend `coin_packages` seed from migration 0006.
// Until Razorpay is wired in Phase 9, this is the source of truth for the /coins page.
// Once /api/coin-packages exists, swap this for a fetch + revalidation.

export interface CoinPackage {
  id: string;          // matches backend uuid once API is wired; placeholder string for now
  title: string;
  coins: number;
  bonusCoins: number;
  priceInr: number;
  badge?: string;
  sortOrder: number;
}

export const COIN_PACKAGES: CoinPackage[] = [
  { id: 'starter',  title: 'Starter Pack', coins:   100, bonusCoins:    0, priceInr:   99, sortOrder: 10 },
  { id: 'saver',    title: 'Saver Pack',   coins:   500, bonusCoins:   25, priceInr:  449, sortOrder: 20 },
  { id: 'popular',  title: 'Popular Pack', coins:  1200, bonusCoins:  100, priceInr:  999, sortOrder: 30, badge: 'Most Popular' },
  { id: 'power',    title: 'Power Pack',   coins:  2500, bonusCoins:  300, priceInr: 1999, sortOrder: 40, badge: 'Great Value' },
  { id: 'pro',      title: 'Pro Pack',     coins:  5500, bonusCoins:  800, priceInr: 3999, sortOrder: 50 },
  { id: 'ultra',    title: 'Ultra Pack',   coins: 12000, bonusCoins: 2000, priceInr: 7999, sortOrder: 60, badge: 'Best Value' },
];
