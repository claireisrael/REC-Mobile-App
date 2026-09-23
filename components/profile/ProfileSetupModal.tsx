import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Keyboard,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProfileAvatarPicker } from '@/components/profile/ProfileAvatarPicker';
import { colors } from '@/constants/theme';
import { useProfile } from '@/context/ProfileContext';
import type { NetworkingProfile } from '@/lib/profile-api';

type ProfileSetupModalProps = {
  visible: boolean;
  onComplete: (profile: NetworkingProfile) => void;
};

type Step = 0 | 1 | 2;

const FOOTER_CTA = 54;
const FOOTER_TOP_PAD = 12;

function SoftField({
  label,
  hint,
  onFocused,
  ...props
}: TextInputProps & { label: string; hint?: string; onFocused?: () => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {hint ? <Text style={styles.fieldHint}>{hint}</Text> : null}
      <TextInput
        {...props}
        onFocus={(e) => {
          setFocused(true);
          props.onFocus?.(e);
          // Wait for keyboard animation before scrolling the field into view.
          setTimeout(() => onFocused?.(), Platform.OS === 'ios' ? 80 : 120);
        }}
        onBlur={(e) => {
          setFocused(false);
          props.onBlur?.(e);
        }}
        placeholderTextColor="#94A3B8"
        style={[styles.fieldInput, focused && styles.fieldInputFocused, props.style]}
      />
    </View>
  );
}

