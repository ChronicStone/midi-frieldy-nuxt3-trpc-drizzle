<script setup lang="ts">
import { useThemeVars } from 'naive-ui';

const route = useRoute();
const themeVars = useThemeVars();
const loadingApi = useLoadingBar();

watch(
  () => route.name,
  () => loadingApi.finish(),
);
</script>

<template>
  <!-- <LayoutUserSatisfaction /> -->
  <n-layout>
    <n-layout-header>
      <AppHeader :collapsed="false" />
    </n-layout-header>
    <n-layout-content
      :content-style="{
        background: themeVars.bodyColor,
        height: 'calc(100vh - 4rem)',
      }"
    >
      <slot />
      <!-- <AppFooter /> -->
    </n-layout-content>
  </n-layout>
</template>
