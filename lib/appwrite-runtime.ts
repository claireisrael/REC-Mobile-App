import Constants from 'expo-constants';

/**
 * Appwrite client init has caused standalone Android release builds to crash.
 * Keep it for Expo Go (dev); skip in installed APK until sponsors API is live.
 */
export function isAppwriteRuntimeSupported() {
  return Constants.executionEnvironment === 'storeClient';
}
