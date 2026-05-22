'use client';

import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { type Auth, getAuth } from 'firebase/auth';

/**
 * Public Firebase web config for the Mitraa project (mitraa-f3829).
 * These are intentionally public values - apiKey is restricted server-side
 * by the authorised-domains list, NOT by being secret.
 */
const firebaseConfig = {
  apiKey: 'AIzaSyCAXE10OV0MyqEJ5Aq49w1e4spidjHQ0Z8',
  authDomain: 'mitraa-f3829.firebaseapp.com',
  projectId: 'mitraa-f3829',
  storageBucket: 'mitraa-f3829.firebasestorage.app',
  messagingSenderId: '939114128517',
  appId: '1:939114128517:web:7d82b1aa1d096bd7bcb5ec',
};

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (_app) return _app;
  const existing = getApps()[0];
  _app = existing ?? initializeApp(firebaseConfig);
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(getFirebaseApp());
  return _auth;
}
