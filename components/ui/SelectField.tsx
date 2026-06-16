import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useMemo, useState } from 'react';

import { colors } from '@/constants/theme';

type Option = { label: string; value: string };

type SelectFieldProps = {
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
};

export function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select...',
  required,
  error,
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selectedLabel = options.find((option) => option.value === value)?.label;
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <Pressable
        style={[styles.trigger, error ? styles.triggerError : null]}
        onPress={() => setOpen(true)}
      >
        <Text style={selectedLabel ? styles.value : styles.placeholder}>
          {selectedLabel || placeholder}
        </Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{label}</Text>
            <Pressable onPress={() => setOpen(false)}>
              <Text style={styles.close}>Done</Text>
            </Pressable>
          </View>
          <TextInput
            style={styles.search}
            value={query}
            onChangeText={setQuery}
            placeholder="Search..."
            placeholderTextColor="#9CA3AF"
          />
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.value}
            renderItem={({ item }) => (
              <Pressable
                style={styles.option}
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                  setQuery('');
                }}
              >
                <Text style={item.value === value ? styles.optionActive : styles.optionText}>
                  {item.label}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 6 },
  required: { color: colors.error },
  trigger: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  triggerError: { borderColor: colors.error },
  value: { fontSize: 15, color: colors.text },
  placeholder: { fontSize: 15, color: '#9CA3AF' },
  error: { marginTop: 4, fontSize: 12, color: colors.error },
  modal: { flex: 1, backgroundColor: colors.background, paddingTop: 56 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  close: { fontSize: 16, fontWeight: '600', color: colors.primary },
  search: {
    marginHorizontal: 20,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: colors.white,
    fontSize: 15,
  },
  option: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  optionText: { fontSize: 15, color: colors.text },
  optionActive: { fontSize: 15, color: colors.primary, fontWeight: '700' },
});
