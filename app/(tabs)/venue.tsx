import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

import { GettingThereSection } from '@/components/venue/GettingThereSection';
import { VenueDetailsCard } from '@/components/venue/VenueDetailsCard';
import { VenueHero } from '@/components/venue/VenueHero';
import { VenueMapCard } from '@/components/venue/VenueMapCard';
import { VisaSection } from '@/components/venue/VisaSection';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { colors } from '@/constants/theme';
import { useAppData } from '@/context/AppDataContext';
import { getConferenceInfo } from '@/lib/conference-info';

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

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.screen}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <VenueHero conference={conference} />
        <VenueDetailsCard conference={conference} />
        <VenueMapCard conference={conference} />
        <GettingThereSection venue={conference.venue} />
        <VisaSection registrationOpen={conference.registrationOpen} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
