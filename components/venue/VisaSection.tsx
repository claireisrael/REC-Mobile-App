import { Ionicons } from '@expo/vector-icons';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { colors } from '@/constants/theme';

const VISA_PORTAL_URL = 'https://visas.immigration.go.ug/';

type VisaSectionProps = {
  registrationOpen?: boolean;
};

export function VisaSection({ registrationOpen }: VisaSectionProps) {
  const router = useRouter();

  return (
    <View style={styles.section}>
      <View style={styles.card}>
        <Text style={styles.title}>Visa Information</Text>
        <Text style={styles.body}>
          Most nationalities can obtain a visa on arrival or apply online through the Uganda
          Immigration e-Visa portal. We recommend applying at least 4 weeks before travel.
          Attendees requiring a visa invitation letter can request one during registration.
        </Text>

        <Pressable style={styles.portalLink} onPress={() => Linking.openURL(VISA_PORTAL_URL)}>
          <Text style={styles.portalLinkText}>Uganda e-Visa portal</Text>
          <Ionicons name="open-outline" size={14} color={colors.primary} />
        </Pressable>

        {registrationOpen ? (
          <Pressable
            style={({ pressed }) => [styles.registerBtn, pressed && styles.registerBtnPressed]}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.registerBtnText}>Register & Request Visa Letter</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 28,
    backgroundColor: colors.white,
  },
  card: {
    backgroundColor: `${colors.primary}0D`,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${colors.primary}1A`,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  body: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    color: colors.textMuted,
    textAlign: 'center',
  },
  portalLink: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  portalLinkText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  registerBtn: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  registerBtnPressed: {
    backgroundColor: colors.primaryDark,
  },
  registerBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
