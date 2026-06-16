import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { Conference } from '@/lib/types';
import { getVenueMapsUrl } from '@/lib/venue-utils';

type VenueMapCardProps = {
  conference: Conference;
};

export function VenueMapCard({ conference }: VenueMapCardProps) {
  const mapsUrl = getVenueMapsUrl(conference);

  return (
    <View style={styles.wrap}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
        onPress={() => Linking.openURL(mapsUrl)}
      >
        <View style={styles.mapArt}>
          <View style={styles.gridLineH} />
          <View style={styles.gridLineV} />
          <View style={styles.pinWrap}>
            <Ionicons name="location" size={28} color={colors.primary} />
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerText}>
            <Text style={styles.mapTitle} numberOfLines={1}>
              {conference.venue || 'Conference venue'}
            </Text>
            <Text style={styles.mapHint}>Tap to open in Google Maps</Text>
          </View>
          <View style={styles.openIcon}>
            <Ionicons name="navigate" size={18} color={colors.white} />
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.white,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.96,
  },
  mapArt: {
    height: 180,
    backgroundColor: '#E8F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  gridLineH: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(11,113,134,0.12)',
  },
  gridLineV: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(11,113,134,0.12)',
  },
  pinWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: `${colors.primary}33`,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerText: {
    flex: 1,
    minWidth: 0,
    paddingRight: 12,
  },
  mapTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  mapHint: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  openIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
