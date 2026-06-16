import type { ImageSourcePropType } from 'react-native';

/**
 * Local hero background — replace with your own image:
 *   rec-mobile/assets/images/hero.jpg
 * (JPG or PNG; if PNG, change the require below to hero.png)
 *
 * When Appwrite is connected, conference.heroImageUrl from the API is used instead.
 */
const LOCAL_HERO_IMAGE = require('../assets/images/hero.jpg');

export function getHeroImageSource(remoteUrl?: string): ImageSourcePropType {
  if (remoteUrl) {
    return { uri: remoteUrl };
  }
  return LOCAL_HERO_IMAGE;
}
