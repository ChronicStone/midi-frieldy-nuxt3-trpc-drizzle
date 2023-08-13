<script setup lang="ts">
const { collapsed } = defineModels<{ collapsed: boolean }>();

const appStore = useAppStore();
const isSmallDevice = useIsMobile();
const navMenuGroups = computed(() => mapNavigationItems(NAV_MENU_ITEMS.admin));

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
      <ul role="list" class="flex flex-1 flex-col" :class="collapsed ? 'gap-y-1.5' : 'gap-y-7'">
        <li v-for="(group, groupId) in navMenuGroups" :key="groupId" class="flex flex-col gap-3.5">
          <div
            v-if="!collapsed && group.label"
            class="flex items-center justify-between w-full cursor-pointer"
            @click="group.expanded.value = !group.expanded.value"
          >
            <span class="font-bold uppercase">{{ group.label }}</span>
            <i:mdi:chevron-down
              class="transition-all ease-in-out duration-150"
              :class="{ 'rotate-180': !group.expanded.value }"
            />
          </div>
          <NCollapseTransition :show="group.expanded.value || collapsed">
            <ul role="list" class="-mx-2 space-y-1.5">
              <li v-for="(item, key) in group.items" :key="key">
                <NTooltip :disabled="!collapsed" placement="right">
                  <template #trigger>
                    <NuxtLink :to="{ name: item.slug }" @click="closeMenuOnRouteChange">
                      <NEl
                        tag="div"
                        class="flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 transition-all ease-in-out duration-150"
                        :class="{
                          'bg-gray-100 dark:bg-black/20 text-[var(--primary-color)]':
                            $route.name === item.slug,
                          'hover:(bg-gray-50 dark:bg-black:12) hover:text-[var(--primary-color)] ':
                            $route.name !== item.slug,
                        }"
                      >
                        <span
                          class="iconify h-6 w-6 shrink-0 opacity-45 hover:opacity-75"
                          :data-icon="item.icon"
                        />
                        <span v-if="!collapsed">{{ item.label }}</span>
                      </NEl>
                    </NuxtLink>
                  </template>
                  {{ item.label }}
                </NTooltip>
              </li>
            </ul>
          </NCollapseTransition>
        </li>
      </ul>
    </nav>
  </div>
</template>
