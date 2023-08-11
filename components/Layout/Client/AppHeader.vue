<script setup lang="ts">
const userStore = useUserStore();
const appStore = useAppStore();
const route = useRoute();
const showLogin = computed(() => {
  return route.meta.showLoginAction ?? false;
});
</script>

<template>
  <n-el
    class="bg-[var(--body-color)] border-b border-[var(--border-color)] h-16 w-full flex items-center justify-between p-2"
  >
    <NuxtLink to="/">
      <img v-if="appStore.isDark" src="@/assets/images/LogoDark.svg" class="h-8 w-auto" />
      <img v-else src="@/assets/images/LogoLight.svg" class="h-8 w-auto" />
    </NuxtLink>
    <div class="flex items-center gap-2">
      <template v-if="showLogin && !userStore.user">
        <NButton type="primary" size="small" @click="navigateTo('/auth/login')"> Connexion </NButton>
        <NDivider vertical class="!m-0" />
      </template>
      <template v-if="showLogin && userStore.user">
        <NButton type="primary" size="small" @click="navigateTo('/map')"> Ouvrir l'app </NButton>
        <NDivider vertical class="!m-0" />
      </template>
      <!-- <ChatRoomsMenu v-if="userStore.user" /> -->
      <!-- <LayoutOnboardingTrigger v-if="route.name === 'map'" /> -->
      <ToggleTheme />
      <template v-if="userStore.user">
        <NDivider vertical class="!m-0" />
        <UserDropdown />
      </template>
    </div>
  </n-el>
</template>
