import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

export function AboutOrganizers() {
  return (
    <View style={styles.section}>
      <Text style={styles.eyebrow}>Organized By</Text>
      <View style={styles.list}>
        <Pressable style={styles.org} onPress={() => Linking.openURL('https://memd.go.ug/')}>
          <View style={[styles.orgIcon, { backgroundColor: '#15803D' }]}>
            <Ionicons name="globe-outline" size={20} color={colors.white} />
          </View>
          <View style={styles.orgCopy}>
            <Text style={styles.orgTitle}>Ministry of Energy</Text>
            <Text style={styles.orgSubtitle}>& Mineral Development</Text>
          </View>
          <Ionicons name="open-outline" size={14} color={colors.textMuted} />
        </Pressable>

        <Pressable style={styles.org} onPress={() => Linking.openURL('https://nrep.ug')}>
          <View style={[styles.orgIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="sparkles" size={20} color={colors.white} />
          </View>
          <View style={styles.orgCopy}>
            <Text style={styles.orgTitle}>NREP</Text>
            <Text style={styles.orgSubtitle}>National Renewable Energy Platform</Text>
          </View>
          <Ionicons name="open-outline" size={14} color={colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  list: {
    gap: 10,
  },
  org: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  orgIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgCopy: {
    flex: 1,
    minWidth: 0,
  },
  orgTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  orgSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
});
