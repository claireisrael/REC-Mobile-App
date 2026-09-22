import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FormField } from '@/components/ui/FormField';
import { colors } from '@/constants/theme';
import { saveLocalProfile, saveProfileSession, type NetworkingProfile } from '@/lib/profile-api';

type ProfileSetupModalProps = {
  visible: boolean;
  onComplete: (profile: NetworkingProfile) => void;
};

export function ProfileSetupModal({ visible, onComplete }: ProfileSetupModalProps) {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [organization, setOrganization] = useState('');
  const [designation, setDesignation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    setError('');
    setBusy(true);
    try {
      const session = saveLocalProfile({
        fullName,
        email,
        phone,
        address,
        organization,
        designation,
      });
      await saveProfileSession(session);
      onComplete(session.profile);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save profile');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <LinearGradient colors={['#054653', '#0B7186', '#0E8A9E']} style={styles.hero}>
        <View style={{ height: insets.top }} />
        <Text style={styles.kicker}>REC & EXPO</Text>
        <Text style={styles.title}>Set up your profile</Text>
        <Text style={styles.subtitle}>
          Create your digital contact card so you can share it with others at the conference.
        </Text>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[styles.form, { paddingBottom: Math.max(insets.bottom, 24) }]}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.formTitle}>Your details</Text>
          <Text style={styles.formHint}>Saved on this phone only. You can edit anytime.</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <FormField
            label="Full name"
            required
            value={fullName}
            onChangeText={setFullName}
            placeholder="e.g. Amina Okello"
            autoComplete="name"
          />
          <FormField
            label="Email"
            required
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
            autoComplete="email"
          />
          <FormField
            label="Phone"
            required
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+256 7XX XXX XXX"
            autoComplete="tel"
          />
          <FormField
            label="Address"
            required
            value={address}
            onChangeText={setAddress}
            placeholder="City, country"
            multiline
          />
          <FormField
            label="Organization"
            value={organization}
            onChangeText={setOrganization}
            placeholder="Optional"
          />
          <FormField
            label="Designation"
            value={designation}
            onChangeText={setDesignation}
            placeholder="e.g. Programme Officer"
          />

          <Pressable
            style={[styles.primaryBtn, busy && styles.btnDisabled]}
            disabled={busy}
            onPress={submit}
          >
            {busy ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.primaryBtnText}>Continue to my profile</Text>
            )}
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    paddingTop: 12,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: colors.accent,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.88)',
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    marginTop: -12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  form: {
    padding: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  formHint: {
    fontSize: 13,
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
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  primaryBtnText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  btnDisabled: {
    opacity: 0.7,
  },
});
