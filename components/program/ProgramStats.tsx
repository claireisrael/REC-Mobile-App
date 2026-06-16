import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type ProgramStatsProps = {
  daysCount?: number;
  sessionCount?: number;
  hallsCount?: number;
};

const statsConfig = [
  { label: 'Days', key: 'days' as const },
  { label: 'Sessions', key: 'sessions' as const },
  { label: 'Halls', key: 'halls' as const },
];

export function ProgramStats({ daysCount = 0, sessionCount = 0, hallsCount = 0 }: ProgramStatsProps) {
  const values = { days: daysCount, sessions: sessionCount, halls: hallsCount };

  return (
    <View style={styles.bar}>
      {statsConfig.map((stat, index) => (
        <View
          key={stat.key}
          style={[styles.stat, index < statsConfig.length - 1 && styles.statDivider]}
        >
          <Text style={styles.value}>{values[stat.key]}</Text>
          <Text style={styles.label}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    marginBottom: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  value: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  label: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
