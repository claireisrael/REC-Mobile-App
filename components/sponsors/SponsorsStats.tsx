import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type SponsorsStatsProps = {
  sponsorCount: number;
  tierCount: number;
};

export function SponsorsStats({ sponsorCount, tierCount }: SponsorsStatsProps) {
  return (
    <View style={styles.bar}>
      <View style={[styles.stat, styles.statDivider]}>
        <Text style={styles.value}>{sponsorCount}</Text>
        <Text style={styles.label}>Sponsors</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.value}>{tierCount}</Text>
        <Text style={styles.label}>Tiers</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
  },
  label: {
    marginTop: 2,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
