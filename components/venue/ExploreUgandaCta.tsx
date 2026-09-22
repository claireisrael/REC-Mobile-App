import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/theme';
import { routes } from '@/lib/routes';
import {
  excursionEdition,
  excursionForPlacement,
  fetchPromotedExcursion,
  resolveExcursionImage,
  type Excursion,
} from '@/lib/excursions-api';

type ExploreUgandaCtaProps = {
  /** Matches web placement keys: home | venue | about | program | media */
  placement?: string;
  compact?: boolean;
};

export function ExploreUgandaCta({ placement = 'venue', compact = false }: ExploreUgandaCtaProps) {
  const router = useRouter();
  const [excursion, setExcursion] = useState<Excursion | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchPromotedExcursion().then((doc) => {
      if (!cancelled) setExcursion(excursionForPlacement(doc, placement));
    });
    return () => {
      cancelled = true;
    };
  }, [placement]);

  if (!excursion) return null;

  const hero = resolveExcursionImage(excursion.content.heroImage);
  const edition = excursionEdition(excursion);

  return (
    <View style={[styles.section, compact && styles.sectionCompact]}>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.pressed]}
        onPress={() => router.navigate(routes.exploreUganda)}
      >
        {hero && !compact ? (
          <Image source={{ uri: hero }} style={styles.hero} resizeMode="cover" />
        ) : null}
        <View style={styles.overlay}>
          <View style={styles.iconWrap}>
            <Ionicons name="compass-outline" size={20} color={colors.accentDark} />
          </View>
          <View style={styles.copy}>
            <Text style={styles.eyebrow}>
              {edition} / Beyond the conference
            </Text>
            <Text style={styles.title}>{excursion.content.title}</Text>
            <Text style={styles.body} numberOfLines={compact ? 2 : 3}>
              {compact
                ? `Day trips and safari experiences with ${excursion.content.partnerName}.`
                : `Stay a little longer. Discover Uganda with ${excursion.content.partnerName}.`}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.white} />
        </View>
      </Pressable>

      <Pressable
        style={styles.partnerLink}
        onPress={() => {
          const url = excursion.content.partnerUrl;
          if (url) Linking.openURL(url);
        }}
      >
        <Text style={styles.partnerLinkText}>
          View with {excursion.content.partnerName}
        </Text>
        <Ionicons name="open-outline" size={14} color={colors.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionCompact: {
    paddingVertical: 8,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.primaryDark,
    minHeight: 140,
  },
  pressed: {
    opacity: 0.94,
  },
  hero: {
    ...StyleSheet.absoluteFill,
    opacity: 0.45,
  },
  overlay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
  },
  body: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.78)',
  },
  partnerLink: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  partnerLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
});
