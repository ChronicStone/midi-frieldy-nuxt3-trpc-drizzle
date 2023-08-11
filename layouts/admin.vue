<script setup lang="ts">
const breadcrumbs = useAdminBreadcrumbs();
const isSmallDevice = useIsMobile();
const sidebarCollapsed = ref(false);
watch(
  () => isSmallDevice.value,
  (small: boolean) => (sidebarCollapsed.value = small),
);
function openSideNav() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
}
</script>

<template>
  <n-layout has-sider class="h-[100vh]">
    <n-layout-sider
      :collapsed="false"
      :width="'auto'"
      :collapsed-width="isSmallDevice ? 0 : 80"
      collapse-mode="transform"
      :position="isSmallDevice ? 'absolute' : 'static'"
    >
      <AdminSideNavigation :collapsed="sidebarCollapsed" @close-side-nav="sidebarCollapsed = true" />
    </n-layout-sider>
    <n-layout :native-scrollbar="false">
      <n-layout-header style="background: transparent !important" :inverted="false">
        <AdminHeader @open-side-nav="openSideNav" />
      </n-layout-header>
      <n-layout-content content-style="padding: 24px; margin-bottom: auto;min-height: 80vh;">
        <div class="flex flex-col gap-4">
          <n-breadcrumb>
            <n-breadcrumb-item
              v-for="item in breadcrumbs"
              :key="item?.slug"
              @click="item.slug && $router.resolve({ name: item.slug }) && $router.push({ name: item.slug })"
            >
              <n-icon v-if="item.icon" class="mr-2">
                <span class="iconify" :data-icon="item.icon"></span>
              </n-icon>
              <span v-if="item.label">{{ item.label }}</span>
            </n-breadcrumb-item>
          </n-breadcrumb>
          <slot />
        </div>
      </n-layout-content>
      <n-layout-footer position="static" class="!bg-transparent">
        <div class="pb-2 px-[24px] flex items-center gap-1">
          COPYRIGHT ©{{ new Date().getFullYear() }}
          <NButton type="primary" text>
            <a href="" target="_blank">TASTIA</a>
          </NButton>
          , All rights Reserved
        </div>
      </n-layout-footer>
      <n-back-top :right="100" />
    </n-layout>
  </n-layout>
</template>
