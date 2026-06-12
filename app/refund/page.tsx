import type { Metadata } from 'next';
import LegalDoc from '@/components/LegalDoc';
import { EMAILS, LEGAL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'When and how Mitraa coin purchases can be refunded.',
};

const EFFECTIVE = '21 May 2026';
const UPDATED = '21 May 2026';

export default function RefundPage() {
  return (
    <LegalDoc title="Refund and Cancellation Policy" effectiveDate={EFFECTIVE} lastUpdated={UPDATED}>
      <p>
        This Refund and Cancellation Policy applies to coin purchases
        (&ldquo;recharges&rdquo;) made on the Mitraa website (processed by
        Razorpay) and, as described in Section&nbsp;2, in the Mitraa Android app
        (processed by Google Play Billing). It is part of, and should be read
        together with, our <a href="/terms/">Terms of Service</a>.
      </p>

      <h2>1. Coin purchases are generally non-refundable</h2>
      <p>Mitraa coins are a virtual in-app item. Once the purchase transaction is confirmed and the coins are credited to your wallet, the purchase is considered <strong>fulfilled and final</strong>. Coins are non-refundable and non-transferable except in the limited circumstances listed below.</p>

      <h2>2. Purchases made through Google Play</h2>
      <p>
        If you bought coins inside the Mitraa Android app installed from Google
        Play, your payment was processed by <strong>Google Play Billing</strong>.
        These purchases are subject to <strong>Google Play&apos;s refund
        policy</strong>, and you can request a refund directly from Google at{' '}
        <a href="https://support.google.com/googleplay/answer/2479637" rel="noopener noreferrer" target="_blank">
          support.google.com/googleplay
        </a>{' '}
        (typically within 48 hours of purchase) or by contacting us at{' '}
        <a href={`mailto:${EMAILS.support}`}>{EMAILS.support}</a> with your
        Google Play order ID (it begins with &ldquo;GPA.&rdquo;). Where Google
        refunds a purchase, the corresponding coins (including bonus coins) are
        removed from your wallet. The sections below apply to purchases made on
        our <strong>website</strong> via Razorpay; nothing in this policy limits
        any rights you have under Google Play&apos;s policies or applicable law.
      </p>

      <h2>3. When you may be eligible for a refund</h2>
      <p>We will consider a refund request only in the following cases:</p>
      <ul>
        <li><strong>Duplicate charge</strong> — the same recharge order was charged more than once due to a payment-gateway or technical error.</li>
        <li><strong>Failed delivery</strong> — your payment was successfully processed by Razorpay, but the coins were not credited to your wallet within 24&nbsp;hours and our support team is unable to reconcile the transaction.</li>
        <li><strong>Unauthorised transaction</strong> — a charge appears on your account that you did not authorise. You must report it within 7&nbsp;days, and we may require supporting evidence and may report the matter to law enforcement and the payment gateway.</li>
        <li><strong>Regulatory or legal requirement</strong> — where a refund is mandated by applicable Indian law.</li>
      </ul>

      <h2>4. When refunds will not be granted</h2>
      <ul>
        <li>You changed your mind after the recharge was completed.</li>
        <li>You did not use the coins within any particular timeframe.</li>
        <li>Your account was suspended or terminated for a violation of our <a href="/terms/">Terms of Service</a>.</li>
        <li>Coins were used to purchase, send, or receive gifts, or to pay for a call (whether the call connected or not, beyond what our system charges).</li>
        <li>The recipient host did not behave in a way you expected. Disputes about user behaviour should be raised through the in-app reporting flow, not the refund channel.</li>
        <li>Connectivity, device, or network issues on your side prevented you from enjoying the Service.</li>
      </ul>

      <h2>5. How to request a refund</h2>
      <p>
        Email <a href={`mailto:${EMAILS.support}`}>{EMAILS.support}</a> within{' '}
        <strong>7&nbsp;days</strong> of the disputed transaction with:
      </p>
      <ul>
        <li>your registered Mitraa phone number;</li>
        <li>the date and time of the transaction;</li>
        <li>the Razorpay order/payment ID for website purchases (visible on your bank/UPI statement), or the Google Play order ID beginning &ldquo;GPA.&rdquo; for app purchases;</li>
        <li>a short description of the issue.</li>
      </ul>

      <h2>6. Processing</h2>
      <ul>
        <li>We will acknowledge your request within <strong>2 business days</strong>.</li>
        <li>We aim to make a decision within <strong>7 business days</strong>. Complex cases involving the payment gateway or bank investigation may take up to 21 business days.</li>
        <li>Approved refunds for website purchases are reversed to the original payment method through Razorpay; the amount usually appears within 5&ndash;10 business days, depending on your bank or UPI provider. Refunds for Google Play purchases are issued by Google to your original Google Play payment method.</li>
        <li>If a refund is approved, the corresponding coins (including any bonus coins from the same purchase) are debited from your wallet. If the wallet does not have enough coins, the refund will be reduced proportionally.</li>
      </ul>

      <h2>7. Subscriptions and packs</h2>
      <p>Mitraa does not currently offer recurring subscriptions. If we introduce subscriptions in the future, the cancellation terms applicable to that subscription will be displayed at the time of purchase.</p>

      <h2>8. Chargebacks</h2>
      <p>If you initiate a chargeback through your bank or card issuer without first contacting our support team, we may suspend your account pending the outcome of the dispute. Chargebacks found to be without merit may result in account termination and forfeiture of any unused coins.</p>

      <h2>9. Host withdrawals</h2>
      <p>Host withdrawals (host payouts) are not subject to this policy. They are governed by Section 7 of the <a href="/terms/">Terms of Service</a> and the in-app withdrawal flow.</p>

      <h2>10. Contact</h2>
      <p>
        Support: <a href={`mailto:${EMAILS.support}`}>{EMAILS.support}</a><br />
        Grievance Officer: <a href={`mailto:${EMAILS.grievance}`}>{EMAILS.grievance}</a><br />
        Hours: {LEGAL.grievanceHours}
      </p>
    </LegalDoc>
  );
}
