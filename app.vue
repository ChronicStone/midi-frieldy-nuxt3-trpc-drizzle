<script setup lang="ts">
import { FormProvider } from '@chronicstone/vue-sweettools';
import '@chronicstone/vue-sweettools/dist/style.css';
import AppProvider from './appProvider.vue';

const appStore = useAppStore();

watch(
  () => appStore.isDark,
  (isDark) => {
    if (isDark) document?.querySelector('body')?.classList.add('dark');
    else document?.querySelector('body')?.classList.remove('dark');
  },
  { immediate: true },
);
</script>

<template>
  <n-config-provider
    id="appRoot"
    class="demo"
    :locale="appStore.language"
    :theme="appStore.theme"
    :theme-overrides="appStore.themeOverrides"
  >
    <form-provider>
      <n-dialog-provider>
        <n-message-provider>
          <n-notification-provider>
            <n-loading-bar-provider>
              <AppProvider />
            </n-loading-bar-provider>
          </n-notification-provider>
        </n-message-provider>
      </n-dialog-provider>
    </form-provider>
  </n-config-provider>
</template>

<style>
body {
  font-family: 'Lato' !important;
}
</style>
