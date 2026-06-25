import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { colors } from '@/constants/theme';

export function LoadingState() {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
