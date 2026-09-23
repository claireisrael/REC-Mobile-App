import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { colors } from '@/constants/theme';
import { useAppData } from '@/context/AppDataContext';
import { useConnectInbox } from '@/context/ConnectInboxContext';
import { useProfile } from '@/context/ProfileContext';
import {
  connectApi,
  type ConnectNotification,
  type ConnectPerson,
  type ConnectRequest,
} from '@/lib/connect-api';
import { getHeroImageSource } from '@/lib/hero-image';
import { registerConnectPushToken } from '@/lib/notifications';
import { getProfileInitials } from '@/lib/profile-api';
import { routes } from '@/lib/routes';

function statusFor(
  me: string,
  personEmail: string,
  requests: ConnectRequest[]
): ConnectRequest | null {
  const a = me.toLowerCase();
  const b = personEmail.toLowerCase();
  return (
    requests.find(
      (r) =>
        (r.fromEmail === a && r.toEmail === b) || (r.fromEmail === b && r.toEmail === a)
    ) || null
  );
}

export default function ConnectScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { conference } = useAppData();
  const { profile, hasProfile, ready: profileReady, refresh: refreshProfile } = useProfile();
  const { pendingIncomingCount, refreshInbox } = useConnectInbox();
  const [people, setPeople] = useState<ConnectPerson[]>([]);
  const [requests, setRequests] = useState<ConnectRequest[]>([]);
  const [notifications, setNotifications] = useState<ConnectNotification[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [noteTarget, setNoteTarget] = useState<ConnectPerson | null>(null);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [showBell, setShowBell] = useState(false);

  const me = profile?.email || '';

  const reload = useCallback(async () => {
    setError('');
    try {
      const latest = await refreshProfile();
      const liveEmail = (latest?.email || profile?.email || '').trim().toLowerCase();

      const [directory, myRequests, notifs] = await Promise.all([
        connectApi.listPeople(),
        liveEmail ? connectApi.listRequestsFor(liveEmail) : Promise.resolve([]),
        liveEmail ? connectApi.listNotifications(liveEmail) : Promise.resolve([]),
      ]);
      setPeople(directory);
      setRequests(myRequests);
      setNotifications(notifs);

      // Best-effort push registration (no-op in Expo Go).
      if (liveEmail) {
        void registerConnectPushToken(liveEmail).catch(() => undefined);
      }
      await refreshInbox();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load Connect');
    }
  }, [profile?.email, refreshProfile, refreshInbox]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        await reload();
        if (active) setLoading(false);
      })();
      return () => {
        active = false;
      };
    }, [reload])
  );
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = people.filter((p) => p.email.toLowerCase() !== me.toLowerCase());
    if (!q) return list;
    return list.filter((person) => {
      const hay = `${person.fullName} ${person.organization || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }, [people, search, me]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const openConnectSheet = (person: ConnectPerson) => {
    if (!hasProfile) {
      router.navigate(routes.profile);
      return;
    }
    setNoteTarget(person);
    setNote('');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const sendRequest = async () => {
    if (!profile || !noteTarget) return;
    const targetName = noteTarget.fullName;
    setBusy(true);
    setError('');
    setSuccess('');
    try {
      await connectApi.sendConnectionRequest({
        fromEmail: profile.email,
        fromName: profile.fullName,
        toEmail: noteTarget.email,
        note,
      });
      setNote('');
      setNoteTarget(null);
      setSuccess(`Request sent to ${targetName}. You’ll be notified when they respond.`);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send request');
    } finally {
      setBusy(false);
    }
  };

  const respond = async (requestId: string, status: 'accepted' | 'declined') => {
    if (!profile) return;
    setBusy(true);
    try {
      await connectApi.respondToRequest(
        requestId,
        status,
        profile.email,
        profile.fullName
      );
      setSuccess(status === 'accepted' ? 'You are now connected.' : 'Request declined.');
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update request');
    } finally {
      setBusy(false);
    }
  };

  const openBell = async () => {
    setShowBell(true);
    if (profile?.email && unreadCount > 0) {
      try {
        await connectApi.markAllNotificationsRead(profile.email);
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        await refreshInbox();
      } catch {
        // ignore
      }
    }
  };

  const renderPerson = ({ item }: { item: ConnectPerson }) => {
    const req = me ? statusFor(me, item.email, requests) : null;
    const incomingPending =
      req?.status === 'pending' && req.toEmail === me.toLowerCase();
    const outgoingPending =
      req?.status === 'pending' && req.fromEmail === me.toLowerCase();
    const accepted = req?.status === 'accepted';
    const declined = req?.status === 'declined';

    return (
      <View style={styles.personCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getProfileInitials(item.fullName)}</Text>
        </View>
        <View style={styles.personCopy}>
          <Text style={styles.personName}>{item.fullName}</Text>
          {item.organization ? <Text style={styles.personMeta}>{item.organization}</Text> : null}
          {item.registrationType ? (
            <Text style={styles.personType}>{item.registrationType}</Text>
          ) : null}
        </View>
        <View style={styles.personActions}>
          {incomingPending && req ? (
            <View style={styles.respondRow}>
              <Pressable
                style={styles.acceptBtn}
                disabled={busy}
                onPress={() => respond(req.$id, 'accepted')}
              >
                <Ionicons name="checkmark" size={18} color={colors.white} />
              </Pressable>
              <Pressable
                style={styles.declineBtn}
                disabled={busy}
                onPress={() => respond(req.$id, 'declined')}
              >
                <Ionicons name="close" size={18} color={colors.error} />
              </Pressable>
            </View>
          ) : accepted ? (
            <View style={styles.statusChip}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.statusChipText}>Connected</Text>
            </View>
          ) : outgoingPending ? (
            <View style={[styles.statusChip, styles.statusPending]}>
              <Text style={styles.statusPendingText}>Pending</Text>
            </View>
          ) : declined ? (
            <Pressable style={styles.connectBtn} onPress={() => openConnectSheet(item)}>
              <Text style={styles.connectBtnText}>Retry</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.connectBtn} onPress={() => openConnectSheet(item)}>
              <Ionicons name="person-add-outline" size={14} color={colors.primaryDark} />
              <Text style={styles.connectBtnText}>Connect</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer safeTop={false} statusBarStyle="light">
      <ImageBackground
        source={getHeroImageSource(conference?.heroImageUrl)}
        style={[styles.hero, { paddingTop: insets.top + 12 }]}
        imageStyle={styles.heroImage}
      >
        <LinearGradient
          colors={['rgba(3,40,48,0.45)', 'rgba(5,70,83,0.88)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.heroTop}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>Networking</Text>
            <Text style={styles.title}>Connect</Text>
            <Text style={styles.subtitle}>Find attendees and send connection requests</Text>
          </View>
          <Pressable style={styles.bellBtn} onPress={openBell}>
            <Ionicons name="notifications-outline" size={22} color={colors.white} />
            {unreadCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>

        <View style={styles.searchWrap}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Filter by name or organisation"
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search ? (
            <Pressable onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          ) : null}
        </View>
      </ImageBackground>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? (
        <Pressable style={styles.success} onPress={() => setSuccess('')}>
          <Ionicons name="checkmark-circle" size={18} color={colors.success} />
          <Text style={styles.successText}>{success}</Text>
        </Pressable>
      ) : null}

      {!hasProfile && profileReady ? (
        <Pressable style={styles.banner} onPress={() => router.navigate(routes.profile)}>
          <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.bannerText}>
            Finish your Profile once to unlock connection requests.
          </Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </Pressable>
      ) : null}

      {hasProfile && pendingIncomingCount > 0 ? (
        <Pressable style={styles.inboxBanner} onPress={openBell}>
          <Ionicons name="mail-unread-outline" size={18} color={colors.primaryDark} />
          <Text style={styles.inboxBannerText}>
            {pendingIncomingCount === 1
              ? '1 person wants to connect — accept or decline below.'
              : `${pendingIncomingCount} people want to connect — accept or decline below.`}
          </Text>
        </Pressable>
      ) : null}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.$id}
          renderItem={renderPerson}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={40} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No attendees found</Text>
              <Text style={styles.emptyBody}>
                {search
                  ? 'Try a different name.'
                  : 'The Connect directory is empty. Pull to refresh after sync.'}
              </Text>
            </View>
          }
        />
      )}

      <Modal visible={!!noteTarget} animationType="slide" transparent onRequestClose={() => setNoteTarget(null)}>
        <KeyboardAvoidingView
          style={styles.sheetOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable style={styles.sheetBackdrop} onPress={() => setNoteTarget(null)} />
          <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <Text style={styles.sheetTitle}>Connect with {noteTarget?.fullName}</Text>
            <Text style={styles.sheetHint}>Add an optional short note with your request.</Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Hi — I'd like to connect at REC..."
              placeholderTextColor="#9CA3AF"
              style={styles.noteInput}
              multiline
              maxLength={280}
            />
            <Pressable
              style={[styles.primaryBtn, busy && styles.btnDisabled]}
              disabled={busy}
              onPress={sendRequest}
            >
              {busy ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.primaryBtnText}>Send request</Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={showBell} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowBell(false)}>
        <View style={[styles.bellScreen, { paddingTop: Platform.OS === 'ios' ? 16 : insets.top + 8 }]}>
          <View style={styles.bellHeader}>
            <Text style={styles.bellTitle}>Notifications</Text>
            <Pressable onPress={() => setShowBell(false)} hitSlop={10}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={styles.bellList}
            ListEmptyComponent={
              <Text style={styles.emptyBody}>No notifications yet.</Text>
            }
            renderItem={({ item }) => (
              <View style={[styles.notifCard, !item.read && styles.notifUnread]}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifBody}>{item.body}</Text>
              </View>
            )}
          />
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 18,
    overflow: 'hidden',
    backgroundColor: colors.primaryDark,
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: colors.accent,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  bellBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    paddingVertical: 10,
  },
  error: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#FEF2F2',
    color: colors.error,
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    fontWeight: '600',
  },
  success: {
    marginHorizontal: 16,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: `${colors.success}14`,
    borderRadius: 10,
    padding: 12,
  },
  successText: {
    flex: 1,
    fontSize: 13,
    color: colors.success,
    fontWeight: '600',
  },
  banner: {
    marginHorizontal: 16,
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: `${colors.primary}12`,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  bannerText: {
    flex: 1,
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  inboxBanner: {
    marginHorizontal: 16,
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
    backgroundColor: `${colors.accent}33`,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  inboxBannerText: {
    flex: 1,
    fontSize: 13,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    padding: 16,
    paddingBottom: 40,
    gap: 10,
  },
  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: `${colors.primary}18`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  personCopy: {
    flex: 1,
    minWidth: 0,
  },
  personName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  personMeta: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  personType: {
    marginTop: 4,
    alignSelf: 'flex-start',
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    backgroundColor: `${colors.primary}12`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  personActions: {
    alignItems: 'flex-end',
  },
  connectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  connectBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${colors.success}18`,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  statusChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  statusPending: {
    backgroundColor: `${colors.accent}33`,
  },
  statusPendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  respondRow: {
    flexDirection: 'row',
    gap: 6,
  },
  acceptBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  emptyBody: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  sheetHint: {
    marginTop: 4,
    marginBottom: 12,
    fontSize: 13,
    color: colors.textMuted,
  },
  noteInput: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  bellScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bellHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bellTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  bellList: {
    padding: 16,
    gap: 10,
  },
  notifCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  notifUnread: {
    borderColor: `${colors.accent}99`,
    backgroundColor: `${colors.accent}14`,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  notifBody: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
