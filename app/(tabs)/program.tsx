import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';

import { ProgramHero } from '@/components/program/ProgramHero';
import { PreviousReportCta } from '@/components/program/PreviousReportCta';
import { ProgramSchedule } from '@/components/program/ProgramSchedule';
import { ProgramStats } from '@/components/program/ProgramStats';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { colors } from '@/constants/theme';
import { useAppData } from '@/context/AppDataContext';
import { SessionPrefsProvider } from '@/context/SessionPrefsContext';
import { getConferenceInfo } from '@/lib/conference-info';
import { fetchFeaturedPreviousReport } from '@/lib/public-reports-api';
import type { Conference, ConferenceReport } from '@/lib/types';

export default function ProgramScreen() {
  const { conference: liveConference, program, sessions, timeBlocks, loading, error, refresh } =
    useAppData();
  const conference = getConferenceInfo(liveConference);
  const [refreshing, setRefreshing] = useState(false);
  const [previousReport, setPreviousReport] = useState<{
    report: ConferenceReport | null;
    conference: Conference | null;
  }>({ report: null, conference: null });

  useEffect(() => {
    if (!liveConference?.$id) return undefined;

    let cancelled = false;

    fetchFeaturedPreviousReport(liveConference.$id)
      .then((result) => {
        if (!cancelled) {
          setPreviousReport(result || { report: null, conference: null });
        }
      })
      .catch(() => {
        if (!cancelled) setPreviousReport({ report: null, conference: null });
      });

    return () => {
      cancelled = true;
    };
  }, [liveConference?.$id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    if (liveConference?.$id) {
      try {
        const result = await fetchFeaturedPreviousReport(liveConference.$id);
        setPreviousReport(result || { report: null, conference: null });
      } catch {
        setPreviousReport({ report: null, conference: null });
      }
    }
    setRefreshing(false);
  };

  if (loading && !program) {
    return <LoadingState />;
  }

  if (!program || !conference) {
    return (
      <ErrorState
        title="Program not available"
        message={error || 'No published program is available yet.'}
        onRetry={refresh}
      />
    );
  }

  const halls = program?.venueHalls || [];

  return (
    <SessionPrefsProvider>
      <ScreenContainer>
        <ScrollView
          style={styles.screen}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <ProgramHero conference={conference} program={program} />

          <View style={styles.section}>
            {error ? (
              <View style={styles.warning}>
                <Text style={styles.warningText}>{error}</Text>
              </View>
            ) : null}

            <ProgramStats
              daysCount={program.daysCount}
              sessionCount={sessions.length}
              hallsCount={halls.length}
            />

            <ProgramSchedule
              conference={conference}
              program={program}
              sessions={sessions}
              timeBlocks={timeBlocks}
            />
          </View>

          <PreviousReportCta
            conference={conference}
            report={previousReport.report}
            reportConference={previousReport.conference}
          />
        </ScrollView>
      </ScreenContainer>
    </SessionPrefsProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  section: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  warning: {
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 17,
  },
});
