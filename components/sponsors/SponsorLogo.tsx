import { Image, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/constants/theme';
import type { Sponsor } from '@/lib/types';

type SponsorLogoProps = {
  sponsor: Pick<Sponsor, 'name' | 'logoUrl'>;
  large?: boolean;
};

export function SponsorLogo({ sponsor, large = false }: SponsorLogoProps) {
  if (sponsor.logoUrl) {
    return (
      <Image
        source={{ uri: sponsor.logoUrl }}
        style={large ? styles.logoLarge : styles.logo}
        resizeMode="contain"
      />
    );
  }

  return (
    <View style={[styles.fallback, large && styles.fallbackLarge]}>
      <Text style={[styles.fallbackText, large && styles.fallbackTextLarge]}>
        {sponsor.name?.slice(0, 2).toUpperCase() || 'SP'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 140,
    height: 48,
  },
  logoLarge: {
    width: 200,
    height: 72,
  },
  fallback: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: `${colors.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackLarge: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  fallbackTextLarge: {
    fontSize: 24,
  },
});
