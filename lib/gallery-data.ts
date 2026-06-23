export type GallerySession = {
  id: string;
  sessionTitle: string;
  previewPhotos: string[];
  morePhotosUrl: string;
};

export type GalleryDay = {
  id: string;
  label: string;
  sessions: GallerySession[];
};

export type GalleryYear = {
  id: string;
  year: string;
  days: GalleryDay[];
};

const buildPhotos = (seedPrefix: string) =>
  Array.from({ length: 5 }, (_, index) => {
    const imageIndex = index + 1;
    return `https://picsum.photos/seed/${seedPrefix}-${imageIndex}/900/600`;
  });

export const REC_GALLERY: GalleryYear[] = [
  {
    id: 'rec-2025',
    year: 'REC 2025',
    days: [
      {
        id: 'rec-2025-day-1',
        label: 'Day 1 - Opening and Policy',
        sessions: [
          {
            id: 'rec-2025-day-1-opening',
            sessionTitle: 'Opening Ceremony',
            previewPhotos: buildPhotos('rec-2025-day1-opening'),
            morePhotosUrl: 'https://rec.nrep.ug',
          },
          {
            id: 'rec-2025-day-1-policy',
            sessionTitle: 'Policy Dialogue',
            previewPhotos: buildPhotos('rec-2025-day1-policy'),
            morePhotosUrl: 'https://rec.nrep.ug',
          },
        ],
      },
      {
        id: 'rec-2025-day-2',
        label: 'Day 2 - Innovation and Investment',
        sessions: [
          {
            id: 'rec-2025-day-2-solar',
            sessionTitle: 'Solar Innovation Showcase',
            previewPhotos: buildPhotos('rec-2025-day2-solar'),
            morePhotosUrl: 'https://rec.nrep.ug',
          },
          {
            id: 'rec-2025-day-2-finance',
            sessionTitle: 'Investment Roundtable',
            previewPhotos: buildPhotos('rec-2025-day2-finance'),
            morePhotosUrl: 'https://rec.nrep.ug',
          },
        ],
      },
    ],
  },
  {
    id: 'rec-2024',
    year: 'REC 2024',
    days: [
      {
        id: 'rec-2024-day-1',
        label: 'Day 1 - Sector Updates',
        sessions: [
          {
            id: 'rec-2024-day-1-keynote',
            sessionTitle: 'Keynote and Sector Outlook',
            previewPhotos: buildPhotos('rec-2024-day1-keynote'),
            morePhotosUrl: 'https://rec.nrep.ug',
          },
          {
            id: 'rec-2024-day-1-grid',
            sessionTitle: 'Grid Modernization',
            previewPhotos: buildPhotos('rec-2024-day1-grid'),
            morePhotosUrl: 'https://rec.nrep.ug',
          },
        ],
      },
      {
        id: 'rec-2024-day-2',
        label: 'Day 2 - Expo and Partnerships',
        sessions: [
          {
            id: 'rec-2024-day-2-expo',
            sessionTitle: 'Exhibition Highlights',
            previewPhotos: buildPhotos('rec-2024-day2-expo'),
            morePhotosUrl: 'https://rec.nrep.ug',
          },
        ],
      },
    ],
  },
];
