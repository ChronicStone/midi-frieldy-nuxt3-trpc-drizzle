<script setup lang="tsx">
import { useThemeVars } from 'naive-ui';
import { useDropdownActions } from '@/composables/useDropdownActions';

defineEmits<{ (e: 'openSideNav'): void }>();
defineProps<{ inverted?: boolean }>();

const route = useRoute();
const isSmallDevice = useIsMobile();

const userStore = useUserStore();
const themeVars = useThemeVars();

const routeTitle = computed(() => {
  const rootSlug = route.name?.toString()?.split('.')[0] ?? '';
  const item = NAV_MENU_ITEMS.find((item) => item.slug === rootSlug);
  return { label: item?.label ?? formatKey(rootSlug), icon: item?.icon };
});

const userDropdownActions = useDropdownActions([
  {
    label: 'Profile',
    icon: 'healthicons:ui-user-profile',
  },
  {
    label: 'Logout',
    icon: 'ic:twotone-logout',
    action: async () => {
      await userStore.clearUserSession();
      navigateTo('/auth/login');
    },
  },
]);
</script>

<template>
  <div class="px-5 pt-4 pr-7" :style="{ backgroundColor: themeVars.bodyColor }">
    <div class="layout-header">
      <div class="layout-header-left">
        <div class="flex items-center gap-2 text-lg uppercase ml-4">
          <div
            v-if="isSmallDevice"
            id="ToggleMenuTrigger"
            class="ml-1 layout-header-trigger layout-header-trigger-min"
            @click="$emit('openSideNav')"
          >
            <n-icon size="25">
              <i:charm:menu-hamburger />
            </n-icon>
          </div>
          <NDivider v-if="isSmallDevice" vertical class="" />
          <span>{{ routeTitle.label }}</span>
        </div>
      </div>

      <div class="flex items-center pr-4">
        <ToggleTheme />

        <n-divider vertical />
        <!-- <n-dropdown trigger="click">
          <div class="avatar">
            <n-dropdown placement="bottom-end" :options="userDropdownActions">
              <n-avatar round>
                {{ userStore.user?.firstName?.charAt(0) }}
                {{ userStore.user?.lastName?.charAt(0) }}
              </n-avatar>
            </n-dropdown>
          </div>
        </n-dropdown> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  height: 64px;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  transition: all 0.2s ease-in-out;
  background-color: v-bind('themeVars.modalColor');
  border: 0.01px solid;
  border-radius: v-bind('themeVars.borderRadius');
  width: 100%;
  z-index: 11;
  @apply border-gray-400/25;

  &-left {
    display: flex;
    align-items: center;

    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 64px;
      line-height: 64px;
      overflow: hidden;
      white-space: nowrap;
      padding-left: 10px;

      img {
        width: auto;
        height: 32px;
        margin-right: 10px;
      }

      .title {
        margin-bottom: 0;
      }
    }

    ::v-deep(.ant-breadcrumb span:last-child .link-text) {
      color: #515a6e;
    }

    .n-breadcrumb {
      display: inline-block;
    }

    &-menu {
      color: var(--text-color);
    }
  }

  &-right {
    display: flex;
    align-items: center;

    .avatar {
      display: flex;
      align-items: center;
      height: 64px;
    }

    > * {
      cursor: pointer;
    }
  }

  &-trigger {
    display: inline-block;
    width: 64px;
    height: 64px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease-in-out;

    .n-icon {
      display: flex;
      align-items: center;
      height: 64px;
      line-height: 64px;
    }

    &:hover {
      background: hsla(0, 0%, 100%, 0.08);
    }

    .anticon {
      font-size: 16px;
      color: #515a6e;
    }
  }

  &-trigger-min {
    width: auto;
    padding: 0 12px;
  }
}

.layout-header-light {
  background: #fff;
  color: #515a6e;

  .n-icon {
    color: #515a6e;
  }

  .layout-header-left {
    ::v-deep(.n-breadcrumb .n-breadcrumb-item:last-child .n-breadcrumb-item__link) {
      color: #515a6e;
    }
  }

  .layout-header-trigger {
    &:hover {
      background: #f8f8f9;
    }
  }
}

.layout-header-fix {
  position: fixed;
  top: 0;
  right: 0;
  left: 200px;
  z-index: 11;
}
</style>
