import { MenuItemSection } from '@/types/system/navigation';

export const GENERAL_MENU = {
  label: 'Home',
  icon: 'ph:house-line-duotone',
  slug: 'home-admin',
  key: 'general',
} satisfies MenuItemSection;

export const TASTIA_ADMIN_MENU = {
  key: 'admin',
  label: 'Administration',
  icon: 'ph:shield-check-duotone',
  slug: 'admin',
  items: [
    {
      label: 'Business & entities',
      items: [
        {
          label: 'Organizations',
          icon: 'ph:shield-check-duotone',
          slug: 'admin-organizations',
        },
        // {
        //   label: 'Restaurants',
        //   icon: 'ph:shield-check-duotone',
        //   slug: 'admin.restaurants',
        // },
        // {
        //   label: 'Lunch groups',
        //   icon: 'ph:shield-check-duotone',
        //   slug: 'admin.lunchGroups',
        // },
      ],
    },
    {
      label: 'Users & access',
      items: [
        // {
        //   label: 'Users',
        //   icon: 'ph:user-duotone',
        //   slug: 'admin.users',
        // },
        {
          label: 'Invitations',
          icon: 'ph:envelope-duotone',
          slug: 'admin-invitations',
        },
      ],
    },
  ],
} satisfies MenuItemSection;

export const NAV_MENU_ITEMS = [GENERAL_MENU, TASTIA_ADMIN_MENU] satisfies MenuItemSection[];
