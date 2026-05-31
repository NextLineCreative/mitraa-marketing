'use client';

// Public status page client. Polls the backend's PUBLIC, never-gated
// /api/app/status endpoint (whitelisted in the maintenance gate) every 30s.
//
//   - 200 + maintenance.enabled=false  -> all systems operational
//   - 200 + maintenance.enabled=true   -> mobile app under maintenance
//                                         (website + admin stay operational)
//   - network error / non-200          -> degraded (can't reach the API)
//
// Maintenance only affects the mobile app, so the Website + Admin Panel rows
// stay "Operational" even while the app is down — which is the whole point of
// the new scoping.

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { API, SITE } from '@/lib/constants';

type Health = 'loading' | 'operational' | 'maintenance' | 'degraded';

interface State {
  overall: Health;
  message: string | null;
  etaIso: string | null;
  checkedAt: Date | null;
}

const POLL_MS = 30_000;

const META: Record<Health, { label: string; dot: string; text: string; ring: string }> = {
  loading: { label: 'Checking…', dot: 'bg-text-muted', text: 'text-text-dim', ring: 'ring-text-muted/30' },
  operational: { label: 'Operational', dot: 'bg-emerald-400', text: 'text-emerald-400', ring: 'ring-emerald-400/30' },
  maintenance: { label: 'Under maintenance', dot: 'bg-amber-400', text: 'text-amber-400', ring: 'ring-amber-400/30' },
  degraded: { label: 'Degraded', dot: 'bg-red-400', text: 'text-red-400', ring: 'ring-red-400/30' },
};

function StatusDot({ health }: { health: Health }) {
  const m = META[health];
  return (
    <span className="relative inline-flex h-3 w-3 shrink-0">
      {(health === 'operational' || health === 'maintenance') && (
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${m.dot} opacity-60`} />
      )}
      <span className={`relative inline-flex h-3 w-3 rounded-full ${m.dot}`} />
    </span>
  );
}

function ComponentRow({ name, desc, health }: { name: string; desc: string; health: Health }) {
  const m = META[health];
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4 border-b border-border last:border-b-0">
      <div className="min-w-0">
        <p className="font-semibold text-text">{name}</p>
        <p className="text-sm text-text-dim truncate">{desc}</p>
      </div>
      <div className={`flex items-center gap-2 shrink-0 rounded-full px-3 py-1.5 ring-1 ${m.ring}`}>
        <StatusDot health={health} />
        <span className={`text-sm font-semibold ${m.text}`}>{m.label}</span>
      </div>
    </div>
  );
}

export default function StatusClient() {
  const [s, setS] = useState<State>({ overall: 'loading', message: null, etaIso: null, checkedAt: null });

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`${API.baseUrl}/api/app/status`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const m = (data && data.maintenance) || {};
      setS({
        overall: m.enabled ? 'maintenance' : 'operational',
        message: typeof m.message === 'string' ? m.message : null,
        etaIso: typeof m.etaIso === 'string' ? m.etaIso : null,
        checkedAt: new Date(),
      });
    } catch {
      setS((prev) => ({ ...prev, overall: 'degraded', checkedAt: new Date() }));
    }
  }, []);

  useEffect(() => {
    void refresh();
    const id = setInterval(() => void refresh(), POLL_MS);
    return () => clearInterval(id);
  }, [refresh]);

  const { overall } = s;

  // Per-component states. Maintenance is mobile-only; website + admin never go
  // down for it. If we can't reach the API at all, mark API + dependent rows
  // degraded but keep Website (you're viewing it) operational.
  const mobile: Health = overall === 'loading' ? 'loading' : overall;
  const api: Health = overall;
  const website: Health = 'operational';
  const admin: Health = overall === 'degraded' ? 'degraded' : 'operational';

  const headline =
    overall === 'maintenance'
      ? 'Mitraa is under maintenance'
      : overall === 'degraded'
        ? 'We’re looking into a service issue'
        : overall === 'loading'
          ? 'Checking current status…'
          : 'All systems operational';

  const sub =
    overall === 'maintenance'
      ? s.message || 'The mobile app is temporarily unavailable while we ship an upgrade. The website and your account data are safe.'
      : overall === 'degraded'
        ? 'We couldn’t reach our status service just now. This page keeps retrying automatically.'
        : overall === 'loading'
          ? 'Fetching the latest status from our servers.'
          : 'Everything is running normally. Enjoy Mitraa!';

  const banner = META[overall];

  return (
    <main className="mx-auto max-w-3xl px-5 pt-28 pb-24 sm:pt-32">
      <p className="section-eyebrow">System status</p>

      {/* Overall banner */}
      <div className={`grad-card mt-3 p-6 sm:p-8`}>
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <StatusDot health={overall} />
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
              {headline}
            </h1>
            <p className="mt-2 text-text-dim leading-relaxed">{sub}</p>

            {overall === 'maintenance' && <EtaPill etaIso={s.etaIso} />}
          </div>
        </div>
      </div>

      {/* Component breakdown */}
      <h2 className="mt-10 mb-3 text-sm font-bold uppercase tracking-[0.16em] text-text-dim">
        Components
      </h2>
      <div className="glass rounded-2xl overflow-hidden">
        <ComponentRow name="Mobile App" desc="iOS & Android calling app" health={mobile} />
        <ComponentRow name="Website" desc="mitraa.shop & coin purchases" health={website} />
        <ComponentRow name="Admin Panel" desc="Internal operations console" health={admin} />
        <ComponentRow name="API & Realtime" desc="Calls, chat, wallet, sockets" health={api} />
      </div>

      {/* Footer / meta */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm text-text-muted">
          {s.checkedAt
            ? `Last checked ${s.checkedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · auto-refreshes every 30s`
            : 'Checking…'}
        </p>
        <div className="flex items-center gap-3">
          <button onClick={() => void refresh()} className="btn btn-ghost py-2 px-4 text-sm">
            Refresh now
          </button>
          <Link href="/" className="btn btn-primary py-2 px-4 text-sm">
            Back to {SITE.brand}
          </Link>
        </div>
      </div>

      <p className="mt-10 text-center text-xs text-text-muted">
        Need help? Email{' '}
        <a className="text-brand hover:underline" href="mailto:support@mitraa.shop">
          support@mitraa.shop
        </a>
      </p>
    </main>
  );
}

function EtaPill({ etaIso }: { etaIso: string | null }) {
  if (!etaIso) return null;
  const d = new Date(etaIso);
  if (Number.isNaN(d.getTime())) return null;
  const past = d.getTime() < Date.now();
  const label = past
    ? 'Expected back online any minute now'
    : `Expected back online by ${d.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}`;
  return (
    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-400/15 ring-1 ring-amber-400/40 px-3.5 py-1.5">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-amber-400">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className="text-sm font-semibold text-amber-300">{label}</span>
    </div>
  );
}
