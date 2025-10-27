export const routes = {
  home: '/',
} as const;

type RouteKey = keyof typeof routes;

export type AppRoute = typeof routes[RouteKey];
