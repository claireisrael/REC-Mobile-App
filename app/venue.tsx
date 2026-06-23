import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { GettingThereSection } from '@/components/venue/GettingThereSection';
import { VenueDetailsCard } from '@/components/venue/VenueDetailsCard';
import { VenueMapCard } from '@/components/venue/VenueMapCard';
import { VisaSection } from '@/components/venue/VisaSection';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { colors } from '@/constants/theme';
import { useAppData } from '@/context/AppDataContext';
import { getConferenceInfo } from '@/lib/conference-info';
import { formatDateRange } from '@/lib/program-utils';

export default function VenueScreen() {
  const { conference: liveConference, loading, error, refresh } = useAppData();
  const conference = getConferenceInfo(liveConference);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (loading && !liveConference) {
    return <LoadingState />;
  }

  if (!conference) {
    return (
      <ErrorState
        title="Venue details unavailable"
        message={error || 'No active conference found.'}
        onRetry={refresh}
      />
    );
  }

  const shortName = conference.shortName || conference.title || 'the conference';
  const dateRange = formatDateRange(conference.startDate, conference.endDate);

  return (
    <ScreenContainer safeTop={false}>
      <ScrollView
        style={styles.screen}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ScreenHeader
          showBack
          title="Venue & Travel"
          subtitle={`Everything you need to know about getting to ${shortName}${dateRange ? ` · ${dateRange}` : ''}`}
        />
        <VenueDetailsCard conference={conference} />
        <VenueMapCard conference={conference} />
        <GettingThereSection venue={conference.venue} />
        <VisaSection registrationOpen={conference.registrationOpen} />
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bottomSpacer: {
    height: 24,
  },
});
