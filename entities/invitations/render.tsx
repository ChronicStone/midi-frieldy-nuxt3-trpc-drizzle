import type { UserInvitation } from 'types/invitation';
import { Tag, NPopover, NDataTable } from '#components';

export function renderInvitationType(value: UserInvitation['type']) {
  return <Tag type={value === 'email' ? 'info' : 'warning'}>{formatKey(value)}</Tag>;
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
