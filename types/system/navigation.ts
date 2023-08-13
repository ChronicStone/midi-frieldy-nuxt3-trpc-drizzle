import type { RouteLocationNormalized } from '#vue-router';

export type MenuItem = {
  label: string;
  icon: string;
  slug: RouteLocationNormalized['name'];
  condition?: (userStore: ReturnType<typeof useUserStore>) => boolean;
};

export type MenuItemGroup = {
  label?: string;
  items: MenuItem[];
};
