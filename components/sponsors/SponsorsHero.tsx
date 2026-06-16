import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { Conference } from '@/lib/types';

type SponsorsHeroProps = {
  conference: Conference;
};

export function SponsorsHero({ conference }: SponsorsHeroProps) {
  const shortName = conference.shortName || conference.title || 'the conference';

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['#0B7186', '#085A6A', '#054653']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.badgeRow}>
          <Ionicons name="hand-left-outline" size={14} color="rgba(255,255,255,0.9)" />
          <Text style={styles.badgeText}>Sponsors & Partners</Text>
        </View>

        <Text style={styles.title}>Sponsors & Partners</Text>
        <Text style={styles.highlight}>Supporting {shortName}</Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          Organizations backing renewable energy collaboration, exhibition, and sector growth.
        </Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  gradient: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 22,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  highlight: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.82)',
  },
});
