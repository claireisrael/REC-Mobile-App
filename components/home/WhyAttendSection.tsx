import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { HomeFeature } from '@/lib/conference-home-utils';
import type { Conference } from '@/lib/types';

type WhyAttendSectionProps = {
  conference: Conference;
  features: HomeFeature[];
};

export function WhyAttendSection({ conference, features }: WhyAttendSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>
        Why Attend {conference.shortName || conference.title || 'the Conference'}?
      </Text>
      <Text style={styles.subtitle}>
        Unlock unparalleled opportunities for growth, learning, and collaboration
      </Text>

      <View style={styles.grid}>
        {features.map((feature) => (
          <View key={feature.title} style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: feature.color }]}>
              <Ionicons
                name={feature.icon as keyof typeof Ionicons.glyphMap}
                size={22}
                color={colors.white}
              />
            </View>
            <Text style={styles.cardTitle}>{feature.title}</Text>
            <Text style={styles.cardBody}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 30,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    textAlign: 'center',
  },
  grid: {
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.white,
    padding: 18,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
});
