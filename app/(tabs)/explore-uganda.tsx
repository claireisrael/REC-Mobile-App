import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ScreenHeader } from '@/components/layout/ScreenHeader';
import { colors } from '@/constants/theme';
import {
  excursionEdition,
  fetchPromotedExcursion,
  isExcursionPromoted,
  partnerDestination,
  resolveExcursionImage,
  type Excursion,
  type ExcursionPackage,
} from '@/lib/excursions-api';

function PackageCard({
  item,
  partnerName,
  onPartner,
}: {
  item: ExcursionPackage;
  partnerName: string;
  onPartner: () => void;
}) {
  const image = resolveExcursionImage(item.image);
  return (
    <View style={styles.packageCard}>
      {image ? (
        <Image source={{ uri: image }} style={styles.packageImage} resizeMode="cover" />
      ) : null}
      <View style={styles.packageBody}>
        <Text style={styles.duration}>
          <Ionicons name="time-outline" size={13} color={colors.primary} /> {item.duration}
        </Text>
        <Text style={styles.packageTitle}>{item.title}</Text>
        <Text style={styles.packageSummary}>{item.summary}</Text>
        <Pressable style={styles.subtleLink} onPress={onPartner}>
          <Text style={styles.subtleLinkText}>Explore with {partnerName}</Text>
          <Ionicons name="open-outline" size={14} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

export default function ExploreUgandaScreen() {
  const [excursion, setExcursion] = useState<Excursion | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  const load = useCallback(async () => {
    const doc = await fetchPromotedExcursion();
    setExcursion(doc && isExcursionPromoted(doc) ? doc : null);
    setUnavailable(!doc);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      await load();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const openPartner = (source = 'direct') => {
    if (!excursion) return;
    const url = partnerDestination(excursion, source);
    if (url) Linking.openURL(url);
  };

  if (loading) {
    return (
      <ScreenContainer>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenContainer>
    );
  }

  if (!excursion) {
    return (
      <ScreenContainer>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <ScreenHeader
            showBack
            title="Explore Uganda"
            subtitle={
              unavailable
                ? 'Excursion details are temporarily unavailable. Pull to refresh.'
                : 'There are no published conference excursions at the moment.'
            }
          />
        </ScrollView>
      </ScreenContainer>
    );
  }

  const { content } = excursion;
  const hero = resolveExcursionImage(content.heroImage);
  const dayTrips = content.packages.filter((p) => p.group === 'day');
  const multiDay = content.packages.filter((p) => p.group === 'multiday');
  const past = Date.now() >= Date.parse(excursion.endsAt);

  return (
    <ScreenContainer>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ScreenHeader
          showBack
          title={content.title}
          subtitle={`${excursionEdition(excursion)} / Delegate excursions`}
        />

        {hero ? (
          <View style={styles.heroWrap}>
            <Image source={{ uri: hero }} style={styles.hero} resizeMode="cover" />
            <Text style={styles.credit}>Photography: {content.partnerName}</Text>
          </View>
        ) : null}

        {past ? (
          <View style={styles.archive}>
            <Text style={styles.archiveText}>
              This excursion promotion has ended. Contact {content.partnerName} for current options.
            </Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.partnerLabel}>
            Excursions operated by <Text style={styles.partnerName}>{content.partnerName}</Text>
          </Text>
          <Text style={styles.intro}>{content.introduction}</Text>

          <View style={styles.facts}>
            <View style={styles.fact}>
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
              <View style={styles.factCopy}>
                <Text style={styles.factLabel}>When</Text>
                <Text style={styles.factValue}>{content.dateLabel}</Text>
              </View>
            </View>
            <View style={styles.fact}>
              <Ionicons name="navigate-outline" size={18} color={colors.primary} />
              <View style={styles.factCopy}>
                <Text style={styles.factLabel}>Departure</Text>
                <Text style={styles.factValue}>{content.departure}</Text>
              </View>
            </View>
          </View>

          {!past ? (
            <Pressable style={styles.primaryBtn} onPress={() => openPartner('direct')}>
              <Text style={styles.primaryBtnText}>
                View itineraries with {content.partnerName}
              </Text>
              <Ionicons name="open-outline" size={18} color={colors.text} />
            </Pressable>
          ) : null}
        </View>

        {dayTrips.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.groupEyebrow}>Day trips</Text>
            <Text style={styles.groupTitle}>A day of discovery</Text>
            {dayTrips.map((item) => (
              <PackageCard
                key={item.title}
                item={item}
                partnerName={content.partnerName}
                onPartner={() => openPartner('direct')}
              />
            ))}
          </View>
        ) : null}

        {multiDay.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.groupEyebrow}>Multi-day safaris</Text>
            <Text style={styles.groupTitle}>Go a little further</Text>
            {multiDay.map((item) => (
              <PackageCard
                key={item.title}
                item={item}
                partnerName={content.partnerName}
                onPartner={() => openPartner('direct')}
              />
            ))}
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.groupEyebrow}>Before you go</Text>
          <Text style={styles.planning}>{content.planningNotes}</Text>
          {content.contactEmail ? (
            <Pressable onPress={() => Linking.openURL(`mailto:${content.contactEmail}`)}>
              <Text style={styles.contact}>{content.contactEmail}</Text>
            </Pressable>
          ) : null}
          {content.contactPhone ? (
            <Pressable
              onPress={() =>
                Linking.openURL(`tel:${content.contactPhone!.replace(/\s/g, '')}`)
              }
            >
              <Text style={styles.contact}>{content.contactPhone}</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 28 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroWrap: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    backgroundColor: colors.primaryDark,
  },
  hero: { width: '100%', height: '100%' },
  credit: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
  },
  archive: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: '#FEF3C7',
    borderRadius: 10,
    padding: 12,
  },
  archiveText: { fontSize: 13, color: '#92400E', lineHeight: 18 },
  section: { paddingHorizontal: 20, marginBottom: 20 },
  partnerLabel: { fontSize: 13, color: colors.textMuted, marginBottom: 8 },
  partnerName: { fontWeight: '700', color: colors.text },
  intro: { fontSize: 15, lineHeight: 22, color: colors.text, marginBottom: 14 },
  facts: { gap: 12, marginBottom: 16 },
  fact: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  factCopy: { flex: 1 },
  factLabel: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  factValue: { marginTop: 2, fontSize: 14, lineHeight: 20, color: colors.text },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  primaryBtnText: { fontSize: 14, fontWeight: '800', color: colors.text, flexShrink: 1 },
  groupEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: colors.primary,
    marginBottom: 4,
  },
  groupTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 12 },
  packageCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  packageImage: { width: '100%', height: 160 },
  packageBody: { padding: 14 },
  duration: { fontSize: 12, fontWeight: '700', color: colors.primary, marginBottom: 6 },
  packageTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 6 },
  packageSummary: { fontSize: 13, lineHeight: 19, color: colors.textMuted },
  subtleLink: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subtleLinkText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  planning: { fontSize: 14, lineHeight: 21, color: colors.textMuted, marginBottom: 12 },
  contact: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 6,
  },
  bottomSpacer: { height: 12 },
});
