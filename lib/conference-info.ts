import {
  DEMO_SESSIONS,
  DEMO_TIME_BLOCKS,
  STATIC_CONFERENCE,
  STATIC_PROGRAM,
} from '@/data/static-content';
import type { Conference } from '@/lib/types';
import { isPreviewMode } from '@/lib/offline-mode';

/** Live conference from API, or static content only in explicit preview mode. */
export function getConferenceInfo(live: Conference | null): Conference | null {
  if (live) return live;
  return isPreviewMode() ? STATIC_CONFERENCE : null;
}

export function getOfflineProgramBundle() {
  return {
    conference: STATIC_CONFERENCE,
    program: STATIC_PROGRAM,
    sessions: DEMO_SESSIONS,
    timeBlocks: DEMO_TIME_BLOCKS,
  };
}

export function shouldUseLiveData() {
  return !isPreviewMode();
}
