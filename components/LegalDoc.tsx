import type { ReactNode } from 'react';

interface LegalDocProps {
  title: string;
  effectiveDate: string;
  lastUpdated: string;
  children: ReactNode;
}

/** Shared wrapper for Privacy / Terms / Refund pages. */
export default function LegalDoc({ title, effectiveDate, lastUpdated, children }: LegalDocProps) {
  return (
    <main className="max-w-doc mx-auto px-6 pt-14 pb-20 doc-prose">
      <h1 className="text-[2.2rem] font-bold tracking-tight leading-tight mb-3">{title}</h1>
      <p className="text-text-dim text-sm pb-6 mb-8 border-b border-border">
        <strong>Effective date:</strong> {effectiveDate}<br />
        <strong>Last updated:</strong> {lastUpdated}
      </p>
      {children}
    </main>
  );
}
