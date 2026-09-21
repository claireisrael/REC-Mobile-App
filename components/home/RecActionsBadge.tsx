import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { config } from '@/lib/config';

const RECOMMENDATIONS_URL = config.recommendationsUrl;

export function RecActionsBadge() {
  if (!RECOMMENDATIONS_URL) return null;

  return (
    <View style={styles.section}>
      <Pressable
        style={({ pressed }) => [styles.badge, pressed && styles.badgePressed]}
        onPress={() => router.push('/rec-actions')}
      >
        <View style={styles.iconWrap}>
          <Ionicons name="sparkles-outline" size={18} color={colors.accentDark} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.badgeTitle}>REC25 Actions</Text>
          <Text style={styles.badgeSubtitle} numberOfLines={2}>
            Track every REC recommendation through to delivery — who is advancing it and progress across years.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.accentDark} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: colors.white,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: `${colors.accent}12`,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${colors.accent}66`,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  badgePressed: {
    backgroundColor: `${colors.accent}22`,
    borderColor: colors.accentDark,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: `${colors.accent}33`,
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
    color: colors.text,
  },
  badgeSubtitle: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
    color: colors.textMuted,
  },
});
