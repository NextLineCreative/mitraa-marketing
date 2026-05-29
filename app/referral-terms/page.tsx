import type { Metadata } from 'next';
import LegalDoc from '@/components/LegalDoc';
import { EMAILS, LEGAL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Referral Program Terms',
  description:
    'The rules of the Mitraa “Invite & Earn” referral program — eligibility, bonuses, and anti-abuse conditions.',
};

const EFFECTIVE = '29 May 2026';
const UPDATED = '29 May 2026';

export default function ReferralTermsPage() {
  return (
    <LegalDoc
      title="Referral Program Terms"
      effectiveDate={EFFECTIVE}
      lastUpdated={UPDATED}
    >
      <p>
        These Referral Program Terms (&ldquo;Referral Terms&rdquo;) govern the
        Mitraa <strong>&ldquo;Invite &amp; Earn&rdquo;</strong> program operated by{' '}
        <strong>{LEGAL.companyName}</strong> (&ldquo;Mitraa&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;). They are in addition to, and form part of, our{' '}
        <a href="/terms/">Terms of Service</a>. By sharing or applying a referral
        code, you agree to these Referral Terms. We may modify, suspend, or end the
        program at any time, as described below.
      </p>

      <h2>1. Eligibility</h2>
      <ul>
        <li>Participants (both the referrer and the invited user) must be at least <strong>18 years old</strong> and hold a valid, verified Mitraa account.</li>
        <li>Each invited user must be a <strong>genuine, new</strong> user who has never previously registered on Mitraa with the same phone number, device, or identity.</li>
        <li>A user may apply only <strong>one</strong> referral code, and only within the eligibility window shown in the app after sign-up.</li>
        <li>You may not refer yourself or apply your own code.</li>
      </ul>

      <h2>2. How rewards work</h2>
      <p>
        Rewards are paid in <strong>Mitraa coins</strong> (a virtual in-app item)
        and are credited only after the invited user completes their{' '}
        <strong>first successful coin recharge</strong>. Current rewards are:
      </p>
      <ul>
        <li><strong>Regular users (referrer):</strong> a bonus for each invited user who completes their first recharge.</li>
        <li><strong>Hosts (referrer):</strong> a single, <strong>one-time</strong> bonus paid on the first successful referral. Hosts do not earn a separate bonus for every subsequent referral.</li>
        <li><strong>Invited user:</strong> a one-time joining bonus credited on their first recharge. The amount may differ depending on whether they were invited by a host or a regular user.</li>
      </ul>
      <p>
        The exact coin amounts are displayed in the app on the Invite &amp; Earn
        screen and are <strong>subject to change at our discretion</strong>. The
        amounts shown at the time a reward is credited are final.
      </p>

      <h2>3. Nature of coins</h2>
      <ul>
        <li>Coins are a virtual in-app item. They are <strong>not money</strong>, have <strong>no cash value</strong>, and cannot be redeemed by users for cash except, for eligible hosts, through the standard payout process described in our <a href="/terms/">Terms of Service</a>.</li>
        <li>Referral coins are non-transferable except as part of normal in-app use, and may <strong>expire or be revoked</strong> if your account is closed, suspended, or found in violation of these Referral Terms.</li>
      </ul>

      <h2>4. Prohibited conduct &amp; anti-abuse</h2>
      <p>The following are strictly prohibited and will void any rewards:</p>
      <ul>
        <li>Creating fake, duplicate, or multiple accounts to claim referral rewards (&ldquo;self-referral&rdquo; or &ldquo;farming&rdquo;).</li>
        <li>Using bots, scripts, emulators, or automation to generate sign-ups or recharges.</li>
        <li>Sharing codes through spam, misleading claims, paid advertising that impersonates Mitraa, or any unlawful channel.</li>
        <li>Colluding to make recharges solely to trigger rewards with the intent of reversing, disputing, or charging back the payment.</li>
        <li>Any attempt to manipulate, exploit, or circumvent the program or its limits.</li>
      </ul>

      <h2>5. Verification, caps &amp; clawback</h2>
      <ul>
        <li>All rewards are subject to verification. We may delay or withhold rewards while we review activity for fraud or abuse.</li>
        <li>We may set caps on the number of referrals or the total coins that can be earned in any period, and may apply additional limits without notice.</li>
        <li>If a recharge that triggered a reward is later <strong>refunded, reversed, or charged back</strong>, or if we determine a reward was obtained through prohibited conduct, we may <strong>reverse the reward</strong>, deduct the corresponding coins from any account involved, and take action under our Terms of Service (including suspension or termination).</li>
      </ul>

      <h2>6. Taxes</h2>
      <p>
        You are solely responsible for any taxes arising from rewards you receive,
        where applicable. For hosts, payouts remain subject to the tax and KYC
        provisions of our <a href="/terms/">Terms of Service</a>.
      </p>

      <h2>7. Changes &amp; termination of the program</h2>
      <p>
        We may change the reward amounts, eligibility, caps, or any other aspect of
        the program, or suspend or discontinue the program entirely, at any time and
        at our sole discretion, without liability. Changes take effect when posted in
        the app or on this page.
      </p>

      <h2>8. General</h2>
      <p>
        Our decision on all matters relating to the program — including eligibility,
        reward calculation, and abuse — is final. These Referral Terms are governed
        by the laws of India, and disputes are subject to the jurisdiction and
        dispute-resolution provisions of our <a href="/terms/">Terms of Service</a>.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about the referral program? Write to{' '}
        <a href={`mailto:${EMAILS.support}`}>{EMAILS.support}</a>.
      </p>

      <p className="text-text-muted">
        This document is a template adapted for Mitraa. Before going live, please
        have it reviewed by a qualified Indian lawyer, particularly the sections on
        virtual coins, clawback, and tax.
      </p>
    </LegalDoc>
  );
}
