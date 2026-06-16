import { colors } from './theme';

const tintColorLight = colors.primary;
const tintColorDark = colors.accent;

export default {
  light: {
    text: colors.text,
    background: colors.white,
    tint: tintColorLight,
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F9FAFB',
    background: '#111827',
    tint: tintColorDark,
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
  },
};
