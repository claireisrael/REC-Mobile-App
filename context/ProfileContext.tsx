import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  clearProfileSession,
  hasCompleteProfile,
  isProfileComplete,
  loadProfileSession,
  saveLocalProfile,
  saveProfileSession,
  type NetworkingProfile,
} from '@/lib/profile-api';

type ProfileContextValue = {
  profile: NetworkingProfile | null;
  ready: boolean;
  hasProfile: boolean;
  refresh: () => Promise<void>;
  saveProfile: (fields: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    organization?: string;
    photoUri?: string | null;
  }) => Promise<NetworkingProfile>;
  clearProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<NetworkingProfile | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const session = await loadProfileSession();
      setProfile((current) => {
        if (session?.profile) return session.profile;
        // Keep an in-memory complete profile if storage briefly returns empty
        // (avoids the “set up profile again” loop right after save).
        if (isProfileComplete(current)) return current;
        return null;
      });
    } catch {
      // Keep whatever profile we already have in memory.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveProfile = useCallback(
    async (fields: {
      fullName: string;
      email: string;
      phone: string;
      address: string;
      organization?: string;
      photoUri?: string | null;
    }) => {
      const session = saveLocalProfile(fields);
      await saveProfileSession(session);
      setProfile(session.profile);
      setReady(true);
      return session.profile;
    },
    []
  );

  const clearProfile = useCallback(async () => {
    await clearProfileSession();
    setProfile(null);
    setReady(true);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      ready,
      hasProfile: isProfileComplete(profile),
      refresh,
      saveProfile,
      clearProfile,
    }),
    [profile, ready, refresh, saveProfile, clearProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}

export async function checkHasCompleteProfile() {
  return hasCompleteProfile();
}
