import type { Href } from 'expo-router';

export const routes = {
  home: '/(tabs)' as Href,
  program: '/(tabs)/program' as Href,
  sponsors: '/(tabs)/sponsors' as Href,
  venue: '/venue' as Href,
  register: '/(tabs)/register' as Href,
  about: '/about' as Href,
  session: (id: string) => `/session/${id}` as Href,
};

export function tabHref(routeName: string): Href {
  switch (routeName) {
    case 'index':
      return routes.home;
    case 'program':
      return routes.program;
    case 'sponsors':
      return routes.sponsors;
    case 'register':
      return routes.register;
    default:
      return routes.home;
  }
}
