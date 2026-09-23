import {
  AppwriteQuery,
  createDocument,
  listAllDocuments,
  listDocuments,
  updateDocument,
} from '@/lib/appwrite-rest';
import { config } from '@/lib/config';

export type ConnectPerson = {
  $id: string;
  fullName: string;
  email: string;
  organization?: string | null;
  designation?: string | null;
  registrationType?: string | null;
  registrantId?: string | null;
};

export type ConnectRequest = {
  $id: string;
  fromEmail: string;
  toEmail: string;
  fromName?: string | null;
  note?: string | null;
  status: 'pending' | 'accepted' | 'declined';
  $createdAt?: string;
};

export type ConnectNotification = {
  $id: string;
  toEmail: string;
  type: string;
  title: string;
  body: string;
  read?: boolean;
  metaJson?: string | null;
  $createdAt?: string;
};

function peopleId() {
  return config.appwrite.connectPeopleCollectionId;
}
function requestsId() {
  return config.appwrite.connectRequestsCollectionId;
}
function notificationsId() {
  return config.appwrite.connectNotificationsCollectionId;
}
function devicesId() {
  return config.appwrite.connectDevicesCollectionId;
}

function normalizeEmail(email: string) {
  return String(email || '')
    .trim()
    .toLowerCase();
}

async function sendExpoPush(toToken: string, title: string, body: string, data?: Record<string, string>) {
  if (!toToken || !toToken.startsWith('ExponentPushToken')) return;
  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: toToken,
        sound: 'default',
        title,
        body,
        data: data || {},
      }),
    });
  } catch {
    // Push is best-effort; in-app notification still exists.
  }
}

async function getDeviceToken(email: string): Promise<string | null> {
  const docs = await listDocuments<{ expoPushToken: string }>(devicesId(), [
    AppwriteQuery.equal('email', normalizeEmail(email)),
    AppwriteQuery.limit(1),
  ]);
  return docs[0]?.expoPushToken || null;
}

