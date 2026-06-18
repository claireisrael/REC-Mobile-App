import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/theme';
import { routes } from '@/lib/routes';
import type { Conference } from '@/lib/types';

type HomeCtaSectionProps = {
  conference: Conference;
};

export function HomeCtaSection({ conference }: HomeCtaSectionProps) {
  const router = useRouter();
  const shortName = conference.shortName || 'the Conference';

  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <Text style={styles.title}>
          {conference.registrationOpen
            ? `Reserve Your Seat at ${shortName}`
            : `Get Ready for ${shortName}`}
        </Text>
        <Text style={styles.body}>
          {conference.registrationOpen
            ? 'Join the conversations, exhibitions, and partnerships shaping renewable energy progress.'
            : "Registration will open soon. Stay tuned for updates on Africa's premier renewable energy gathering."}
        </Text>

        <View style={styles.actions}>
          {conference.registrationOpen ? (
            <Pressable
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
              onPress={() => router.navigate(routes.register)}
            >
              <Text style={styles.primaryButtonText}>Register Now</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.text} />
            </Pressable>
          ) : conference.contactPhone ? (
            <Pressable
              style={({ pressed }) => [styles.contactButton, pressed && styles.pressed]}
              onPress={() => Linking.openURL(`tel:${conference.contactPhone}`)}
            >
              <Text style={styles.contactButtonText}>Contact Us for Updates</Text>
            </Pressable>
          ) : null}

          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
            onPress={() => router.navigate(routes.about)}
          >
            <Text style={styles.secondaryButtonText}>Learn More</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: colors.white,
  },
  card: {
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    lineHeight: 30,
  },
  body: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
  },
  actions: {
    marginTop: 20,
    width: '100%',
    gap: 10,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  contactButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 14,
  },
  contactButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: 12,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  pressed: {
    opacity: 0.92,
  },
});
