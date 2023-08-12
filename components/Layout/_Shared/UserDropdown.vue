<script setup lang="ts">
import { useDropdownActions } from '@/composables/useDropdownActions';
const userStore = useUserStore();

const dropdownOptions = useDropdownActions([
  {
    label: "Changer d'organisation",
    icon: 'mi:switch',
    action: () => navigateTo('/map/select-organization'),
  },
  {
    label: 'Se déconnecter',
    icon: 'ph:sign-out-bold',
    action: () => {
      userStore.clearUserSession();
      navigateTo('/auth/login');
    },
  },
  {
    type: 'divider',
  },
  {
    label: 'Administration',
    icon: 'ph:gear-six-bold',
    action: () => navigateTo('/admin'),
  },
]);
</script>

<template>
  <NDropdown :options="dropdownOptions">
    <NAvatar size="small" round v-bind="{ ...(userStore.user?.avatar && { src: userStore.user.avatar }) }">
      <template v-if="!userStore.user?.avatar">
        {{ userStore.user?.firstName?.charAt(0) }}
        {{ userStore.user?.lastName?.charAt(0) }}
      </template>
    </NAvatar>
  </NDropdown>
</template>
