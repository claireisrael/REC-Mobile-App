import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

export function OrganizersSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.eyebrow}>Organized By</Text>
      <View style={styles.row}>
        <Pressable style={styles.org} onPress={() => Linking.openURL('https://memd.go.ug/')}>
          <View style={[styles.orgIcon, { backgroundColor: '#15803D' }]}>
            <Ionicons name="globe-outline" size={22} color={colors.white} />
          </View>
          <View>
            <Text style={styles.orgTitle}>Ministry of Energy</Text>
            <Text style={styles.orgSubtitle}>& Mineral Development</Text>
          </View>
        </Pressable>

        <Pressable style={styles.org} onPress={() => Linking.openURL('https://nrep.ug')}>
          <View style={[styles.orgIcon, { backgroundColor: colors.primary }]}>
            <Ionicons name="sparkles" size={22} color={colors.white} />
          </View>
          <View>
            <Text style={styles.orgTitle}>NREP</Text>
            <Text style={styles.orgSubtitle}>National Renewable Energy Platform</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  row: {
    width: '100%',
    gap: 16,
  },
  org: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  orgIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orgTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  orgSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
});
