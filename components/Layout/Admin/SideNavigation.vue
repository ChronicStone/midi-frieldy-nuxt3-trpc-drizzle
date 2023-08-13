<script setup lang="ts">
const { collapsed } = defineModels<{ collapsed: boolean }>();

const appStore = useAppStore();
const isSmallDevice = useIsMobile();
const navMenuItems = computed(() => mapNavigationItems(NAV_MENU_ITEMS.admin));

function closeMenuOnRouteChange() {
  isSmallDevice.value && (collapsed.value = true);
}

const menuRef = ref<HTMLElement>();
onClickOutside(menuRef, () => isSmallDevice.value && (collapsed.value = true));
</script>

<template>
  <div ref="menuRef" class="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-2 h-screen">
    <div class="flex h-16 shrink-0 items-center">
      <img v-if="collapsed" src="@/assets/images/LogoSmall.png" class="h-6 w-auto" />
      <img v-else-if="appStore.isDark" src="@/assets/images/LogoDark.svg" class="h-6 w-auto" />
      <img v-else src="@/assets/images/LogoLight.svg" class="h-6 w-auto" />
    </div>
    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            <li v-for="(item, key) in navMenuItems" :key="key">
              <NTooltip :disabled="!collapsed" placement="right">
                <template #trigger>
                  <NuxtLink
                    :to="{ name: item.slug }"
                    class="group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all ease-in-out duration-150"
                    :class="{
                      'bg-gray-100 dark:bg-black/20 text-primary': $route.name === item.slug,
                      'hover:(bg-gray-50 dark:bg-black:12) hover:text-primary/75 ': $route.name !== item.slug,
                    }"
                    @click="closeMenuOnRouteChange"
                  >
                    <span class="iconify h-6 w-6 shrink-0" :data-icon="item.icon" />
                    <span v-if="!collapsed">{{ item.label }}</span>
                  </NuxtLink>
                </template>
                {{ item.label }}
              </NTooltip>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>
