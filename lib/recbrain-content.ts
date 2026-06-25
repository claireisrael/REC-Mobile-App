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
  content: `Hello! I am the REC Assistant — your guide to Uganda's Annual Renewable Energy Conference (REC).

I can answer questions about all REC editions from REC22 (2022) to REC26 (2026):

→ Conference themes, dates and venues
→ Sessions and topics discussed per edition
→ Sponsors, partners and exhibitors
→ Registration and exhibition information
→ Upcoming REC26 (2026) details

What would you like to know?`,
  sources: [],
  showFollowUps: true,
};

export const QUICK_STARTS = [
  'When did REC start?',
  'What was the theme of REC24?',
  'Where was REC25 held?',
  'When is REC26?',
  'Who organises REC?',
  'How do I register for REC26?',
];

const REPORT_LINKS = {
  REC21: { label: 'REC21 Discussion Report', url: 'https://nrep.ug/resources/reports-documents/' },
  REC22: { label: 'REC22 EXPO Report 2022', url: 'https://nrep.ug/resources/reports-documents/' },
  REC23: { label: 'REC23 EXPO Report 2023', url: 'https://nrep.ug/resources/reports-documents/' },
  REC24: { label: 'REC24 EXPO Report 2024', url: 'https://nrep.ug/wp-content/uploads/2025/01/REC24-EXPO-Report-1.pdf' },
  REC25: { label: 'REC25 EXPO Report 2025', url: 'https://nrep.ug/wp-content/uploads/2026/03/REC25-EXPO-Report.pdf' },
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
  if (c.includes('rec22') || c.includes('2022'))
    return ['What was the venue for REC22?', 'What topics were at REC22?', 'When did REC23 happen?'];
  if (c.includes('rec23') || c.includes('2023'))
    return ['What topics were discussed at REC23?', 'Where was REC23 held?', 'What happened at REC24?'];
  if (c.includes('rec24') || c.includes('2024'))
    return ['What was the theme of REC24?', 'Where was REC24 held?', 'Tell me about REC25'];
  if (c.includes('rec25') || c.includes('2025'))
    return ['Where was REC25 held?', 'What were REC25 outcomes?', 'When is REC26?'];
  if (c.includes('rec26') || c.includes('2026'))
    return ['What is the theme of REC26?', 'Who are the sponsors of REC26?', 'How do I register for REC26?'];
  if (c.includes('theme'))
    return ['What was the theme of REC25?', 'What was the theme of REC24?', 'What is REC26 theme?'];
  if (c.includes('venue') || c.includes('held') || c.includes('kampala'))
    return ['Which editions were at Speke Resort?', 'Where is REC26 being held?', 'When did they move to Serena Hotel?'];
  if (c.includes('sponsor') || c.includes('partner'))
    return ['Who sponsors REC26?', 'Is GIZ involved in REC?', 'What role does NREP play?'];
  return ['When is REC26?', 'Who organises REC?', 'What was the theme of REC25?'];
}

export function createMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
