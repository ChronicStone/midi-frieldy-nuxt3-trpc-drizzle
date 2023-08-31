<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { GatewayUser } from '@/types/user';

const userStore = useUserStore();
const themeVars = useThemeVars();
const props = withDefaults(
  defineProps<{
    users: GatewayUser;
    size?: 'small' | 'medium' | 'large' | number;
    maxDisplayed?: number;
  }>(),
  {
    maxDisplayed: 3,
    size: 40,
  },
);

function createDropdownOptions(options: Array<{ name: string; src?: string }>) {
  return options.map((option, index) => ({
    key: index,
    label: option.name,
  }));
}

function mapUsersAvatar(users: typeof props.users) {
  return users.map((user) => ({
    name: `${user.firstName} ${user.lastName}`,
    src: user?.avatar ?? '',
    isOnline: user.isOnline || userStore.user?._id === user._id,
  }));
}
</script>

<template>
  <NAvatarGroup :options="mapUsersAvatar(users)" :size="size" :max="maxDisplayed">
    <template #avatar="{ option: { name, src, isOnline } }">
      <NTooltip>
        <template #trigger>
          <NAvatar
            v-if="src"
            :src="src"
            :class="isOnline ? 'avatar__online' : 'avatar__offline'"
            :size="size"
          />
          <NAvatar v-else :class="isOnline ? 'avatar__online' : 'avatar__offline'" :size="size">
            {{
              name
                .split(' ')
                .map((w: string) => w.charAt(0))
                .join('')
            }}
          </NAvatar>
        </template>
        <div class="flex flex-col items-center gap-1">
          <span>{{ name }}</span>
          <span :style="`color: ${themeVars[isOnline ? 'successColor' : 'errorColor']}`">
            {{ isOnline ? 'En ligne' : 'Hors ligne' }}
          </span>
        </div>
      </NTooltip>
    </template>
    <template #rest="{ options: restOptions, rest }">
      <NDropdown :options="createDropdownOptions(restOptions)" placement="top">
        <NAvatar>+{{ rest }}</NAvatar>
      </NDropdown>
    </template>
  </NAvatarGroup>
</template>

<style scoped>
.avatar__online {
  border: 2px solid v-bind('themeVars.successColor');
}

.avatar__offline {
  border: 2px solid #fff;
}
</style>
