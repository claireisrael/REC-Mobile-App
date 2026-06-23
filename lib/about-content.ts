import type { Ionicons } from '@expo/vector-icons';

type ObjectiveIcon = keyof typeof Ionicons.glyphMap;

export type AboutHighlight = {
  icon: ObjectiveIcon;
  stat: string;
  title: string;
  description: string;
  color: string;
};

export type ConferenceObjective = {
  icon: ObjectiveIcon;
  title: string;
  description: string;
};

export const ABOUT_HIGHLIGHTS: AboutHighlight[] = [
  {
    icon: 'people-outline',
    stat: '1,000+',
    title: 'Participants',
    description:
      'Engage with government officials, industry leaders, researchers, CSOs, and the public.',
    color: '#0B7186',
  },
  {
    icon: 'globe-outline',
    stat: '20+',
    title: 'International Presence',
    description:
      'Connect with stakeholders from various countries shaping Africa’s energy future.',
    color: '#F59E0B',
  },
  {
    icon: 'trending-up-outline',
    stat: 'Transform',
    title: 'Drive Transformation',
    description:
      'Contribute to shaping the future of energy in Uganda and beyond through sustainable solutions.',
    color: '#059669',
  },
];

export const CONFERENCE_OBJECTIVES: ConferenceObjective[] = [
  {
    icon: 'bar-chart-outline',
    title: 'Review REC Outcomes',
    description:
      "Build on commitments and progress from previous editions to accelerate Uganda's clean energy transition.",
  },
  {
    icon: 'globe-outline',
    title: 'Engage with Global Experts',
    description:
      'Dialogue with international and regional leaders on scaling renewable energy systems and markets.',
  },
  {
    icon: 'trending-up-outline',
    title: 'Drive the Green Economy',
    description:
      'Explore how renewable energy powers industrial growth, green jobs, and economic resilience.',
  },
  {
    icon: 'bulb-outline',
    title: 'Discover Scalable Solutions',
    description:
      'Showcase technologies and solutions ready for large-scale deployment across Uganda and Africa.',
  },
  {
    icon: 'flash-outline',
    title: 'Explore Frontier Innovations',
    description:
      'Learn about emerging energy technologies, digitalization, grid storage, and smart energy systems.',
  },
  {
    icon: 'hand-left-outline',
    title: 'Unlock Investment Opportunities',
    description:
      'Connect with financiers and investors exploring opportunities across renewable energy value chains.',
  },
  {
    icon: 'business-outline',
    title: 'Strengthen Energy Systems',
    description: 'Discuss strategies to build resilient, reliable, and sustainable energy systems.',
  },
  {
    icon: 'share-social-outline',
    title: 'Build Strategic Partnerships',
    description:
      'Strengthen collaboration between government, private sector, development partners, and innovators.',
  },
  {
    icon: 'easel-outline',
    title: 'Advance Productive Use of Energy',
    description:
      'Discover how energy drives agriculture, manufacturing, SMEs, and rural economic growth.',
  },
  {
    icon: 'ribbon-outline',
    title: 'Showcase Your Innovations',
    description:
      'Present solutions, research, and business models to a global clean energy audience.',
  },
  {
    icon: 'people-outline',
    title: 'Network with Sector Leaders',
    description:
      "Meet policymakers, investors, entrepreneurs, and practitioners shaping Africa's energy future.",
  },
  {
    icon: 'megaphone-outline',
    title: 'Reach a High-Impact Audience',
    description:
      'Promote your products, services, and innovations to thousands of participants and stakeholders.',
  },
];
