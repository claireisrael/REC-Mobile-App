import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';

type ScreenContainerProps = ViewProps & {
  /** Include top safe-area padding (use false for full-bleed hero screens). */
  safeTop?: boolean;
};

export function ScreenContainer({
  safeTop = true,
  style,
  children,
  ...props
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        { flex: 1, backgroundColor: colors.background },
        safeTop && { paddingTop: insets.top },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
