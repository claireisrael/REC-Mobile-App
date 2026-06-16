import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { Conference } from '@/lib/types';
import { getVenueMapsUrl } from '@/lib/venue-utils';

type VenueDetailsCardProps = {
  conference: Conference;
};

function ContactRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.contactRow, pressed && styles.contactRowPressed]} onPress={onPress}>
      <View style={styles.contactIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.contactBody}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
    </Pressable>
  );
}

export function VenueDetailsCard({ conference }: VenueDetailsCardProps) {
  const mapsUrl = getVenueMapsUrl(conference);
  const address = `${conference.venue || 'Venue TBD'}${
    conference.location ? `, ${conference.location}` : ''
  }`;

  return (
    <View style={styles.section}>
      <View style={styles.badge}>
        <Ionicons name="business-outline" size={14} color={colors.primary} />
        <Text style={styles.badgeText}>Conference Venue</Text>
      </View>

      <Text style={styles.venueName}>{conference.venue || 'Venue TBD'}</Text>
      {conference.location ? <Text style={styles.location}>{conference.location}</Text> : null}

      <View style={styles.contacts}>
        <View style={styles.contactRowStatic}>
          <View style={styles.contactIcon}>
            <Ionicons name="location-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.contactBody}>
            <Text style={styles.contactLabel}>Address</Text>
            <Text style={styles.contactValue}>{address}</Text>
          </View>
        </View>

        {conference.contactPhone ? (
          <ContactRow
            icon="call-outline"
            label="Phone"
            value={conference.contactPhone}
            onPress={() => Linking.openURL(`tel:${conference.contactPhone}`)}
          />
        ) : null}

        {conference.contactEmail ? (
          <ContactRow
            icon="mail-outline"
            label="Email"
            value={conference.contactEmail}
            onPress={() => Linking.openURL(`mailto:${conference.contactEmail}`)}
          />
        ) : null}
      </View>

      <Pressable
        style={({ pressed }) => [styles.directionsBtn, pressed && styles.directionsBtnPressed]}
        onPress={() => Linking.openURL(mapsUrl)}
      >
        <Ionicons name="navigate-outline" size={18} color={colors.white} />
        <Text style={styles.directionsText}>Get Directions</Text>
        <Ionicons name="open-outline" size={16} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    backgroundColor: colors.white,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: `${colors.primary}14`,
    borderWidth: 1,
    borderColor: `${colors.primary}26`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  venueName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  location: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
  },
  contacts: {
    marginTop: 18,
    gap: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
  },
  contactRowStatic: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
  },
  contactRowPressed: {
    borderColor: `${colors.primary}40`,
    backgroundColor: `${colors.primary}08`,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${colors.primary}14`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactBody: {
    flex: 1,
    minWidth: 0,
  },
  contactLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  contactValue: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  directionsBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  directionsBtnPressed: {
    backgroundColor: colors.primaryDark,
  },
  directionsText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
