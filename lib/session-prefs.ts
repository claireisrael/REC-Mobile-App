import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

import { cancelScheduledNotification, scheduleSessionReminder } from '@/lib/notifications';

const STORAGE_KEY = 'rec.sessionPrefs.v1';

export type SessionPref = {
  attending?: boolean;
  bookmarked?: boolean;
  remind?: boolean;
  notificationId?: string | null;
};

type PrefsMap = Record<string, SessionPref>;

async function readAll(): Promise<PrefsMap> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as PrefsMap;
  } catch {
    return {};
  }
}

async function writeAll(map: PrefsMap) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export async function loadSessionPrefs(): Promise<PrefsMap> {
  return readAll();
}

function explainRemindFailure(startTime?: string) {
  if (Constants.appOwnership === 'expo') {
    Alert.alert(
      'Reminders need the installed app',
      'Session reminders use your phone’s notification clock. They work in the REC APK, not in Expo Go.'
    );
    return;
  }

  const start = startTime ? new Date(startTime).getTime() : NaN;
  if (Number.isFinite(start) && start - 15 * 60 * 1000 <= Date.now()) {
    Alert.alert(
      'Too close to start',
      'This session starts in less than 15 minutes, so a reminder can’t be scheduled.'
    );
    return;
  }

  Alert.alert(
    'Could not set reminder',
    'Allow notifications for REC in your phone settings, then try again.'
  );
}

/** Persist session Save / Attend / Remind prefs. Schedules a local device reminder when Remind is on. */
export async function setSessionPref(
  sessionId: string,
  patch: Partial<SessionPref>,
  sessionMeta?: { title: string; startTime: string }
): Promise<SessionPref> {
  const map = await readAll();
  const prev = map[sessionId] || {};
  const next: SessionPref = { ...prev, ...patch };

  if (patch.remind === true && sessionMeta?.startTime) {
    if (prev.notificationId) {
      await cancelScheduledNotification(prev.notificationId);
    }
    const notificationId = await scheduleSessionReminder({
      sessionId,
      title: sessionMeta.title,
      startTime: sessionMeta.startTime,
    });
    next.notificationId = notificationId;
    next.remind = Boolean(notificationId);
    if (!notificationId) {
      explainRemindFailure(sessionMeta.startTime);
    }
  }

  if (patch.remind === false && prev.notificationId) {
    await cancelScheduledNotification(prev.notificationId);
    next.notificationId = null;
  }

  map[sessionId] = next;
  await writeAll(map);
  return next;
}
