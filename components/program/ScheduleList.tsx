import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { SessionCard } from '@/components/program/SessionCard';
import { colors } from '@/constants/theme';
import { formatTimeWithTimezone, getFilteredSessions, getSessionsByDay, groupSessionsByTimeSlot } from '@/lib/program-utils';
import {
  buildScheduleRows,
  formatBlockTimeRange,
  getBlockTypeLabel,
  hasProgramTimeBlocks,
} from '@/lib/schedule-utils';
import type { Session, TimeBlock } from '@/lib/types';

type ScheduleListProps = {
  sessions: Session[];
  timeBlocks: TimeBlock[];
  day: number;
  selectedHall: string;
};

function BreakBlock({
  label,
  timeRange,
  type,
}: {
  label: string;
  timeRange: string;
  type: string;
}) {
  const iconName =
    type === 'LUNCH'
      ? ('restaurant-outline' as const)
      : type === 'BREAK'
        ? ('cafe-outline' as const)
        : ('time-outline' as const);

  return (
    <View style={styles.breakRow}>
      <View style={styles.breakTimeline}>
        <View style={styles.breakDot} />
        <View style={styles.breakLine} />
      </View>
      <View style={styles.breakCard}>
        <Ionicons name={iconName} size={18} color={colors.textMuted} />
        <View style={styles.breakContent}>
          <Text style={styles.breakTime}>{timeRange}</Text>
          <Text style={styles.breakLabel}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

export function ScheduleList({ sessions, timeBlocks, day, selectedHall }: ScheduleListProps) {
  const usesTimeBlocks = hasProgramTimeBlocks(timeBlocks);

  if (usesTimeBlocks) {
    const rows = buildScheduleRows({ sessions, timeBlocks, day, selectedHall });

    return (
      <View>
        {rows.map((row, rowIndex) => {
          const timeRange = formatBlockTimeRange(row.block);
          const label = row.label || getBlockTypeLabel(row.type);

          if (!row.allowSessions) {
            return (
              <BreakBlock
                key={row.key}
                label={label}
                timeRange={timeRange}
                type={row.type}
              />
            );
          }

          if (row.sessionEntries.length === 0) {
            return null;
          }

          return (
            <View key={row.key} style={styles.blockGroup}>
              <View style={styles.blockHeader}>
                <Text style={styles.blockTime}>{timeRange}</Text>
                <Text style={styles.blockLabel}>{label}</Text>
              </View>
              {row.sessionEntries.map(({ session, isContinuation }) => (
                <SessionCard
                  key={session.$id}
                  session={session}
                  continuation={isContinuation}
                />
              ))}
            </View>
          );
        })}
      </View>
    );
  }

  const daySessions = getSessionsByDay(sessions, day);
  const filtered = getFilteredSessions(daySessions, selectedHall);
  const grouped = Object.entries(groupSessionsByTimeSlot(filtered));

  if (grouped.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="calendar-outline" size={40} color={colors.textMuted} />
        <Text style={styles.emptyTitle}>No sessions match this view</Text>
        <Text style={styles.emptyText}>
          Try another day{selectedHall !== 'all' ? ' or choose all halls' : ''}.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {grouped.map(([timeKey, slot], groupIndex) => {
        const start = formatTimeWithTimezone(slot.startTime);
        const end = formatTimeWithTimezone(slot.toTime);
        const entries = slot.sessions;

        return (
          <View key={timeKey} style={styles.blockGroup}>
            <View style={styles.blockHeader}>
              <Text style={styles.blockTime}>
                {start.kampala} – {end.kampala}
              </Text>
              <Text style={styles.blockLabel}>
                {entries.length} {entries.length === 1 ? 'session' : 'sessions'} · EAT
              </Text>
            </View>
            {entries.map((session) => (
              <SessionCard key={session.$id} session={session} />
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  blockGroup: {
    marginBottom: 8,
  },
  blockHeader: {
    paddingLeft: 28,
    marginBottom: 12,
  },
  blockTime: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  blockLabel: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  breakRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  breakTimeline: {
    width: 20,
    alignItems: 'center',
    paddingTop: 16,
  },
  breakDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  breakLine: {
    flex: 1,
    width: 2,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
    minHeight: 20,
  },
  breakCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    padding: 14,
    marginBottom: 8,
  },
  breakContent: {
    flex: 1,
  },
  breakTime: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  breakLabel: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
