import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/theme';
import { routes } from '@/lib/routes';
import { formatAgendaDayDate, type ConferenceDay } from '@/lib/conference-home-utils';

type AgendaPreviewSectionProps = {
  days: ConferenceDay[];
};

export function AgendaPreviewSection({ days }: AgendaPreviewSectionProps) {
  const router = useRouter();

  if (days.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Conference Agenda</Text>
      <Text style={styles.subtitle}>Explore our comprehensive {days.length}-day program</Text>

      <View style={styles.grid}>
        {days.map((day, index) => (
          <View key={`${day.label || 'day'}-${index}`} style={styles.card}>
            <LinearGradient
              colors={[colors.primary, colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.accentBar}
            />
            <View style={styles.cardHeader}>
              <View style={styles.dayBadge}>
                <Text style={styles.dayBadgeText}>Day {index + 1}</Text>
              </View>
              {day.date ? (
                <Text style={styles.dayDate}>{formatAgendaDayDate(day.date)}</Text>
              ) : null}
            </View>
            <Text style={styles.dayLabel}>{day.label || `Day ${index + 1}`}</Text>
            {day.theme ? (
              <View style={styles.themeBox}>
                <Text style={styles.themeText}>{day.theme}</Text>
              </View>
            ) : null}
          </View>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => router.navigate(routes.program)}
      >
        <Text style={styles.buttonText}>View Full Program</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
  grid: {
    gap: 12,
  },
  card: {
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    paddingTop: 22,
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dayBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  dayDate: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  dayLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 10,
  },
  themeBox: {
    backgroundColor: `${colors.primary}0D`,
    borderWidth: 1,
    borderColor: `${colors.primary}1A`,
    borderRadius: 10,
    padding: 12,
  },
  themeText: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: `${colors.primary}33`,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: colors.white,
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
});
