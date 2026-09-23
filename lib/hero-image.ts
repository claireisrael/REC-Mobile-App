import type { ImageSourcePropType } from 'react-native';

/** Live conference hero used when Appwrite has no heroImageUrl yet. */
export const FALLBACK_HERO_URL =
  'https://nrep.ug/wp-content/uploads/2026/03/DJI_0452.webp';

/**
 * Hero background from the API when available, otherwise the REC venue photo.
 */
export function getHeroImageSource(remoteUrl?: string | null): ImageSourcePropType {
  const url = remoteUrl?.trim() || FALLBACK_HERO_URL;
  return { uri: url };
}

export function hasHeroImage(remoteUrl?: string | null): boolean {
  return Boolean(remoteUrl?.trim() || FALLBACK_HERO_URL);
}
