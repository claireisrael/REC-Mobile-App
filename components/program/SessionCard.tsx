import { useState } from 'react';
import { useWindowDimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHTML from 'react-native-render-html';

import { colors } from '@/constants/theme';
import { getSessionSpanLabel } from '@/lib/schedule-utils';
import { useSessionPrefs } from '@/context/SessionPrefsContext';
import type { Session } from '@/lib/types';

type SessionCardProps = {
  session: Session;
  compact?: boolean;
  continuation?: boolean;
};

export function SessionCard({ session, compact = false, continuation = false }: SessionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { width } = useWindowDimensions();
  const contentWidth = width - 80;
  const spanLabel = session.sessionSpanType ? getSessionSpanLabel(session.sessionSpanType) : '';
  const showReadMore = (session.preamble?.length || 0) > 200;
  const { prefs, update } = useSessionPrefs();
  const pref = prefs[session.$id] || {};

  const toggle = (key: 'attending' | 'bookmarked' | 'remind') => {
    const next = !pref[key];
    void update(
      session.$id,
      { [key]: next },
      { title: session.title, startTime: session.startTime }
    ).catch(() => undefined);
  };

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={compact ? styles.headerCompact : styles.header}>
        <View style={styles.badges}>
          {session.venueHall ? (
            <View style={styles.hallBadge}>
              <Ionicons name="location-outline" size={12} color={colors.primary} />
              <Text style={styles.hallBadgeText}>{session.venueHall}</Text>
            </View>
          ) : null}
          {spanLabel && session.sessionSpanType !== 'CUSTOM' ? (
            <View style={styles.spanBadge}>
              <Ionicons name="layers-outline" size={12} color={colors.textMuted} />
              <Text style={styles.spanBadgeText}>{continuation ? 'Continues' : spanLabel}</Text>
            </View>
          ) : null}
          {session.theme ? (
            <View style={styles.themeBadge}>
              <Text style={styles.themeBadgeText}>{session.theme}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.title}>{session.title}</Text>

        {continuation ? (
          <Text style={styles.continuationNote}>
            This session continues through this schedule block.
          </Text>
        ) : null}

        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.actionChip, styles.chipSave, pref.bookmarked && styles.chipSaveOn]}
            onPress={() => toggle('bookmarked')}
            hitSlop={6}
          >
            <Ionicons
              name={pref.bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={14}
              color={pref.bookmarked ? colors.primaryDark : colors.primary}
            />
            <Text style={[styles.actionText, styles.textSave, pref.bookmarked && styles.textSaveOn]}>
              Save
            </Text>
          </Pressable>
          <Pressable
            style={[styles.actionChip, styles.chipAttend, pref.attending && styles.chipAttendOn]}
            onPress={() => toggle('attending')}
            hitSlop={6}
          >
            <Ionicons
              name={pref.attending ? 'checkmark-circle' : 'checkmark-circle-outline'}
              size={14}
              color={pref.attending ? '#15803D' : '#16A34A'}
            />
            <Text
              style={[styles.actionText, styles.textAttend, pref.attending && styles.textAttendOn]}
            >
              Attend
            </Text>
          </Pressable>
          <Pressable
            style={[styles.actionChip, styles.chipRemind, pref.remind && styles.chipRemindOn]}
            onPress={() => toggle('remind')}
            hitSlop={6}
          >
            <Ionicons
              name={pref.remind ? 'notifications' : 'notifications-outline'}
              size={14}
              color={pref.remind ? '#B45309' : '#D97706'}
            />
            <Text
              style={[styles.actionText, styles.textRemind, pref.remind && styles.textRemindOn]}
            >
              Remind
            </Text>
          </Pressable>
        </View>
      </View>

      {!compact ? (
        <>
          {session.organizer ? (
            <View style={styles.organizerRow}>
              <Ionicons name="business-outline" size={16} color={colors.primary} />
              <Text style={styles.organizerText}>{session.organizer}</Text>
            </View>
          ) : null}

          {session.preamble ? (
            <View style={styles.preambleWrap}>
              <View style={!expanded && showReadMore ? styles.preambleClamp : undefined}>
                <RenderHTML
                  contentWidth={contentWidth}
                  source={{ html: session.preamble }}
                  baseStyle={styles.html}
                />
              </View>
              {showReadMore ? (
                <Pressable onPress={() => setExpanded(!expanded)} style={styles.readMore}>
                  <Text style={styles.readMoreText}>{expanded ? 'Show less' : 'Read more'}</Text>
                  <Ionicons
                    name={expanded ? 'chevron-up' : 'chevron-forward'}
                    size={14}
                    color={colors.primary}
                  />
                </Pressable>
              ) : null}
            </View>
          ) : null}

          {session.speakers ? (
            <View style={styles.speakersSection}>
              <View style={styles.speakersIcon}>
                <Ionicons name="people-outline" size={16} color={colors.accent} />
              </View>
              <View style={styles.speakersContent}>
                <RenderHTML
                  contentWidth={contentWidth - 48}
                  source={{ html: session.speakers }}
                  baseStyle={styles.html}
                />
              </View>
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardCompact: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerCompact: {
    marginBottom: 0,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  hallBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${colors.primary}1A`,
    borderWidth: 1,
    borderColor: `${colors.primary}33`,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  hallBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  spanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  spanBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  themeBadge: {
    backgroundColor: `${colors.accent}1A`,
    borderWidth: 1,
    borderColor: `${colors.accent}66`,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  themeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A6200',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 24,
  },
  continuationNote: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipSave: {
    backgroundColor: `${colors.primary}12`,
    borderColor: `${colors.primary}44`,
  },
  chipSaveOn: {
    backgroundColor: `${colors.primary}28`,
    borderColor: colors.primary,
  },
  chipAttend: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
  },
  chipAttendOn: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
  },
  chipRemind: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
  },
  chipRemindOn: {
    backgroundColor: '#FEF3C7',
    borderColor: '#D97706',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  textSave: {
    color: colors.primary,
  },
  textSaveOn: {
    color: colors.primaryDark,
  },
  textAttend: {
    color: '#16A34A',
  },
  textAttendOn: {
    color: '#15803D',
  },
  textRemind: {
    color: '#D97706',
  },
  textRemindOn: {
    color: '#B45309',
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  organizerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textMuted,
  },
  preambleWrap: {
    marginBottom: 16,
  },
  preambleClamp: {
    maxHeight: 72,
    overflow: 'hidden',
  },
  html: {
    fontSize: 14,
    lineHeight: 22,
    color: '#374151',
  },
  readMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  speakersSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 4,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  speakersIcon: {
    backgroundColor: `${colors.accent}1A`,
    borderRadius: 10,
    padding: 8,
  },
  speakersContent: {
    flex: 1,
  },
});
