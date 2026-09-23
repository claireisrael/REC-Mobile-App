import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { useProfile } from '@/context/ProfileContext';
import { routes } from '@/lib/routes';

/**
 * First launch only: if no profile yet, open Profile so the setup dialogue shows.
 * Does not keep forcing Profile after the user has completed setup.
 */
export function ProfileSetupHost() {
  const router = useRouter();
  const { ready, hasProfile } = useProfile();
  const didRoute = useRef(false);

  useEffect(() => {
    if (!ready || didRoute.current || hasProfile) return;
    didRoute.current = true;

    const timer = setTimeout(() => {
      try {
        router.replace(routes.profile);
      } catch {
        // Tabs may not be ready yet.
      }
    }, 160);

    return () => clearTimeout(timer);
  }, [ready, hasProfile, router]);

  return null;
}
