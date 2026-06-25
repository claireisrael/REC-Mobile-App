import { useIsFocused } from '@react-navigation/native';
import { Platform, StatusBar as RNStatusBar, View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppStatusBar } from '@/components/layout/AppStatusBar';
import { colors } from '@/constants/theme';

type ScreenContainerProps = ViewProps & {
  /** Include top safe-area padding (use false only for full-bleed hero screens). */
  safeTop?: boolean;
  /** Status bar icon style while this screen is focused. */
  statusBarStyle?: 'light' | 'dark';
};

export function ScreenContainer({
  safeTop = true,
  statusBarStyle = 'dark',
  style,
  children,
  ...props
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const androidStatusBarHeight = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) : 0;
  const topInset = Math.max(insets.top, androidStatusBarHeight);

  return (
    <View style={[{ flex: 1, backgroundColor: colors.background }, style]} {...props}>
      {isFocused ? <AppStatusBar style={statusBarStyle} /> : null}
      {safeTop ? <View style={{ height: topInset, backgroundColor: colors.background }} /> : null}
      <View style={{ flex: 1 }}>{children}</View>
    </View>
  );
}
