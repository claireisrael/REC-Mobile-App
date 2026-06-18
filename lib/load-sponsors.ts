import { isAppwriteConfigured } from '@/lib/config';
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
    if (isAppwriteConfigured()) {
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

    if (publicError instanceof Error) {
      if (publicError.message.toLowerCase().includes('failed to fetch')) {
        throw new Error(
          'Could not reach the sponsors API. Deploy the latest rec-registration web app, or add Appwrite keys to rec-mobile/.env.'
        );
      }
      throw publicError;
    }

    throw new Error('Failed to fetch sponsors');
  }
}
