import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { ABOUT_HIGHLIGHTS } from '@/lib/about-content';

export function AboutHighlights() {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>Key Highlights</Text>
      <Text style={styles.subheading}>What to expect at the conference</Text>

      <View style={styles.grid}>
        {ABOUT_HIGHLIGHTS.map((item) => (
          <View key={item.title} style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={20} color={colors.white} />
            </View>
            <Text style={styles.stat}>{item.stat}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body}>{item.description}</Text>
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
    gap: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  stat: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  body: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
  },
});
