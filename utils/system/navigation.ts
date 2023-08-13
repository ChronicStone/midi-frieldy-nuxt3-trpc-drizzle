import { MenuItemGroup } from '@/types/system/navigation';

export function mapNavigationItems(navItemsGroups: MenuItemGroup[]) {
  const userStore = useUserStore();
  return navItemsGroups
    .map((item) => ({
      label: item.label,
      items: item.items.filter((item) => item).filter((item) => item?.condition?.(userStore) ?? true),
      expanded: ref<boolean>(true),
    }))
    .filter((group) => group.items.length);
}
