import { Tabs } from 'expo-router';

import { RecTabBar } from '@/components/navigation/RecTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <RecTabBar {...props} />}
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
      <Tabs.Screen name="register" options={{ title: 'Registration' }} />
      <Tabs.Screen name="about" options={{ href: null, title: 'About' }} />
      <Tabs.Screen name="venue" options={{ href: null, title: 'Venue' }} />
      <Tabs.Screen name="session/[id]" options={{ href: null, title: 'Session' }} />
    </Tabs>
  );
}
