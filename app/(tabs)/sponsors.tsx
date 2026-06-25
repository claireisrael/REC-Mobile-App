import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { MediaCard } from '@/components/gallery/MediaCard';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ErrorState } from '@/components/ui/ErrorState';
import { LoadingState } from '@/components/ui/LoadingState';
import { SelectField } from '@/components/ui/SelectField';
import { colors } from '@/constants/theme';
import { apiService } from '@/lib/api-service';
import { fetchConferenceMedia, fetchMediaConferences } from '@/lib/public-media-api';
import type { Conference, MediaItem } from '@/lib/types';

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'image_album', label: 'Albums' },
  { value: 'video', label: 'Videos' },
] as const;

type MediaFilter = (typeof FILTERS)[number]['value'];

export default function MediaScreen() {
  const [mediaConferences, setMediaConferences] = useState<Conference[]>([]);
  const [selectedConferenceId, setSelectedConferenceId] = useState('');
  const [conference, setConference] = useState<Conference | null>(null);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<MediaFilter>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const mediaConferenceData = await fetchMediaConferences();
        const conferences = mediaConferenceData.documents || [];

        if (!conferences.length) {
          const activeConference = await apiService.getActiveConference().catch(() => null);
          if (activeConference) setConference(activeConference);
          setError('No published conference media is available yet.');
          return;
        }

        const defaultConference =
          conferences.find((item) => item.isActive === true) || conferences[0];

        setMediaConferences(conferences);
        setSelectedConferenceId(defaultConference.$id);
        setConference(defaultConference);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conference media.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!selectedConferenceId) return undefined;

    const loadMedia = async () => {
      setMediaLoading(true);
      setError('');

      try {
        const selected = mediaConferences.find((item) => item.$id === selectedConferenceId);
        if (selected) setConference(selected);

        const media = await fetchConferenceMedia(selectedConferenceId, { limit: 100 });
        setItems(media.documents || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load conference media.');
      } finally {
        setMediaLoading(false);
      }
    };

    loadMedia();
  }, [mediaConferences, selectedConferenceId]);

  const conferenceOptions = useMemo(
    () =>
      mediaConferences.map((item) => ({
        value: item.$id,
        label: `${item.shortName || item.title || item.fullName || item.year} (${item.mediaCount ?? 0})`,
      })),
    [mediaConferences]
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items
      .filter((item) => filter === 'all' || item.mediaType === filter)
      .filter((item) => {
        if (!query) return true;
        return [item.title, item.description].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(query)
        );
      });
  }, [filter, items, search]);

  if (loading) {
    return <LoadingState />;
  }

  if (error && !conference) {
    return (
      <ErrorState
        title="Media unavailable"
        message={error || 'No active conference found.'}
      />
    );
  }

  if (!conference) {
    return (
      <ErrorState
        title="Media unavailable"
        message="No active conference found."
      />
    );
  }

  const mediaCount = conference.mediaCount || items.length || 0;
  const conferenceLabel = conference.shortName || conference.title || 'Selected conference';

  return (
    <ScreenContainer>
      <ScrollView style={styles.screen}>
        <View style={styles.hero}>
          <View style={styles.badge}>
            <Ionicons name="images-outline" size={14} color={colors.primary} />
            <Text style={styles.badgeText}>Media Library</Text>
          </View>
          <Text style={styles.title}>{conferenceLabel} albums and videos</Text>
          <Text style={styles.subtitle}>
            Explore selected conference albums and video highlights.
          </Text>
        </View>

        <View style={styles.conferenceCard}>
          <View style={styles.conferenceMeta}>
            <Text style={styles.conferenceEyebrow}>Conference media space</Text>
            <Text style={styles.conferenceName}>{conferenceLabel}</Text>
            <Text style={styles.conferenceCount}>
              {mediaCount} published media item{mediaCount === 1 ? '' : 's'}
            </Text>
          </View>

          {conferenceOptions.length > 1 ? (
            <SelectField
              label="View another conference"
              value={selectedConferenceId}
              options={conferenceOptions}
              onChange={setSelectedConferenceId}
            />
          ) : null}
        </View>

        <View style={styles.filtersCard}>
          <View style={styles.searchWrap}>
            <Ionicons name="search-outline" size={18} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search media"
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
            />
          </View>

          <View style={styles.filterRow}>
            {FILTERS.map((option) => (
              <Pressable
                key={option.value}
                style={[
                  styles.filterBtn,
                  filter === option.value && styles.filterBtnActive,
                ]}
                onPress={() => setFilter(option.value)}
              >
                <Text
                  style={[
                    styles.filterBtnText,
                    filter === option.value && styles.filterBtnTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {mediaLoading ? (
          <View style={styles.mediaLoading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.mediaLoadingText}>Loading selected conference media...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="images-outline" size={40} color={colors.primary} />
            <Text style={styles.emptyTitle}>No media available</Text>
            <Text style={styles.emptyText}>Published albums and videos will appear here.</Text>
          </View>
        ) : (
          <View style={styles.mediaList}>
            {filteredItems.map((item) => (
              <MediaCard key={item.$id} item={item} />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  hero: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 18,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
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
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  conferenceCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 14,
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  conferenceMeta: {
    gap: 4,
  },
  conferenceEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    color: colors.primary,
  },
  conferenceName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  conferenceCount: {
    fontSize: 13,
    color: colors.textMuted,
  },
  filtersCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 14,
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchWrap: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    paddingLeft: 38,
    paddingRight: 12,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.text,
  },
  filterBtnTextActive: {
    color: colors.white,
  },
  mediaLoading: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 24,
  },
  mediaLoadingText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  errorBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 13,
    color: '#991B1B',
    lineHeight: 18,
  },
  emptyState: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 24,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  mediaList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 14,
  },
});
