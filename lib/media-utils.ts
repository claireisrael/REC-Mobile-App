import type { MediaItem } from '@/lib/types';

export function getMediaItemUrl(item: MediaItem) {
  return item.mediaType === 'video' ? item.videoUrl : item.externalUrl;
}

export function getMediaTypeLabel(item: MediaItem) {
  return item.mediaType === 'video' ? 'Video' : 'Image album';
}

export function getMediaActionLabel(item: MediaItem) {
  return item.mediaType === 'video' ? 'Watch video' : 'View full album';
}

export function getMediaPreviewImages(item: MediaItem, limit = 5) {
  if (item.mediaType !== 'image_album') return [];

  const fromSamples = (item.sampleImages || [])
    .map((image) => image.url)
    .filter(Boolean);

  if (fromSamples.length > 0) {
    return fromSamples.slice(0, limit);
  }

  return item.coverImageUrl ? [item.coverImageUrl] : [];
}
