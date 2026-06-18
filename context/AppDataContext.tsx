import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getOfflineProgramBundle } from '@/lib/conference-info';
import { loadConferenceSponsors } from '@/lib/load-sponsors';
import { isPreviewMode } from '@/lib/offline-mode';
import { fetchPublicProgramData } from '@/lib/public-program-api';
import type {
  Conference,
  Program,
  Session,
  Sponsor,
  SponsorCategory,
  TimeBlock,
} from '@/lib/types';

const SPONSORS_TIMEOUT_MS = 12000;

type AppDataContextValue = {
  conference: Conference | null;
  program: Program | null;
  sessions: Session[];
  timeBlocks: TimeBlock[];
  sponsorCategories: SponsorCategory[];
  sponsors: Sponsor[];
  loading: boolean;
  sponsorsLoading: boolean;
  error: string;
  sponsorsError: string;
  isPreviewMode: boolean;
  refresh: () => Promise<void>;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

async function loadSponsorsWithTimeout(
  conferenceId: string,
  programData: Parameters<typeof loadConferenceSponsors>[1]
) {
  return Promise.race([
    loadConferenceSponsors(conferenceId, programData),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Sponsors request timed out. Please try again.')), SPONSORS_TIMEOUT_MS);
    }),
  ]);
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const previewMode = isPreviewMode();
  const [conference, setConference] = useState<Conference | null>(null);
  const [program, setProgram] = useState<Program | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [sponsorCategories, setSponsorCategories] = useState<SponsorCategory[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [sponsorsLoading, setSponsorsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sponsorsError, setSponsorsError] = useState('');

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
    setSponsorsLoading(false);
  }, []);

  const loadSponsors = useCallback(
    async (conferenceId: string, programData: Parameters<typeof loadConferenceSponsors>[1]) => {
      setSponsorsLoading(true);
      setSponsorsError('');

      try {
        const sponsorData = await loadSponsorsWithTimeout(conferenceId, programData);
        setSponsorCategories(sponsorData.categories);
        setSponsors(sponsorData.sponsors);
      } catch (sponsorErr) {
        setSponsorCategories([]);
        setSponsors([]);
        setSponsorsError(
          sponsorErr instanceof Error ? sponsorErr.message : 'Failed to fetch sponsors'
        );
      } finally {
        setSponsorsLoading(false);
      }
    },
    []
  );

  const refresh = useCallback(async () => {
    if (previewMode) {
      loadPreviewData();
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setSponsorsError('');

    try {
      const programData = await fetchPublicProgramData();

      setConference(programData.conference);
      setProgram(programData.program);
      setSessions(programData.sessions || []);
      setTimeBlocks(programData.timeBlocks || []);
      setLoading(false);

      void loadSponsors(programData.conference.$id, programData);
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
    }
  }, [loadPreviewData, loadSponsors, previewMode]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      conference,
      program,
      sessions,
      timeBlocks,
      sponsorCategories,
      sponsors,
      loading,
      sponsorsLoading,
      error,
      sponsorsError,
      isPreviewMode: previewMode,
      refresh,
    }),
    [
      conference,
      program,
      sessions,
      timeBlocks,
      sponsorCategories,
      sponsors,
      loading,
      sponsorsLoading,
      error,
      sponsorsError,
      previewMode,
      refresh,
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
