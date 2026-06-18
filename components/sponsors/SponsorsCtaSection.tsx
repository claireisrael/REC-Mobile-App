import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/theme';
import { routes } from '@/lib/routes';
import type { Conference } from '@/lib/types';

type SponsorsCtaSectionProps = {
  conference: Conference;
};

export function SponsorsCtaSection({ conference }: SponsorsCtaSectionProps) {
  const router = useRouter();
  const shortName = conference.shortName || 'the conference';

  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <Text style={styles.title}>Interested in sponsoring {shortName}?</Text>
        <Text style={styles.subtitle}>
          Sponsorship gives your organization visibility with policymakers, investors, innovators,
          practitioners, and clean energy stakeholders.
        </Text>

        <View style={styles.actions}>
          {conference.sponsorshipPackageUrl ? (
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
              onPress={() => Linking.openURL(conference.sponsorshipPackageUrl!)}
            >
              <Text style={styles.primaryBtnText}>View Sponsorship Package</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.text} />
            </Pressable>
          ) : null}

          <Pressable
            style={({ pressed }) => [styles.secondaryBtn, pressed && styles.secondaryBtnPressed]}
            onPress={() => router.navigate(routes.about)}
          >
            <Text style={styles.secondaryBtnText}>Learn More</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.primary} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#F8FAFC',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 26,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: 'center',
  },
  actions: {
    marginTop: 16,
    width: '100%',
    gap: 10,
    alignItems: 'center',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  primaryBtnPressed: {
    backgroundColor: colors.accentDark,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderColor: `${colors.primary}33`,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 13,
    backgroundColor: colors.white,
  },
  secondaryBtnPressed: {
    backgroundColor: `${colors.primary}08`,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
});
