import type { MediaConferencesResponse, MediaListResponse } from './types';
import { config } from './config';

const PUBLIC_MEDIA_TIMEOUT_MS = 15000;

type MediaQueryOptions = {
  type?: 'image_album' | 'video';
  featured?: boolean;
  page?: number;
  limit?: number;
};

async function fetchJson<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PUBLIC_MEDIA_TIMEOUT_MS);

  try {
    const response = await fetch(`${config.apiBaseUrl}${path}`, {
      signal: controller.signal,
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Failed to load media (${response.status})`);
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('The media request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchMediaConferences(): Promise<MediaConferencesResponse> {
  return fetchJson<MediaConferencesResponse>('/api/media/conferences');
}

export async function fetchConferenceMedia(
  conferenceId: string,
  options: MediaQueryOptions = {}
): Promise<MediaListResponse> {
  const params = new URLSearchParams({
    conferenceId,
    page: String(options.page || 1),
    limit: String(options.limit || 25),
  });

  if (options.type) params.set('type', options.type);
  if (options.featured) params.set('featured', 'true');

  return fetchJson<MediaListResponse>(`/api/media/public?${params.toString()}`);
}
