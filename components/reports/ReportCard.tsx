import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { formatReportDate, getReportTypeLabel } from '@/lib/report-utils';
import type { ConferenceReport } from '@/lib/types';

type ReportCardProps = {
  report: ConferenceReport;
};

export function ReportCard({ report }: ReportCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.coverWrap}>
        {report.coverImageUrl ? (
          <Image source={{ uri: report.coverImageUrl }} style={styles.cover} resizeMode="cover" />
        ) : (
          <View style={styles.coverFallback}>
            <Ionicons name="document-text-outline" size={40} color={colors.white} />
          </View>
        )}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{getReportTypeLabel(report)}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{report.title}</Text>
        {report.publicationDate ? (
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.primary} />
            <Text style={styles.dateText}>Published {formatReportDate(report.publicationDate)}</Text>
          </View>
        ) : null}
        <Text style={styles.summary}>
          {report.summary || 'Open the official publication for this REC edition.'}
        </Text>
        {report.reportUrl ? (
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            onPress={() => Linking.openURL(report.reportUrl)}
          >
            <Text style={styles.actionBtnText}>View report</Text>
            <Ionicons name="open-outline" size={16} color={colors.white} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  coverWrap: {
    aspectRatio: 16 / 9,
    backgroundColor: '#E7F4F7',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  coverFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  body: {
    padding: 14,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 24,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  summary: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  actionBtnPressed: {
    backgroundColor: colors.primaryDark,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.white,
  },
});
