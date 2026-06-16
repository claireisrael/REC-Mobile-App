import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SessionCard } from '@/components/program/SessionCard';
import { colors } from '@/constants/theme';
import {
  formatBlockTimeRange,
  formatVenueScope,
  getBlockTypeLabel,
  isSessionAllowedBlock,
} from '@/lib/schedule-utils';
import { formatTimeWithTimezone } from '@/lib/program-utils';
import type { Session, TimeBlock } from '@/lib/types';

type TimeSlotData = {
  key?: string;
  block?: TimeBlock;
  startTime?: string;
  toTime?: string;
  label?: string;
  type?: string;
  allowSessions?: boolean;
  sessions?: Session[];
  sessionEntries?: { session: Session; isContinuation: boolean }[];
};

type TimeSlotAccordionProps = {
  timeKey: string;
  timeSlotData: TimeSlotData;
  isExpanded: boolean;
  onToggle: () => void;
};

const blockIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  SESSION: 'time-outline',
  BREAK: 'cafe-outline',
  LUNCH: 'restaurant-outline',
  SOCIAL: 'people-outline',
  CEREMONY: 'star-outline',
  EXHIBITION: 'business-outline',
  OTHER: 'calendar-outline',
};

export function TimeSlotAccordion({
  timeKey,
  timeSlotData,
  isExpanded,
  onToggle,
}: TimeSlotAccordionProps) {
  const block = timeSlotData.block;
  const blockLabel = block?.label || '';
  const blockTypeLabel = block ? getBlockTypeLabel(block.type) : '';
  const blockTimeRange = block ? formatBlockTimeRange(block) : '';
  const startTimes = block ? null : formatTimeWithTimezone(timeSlotData.startTime);
  const endTimes = block ? null : formatTimeWithTimezone(timeSlotData.toTime);
  const displayedTimeRange = block
    ? blockTimeRange || 'Time to be confirmed'
    : `${startTimes?.kampala} - ${endTimes?.kampala}`;
  const showBothTimezones =
    !block && startTimes && endTimes && startTimes.kampala !== startTimes.local;
  const sessionEntries =
    timeSlotData.sessionEntries ||
    (timeSlotData.sessions || []).map((session) => ({ session, isContinuation: false }));
  const sessionsInSlot = sessionEntries.map((entry) => entry.session);
  const allowsSessions = block ? isSessionAllowedBlock(block) : true;
  const iconName = blockIcons[block?.type || 'SESSION'] || 'time-outline';

  if (block && !allowsSessions) {
    return (
      <View style={styles.breakCard}>
        <View style={styles.breakIconWrap}>
          <Ionicons name={iconName} size={16} color="#8A6200" />
        </View>
        <View style={styles.breakContent}>
          <View style={styles.breakMetaRow}>
            <Text style={styles.breakType}>{blockTypeLabel}</Text>
            <Text style={styles.breakTimeText}>{displayedTimeRange} EAT</Text>
          </View>
          <Text style={styles.breakTitle} numberOfLines={2}>
            {blockLabel || blockTypeLabel}
          </Text>
          {block.notes ? (
            <Text style={styles.breakNotes} numberOfLines={2}>
              {block.notes}
            </Text>
          ) : null}
          <Text style={styles.venueScopeText}>{formatVenueScope(block)}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [styles.header, pressed && styles.headerPressed]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerIcon}>
            <Ionicons name={iconName} size={20} color={colors.white} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.timeRange}>{displayedTimeRange}</Text>
            {blockLabel ? <Text style={styles.blockLabel}>{blockLabel}</Text> : null}
            <Text style={styles.timezoneNote}>East Africa Time (EAT / UTC+3)</Text>
          </View>
          <View style={styles.headerActions}>
            {showBothTimezones && startTimes && endTimes ? (
              <View style={styles.localTimeBox}>
                <Text style={styles.localTimeText}>
                  {startTimes.local} - {endTimes.local}
                </Text>
                <Text style={styles.localTimeLabel}>Your time ({startTimes.timezone})</Text>
              </View>
            ) : null}
            <View style={styles.sessionCountBadge}>
              <Text style={styles.sessionCountText}>
                {sessionsInSlot.length} {sessionsInSlot.length === 1 ? 'session' : 'sessions'}
              </Text>
            </View>
            <View style={styles.chevronWrap}>
              <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.white} />
            </View>
          </View>
        </View>

        {showBothTimezones && startTimes && endTimes ? (
          <View style={styles.localTimeMobile}>
            <Text style={styles.localTimeText}>
              {startTimes.local} - {endTimes.local}
            </Text>
            <Text style={styles.localTimeLabel}>Your time ({startTimes.timezone})</Text>
          </View>
        ) : null}
      </Pressable>

      {isExpanded ? (
        sessionsInSlot.length > 0 ? (
          <View style={styles.sessionsGrid}>
            {sessionEntries.map(({ session, isContinuation }) => (
              <SessionCard
                key={`${session.$id}-${block?.$id || timeKey}`}
                session={session}
                compact={isContinuation}
                continuation={isContinuation}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptySlot}>
            <Text style={styles.emptySlotTitle}>No published sessions in this slot yet</Text>
            <Text style={styles.emptySlotText}>
              This time remains available in the published program.
            </Text>
          </View>
        )
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 16,
  },
  header: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.primary}26`,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  headerPressed: {
    backgroundColor: colors.primaryDark,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerIcon: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    padding: 8,
  },
  headerText: {
    flex: 1,
  },
  timeRange: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.2,
  },
  blockLabel: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.92)',
  },
  timezoneNote: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
  },
  headerActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  localTimeBox: {
    display: 'none',
  },
  localTimeMobile: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  localTimeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  localTimeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  sessionCountBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sessionCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  chevronWrap: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: 6,
  },
  sessionsGrid: {
    gap: 16,
  },
  emptySlot: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 28,
    alignItems: 'center',
  },
  emptySlotTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  emptySlotText: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
  },
  breakCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  breakIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${colors.accent}33`,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  breakContent: {
    flex: 1,
    minWidth: 0,
  },
  breakMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  breakType: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8A6200',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  breakTimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  breakTitle: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 18,
  },
  breakNotes: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
    color: '#6B7280',
  },
  venueScopeText: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
  },
});
