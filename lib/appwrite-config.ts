import { Client, Databases, Query } from 'appwrite';

import { config } from './config';

const client = new Client();

if (config.appwrite.endpoint && config.appwrite.projectId) {
  client.setEndpoint(config.appwrite.endpoint).setProject(config.appwrite.projectId);
}

export const databases = new Databases(client);
export const DATABASE_ID = config.appwrite.databaseId;
export const CONFERENCES_COLLECTION_ID = config.appwrite.conferencesCollectionId;
export const SESSIONS_COLLECTION_ID = config.appwrite.sessionsCollectionId;
export const PROGRAMS_COLLECTION_ID = config.appwrite.programsCollectionId;
export const PROGRAM_TIME_BLOCKS_COLLECTION_ID =
  config.appwrite.programTimeBlocksCollectionId;
export const SPONSOR_CATEGORIES_COLLECTION_ID =
  config.appwrite.sponsorCategoriesCollectionId;
export const SPONSORS_COLLECTION_ID = config.appwrite.sponsorsCollectionId;

export { Query };
