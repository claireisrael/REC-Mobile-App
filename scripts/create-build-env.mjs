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

// GitHub secret names used in this repo (mapped to EXPO_PUBLIC_* in the workflow).
const githubSecretAliases = {
  EXPO_PUBLIC_APPWRITE_ENDPOINT: 'ENDPOINT',
  EXPO_PUBLIC_APPWRITE_PROJECT_ID: 'PROJECT_ID',
  EXPO_PUBLIC_APPWRITE_DATABASE_ID: 'DATABASE',
  EXPO_PUBLIC_APPWRITE_CONFERENCES_COLLECTION_ID: 'CONFERENCES',
  EXPO_PUBLIC_APPWRITE_SESSIONS_COLLECTION_ID: 'SESSIONS',
  EXPO_PUBLIC_APPWRITE_PROGRAMS_COLLECTION_ID: 'PROGRAMS',
  EXPO_PUBLIC_APPWRITE_PROGRAM_TIME_BLOCKS_COLLECTION_ID: 'TIME_BLOCKS',
  EXPO_PUBLIC_APPWRITE_SPONSOR_CATEGORIES_COLLECTION_ID: 'SPONSOR',
  EXPO_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID: 'SPONSORS_COLLECTION',
};

const defaults = {
  EXPO_PUBLIC_API_BASE_URL: 'https://rec.nrep.ug',
  EXPO_PUBLIC_APPWRITE_PROGRAM_TIME_BLOCKS_COLLECTION_ID: 'rec_program_time_blocks',
  EXPO_PUBLIC_APPWRITE_SPONSOR_CATEGORIES_COLLECTION_ID: 'rec_sponsor_categories',
  EXPO_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID: 'rec_sponsors',
  EXPO_PUBLIC_OFFLINE_MODE: 'false',
};

async function readExistingEnv() {
  try {
    const content = await fs.readFile('.env', 'utf8');
    return Object.fromEntries(
      content
        .split('\n')
        .filter((line) => line && !line.startsWith('#'))
        .map((line) => {
          const index = line.indexOf('=');
          return [line.slice(0, index), line.slice(index + 1)];
        })
    );
  } catch {
    return {};
  }
}

function resolveValue(key, existing) {
  const direct = process.env[key]?.trim();
  if (direct) return direct;

  const alias = githubSecretAliases[key];
  const fromAlias = alias ? process.env[alias]?.trim() : '';
  if (fromAlias) return fromAlias;

  const fromFile = existing[key]?.trim();
  if (fromFile) return fromFile;

  return defaults[key] || '';
}

const existing = await readExistingEnv();

const lines = keys.map((key) => `${key}=${resolveValue(key, existing)}`);

await fs.writeFile('.env', `${lines.join('\n')}\n`, 'utf8');
console.log('Wrote .env for build');
