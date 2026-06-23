import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { routes } from '@/lib/routes';
import type { Conference } from '@/lib/types';

type ViewVenueBadgeProps = {
  conference: Conference;
};

export function ViewVenueBadge({ conference }: ViewVenueBadgeProps) {
  const router = useRouter();
  const venueLabel = [conference.venue, conference.location].filter(Boolean).join(', ');

  return (
    <View style={styles.section}>
      <Pressable
        style={({ pressed }) => [styles.badge, pressed && styles.badgePressed]}
        onPress={() => router.navigate(routes.venue)}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="location-outline" size={18} color={colors.primary} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.badgeTitle}>View the Venue</Text>
          {venueLabel ? (
            <Text style={styles.badgeSubtitle} numberOfLines={2}>
              {venueLabel}
            </Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  badgePressed: {
    backgroundColor: `${colors.primary}08`,
    borderColor: `${colors.primary}55`,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  badgeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primary,
  },
  badgeSubtitle: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textMuted,
  },
});
