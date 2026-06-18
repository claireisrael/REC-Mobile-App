import type { ImageSourcePropType } from 'react-native';

/**
 * Hero background from the API when available.
 * No local fallback image — bundled hero.jpg was corrupt and crashed release builds.
 */
export function getHeroImageSource(remoteUrl?: string): ImageSourcePropType | null {
  const url = remoteUrl?.trim();
  if (!url) return null;
  return { uri: url };
}

export function hasHeroImage(remoteUrl?: string): boolean {
  return Boolean(remoteUrl?.trim());
}
