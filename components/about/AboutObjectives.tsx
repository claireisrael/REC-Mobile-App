import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { CONFERENCE_OBJECTIVES } from '@/lib/about-content';

export function AboutObjectives({ shortName }: { shortName: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Conference Objectives</Text>
      <Text style={styles.subheading}>Why you should attend {shortName}</Text>

      <View style={styles.grid}>
        {CONFERENCE_OBJECTIVES.map((objective) => (
          <View key={objective.title} style={styles.card}>
            <View style={styles.iconWrap}>
              <Ionicons name={objective.icon} size={18} color={colors.primary} />
            </View>
            <View style={styles.copy}>
              <Text style={styles.title}>{objective.title}</Text>
              <Text style={styles.body}>{objective.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 10,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 6,
  },
  grid: {
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  body: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
