import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { getDayDate, getSessionsByDay } from '@/lib/program-utils';
import type { Session } from '@/lib/types';

type DayTabBarProps = {
  days: number[];
  selectedDay: number;
  conferenceStartDate: string;
  sessions: Session[];
  onSelectDay: (day: number) => void;
};

export function DayTabBar({
  days,
  selectedDay,
  conferenceStartDate,
  sessions,
  onSelectDay,
}: DayTabBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {days.map((day) => {
        const isActive = day === selectedDay;
        const dayDate = getDayDate(conferenceStartDate, day);
        const sessionCount = getSessionsByDay(sessions, day).length;

        return (
          <Pressable
            key={day}
            onPress={() => onSelectDay(day)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Ionicons
              name="calendar-outline"
              size={18}
              color={isActive ? colors.white : colors.primary}
            />
            <Text style={[styles.dayLabel, isActive && styles.dayLabelActive]}>Day {day}</Text>
            <Text style={[styles.dayDate, isActive && styles.dayDateActive]}>{dayDate}</Text>
            <View style={[styles.countBadge, isActive && styles.countBadgeActive]}>
              <Text style={[styles.countText, isActive && styles.countTextActive]}>
                {sessionCount} {sessionCount === 1 ? 'session' : 'sessions'}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 20,
    gap: 10,
    paddingBottom: 4,
  },
  tab: {
    width: 132,
    minHeight: 118,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    padding: 14,
    justifyContent: 'space-between',
  },
  tabActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
  },
  dayLabelActive: {
    color: colors.white,
  },
  dayDate: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2,
  },
  dayDateActive: {
    color: 'rgba(255,255,255,0.9)',
  },
  countBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
  },
  countTextActive: {
    color: colors.white,
  },
});
