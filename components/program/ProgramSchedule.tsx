import { useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { DayTab } from '@/components/program/DayTab';
import { HallSelect } from '@/components/program/HallSelect';
import { TimeSlotAccordion } from '@/components/program/TimeSlotAccordion';
import { colors } from '@/constants/theme';
import {
  getDayDate,
  getFilteredSessions,
  getSessionsByDay,
  groupSessionsByTimeSlot,
} from '@/lib/program-utils';
import { buildScheduleRows, hasProgramTimeBlocks } from '@/lib/schedule-utils';
import type { Conference, Program, Session, TimeBlock } from '@/lib/types';

type ProgramScheduleProps = {
  conference: Conference;
  program: Program;
  sessions: Session[];
  timeBlocks?: TimeBlock[];
};

export function ProgramSchedule({
  conference,
  program,
  sessions,
  timeBlocks = [],
}: ProgramScheduleProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedHall, setSelectedHall] = useState('all');
  const [expandedTimeSlots, setExpandedTimeSlots] = useState<Record<string, boolean>>({});

  const days = useMemo(
    () => Array.from({ length: program?.daysCount || 0 }, (_, index) => index + 1),
    [program?.daysCount]
  );
  const halls = program?.venueHalls || [];

  useEffect(() => {
    if (!selectedDay && days.length > 0) {
      setSelectedDay(days[0]);
    }
  }, [days, selectedDay]);

  const daySessions = selectedDay ? getSessionsByDay(sessions, selectedDay) : [];
  const filteredSessions = getFilteredSessions(daySessions, selectedHall);
  const usesTimeBlocks = hasProgramTimeBlocks(timeBlocks);
  const groupedSessions = usesTimeBlocks ? {} : groupSessionsByTimeSlot(filteredSessions);
  const scheduleRows = usesTimeBlocks
    ? buildScheduleRows({ sessions, timeBlocks, day: selectedDay || 1, selectedHall })
    : [];

  const toggleTimeSlot = (timeKey: string) => {
    setExpandedTimeSlots((previous) => ({
      ...previous,
      [timeKey]: previous[timeKey] === false,
    }));
  };

  const isTimeSlotExpanded = (timeKey: string) => expandedTimeSlots[timeKey] !== false;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Sessions Schedule</Text>
            <Text style={styles.subtitle}>
              Browse {sessions.length} published {sessions.length === 1 ? 'session' : 'sessions'}{' '}
              by day, venue, and program block.
            </Text>
          </View>
          {halls.length > 0 ? (
            <HallSelect halls={halls} selectedHall={selectedHall} onSelect={setSelectedHall} />
          ) : null}
        </View>
      </View>

      <View style={styles.dayTabsSection}>
        <View style={styles.dayTabsGrid}>
          {days.map((day) => (
            <DayTab
              key={day}
              day={day}
              dayDate={getDayDate(conference?.startDate, day)}
              sessionCount={getSessionsByDay(sessions, day).length}
              isActive={selectedDay === day}
              onPress={() => setSelectedDay(day)}
            />
          ))}
        </View>
      </View>

      <View style={styles.content}>
        {usesTimeBlocks ? (
          scheduleRows.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={40} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No schedule blocks match this view</Text>
              <Text style={styles.emptyText}>
                Try another day{selectedHall !== 'all' ? ' or choose all halls' : ''}.
              </Text>
            </View>
          ) : (
            <View style={styles.rows}>
              {scheduleRows.map((row) => (
                <TimeSlotAccordion
                  key={row.key}
                  timeKey={row.key}
                  timeSlotData={row}
                  isExpanded={isTimeSlotExpanded(row.key)}
                  onToggle={() => toggleTimeSlot(row.key)}
                />
              ))}
            </View>
          )
        ) : filteredSessions.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={40} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No sessions match this view</Text>
            <Text style={styles.emptyText}>
              Try another day{selectedHall !== 'all' ? ' or choose all halls' : ''}.
            </Text>
          </View>
        ) : (
          <View style={styles.rows}>
            {Object.entries(groupedSessions).map(([timeKey, timeSlotData]) => (
              <TimeSlotAccordion
                key={timeKey}
                timeKey={timeKey}
                timeSlotData={timeSlotData}
                isExpanded={isTimeSlotExpanded(timeKey)}
                onToggle={() => toggleTimeSlot(timeKey)}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTop: {
    gap: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  dayTabsSection: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dayTabsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  rows: {
    gap: 20,
  },
  empty: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
