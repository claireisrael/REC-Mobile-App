import Constants from 'expo-constants';
import { Platform } from 'react-native';

import { connectApi } from '@/lib/connect-api';

type NotificationsModule = typeof import('expo-notifications');

/** Expo Go (SDK 53+) throws if expo-notifications is loaded for remote push on Android. */
function isExpoGo() {
  return Constants.appOwnership === 'expo';
}

let notificationsPromise: Promise<NotificationsModule | null> | null = null;
let handlerConfigured = false;

async function getNotifications(): Promise<NotificationsModule | null> {
  if (isExpoGo()) return null;

  if (!notificationsPromise) {
    notificationsPromise = import('expo-notifications')
      .then((mod) => {
        if (!handlerConfigured) {
          handlerConfigured = true;
          mod.setNotificationHandler({
            handleNotification: async () => ({
              shouldShowBanner: true,
              shouldShowList: true,
              shouldPlaySound: true,
              shouldSetBadge: true,
            }),
          });
        }
        return mod;
      })
      .catch(() => null);
  }

  return notificationsPromise;
}

export async function ensurePushPermissions(): Promise<boolean> {
  const Notifications = await getNotifications();
  if (!Notifications) return false;

  try {
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    const requested = await Notifications.requestPermissionsAsync();
    return Boolean(requested.granted);
  } catch {
    return false;
  }
}

export async function registerConnectPushToken(email: string): Promise<void> {
  if (!email) return;
  const Notifications = await getNotifications();
  if (!Notifications) return;

  try {
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
  } catch {
    // Push requires a development/production build — skip in Expo Go / unsupported runtimes.
  }
}

export async function scheduleSessionReminder(input: {
  sessionId: string;
  title: string;
  startTime: string;
  minutesBefore?: number;
}): Promise<string | null> {
  const Notifications = await getNotifications();
  if (!Notifications) return null;

  try {
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
  } catch {
    return null;
  }
}

export async function cancelScheduledNotification(notificationId?: string | null) {
  if (!notificationId) return;
  const Notifications = await getNotifications();
  if (!Notifications) return;

  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // ignore
  }
}
