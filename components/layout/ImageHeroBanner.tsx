import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';
import { getHeroImageSource } from '@/lib/hero-image';

type ImageHeroBannerProps = {
  imageUrl?: string | null;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  highlight?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  /** Taller hero for identity screens */
  tall?: boolean;
};

/**
 * Full-bleed photographic hero with teal overlay — shared across main tabs.
 */
export function ImageHeroBanner({
  imageUrl,
  eyebrow,
  title,
  subtitle,
  highlight,
  children,
  style,
  contentStyle,
  tall = false,
}: ImageHeroBannerProps) {
  return (
    <ImageBackground
      source={getHeroImageSource(imageUrl)}
      style={[styles.wrap, tall && styles.wrapTall, style]}
      imageStyle={styles.image}
    >
      <LinearGradient
        colors={['rgba(3,40,48,0.35)', 'rgba(5,70,83,0.72)', 'rgba(5,70,83,0.92)']}
        locations={[0, 0.45, 1]}
        style={[styles.overlay, contentStyle]}
      >
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.title}>{title}</Text>
        {highlight ? <Text style={styles.highlight}>{highlight}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        {children}
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    minHeight: 168,
    backgroundColor: colors.primaryDark,
  },
  wrapTall: {
    minHeight: 220,
  },
  image: {
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 24,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: colors.accent,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: -0.4,
    lineHeight: 34,
  },
  highlight: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.86)',
    maxWidth: 420,
  },
});
