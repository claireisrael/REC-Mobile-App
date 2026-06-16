import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';

type HallSelectProps = {
  halls: string[];
  selectedHall: string;
  onSelect: (hall: string) => void;
};

export function HallSelect({ halls, selectedHall, onSelect }: HallSelectProps) {
  const [open, setOpen] = useState(false);

  const options = [
    { value: 'all', label: 'All Halls' },
    ...halls.map((hall) => ({ value: hall, label: hall })),
  ];

  const selectedLabel = options.find((o) => o.value === selectedHall)?.label || 'All Halls';

  const handleSelect = (value: string) => {
    onSelect(value);
    setOpen(false);
  };

  return (
    <>
      <Pressable style={styles.trigger} onPress={() => setOpen(true)}>
        <Ionicons name="filter-outline" size={16} color={colors.textMuted} />
        <Text style={styles.triggerText} numberOfLines={1}>
          {selectedLabel}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.textMuted} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Filter sessions by hall</Text>
            <ScrollView>
              {options.map((option) => {
                const isActive = option.value === selectedHall;
                return (
                  <Pressable
                    key={option.value}
                    style={[styles.option, isActive && styles.optionActive]}
                    onPress={() => handleSelect(option.value)}
                  >
                    <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                      {option.label}
                    </Text>
                    {isActive ? (
                      <Ionicons name="checkmark" size={18} color={colors.primary} />
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 44,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    minWidth: 160,
    maxWidth: 220,
  },
  triggerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: '50%',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionActive: {
    backgroundColor: `${colors.primary}08`,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  optionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
