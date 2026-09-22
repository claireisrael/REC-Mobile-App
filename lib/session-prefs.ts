import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

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
  }

  if (patch.remind === false && prev.notificationId) {
    await cancelScheduledNotification(prev.notificationId);
    next.notificationId = null;
  }

  map[sessionId] = next;
  await writeAll(map);
  return next;
}

export function useSessionPrefs() {
  const [prefs, setPrefs] = useState<PrefsMap>({});
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const map = await loadSessionPrefs();
    setPrefs(map);
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(
    async (
      sessionId: string,
      patch: Partial<SessionPref>,
      sessionMeta?: { title: string; startTime: string }
    ) => {
      const next = await setSessionPref(sessionId, patch, sessionMeta);
      setPrefs((prev) => ({ ...prev, [sessionId]: next }));
      return next;
    },
    []
  );

  return { prefs, ready, update, refresh };
}
