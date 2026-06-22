import type { Conference, Program, Session, Sponsor, SponsorCategory, TimeBlock } from './types';
import { config } from './config';
import { AppwriteQuery, listDocuments } from './appwrite-rest';

export const apiService = {
  async getActiveConference(): Promise<Conference | null> {
    const documents = await listDocuments<Conference>(
      config.appwrite.conferencesCollectionId,
      [AppwriteQuery.equal('isActive', true), AppwriteQuery.limit(1)]
    );
    return documents.length > 0 ? documents[0] : null;
  },

  async getPublishedProgram(conferenceId: string): Promise<Program | null> {
    const documents = await listDocuments<Program>(config.appwrite.programsCollectionId, [
      AppwriteQuery.equal('conferenceId', conferenceId),
      AppwriteQuery.equal('status', 'PUBLISHED'),
      AppwriteQuery.limit(1),
    ]);
    return documents.length > 0 ? documents[0] : null;
  },

  async getPublishedSessions(programId: string): Promise<Session[]> {
    return listDocuments<Session>(config.appwrite.sessionsCollectionId, [
      AppwriteQuery.equal('programId', programId),
      AppwriteQuery.equal('status', 'PUBLISHED'),
      AppwriteQuery.orderAsc('day'),
      AppwriteQuery.orderAsc('startTime'),
      AppwriteQuery.limit(1000),
    ]);
  },

  async getProgramTimeBlocks(programId: string): Promise<TimeBlock[]> {
    const collectionId = config.appwrite.programTimeBlocksCollectionId;
    if (!collectionId) return [];

    try {
      return await listDocuments<TimeBlock>(collectionId, [
        AppwriteQuery.equal('programId', programId),
        AppwriteQuery.orderAsc('day'),
        AppwriteQuery.orderAsc('startMinutes'),
        AppwriteQuery.limit(1000),
      ]);
    } catch {
      return [];
    }
  },

  async getSponsorCategories(conferenceId: string): Promise<SponsorCategory[]> {
    const collectionId = config.appwrite.sponsorCategoriesCollectionId;
    if (!collectionId || !conferenceId) return [];

    try {
      return await listDocuments<SponsorCategory>(collectionId, [
        AppwriteQuery.equal('conferenceId', conferenceId),
        AppwriteQuery.equal('isActive', true),
        AppwriteQuery.orderAsc('displayOrder'),
        AppwriteQuery.limit(200),
      ]);
    } catch (error) {
      console.error('Error fetching sponsor categories:', error);
      return [];
    }
  },

  async getSponsors(conferenceId: string): Promise<Sponsor[]> {
    const collectionId = config.appwrite.sponsorsCollectionId;
    if (!collectionId || !conferenceId) return [];

    try {
      return await listDocuments<Sponsor>(collectionId, [
        AppwriteQuery.equal('conferenceId', conferenceId),
        AppwriteQuery.equal('isActive', true),
        AppwriteQuery.orderAsc('displayOrder'),
        AppwriteQuery.limit(500),
      ]);
    } catch (error) {
      console.error('Error fetching sponsors:', error);
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
