'use client';

import { API } from './constants';
import { clearSession, getJwt } from './session';

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  issues?: unknown;
}

export class ApiFetchError extends Error {
  public readonly status: number;
  public readonly error: ApiError;
  constructor(status: number, error: ApiError) {
    super(error.message);
    this.status = status;
    this.error = error;
  }
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  authed?: boolean;
}

/**
 * Thin fetch wrapper for calling `api.mitraa.shop`. Throws ApiFetchError on
 * non-2xx. Adds Authorization header when authed=true (default) and a JWT
 * is present. On 401 it clears the session so the UI can redirect to /login.
 */
export async function apiFetch<T = unknown>(
  path: string,
  opts: ApiRequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, authed = true } = opts;

  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  if (authed) {
    const jwt = getJwt();
    if (jwt) headers['Authorization'] = `Bearer ${jwt}`;
  }

  const res = await fetch(`${API.baseUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'omit',
  });

  let json: { ok?: boolean; error?: ApiError; [k: string]: unknown } | null = null;
  const text = await res.text();
  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      // non-JSON response
    }
  }

  if (!res.ok) {
    const err: ApiError = json?.error ?? {
      code: 'UNKNOWN',
      message: `Request failed with status ${res.status}`,
    };
    if (res.status === 401) clearSession();
    throw new ApiFetchError(res.status, err);
  }

  return (json as T) ?? ({} as T);
}
