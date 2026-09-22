import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { FormField } from '@/components/ui/FormField';
import { colors } from '@/constants/theme';
import {
  clearProfileSession,
  loadProfileSession,
  saveLocalProfile,
  saveProfileSession,
  buildVCard,
  type NetworkingProfile,
} from '@/lib/profile-api';

type Step = 'edit' | 'card';

export default function ProfileScreen() {
  const [step, setStep] = useState<Step>('edit');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [organization, setOrganization] = useState('');
  const [profile, setProfile] = useState<NetworkingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const applyProfile = useCallback((next: NetworkingProfile) => {
    setProfile(next);
    setEmail(next.email);
    setFullName(next.fullName || '');
    setPhone(next.phone || '');
    setAddress(next.address || '');
    setOrganization(next.organization || '');
    setStep('card');
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
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save profile');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await clearProfileSession();
    setProfile(null);
    setEmail('');
    setFullName('');
    setPhone('');
    setAddress('');
    setOrganization('');
    setStep('edit');
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

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>My profile</Text>
          <Text style={styles.subheading}>
            Add your details and share them with a QR code. Saved on this phone only.
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          {step === 'edit' ? (
            <View style={styles.card}>
              <FormField
                label="Name"
                required
                value={fullName}
                onChangeText={setFullName}
                placeholder="Full name"
              />
              <FormField
                label="Email"
                required
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="you@example.com"
              />
              <FormField
                label="Contact"
                required
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="Phone number"
              />
              <FormField
                label="Address"
                required
                value={address}
                onChangeText={setAddress}
                placeholder="City, country, or street address"
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
                  <Text style={styles.primaryBtnText}>Save profile</Text>
                )}
              </Pressable>
              {profile ? (
                <Pressable style={styles.linkBtn} onPress={signOut}>
                  <Text style={styles.linkText}>Clear profile</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          {step === 'card' && profile ? (
            <View style={styles.card}>
              <View style={styles.qrWrap}>
                {vCardPayload ? (
                  <QRCode value={vCardPayload} size={200} backgroundColor="#FFFFFF" color="#054653" />
                ) : (
                  <Text style={styles.hint}>Save your profile to generate a QR code.</Text>
                )}
              </View>
              <Text style={styles.qrCaption}>Scan to share your profile</Text>
              <Text style={styles.cardName}>{profile.fullName}</Text>
              {profile.organization ? (
                <Text style={styles.cardMeta}>{profile.organization}</Text>
              ) : null}
              <Text style={styles.cardMeta}>{profile.email}</Text>
              <Text style={styles.cardMeta}>{profile.phone}</Text>
              <Text style={styles.cardMeta}>{profile.address}</Text>

              <Pressable style={styles.secondaryBtn} onPress={() => setStep('edit')}>
                <Ionicons name="create-outline" size={18} color={colors.primary} />
                <Text style={styles.secondaryBtnText}>Edit details</Text>
              </Pressable>
              <Pressable style={styles.linkBtn} onPress={signOut}>
                <Text style={styles.linkText}>Clear profile</Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    marginBottom: 16,
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
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 15,
  },
  btnDisabled: {
    opacity: 0.7,
  },
  secondaryBtn: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    minHeight: 44,
  },
  secondaryBtnText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  linkBtn: {
    marginTop: 14,
    alignItems: 'center',
  },
  linkText: {
    color: colors.textMuted,
    fontWeight: '600',
    fontSize: 13,
  },
  qrWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginBottom: 4,
  },
  qrCaption: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 12,
  },
  cardName: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  cardMeta: {
    textAlign: 'center',
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
});
