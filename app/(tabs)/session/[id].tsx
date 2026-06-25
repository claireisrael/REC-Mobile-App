import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import RenderHTML from 'react-native-render-html';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { colors } from '@/constants/theme';
import { useSession } from '@/context/AppDataContext';
import { formatTimeWithTimezone } from '@/lib/program-utils';
import { getSessionSpanLabel } from '@/lib/schedule-utils';

export default function SessionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const session = useSession(id);

  if (!session) {
    return (
      <ScreenContainer>
        <ScreenHeader showBack title="Session" />
        <View style={styles.missing}>
          <Text style={styles.missingTitle}>Session not found</Text>
          <Text style={styles.missingText}>This session may no longer be published.</Text>
        </View>
      </ScreenContainer>
    );
  }

  const start = formatTimeWithTimezone(session.startTime);
  const end = formatTimeWithTimezone(session.toTime);
  const spanLabel = session.sessionSpanType ? getSessionSpanLabel(session.sessionSpanType) : '';

  return (
    <ScreenContainer>
      <ScrollView style={styles.screen}>
        <ScreenHeader showBack title="Session details" />

        <View style={styles.header}>
          <Text style={styles.time}>
            {start.kampala} - {end.kampala} EAT
          </Text>
          {session.venueHall ? <Text style={styles.hall}>{session.venueHall}</Text> : null}
          <Text style={styles.title}>{session.title}</Text>
          {session.theme ? <Text style={styles.theme}>{session.theme}</Text> : null}
          {spanLabel && session.sessionSpanType !== 'CUSTOM' ? (
            <Text style={styles.span}>{spanLabel}</Text>
          ) : null}
          {session.organizer ? <Text style={styles.organizer}>{session.organizer}</Text> : null}
        </View>

        {session.preamble ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this session</Text>
            <RenderHTML
              contentWidth={320}
              source={{ html: session.preamble }}
              baseStyle={styles.html}
            />
          </View>
        ) : null}

        {session.speakers ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Speakers</Text>
            <RenderHTML
              contentWidth={320}
              source={{ html: session.speakers }}
              baseStyle={styles.html}
            />
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    marginHorizontal: 20,
    marginBottom: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  hall: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  title: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 28,
  },
  theme: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
    color: '#8A6200',
  },
  span: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textMuted,
  },
  organizer: {
    marginTop: 10,
    fontSize: 14,
    color: colors.textMuted,
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  html: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  missingTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  missingText: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
