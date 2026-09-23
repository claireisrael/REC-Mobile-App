import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { useProfile } from '@/context/ProfileContext';
import { connectApi } from '@/lib/connect-api';

type ConnectInboxValue = {
  unreadCount: number;
  pendingIncomingCount: number;
  /** Badge for Connect tab / bell — unread in-app notices. */
  badgeCount: number;
  refreshInbox: () => Promise<void>;
};

const ConnectInboxContext = createContext<ConnectInboxValue | null>(null);

const POLL_MS = 20_000;

export function ConnectInboxProvider({ children }: { children: ReactNode }) {
  const { profile, hasProfile, ready } = useProfile();
  const [unreadCount, setUnreadCount] = useState(0);
  const [pendingIncomingCount, setPendingIncomingCount] = useState(0);
  const email = hasProfile ? profile?.email || '' : '';
  const busy = useRef(false);

  const refreshInbox = useCallback(async () => {
    if (!email || busy.current) return;
    busy.current = true;
    try {
      const [notifs, requests] = await Promise.all([
        connectApi.listNotifications(email),
        connectApi.listRequestsFor(email),
      ]);
      const me = email.toLowerCase();
      setUnreadCount(notifs.filter((n) => !n.read).length);
      setPendingIncomingCount(
        requests.filter((r) => r.status === 'pending' && r.toEmail === me).length
      );
    } catch {
      // Keep last known counts.
    } finally {
      busy.current = false;
    }
  }, [email]);

  useEffect(() => {
    if (!ready || !email) {
      setUnreadCount(0);
      setPendingIncomingCount(0);
      return;
    }

    void refreshInbox();
    const timer = setInterval(() => void refreshInbox(), POLL_MS);

    const onAppState = (next: AppStateStatus) => {
      if (next === 'active') void refreshInbox();
    };
    const sub = AppState.addEventListener('change', onAppState);

    return () => {
      clearInterval(timer);
      sub.remove();
    };
  }, [ready, email, refreshInbox]);

  const value = useMemo(
    () => ({
      unreadCount,
      pendingIncomingCount,
      // Prefer unread notices for the tab badge; fall back to pending requests.
      badgeCount: unreadCount > 0 ? unreadCount : pendingIncomingCount,
      refreshInbox,
    }),
    [unreadCount, pendingIncomingCount, refreshInbox]
  );

  return (
    <ConnectInboxContext.Provider value={value}>{children}</ConnectInboxContext.Provider>
  );
}

export function useConnectInbox() {
  const ctx = useContext(ConnectInboxContext);
  if (!ctx) throw new Error('useConnectInbox must be used within ConnectInboxProvider');
  return ctx;
}
