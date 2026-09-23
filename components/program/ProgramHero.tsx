import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { ImageHeroBanner } from '@/components/layout/ImageHeroBanner';
import { ProgramHeroActions } from '@/components/program/ProgramHeroActions';
import { colors } from '@/constants/theme';
import type { Conference, Program } from '@/lib/types';
import { formatDateRange } from '@/lib/program-utils';

type ProgramHeroProps = {
  conference: Conference;
  program: Program;
};

export function ProgramHero({ conference, program }: ProgramHeroProps) {
  const dateRange = formatDateRange(conference.startDate, conference.endDate);
  const metaItems = [
    conference.location
      ? { icon: 'location-outline' as const, text: conference.location }
      : null,
    conference.venue
      ? { icon: 'business-outline' as const, text: conference.venue }
      : null,
  ].filter(Boolean) as { icon: keyof typeof Ionicons.glyphMap; text: string }[];

  return (
    <View style={styles.wrap}>
      <ImageHeroBanner
        imageUrl={conference.heroImageUrl}
        eyebrow="Program"
        title={program.title || 'Conference Program'}
        highlight={dateRange}
        subtitle="Plan your sessions, compare halls, and download a copy of the published schedule."
        tall
        contentStyle={styles.heroPad}
      >
        {program.status ? (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{program.status}</Text>
          </View>
        ) : null}
        <ProgramHeroActions conference={conference} variant="hero" />
      </ImageHeroBanner>

      {metaItems.length > 0 ? (
        <View style={styles.metaStrip}>
          {metaItems.map((item) => (
            <View key={item.text} style={styles.metaItem}>
              <Ionicons name={item.icon} size={15} color={colors.primary} />
              <Text style={styles.metaText} numberOfLines={1}>
                {item.text}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  heroPad: {
    gap: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.28)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  metaStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
  },
  metaText: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
});
