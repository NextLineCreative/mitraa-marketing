import type { Metadata } from 'next';
import LegalDoc from '@/components/LegalDoc';
import { EMAILS, LEGAL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Child Safety Standards',
  description:
    'Mitraa’s published standards against child sexual abuse and exploitation (CSAE).',
};

const EFFECTIVE = '12 June 2026';
const UPDATED = '12 June 2026';

export default function ChildSafetyPage() {
  return (
    <LegalDoc
      title="Child Safety Standards"
      effectiveDate={EFFECTIVE}
      lastUpdated={UPDATED}
    >
      <p>
        Mitraa is an <strong>18+ platform</strong> operated by{' '}
        <strong>{LEGAL.companyName}</strong>. We prohibit and have{' '}
        <strong>zero tolerance</strong> for child sexual abuse and exploitation
        (CSAE) in any form, including grooming, sextortion, and the creation,
        possession, or distribution of child sexual abuse material (CSAM).
      </p>

      <h2>1. Prevention</h2>
      <ul>
        <li>
          Every user must declare a date of birth confirming they are 18 or
          older before using the Service.
        </li>
        <li>
          Hosts undergo identity (KYC) verification, including
          government-issued identification and a verification selfie, before
          they can receive calls.
        </li>
        <li>
          Accounts reasonably believed to belong to minors are removed, and the
          associated identifiers are blocked from re-registering.
        </li>
      </ul>

      <h2>2. Detection and enforcement</h2>
      <ul>
        <li>
          Every profile, chat, and call can be <strong>reported</strong> in-app,
          and any user can be <strong>blocked</strong> at any time.
        </li>
        <li>
          Reports involving suspected CSAE are prioritised ahead of all other
          moderation work. The offending account is suspended immediately
          pending review.
        </li>
        <li>
          Confirmed material is preserved and reported to the relevant
          authorities, including law enforcement and statutory bodies in India,
          in accordance with applicable law.
        </li>
      </ul>

      <h2>3. Child safety contact</h2>
      <p>
        For child-safety concerns, contact{' '}
        <a href={`mailto:${EMAILS.grievance}`}>{EMAILS.grievance}</a>{' '}
        (Grievance Officer: {LEGAL.grievanceOfficerName},{' '}
        {LEGAL.registeredAddress}). We respond to child-safety escalations
        within 24 hours.
      </p>

      <h2>4. Legal compliance</h2>
      <p>
        Mitraa complies with the Information Technology Act, 2000 and the
        Information Technology (Intermediary Guidelines and Digital Media
        Ethics Code) Rules, 2021, and cooperates with lawful requests from law
        enforcement relating to child safety.
      </p>
    </LegalDoc>
  );
}
