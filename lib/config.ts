const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const config = {
  apiBaseUrl: trimTrailingSlash(
    process.env.EXPO_PUBLIC_API_BASE_URL || 'https://rec.nrep.ug'
  ),
  appwrite: {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || '',
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '',
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || '',
    conferencesCollectionId:
      process.env.EXPO_PUBLIC_APPWRITE_CONFERENCES_COLLECTION_ID || '',
    sessionsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_SESSIONS_COLLECTION_ID || '',
    programsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROGRAMS_COLLECTION_ID || '',
    programTimeBlocksCollectionId:
      process.env.EXPO_PUBLIC_APPWRITE_PROGRAM_TIME_BLOCKS_COLLECTION_ID ||
      'rec_program_time_blocks',
    sponsorCategoriesCollectionId:
      process.env.EXPO_PUBLIC_APPWRITE_SPONSOR_CATEGORIES_COLLECTION_ID ||
      'rec_sponsor_categories',
    sponsorsCollectionId:
      process.env.EXPO_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID || 'rec_sponsors',
  },
};

export const isAppwriteConfigured = () =>
  Boolean(
    config.appwrite.endpoint &&
      config.appwrite.projectId &&
      config.appwrite.databaseId &&
      config.appwrite.conferencesCollectionId
  );
