import fs from 'node:fs/promises';

const requiredForSponsors = [
  'EXPO_PUBLIC_APPWRITE_ENDPOINT',
  'EXPO_PUBLIC_APPWRITE_PROJECT_ID',
  'EXPO_PUBLIC_APPWRITE_DATABASE_ID',
  'EXPO_PUBLIC_APPWRITE_CONFERENCES_COLLECTION_ID',
];

const content = await fs.readFile('.env', 'utf8');
const values = Object.fromEntries(
  content
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    })
);

const missing = requiredForSponsors.filter((key) => !values[key]?.trim());

if (missing.length > 0) {
  console.warn(
    'Warning: some Appwrite env vars are empty (sponsors may not work in APK):\n' +
      missing.map((key) => `  - ${key}`).join('\n')
  );
} else {
  console.log('Build env OK — Appwrite keys present for sponsor fallback.');
}
