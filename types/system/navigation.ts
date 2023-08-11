import type { RouteLocationNormalized } from '#vue-router';

export type MenuItem = {
  label: string;
  icon?: string;
  path?: string;
  // permissions?: PermissionKey[] | string;
} & ({ slug?: RouteLocationNormalized['name'] } | { slug: string; items: MenuItem[] });

export interface MenuItemGroup {
  label?: string;
  icon?: string;
  items: MenuItem[];
  key?: string;
}

export interface MenuItemSection {
  label?: string;
  entityKey?: 'admin' | 'organization';
  icon: string;
  items?: MenuItemGroup[];
  slug?: RouteLocationNormalized['name'] | 'general' | 'organization' | 'admin';
  key?: string;
  // permissions?: Array<PermissionKey | PermissionKey[]>;
}
