'use client';

/**
 * Tiny client-side session store. The app JWT received from
 * POST /api/auth/verify-otp lives in sessionStorage so it dies when the tab
 * closes. That's fine for the web flow - the mobile app stores it persistently.
 *
 * SSR-safe: every accessor checks `typeof window` first.
 */
const KEY = 'mitraa_jwt';
const USER_KEY = 'mitraa_user';

export interface SessionUser {
  id: string;
  phone: string;
  displayName: string | null;
  avatarUrl: string | null;
  isHost: boolean;
}

export function getJwt(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(KEY);
}

export function setJwt(jwt: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(KEY, jwt);
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function setUser(u: SessionUser): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(USER_KEY, JSON.stringify(u));
}

export function getUser(): SessionUser | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return Boolean(getJwt());
}
