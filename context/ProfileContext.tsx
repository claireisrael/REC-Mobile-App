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
  isProfileComplete,
  loadProfileSession,
  saveLocalProfile,
  saveProfileSession,
  type NetworkingProfile,
} from '@/lib/profile-api';

type ProfileFields = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  organization?: string;
  photoUri?: string | null;
};

type ProfileContextValue = {
  profile: NetworkingProfile | null;
  ready: boolean;
  hasProfile: boolean;
  refresh: () => Promise<NetworkingProfile | null>;
  saveProfile: (fields: ProfileFields) => Promise<NetworkingProfile>;
  clearProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<NetworkingProfile | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async (): Promise<NetworkingProfile | null> => {
    try {
      const session = await loadProfileSession();
      if (session?.profile) {
        setProfile(session.profile);
        setReady(true);
        return session.profile;
      }

      // Don't wipe a good in-memory profile if storage briefly returns empty.
      let kept: NetworkingProfile | null = null;
      setProfile((current) => {
        kept = isProfileComplete(current) ? current : null;
        return kept;
      });
      setReady(true);
      return kept;
    } catch {
      setReady(true);
      return null;
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveProfile = useCallback(async (fields: ProfileFields) => {
    const session = saveLocalProfile(fields);
    await saveProfileSession(session);
    setProfile(session.profile);
    setReady(true);
    return session.profile;
  }, []);

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
