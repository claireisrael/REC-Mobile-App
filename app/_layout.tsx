import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { NrepLoader } from '@/components/ui/NrepLoader';
import { AppDataProvider } from '@/context/AppDataContext';
import { colors } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

const BOOT_TIMEOUT_MS = 4000;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [bootReady, setBootReady] = useState(false);

  useEffect(() => {
    if (fontError) {
      console.warn('Custom font failed to load; using system fonts.', fontError);
    }
  }, [fontError]);

  useEffect(() => {
    let cancelled = false;

    const finishBoot = () => {
      if (!cancelled) {
        setBootReady(true);
      }
    };

    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().finally(finishBoot);
      return () => {
        cancelled = true;
      };
    }

    const timeout = setTimeout(() => {
      SplashScreen.hideAsync().finally(finishBoot);
    }, BOOT_TIMEOUT_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [fontsLoaded, fontError]);

  if (!bootReady) {
    return (
      <View style={styles.bootScreen}>
        <NrepLoader fullScreen size={120} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="about" />
          <Stack.Screen name="session/[id]" />
        </Stack>
      </AppDataProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  bootScreen: {
    flex: 1,
    backgroundColor: colors.white,
  },
});
