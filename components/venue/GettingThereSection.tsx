import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import { getAccommodationCopy } from '@/lib/venue-utils';

type GettingThereSectionProps = {
  venue?: string;
};

const TRAVEL_ITEMS = [
  {
    id: 'air',
    title: 'By Air',
    icon: 'airplane-outline' as const,
    color: '#0284C7',
    body:
      'Entebbe International Airport (EBB) is the main international airport, located approximately 40km from Kampala city centre. Multiple international airlines operate direct and connecting flights to Entebbe.',
  },
  {
    id: 'hotel',
    title: 'Accommodation',
    icon: 'bed-outline' as const,
    color: '#FFB803',
    dynamic: true,
  },
  {
    id: 'transport',
    title: 'Local Transport',
    icon: 'car-outline' as const,
    color: '#059669',
    body:
      'Airport transfers and local transportation can be arranged through the hotel or via ride-hailing services such as Uber and Bolt, which are widely available in Kampala.',
  },
];

export function GettingThereSection({ venue }: GettingThereSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>Getting There</Text>
        <Text style={styles.subtitle}>
          Travel information for local and international attendees
        </Text>
      </View>

      <View style={styles.grid}>
        {TRAVEL_ITEMS.map((item) => {
          const body = item.dynamic ? getAccommodationCopy(venue) : item.body;

          return (
            <View key={item.id} style={styles.card}>
              <View style={[styles.iconWrap, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={22} color={colors.white} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardBody}>{body}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
    textAlign: 'center',
    maxWidth: 320,
  },
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
});
