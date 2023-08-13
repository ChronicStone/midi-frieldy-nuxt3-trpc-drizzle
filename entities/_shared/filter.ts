import type { TableFilter } from '@chronicstone/vue-sweettools';

export function organizationFilter(key: string): TableFilter {
  const { $client } = useNuxtApp();
  return {
    key,
    label: 'Organization',
    type: 'select',
    options: () => $client.filterOptions.getOrganizations.query(),
    matchMode: 'arrayContains',
  };
}
