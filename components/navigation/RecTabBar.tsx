import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/constants/theme';
import { tabHref } from '@/lib/routes';

type TabConfig = {
  routeName: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconFocused: keyof typeof Ionicons.glyphMap;
  accent?: boolean;
};

const TAB_CONFIG: TabConfig[] = [
  { routeName: 'index', label: 'Home', icon: 'home-outline', iconFocused: 'home' },
  { routeName: 'program', label: 'Program', icon: 'calendar-outline', iconFocused: 'calendar' },
  { routeName: 'sponsors', label: 'Sponsors', icon: 'ribbon-outline', iconFocused: 'ribbon' },
  { routeName: 'venue', label: 'Venue', icon: 'location-outline', iconFocused: 'location' },
  {
    routeName: 'register',
    label: 'Register',
    icon: 'ticket-outline',
    iconFocused: 'ticket',
    accent: true,
  },
];

export function RecTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG.find((tab) => tab.routeName === route.name);
          if (!config) return null;

          const isFocused = state.index === index;
          const { options } = descriptors[route.key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (event.defaultPrevented) return;
            if (!isFocused) {
              router.navigate(tabHref(route.name));
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          const iconName = isFocused ? config.iconFocused : config.icon;
          const label = options.title ?? config.label;

          if (config.accent) {
            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tab}
              >
                <View style={[styles.registerPill, isFocused && styles.registerPillFocused]}>
                  <Ionicons
                    name={iconName}
                    size={22}
                    color={isFocused ? colors.text : colors.primaryDark}
                  />
                </View>
                <Text style={[styles.label, isFocused && styles.labelFocused]}>{label}</Text>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              {isFocused ? <View style={styles.activeIndicator} /> : null}
              <Ionicons
                name={iconName}
                size={22}
                color={isFocused ? colors.primary : '#9CA3AF'}
              />
              <Text style={[styles.label, isFocused && styles.labelFocused]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 12,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingHorizontal: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 52,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  label: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  labelFocused: {
    color: colors.primary,
    fontWeight: '700',
  },
  registerPill: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${colors.accent}55`,
    borderWidth: 1,
    borderColor: `${colors.accent}99`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerPillFocused: {
    backgroundColor: colors.accent,
    borderColor: colors.accentDark,
  },
});
