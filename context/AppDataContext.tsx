import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { getOfflineProgramBundle } from '@/lib/conference-info';
import { loadConferenceSponsors } from '@/lib/load-sponsors';
import { loadProgramData } from '@/lib/load-program-data';
import { isPreviewMode } from '@/lib/offline-mode';
import type {
  Conference,
  Program,
  Session,
  Sponsor,
  SponsorCategory,
  TimeBlock,
} from '@/lib/types';

const LOAD_TIMEOUT_MS = 20000;

type AppDataContextValue = {
  conference: Conference | null;
  program: Program | null;
  sessions: Session[];
  timeBlocks: TimeBlock[];
  sponsorCategories: SponsorCategory[];
  sponsors: Sponsor[];
  loading: boolean;
  error: string;
  sponsorsError: string;
  isPreviewMode: boolean;
  refresh: () => Promise<void>;
  refreshSponsors: () => Promise<void>;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const previewMode = isPreviewMode();
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [conference, setConference] = useState<Conference | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [sponsorCategories, setSponsorCategories] = useState<SponsorCategory[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sponsorsError, setSponsorsError] = useState('');

  const clearLoadTimeout = useCallback(() => {
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, []);

  const loadPreviewData = useCallback(() => {
    const bundle = getOfflineProgramBundle();
    setConference(bundle.conference);
    setProgram(bundle.program);
    setSessions(bundle.sessions);
    setTimeBlocks(bundle.timeBlocks);
    setSponsorCategories([]);
    setSponsors([]);
    setSponsorsError('');
    setError('');
  }, []);

  const applyProgramData = useCallback(
    (programData: Awaited<ReturnType<typeof loadProgramData>>) => {
      setConference(programData.conference);
      setProgram(programData.program);
      setSessions(programData.sessions || []);
      setTimeBlocks(programData.timeBlocks || []);
      setSponsorCategories(programData.sponsorCategories || []);
      setSponsors(programData.sponsors || []);
      setSponsorsError('');
      setError('');
    },
    []
  );

  const refreshSponsors = useCallback(async () => {
    if (previewMode || !conference?.$id) return;

    try {
      const sponsorData = await loadConferenceSponsors(conference.$id);
      setSponsorCategories(sponsorData.categories);
      setSponsors(sponsorData.sponsors);
      setSponsorsError('');
    } catch (sponsorErr) {
      setSponsorCategories([]);
      setSponsors([]);
      setSponsorsError(
        sponsorErr instanceof Error ? sponsorErr.message : 'Failed to fetch sponsors'
      );
    }
  }, [conference?.$id, previewMode]);

  const refresh = useCallback(async () => {
    clearLoadTimeout();

    if (previewMode) {
      loadPreviewData();
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setSponsorsError('');

    loadTimeoutRef.current = setTimeout(() => {
      setLoading(false);
      setError((current) =>
        current || 'Loading timed out. Check your internet connection and tap Try again.'
      );
    }, LOAD_TIMEOUT_MS);

    try {
      const programData = await loadProgramData();
      applyProgramData(programData);

      const conferenceId = programData.conference?.$id;
      if (
        conferenceId &&
        (programData.sponsors?.length ?? 0) === 0 &&
        (programData.sponsorCategories?.length ?? 0) === 0
      ) {
        try {
          const sponsorData = await loadConferenceSponsors(conferenceId);
          if (sponsorData.sponsors.length > 0 || sponsorData.categories.length > 0) {
            setSponsorCategories(sponsorData.categories);
            setSponsors(sponsorData.sponsors);
            setSponsorsError('');
          }
        } catch (sponsorErr) {
          setSponsorsError(
            sponsorErr instanceof Error ? sponsorErr.message : 'Failed to fetch sponsors'
          );
        }
      }

      setLoading(false);
    } catch (err) {
      setConference(null);
      setProgram(null);
      setSessions([]);
      setTimeBlocks([]);
      setSponsorCategories([]);
      setSponsors([]);
      setSponsorsError('');
      setError(err instanceof Error ? err.message : 'Failed to fetch conference program');
      setLoading(false);
    } finally {
      clearLoadTimeout();
    }
  }, [applyProgramData, clearLoadTimeout, loadPreviewData, previewMode]);

  useEffect(() => {
    refresh();
    return clearLoadTimeout;
  }, [refresh, clearLoadTimeout]);

  const value = useMemo(
    () => ({
      conference,
      program,
      sessions,
      timeBlocks,
      sponsorCategories,
      sponsors,
      loading,
      error,
      sponsorsError,
      isPreviewMode: previewMode,
      refresh,
      refreshSponsors,
    }),
    [
      conference,
      program,
      sessions,
      timeBlocks,
      sponsorCategories,
      sponsors,
      loading,
      error,
      sponsorsError,
      previewMode,
      refresh,
      refreshSponsors,
    ]
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within AppDataProvider');
  }
  return context;
}

export function useSession(sessionId?: string) {
  const { sessions } = useAppData();
  return useMemo(
    () => sessions.find((session) => session.$id === sessionId) || null,
    [sessions, sessionId]
  );
}
