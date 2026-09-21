import type {
  FeaturedPreviousReportResponse,
  ReportConferencesResponse,
  ReportsListResponse,
} from './types';
import { config } from './config';

const PUBLIC_REPORTS_TIMEOUT_MS = 15000;

type ReportQueryOptions = {
  type?: string;
  page?: number;
  limit?: number;
};

async function fetchJson<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), PUBLIC_REPORTS_TIMEOUT_MS);

  try {
    const response = await fetch(`${config.apiBaseUrl}${path}`, {
      signal: controller.signal,
      cache: 'no-store',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Failed to load reports (${response.status})`);
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('The reports request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchReportConferences(): Promise<ReportConferencesResponse> {
  return fetchJson<ReportConferencesResponse>('/api/reports/conferences');
}

export async function fetchConferenceReports(
  conferenceId: string,
  options: ReportQueryOptions = {}
): Promise<ReportsListResponse> {
  const params = new URLSearchParams({
    conferenceId,
    page: String(options.page || 1),
    limit: String(options.limit || 100),
  });

  if (options.type) params.set('type', options.type);

  return fetchJson<ReportsListResponse>(`/api/reports/public?${params.toString()}`);
}

export async function fetchFeaturedPreviousReport(
  conferenceId?: string
): Promise<FeaturedPreviousReportResponse> {
  const params = new URLSearchParams();
  if (conferenceId) params.set('conferenceId', conferenceId);

  const query = params.toString();
  return fetchJson<FeaturedPreviousReportResponse>(
    `/api/reports/featured${query ? `?${query}` : ''}`
  );
}
