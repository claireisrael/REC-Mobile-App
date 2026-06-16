import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type HallFilterProps = {
  halls: string[];
  selectedHall: string;
  onSelect: (hall: string) => void;
};

export function HallFilter({ halls, selectedHall, onSelect }: HallFilterProps) {
  const options = [{ value: 'all', label: 'All Halls' }, ...halls.map((h) => ({ value: h, label: h }))];

  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Ionicons name="business-outline" size={16} color={colors.primary} />
        <Text style={styles.label}>Venue hall</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {options.map((option) => {
          const isActive = option.value === selectedHall;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  row: {
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}12`,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