export function ProfileSetupModal({ visible, onComplete }: ProfileSetupModalProps) {
  const insets = useSafeAreaInsets();
  const { saveProfile } = useProfile();
  const scrollRef = useRef<ScrollView>(null);
  const fieldOffsets = useRef<Record<string, number>>({});
  const [step, setStep] = useState<Step>(0);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [organization, setOrganization] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // KeyboardAvoidingView is unreliable inside Android Modals — pin with keyboard height.
  useEffect(() => {
    if (!visible) {
      setKeyboardHeight(0);
      return;
    }

    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (event) => {
      const { height, screenY } = event.endCoordinates;
      let next = Math.max(0, Math.round(height ?? 0));

      if (Platform.OS === 'android' && typeof screenY === 'number') {
        const windowH = Dimensions.get('window').height;
        const overlap = Math.max(0, Math.round(windowH - screenY));
        next = overlap > 0 ? overlap : next;
      }

      setKeyboardHeight(next);
    });
    const onHide = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, [visible]);

  const scrollFieldIntoView = (key: string) => {
    const y = fieldOffsets.current[key];
    if (typeof y !== 'number') return;
    scrollRef.current?.scrollTo({
      y: Math.max(0, y - 24),
      animated: true,
    });
  };

  const rememberFieldOffset = (key: string) => (event: { nativeEvent: { layout: { y: number } } }) => {
    fieldOffsets.current[key] = event.nativeEvent.layout.y;
  };

  const stepMeta = useMemo(
    () =>
      [
        {
          title: 'Welcome to REC26',
          subtitle: 'A few details create your shareable contact card for the conference floor.',
        },
        {
          title: 'How should people reach you?',
          subtitle: 'This stays on your phone. You can change it anytime from Profile.',
        },
        {
          title: 'Your professional identity',
          subtitle: 'Add your photo and organisation so attendees recognise you.',
        },
      ] as const,
    []
  );

  const validateStep = (current: Step): string | null => {
    if (current === 1) {
      if (!fullName.trim()) return 'Please enter your full name.';
      if (!email.trim() || !email.includes('@')) return 'Please enter a valid email.';
      if (!phone.trim()) return 'Please enter a phone number.';
    }
    if (current === 2) {
      if (!address.trim()) return 'Please add a city or address.';
    }
    return null;
  };

  const goNext = () => {
    setError('');
    if (step === 0) {
      setStep(1);
      return;
    }
    const problem = validateStep(step);
    if (problem) {
      setError(problem);
      return;
    }
    if (step === 1) setStep(2);
  };

  const goBack = () => {
    setError('');
    Keyboard.dismiss();
    if (step === 0) return;
    setStep((s) => (s - 1) as Step);
  };

  const submit = async () => {
    const problem = validateStep(2);
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    setBusy(true);
    try {
      const profile = await saveProfile({
        fullName,
        email,
        phone,
        address,
        organization,
        photoUri,
      });
      onComplete(profile);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save profile');
    } finally {
      setBusy(false);
    }
  };

  const meta = stepMeta[step];
  const keyboardOpen = keyboardHeight > 0;
  const footerPadBottom = keyboardOpen ? 10 : Math.max(insets.bottom, 16);
  const footerReserve = FOOTER_TOP_PAD + FOOTER_CTA + footerPadBottom + 12;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      statusBarTranslucent={Platform.OS === 'android'}
    >
      <View style={styles.root}>
        <LinearGradient
          colors={['#033A44', '#054653', '#0B7186']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.top,
            {
              paddingTop: insets.top + (keyboardOpen ? 10 : 20),
              paddingBottom: keyboardOpen ? 14 : 32,
            },
          ]}
        >
          <View style={styles.progressRow}>
            {[0, 1, 2].map((i) => (
              <View
                key={i}
                style={[styles.progressSeg, i <= step && styles.progressSegActive]}
              />
            ))}
          </View>

          {step > 0 ? (
            <Pressable onPress={goBack} style={styles.backBtn} hitSlop={12}>
              <Ionicons name="arrow-back" size={20} color="rgba(255,255,255,0.9)" />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
          ) : (
            <Text style={styles.brandMark}>REC & EXPO</Text>
          )}

          <Text style={[styles.heroTitle, keyboardOpen && styles.heroTitleCompact]}>
            {meta.title}
          </Text>
          {!keyboardOpen ? <Text style={styles.heroSubtitle}>{meta.subtitle}</Text> : null}
        </LinearGradient>

        <View style={styles.sheet}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={[
              styles.sheetContent,
              step === 0
                ? { paddingBottom: Math.max(insets.bottom, 24) }
                : { paddingBottom: footerReserve + keyboardHeight },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            automaticallyAdjustKeyboardInsets={false}
          >
            {error ? (
              <View style={styles.errorBanner}>
                <Ionicons name="alert-circle" size={16} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {step === 0 ? (
              <View style={styles.welcomeBlock}>
                <View style={styles.featureRow}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="qr-code-outline" size={22} color={colors.primary} />
                  </View>
                  <View style={styles.featureCopy}>
                    <Text style={styles.featureTitle}>Share with a QR code</Text>
                    <Text style={styles.featureBody}>
                      Others scan your card to save your contact instantly.
                    </Text>
                  </View>
                </View>
                <View style={styles.featureRow}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="people-outline" size={22} color={colors.primary} />
                  </View>
                  <View style={styles.featureCopy}>
                    <Text style={styles.featureTitle}>Connect with attendees</Text>
                    <Text style={styles.featureBody}>
                      Appear in Connect with your name and organisation.
                    </Text>
                  </View>
                </View>
                <View style={styles.featureRow}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
                  </View>
                  <View style={styles.featureCopy}>
                    <Text style={styles.featureTitle}>Private by default</Text>
                    <Text style={styles.featureBody}>
                      Your profile is stored on this device. You control what you share.
                    </Text>
                  </View>
                </View>

                <Pressable style={[styles.cta, styles.welcomeCta]} onPress={goNext}>
                  <Text style={styles.ctaText}>Get started</Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.white} />
                </Pressable>
              </View>
            ) : null}

            {step === 1 ? (
              <View style={styles.fields}>
                <View onLayout={rememberFieldOffset('fullName')}>
                  <SoftField
                    label="Full name"
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="As you’d like it on your card"
                    autoComplete="name"
                    autoCapitalize="words"
                    onFocused={() => scrollFieldIntoView('fullName')}
                  />
                </View>
                <View onLayout={rememberFieldOffset('email')}>
                  <SoftField
                    label="Work email"
                    hint="Used to match connection requests"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="name@organisation.org"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoComplete="email"
                    onFocused={() => scrollFieldIntoView('email')}
                  />
                </View>
                <View onLayout={rememberFieldOffset('phone')}>
                  <SoftField
                    label="Mobile number"
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+256 …"
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    onFocused={() => scrollFieldIntoView('phone')}
                  />
                </View>
              </View>
            ) : null}

            {step === 2 ? (
              <View style={styles.fields}>
                <ProfileAvatarPicker
                  fullName={fullName}
                  photoUri={photoUri}
                  onChange={setPhotoUri}
                  size={keyboardOpen ? 72 : 100}
                />
                <View onLayout={rememberFieldOffset('organization')}>
                  <SoftField
                    label="Organisation"
                    value={organization}
                    onChangeText={setOrganization}
                    placeholder="Company, ministry, or institution"
                    onFocused={() => scrollFieldIntoView('organization')}
                  />
                </View>
                <View onLayout={rememberFieldOffset('address')}>
                  <SoftField
                    label="City / address"
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Kampala, Uganda"
                    multiline
                    style={styles.multiline}
                    onFocused={() => scrollFieldIntoView('address')}
                  />
                </View>
              </View>
            ) : null}
          </ScrollView>

          {step > 0 ? (
            <View
              style={[
                styles.footer,
                {
                  bottom: keyboardHeight,
                  paddingBottom: footerPadBottom,
                },
              ]}
            >
              {step === 1 ? (
                <Pressable style={styles.cta} onPress={goNext}>
                  <Text style={styles.ctaText}>Continue</Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.white} />
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.cta, busy && styles.ctaDisabled]}
                  disabled={busy}
                  onPress={submit}
                >
                  {busy ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <>
                      <Text style={styles.ctaText}>Create my profile</Text>
                      <Ionicons name="checkmark" size={18} color={colors.white} />
                    </>
                  )}
                </Pressable>
              )}
            </View>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primaryDark,
  },
  top: {
    paddingHorizontal: 28,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 22,
  },
  progressSeg: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progressSegActive: {
    backgroundColor: colors.accent,
  },
  brandMark: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: colors.accent,
    marginBottom: 14,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  heroTitleCompact: {
    fontSize: 22,
    lineHeight: 28,
    marginBottom: 0,
  },
  heroSubtitle: {
    fontSize: 15,
    lineHeight: 23,
    color: 'rgba(255,255,255,0.78)',
    maxWidth: 340,
  },
  sheet: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -8,
    overflow: 'hidden',
  },
  sheetContent: {
    paddingHorizontal: 28,
    paddingTop: 28,
  },
  welcomeBlock: {
    gap: 18,
  },
  welcomeCta: {
    marginTop: 10,
  },
  featureRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: `${colors.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureCopy: {
    flex: 1,
    paddingTop: 2,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  featureBody: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
  },
  fields: {
    gap: 22,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 0.2,
  },
  fieldHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 2,
  },
  fieldInput: {
    fontSize: 17,
    lineHeight: 24,
    color: colors.text,
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderBottomWidth: 1.5,
    borderBottomColor: '#E2E8F0',
  },
  fieldInputFocused: {
    borderBottomColor: colors.primary,
  },
  multiline: {
    minHeight: 64,
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
    marginBottom: 18,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.error,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingTop: FOOTER_TOP_PAD,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  cta: {
    backgroundColor: colors.primary,
    minHeight: FOOTER_CTA,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
