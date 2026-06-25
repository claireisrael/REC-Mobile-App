import { Image, Pressable, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const CHATBOT_LOGO = require('@/assets/images/NREP-AI.png');

type RecChatbotFabProps = {
  onPress: () => void;
  visible?: boolean;
};

export function RecChatbotFab({ onPress, visible = true }: RecChatbotFabProps) {
  const swing = useSharedValue(0);

  useEffect(() => {
    swing.value = withRepeat(
      withSequence(
        withTiming(6, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(-6, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, [swing]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${swing.value}deg` }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.wrap, animatedStyle]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Open REC Assistant"
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Image source={CHATBOT_LOGO} style={styles.logo} resizeMode="cover" />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    zIndex: 100,
  },
  button: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#5BAD4E',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
    overflow: 'hidden',
  },
  buttonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.97 }],
  },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
});
