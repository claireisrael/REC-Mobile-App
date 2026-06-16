export type Conference = {
  $id: string;
  isActive?: boolean;
  registrationOpen?: boolean;
  regClosedMessage?: string;
  couponRequired?: boolean;
  startDate: string;
  endDate: string;
  title?: string;
  shortName?: string;
  fullName?: string;
  theme?: string;
  description?: string;
  heroTagline?: string;
  location?: string;
  venue?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  maxAttendees?: number;
  maxExhibitors?: number;
  contactEmail?: string;
  contactPhone?: string;
  mainWebsiteUrl?: string;
  sponsorshipPackageUrl?: string;
  socialsJson?: string;
  year?: number;
  days?: string;
};

export type Program = {
  $id: string;
  conferenceId: string;
  status: string;
  title?: string;
  daysCount: number;
  venueHalls?: string[];
};

export type Session = {
  $id: string;
  programId: string;
  status: string;
  day: number;
  title: string;
  startTime: string;
  toTime: string;
  venueHall?: string;
  theme?: string;
  organizer?: string;
  preamble?: string;
  speakers?: string;
  timeBlockIds?: string[] | string;
  sessionSpanType?: string;
};

export type TimeBlock = {
  $id: string;
  programId: string;
  day: number;
  startMinutes: number;
  endMinutes: number;
  type: string;
  label?: string;
  allowSessions?: boolean;
  venueScope?: string;
  venueHalls?: string[];
  sortOrder?: number;
  startTime?: string;
  endTime?: string;
  notes?: string;
};

export type SponsorCategory = {
  $id: string;
  conferenceId: string;
  name: string;
  slug?: string;
  description?: string;
  accentColor?: string;
  displayOrder?: number;
  isActive?: boolean;
};

export type Sponsor = {
  $id: string;
  conferenceId: string;
  categoryId: string;
  name: string;
  logoUrl?: string;
  description?: string;
  siteUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  displayOrder?: number;
};

export type PublicProgramData = {
  conference: Conference;
  program: Program;
  sessions: Session[];
  timeBlocks: TimeBlock[];
  sponsorCategories?: SponsorCategory[];
  sponsors?: Sponsor[];
};
