import { useEffect, useMemo, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SponsorsCtaSection } from '@/components/sponsors/SponsorsCtaSection';
import { SponsorsDirectory } from '@/components/sponsors/SponsorsDirectory';
import { SponsorsHero } from '@/components/sponsors/SponsorsHero';
import { SponsorsIntro } from '@/components/sponsors/SponsorsIntro';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { colors } from '@/constants/theme';
import { useAppData } from '@/context/AppDataContext';
import { getConferenceInfo } from '@/lib/conference-info';

export default function SponsorsScreen() {
  const { conference: liveConference, sponsorCategories, sponsors, loading, error, sponsorsError, refresh, refreshSponsors } =
    useAppData();
  const conference = getConferenceInfo(liveConference);
  const [refreshing, setRefreshing] = useState(false);

  const visibleSponsors = useMemo(
    () => sponsors.filter((sponsor) => sponsor.isActive !== false),
    [sponsors]
  );
  const visibleCategories = useMemo(
    () => sponsorCategories.filter((category) => category.isActive !== false),
    [sponsorCategories]
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    await refreshSponsors();
    setRefreshing(false);
  };

  useEffect(() => {
    void refreshSponsors();
  }, [refreshSponsors]);

  if (loading && !liveConference) {
    return <LoadingState />;
  }

  if (!conference) {
    return (
      <ErrorState
        title="Sponsors unavailable"
        message={error || 'Conference information could not be loaded.'}
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
        <SponsorsHero conference={conference} />

        <SponsorsIntro
          sponsorCount={visibleSponsors.length}
          tierCount={visibleCategories.length}
        />

        {sponsorsError ? (
          <View style={styles.warning}>
            <Text style={styles.warningText}>{sponsorsError}</Text>
          </View>
        ) : null}

        <SponsorsDirectory categories={sponsorCategories} sponsors={sponsors} />

        <SponsorsCtaSection conference={conference} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  warning: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 17,
  },
});
