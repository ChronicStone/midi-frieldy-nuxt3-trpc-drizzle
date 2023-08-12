<script setup lang="ts">
import { useFormApi } from '@chronicstone/vue-sweettools';
import { useThemeVars } from 'naive-ui';

const route = useRoute();
const appStore = useAppStore();
const nuxtApp = useNuxtApp();

const formApi = useFormApi();
const dialogApi = useDialog();
const loadingBarApi = useLoadingBar();
const messageApi = useMessage();
const notificationApi = useNotification();
const themeVars = useThemeVars();

nuxtApp.provide('formApi', formApi);
nuxtApp.provide('dialogApi', dialogApi);
nuxtApp.provide('loadingBarApi', loadingBarApi);
nuxtApp.provide('messageApi', messageApi);
nuxtApp.provide('notificationApi', notificationApi);
nuxtApp.provide('themeVars', themeVars);

const layout = computed(() => (route.path.startsWith('/admin') ? 'admin' : 'default'));
</script>

<template>
  <NSpin :show="appStore.isLoading">
    <template v-if="appStore.isLoadingMessage" #description>
      <span class="font-black text-primary">
        {{ appStore.isLoadingMessage }}
      </span>
    </template>
    <NuxtLayout :name="layout">
      <NuxtPage />
    </NuxtLayout>
  </NSpin>
</template>
