import type { Href } from 'expo-router';

export const routes = {
  home: '/(tabs)' as Href,
  program: '/(tabs)/program' as Href,
  sponsors: '/(tabs)/sponsors' as Href,
  profile: '/(tabs)/profile' as Href,
  connect: '/(tabs)/connect' as Href,
  reports: '/(tabs)/reports' as Href,
  venue: '/(tabs)/venue' as Href,
  exploreUganda: '/(tabs)/explore-uganda' as Href,
  register: '/(tabs)/register' as Href,
  about: '/(tabs)/about' as Href,
  session: (id: string) => `/(tabs)/session/${id}` as Href,
};

export function tabHref(routeName: string): Href {
  switch (routeName) {
    case 'index':
      return routes.home;
    case 'program':
      return routes.program;
    case 'sponsors':
      return routes.sponsors;
    case 'profile':
      return routes.profile;
    case 'connect':
      return routes.connect;
    case 'register':
      return routes.register;
    default:
      return routes.home;
  }
}
