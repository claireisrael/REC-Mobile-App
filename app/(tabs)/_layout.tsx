import { Tabs } from 'expo-router';

import { RecTabBar } from '@/components/navigation/RecTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <RecTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="program" options={{ title: 'Program' }} />
      <Tabs.Screen name="sponsors" options={{ title: 'Sponsors' }} />
      <Tabs.Screen name="venue" options={{ title: 'Venue' }} />
      <Tabs.Screen name="register" options={{ title: 'Register' }} />
    </Tabs>
  );
}
