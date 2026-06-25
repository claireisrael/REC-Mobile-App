import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/theme';
import {
  getMediaActionLabel,
  getMediaItemUrl,
  getMediaTypeLabel,
} from '@/lib/media-utils';
import { routes } from '@/lib/routes';
import type { Conference, MediaItem } from '@/lib/types';

type MediaShowcaseProps = {
  conference: Conference;
  items: MediaItem[];
};

export function MediaShowcase({ conference, items }: MediaShowcaseProps) {
  const router = useRouter();
  const visibleItems = items.filter((item) => item?.isPublished !== false).slice(0, 8);

  if (!visibleItems.length) return null;

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <View style={styles.badge}>
            <Ionicons name="images-outline" size={14} color={colors.primary} />
            <Text style={styles.badgeText}>Conference media</Text>
          </View>
          <Text style={styles.title}>
            Highlights from {conference.shortName || 'the conference'}
          </Text>
          <Text style={styles.subtitle}>
            Browse selected albums and videos from the Renewable Energy Conference & Expo.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [styles.viewAllBtn, pressed && styles.viewAllBtnPressed]}
          onPress={() => router.navigate(routes.sponsors)}
        >
          <Text style={styles.viewAllBtnText}>View all media</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}
      >
        {visibleItems.map((item) => {
          const mediaUrl = getMediaItemUrl(item);

          return (
            <Pressable
              key={item.$id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => {
                if (mediaUrl) Linking.openURL(mediaUrl);
              }}
            >
              <View style={styles.coverWrap}>
                {item.coverImageUrl ? (
                  <Image source={{ uri: item.coverImageUrl }} style={styles.cover} resizeMode="cover" />
                ) : (
                  <View style={styles.coverFallback}>
                    <Ionicons
                      name={item.mediaType === 'video' ? 'play-circle-outline' : 'images-outline'}
                      size={40}
                      color={colors.white}
                    />
                  </View>
                )}
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{getMediaTypeLabel(item)}</Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                {item.description ? (
                  <Text style={styles.cardDescription} numberOfLines={3}>
                    {item.description}
                  </Text>
                ) : null}
                <View style={styles.cardAction}>
                  <Text style={styles.cardActionText}>{getMediaActionLabel(item)}</Text>
                  <Ionicons name="arrow-forward" size={14} color={colors.primary} />
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 24,
    paddingBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 16,
    gap: 14,
    marginBottom: 14,
  },
  headerCopy: {
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: `${colors.primary}14`,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  viewAllBtn: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  viewAllBtnPressed: {
    backgroundColor: colors.primaryDark,
  },
  viewAllBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
  carousel: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: 8,
  },
  card: {
    width: 280,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardPressed: {
    opacity: 0.92,
  },
  coverWrap: {
    height: 180,
    backgroundColor: '#E5E7EB',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  coverFallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  cardBody: {
    padding: 14,
    gap: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
  },
  cardAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  cardActionText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
});
