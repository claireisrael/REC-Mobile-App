import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { hasCompleteProfile } from '@/lib/profile-api';
import { routes } from '@/lib/routes';

/**
 * On launch: send users with a saved profile to the Profile tab.
 * Users without a profile are sent there too so the setup dialogue appears.
 */
export function ProfileSetupHost() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await hasCompleteProfile();
      if (cancelled) return;
      setTimeout(() => {
        try {
          router.replace(routes.profile);
        } catch {
          // Tabs may not be ready yet.
        }
      }, 120);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return null;
}
