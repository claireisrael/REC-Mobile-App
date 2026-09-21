import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/theme';
import { conferenceDisplayName } from '@/lib/report-utils';
import { getReportsSiteConfig } from '@/lib/public-site-config';
import { routes } from '@/lib/routes';
import type { Conference, ConferenceReport } from '@/lib/types';

type PreviousReportCtaProps = {
  conference: Conference;
  report: ConferenceReport | null;
  reportConference: Conference | null;
};

export function PreviousReportCta({
  conference,
  report,
  reportConference,
}: PreviousReportCtaProps) {
  const router = useRouter();
  const config = getReportsSiteConfig(conference);

  if (!report || config.programCtaEnabled === false) return null;

  const edition = conferenceDisplayName(reportConference);

  return (
    <View style={styles.section}>
      <View style={styles.badge}>
        <Ionicons name="document-text-outline" size={14} color={colors.primary} />
        <Text style={styles.badgeText}>{config.ctaEyebrow}</Text>
      </View>
      <Text style={styles.title}>{config.ctaTitle}</Text>
      <Text style={styles.description}>{config.ctaDescription}</Text>
      <Text style={styles.reportTitle}>
        {edition ? `${edition}: ` : ''}
        {report.title}
      </Text>

      <View style={styles.actions}>
        {report.reportUrl ? (
          <Pressable
            style={({ pressed }) => [styles.primaryBtn, pressed && styles.pressed]}
            onPress={() => Linking.openURL(report.reportUrl)}
          >
            <Text style={styles.primaryBtnText}>{config.ctaButtonLabel}</Text>
            <Ionicons name="open-outline" size={16} color={colors.white} />
          </Pressable>
        ) : null}

        <Pressable
          style={({ pressed }) => [styles.secondaryBtn, pressed && styles.pressed]}
          onPress={() => router.navigate(routes.reports)}
        >
          <Text style={styles.secondaryBtnText}>Browse all reports</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 8,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#E7F4F7',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: `${colors.primary}33`,
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: colors.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 28,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  reportTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  actions: {
    marginTop: 6,
    gap: 10,
  },
  primaryBtn: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  primaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
  secondaryBtn: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 16,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  pressed: {
    opacity: 0.9,
  },
});
