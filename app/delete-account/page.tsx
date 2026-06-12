import type { Metadata } from 'next';
import LegalDoc from '@/components/LegalDoc';
import { EMAILS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Delete Your Account',
  description: 'How to delete your Mitraa account and associated data.',
};

const EFFECTIVE = '12 June 2026';
const UPDATED = '12 June 2026';

export default function DeleteAccountPage() {
  return (
    <LegalDoc
      title="Delete Your Mitraa Account"
      effectiveDate={EFFECTIVE}
      lastUpdated={UPDATED}
    >
      <p>
        You can delete your Mitraa account and associated data at any time,
        with or without access to the app.
      </p>

      <h2>1. In the app</h2>
      <p>
        Open Mitraa and go to <strong>Settings &rarr; Account &rarr; Delete
        account</strong>. You will be asked to confirm; deletion starts
        immediately after confirmation.
      </p>

      <h2>2. Without the app</h2>
      <p>
        Email <a href={`mailto:${EMAILS.privacy}`}>{EMAILS.privacy}</a> from
        any address, stating your registered phone number. We will verify
        ownership of the account via a one-time password sent to that number,
        then process the deletion request.
      </p>

      <h2>3. What is deleted</h2>
      <p>
        Your profile, photos, bio, chat messages, and wallet are permanently
        removed within <strong>30 days</strong> of confirmation.
      </p>

      <h2>4. What is retained</h2>
      <ul>
        <li>
          Payment and payout records are retained for 7 years, as required by
          the Income Tax Act, 1961 and related regulations.
        </li>
        <li>Records subject to a valid legal hold are retained as required.</li>
        <li>
          Unused coins are forfeited on deletion and are not redeemable for
          cash.
        </li>
      </ul>

      <h2>5. Questions</h2>
      <p>
        Privacy: <a href={`mailto:${EMAILS.privacy}`}>{EMAILS.privacy}</a>
        <br />
        Grievance Officer:{' '}
        <a href={`mailto:${EMAILS.grievance}`}>{EMAILS.grievance}</a>
      </p>
    </LegalDoc>
  );
}
