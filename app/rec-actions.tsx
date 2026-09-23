import * as WebBrowser from 'expo-web-browser';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';
import { config } from '@/lib/config';

/**
 * Legacy route — opens the recommendations site in a full browser sheet
 * (same as the home badge), then returns. No in-app WebView.
 */
export default function RecActionsScreen() {
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await WebBrowser.openBrowserAsync(config.recommendationsUrl, {
          presentationStyle: WebBrowser.WebBrowserPresentationStyle.FULL_SCREEN,
          toolbarColor: '#054653',
          controlsColor: '#FFB803',
          enableBarCollapsing: true,
          showInRecents: true,
        });
      } finally {
        if (active) {
          if (router.canGoBack()) router.back();
          else router.replace('/');
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={styles.root}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
