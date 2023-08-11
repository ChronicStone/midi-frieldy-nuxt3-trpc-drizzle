<template>
  <div ref="navMenuContainer" class="flex overflow-hidden">
    <!-- MAIN SIDENAV CONTAINER -->
    <div
      class="w-20 px-4 py-8 flex flex-col items-center h-screen gap-2 transition-all ease-in-out duration-200"
      :class="{ '-ml-20': collapsed }"
    >
      <img src="@/assets/images/LogoSmall.png" class="h-8 w-auto" />
      <n-divider />

      <!-- MENU CATEGORIES -->
      <div class="flex flex-col gap-4 h-max">
        <n-tooltip
          v-for="({ key, icon, label, slug, items }, id) in navCategories"
          :key="id"
          trigger="hover"
          placement="right"
        >
          <template #trigger>
            <component
              :is="items?.length ? 'div' : 'router-link'"
              class="grid place-items-center rounded-lg hover:(bg-gray-300/25 dark:bg-gray-600/25 text-primary) p-3 cursor-pointer transition-all ease-in-out duration-200"
              :class="[
                {
                  'bg-gray-300/25 dark:bg-gray-600/25 text-primary':
                    (activeMenuOverride ? activeMenuOverride : activeMenuCategory) ===
                    slug?.toString()?.split('.')[0],
                },
              ]"
              v-bind="{ ...(!items?.length && slug && { to: { name: slug } }) }"
              v-on="{
                ...(items?.length && {
                  click: () => expandSideNav(key ?? '', slug?.toString()?.split('.')[0] ?? ''),
                }),
                ...(!items?.length && { click: closeSideNav }),
              }"
            >
              <span class="iconify h-4.5 w-4.5" :data-icon="icon"></span>
            </component>
          </template>
          <div class="flex flex-col">
            {{ label }}
          </div>
        </n-tooltip>
      </div>
      <div v-if="!isSmallDevice" class="h-full bg-rd flex flex-col justify-end w-full">
        <NDivider />
        <div
          class="grid place-items-center rounded-lg hover:(bg-gray-300/25 dark:bg-gray-600/25) p-3 cursor-pointer transition-all ease-in-out duration-200"
          :class="[
            {
              'bg-gray-300/25 dark:bg-gray-600/25 text-primary': lockLayout,
            },
          ]"
          @click="lockLayout = !lockLayout"
        >
          <transition name="fade-slide" mode="out-in">
            <i:ph-lock-key-open-duotone v-if="lockLayout" />
            <i:ph-lock-duotone v-else />
          </transition>
        </div>
      </div>
    </div>

    <!-- SECONDARY SIDENAV CONTAINER -->
    <transition name="fade" mode="out-in">
      <div
        class="flex h-screen transition-all ease-in-out duration-300"
        :class="activeCategory && expanded ? 'w-64' : 'w-0'"
      >
        <div class="h-full p-4 border-l border-solid dark:border-gray-600/25 w-full">
          <!-- SECTION TITLE -->
          <div>
            <div class="flex justify-between items-center w-full">
              <h4 class="text-lg font-medium uppercase">
                {{ activeCategory?.label }}
              </h4>
            </div>
            <div
              v-if="activeCategory?.entityKey === 'organization'"
              class="font-semibold text-gray-400 text-md mt-2"
            >
              {{ userStore?.activeOrganization?.name }}
            </div>
            <n-divider />
          </div>
          <NScrollbar style="max-height: 83vh">
            <div class="flex flex-col gap-8 overflow-x-hidden pr-3">
              <div
                v-for="{ key, label, items } in activeCategory?.items"
                :key="key"
                class="flex flex-col gap-3"
              >
                <div v-if="label" class="uppercase text-md font-medium text-gray-400">
                  {{ label }}
                </div>

                <div class="flex flex-col gap-2.5 px-1">
                  <NavMenuItem
                    v-for="(item, index) in items"
                    :key="index"
                    v-bind="item"
                    :active-category="activeMenuCategory"
                    :offset="0"
                    @close-parent="closeSideNav"
                  />
                </div>
              </div>
            </div>
          </NScrollbar>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="tsx">
// import EntitySelector from "./EntitySelector.vue";
import NavMenuItem from './NavMenuItem.vue';
const emit = defineEmits(['closeSideNav']);

const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const route = useRoute();
const userStore = useUserStore();
const appStore = useAppStore();
const isSmallDevice = useIsMobile();

const expanded = ref<boolean>(false);
const categoryKey = ref<string | null | undefined>(null);
const navCategories = computed(() => mapNavigationItems(NAV_MENU_ITEMS));
const activeCategory = computed(() => navCategories.value.find(({ key }) => key === categoryKey.value));

const activeMenuOverride = ref<string | null>(null);
const activeMenuCategory = computed(() => activeMenuOverride.value || route.name?.toString().split('.')[0]);

onMounted(() => {
  categoryKey.value = navCategories.value[0].key ?? '';
  activeMenuOverride.value = navCategories.value[0].slug ?? '';
});

function getOpenRouteCategory() {
  const routeName = route.name?.toString();
  const navCategory = navCategories.value.find(({ slug }) => routeName?.includes(slug ?? ''));

  return navCategory?.key;
}

const lockLayout = ref<boolean>(false);
watch(
  () => lockLayout.value,
  (value: boolean) => {
    if (value) {
      expanded.value = true;
      if (!categoryKey.value) categoryKey.value = getOpenRouteCategory() || navCategories.value[0].key;
    } else expanded.value = false;
  },
);

function expandSideNav(key: string, slug: string) {
  activeMenuOverride.value = slug;
  expanded.value = !lockLayout.value ? !(expanded.value && categoryKey.value === key) : true;
  categoryKey.value = key;
}

const isDescendant = (parent: HTMLElement | null, child: HTMLElement) => {
  let node = child.parentNode;
  while (node != null) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
};

const navMenuContainer = ref(null);
onClickOutside(navMenuContainer, (e) => {
  const child = e.target as HTMLElement;
  const sweetformOverlay = document.getElementById('sweetforms__overlay');
  const menuTrigger = document.getElementById('ToggleMenuTrigger');
  const entitySelector = document.getElementById('__entitySelectorPopover');
  const checkDescendant =
    isDescendant(sweetformOverlay, child) ||
    isDescendant(menuTrigger, child) ||
    isDescendant(entitySelector, child);
  if (
    !checkDescendant &&
    !['sweetforms__overlay', 'ToggleMenuTrigger', '__entitySelectorPopover'].includes(
      (e?.target as any)?.id,
    ) &&
    !child.classList?.contains('n-base-select-option__content') &&
    !lockLayout.value
  ) {
    expanded.value = false;
    categoryKey.value = null;
    activeMenuOverride.value = null;
    if (isSmallDevice.value) emit('closeSideNav');
  }
});

const closeSideNav = () => {
  if (isSmallDevice.value) emit('closeSideNav');
  if (lockLayout.value) return;
  expanded.value = false;
  categoryKey.value = null;
  activeMenuOverride.value = null;
};

watch(
  () => props.collapsed,
  (isCollapsed: boolean) => {
    if (!isCollapsed && getOpenRouteCategory()) {
      expanded.value = true;
      categoryKey.value = getOpenRouteCategory();
    }
  },
);
</script>

<style>
.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-100%, 0);
}
</style>
