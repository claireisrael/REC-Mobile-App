import { config } from './config';

export type ExcursionPackage = {
  title: string;
  summary: string;
  duration: string;
  group: 'day' | 'multiday' | string;
  image: string;
  imageAlt?: string;
};

export type Excursion = {
  slug: string;
  status: string;
  publishedAt?: string | null;
  promotionStart: string;
  promotionEnd: string;
  endsAt: string;
  promoted?: boolean;
  conference?: { year?: number; title?: string; shortName?: string };
  content: {
    title: string;
    introduction: string;
    partnerName: string;
    partnerUrl: string;
    partnerLogo?: string;
    contactEmail?: string;
    contactPhone?: string;
    heroImage: string;
    heroAlt?: string;
    dateLabel: string;
    departure: string;
    planningNotes: string;
    placements: string[];
    packages: ExcursionPackage[];
    destinationMode?: string;
    destinationUrl?: string;
  };
};

function absoluteAssetUrl(path: string) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${config.apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export function isExcursionPromoted(excursion: Excursion | null | undefined, now = Date.now()) {
  if (!excursion?.publishedAt || excursion.status !== 'published') return false;
  const start = Date.parse(excursion.promotionStart);
  const end = Date.parse(excursion.promotionEnd);
  const endsAt = Date.parse(excursion.endsAt);
  if (Number.isNaN(start) || Number.isNaN(end) || Number.isNaN(endsAt)) return false;
  return start <= now && now < end && now < endsAt;
}

export function excursionEdition(excursion: Excursion) {
  if (excursion.conference?.year) {
    return `REC${String(excursion.conference.year).slice(-2)} & EXPO`;
  }
  return excursion.conference?.shortName || excursion.conference?.title || 'REC & EXPO';
}

export function partnerDestination(excursion: Excursion, source = 'direct') {
  try {
    const url = new URL(excursion.content.partnerUrl);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    url.searchParams.set('utm_source', 'rec-mobile');
    url.searchParams.set('utm_medium', 'referral');
    url.searchParams.set('utm_campaign', excursion.slug);
    url.searchParams.set('utm_content', source);
    return url.toString();
  } catch {
    return null;
  }
}

export function resolveExcursionImage(path: string) {
  return absoluteAssetUrl(path);
}

export async function fetchPromotedExcursion(): Promise<Excursion | null> {
  try {
    const response = await fetch(`${config.apiBaseUrl}/api/excursions`, { cache: 'no-store' });
    const data = (await response.json().catch(() => ({}))) as {
      documents?: Excursion[];
      unavailable?: boolean;
    };
    if (!response.ok || data.unavailable) return null;
    const docs = data.documents || [];
    return docs.find((item) => isExcursionPromoted(item)) || null;
  } catch {
    return null;
  }
}

export function excursionForPlacement(excursion: Excursion | null, placement: string) {
  if (!excursion) return null;
  if (!isExcursionPromoted(excursion)) return null;
  if (!excursion.content.placements?.includes(placement)) return null;
  return excursion;
}
