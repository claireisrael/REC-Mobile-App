import { StyleSheet, View } from 'react-native';

import { ImageHeroBanner } from '@/components/layout/ImageHeroBanner';
import { colors } from '@/constants/theme';
import type { Conference } from '@/lib/types';

type SponsorsHeroProps = {
  conference: Conference;
};

export function SponsorsHero({ conference }: SponsorsHeroProps) {
  const shortName = conference.shortName || conference.title || 'the conference';

  return (
    <View style={styles.wrap}>
      <ImageHeroBanner
        imageUrl={conference.heroImageUrl}
        eyebrow="Sponsors & Partners"
        title="Sponsors & Partners"
        highlight={`Supporting ${shortName}`}
        subtitle="Organizations backing renewable energy collaboration, exhibition, and sector growth."
        tall
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
});
