import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { connectApi } from '@/lib/connect-api';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function ensurePushPermissions(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const requested = await Notifications.requestPermissionsAsync();
  return Boolean(requested.granted);
}

export async function registerConnectPushToken(email: string): Promise<void> {
  if (!email) return;
  const granted = await ensurePushPermissions();
  if (!granted) return;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('connect', {
      name: 'Connect',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  const tokenResult = await Notifications.getExpoPushTokenAsync();
  const token = tokenResult.data;
  if (token) {
    await connectApi.registerPushToken(email, token);
  }
}

export async function scheduleSessionReminder(input: {
  sessionId: string;
  title: string;
  startTime: string;
  minutesBefore?: number;
}): Promise<string | null> {
  const granted = await ensurePushPermissions();
  if (!granted) return null;

  const start = new Date(input.startTime).getTime();
  if (!Number.isFinite(start)) return null;
  const minutesBefore = input.minutesBefore ?? 15;
  const triggerAt = start - minutesBefore * 60 * 1000;
  if (triggerAt <= Date.now()) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('sessions', {
      name: 'Session reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Session reminder',
      body: `${input.title} starts in ${minutesBefore} minutes`,
      data: { sessionId: input.sessionId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(triggerAt),
      channelId: Platform.OS === 'android' ? 'sessions' : undefined,
    },
  });
}

export async function cancelScheduledNotification(notificationId?: string | null) {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // ignore
  }
}
