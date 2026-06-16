import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { SponsorsStats } from '@/components/sponsors/SponsorsStats';
import { colors } from '@/constants/theme';

type SponsorsIntroProps = {
  sponsorCount: number;
  tierCount: number;
};

export function SponsorsIntro({ sponsorCount, tierCount }: SponsorsIntroProps) {
  return (
    <View style={styles.section}>
      <View style={styles.badge}>
        <Ionicons name="people-outline" size={14} color={colors.primary} />
        <Text style={styles.badgeText}>Partnership Network</Text>
      </View>

      <Text style={styles.title}>Partners making the conference possible</Text>
      <Text style={styles.subtitle}>
        These organizations help strengthen dialogue, exhibition, innovation, and investment across
        Uganda's renewable energy sector.
      </Text>

      <SponsorsStats sponsorCount={sponsorCount} tierCount={tierCount} />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: `${colors.primary}14`,
    borderWidth: 1,
    borderColor: `${colors.primary}26`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 14,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
});
