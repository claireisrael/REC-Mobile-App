import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/theme';
import type { Conference } from '@/lib/types';

type ThemeSectionProps = {
  conference: Conference;
};

export function ThemeSection({ conference }: ThemeSectionProps) {
  const router = useRouter();

  if (!conference.theme) return null;

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[`${colors.primary}18`, `${colors.accent}14`, colors.white]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.card}>
          <LinearGradient
            colors={[colors.primary, colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.topBar}
          />

          <View style={styles.badge}>
            <Ionicons name="flag-outline" size={14} color={colors.primary} />
            <Text style={styles.badgeText}>
              Conference Theme{conference.year ? ` ${conference.year}` : ''}
            </Text>
          </View>

          <Text style={styles.title}>{conference.theme}</Text>

          <View style={styles.divider} />

          <Text style={styles.body}>
            {conference.description ||
              'Join us as we bring together experts, innovators, policymakers, and stakeholders to discuss and advance the clean energy agenda.'}
          </Text>

          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => router.push('/about')}
          >
            <Text style={styles.buttonText}>Learn More About the Conference</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
    backgroundColor: colors.white,
  },
  gradient: {
    borderRadius: 18,
    padding: 2,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 22,
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${colors.primary}20`,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${colors.primary}10`,
    borderWidth: 1,
    borderColor: `${colors.primary}22`,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  divider: {
    width: 56,
    height: 4,
    borderRadius: 999,
    backgroundColor: colors.accent,
    marginTop: 14,
    marginBottom: 14,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.textMuted,
    textAlign: 'center',
  },
  button: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  buttonPressed: {
    opacity: 0.92,
    backgroundColor: colors.primaryDark,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
