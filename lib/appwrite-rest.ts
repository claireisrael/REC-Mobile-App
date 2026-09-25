import { config } from './config';

type AppwriteQuery =
  | { method: 'equal'; attribute: string; values: (string | number | boolean)[] }
  | { method: 'contains'; attribute: string; values: (string | number | boolean)[] }
  | { method: 'orderAsc'; attribute: string }
  | { method: 'orderDesc'; attribute: string }
  | { method: 'limit'; values: number[] }
  | { method: 'offset'; values: number[] }
  | { method: 'search'; attribute: string; values: string[] };

export const AppwriteQuery = {
  equal(attribute: string, value: string | number | boolean) {
    return { method: 'equal' as const, attribute, values: [value] };
  },
  contains(attribute: string, value: string | number | boolean) {
    return { method: 'contains' as const, attribute, values: [value] };
  },
  orderAsc(attribute: string) {
    return { method: 'orderAsc' as const, attribute };
  },
  orderDesc(attribute: string) {
    return { method: 'orderDesc' as const, attribute };
  },
  limit(value: number) {
    return { method: 'limit' as const, values: [value] };
  },
  offset(value: number) {
    return { method: 'offset' as const, values: [value] };
  },
  search(attribute: string, value: string) {
    return { method: 'search' as const, attribute, values: [value] };
  },
};

function projectHeaders() {
  return {
    'X-Appwrite-Project': config.appwrite.projectId,
    'Content-Type': 'application/json',
    'X-Appwrite-Response-Format': '1.9.0',
  };
}

function buildDocumentsUrl(collectionId: string, queries: AppwriteQuery[]) {
  const params = queries
    .map((query, index) => `queries[${index}]=${encodeURIComponent(JSON.stringify(query))}`)
    .join('&');
  const { endpoint, databaseId } = config.appwrite;
  return `${endpoint}/databases/${databaseId}/collections/${collectionId}/documents?${params}`;
}

function documentUrl(collectionId: string, documentId?: string) {
  const { endpoint, databaseId } = config.appwrite;
  const base = `${endpoint}/databases/${databaseId}/collections/${collectionId}/documents`;
  return documentId ? `${base}/${documentId}` : base;
}

async function readError(response: Response, fallback: string) {
  const body = await response.text().catch(() => '');
  return `${fallback} (${response.status})${body ? `: ${body}` : ''}`;
}

/**
 * List Appwrite documents via REST fetch.
 * More reliable than the Appwrite JS SDK in React Native release builds.
 */
export async function listDocuments<T>(collectionId: string, queries: AppwriteQuery[]): Promise<T[]> {
  const response = await fetch(buildDocumentsUrl(collectionId, queries), {
    method: 'GET',
    headers: projectHeaders(),
  });

  if (!response.ok) {
    throw new Error(await readError(response, `Appwrite list failed for ${collectionId}`));
  }

  const data = (await response.json()) as { documents?: T[] };
  return data.documents ?? [];
}

export async function listAllDocuments<T>(
  collectionId: string,
  baseQueries: AppwriteQuery[] = [],
  pageSize = 100
): Promise<T[]> {
  const all: T[] = [];
  let offset = 0;
  while (true) {
    const batch = await listDocuments<T>(collectionId, [
      ...baseQueries,
      AppwriteQuery.limit(pageSize),
      AppwriteQuery.offset(offset),
    ]);
    all.push(...batch);
    if (batch.length < pageSize) break;
    offset += pageSize;
  }
  return all;
}

export async function createDocument<T>(
  collectionId: string,
  data: Record<string, unknown>,
  documentId = 'unique()'
): Promise<T> {
  const response = await fetch(documentUrl(collectionId), {
    method: 'POST',
    headers: projectHeaders(),
    body: JSON.stringify({ documentId, data }),
  });
  if (!response.ok) {
    throw new Error(await readError(response, `Appwrite create failed for ${collectionId}`));
  }
  return (await response.json()) as T;
}

export async function updateDocument<T>(
  collectionId: string,
  documentId: string,
  data: Record<string, unknown>
): Promise<T> {
  const response = await fetch(documentUrl(collectionId, documentId), {
    method: 'PATCH',
    headers: projectHeaders(),
    body: JSON.stringify({ data }),
  });
  if (!response.ok) {
    throw new Error(await readError(response, `Appwrite update failed for ${collectionId}`));
  }
  return (await response.json()) as T;
}
