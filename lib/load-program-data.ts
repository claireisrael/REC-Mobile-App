import { isAppwriteConfigured } from '@/lib/config';
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

async function loadFromAppwrite(): Promise<PublicProgramData> {
  const { apiService } = await import('@/lib/api-service');

  const conference = await apiService.getActiveConference();
  if (!conference) {
    throw new Error('No active conference found.');
  }

  const program = await apiService.getPublishedProgram(conference.$id);
  if (!program) {
    throw new Error('No published program is available yet.');
  }

  const [sessions, timeBlocks, sponsorData] = await Promise.all([
    apiService.getPublishedSessions(program.$id),
    apiService.getProgramTimeBlocks(program.$id),
    apiService.getConferenceSponsors(conference.$id),
  ]);

  return {
    conference,
    program,
    sessions,
    timeBlocks,
    sponsorCategories: sponsorData.categories,
    sponsors: sponsorData.sponsors,
  };
}

/**
 * Load conference data — Appwrite first (same as web home/sponsors pages),
 * web API only when Appwrite keys are not configured.
 */
export async function loadProgramData(): Promise<PublicProgramData> {
  if (isAppwriteConfigured()) {
    return withTimeout(
      loadFromAppwrite(),
      LOAD_TIMEOUT_MS,
      'Loading timed out. Check your internet connection and try again.'
    );
  }

  return fetchPublicProgramData();
}
