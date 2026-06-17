import type { ConfigContext, ExpoConfig } from 'expo/config';

const version = process.env.APP_VERSION ?? '1.0.0';
const versionCode = Number(process.env.ANDROID_VERSION_CODE ?? '1');

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'REC',
  slug: 'rec-mobile',
  version,
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'recmobile',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'ug.nrep.rec',
    buildNumber: String(versionCode),
  },
  android: {
    package: 'ug.nrep.rec',
    versionCode,
    adaptiveIcon: {
      backgroundColor: '#FFFFFF',
      foregroundImage: './assets/images/android-icon-foreground.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-logo.png',
        resizeMode: 'contain',
        backgroundColor: '#FFFFFF',
        imageWidth: 150,
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  ...(process.env.EAS_PROJECT_ID
    ? {
        extra: {
          eas: {
            projectId: process.env.EAS_PROJECT_ID,
          },
        },
      }
    : {}),
});
