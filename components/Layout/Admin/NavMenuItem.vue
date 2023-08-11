<template>
  <div>
    <component
      :is="items?.length ? 'div' : NuxtLink"
      class="flex items-center justify-between w-full cursor-pointer"
      v-bind="{ ...(!items?.length && { to: slug ? { name: slug } : path }) }"
      :class="{ 'text-primary': active || hasActiveChildren }"
      v-on="{
        ...(items?.length && { click: () => (expanded = !expanded) }),
        ...(!items?.length && { click: () => $emit('closeParent') }),
      }"
    >
      <div
        class="flex items-center gap-2 hover:text-primary transition-all ease-in-out duration-150 align-middle text-md"
      >
        <span class="iconify h-4 w-4" :data-icon="icon"></span>
        <!-- <span v-else class="iconify h-4 w-4" data-icon="codicon:debug-stackframe-dot"></span> -->
        <span>{{ label }}</span>
      </div>
      <i:mdi:chevron-right
        v-if="items?.length"
        class="iconify h-5 w-5 transition-all ease-in-out duration-150 transform origin-center"
        :class="expanded || active ? 'rotate-90' : ''"
        data-icon="jam:chevron-right"
      />
    </component>
    <NCollapseTransition v-if="items?.length" :show="!!(items?.length && (expanded || active))">
      <div
        :style="{ marginLeft: `${offset * 8}px` }"
        class="transition-all ease-in-out duration-200 overflow-hidden flex flex-col gap-2.5 mt-2.5"
      >
        <NavMenuItem
          v-for="(item, index) in items"
          :key="index"
          v-bind="item"
          :offset="offset + 1"
          :active-category="activeCategory"
          @close-parent="emit('closeParent')"
        />
      </div>
    </NCollapseTransition>
  </div>
</template>

<script lang="ts"></script>

<script setup lang="ts">
import { VNodeChild } from 'vue';
import { NuxtLink } from '#components';
import type { MenuItem } from '@/types/system/navigation';

defineOptions({
  name: 'NavMenuItem',
});

const emit = defineEmits(['closeParent']);
const props = withDefaults(
  defineProps<{
    label: string | (() => VNodeChild);
    icon?: string;
    path?: string;
    slug?: string;
    items?: MenuItem[];
    permissions?: string[] | string;
    offset: number;
    activeCategory: string;
  }>(),
  {
    icon: '',
    path: '',
    items: () => [],
    slug: '',
    value: false,
    offset: 1,
    activeCategory: '',
  },
);

const route = useRoute();

const expanded = ref(false);
const active = computed(
  () =>
    expanded.value ||
    (route.name &&
      route.name?.toString().includes(props?.slug) &&
      props?.slug?.split('.')[0] === props.activeCategory),
);

const hasActiveChildren = computed(
  () =>
    !!props.items?.length &&
    route.name &&
    route.name?.toString().includes(props?.slug) &&
    props?.slug?.split('.')[0] !== props.activeCategory,
);
</script>
