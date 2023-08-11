import { MenuItemSection } from '@/types/system/navigation';

export function mapNavigationItems(navItems: MenuItemSection[]) {
  return (
    navItems
      .filter((item) => item)
      // .filter((item) => item?.condition?.(userStore) ?? true)
      .filter((item) => !item.items || item.items.length)
  );
}
