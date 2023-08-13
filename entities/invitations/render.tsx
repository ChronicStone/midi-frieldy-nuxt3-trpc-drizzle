import type { UserInvitation, UserInvitationUsage } from '@/types/invitation';
import { Tag, NPopover, NDataTable } from '#components';
import { UserCredentials } from '@/types/user';

export function renderInvitationType(value: UserInvitation['type']) {
  return <Tag type={value === 'email' ? 'info' : 'warning'}>{formatKey(value)}</Tag>;
}

export function renderCredentialsType(type: UserCredentials['type']) {
  const providerIcon =
    type === 'email'
      ? 'material-symbols:alternate-email'
      : type === 'facebook'
      ? 'logos:facebook'
      : type === 'google'
      ? 'logos:google-icon'
      : type === 'linkedin'
      ? 'logos:linkedin-icon'
      : 'material-symbols:error';
  return <span class="iconify text-sm font-black" data-icon={providerIcon} />;
}

export const renderInvitationEmailList = (value: string[] | undefined) => {
  if (!value?.length) return 'N/A';
  const columns = [{ title: 'Email address', key: 'email' }];
  return (
    <NPopover width={350} style="padding: 0" z-index={100}>
      {{
        trigger: () => (
          <div class="h-full pt-1">
            <Tag class="w-auto">
              {{
                default: () => <span>{value.length}</span>,
                icon: () => <span class="iconify text-sm" data-icon="mdi:email-multiple"></span>,
              }}
            </Tag>
          </div>
        ),
        default: () => (
          <NDataTable
            bordered={true}
            maxHeight={250}
            data={value.map((email) => ({ email }))}
            columns={columns}
          />
        ),
      }}
    </NPopover>
  );
};

export function renderInvitationUsage(usages: UserInvitationUsage[]) {
  const columns = [
    {
      title: 'Invitation email',
      key: 'email',
      render: (item: UserInvitationUsage) => formatNullableText(item.email),
    },
    {
      title: 'Date',
      key: 'usageDate',
      render: (item: UserInvitationUsage) => formatDateTime(item.usageDate),
    },
    {
      title: 'Linked account',
      key: 'linkedAccount',
      render: (item: UserInvitationUsage) => (
        <div class="flex flex-col gap-2">
          <div>
            {item.linkedAccount?.firstName} {item.linkedAccount?.lastName}
          </div>
          <div class="text-gray-500 flex items-center gap-1">
            <span>{item.linkedAccount?.credentials.email}</span>
            <span class="text-black dark:text-white">
              {renderCredentialsType(item.linkedAccount?.credentials?.type ?? 'email')}
            </span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <NPopover width={600} style="padding: 0" z-index={100}>
      {{
        trigger: () => (
          <div class="pt-1">
            <Tag>
              {{
                default: () => <span>{usages.length}</span>,
                icon: () => <span class="iconify text-sm" data-icon="mdi:user"></span>,
              }}
            </Tag>
          </div>
        ),
        default: () => <NDataTable bordered={true} maxHeight={250} data={usages} columns={columns} />,
      }}
    </NPopover>
  );
}
