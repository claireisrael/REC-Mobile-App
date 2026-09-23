import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ImageHeroBanner } from '@/components/layout/ImageHeroBanner';
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
      <ImageHeroBanner
        imageUrl={conference.heroImageUrl}
        eyebrow="Venue & Travel"
        title="Venue & Travel"
        subtitle={`Everything you need to know about getting to ${shortName}`}
        tall
      >
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
      </ImageHeroBanner>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
