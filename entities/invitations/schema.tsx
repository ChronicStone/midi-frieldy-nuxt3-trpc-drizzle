import { buildFormSchema, buildTableSchema } from '@chronicstone/vue-sweettools';
import { helpers, minValue } from '@vuelidate/validators';
import { UserInvitationsList } from '@/types/invitation';

export function invitationsTableSchema() {
  const { $client } = useNuxtApp();
  return buildTableSchema<UserInvitationsList[number]>({
    remote: false,
    columns: [
      { label: 'Type', key: 'type', render: renderInvitationType, width: 110 },
      { label: 'Is active', key: 'isExpired', render: (value) => renderBoolean(!value), width: 100 },
      { label: 'Organization', key: 'organization.name', render: formatNullableText },
      { label: 'Emails (email type)', key: 'emails', render: renderInvitationEmailList },
      { label: 'Max usage (link type)', key: 'maxUsage' },
      { label: 'Created at', key: 'createdAt', render: formatDate },
      { label: 'Expire at', key: 'expireAt', render: formatDate },
    ],
    datasource: () => $client.invitation.getInvitations.query(),
    actions: [
      {
        label: 'New invitation',
        icon: 'mdi:plus',
        action: ({ tableApi }) => createUserInvitation().then((r) => r && tableApi.refreshData()),
      },
    ],
  });
}

export function invitationFormSchema() {
  const { $client } = useNuxtApp();
  return buildFormSchema({
    gridSize: 8,
    fieldSize: '8 md:4',
    maxWidth: '700px',
    title: 'Invite users',
    fields: [
      {
        label: 'Invitation type',
        key: 'type',
        type: 'select',
        options: [
          { label: 'Email', value: 'email' as const },
          { label: 'Shareable link', value: 'link' as const },
        ],
        required: true,
        size: 8,
      },
      {
        label: 'Expiration date',
        key: 'expireAt',
        type: 'date',
        required: true,
        fieldParams: {
          dateDisabled: (current: string | number | Date) =>
            new Date(current).getTime() < new Date().getTime(),
        },
        transform: (value: string | number | Date) => new Date(value).toISOString(),
      },
      {
        label: 'Organization',
        key: 'organizationId',
        type: 'select',
        options: () => $client.filterOptions.getOrganizations.query(),
        required: true,
      },
      {
        label: 'Max usage',
        key: 'maxUsage',
        type: 'slider',
        fieldParams: {
          min: 0,
          max: 100,
          step: 1,
        },
        size: 8,
        validators: () => ({
          min: helpers.withMessage('An invitation must have at least 1 entry', minValue(1)),
        }),
        dependencies: ['type'],
        condition: (deps) => deps?.type === 'link',
      },
      {
        label: 'Emails list',
        key: 'emails',
        type: 'textarea',
        fieldParams: {},
        size: 8,
        required: true,
        placeholder: 'Please input a list of emails, separated by a line break',
        dependencies: ['type'],
        condition: (deps) => deps?.type === 'email',
        validators: () => ({
          minEmails: helpers.withMessage(
            'You need to input at least 1 valid email',
            (value: string) =>
              value
                ?.split('\n')
                ?.map((email: string) => email.trim())
                ?.filter(isValidEmail)?.length > 0,
          ),
        }),
        transform: (value: string) =>
          value
            ?.split('\n')
            ?.map((email: string) => email.trim())
            ?.filter(isValidEmail),
      },
      {
        key: 'emailsPreview',
        label: 'Parsed emails:',
        type: 'info',
        dependencies: ['emails'],
        condition: (deps) => !!deps?.emails,
        content: (deps) => {
          const emails = ((deps?.emails ?? '') as string)
            .split('\n')
            .map((email: string) => email.trim())
            .filter(isValidEmail);

          return (
            <div>
              <ul>
                {emails.map((email: string) => (
                  <li>{email}</li>
                ))}
              </ul>
            </div>
          );
        },
      },
    ],
  });
}
