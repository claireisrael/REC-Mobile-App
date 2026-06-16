import type { Conference, Program, Session, Sponsor, SponsorCategory, TimeBlock } from './types';
import {
  CONFERENCES_COLLECTION_ID,
  DATABASE_ID,
  PROGRAM_TIME_BLOCKS_COLLECTION_ID,
  PROGRAMS_COLLECTION_ID,
  Query,
  SESSIONS_COLLECTION_ID,
  SPONSOR_CATEGORIES_COLLECTION_ID,
  SPONSORS_COLLECTION_ID,
  databases,
} from './appwrite-config';

export const apiService = {
  async getActiveConference(): Promise<Conference | null> {
    const response = await databases.listDocuments(DATABASE_ID, CONFERENCES_COLLECTION_ID, [
      Query.equal('isActive', true),
      Query.limit(1),
    ]);
    return response.documents.length > 0 ? (response.documents[0] as unknown as Conference) : null;
  },

  async getPublishedProgram(conferenceId: string): Promise<Program | null> {
    const response = await databases.listDocuments(DATABASE_ID, PROGRAMS_COLLECTION_ID, [
      Query.equal('conferenceId', conferenceId),
      Query.equal('status', 'PUBLISHED'),
      Query.limit(1),
    ]);
    return response.documents.length > 0 ? (response.documents[0] as unknown as Program) : null;
  },

  async getPublishedSessions(programId: string): Promise<Session[]> {
    const response = await databases.listDocuments(DATABASE_ID, SESSIONS_COLLECTION_ID, [
      Query.equal('programId', programId),
      Query.equal('status', 'PUBLISHED'),
      Query.orderAsc('day'),
      Query.orderAsc('startTime'),
      Query.limit(1000),
    ]);
    return response.documents as unknown as Session[];
  },

  async getProgramTimeBlocks(programId: string): Promise<TimeBlock[]> {
    if (!PROGRAM_TIME_BLOCKS_COLLECTION_ID) return [];

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        PROGRAM_TIME_BLOCKS_COLLECTION_ID,
        [
          Query.equal('programId', programId),
          Query.orderAsc('day'),
          Query.orderAsc('startMinutes'),
          Query.limit(1000),
        ]
      );
      return response.documents as unknown as TimeBlock[];
    } catch {
      return [];
    }
  },

  async getSponsorCategories(conferenceId: string): Promise<SponsorCategory[]> {
    if (!SPONSOR_CATEGORIES_COLLECTION_ID || !conferenceId) return [];

    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        SPONSOR_CATEGORIES_COLLECTION_ID,
        [
          Query.equal('conferenceId', conferenceId),
          Query.equal('isActive', true),
          Query.orderAsc('displayOrder'),
          Query.limit(200),
        ]
      );
      return response.documents as unknown as SponsorCategory[];
    } catch {
      return [];
    }
  },

  async getSponsors(conferenceId: string): Promise<Sponsor[]> {
    if (!SPONSORS_COLLECTION_ID || !conferenceId) return [];

    try {
      const response = await databases.listDocuments(DATABASE_ID, SPONSORS_COLLECTION_ID, [
        Query.equal('conferenceId', conferenceId),
        Query.equal('isActive', true),
        Query.orderAsc('displayOrder'),
        Query.limit(500),
      ]);
      return response.documents as unknown as Sponsor[];
    } catch {
      return [];
    }
  },

  async getConferenceSponsors(conferenceId: string) {
    const [categories, sponsors] = await Promise.all([
      this.getSponsorCategories(conferenceId),
      this.getSponsors(conferenceId),
    ]);
    return { categories, sponsors };
  },
};
