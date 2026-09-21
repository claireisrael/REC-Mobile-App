import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ReportCard } from '@/components/reports/ReportCard';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { SelectField } from '@/components/ui/SelectField';
import { colors } from '@/constants/theme';
import {
  fetchConferenceReports,
  fetchReportConferences,
} from '@/lib/public-reports-api';
import { getReportsSiteConfig } from '@/lib/public-site-config';
import { conferenceDisplayName } from '@/lib/report-utils';
import { routes } from '@/lib/routes';
import type { Conference, ConferenceReport } from '@/lib/types';

export default function ReportsScreen() {
  const router = useRouter();
  const [siteConference, setSiteConference] = useState<Conference | null>(null);
  const [reportConferences, setReportConferences] = useState<Conference[]>([]);
  const [selectedConferenceId, setSelectedConferenceId] = useState('');
  const [reports, setReports] = useState<ConferenceReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedConference = useMemo(
    () => reportConferences.find((item) => item.$id === selectedConferenceId) || null,
    [reportConferences, selectedConferenceId]
  );
  const pageConfig = getReportsSiteConfig(siteConference);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchReportConferences();
        const conferences = data.documents || [];
        setReportConferences(conferences);
        setSelectedConferenceId(conferences[0]?.$id || '');
        setSiteConference(data.siteConference || conferences[0] || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conference reports.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!selectedConferenceId) {
      setReports([]);
      return undefined;
    }

    const loadReports = async () => {
      setReportsLoading(true);
      setError('');
      try {
        const data = await fetchConferenceReports(selectedConferenceId, { limit: 100 });
        setReports(data.documents || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load reports for this conference.');
      } finally {
        setReportsLoading(false);
      }
    };

    loadReports();
  }, [selectedConferenceId]);

  const conferenceOptions = useMemo(
    () =>
      reportConferences.map((item) => ({
        value: item.$id,
        label: `${conferenceDisplayName(item)} (${item.reportCount ?? 0})`,
      })),
    [reportConferences]
  );

  if (loading) {
    return <LoadingState />;
  }

  if (error && !siteConference) {
    return <ErrorState title="Reports unavailable" message={error} />;
  }

  if (!siteConference) {
    return (
      <ErrorState
        title="Reports unavailable"
        message="No conference information is available."
      />
    );
  }

  const reportCount = selectedConference?.reportCount || reports.length || 0;

  return (
    <ScreenContainer>
      <ScrollView style={styles.screen}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Ionicons name="book-outline" size={14} color={colors.primary} />
            <Text style={styles.badgeText}>Conference Publications</Text>
          </View>
          <Text style={styles.title}>{pageConfig.pageTitle}</Text>
          <Text style={styles.subtitle}>{pageConfig.pageDescription}</Text>
        </View>

        <View style={styles.conferenceCard}>
          <View style={styles.conferenceMeta}>
            <View style={styles.metaBadge}>
              <Ionicons name="document-text-outline" size={14} color={colors.primary} />
              <Text style={styles.metaBadgeText}>Report Archive</Text>
            </View>
            <Text style={styles.conferenceName}>
              {selectedConference
                ? conferenceDisplayName(selectedConference)
                : 'Conference reports'}
            </Text>
            <View style={styles.countRow}>
              <Ionicons name="calendar-outline" size={14} color={colors.primary} />
              <Text style={styles.conferenceCount}>
                {selectedConference
                  ? `${reportCount} published report${reportCount === 1 ? '' : 's'}`
                  : 'No published reports are available yet.'}
              </Text>
            </View>
          </View>

          {conferenceOptions.length > 0 ? (
            <SelectField
              label="View reports from"
              value={selectedConferenceId}
              options={conferenceOptions}
              onChange={setSelectedConferenceId}
            />
          ) : null}

          <Pressable
            style={styles.backLink}
            onPress={() => router.navigate(routes.sponsors)}
          >
            <Ionicons name="arrow-back" size={16} color={colors.primary} />
            <Text style={styles.backLinkText}>Back to albums and videos</Text>
          </Pressable>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {reportsLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading selected conference reports...</Text>
          </View>
        ) : reports.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No published reports for this edition</Text>
            <Text style={styles.emptyText}>
              Select another conference or return later when an official report has been published.
            </Text>
          </View>
        ) : (
          <View style={styles.list}>
            {reports.map((report) => (
              <ReportCard key={report.$id} report={report} />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 18,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: `${colors.primary}14`,
    borderWidth: 1,
    borderColor: `${colors.primary}26`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 30,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  conferenceCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  conferenceMeta: {
    gap: 6,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: colors.primary,
  },
  conferenceName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  conferenceCount: {
    fontSize: 13,
    color: colors.textMuted,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backLinkText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.primary,
  },
  errorBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 13,
    color: '#991B1B',
    lineHeight: 18,
  },
  loadingWrap: {
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  emptyState: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 24,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 14,
  },
});
