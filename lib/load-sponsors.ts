import { isAppwriteConfigured } from '@/lib/config';
import { isAppwriteRuntimeSupported } from '@/lib/appwrite-runtime';
import { fetchPublicSponsorsData } from '@/lib/public-sponsors-api';
import type { PublicProgramData, Sponsor, SponsorCategory } from '@/lib/types';

const APPWRITE_TIMEOUT_MS = 10000;

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

function fromProgramData(programData?: Pick<PublicProgramData, 'sponsorCategories' | 'sponsors'>): SponsorBundle | null {
  const categories = programData?.sponsorCategories;
  const sponsors = programData?.sponsors;

  if (!Array.isArray(categories) && !Array.isArray(sponsors)) {
    return null;
  }

  return {
    categories: categories || [],
    sponsors: sponsors || [],
  };
}

export async function loadConferenceSponsors(
  conferenceId: string,
  programData?: Pick<PublicProgramData, 'sponsorCategories' | 'sponsors'>
): Promise<SponsorBundle> {
  try {
    const fromProgram = fromProgramData(programData);
    if (fromProgram && (fromProgram.categories.length > 0 || fromProgram.sponsors.length > 0)) {
      return fromProgram;
    }

    try {
      const sponsorData = await fetchPublicSponsorsData();
      return {
        categories: sponsorData.categories || [],
        sponsors: sponsorData.sponsors || [],
      };
    } catch (publicError) {
      if (isAppwriteConfigured() && isAppwriteRuntimeSupported()) {
        try {
          const { apiService } = await import('@/lib/api-service');
          return await withTimeout(
            apiService.getConferenceSponsors(conferenceId),
            APPWRITE_TIMEOUT_MS,
            'Sponsors request timed out. Please try again.'
          );
        } catch {
          return { categories: [], sponsors: [] };
        }
      }

      if (fromProgram) {
        return fromProgram;
      }

      return { categories: [], sponsors: [] };
    }
  } catch {
    return { categories: [], sponsors: [] };
  }
}
