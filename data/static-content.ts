import type { Conference, Program, Session, TimeBlock } from '@/lib/types';

/** Bundled conference info — used when Appwrite is not configured. */
export const STATIC_CONFERENCE: Conference = {
  $id: 'static-conference',
  isActive: true,
  registrationOpen: true,
  title: 'Renewable Energy Conference & Expo',
  shortName: 'REC',
  fullName: 'Renewable Energy Conference & Expo',
  theme: 'Accelerating Uganda\'s Clean Energy Transition',
  description:
    'The Ministry of Energy and Mineral Development, in partnership with the National Renewable Energy Platform, convenes the Renewable Energy Conference & Expo as a practical forum for policy, investment, innovation, and sector coordination.',
  heroTagline:
    'Join renewable energy leaders, innovators, and policymakers for practical conversations, partnerships, and sector momentum.',
  startDate: '2026-10-15T00:00:00.000Z',
  endDate: '2026-10-17T00:00:00.000Z',
  location: 'Kampala, Uganda',
  venue: 'Speke Resort Munyonyo',
  contactEmail: 'info@nrep.ug',
  contactPhone: '+256 414 000 000',
  maxAttendees: 500,
  maxExhibitors: 50,
  couponRequired: false,
  socialsJson: JSON.stringify({
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Speke+Resort+Munyonyo,+Kampala',
  }),
};

export const STATIC_PROGRAM: Program = {
  $id: 'static-program',
  conferenceId: 'static-conference',
  status: 'PUBLISHED',
  title: 'Conference Program',
  daysCount: 3,
  venueHalls: ['Main Hall', 'Hall B'],
};

export const CONFERENCE_OBJECTIVES = [
  {
    title: 'Review REC Outcomes',
    description:
      'Build on commitments and progress from previous editions to accelerate Uganda\'s clean energy transition.',
  },
  {
    title: 'Engage with Global Experts',
    description:
      'Dialogue with international and regional leaders on scaling renewable energy systems and markets.',
  },
  {
    title: 'Drive the Green Economy',
    description:
      'Explore how renewable energy powers industrial growth, green jobs, and economic resilience.',
  },
  {
    title: 'Discover Scalable Solutions',
    description:
      'Showcase technologies and solutions ready for large-scale deployment across Uganda and Africa.',
  },
  {
    title: 'Unlock Investment Opportunities',
    description:
      'Connect with financiers and investors exploring opportunities across renewable energy value chains.',
  },
  {
    title: 'Build Strategic Partnerships',
    description:
      'Strengthen collaboration between government, private sector, development partners, and innovators.',
  },
];

export const TRAVEL_SECTIONS = [
  {
    id: 'air',
    title: 'By Air',
    icon: 'airplane' as const,
    color: '#0284C7',
    body:
      'Entebbe International Airport (EBB) is the main international airport, located approximately 40km from Kampala city centre. Multiple international airlines operate direct and connecting flights to Entebbe.',
  },
  {
    id: 'hotel',
    title: 'Accommodation',
    icon: 'bed' as const,
    color: '#FFB803',
    body:
      'The conference venue area offers on-site and nearby accommodation with special conference rates. Numerous hotels and guesthouses are also available within close proximity.',
  },
  {
    id: 'transport',
    title: 'Local Transport',
    icon: 'car' as const,
    color: '#059669',
    body:
      'Airport transfers and local transportation can be arranged through your hotel or via ride-hailing services such as Uber and Bolt, which are widely available in Kampala.',
  },
];

export const VISA_INFO = {
  title: 'Visa Information',
  body:
    'Most nationalities can obtain a visa on arrival or apply online through the Uganda Immigration e-Visa portal. We recommend applying at least 4 weeks before travel. Attendees requiring a visa invitation letter can request one during registration.',
  portalUrl: 'https://visas.immigration.go.ug/',
};

export const REGISTRATION_TITLES = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Eng.', 'Rev.', 'Prof.'] as const;

export const STATIC_CONFERENCE_DAYS = [
  { label: 'Day 1 — Opening & Policy', theme: 'Policy frameworks and national priorities' },
  { label: 'Day 2 — Innovation & Investment', theme: 'Technology showcase and financing' },
  { label: 'Day 3 — Partnerships & Expo', theme: 'Exhibition and sector partnerships' },
];

