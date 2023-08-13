import { MenuItem } from '@/types/system/navigation';
import type { RouteLocation } from '#vue-router';

export function useAdminBreadcrumbs() {
  const route = useRoute();

  function joinWithPrecedent(slug: string) {
    return slug.split('-').reduce((acc: string[], cur: string) => {
      return !acc.length ? [cur] : [...acc, acc[acc.length - 1] + '-' + cur];
    }, []);
  }

  function getAnonymousSlug(value: string) {
    if (/([a-z]+Id)$/.test(value)) return `${formatKey(value.slice(0, -2))} profile`;
    else return formatKey(value);
  }

  function findBySlug(slug: string, items: MenuItem[]): MenuItem | undefined {
    for (const item of items) {
      if ('slug' in item && item.slug === slug) return item;
    }
    return undefined;
  }

  const breadcrumb = computed<{ label: string; icon?: string; slug?: RouteLocation['name'] }[]>(() => {
    if (!route.name.startsWith('admin')) return [];
    if (route.meta?.breadcrumbs?.length) return route.meta.breadcrumbs;
    if (!route.name) return [{ label: 'Home', icon: 'mdi-home' }];
    const slugs = joinWithPrecedent(route.name.toString()).filter((_, index) => index !== 0);
    return slugs.map((slug) => {
      const menuItem = findBySlug(slug, NAV_MENU_ITEMS.admin.map((item) => item.items).flat());
      return {
        label: menuItem?.label ?? getAnonymousSlug(slug.split('-').reverse()[0]),
        ...(menuItem && { icon: menuItem.icon }),
        slug: slug as RouteLocation['name'],
      };
    });
  });

  return breadcrumb;
}
