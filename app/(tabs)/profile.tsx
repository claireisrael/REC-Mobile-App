import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ProfileSetupModal } from '@/components/profile/ProfileSetupModal';
import { FormField } from '@/components/ui/FormField';
import { colors } from '@/constants/theme';
import {
  buildVCard,
  clearProfileSession,
  getProfileInitials,
  loadProfileSession,
  saveLocalProfile,
  saveProfileSession,
  type NetworkingProfile,
} from '@/lib/profile-api';

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.contactRow}>
      <View style={styles.contactIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.contactCopy}>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [organization, setOrganization] = useState('');
  const [profile, setProfile] = useState<NetworkingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

  const applyProfile = useCallback((next: NetworkingProfile) => {
    setProfile(next);
    setEmail(next.email);
    setFullName(next.fullName || '');
    setPhone(next.phone || '');
    setAddress(next.address || '');
    setOrganization(next.organization || '');
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const session = await loadProfileSession();
        if (cancelled) return;
        if (session?.profile?.fullName) {
          applyProfile(session.profile);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [applyProfile]);

  const saveProfile = async () => {
    setError('');
    setBusy(true);
    try {
      const session = saveLocalProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        organization: organization.trim(),
      });
      await saveProfileSession(session);
      applyProfile(session.profile);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save profile');
    } finally {
      setBusy(false);
    }
  };

  const clearProfile = async () => {
    await clearProfileSession();
    setProfile(null);
    setEmail('');
    setFullName('');
    setPhone('');
    setAddress('');
    setOrganization('');
    setEditing(false);
    setError('');
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

  const vCardPayload = profile
    ? buildVCard({
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        organization: profile.organization,
      })
    : '';

  const initials = getProfileInitials(profile?.fullName || fullName || 'ME');

  return (
    <ScreenContainer safeTop={false} statusBarStyle="light">
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={['#054653', '#0B7186']} style={[styles.hero, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.heroKicker}>Networking</Text>
          <Text style={styles.heroTitle}>My profile</Text>
          <Text style={styles.heroSubtitle}>Share your contact details with a QR code</Text>

          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            {profile ? (
              <View>
                <Text style={styles.heroName}>{profile.fullName}</Text>
                {profile.organization ? (
                  <Text style={styles.heroOrg}>{profile.organization}</Text>
                ) : null}
              </View>
            ) : (
              <Text style={styles.heroOrg}>Complete your details to get your QR card</Text>
            )}
          </View>
        </LinearGradient>

        <View style={styles.sheet}>
          {profile ? (
            <>
              <View style={styles.qrCard}>
                <Text style={styles.sectionTitle}>Your QR card</Text>
                <Text style={styles.sectionHint}>Others can scan this to save your contact</Text>
                <View style={styles.qrFrame}>
                  {vCardPayload ? (
                    <QRCode value={vCardPayload} size={196} backgroundColor="#FFFFFF" color="#054653" />
                  ) : null}
                </View>
                <View style={styles.qrBadge}>
                  <Ionicons name="qr-code-outline" size={14} color={colors.primaryDark} />
                  <Text style={styles.qrBadgeText}>Scan to share</Text>
                </View>
              </View>

              <View style={styles.detailsCard}>
                <Text style={styles.sectionTitle}>Contact details</Text>
                <ContactRow icon="mail-outline" label="Email" value={profile.email} />
                <ContactRow icon="call-outline" label="Phone" value={profile.phone} />
                <ContactRow icon="location-outline" label="Address" value={profile.address} />
                {profile.organization ? (
                  <ContactRow
                    icon="business-outline"
                    label="Organization"
                    value={profile.organization}
                  />
                ) : null}
              </View>

              <Pressable style={styles.primaryBtn} onPress={() => setEditing(true)}>
                <Ionicons name="create-outline" size={18} color={colors.white} />
                <Text style={styles.primaryBtnText}>Edit profile</Text>
              </Pressable>

              <Pressable style={styles.linkBtn} onPress={clearProfile}>
                <Text style={styles.linkText}>Clear profile from this phone</Text>
              </Pressable>
            </>
          ) : null}
        </View>
      </ScrollView>

      {!profile ? (
        <ProfileSetupModal
          visible={!loading}
          onComplete={(next) => {
            applyProfile(next);
            setEditing(false);
          }}
        />
      ) : null}

      <Modal visible={editing && !!profile} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          style={styles.editScreen}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.editHeader, { paddingTop: Platform.OS === 'ios' ? 16 : insets.top + 8 }]}>
            <Text style={styles.editTitle}>Edit profile</Text>
            <Pressable onPress={() => setEditing(false)} hitSlop={10}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={[styles.editForm, { paddingBottom: Math.max(insets.bottom, 24) }]}
            keyboardShouldPersistTaps="handled"
          >
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <FormField label="Full name" required value={fullName} onChangeText={setFullName} />
            <FormField
              label="Email"
              required
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <FormField
              label="Phone"
              required
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <FormField
              label="Address"
              required
              value={address}
              onChangeText={setAddress}
              multiline
            />
            <FormField
              label="Organization"
              value={organization}
              onChangeText={setOrganization}
              placeholder="Optional"
            />
            <Pressable
              style={[styles.primaryBtn, busy && styles.btnDisabled]}
              disabled={busy}
              onPress={saveProfile}
            >
              {busy ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.primaryBtnText}>Save changes</Text>
              )}
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingBottom: 40,
  },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 36,
  },
  heroKicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    color: colors.accent,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
  },
  heroSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  avatarWrap: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  heroName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.white,
  },
  heroOrg: {
    marginTop: 2,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    maxWidth: 240,
  },
  sheet: {
    marginTop: -18,
    paddingHorizontal: 20,
    gap: 16,
  },
  qrCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  detailsCard: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    alignSelf: 'stretch',
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  sectionHint: {
    alignSelf: 'stretch',
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 16,
  },
  qrFrame: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E8EEF2',
  },
  qrBadge: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${colors.accent}22`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  qrBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  contactIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactCopy: {
    flex: 1,
    minWidth: 0,
  },
  contactLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  contactValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primaryBtnText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 15,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  linkBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 13,
  },
  editScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  editForm: {
    padding: 20,
  },
  error: {
    backgroundColor: '#FEF2F2',
    color: colors.error,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 13,
    fontWeight: '600',
  },
});
