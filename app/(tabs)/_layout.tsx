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
      <Tabs.Screen name="sponsors" options={{ title: 'Gallery' }} />
      <Tabs.Screen name="register" options={{ title: 'Registration' }} />
    </Tabs>
  );
}
