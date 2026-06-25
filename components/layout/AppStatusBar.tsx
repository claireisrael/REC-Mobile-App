import { useEffect } from 'react';
import { Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';

type AppStatusBarProps = {
  style?: 'light' | 'dark' | 'auto';
};

export function AppStatusBar({ style = 'dark' }: AppStatusBarProps) {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    RNStatusBar.setTranslucent(false);
    RNStatusBar.setBackgroundColor(style === 'light' ? '#054653' : '#F8FAFC', true);
    RNStatusBar.setBarStyle(style === 'light' ? 'light-content' : 'dark-content', true);
  }, [style]);

  return <StatusBar style={style} />;
}
