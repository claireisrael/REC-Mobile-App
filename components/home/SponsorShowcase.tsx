import { useEffect, useMemo, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/constants/theme';
import { flattenSponsorsForShowcase } from '@/lib/sponsor-utils';
import type { Conference, Sponsor, SponsorCategory } from '@/lib/types';

type SponsorShowcaseProps = {
  conference: Conference;
  categories: SponsorCategory[];
  sponsors: Sponsor[];
};

export function SponsorShowcase({ conference, categories, sponsors }: SponsorShowcaseProps) {
  const sponsorItems = useMemo(
    () => {
      const items = flattenSponsorsForShowcase(categories, sponsors);
      const featured = items.filter((sponsor) => sponsor.isFeatured);
      const regular = items.filter((sponsor) => !sponsor.isFeatured);
      return [...featured, ...regular].slice(0, 12);
    },
    [categories, sponsors]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (sponsorItems.length <= 1) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % sponsorItems.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [sponsorItems.length]);

  if (sponsorItems.length === 0) return null;

  const activeSponsor = sponsorItems[activeIndex] || sponsorItems[0];
  const categoryName = activeSponsor.category?.name || 'Sponsor';
  const accentColor = activeSponsor.category?.accentColor || colors.primary;

  return (
    <View style={styles.section}>
      <View style={styles.badge}>
        <Ionicons name="hand-left-outline" size={14} color={colors.primary} />
        <Text style={styles.badgeText}>Sponsors & Partners</Text>
      </View>
      <Text style={styles.title}>
        Backing {conference.shortName || 'the conference'} impact
      </Text>
      <Text style={styles.subtitle}>
        Meet the organizations supporting renewable energy collaboration, exhibition,
        investment, and sector growth.
      </Text>

      <View style={styles.featuredCard}>
        <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
        <View style={styles.logoWrap}>
          {activeSponsor.logoUrl ? (
            <Image source={{ uri: activeSponsor.logoUrl }} style={styles.logo} resizeMode="contain" />
          ) : (
            <Text style={styles.logoFallback}>{activeSponsor.name.slice(0, 2).toUpperCase()}</Text>
          )}
        </View>
        <View style={styles.metaRow}>
          <View style={[styles.categoryPill, { borderColor: `${accentColor}66` }]}>
            <Text style={[styles.categoryText, { color: accentColor }]}>{categoryName}</Text>
          </View>
          {activeSponsor.isFeatured ? (
            <View style={styles.featuredPill}>
              <Text style={styles.featuredText}>Featured Partner</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.sponsorName}>{activeSponsor.name}</Text>
        {activeSponsor.description ? (
          <Text style={styles.sponsorDescription} numberOfLines={4}>
            {activeSponsor.description}
          </Text>
        ) : null}
        {activeSponsor.siteUrl ? (
          <Pressable onPress={() => Linking.openURL(activeSponsor.siteUrl!)}>
            <Text style={styles.websiteLink}>Visit website →</Text>
          </Pressable>
        ) : null}

        {sponsorItems.length > 1 ? (
          <View style={styles.sliderControls}>
            <Text style={styles.sliderCount}>
              {activeIndex + 1} of {sponsorItems.length}
            </Text>
            <View style={styles.sliderButtons}>
              <Pressable
                style={styles.sliderButton}
                onPress={() =>
                  setActiveIndex((current) => (current - 1 + sponsorItems.length) % sponsorItems.length)
                }
              >
                <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
              </Pressable>
              <Pressable
                style={styles.sliderButton}
                onPress={() => setActiveIndex((current) => (current + 1) % sponsorItems.length)}
              >
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>
        ) : null}
      </View>

      {sponsorItems.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbRow}>
          {sponsorItems.map((sponsor, index) => (
            <Pressable
              key={sponsor.$id}
              style={[styles.thumb, activeIndex === index && styles.thumbActive]}
              onPress={() => setActiveIndex(index)}
            >
              {sponsor.logoUrl ? (
                <Image source={{ uri: sponsor.logoUrl }} style={styles.thumbLogo} resizeMode="contain" />
              ) : (
                <Text style={styles.thumbFallback}>{sponsor.name.slice(0, 2)}</Text>
              )}
              <Text style={styles.thumbName} numberOfLines={1}>
                {sponsor.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: '#F8FAFC',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: `${colors.primary}14`,
    borderWidth: 1,
    borderColor: `${colors.primary}26`,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 30,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  featuredCard: {
    marginTop: 16,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    overflow: 'hidden',
  },
  accentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  logoWrap: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    padding: 16,
  },
  logo: {
    width: 180,
    height: 80,
  },
  logoFallback: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  metaRow: {
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
  sponsorName: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  sponsorDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
  },
  websiteLink: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  sliderControls: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderCount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  sliderButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sliderButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  thumbRow: {
    gap: 10,
    paddingTop: 14,
  },
  thumb: {
    width: 110,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    alignItems: 'center',
  },
  thumbActive: {
    borderColor: `${colors.primary}55`,
    backgroundColor: `${colors.primary}0D`,
  },
  thumbLogo: {
    width: 64,
    height: 40,
    marginBottom: 6,
  },
  thumbFallback: {
    width: 64,
    height: 40,
    lineHeight: 40,
    textAlign: 'center',
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 6,
  },
  thumbName: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
});
