import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { FormField } from '@/components/ui/FormField';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { SelectField } from '@/components/ui/SelectField';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { countries } from '@/data/countries';
import { getStaticConferenceDays, REGISTRATION_TITLES } from '@/data/static-content';
import { colors } from '@/constants/theme';
import type { Conference } from '@/lib/types';
import { isPreviewMode } from '@/lib/offline-mode';
import { registrationApi } from '@/lib/registration-api';

const STEPS = [
  { number: 1, title: 'Type' },
  { number: 2, title: 'Email' },
  { number: 3, title: 'Verify' },
  { number: 4, title: 'Details' },
];

const registrationTypes = ['Attendee', 'Exhibitor'] as const;

type RegistrationFormProps = {
  conference: Conference;
  conferenceDays?: { label: string; theme?: string }[];
};

export function RegistrationForm({ conference, conferenceDays }: RegistrationFormProps) {
  const days = conferenceDays?.length ? conferenceDays : getStaticConferenceDays();
  const offline = isPreviewMode();

  const [step, setStep] = useState(1);
  const [registrationType, setRegistrationType] =
    useState<(typeof registrationTypes)[number]>('Attendee');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [editToken, setEditToken] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const [title, setTitle] = useState('Mr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [otherName, setOtherName] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [country, setCountry] = useState('');
  const [daysAttending, setDaysAttending] = useState<string[]>([]);
  const [visaLetterRequired, setVisaLetterRequired] = useState(false);
  const [passportNumber, setPassportNumber] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [exhibitionDetails, setExhibitionDetails] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');

  if (!conference.registrationOpen) {
    return (
      <View style={styles.centered}>
        <Text style={styles.closedTitle}>Registration closed</Text>
        <Text style={styles.closedText}>
          {conference.regClosedMessage || 'Registration is not open for this conference.'}
        </Text>
      </View>
    );
  }

  if (success) {
    return (
      <View style={styles.centered}>
        <Text style={styles.successTitle}>
          {offline ? 'Preview submission complete' : 'Registration submitted'}
        </Text>
        <Text style={styles.successText}>
          {offline
            ? 'This was a local preview only. Connect the API to submit real registrations.'
            : `A confirmation email has been sent to ${email}.`}
        </Text>
      </View>
    );
  }

  const toggleDay = (dayLabel: string) => {
    setDaysAttending((prev) =>
      prev.includes(dayLabel) ? prev.filter((d) => d !== dayLabel) : [...prev, dayLabel]
    );
  };

  const validateDetails = () => {
    const errors: Record<string, string> = {};
    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!organization.trim()) errors.organization = 'Organization is required';
    if (!phone.trim()) errors.phone = 'Phone is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!stateRegion.trim()) errors.stateRegion = 'State/region is required';
    if (!country) errors.country = 'Country is required';
    if (daysAttending.length === 0) errors.daysAttending = 'Select at least one day';
    if (visaLetterRequired && !passportNumber.trim()) {
      errors.passportNumber = 'Passport number is required for visa letter';
    }
    if (conference.couponRequired && !couponApplied) {
      errors.coupon = 'A valid coupon is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStart = async () => {
    setFormError('');
    if (!email.trim()) {
      setFormError('Please enter your email address.');
      return;
    }

    if (offline) {
      setStep(3);
      return;
    }

    setSubmitting(true);
    try {
      await registrationApi.start(email.trim());
      setStep(3);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to send verification code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerify = async () => {
    setFormError('');
    if (!otp.trim() || otp.trim().length < 6) {
      setFormError('Enter the 6-digit code from your email.');
      return;
    }

    if (offline) {
      setEditToken('preview-token');
      setStep(4);
      return;
    }

    setSubmitting(true);
    try {
      const result = await registrationApi.verifyEdit(email.trim(), otp.trim());
      setEditToken(result.editToken);
      const registrant = result.registrant as Record<string, string> | undefined;
      if (registrant) {
        setFirstName(String(registrant.firstName || ''));
        setLastName(String(registrant.lastName || ''));
        setOrganization(String(registrant.organization || ''));
        setPhone(String(registrant.phone || ''));
        if (registrant.registrationType === 'Exhibitor') setRegistrationType('Exhibitor');
      }
      setStep(4);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setFieldErrors((prev) => ({ ...prev, coupon: 'Enter a coupon code' }));
      return;
    }
    if (offline) {
      setCouponApplied(true);
      setFieldErrors((prev) => ({ ...prev, coupon: '' }));
      return;
    }
    setFormError('Coupon validation requires API connection.');
  };

  const handleSubmit = async () => {
    setFormError('');
    if (!validateDetails()) return;

    if (offline) {
      setSuccess(true);
      return;
    }

    setSubmitting(true);
    try {
      const currentYear = new Date(conference.startDate).getFullYear();
      await registrationApi.submit({
        email: email.trim(),
        editToken,
        registrationType,
        title,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        otherName: otherName.trim(),
        phone: phone.trim(),
        organization: organization.trim(),
        conferenceYears: [currentYear],
        sector: [],
        daysAttending,
        country,
        city: city.trim(),
        stateRegion: stateRegion.trim(),
        visaLetterRequired,
        passportNumber: passportNumber.trim(),
        coupon: couponApplied ? couponCode.trim() : '',
        exhibitionDetails: exhibitionDetails.trim(),
        additionalComments: additionalComments.trim(),
      });
      setSuccess(true);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Registration submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <OfflineBanner />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Conference Registration</Text>
        <Text style={styles.subheading}>{conference.shortName || conference.title}</Text>

        <StepIndicator steps={STEPS} currentStep={step} />
        {formError ? <Text style={styles.formError}>{formError}</Text> : null}

        {step === 1 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Choose registration type</Text>
            {registrationTypes.map((type) => (
              <Pressable
                key={type}
                style={[styles.option, registrationType === type && styles.optionActive]}
                onPress={() => setRegistrationType(type)}
              >
                <Text style={[styles.optionText, registrationType === type && styles.optionTextActive]}>
                  {type}
                </Text>
              </Pressable>
            ))}
            <PrimaryButton label="Continue" onPress={() => setStep(2)} />
          </View>
        ) : null}

        {step === 2 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Enter your email</Text>
            <Text style={styles.help}>
              We will send a one-time code to verify your email before you complete registration.
            </Text>
            <FormField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              required
            />
            <PrimaryButton label="Send code" onPress={handleStart} loading={submitting} />
            <SecondaryButton label="Back" onPress={() => setStep(1)} />
          </View>
        ) : null}

        {step === 3 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Verify your email</Text>
            <Text style={styles.help}>
              {offline
                ? 'Preview mode: enter any 6 digits to continue.'
                : `Enter the code sent to ${email}.`}
            </Text>
            <FormField
              label="Verification code"
              value={otp}
              onChangeText={setOtp}
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              required
            />
            <PrimaryButton label="Verify" onPress={handleVerify} loading={submitting} />
            <SecondaryButton label="Back" onPress={() => setStep(2)} />
          </View>
        ) : null}

        {step === 4 ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {registrationType === 'Exhibitor' ? 'Exhibitor details' : 'Attendee details'}
            </Text>

            <SelectField
              label="Title"
              value={title}
              options={REGISTRATION_TITLES.map((t) => ({ label: t, value: t }))}
              onChange={setTitle}
            />

            <FormField label="First name" value={firstName} onChangeText={setFirstName} required error={fieldErrors.firstName} />
            <FormField label="Last name" value={lastName} onChangeText={setLastName} required error={fieldErrors.lastName} />
            <FormField label="Other name" value={otherName} onChangeText={setOtherName} />
            <FormField label="Organization" value={organization} onChangeText={setOrganization} required error={fieldErrors.organization} />
            <FormField label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" required error={fieldErrors.phone} />

            <Text style={styles.sectionHeading}>Location</Text>
            <FormField label="City" value={city} onChangeText={setCity} required error={fieldErrors.city} />
            <FormField label="State / Region" value={stateRegion} onChangeText={setStateRegion} required error={fieldErrors.stateRegion} />
            <SelectField
              label="Country"
              value={country}
              options={countries.map((c) => ({ label: c.label, value: c.value }))}
              onChange={setCountry}
              required
              error={fieldErrors.country}
            />

            <Text style={styles.sectionHeading}>Coupon</Text>
            <View style={styles.couponRow}>
              <TextInput
                style={styles.couponInput}
                value={couponCode}
                onChangeText={setCouponCode}
                placeholder="Coupon code"
                placeholderTextColor="#9CA3AF"
              />
              <Pressable style={styles.couponButton} onPress={handleApplyCoupon}>
                <Text style={styles.couponButtonText}>{couponApplied ? 'Applied' : 'Apply'}</Text>
              </Pressable>
            </View>
            {fieldErrors.coupon ? <Text style={styles.fieldError}>{fieldErrors.coupon}</Text> : null}

            <Text style={styles.sectionHeading}>Days attending</Text>
            {days.map((day) => (
              <Pressable
                key={day.label}
                style={[styles.dayRow, daysAttending.includes(day.label) && styles.dayRowActive]}
                onPress={() => toggleDay(day.label)}
              >
                <Text style={styles.dayLabel}>{day.label}</Text>
                {day.theme ? <Text style={styles.dayTheme}>{day.theme}</Text> : null}
              </Pressable>
            ))}
            {fieldErrors.daysAttending ? (
              <Text style={styles.fieldError}>{fieldErrors.daysAttending}</Text>
            ) : null}

            <Text style={styles.sectionHeading}>Visa invitation letter</Text>
            <View style={styles.visaRow}>
              <Pressable
                style={[styles.visaOption, !visaLetterRequired && styles.visaOptionActive]}
                onPress={() => setVisaLetterRequired(false)}
              >
                <Text style={styles.visaText}>No</Text>
              </Pressable>
              <Pressable
                style={[styles.visaOption, visaLetterRequired && styles.visaOptionActive]}
                onPress={() => setVisaLetterRequired(true)}
              >
                <Text style={styles.visaText}>Yes</Text>
              </Pressable>
            </View>
            {visaLetterRequired ? (
              <FormField
                label="Passport number"
                value={passportNumber}
                onChangeText={setPassportNumber}
                required
                error={fieldErrors.passportNumber}
              />
            ) : null}

            {registrationType === 'Exhibitor' ? (
              <>
                <Text style={styles.sectionHeading}>Exhibition details</Text>
                <TextInput
                  style={styles.textarea}
                  value={exhibitionDetails}
                  onChangeText={setExhibitionDetails}
                  placeholder="Products, services, booth requirements..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </>
            ) : null}

            <Text style={styles.sectionHeading}>Additional comments</Text>
            <TextInput
              style={styles.textarea}
              value={additionalComments}
              onChangeText={setAdditionalComments}
              placeholder="Optional notes"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <PrimaryButton label="Submit registration" onPress={handleSubmit} loading={submitting} />
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function PrimaryButton({
  label,
  onPress,
  loading = false,
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
}) {
  return (
    <Pressable style={[styles.primaryButton, loading && styles.disabled]} onPress={onPress} disabled={loading}>
      {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.primaryButtonText}>{label}</Text>}
    </Pressable>
  );
}

function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.secondaryButton} onPress={onPress}>
      <Text style={styles.secondaryButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 32 },
  heading: { fontSize: 24, fontWeight: '800', color: colors.text },
  subheading: { marginTop: 4, marginBottom: 16, fontSize: 14, color: colors.textMuted },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 4,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  help: { fontSize: 14, lineHeight: 20, color: colors.textMuted, marginBottom: 8 },
  previewNote: {
    fontSize: 13,
    color: '#92400E',
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  option: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
  },
  optionActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}12` },
  optionText: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  optionTextActive: { color: colors.primary },
  couponRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: colors.white,
  },
  couponButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  couponButtonText: { color: colors.white, fontWeight: '700' },
  dayRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  dayRowActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}10` },
  dayLabel: { fontSize: 14, fontWeight: '600', color: colors.text },
  dayTheme: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
  visaRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  visaOption: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  visaOptionActive: { borderColor: colors.primary, backgroundColor: `${colors.primary}10` },
  visaText: { fontWeight: '600', color: colors.text },
  textarea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 12,
    minHeight: 96,
    fontSize: 15,
    backgroundColor: colors.white,
    color: colors.text,
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  primaryButtonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  secondaryButton: { alignItems: 'center', paddingVertical: 10 },
  secondaryButtonText: { color: colors.primary, fontWeight: '600' },
  disabled: { opacity: 0.7 },
  formError: { color: colors.error, marginBottom: 12, fontWeight: '600' },
  fieldError: { color: colors.error, fontSize: 12, marginBottom: 8 },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  closedTitle: { fontSize: 22, fontWeight: '800', color: colors.text },
  closedText: { marginTop: 8, fontSize: 15, color: colors.textMuted, textAlign: 'center' },
  successTitle: { fontSize: 22, fontWeight: '800', color: colors.success },
  successText: { marginTop: 8, fontSize: 15, color: colors.textMuted, textAlign: 'center', lineHeight: 22 },
});