export const DEMO_SESSIONS: Session[] = [
  {
    $id: 'demo-1',
    programId: 'static-program',
    status: 'PUBLISHED',
    day: 1,
    title: 'Opening Ceremony & Keynote',
    startTime: '2026-10-15T07:00:00.000Z',
    toTime: '2026-10-15T09:00:00.000Z',
    venueHall: 'Main Hall',
    theme: 'Policy',
    organizer: 'Ministry of Energy and Mineral Development',
    preamble: '<p>Official opening of the conference with keynote addresses from sector leaders.</p>',
    speakers: '<p>Hon. Minister of Energy · NREP Secretariat</p>',
  },
  {
    $id: 'demo-2',
    programId: 'static-program',
    status: 'PUBLISHED',
    day: 1,
    title: 'Grid Modernization Panel',
    startTime: '2026-10-15T09:30:00.000Z',
    toTime: '2026-10-15T11:00:00.000Z',
    venueHall: 'Main Hall',
    theme: 'Grid',
    organizer: 'NREP',
    preamble: '<p>Discussion on grid integration, storage, and reliability for renewable energy scale-up.</p>',
    speakers: '<p>Utility leaders · Regional grid operators</p>',
  },
  {
    $id: 'demo-3',
    programId: 'static-program',
    status: 'PUBLISHED',
    day: 1,
    title: 'Mini-Grid Innovation Showcase',
    startTime: '2026-10-15T09:30:00.000Z',
    toTime: '2026-10-15T11:00:00.000Z',
    venueHall: 'Hall B',
    theme: 'Access',
    organizer: 'Rural Electrification Agency',
    preamble: '<p>Case studies on productive use of energy in rural communities.</p>',
    speakers: '<p>Implementers · Community representatives</p>',
  },
  {
    $id: 'demo-4',
    programId: 'static-program',
    status: 'PUBLISHED',
    day: 2,
    title: 'Investment Roundtable',
    startTime: '2026-10-16T08:00:00.000Z',
    toTime: '2026-10-16T10:00:00.000Z',
    venueHall: 'Hall B',
    theme: 'Finance',
    organizer: 'Development Partners',
    preamble: '<p>Financiers and project developers discuss bankable clean energy projects.</p>',
    speakers: '<p>DFIs · Commercial banks · Project developers</p>',
  },
  {
    $id: 'demo-5',
    programId: 'static-program',
    status: 'PUBLISHED',
    day: 2,
    title: 'Solar Manufacturing & Local Content',
    startTime: '2026-10-16T10:30:00.000Z',
    toTime: '2026-10-16T12:00:00.000Z',
    venueHall: 'Main Hall',
    theme: 'Industry',
    organizer: 'Private Sector Forum',
    preamble: '<p>Building local supply chains for solar and storage technologies.</p>',
    speakers: '<p>Manufacturers · Policy makers</p>',
  },
  {
    $id: 'demo-6',
    programId: 'static-program',
    status: 'PUBLISHED',
    day: 3,
    title: 'Exhibition Opening & Networking',
    startTime: '2026-10-17T07:00:00.000Z',
    toTime: '2026-10-17T09:00:00.000Z',
    venueHall: 'Main Hall',
    theme: 'Expo',
    organizer: 'REC Secretariat',
    preamble: '<p>Walk the exhibition floor and connect with solution providers.</p>',
    speakers: '<p>Exhibitors · Innovators</p>',
  },
  {
    $id: 'demo-7',
    programId: 'static-program',
    status: 'PUBLISHED',
    day: 3,
    title: 'Closing Plenary & Commitments',
    startTime: '2026-10-17T14:00:00.000Z',
    toTime: '2026-10-17T16:00:00.000Z',
    venueHall: 'Main Hall',
    theme: 'Outcomes',
    organizer: 'NREP',
    preamble: '<p>Summary of conference outcomes and sector commitments.</p>',
    speakers: '<p>Conference leadership · Partners</p>',
  },
];

export const DEMO_TIME_BLOCKS: TimeBlock[] = [];

export function getStaticConferenceDays() {
  return STATIC_CONFERENCE_DAYS;
}
