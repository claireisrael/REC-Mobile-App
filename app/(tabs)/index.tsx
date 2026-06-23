import {
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeCtaSection } from '@/components/home/HomeCtaSection';
import { HomeStatsBar } from '@/components/home/HomeStatsBar';
import { ViewVenueBadge } from '@/components/home/ViewVenueBadge';
import { SponsorShowcase } from '@/components/home/SponsorShowcase';
import { ThemeSection } from '@/components/home/ThemeSection';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { colors } from '@/constants/theme';
import { useAppData } from '@/context/AppDataContext';
import { getHomeStats } from '@/lib/conference-home-utils';
import { getConferenceInfo } from '@/lib/conference-info';
import { getHeroImageSource } from '@/lib/hero-image';
import { formatDateRange } from '@/lib/program-utils';
import { routes } from '@/lib/routes';

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { conference: liveConference, sponsorCategories, sponsors, loading, error, refresh } =
    useAppData();
  const conference = getConferenceInfo(liveConference);
  const [refreshing, setRefreshing] = useState(false);

  const homeStats = useMemo(
    () => (conference ? getHomeStats(conference) : null),
    [conference]
  );

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
        title="Conference unavailable"
        message={error || 'Conference information could not be loaded.'}
        onRetry={refresh}
      />
    );
  }

  const heroTitle = conference.title || conference.shortName || 'Renewable Energy Conference & Expo';
  const heroBackground = getHeroImageSource(conference.heroImageUrl);
  const dateRange = formatDateRange(conference.startDate, conference.endDate);

  const heroContent = (
    <LinearGradient
      colors={[
        'rgba(5,61,73,0.18)',
        'rgba(5,61,73,0.38)',
        'rgba(5,61,73,0.62)',
      ]}
      locations={[0, 0.45, 1]}
      style={styles.heroOverlay}
    >
      <View style={[styles.heroContent, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.heroTitle} numberOfLines={3}>
          {heroTitle}
        </Text>
        <Text style={styles.heroDate}>{dateRange}</Text>

        <View style={styles.heroActions}>
          <Pressable
            style={({ pressed }) => [styles.programButton, pressed && styles.programButtonPressed]}
            onPress={() => router.navigate(routes.program)}
          >
            <Ionicons name="calendar-outline" size={16} color={colors.white} />
            <Text style={styles.programButtonText}>View Program</Text>
          </Pressable>

          {conference.registrationOpen ? (
            <Pressable
              style={({ pressed }) => [styles.registerButton, pressed && styles.registerButtonPressed]}
              onPress={() => router.navigate(routes.register)}
            >
              <Text style={styles.registerButtonText}>Register Now</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.text} />
            </Pressable>
          ) : (
            <View style={styles.closedPill}>
              <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.85)" />
              <Text style={styles.closedPillText} numberOfLines={1}>
                {conference.regClosedMessage || 'Opening soon'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
  );

  return (
    <ScrollView
      style={styles.screen}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {error ? (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>{error}</Text>
        </View>
      ) : null}

      {heroBackground ? (
        <ImageBackground
          source={heroBackground}
          style={styles.hero}
          imageStyle={styles.heroImage}
          resizeMode="cover"
        >
          {heroContent}
        </ImageBackground>
      ) : (
        <View style={styles.hero}>{heroContent}</View>
      )}

      {homeStats ? (
        <HomeStatsBar daysCount={homeStats.daysCount} speakers={homeStats.speakers} />
      ) : null}

      <ThemeSection conference={conference} />
      <SponsorShowcase
        conference={conference}
        categories={sponsorCategories}
        sponsors={sponsors}
      />
      <ViewVenueBadge conference={conference} />
      <HomeCtaSection conference={conference} />

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    minHeight: 300,
    backgroundColor: colors.primaryDark,
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    flex: 1,
    minHeight: 300,
    justifyContent: 'flex-end',
  },
  heroContent: {
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.white,
    lineHeight: 32,
    letterSpacing: -0.4,
  },
  heroDate: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  heroActions: {
    alignSelf: 'flex-start',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 16,
  },
  programButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.42)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  programButtonPressed: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  programButtonText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  registerButton: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: colors.accent,
    shadowColor: colors.accentDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  registerButtonPressed: {
    backgroundColor: colors.accentDark,
  },
  registerButtonText: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 15,
  },
  closedPill: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  closedPillText: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    fontSize: 13,
  },
  warningBanner: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
  },
  warningText: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 17,
  },
  bottomSpacer: {
    height: 24,
  },
});
