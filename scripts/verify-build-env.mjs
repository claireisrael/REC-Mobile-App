import fs from 'node:fs/promises';

const required = [
  'EXPO_PUBLIC_APPWRITE_ENDPOINT',
  'EXPO_PUBLIC_APPWRITE_PROJECT_ID',
  'EXPO_PUBLIC_APPWRITE_DATABASE_ID',
  'EXPO_PUBLIC_APPWRITE_CONFERENCES_COLLECTION_ID',
  'EXPO_PUBLIC_APPWRITE_SPONSOR_CATEGORIES_COLLECTION_ID',
  'EXPO_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID',
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

const missing = required.filter((key) => !values[key]?.trim());

if (missing.length > 0) {
  console.error(
    'Build blocked: required Appwrite env vars are empty in .env:\n' +
      missing.map((key) => `  - ${key}`).join('\n') +
      '\n\nCheck GitHub secrets (ENDPOINT, PROJECT_ID, DATABASE, CONFERENCES, …) are set.'
  );
  process.exit(1);
}

console.log('Build env OK — required Appwrite keys present.');
