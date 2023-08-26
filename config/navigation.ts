import { MenuItemGroup } from '@/types/system/navigation';

export const ADMIN_MENU_ITEMS: MenuItemGroup[] = [
  {
    items: [
      {
        label: 'Dashboard',
        icon: 'ph:house-line-duotone',
        slug: 'home-admin',
      },
    ],
  },
  {
    label: 'Business & entities',
    items: [
      {
        label: 'Organizations',
        icon: 'ph:buildings-duotone',
        slug: 'admin-organizations',
      },
      {
        label: 'Restaurants',
        icon: 'ph:bowl-food-duotone',
        slug: 'admin-restaurants',
      },
      {
        label: 'Lunch groups',
        icon: 'ph:users-three-duotone',
        slug: 'admin-lunch-groups',
      },
    ],
  },
  {
    label: 'Users & access',
    items: [
      {
        label: 'Users',
        icon: 'ph:user-duotone',
        slug: 'admin-users',
      },
      {
        label: 'Invitations',
        icon: 'ph:envelope-duotone',
        slug: 'admin-invitations',
      },
    ],
  },
  {
    label: 'Settings',
    items: [
      {
        label: 'Queue jobs',
        icon: 'ph:clock-clockwise-duotone',
        slug: 'admin-queue-jobs',
      },
    ],
  },
];
export const ORGA_MENU_ITEMS: MenuItemGroup[] = [];
//   key: 'admin',
//   label: 'Administration',
//   icon: 'ph:shield-check-duotone',
//   slug: 'admin',
//   items: [
//     {
//       label: 'Business & entities',
//       items: [
//         {
//           label: 'Organizations',
//           icon: 'ph:shield-check-duotone',
//           slug: 'admin-organizations',
//         },
//         // {
//         //   label: 'Restaurants',
//         //   icon: 'ph:shield-check-duotone',
//         //   slug: 'admin.restaurants',
//         // },
//         // {
//         //   label: 'Lunch groups',
//         //   icon: 'ph:shield-check-duotone',
//         //   slug: 'admin.lunchGroups',
//         // },
//       ],
//     },
//     {
//       label: 'Users & access',
//       items: [
//         // {
//         //   label: 'Users',
//         //   icon: 'ph:user-duotone',
//         //   slug: 'admin.users',
//         // },
//         {
//           label: 'Invitations',
//           icon: 'ph:envelope-duotone',
//           slug: 'admin-invitations',
//         },
//       ],
//     },
//   ],
// } satisfies MenuItem[];

export const NAV_MENU_ITEMS = {
  admin: ADMIN_MENU_ITEMS,
  organization: ORGA_MENU_ITEMS,
};
