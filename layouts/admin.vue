<script setup lang="tsx">
import { useThemeVars } from 'naive-ui';

const themeVars = useThemeVars();
const breadcrumbs = useAdminBreadcrumbs();
const isSmallDevice = useIsMobile();
const sidebarCollapsed = ref(false);
watch(
  () => isSmallDevice.value,
  (small: boolean) => (sidebarCollapsed.value = small),
  { immediate: true },
);
function openSideNav() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
}
</script>

<template>
  <n-layout class="h-screen" has-sider>
    <div
      v-if="!sidebarCollapsed && isSmallDevice"
      class="absolute z-[1] bg-black/25 h-screen w-screen top-0 left-0 transition-all ease-in-out duration-150"
    ></div>
    <n-layout-sider
      v-model:collapsed="sidebarCollapsed"
      bordered
      collapse-mode="width"
      :collapsed-width="isSmallDevice ? 0 : 80"
      :position="isSmallDevice ? 'absolute' : 'static'"
      :width="240"
      :native-scrollbar="false"
      :content-style="{ zIndex: '100 !important' }"
    >
      <side-navigation v-model:collapsed="sidebarCollapsed" />
    </n-layout-sider>
    <n-layout-header class="h-16 p-0" bordered>
      <AppHeader v-model:collapsed="sidebarCollapsed" show-menu-handle :show-logo="false" />
    </n-layout-header>
    <n-layout
      position="absolute"
      :style="{ top: '4rem', left: !sidebarCollapsed ? '240px' : isSmallDevice ? '0px' : '80px' }"
    >
      <n-layout content-style="padding: 24px;" :native-scrollbar="false">
        <div class="flex flex-col gap-4">
          <!-- <n-breadcrumb>
            <n-breadcrumb-item
              v-for="item in breadcrumbs"
              :key="item?.slug"
              @click="item.slug && $router.resolve({ name: item.slug }) && $router.push({ name: item.slug })"
            >
              <div class="flex items-center">
                <n-icon v-if="item.icon" class="mr-2">
                  <span class="iconify" :data-icon="item.icon"></span>
                </n-icon>
                <span v-if="item.label">{{ item.label }}</span>
              </div>
            </n-breadcrumb-item>
          </n-breadcrumb> -->
          <slot />
        </div>
      </n-layout>
    </n-layout>
  </n-layout>
</template>
