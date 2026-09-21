export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources: string[];
  showFollowUps?: boolean;
};

export const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Hello! I am the REC Assistant — your guide to the Renewable Energy Conference & Expo.

I can help with:

→ Dates, venue, halls, and logistics
→ Programme sessions and themes
→ Sponsors, partners, and practical preparation
→ Published media and reports from previous editions
→ Registration status and conference contacts

Ask a question to get started.`,
  sources: [],
  showFollowUps: true,
};

export const QUICK_STARTS = [
  'How should I prepare for the conference across the 4 days?',
  'Which sessions are relevant to finance and investment?',
  'What happens on Day 3?',
  'Show me the official photos from REC24',
  'Can I download the REC25 conference report?',
];

const REPORT_LINKS = {
  REC21: { label: 'REC21 Discussion Report', url: 'https://nrep.ug/resources/reports-documents/' },
  REC22: { label: 'REC22 EXPO Report 2022', url: 'https://nrep.ug/resources/reports-documents/' },
  REC23: { label: 'REC23 EXPO Report 2023', url: 'https://nrep.ug/resources/reports-documents/' },
  REC24: {
    label: 'REC24 EXPO Report 2024',
    url: 'https://nrep.ug/wp-content/uploads/2025/01/REC24-EXPO-Report-1.pdf',
  },
  REC25: {
    label: 'REC25 EXPO Report 2025',
    url: 'https://nrep.ug/wp-content/uploads/2026/03/REC25-EXPO-Report.pdf',
  },
  REC26: { label: 'REC26 Info', url: 'https://nrep.ug/rec/' },
};

export function getReportLink(content: string, edition?: string) {
  const combined = `${content} ${edition || ''}`.toUpperCase();
  if (combined.includes('REC26')) return REPORT_LINKS.REC26;
  if (combined.includes('REC25')) return REPORT_LINKS.REC25;
  if (combined.includes('REC24')) return REPORT_LINKS.REC24;
  if (combined.includes('REC23')) return REPORT_LINKS.REC23;
  if (combined.includes('REC22')) return REPORT_LINKS.REC22;
  if (combined.includes('REC21')) return REPORT_LINKS.REC21;
  return null;
}

export function getFollowUps(content: string) {
  const c = content.toLowerCase();
  if (c.includes('day 3') || c.includes('day3'))
    return ['What happens on Day 1?', 'What happens on Day 2?', 'Where is the venue?'];
  if (c.includes('report') || c.includes('media') || c.includes('photo'))
    return ['Can I download the REC25 conference report?', 'Show me REC24 media', 'When is REC26?'];
  if (c.includes('session') || c.includes('programme') || c.includes('program'))
    return ['Which sessions are about investment?', 'What happens on Day 2?', 'Where are the halls?'];
  if (c.includes('venue') || c.includes('serena') || c.includes('kampala'))
    return ['How do I get to the venue?', 'What is the conference theme?', 'When does registration open?'];
  if (c.includes('sponsor') || c.includes('partner'))
    return ['Who organises REC?', 'How do I become a sponsor?', 'What is NREP?'];
  return [
    'When is the conference?',
    'How should I prepare for the 4 days?',
    'Can I download the REC25 conference report?',
  ];
}

export function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
