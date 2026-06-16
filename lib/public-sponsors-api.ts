import type { Conference, Sponsor, SponsorCategory } from './types';
import { config } from './config';

const PUBLIC_SPONSORS_TIMEOUT_MS = 15000;

export type PublicSponsorsData = {
  conference: Conference;
  categories: SponsorCategory[];
  sponsors: Sponsor[];
};

export async function fetchPublicSponsorsData(): Promise<PublicSponsorsData> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PUBLIC_SPONSORS_TIMEOUT_MS);

  try {
    const response = await fetch(`${config.apiBaseUrl}/api/sponsors/public`, {
      signal: controller.signal,
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Sponsors API is not available on this server yet.');
      }
      throw new Error(data.error || `Failed to fetch sponsors (${response.status})`);
    }

    return data as PublicSponsorsData;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('The sponsors request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