export const connectApi = {
  async listPeople(search = ''): Promise<ConnectPerson[]> {
    const people = await listAllDocuments<ConnectPerson>(peopleId(), [
      AppwriteQuery.orderAsc('fullName'),
    ]);
    const q = search.trim().toLowerCase();
    if (!q) return people;
    return people.filter((person) => {
      const hay = `${person.fullName} ${person.organization || ''}`.toLowerCase();
      return hay.includes(q);
    });
  },

  async upsertPerson(fields: {
    email: string;
    fullName: string;
    organization?: string;
  }): Promise<ConnectPerson> {
    const email = normalizeEmail(fields.email);
    const existing = await listDocuments<ConnectPerson>(peopleId(), [
      AppwriteQuery.equal('email', email),
      AppwriteQuery.limit(1),
    ]);
    const data = {
      email,
      fullName: fields.fullName.trim(),
      organization: fields.organization?.trim() || null,
    };
    if (existing[0]) {
      return updateDocument<ConnectPerson>(peopleId(), existing[0].$id, data);
    }
    return createDocument<ConnectPerson>(peopleId(), {
      ...data,
      registrationType: 'Attendee',
      registrantId: null,
    });
  },

  async listRequestsFor(email: string): Promise<ConnectRequest[]> {
    const me = normalizeEmail(email);
    const [incoming, outgoing] = await Promise.all([
      listDocuments<ConnectRequest>(requestsId(), [
        AppwriteQuery.equal('toEmail', me),
        AppwriteQuery.limit(200),
      ]),
      listDocuments<ConnectRequest>(requestsId(), [
        AppwriteQuery.equal('fromEmail', me),
        AppwriteQuery.limit(200),
      ]),
    ]);
    const map = new Map<string, ConnectRequest>();
    for (const row of [...incoming, ...outgoing]) map.set(row.$id, row);
    return Array.from(map.values());
  },

  async findRequestBetween(fromEmail: string, toEmail: string): Promise<ConnectRequest | null> {
    const from = normalizeEmail(fromEmail);
    const to = normalizeEmail(toEmail);
    const docs = await listDocuments<ConnectRequest>(requestsId(), [
      AppwriteQuery.equal('fromEmail', from),
      AppwriteQuery.equal('toEmail', to),
      AppwriteQuery.limit(5),
    ]);
    return docs[0] || null;
  },

  async sendConnectionRequest(input: {
    fromEmail: string;
    fromName: string;
    toEmail: string;
    note?: string;
  }): Promise<ConnectRequest> {
    const fromEmail = normalizeEmail(input.fromEmail);
    const toEmail = normalizeEmail(input.toEmail);
    if (fromEmail === toEmail) throw new Error('You cannot connect with yourself');

    const existing = await this.findRequestBetween(fromEmail, toEmail);
    if (existing && existing.status === 'pending') {
      throw new Error('A connection request is already pending');
    }
    if (existing && existing.status === 'accepted') {
      throw new Error('You are already connected');
    }

    const request = await createDocument<ConnectRequest>(requestsId(), {
      fromEmail,
      toEmail,
      fromName: input.fromName.trim() || null,
      note: input.note?.trim() || null,
      status: 'pending',
    });

    const title = 'New connection request';
    const body = `${input.fromName || fromEmail} wants to connect${
      input.note?.trim() ? `: “${input.note.trim()}”` : ''
    }`;

    await createDocument(notificationsId(), {
      toEmail,
      type: 'connection_request',
      title,
      body,
      read: false,
      metaJson: JSON.stringify({ requestId: request.$id, fromEmail }),
    });

    const token = await getDeviceToken(toEmail);
    if (token) await sendExpoPush(token, title, body, { type: 'connection_request' });

    return request;
  },

  async respondToRequest(
    requestId: string,
    status: 'accepted' | 'declined',
    actorEmail: string,
    actorName?: string
  ): Promise<ConnectRequest> {
    const me = normalizeEmail(actorEmail);
    const docs = await listDocuments<ConnectRequest>(requestsId(), [
      AppwriteQuery.equal('toEmail', me),
      AppwriteQuery.limit(200),
    ]);
    const target = docs.find((d) => d.$id === requestId);
    if (!target) throw new Error('Request not found');

    const updated = await updateDocument<ConnectRequest>(requestsId(), requestId, { status });

    const who = (actorName || '').trim() || 'Someone';
    const title = status === 'accepted' ? 'Connection accepted' : 'Connection declined';
    const body =
      status === 'accepted'
        ? `${who} accepted your connection request`
        : `${who} declined your connection request`;

    await createDocument(notificationsId(), {
      toEmail: target.fromEmail,
      type: status === 'accepted' ? 'connection_accepted' : 'connection_declined',
      title,
      body,
      read: false,
      metaJson: JSON.stringify({ requestId, toEmail: me }),
    });

    const token = await getDeviceToken(target.fromEmail);
    if (token) await sendExpoPush(token, title, body, { type: status });

    return updated;
  },

  async listNotifications(email: string): Promise<ConnectNotification[]> {
    const rows = await listDocuments<ConnectNotification>(notificationsId(), [
      AppwriteQuery.equal('toEmail', normalizeEmail(email)),
      AppwriteQuery.limit(100),
    ]);
    return rows.sort((a, b) => String(b.$createdAt || '').localeCompare(String(a.$createdAt || '')));
  },

  async markAllNotificationsRead(email: string): Promise<void> {
    const rows = await this.listNotifications(email);
    await Promise.all(
      rows.filter((r) => !r.read).map((r) => updateDocument(notificationsId(), r.$id, { read: true }))
    );
  },

  async registerPushToken(email: string, expoPushToken: string): Promise<void> {
    const normalized = normalizeEmail(email);
    if (!normalized || !expoPushToken) return;
    const existing = await listDocuments<{ $id: string }>(devicesId(), [
      AppwriteQuery.equal('email', normalized),
      AppwriteQuery.limit(1),
    ]);
    const data = {
      email: normalized,
      expoPushToken,
      updatedAt: new Date().toISOString(),
    };
    if (existing[0]) {
      await updateDocument(devicesId(), existing[0].$id, data);
    } else {
      await createDocument(devicesId(), data);
    }
  },
};
