import { buildFormSchema, buildTableSchema } from '@chronicstone/vue-sweettools';
import { OrganizationList } from '@/types/organization';
import { NDivider } from '#components';

export function organizationTableSchema() {
  const { $client } = useNuxtApp();
  return buildTableSchema<OrganizationList[number]>({
    remote: false,
    searchQuery: ['name', 'address.street', 'address.city', 'address.country', 'address.zip'],
    columns: [
      { label: 'Organization', key: 'name' },
      { label: 'Address - street', key: 'address.street' },
      { label: 'Address - city', key: 'address.city' },
      { label: 'Address - country', key: 'address.country' },
      { label: 'Address - zip', key: 'address.zip' },
      { label: 'Created at', key: 'createdAt', render: formatDateTime },
      { label: 'Updated at', key: 'updatedAt', render: formatDateTime },
    ],
    datasource: () => $client.organization.getOrganizations.query(),
    actions: [
      {
        label: 'Create organization',
        icon: 'mdi:plus',
        action: ({ tableApi }) =>
          createOrganization().then((shouldRefresh) => shouldRefresh && tableApi.refreshData()),
      },
    ],
    rowActions: [],
  });
}

export function organizationFormSchema(mode: 'create' | 'update' = 'create') {
  return buildFormSchema({
    title: mode === 'create' ? 'Create organization' : 'Update organization profile',
    gridSize: 8,
    fieldSize: 8,
    fields: [
      { label: 'Name', key: 'name', type: 'text', required: true },
      {
        size: 8,
        key: 'divider',
        type: 'info',
        content: () => (
          <div>
            <NDivider />
            <span class="font-bold text-lg">Address</span>
          </div>
        ),
      },
      {
        label: 'Address',
        key: 'address',
        type: 'object',
        collapsible: false,
        fieldParams: { frameless: true },
        fields: [
          {
            label: 'Street',
            key: 'street',
            type: 'text',
            required: true,
            size: '8 md:4',
          },
          {
            label: 'City',
            key: 'city',
            type: 'text',
            required: true,
            size: '8 md:4',
          },
          {
            label: 'ZIP Code',
            key: 'zip',
            type: 'text',
            required: true,
            size: '8 md:4',
          },
          {
            label: 'Country',
            key: 'country',
            type: 'text',
            required: true,
            size: '8 md:4',
          },
        ],
      },
      {
        size: 8,
        key: 'divider',
        type: 'info',
        content: () => (
          <div>
            <NDivider />
            <span class="font-bold text-lg">Organization administrator</span>
          </div>
        ),
      },
      {
        label: 'Email address',
        key: 'administratorEmail',
        type: 'text',
        required: true,
        description: {
          title: 'About administrator email',
          content: 'This email will be used to create an administrator account for this organization.',
        },
      },
    ],
  });
}
