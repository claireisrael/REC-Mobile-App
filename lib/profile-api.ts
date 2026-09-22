import AsyncStorage from '@react-native-async-storage/async-storage';

import { config } from './config';

const STORAGE_KEY = 'rec.networkingProfile.v1';

type ApiError = { error?: string };

export type NetworkingProfile = {
  id?: string | null;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  organization?: string;
  cardToken?: string;
  cardUrl?: string;
  isPublic?: boolean;
  registrantId?: string | null;
  updatedAt?: string | null;
};

export type ProfileSession = {
  email: string;
  profileToken: string;
  profile: NetworkingProfile | null;
};

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as T & ApiError;
  if (!response.ok) {
    throw new Error(data.error || 'Profile request failed');
  }
  return data;
}

async function getJson<T>(path: string, profileToken?: string): Promise<T> {
  const headers: Record<string, string> = {};
  if (profileToken) headers['X-Profile-Token'] = profileToken;
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    cache: 'no-store',
    headers,
  });
  const data = (await response.json().catch(() => ({}))) as T & ApiError;
  if (!response.ok) {
    throw new Error(data.error || 'Profile request failed');
  }
  return data;
}

async function putJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(body.profileToken ? { 'X-Profile-Token': String(body.profileToken) } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = (await response.json().catch(() => ({}))) as T & ApiError;
  if (!response.ok) {
    throw new Error(data.error || 'Profile request failed');
  }
  return data;
}

export async function loadProfileSession(): Promise<ProfileSession | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProfileSession;
    if (!parsed?.email || !parsed?.profileToken) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveProfileSession(session: ProfileSession): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export async function clearProfileSession(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export const profileApi = {
  start(email: string) {
    return postJson<{ status: string; email: string; message: string }>('/api/profile/start', {
      email,
    });
  },

  verify(email: string, otp: string) {
    return postJson<{
      status: string;
      email: string;
      profileToken: string;
      profile: NetworkingProfile;
    }>('/api/profile/verify', { email, otp });
  },

  getMe(email: string, profileToken: string) {
    const qs = new URLSearchParams({ email, profileToken });
    return getJson<{ profile: NetworkingProfile | null; email: string }>(
      `/api/profile/me?${qs.toString()}`,
      profileToken
    );
  },

  updateMe(
    email: string,
    profileToken: string,
    fields: {
      fullName: string;
      phone: string;
      address: string;
      organization?: string;
    }
  ) {
    return putJson<{ profile: NetworkingProfile; email: string }>('/api/profile/me', {
      email,
      profileToken,
      ...fields,
    });
  },
};

/** Mobile-only QR payload — contact card, no web page required. */
export function buildVCard(profile: {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  organization?: string;
}) {
  const escape = (value: string) =>
    String(value || '')
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');

  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escape(profile.fullName)}`,
    profile.organization ? `ORG:${escape(profile.organization)}` : null,
    `TEL;TYPE=CELL:${escape(profile.phone)}`,
    `EMAIL:${escape(profile.email)}`,
    `ADR;TYPE=HOME:;;${escape(profile.address)};;;;`,
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\n');
}
