import type { Conference } from './types';

export type ReportsSiteConfig = {
  programCtaEnabled: boolean;
  pageTitle: string;
  pageDescription: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonLabel: string;
};

export const DEFAULT_REPORTS_SITE_CONFIG: ReportsSiteConfig = {
  programCtaEnabled: true,
  pageTitle: 'Previous conference reports',
  pageDescription: 'Read official reports, proceedings, and outcomes from earlier REC editions.',
  ctaEyebrow: 'From the previous edition',
  ctaTitle: 'Continue with the conference report',
  ctaDescription:
    'Review the outcomes, recommendations, and highlights from the previous REC edition.',
  ctaButtonLabel: 'View conference report',
};

export function parseConferenceWebsiteConfig(conference: Conference | null | undefined) {
  const value = conference?.socialsJson;
  if (value && typeof value === 'object') return value as Record<string, unknown>;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  }
  return {};
}

export function getReportsSiteConfig(conference: Conference | null | undefined): ReportsSiteConfig {
  const websiteConfig = parseConferenceWebsiteConfig(conference);
  const reportsConfig =
    websiteConfig.reports && typeof websiteConfig.reports === 'object'
      ? (websiteConfig.reports as Partial<ReportsSiteConfig>)
      : {};

  return {
    ...DEFAULT_REPORTS_SITE_CONFIG,
    ...reportsConfig,
  };
}
