import { MenuItem } from '@/types/system/navigation';

export const ADMIN_MENU_ITEMS: MenuItem[] = [
  {
    label: 'Organizations',
    icon: 'ph:shield-check-duotone',
    slug: 'admin-organizations',
  },
  {
    label: 'Invitations',
    icon: 'ph:envelope-duotone',
    slug: 'admin-invitations',
  },
];
export const ORGA_MENU_ITEMS: MenuItem[] = [];
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
