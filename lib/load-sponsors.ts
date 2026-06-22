import { isAppwriteConfigured } from '@/lib/config';
import type { Sponsor, SponsorCategory } from '@/lib/types';

const APPWRITE_TIMEOUT_MS = 15000;

type SponsorBundle = {
  categories: SponsorCategory[];
  sponsors: Sponsor[];
};

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}

export async function loadConferenceSponsors(conferenceId: string): Promise<SponsorBundle> {
  if (!isAppwriteConfigured()) {
    throw new Error('Appwrite is not configured in this build.');
  }

  if (!conferenceId) {
    throw new Error('Conference ID is required to load sponsors.');
  }

  const { apiService } = await import('@/lib/api-service');
  return withTimeout(
    apiService.getConferenceSponsors(conferenceId),
    APPWRITE_TIMEOUT_MS,
    'Sponsors request timed out. Please try again.'
  );
}
