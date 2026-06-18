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

const BOOT_TIMEOUT_MS = 2500;

export default function RootLayout() {
  const [bootReady, setBootReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const finishBoot = () => {
      if (!cancelled) {
        setBootReady(true);
      }
    };

    SplashScreen.hideAsync().finally(finishBoot);

    const timeout = setTimeout(finishBoot, BOOT_TIMEOUT_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

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
