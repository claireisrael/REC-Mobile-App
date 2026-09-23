import { fetchPublicProgramData } from '@/lib/public-program-api';
import type { PublicProgramData } from '@/lib/types';

const LOAD_TIMEOUT_MS = 20000;

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}

/**
 * Load conference program the same way as the web Program page:
 * `GET /api/program/public` (server-side Appwrite with published filters).
 *
 * Do not use client/guest Appwrite for sessions — guest permissions can hide
 * published sessions that the web API still returns.
 *
 * Sponsors stay on Appwrite via `loadConferenceSponsors` in AppDataContext.
 */
export async function loadProgramData(): Promise<PublicProgramData> {
  const data = await withTimeout(
    fetchPublicProgramData(),
    LOAD_TIMEOUT_MS,
    'Loading timed out. Check your internet connection and try again.'
  );

  return {
    conference: data.conference,
    program: data.program,
    sessions: data.sessions || [],
    timeBlocks: data.timeBlocks || [],
    sponsorCategories: data.sponsorCategories || [],
    sponsors: data.sponsors || [],
  };
}
