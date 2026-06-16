import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type HomeStatsBarProps = {
  daysCount: number;
  speakers: number;
};

export function HomeStatsBar({ daysCount, speakers }: HomeStatsBarProps) {
  const stats = [
    { value: String(daysCount), label: `Day${daysCount !== 1 ? 's' : ''} of Sessions` },
    { value: `${speakers}+`, label: 'Expert Speakers' },
  ];

  return (
    <View style={styles.section}>
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <View
            key={stat.label}
            style={[styles.stat, index === 0 && styles.statWithDivider]}
          >
            <Text style={styles.value}>{stat.value}</Text>
            <Text style={styles.label}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    paddingVertical: 22,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  statWithDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  value: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.primary,
  },
  label: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
    textAlign: 'center',
  },
});
