import type { Conference } from '@/lib/types';

export function parseConferenceSocials(socialsJson?: string) {
  if (!socialsJson) return { googleMapsUrl: '' };

  try {
    const parsed = JSON.parse(socialsJson) as { googleMapsUrl?: string };
    return { googleMapsUrl: parsed.googleMapsUrl || '' };
  } catch {
    return { googleMapsUrl: '' };
  }
}

export function getVenueMapsUrl(conference: Pick<Conference, 'venue' | 'location' | 'socialsJson'>) {
  const { googleMapsUrl } = parseConferenceSocials(conference.socialsJson);
  if (googleMapsUrl) return googleMapsUrl;

  const query = encodeURIComponent(
    `${conference.venue || ''}${conference.location ? `, ${conference.location}` : ''}`.trim()
  );

  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function getAccommodationCopy(venue?: string) {
  if (venue) {
    return `The ${venue} offers on-site accommodation with special conference rates. Numerous hotels and guesthouses are also available within close proximity to the venue.`;
  }

  return 'A range of hotels and guesthouses are available near the conference venue to suit all budgets.';
}
