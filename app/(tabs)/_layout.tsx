import { Tabs } from 'expo-router';

import { RecTabBar, type RecTabBarProps } from '@/components/navigation/RecTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <RecTabBar {...(props as unknown as RecTabBarProps)} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        freezeOnBlur: false,
        lazy: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="program" options={{ title: 'Program' }} />
      <Tabs.Screen name="sponsors" options={{ title: 'Media' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="connect" options={{ title: 'Connect' }} />
      <Tabs.Screen name="register" options={{ href: null, title: 'Register' }} />
      <Tabs.Screen name="about" options={{ href: null, title: 'About' }} />
      <Tabs.Screen name="venue" options={{ href: null, title: 'Venue' }} />
      <Tabs.Screen name="reports" options={{ href: null, title: 'Reports' }} />
      <Tabs.Screen name="explore-uganda" options={{ href: null, title: 'Explore Uganda' }} />
      <Tabs.Screen name="session/[id]" options={{ href: null, title: 'Session' }} />
    </Tabs>
  );
}
