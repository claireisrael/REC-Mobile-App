import { useEffect } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/constants/theme';
import { NREP_LOGO } from '@/lib/nrep-logo';

type NrepLoaderProps = {
  fullScreen?: boolean;
  size?: number;
};

export function NrepLoader({ fullScreen = false, size = 120 }: NrepLoaderProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1800, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <Animated.View style={[styles.spinner, { width: size, height: size }, spinStyle]}>
          <Image
            source={NREP_LOGO}
            style={{ width: size, height: size }}
            resizeMode="contain"
            accessibilityLabel="NREP logo"
          />
        </Animated.View>
      </View>
    );
  }

  return (
    <View style={styles.inline}>
      <Animated.View style={[styles.spinner, { width: size, height: size }, spinStyle]}>
        <Image
          source={NREP_LOGO}
          style={{ width: size, height: size }}
          resizeMode="contain"
          accessibilityLabel="NREP logo"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inline: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  spinner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
