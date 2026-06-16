import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { CONFERENCE_OBJECTIVES } from '@/data/static-content';
import { colors } from '@/constants/theme';
import { useAppData } from '@/context/AppDataContext';
import { getConferenceInfo } from '@/lib/conference-info';
import { formatDateRange } from '@/lib/program-utils';

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

  return (
    <ScreenContainer>
      <ScrollView style={styles.screen}>
        <ScreenHeader
          showBack
          title={`About ${conference.shortName || conference.title}`}
          subtitle={`${formatDateRange(conference.startDate, conference.endDate)} · Annual Renewable Energy Conference & Expo`}
        />

        {conference.theme ? (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Theme</Text>
            <Text style={styles.theme}>{conference.theme}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Overview</Text>
          <Text style={styles.body}>{conference.description}</Text>
          <Text style={[styles.body, styles.bodySpacing]}>
            The conference brings together experts, innovators, policymakers, financiers, researchers,
            and practitioners to move clean energy conversations into implementation.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Objectives</Text>
          {CONFERENCE_OBJECTIVES.map((objective) => (
            <View key={objective.title} style={styles.objectiveCard}>
              <Text style={styles.objectiveTitle}>{objective.title}</Text>
              <Text style={styles.body}>{objective.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Location</Text>
          <Text style={styles.body}>
            {[conference.venue, conference.location].filter(Boolean).join(', ')}
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  section: { paddingHorizontal: 20, paddingBottom: 20 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  theme: { fontSize: 22, fontWeight: '700', color: colors.text, lineHeight: 30 },
  body: { fontSize: 15, lineHeight: 23, color: colors.textMuted },
  bodySpacing: { marginTop: 12 },
  objectiveCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  objectiveTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 6 },
});
