import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type ChipGroupProps = {
  options: { label: string; value: string | number }[];
  selected: string | number;
  onSelect: (value: string | number) => void;
};

export function ChipGroup({ options, selected, onSelect }: ChipGroupProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {options.map((option) => {
        const isActive = option.value === selected;
        return (
          <Pressable
            key={String(option.value)}
            onPress={() => onSelect(option.value)}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: `${colors.primary}14`,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  chipTextActive: {
    color: colors.primary,
  },
});
