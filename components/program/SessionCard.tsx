import { useState } from 'react';
import { useWindowDimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHTML from 'react-native-render-html';

import { colors } from '@/constants/theme';
import { getSessionSpanLabel } from '@/lib/schedule-utils';
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
