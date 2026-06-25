import { Ionicons } from '@expo/vector-icons';
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import {
  getMediaActionLabel,
  getMediaItemUrl,
  getMediaPreviewImages,
  getMediaTypeLabel,
} from '@/lib/media-utils';
import type { MediaItem } from '@/lib/types';

type MediaCardProps = {
  item: MediaItem;
};

export function MediaCard({ item }: MediaCardProps) {
  const previewImages = getMediaPreviewImages(item, 5);
  const mediaUrl = getMediaItemUrl(item);

  return (
    <View style={styles.card}>
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

      <View style={styles.body}>
        <Text style={styles.title}>{item.title}</Text>
        {item.description ? (
          <Text style={styles.description} numberOfLines={3}>
            {item.description}
          </Text>
        ) : null}

        {previewImages.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewRow}>
            {previewImages.map((imageUrl, index) => (
              <Image
                key={`${item.$id}-preview-${index + 1}`}
                source={{ uri: imageUrl }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) : null}

        {mediaUrl ? (
          <Pressable
            style={({ pressed }) => [styles.actionBtn, pressed && styles.actionBtnPressed]}
            onPress={() => Linking.openURL(mediaUrl)}
          >
            <Text style={styles.actionBtnText}>{getMediaActionLabel(item)}</Text>
            <Ionicons name="open-outline" size={16} color={colors.white} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
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
  body: {
    padding: 14,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  previewRow: {
    gap: 8,
  },
  previewImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  actionBtnPressed: {
    backgroundColor: colors.primaryDark,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
