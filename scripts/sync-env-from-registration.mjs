import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mobileRoot = path.resolve(__dirname, '..');
const registrationEnv = path.resolve(mobileRoot, '../rec-registration/.env');
const mobileEnv = path.join(mobileRoot, '.env');

const mapping = [
  ['NEXT_PUBLIC_APPWRITE_ENDPOINT', 'EXPO_PUBLIC_APPWRITE_ENDPOINT'],
  ['NEXT_PUBLIC_APPWRITE_PROJECT_ID', 'EXPO_PUBLIC_APPWRITE_PROJECT_ID'],
  ['NEXT_PUBLIC_APPWRITE_DATABASE_ID', 'EXPO_PUBLIC_APPWRITE_DATABASE_ID'],
  ['NEXT_PUBLIC_APPWRITE_CONFERENCES_COLLECTION_ID', 'EXPO_PUBLIC_APPWRITE_CONFERENCES_COLLECTION_ID'],
  ['NEXT_PUBLIC_APPWRITE_SESSIONS_COLLECTION_ID', 'EXPO_PUBLIC_APPWRITE_SESSIONS_COLLECTION_ID'],
  ['NEXT_PUBLIC_APPWRITE_PROGRAMS_COLLECTION_ID', 'EXPO_PUBLIC_APPWRITE_PROGRAMS_COLLECTION_ID'],
  [
    'NEXT_PUBLIC_APPWRITE_PROGRAM_TIME_BLOCKS_COLLECTION_ID',
    'EXPO_PUBLIC_APPWRITE_PROGRAM_TIME_BLOCKS_COLLECTION_ID',
  ],
  [
    'NEXT_PUBLIC_APPWRITE_SPONSOR_CATEGORIES_COLLECTION_ID',
    'EXPO_PUBLIC_APPWRITE_SPONSOR_CATEGORIES_COLLECTION_ID',
  ],
  ['NEXT_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID', 'EXPO_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID'],
];

function parseEnv(content) {
  return Object.fromEntries(
    content
      .split('\n')
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=');
        return [line.slice(0, index), line.slice(index + 1)];
      })
  );
}

async function readEnvFile(filePath) {
  try {
    return parseEnv(await fs.readFile(filePath, 'utf8'));
  } catch {
    return null;
  }
}

const source = await readEnvFile(registrationEnv);
if (!source) {
  console.error('Could not find rec-registration/.env');
  console.error('Copy values from GitHub Secrets into rec-mobile/.env instead:');
  console.error('  ENDPOINT              → EXPO_PUBLIC_APPWRITE_ENDPOINT');
  console.error('  PROJECT_ID            → EXPO_PUBLIC_APPWRITE_PROJECT_ID');
  console.error('  DATABASE              → EXPO_PUBLIC_APPWRITE_DATABASE_ID');
  console.error('  CONFERENCES           → EXPO_PUBLIC_APPWRITE_CONFERENCES_COLLECTION_ID');
  console.error('  SESSIONS              → EXPO_PUBLIC_APPWRITE_SESSIONS_COLLECTION_ID');
  console.error('  PROGRAMS              → EXPO_PUBLIC_APPWRITE_PROGRAMS_COLLECTION_ID');
  console.error('  TIME_BLOCKS           → EXPO_PUBLIC_APPWRITE_PROGRAM_TIME_BLOCKS_COLLECTION_ID');
  console.error('  SPONSOR               → EXPO_PUBLIC_APPWRITE_SPONSOR_CATEGORIES_COLLECTION_ID');
  console.error('  SPONSORS_COLLECTION   → EXPO_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID');
  process.exit(1);
}

const existing = (await readEnvFile(mobileEnv)) || {};
const output = {
  EXPO_PUBLIC_API_BASE_URL: existing.EXPO_PUBLIC_API_BASE_URL || 'https://rec.nrep.ug',
  EXPO_PUBLIC_OFFLINE_MODE: existing.EXPO_PUBLIC_OFFLINE_MODE || 'false',
};

for (const [from, to] of mapping) {
  output[to] = source[from] || existing[to] || '';
}

const lines = Object.entries(output).map(([key, value]) => `${key}=${value}`);
await fs.writeFile(mobileEnv, `${lines.join('\n')}\n`, 'utf8');
console.log('Restored rec-mobile/.env from rec-registration/.env');
