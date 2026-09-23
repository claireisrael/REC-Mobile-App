import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { ProfileAvatarPicker } from '@/components/profile/ProfileAvatarPicker';
import { ProfileSetupModal } from '@/components/profile/ProfileSetupModal';
import { colors } from '@/constants/theme';
import { useAppData } from '@/context/AppDataContext';
import { useProfile } from '@/context/ProfileContext';
import { getHeroImageSource } from '@/lib/hero-image';
import { buildVCard, getProfileInitials } from '@/lib/profile-api';

function SoftField({
  label,
  ...props
}: TextInputProps & { label: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.softField}>
      <Text style={styles.softLabel}>{label}</Text>
      <TextInput
        {...props}
        placeholderTextColor="#94A3B8"
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        style={[styles.softInput, focused && styles.softInputFocused, props.style]}
      />
    </View>
  );
}

function DetailLine({
  icon,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
}) {
  return (
    <View style={styles.detailLine}>
      <Ionicons name={icon} size={16} color={colors.primary} />
      <Text style={styles.detailValue} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { conference } = useAppData();
  const { profile, ready, hasProfile, saveProfile, clearProfile } = useProfile();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [organization, setOrganization] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setEmail(profile.email);
    setFullName(profile.fullName || '');
    setPhone(profile.phone || '');
    setAddress(profile.address || '');
    setOrganization(profile.organization || '');
    setPhotoUri(profile.photoUri || null);
  }, [profile]);

  const saveEdits = async () => {
    setError('');
    setBusy(true);
    try {
      await saveProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        organization: organization.trim(),
        photoUri,
      });
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save profile');
    } finally {
      setBusy(false);
    }
  };

  const onClear = async () => {
    await clearProfile();
    setEmail('');
    setFullName('');
    setPhone('');
    setAddress('');
    setOrganization('');
    setPhotoUri(null);
    setEditing(false);
    setError('');
  };

  if (!ready) {
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
        <ImageBackground
          source={getHeroImageSource(conference?.heroImageUrl)}
          style={[styles.hero, { paddingTop: insets.top + 28 }]}
          imageStyle={styles.heroImage}
        >
          <LinearGradient
            colors={['rgba(3,40,48,0.4)', 'rgba(5,70,83,0.9)']}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.brandMark}>REC & EXPO</Text>
          <View style={styles.avatarRing}>
            {profile?.photoUri ? (
              <Image source={{ uri: profile.photoUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
            )}
          </View>
          {profile ? (
            <>
              <Text style={styles.heroName}>{profile.fullName}</Text>
              {profile.organization ? (
                <Text style={styles.heroOrg}>{profile.organization}</Text>
              ) : null}
            </>
          ) : null}
        </ImageBackground>

        {profile ? (
          <View style={styles.body}>
            <View style={styles.cardPanel}>
              <Text style={styles.panelEyebrow}>Digital card</Text>
              <Text style={styles.panelTitle}>Scan to save contact</Text>
              <View style={styles.qrStage}>
                {vCardPayload ? (
                  <QRCode value={vCardPayload} size={180} backgroundColor="#FFFFFF" color="#054653" />
                ) : null}
              </View>
              <Text style={styles.panelHint}>
                Hold another phone’s camera over this code to share your details.
              </Text>
            </View>

            <View style={styles.infoPanel}>
              <Text style={styles.panelEyebrow}>Details</Text>
              <DetailLine icon="mail-outline" value={profile.email} />
              <DetailLine icon="call-outline" value={profile.phone} />
              <DetailLine icon="location-outline" value={profile.address} />
              {profile.organization ? (
                <DetailLine icon="business-outline" value={profile.organization} />
              ) : null}
            </View>

            <Pressable style={styles.editCta} onPress={() => setEditing(true)}>
              <Text style={styles.editCtaText}>Edit profile</Text>
              <Ionicons name="pencil" size={16} color={colors.white} />
            </Pressable>

            <Pressable style={styles.clearBtn} onPress={onClear}>
              <Text style={styles.clearText}>Remove from this phone</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>

      {!hasProfile ? (
        <ProfileSetupModal
          visible={ready}
          onComplete={(saved) => {
            // saveProfile already updated context + AsyncStorage — do not refresh
            // immediately (a failed/empty re-read would wipe the new profile).
            setEmail(saved.email);
            setFullName(saved.fullName);
            setPhone(saved.phone);
            setAddress(saved.address);
            setOrganization(saved.organization || '');
            setPhotoUri(saved.photoUri || null);
            setEditing(false);
            setError('');
          }}
        />
      ) : null}

      <Modal visible={editing && !!profile} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          style={styles.editScreen}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View
            style={[
              styles.editHeader,
              { paddingTop: Platform.OS === 'ios' ? 18 : insets.top + 10 },
            ]}
          >
            <View>
              <Text style={styles.editEyebrow}>Profile</Text>
              <Text style={styles.editTitle}>Update your details</Text>
            </View>
            <Pressable onPress={() => setEditing(false)} hitSlop={10} style={styles.closeHit}>
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={[
              styles.editForm,
              { paddingBottom: Math.max(insets.bottom, 28) },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <ProfileAvatarPicker
              fullName={fullName}
              photoUri={photoUri}
              onChange={setPhotoUri}
              size={96}
            />

            <SoftField label="Full name" value={fullName} onChangeText={setFullName} />
            <SoftField
              label="Work email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <SoftField
              label="Mobile number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
            <SoftField
              label="Organisation"
              value={organization}
              onChangeText={setOrganization}
              placeholder="Optional"
            />
            <SoftField
              label="City / address"
              value={address}
              onChangeText={setAddress}
              multiline
              style={styles.multiline}
            />

            <Pressable
              style={[styles.editCta, busy && styles.btnDisabled]}
              disabled={busy}
              onPress={saveEdits}
            >
              {busy ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.editCtaText}>Save changes</Text>
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
    paddingBottom: 48,
  },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 40,
    overflow: 'hidden',
    backgroundColor: colors.primaryDark,
  },
  heroImage: {
    resizeMode: 'cover',
  },
  brandMark: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: colors.accent,
    marginBottom: 28,
  },
  avatarRing: {
    padding: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  heroName: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  heroOrg: {
    marginTop: 6,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  body: {
    marginTop: -20,
    paddingHorizontal: 20,
    gap: 14,
  },
  cardPanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 24,
    alignItems: 'center',
    shadowColor: '#054653',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  infoPanel: {
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 20,
    gap: 14,
    shadowColor: '#054653',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  panelEyebrow: {
    alignSelf: 'stretch',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  panelTitle: {
    alignSelf: 'stretch',
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
    marginBottom: 18,
  },
  qrStage: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    marginBottom: 16,
  },
  panelHint: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  detailLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailValue: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
    fontWeight: '500',
  },
  editCta: {
    marginTop: 4,
    backgroundColor: colors.primary,
    minHeight: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  editCtaText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  clearBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  clearText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  btnDisabled: {
    opacity: 0.7,
  },
  editScreen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  editHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  editEyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  editTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  closeHit: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editForm: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 20,
  },
  softField: {
    gap: 6,
  },
  softLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  softInput: {
    fontSize: 17,
    lineHeight: 24,
    color: colors.text,
    paddingVertical: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
  },
  softInputFocused: {
    borderBottomColor: colors.primary,
  },
  multiline: {
    minHeight: 56,
    textAlignVertical: 'top',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
});
