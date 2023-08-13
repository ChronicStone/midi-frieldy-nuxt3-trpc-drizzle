import { buildTableSchema } from '@chronicstone/vue-sweettools';
import { RestaurantList } from '@/types/restaurant';

export function restaurantTableSchema(organizationId?: string) {
  const { $client } = useNuxtApp();
  return buildTableSchema<RestaurantList[number]>({
    remote: true,
    searchQuery: [
      'name',
      'organization.name',
      'address.street',
      'address.city',
      'address.zip',
      'address.country',
    ],
    staticFilters: organizationId
      ? [
          {
            key: 'organization._id',
            value: organizationId,
            matchMode: 'equals',
          },
        ]
      : [],
    filters: [organizationFilter('organization._id')],
    columns: [
      { label: 'Restaurant name', key: 'name' },
      { label: 'Organization', key: 'organization.name' },
      { label: 'Street', key: 'address.street', render: formatNullableText },
      { label: 'City', key: 'address.city', render: formatNullableText },
      { label: 'Zip', key: 'address.zip', render: formatNullableText },
      { label: 'Country', key: 'address.country', render: formatNullableText },
      { label: 'Created at', key: 'createdAt', render: formatDate },
    ],
    datasource: () => $client.restaurant.getRestaurants.query(),
    actions: [
      {
        label: 'Insert restaurant',
        icon: 'mdi:plus',
        action: ({ tableApi }) =>
          manuallyInsertRestaurant().then((shouldRefresh) => shouldRefresh && tableApi.refreshData()),
      },
    ],
    rowActions: [
      {
        icon: ({ rowData }) =>
          rowData.disabled ? 'material-symbols:toggle-off-outline' : 'material-symbols:toggle-on',
        tooltip: ({ rowData }) => (rowData.disabled ? 'Enable' : 'Disable'),
        action: ({ rowData, tableApi }) =>
          toggleRestaurant(rowData).then((shouldRefresh) => shouldRefresh && tableApi.refreshData()),
      },
    ],
  });
}
