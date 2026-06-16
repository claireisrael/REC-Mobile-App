import type { Conference } from '@/lib/types';

export type ConferenceDay = {
  label?: string;
  theme?: string;
  date?: string;
};

export type HomeFeature = {
  icon: string;
  title: string;
  description: string;
  color: string;
};

const DEFAULT_FEATURES: HomeFeature[] = [
  {
    icon: 'flash-outline',
    title: 'Innovation',
    description: 'Discover cutting-edge renewable energy technologies and solutions',
    color: '#F59E0B',
  },
  {
    icon: 'people-outline',
    title: 'Networking',
    description: 'Connect with industry leaders, investors, and fellow professionals',
    color: '#0B7186',
  },
  {
    icon: 'leaf-outline',
    title: 'Sustainability',
    description: 'Learn about sustainable practices and environmental impact',
    color: '#10B981',
  },
  {
    icon: 'rocket-outline',
    title: 'Future',
    description: 'Shape the future of renewable energy in Africa and beyond',
    color: '#8B5CF6',
  },
];

const FEATURE_ICON_MAP: Record<string, string> = {
  Zap: 'flash',
  Users: 'people',
  Sun: 'sunny',
  Wind: 'leaf',
  Sparkles: 'sparkles',
};

export function parseConferenceDays(daysString?: string): ConferenceDay[] {
  if (!daysString) return [];
  try {
    const parsed = JSON.parse(daysString);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return daysString.split(',').map((day) => ({ label: day.trim() }));
  }
}

export function parseSocialsJson(socialsJson?: string) {
  if (!socialsJson) {
    return { socials: {}, features: [] as HomeFeature[], googleMapsUrl: '' };
  }
  try {
    const parsed = JSON.parse(socialsJson);
    return {
      socials: parsed.socials || {},
      features: Array.isArray(parsed.features) ? parsed.features : [],
      googleMapsUrl: parsed.googleMapsUrl || '',
    };
  } catch {
    return { socials: {}, features: [] as HomeFeature[], googleMapsUrl: '' };
  }
}

const resolveFeatureColor = (color?: string) => {
  if (!color) return '#0B7186';
  if (color.includes('#')) return color;
  if (color.includes('amber') || color.includes('orange')) return '#F59E0B';
  if (color.includes('emerald') || color.includes('teal')) return '#10B981';
  if (color.includes('violet') || color.includes('purple')) return '#8B5CF6';
  return '#0B7186';
};

export function getHomeFeatures(conference: Conference): HomeFeature[] {
  const { features: rawFeatures } = parseSocialsJson(conference.socialsJson);
  const source = rawFeatures.length > 0 ? rawFeatures : DEFAULT_FEATURES;

  return source.map((feature: HomeFeature & { icon?: string }) => ({
    title: feature.title,
    description: feature.description,
    color: resolveFeatureColor(feature.color),
    icon: FEATURE_ICON_MAP[feature.icon || ''] || feature.icon || 'sparkles-outline',
  }));
}

export function getHomeStats(conference: Conference) {
  const days = parseConferenceDays(conference.days);
  return {
    maxAttendees: conference.maxAttendees || 500,
    daysCount: days.length || 3,
    countries: 20,
    speakers: 50,
  };
}

export function formatAgendaDayDate(date?: string) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}
