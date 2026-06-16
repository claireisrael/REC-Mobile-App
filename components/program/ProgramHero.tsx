import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

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
      <LinearGradient
        colors={['#0B7186', '#085A6A', '#054653']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.topRow}>
          <Text style={styles.eyebrow}>Program</Text>
          {program.status ? (
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{program.status}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.title} numberOfLines={3}>
          {program.title || 'Conference Program'}
        </Text>

        <Text style={styles.date}>{dateRange}</Text>

        <Text style={styles.subtitle} numberOfLines={2}>
          Plan your sessions, compare halls, and download a copy of the published schedule.
        </Text>

        <ProgramHeroActions conference={conference} variant="hero" />
      </LinearGradient>

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
  gradient: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.72)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  date: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.82)',
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
