import AsyncStorage from '@react-native-async-storage/async-storage';

import { connectApi } from '@/lib/connect-api';

const STORAGE_KEY = 'rec.networkingProfile.v1';

export type NetworkingProfile = {
  id?: string | null;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  organization?: string;
  designation?: string;
  updatedAt?: string | null;
};

export type ProfileSession = {
  email: string;
  profile: NetworkingProfile;
};

function normalizeEmail(email: string) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

function validateProfile(fields: {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  organization?: string;
  designation?: string;
}): NetworkingProfile {
  const fullName = String(fields.fullName || '').trim();
  const email = normalizeEmail(fields.email);
  const phone = String(fields.phone || '').trim();
  const address = String(fields.address || '').trim();
  const organization = String(fields.organization || '').trim();
  const designation = String(fields.designation || '').trim();

  if (!email || !email.includes('@')) {
    throw new Error('A valid email is required');
  }
  if (!fullName) throw new Error('Name is required');
  if (!phone) throw new Error('Contact phone is required');
  if (!address) throw new Error('Address is required');

  return {
    id: email,
    fullName,
    email,
    phone,
    address,
    organization: organization || undefined,
    designation: designation || undefined,
    updatedAt: new Date().toISOString(),
  };
}

export async function loadProfileSession(): Promise<ProfileSession | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ProfileSession & { profileToken?: string };
    if (!parsed?.email || !parsed?.profile?.fullName) return null;
    return {
      email: parsed.email,
      profile: parsed.profile,
    };
  } catch {
    return null;
  }
}

export async function hasCompleteProfile(): Promise<boolean> {
  const session = await loadProfileSession();
  const p = session?.profile;
  return Boolean(p?.fullName && p?.email && p?.phone && p?.address);
}

export async function saveProfileSession(session: ProfileSession): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      email: session.email,
      profile: session.profile,
    })
  );

  // Best-effort: publish name/org/designation into Connect directory (Appwrite).
  try {
    await connectApi.upsertPerson({
      email: session.profile.email,
      fullName: session.profile.fullName,
      organization: session.profile.organization,
      designation: session.profile.designation,
    });
  } catch {
    // Local profile remains valid even if directory sync fails.
  }
}

export async function clearProfileSession(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

/** Mobile-only: create/update profile on this device (no web API). */
export function saveLocalProfile(fields: {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  organization?: string;
  designation?: string;
}): ProfileSession {
  const profile = validateProfile(fields);
  return { email: profile.email, profile };
}

export function getProfileInitials(fullName: string) {
  const parts = String(fullName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return 'ME';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

/** Mobile-only QR payload — contact card, no web page required. */
export function buildVCard(profile: {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  organization?: string;
  designation?: string;
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
    profile.designation ? `TITLE:${escape(profile.designation)}` : null,
    `TEL;TYPE=CELL:${escape(profile.phone)}`,
    `EMAIL:${escape(profile.email)}`,
    `ADR;TYPE=HOME:;;${escape(profile.address)};;;;`,
    'END:VCARD',
  ]
    .filter(Boolean)
    .join('\n');
}
