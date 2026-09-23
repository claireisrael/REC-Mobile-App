import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

import { connectApi } from '@/lib/connect-api';

const STORAGE_KEY = 'rec.networkingProfile.v1';
const PHOTO_FILENAME = 'rec-profile-photo.jpg';

export type NetworkingProfile = {
  id?: string | null;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  organization?: string;
  /** Local file URI for profile photo on this device */
  photoUri?: string | null;
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
  photoUri?: string | null;
}): NetworkingProfile {
  const fullName = String(fields.fullName || '').trim();
  const email = normalizeEmail(fields.email);
  const phone = String(fields.phone || '').trim();
  const address = String(fields.address || '').trim();
  const organization = String(fields.organization || '').trim();

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
    photoUri: fields.photoUri || null,
    updatedAt: new Date().toISOString(),
  };
}

export function isProfileComplete(profile: NetworkingProfile | null | undefined): boolean {
  if (!profile) return false;
  return Boolean(
    String(profile.fullName || '').trim() &&
      String(profile.email || '').trim() &&
      String(profile.phone || '').trim() &&
      String(profile.address || '').trim()
  );
}

export async function loadProfileSession(): Promise<ProfileSession | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw) as ProfileSession;
  if (!parsed?.email || !parsed?.profile?.fullName) return null;
  return {
    email: parsed.email,
    profile: parsed.profile,
  };
}

function syncDirectory(profile: NetworkingProfile) {
  // Fire-and-forget — must never block local save / UI completion.
  void connectApi
    .upsertPerson({
      email: profile.email,
      fullName: profile.fullName,
      organization: profile.organization,
    })
    .catch(() => undefined);
}

export async function saveProfileSession(session: ProfileSession): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      email: session.email,
      profile: session.profile,
    })
  );
  syncDirectory(session.profile);
}

export async function clearProfileSession(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  try {
    const base = FileSystem.documentDirectory;
    if (!base) return;
    const path = `${base}${PHOTO_FILENAME}`;
    const info = await FileSystem.getInfoAsync(path);
    if (info.exists) await FileSystem.deleteAsync(path, { idempotent: true });
  } catch {
    // ignore
  }
}

/** Persist a picked image into app documents and return a stable local URI. */
export async function persistProfilePhoto(sourceUri: string): Promise<string> {
  const base = FileSystem.documentDirectory;
  if (!base) throw new Error('Storage unavailable');
  const dest = `${base}${PHOTO_FILENAME}`;
  await FileSystem.copyAsync({ from: sourceUri, to: dest });
  return `${dest}?t=${Date.now()}`;
}

/** Mobile-only: create/update profile on this device (no web API). */
export function saveLocalProfile(fields: {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  organization?: string;
  photoUri?: string | null;
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
