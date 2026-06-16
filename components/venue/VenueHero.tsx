import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { Conference } from '@/lib/types';
import { formatDateRange } from '@/lib/program-utils';

type VenueHeroProps = {
  conference: Conference;
};

export function VenueHero({ conference }: VenueHeroProps) {
  const shortName = conference.shortName || conference.title || 'the conference';
  const dateRange = formatDateRange(conference.startDate, conference.endDate);

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={['#053D49', '#0B7186', '#084E5C']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.title}>Venue & Travel</Text>
        <Text style={styles.subtitle}>
          Everything you need to know about getting to {shortName}
        </Text>

        {dateRange ? (
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="calendar-outline" size={14} color={colors.accent} />
              <Text style={styles.metaText}>{dateRange}</Text>
            </View>
            {conference.location ? (
              <View style={styles.metaChip}>
                <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.9)" />
                <Text style={styles.metaText} numberOfLines={1}>
                  {conference.location}
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  gradient: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.78)',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    maxWidth: '100%',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
    flexShrink: 1,
  },
});
