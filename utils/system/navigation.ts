import { MenuItem } from '@/types/system/navigation';

export function mapNavigationItems(navItems: MenuItem[]) {
  const userStore = useUserStore();
  return navItems.filter((item) => item).filter((item) => item?.condition?.(userStore) ?? true);
}
