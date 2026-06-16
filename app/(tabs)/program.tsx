import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { ProgramHero } from '@/components/program/ProgramHero';
import { ProgramSchedule } from '@/components/program/ProgramSchedule';
import { ProgramStats } from '@/components/program/ProgramStats';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { colors } from '@/constants/theme';
import { useAppData } from '@/context/AppDataContext';
import { getConferenceInfo } from '@/lib/conference-info';

export default function ProgramScreen() {
  const { conference: liveConference, program, sessions, timeBlocks, loading, error, refresh } =
    useAppData();
  const conference = getConferenceInfo(liveConference);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
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
      </ScrollView>
    </ScreenContainer>
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
    marginBottom: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  warningText: { fontSize: 12, color: '#991B1B' },
});
