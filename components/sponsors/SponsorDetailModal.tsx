import { Ionicons } from '@expo/vector-icons';
import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SponsorLogo } from '@/components/sponsors/SponsorLogo';
import { colors } from '@/constants/theme';
import type { Sponsor, SponsorCategory } from '@/lib/types';

export type SponsorWithCategory = Sponsor & {
  category?: SponsorCategory | null;
};

type SponsorDetailModalProps = {
  sponsor: SponsorWithCategory | null;
  onClose: () => void;
};

export function SponsorDetailModal({ sponsor, onClose }: SponsorDetailModalProps) {
  if (!sponsor) return null;

  const accentColor = sponsor.category?.accentColor || colors.primary;

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textMuted} />
            </Pressable>

            <View style={styles.logoWrap}>
              <SponsorLogo sponsor={sponsor} large />
            </View>

            <View style={styles.badges}>
              {sponsor.category?.name ? (
                <View style={[styles.categoryPill, { borderColor: `${accentColor}66` }]}>
                  <Text style={[styles.categoryText, { color: accentColor }]}>
                    {sponsor.category.name}
                  </Text>
                </View>
              ) : null}
              {sponsor.isFeatured ? (
                <View style={styles.featuredPill}>
                  <Text style={styles.featuredText}>Featured Partner</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.name}>{sponsor.name}</Text>
            <Text style={styles.profileLabel}>Sponsor and partner profile</Text>

            {sponsor.description ? (
              <View style={styles.aboutBox}>
                <Text style={styles.aboutTitle}>About</Text>
                <Text style={styles.aboutText}>{sponsor.description}</Text>
              </View>
            ) : (
              <View style={styles.aboutBox}>
                <Text style={styles.aboutPlaceholder}>
                  More details about this sponsor will be published soon.
                </Text>
              </View>
            )}

            {sponsor.siteUrl ? (
              <Pressable
                style={({ pressed }) => [styles.visitBtn, pressed && styles.visitBtnPressed]}
                onPress={() => Linking.openURL(sponsor.siteUrl!)}
              >
                <Text style={styles.visitBtnText}>Visit website</Text>
                <Ionicons name="open-outline" size={16} color={colors.white} />
              </Pressable>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    maxHeight: '88%',
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  accentBar: {
    height: 4,
    width: '100%',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 8,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: 4,
    marginBottom: 4,
  },
  logoWrap: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  categoryPill: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.white,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
  },
  featuredPill: {
    backgroundColor: `${colors.accent}26`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A6200',
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 30,
  },
  profileLabel: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textMuted,
  },
  aboutBox: {
    marginTop: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  aboutTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
  },
  aboutPlaceholder: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textMuted,
  },
  visitBtn: {
    marginTop: 20,
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  visitBtnPressed: {
    backgroundColor: colors.primaryDark,
  },
  visitBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
