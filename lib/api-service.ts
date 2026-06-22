import type { Conference, Program, Session, Sponsor, SponsorCategory, TimeBlock } from './types';
import { config } from './config';
import { Query, getDatabases } from './appwrite-config';

export const apiService = {
  async getActiveConference(): Promise<Conference | null> {
    const response = await getDatabases().listDocuments(
      config.appwrite.databaseId,
      config.appwrite.conferencesCollectionId,
      [Query.equal('isActive', true), Query.limit(1)]
    );
    return response.documents.length > 0 ? (response.documents[0] as unknown as Conference) : null;
  },

  async getPublishedProgram(conferenceId: string): Promise<Program | null> {
    const response = await getDatabases().listDocuments(
      config.appwrite.databaseId,
      config.appwrite.programsCollectionId,
      [
        Query.equal('conferenceId', conferenceId),
        Query.equal('status', 'PUBLISHED'),
        Query.limit(1),
      ]
    );
    return response.documents.length > 0 ? (response.documents[0] as unknown as Program) : null;
  },

  async getPublishedSessions(programId: string): Promise<Session[]> {
    const response = await getDatabases().listDocuments(
      config.appwrite.databaseId,
      config.appwrite.sessionsCollectionId,
      [
        Query.equal('programId', programId),
        Query.equal('status', 'PUBLISHED'),
        Query.orderAsc('day'),
        Query.orderAsc('startTime'),
        Query.limit(1000),
      ]
    );
    return response.documents as unknown as Session[];
  },

  async getProgramTimeBlocks(programId: string): Promise<TimeBlock[]> {
    const collectionId = config.appwrite.programTimeBlocksCollectionId;
    if (!collectionId) return [];

    try {
      const response = await getDatabases().listDocuments(
        config.appwrite.databaseId,
        collectionId,
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
    const collectionId = config.appwrite.sponsorCategoriesCollectionId;
    if (!collectionId || !conferenceId) return [];

    const response = await getDatabases().listDocuments(
      config.appwrite.databaseId,
      collectionId,
      [
        Query.equal('conferenceId', conferenceId),
        Query.equal('isActive', true),
        Query.orderAsc('displayOrder'),
        Query.limit(200),
      ]
    );
    return response.documents as unknown as SponsorCategory[];
  },

  async getSponsors(conferenceId: string): Promise<Sponsor[]> {
    const collectionId = config.appwrite.sponsorsCollectionId;
    if (!collectionId || !conferenceId) return [];

    const response = await getDatabases().listDocuments(
      config.appwrite.databaseId,
      collectionId,
      [
        Query.equal('conferenceId', conferenceId),
        Query.equal('isActive', true),
        Query.orderAsc('displayOrder'),
        Query.limit(500),
      ]
    );
    return response.documents as unknown as Sponsor[];
  },

  async getConferenceSponsors(conferenceId: string) {
    const [categories, sponsors] = await Promise.all([
      this.getSponsorCategories(conferenceId),
      this.getSponsors(conferenceId),
    ]);
    return { categories, sponsors };
  },
};
