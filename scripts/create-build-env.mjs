import fs from 'node:fs/promises';

const keys = [
  'EXPO_PUBLIC_API_BASE_URL',
  'EXPO_PUBLIC_APPWRITE_ENDPOINT',
  'EXPO_PUBLIC_APPWRITE_PROJECT_ID',
  'EXPO_PUBLIC_APPWRITE_DATABASE_ID',
  'EXPO_PUBLIC_APPWRITE_CONFERENCES_COLLECTION_ID',
  'EXPO_PUBLIC_APPWRITE_SESSIONS_COLLECTION_ID',
  'EXPO_PUBLIC_APPWRITE_PROGRAMS_COLLECTION_ID',
  'EXPO_PUBLIC_APPWRITE_PROGRAM_TIME_BLOCKS_COLLECTION_ID',
  'EXPO_PUBLIC_APPWRITE_SPONSOR_CATEGORIES_COLLECTION_ID',
  'EXPO_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID',
  'EXPO_PUBLIC_OFFLINE_MODE',
];

const defaults = {
  EXPO_PUBLIC_API_BASE_URL: 'https://rec.nrep.ug',
  EXPO_PUBLIC_APPWRITE_PROGRAM_TIME_BLOCKS_COLLECTION_ID: 'rec_program_time_blocks',
  EXPO_PUBLIC_APPWRITE_SPONSOR_CATEGORIES_COLLECTION_ID: 'rec_sponsor_categories',
  EXPO_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID: 'rec_sponsors',
  EXPO_PUBLIC_OFFLINE_MODE: 'false',
};

const lines = keys.map((key) => {
  const value = process.env[key] ?? defaults[key] ?? '';
  return `${key}=${value}`;
});

await fs.writeFile('.env', `${lines.join('\n')}\n`, 'utf8');
console.log('Wrote .env for build');
