import type { ConferenceReport } from './types';

const TYPE_LABELS: Record<string, string> = {
  conference_report: 'Conference report',
  proceedings: 'Conference proceedings',
  outcomes: 'Outcomes document',
  communique: 'Conference communique',
  other: 'Publication',
};

export function getReportTypeLabel(report: ConferenceReport) {
  return TYPE_LABELS[report.reportType || ''] || 'Conference report';
}

export function formatReportDate(value?: string) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-UG', {
    timeZone: 'Africa/Kampala',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function conferenceDisplayName(conference?: {
  shortName?: string;
  title?: string;
  fullName?: string;
  year?: number;
} | null) {
  return (
    conference?.shortName ||
    conference?.title ||
    conference?.fullName ||
    (conference?.year ? `REC ${conference.year}` : 'Conference')
  );
}
