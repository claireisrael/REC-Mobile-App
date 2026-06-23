import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AboutEventSnapshot } from '@/components/about/AboutEventSnapshot';
import { AboutHighlights } from '@/components/about/AboutHighlights';
import { AboutObjectives } from '@/components/about/AboutObjectives';
import { AboutOrganizers } from '@/components/about/AboutOrganizers';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { colors } from '@/constants/theme';
import { useAppData } from '@/context/AppDataContext';
import { getConferenceInfo } from '@/lib/conference-info';

function getEditionLabel(year?: number) {
  if (!year) return '';
  const editionNumber = year - 2020;
  if (editionNumber <= 0) return '';

  const suffix =
    editionNumber % 10 === 1 && editionNumber % 100 !== 11
      ? 'st'
      : editionNumber % 10 === 2 && editionNumber % 100 !== 12
        ? 'nd'
        : editionNumber % 10 === 3 && editionNumber % 100 !== 13
          ? 'rd'
          : 'th';

  return `The ${editionNumber}${suffix} edition of the Annual Renewable Energy Conference & Expo`;
}

export default function AboutScreen() {
  const { conference: liveConference, loading, error, refresh } = useAppData();
  const conference = getConferenceInfo(liveConference);

  if (loading && !liveConference) {
    return <LoadingState />;
  }

  if (!conference) {
    return (
      <ErrorState
        title="About page unavailable"
        message={error || 'Conference information could not be loaded.'}
        onRetry={refresh}
      />
    );
  }

  const shortName = conference.shortName || conference.title || 'the conference';
  const editionSubtitle =
    getEditionLabel(conference.year) || 'The Annual Renewable Energy Conference & Expo';
  const conferenceTitle = conference.title || 'Renewable Energy Conference & Expo';

  return (
    <ScreenContainer safeTop={false}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <ScreenHeader
          showBack
          title={`About ${shortName}`}
          subtitle={editionSubtitle}
        />

        <View style={styles.themeSection}>
          <View style={styles.themeBadge}>
            <Ionicons name="flag-outline" size={14} color={colors.primary} />
            <Text style={styles.themeBadgeText}>Conference Theme</Text>
          </View>

          {conference.theme ? (
            <Text style={styles.themeTitle}>{conference.theme}</Text>
          ) : null}

          <Text style={styles.body}>
            The Ministry of Energy and Mineral Development, in partnership with the National
            Renewable Energy Platform, will convene{' '}
            <Text style={styles.bodyStrong}>{conferenceTitle}</Text> as a practical forum for
            policy, investment, innovation, and sector coordination.
          </Text>
          <Text style={[styles.body, styles.bodySpacing]}>
            The conference brings together experts, innovators, policymakers, financiers,
            researchers, and practitioners to move clean energy conversations into implementation.
          </Text>
        </View>

        <View style={styles.panel}>
          <AboutEventSnapshot conference={conference} />
        </View>

        <View style={styles.panel}>
          <AboutHighlights />
        </View>

        <View style={styles.panel}>
          <AboutObjectives shortName={shortName} />
        </View>

        <View style={styles.panel}>
          <AboutOrganizers />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 28,
    gap: 20,
  },
  themeSection: {
    paddingHorizontal: 20,
    gap: 10,
  },
  themeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: `${colors.primary}10`,
    borderWidth: 1,
    borderColor: `${colors.primary}22`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  themeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  themeTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    color: colors.textMuted,
  },
  bodyStrong: {
    fontWeight: '700',
    color: colors.text,
  },
  bodySpacing: {
    marginTop: 4,
  },
  panel: {
    paddingHorizontal: 20,
  },
});
