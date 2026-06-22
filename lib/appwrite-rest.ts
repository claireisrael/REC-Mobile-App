import { config } from './config';

type AppwriteQuery =
  | { method: 'equal'; attribute: string; values: (string | number | boolean)[] }
  | { method: 'orderAsc'; attribute: string }
  | { method: 'orderDesc'; attribute: string }
  | { method: 'limit'; values: number[] };

export const AppwriteQuery = {
  equal(attribute: string, value: string | number | boolean) {
    return { method: 'equal' as const, attribute, values: [value] };
  },
  orderAsc(attribute: string) {
    return { method: 'orderAsc' as const, attribute };
  },
  limit(value: number) {
    return { method: 'limit' as const, values: [value] };
  },
};

function buildDocumentsUrl(collectionId: string, queries: AppwriteQuery[]) {
  const params = queries
    .map((query, index) => `queries[${index}]=${encodeURIComponent(JSON.stringify(query))}`)
    .join('&');
  const { endpoint, databaseId } = config.appwrite;
  return `${endpoint}/databases/${databaseId}/collections/${collectionId}/documents?${params}`;
}

/**
 * List Appwrite documents via REST fetch.
 * More reliable than the Appwrite JS SDK in React Native release builds.
 */
export async function listDocuments<T>(collectionId: string, queries: AppwriteQuery[]): Promise<T[]> {
  const response = await fetch(buildDocumentsUrl(collectionId, queries), {
    method: 'GET',
    headers: {
      'X-Appwrite-Project': config.appwrite.projectId,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `Appwrite request failed (${response.status}) for ${collectionId}${body ? `: ${body}` : ''}`
    );
  }

  const data = (await response.json()) as { documents?: T[] };
  return data.documents ?? [];
}
