import { StyleSheet, View } from 'react-native';

import { NrepLoader } from '@/components/ui/NrepLoader';
import { colors } from '@/constants/theme';

export function LoadingState() {
  return (
    <View style={styles.container}>
      <NrepLoader size={120} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
});
