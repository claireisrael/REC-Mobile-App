import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { NrepLoader } from '@/components/ui/NrepLoader';
import { AppDataProvider, useAppData } from '@/context/AppDataContext';
import { colors } from '@/constants/theme';
import { StyleSheet, View } from 'react-native';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function AppShell() {
  const { loading } = useAppData();

  if (loading) {
    return (
      <View style={styles.bootScreen}>
        <NrepLoader fullScreen size={120} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="about" />
      <Stack.Screen name="session/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (fontError) {
      console.warn('Font load failed, continuing with system fonts.', fontError);
    }
  }, [fontError]);

  useEffect(() => {
    if (loaded || fontError) {
      SplashScreen.hideAsync().finally(() => setAppReady(true));
    }
  }, [loaded, fontError]);

  if (!appReady) {
    return (
      <View style={styles.bootScreen}>
        <NrepLoader fullScreen size={120} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <AppShell />
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
