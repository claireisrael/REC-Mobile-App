import { config } from './config';

type ApiError = { error?: string };

async function postJson<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as T & ApiError;

  if (!response.ok) {
    throw new Error(data.error || 'Registration request failed');
  }

  return data;
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${config.apiBaseUrl}${path}`, { cache: 'no-store' });
  const data = (await response.json().catch(() => ({}))) as T & ApiError;

  if (!response.ok) {
    throw new Error(data.error || 'Registration request failed');
  }

  return data;
}

export const registrationApi = {
  start(email: string) {
    return postJson<{
      mode: string;
      couponRequired: boolean;
      registrationOpen: boolean;
    }>('/api/registration/start', { email });
  },

  verifyEdit(email: string, otp: string) {
    return postJson<{
      editToken: string;
      registrant?: Record<string, unknown>;
      mode: string;
    }>('/api/registration/verify-edit', { email, otp });
  },

  couponPreview(email: string, coupon: string, editToken: string) {
    return postJson<{ coupon: Record<string, unknown> }>('/api/registration/coupon-preview', {
      email,
      coupon,
      editToken,
    });
  },

  exhibitorCapacity() {
    return getJson<{ available: number; max: number; filled: number }>(
      '/api/registration/exhibitor-capacity'
    );
  },

  submit(payload: Record<string, unknown>) {
    return postJson<{ registrant: Record<string, unknown> }>('/api/registration/submit', payload);
  },
};
