import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import {
  loadSessionPrefs,
  setSessionPref,
  type SessionPref,
} from '@/lib/session-prefs';

type PrefsMap = Record<string, SessionPref>;

type SessionPrefsContextValue = {
  prefs: PrefsMap;
  ready: boolean;
  update: (
    sessionId: string,
    patch: Partial<SessionPref>,
    sessionMeta?: { title: string; startTime: string }
  ) => Promise<SessionPref>;
};

const SessionPrefsContext = createContext<SessionPrefsContextValue | null>(null);

export function SessionPrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<PrefsMap>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const map = await loadSessionPrefs();
      if (!cancelled) {
        setPrefs(map);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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

  const value = useMemo(() => ({ prefs, ready, update }), [prefs, ready, update]);

  return <SessionPrefsContext.Provider value={value}>{children}</SessionPrefsContext.Provider>;
}

export function useSessionPrefs() {
  const ctx = useContext(SessionPrefsContext);
  if (!ctx) {
    throw new Error('useSessionPrefs must be used within SessionPrefsProvider');
  }
  return ctx;
}
