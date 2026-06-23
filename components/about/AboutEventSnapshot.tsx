import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { routes } from '@/lib/routes';
import type { Conference } from '@/lib/types';
import { formatDateRange } from '@/lib/program-utils';

type AboutEventSnapshotProps = {
  conference: Conference;
};

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function AboutEventSnapshot({ conference }: AboutEventSnapshotProps) {
  const router = useRouter();
  const dateRange = formatDateRange(conference.startDate, conference.endDate);
  const venueLine = [conference.venue, conference.location].filter(Boolean).join(', ') || 'Venue TBD';
  const attendees = `${(conference.maxAttendees || 1000).toLocaleString()}+ expected attendees`;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Event Snapshot</Text>

      <SnapshotRow label="Date" value={dateRange} />
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Venue</Text>
        <Pressable onPress={() => router.navigate(routes.venue)}>
          <Text style={styles.venueLink}>{venueLine}</Text>
        </Pressable>
      </View>
      <SnapshotRow label="Participation" value={attendees} />

      <Pressable
        style={({ pressed }) => [styles.venueBtn, pressed && styles.venueBtnPressed]}
        onPress={() => router.navigate(routes.venue)}
      >
        <Ionicons name="location-outline" size={16} color={colors.primary} />
        <Text style={styles.venueBtnText}>View the Venue</Text>
        <Ionicons name="chevron-forward" size={14} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 14,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  row: {
    gap: 4,
  },
  rowLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 20,
  },
  venueLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 20,
  },
  venueBtn: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: `${colors.primary}40`,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  venueBtnPressed: {
    backgroundColor: `${colors.primary}10`,
  },
  venueBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
