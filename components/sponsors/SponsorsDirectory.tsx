import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { SponsorDetailModal, type SponsorWithCategory } from '@/components/sponsors/SponsorDetailModal';
import { SponsorLogo } from '@/components/sponsors/SponsorLogo';
import { colors } from '@/constants/theme';
import { groupSponsorsByCategory } from '@/lib/sponsor-utils';
import type { Sponsor, SponsorCategory } from '@/lib/types';

type SponsorsDirectoryProps = {
  categories: SponsorCategory[];
  sponsors: Sponsor[];
};

export function SponsorsDirectory({ categories, sponsors }: SponsorsDirectoryProps) {
  const { width } = useWindowDimensions();
  const [selectedSponsor, setSelectedSponsor] = useState<SponsorWithCategory | null>(null);
  const groups = groupSponsorsByCategory(categories, sponsors);

  const horizontalPadding = 16;
  const gap = 10;
  const cardWidth = (width - horizontalPadding * 2 - gap) / 2;

  if (groups.length === 0) {
    return (
      <View style={styles.emptyWrap}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>Sponsors coming soon</Text>
          <Text style={styles.emptyText}>
            Sponsor and partner information will appear here once it has been published.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.directory}>
        {groups.map(({ category, sponsors: categorySponsors }) => {
          const accentColor = category.accentColor || colors.primary;

          return (
            <View key={category.$id} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionHeaderText}>
                  <View style={[styles.categoryBadge, { borderColor: `${accentColor}66` }]}>
                    <Text style={[styles.categoryBadgeText, { color: accentColor }]}>
                      {category.name}
                    </Text>
                  </View>
                  {category.description ? (
                    <Text style={styles.categoryDescription}>{category.description}</Text>
                  ) : null}
                </View>
                <Text style={styles.orgCount}>
                  {categorySponsors.length}{' '}
                  {categorySponsors.length === 1 ? 'organization' : 'organizations'}
                </Text>
              </View>

              <View style={styles.grid}>
                {categorySponsors.map((sponsor) => (
                  <View key={sponsor.$id} style={[styles.card, { width: cardWidth }]}>
                    <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
                    <Pressable
                      style={({ pressed }) => [styles.cardBody, pressed && styles.cardPressed]}
                      onPress={() => setSelectedSponsor({ ...sponsor, category })}
                    >
                      <View style={styles.logoWrap}>
                        <SponsorLogo sponsor={sponsor} />
                      </View>
                      <Text style={styles.sponsorName} numberOfLines={2}>
                        {sponsor.name}
                      </Text>
                    </Pressable>
                    {sponsor.siteUrl ? (
                      <Pressable
                        style={styles.websiteLink}
                        onPress={() => Linking.openURL(sponsor.siteUrl!)}
                      >
                        <Text style={styles.websiteLinkText}>Visit website</Text>
                        <Ionicons name="open-outline" size={13} color={colors.primary} />
                      </Pressable>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </View>

      <SponsorDetailModal sponsor={selectedSponsor} onClose={() => setSelectedSponsor(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  directory: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionHeader: {
    marginBottom: 14,
    gap: 6,
  },
  sectionHeaderText: {
    gap: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: '800',
  },
  categoryDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  orgCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  accentBar: {
    height: 3,
    width: '100%',
  },
  cardBody: {
    padding: 12,
    alignItems: 'center',
  },
  cardPressed: {
    backgroundColor: '#F8FAFC',
  },
  logoWrap: {
    width: '100%',
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 10,
    marginBottom: 10,
  },
  sponsorName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 18,
  },
  websiteLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingBottom: 12,
  },
  websiteLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyWrap: {
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
