import { Stack } from 'expo-router';
import type { ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text as RNText, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppDataProvider } from '@/context/AppDataContext';
import { ConnectInboxProvider } from '@/context/ConnectInboxContext';
import { ProfileProvider } from '@/context/ProfileContext';
import { RecChatbotHost } from '@/components/chatbot/RecChatbotHost';
import { ProfileSetupHost } from '@/components/profile/ProfileSetupHost';
import { colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={styles.errorScreen}>
      <RNText style={styles.errorTitle}>Something went wrong</RNText>
      <RNText style={styles.errorMessage}>{error.message}</RNText>
      <Pressable style={styles.retryButton} onPress={retry}>
        <RNText style={styles.retryText}>Try again</RNText>
      </Pressable>
    </View>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
  }, []);

  return (
    <SafeAreaProvider>
      <AppDataProvider>
        <ProfileProvider>
          <ConnectInboxProvider>
            <View style={styles.root}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="rec-actions" options={{ presentation: 'card' }} />
              </Stack>
              <ProfileSetupHost />
              <RecChatbotHost />
            </View>
          </ConnectInboxProvider>
        </ProfileProvider>
      </AppDataProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  errorScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.white,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  retryText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
});
