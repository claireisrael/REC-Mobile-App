const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

/** Baked into release APK when CI secrets are missing — matches rec-mobile/.env */
const productionDefaults = {
  apiBaseUrl: 'https://rec.nrep.ug',
  chatApiUrl: 'https://chat.nrep.ug',
  appwrite: {
    endpoint: 'https://appwrite.nrep.ug/v1',
    projectId: '66bcc8450005201fa1af',
    databaseId: '66bcc8760033a24883f6',
    conferencesCollectionId: '6863ae070028061694f1',
    registrantsCollectionId: '6863affd00058c01e424',
    sessionsCollectionId: '68e60fc1003b0bbb05d8',
    programsCollectionId: '68e62391001de7d5c9be',
    programTimeBlocksCollectionId: 'rec_program_time_blocks',
    sponsorCategoriesCollectionId: 'rec_sponsor_categories',
    sponsorsCollectionId: 'rec_sponsors',
    connectPeopleCollectionId: 'rec_connect_people',
    connectRequestsCollectionId: 'rec_connect_requests',
    connectNotificationsCollectionId: 'rec_connect_notifications',
    connectDevicesCollectionId: 'rec_connect_devices',
  },
};

const pick = (envValue: string | undefined, fallback: string) => envValue?.trim() || fallback;

export const config = {
  apiBaseUrl: trimTrailingSlash(
    pick(process.env.EXPO_PUBLIC_API_BASE_URL, productionDefaults.apiBaseUrl)
  ),
  chatApiUrl: trimTrailingSlash(
    pick(process.env.EXPO_PUBLIC_CHAT_API_URL, productionDefaults.chatApiUrl)
  ),
  // Open Guest Dashboard directly — the landing curtain often fails on phones.
  recommendationsUrl: trimTrailingSlash(
    pick(
      process.env.EXPO_PUBLIC_RECOMMENDATIONS_URL,
      'http://rec.recommendations.nrep.ug/guest'
    )
  ),
  appwrite: {
    endpoint: pick(
      process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
      productionDefaults.appwrite.endpoint
    ),
    projectId: pick(
      process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
      productionDefaults.appwrite.projectId
    ),
    databaseId: pick(
      process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
      productionDefaults.appwrite.databaseId
    ),
    conferencesCollectionId: pick(
      process.env.EXPO_PUBLIC_APPWRITE_CONFERENCES_COLLECTION_ID,
      productionDefaults.appwrite.conferencesCollectionId
    ),
    registrantsCollectionId: pick(
      process.env.EXPO_PUBLIC_APPWRITE_REGISTRANTS_COLLECTION_ID,
      productionDefaults.appwrite.registrantsCollectionId
    ),
    sessionsCollectionId: pick(
      process.env.EXPO_PUBLIC_APPWRITE_SESSIONS_COLLECTION_ID,
      productionDefaults.appwrite.sessionsCollectionId
    ),
    programsCollectionId: pick(
      process.env.EXPO_PUBLIC_APPWRITE_PROGRAMS_COLLECTION_ID,
      productionDefaults.appwrite.programsCollectionId
    ),
    programTimeBlocksCollectionId: pick(
      process.env.EXPO_PUBLIC_APPWRITE_PROGRAM_TIME_BLOCKS_COLLECTION_ID,
      productionDefaults.appwrite.programTimeBlocksCollectionId
    ),
    sponsorCategoriesCollectionId: pick(
      process.env.EXPO_PUBLIC_APPWRITE_SPONSOR_CATEGORIES_COLLECTION_ID,
      productionDefaults.appwrite.sponsorCategoriesCollectionId
    ),
    sponsorsCollectionId: pick(
      process.env.EXPO_PUBLIC_APPWRITE_SPONSORS_COLLECTION_ID,
      productionDefaults.appwrite.sponsorsCollectionId
    ),
    connectPeopleCollectionId: pick(
      process.env.EXPO_PUBLIC_APPWRITE_CONNECT_PEOPLE_COLLECTION_ID,
      productionDefaults.appwrite.connectPeopleCollectionId
    ),
    connectRequestsCollectionId: pick(
      process.env.EXPO_PUBLIC_APPWRITE_CONNECT_REQUESTS_COLLECTION_ID,
      productionDefaults.appwrite.connectRequestsCollectionId
    ),
    connectNotificationsCollectionId: pick(
      process.env.EXPO_PUBLIC_APPWRITE_CONNECT_NOTIFICATIONS_COLLECTION_ID,
      productionDefaults.appwrite.connectNotificationsCollectionId
    ),
    connectDevicesCollectionId: pick(
      process.env.EXPO_PUBLIC_APPWRITE_CONNECT_DEVICES_COLLECTION_ID,
      productionDefaults.appwrite.connectDevicesCollectionId
    ),
  },
};

export const isAppwriteConfigured = () =>
  Boolean(
    config.appwrite.endpoint &&
      config.appwrite.projectId &&
      config.appwrite.databaseId &&
      config.appwrite.conferencesCollectionId &&
      config.appwrite.sponsorCategoriesCollectionId &&
      config.appwrite.sponsorsCollectionId
  );

export const isRecChatConfigured = () => Boolean(config.chatApiUrl);

/** @deprecated Use isRecChatConfigured */
export const isRecbrainConfigured = isRecChatConfigured;
