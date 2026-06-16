import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type DayTabProps = {
  day: number;
  dayDate: string;
  sessionCount: number;
  isActive: boolean;
  onPress: () => void;
};

export function DayTab({ day, dayDate, sessionCount, isActive, onPress }: DayTabProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tab, isActive && styles.tabActive]}
    >
      <Ionicons name="calendar-outline" size={18} color={isActive ? colors.white : colors.primary} />
      <Text style={[styles.dayLabel, isActive && styles.dayLabelActive]}>Day {day}</Text>
      {dayDate ? (
        <Text style={[styles.dayDate, isActive && styles.dayDateActive]} numberOfLines={1}>
          {dayDate}
        </Text>
      ) : null}
      <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
        <Text style={[styles.countText, isActive && styles.countTextActive]}>
          {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    minWidth: 0,
    minHeight: 88,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  tabActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  dayLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    marginTop: 6,
  },
  dayLabelActive: {
    color: colors.white,
  },
  dayDate: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 1,
  },
  dayDateActive: {
    color: 'rgba(255,255,255,0.9)',
  },
  countBadge: {
    alignSelf: 'flex-start',
    marginTop: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  countTextActive: {
    color: colors.white,
  },
});
