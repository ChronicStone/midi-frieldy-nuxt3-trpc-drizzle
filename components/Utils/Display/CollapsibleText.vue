<script setup lang="ts">
const props = withDefaults(defineProps<{ defaultState?: boolean; expandOnHover?: boolean }>(), {
  defaultState: false,
  expandOnHover: false,
});

const emit = defineEmits<{
  (e: 'expand'): void;
  (e: 'collapse'): void;
}>();

const isExpanded = ref<boolean>(props.defaultState);
const titleElement = ref<HTMLElement>();

defineExpose({
  isExpanded: computed(() => isExpanded.value),
  setExpanded: (value: boolean) => (isExpanded.value = value),
  toggleExpanded: () => (isExpanded.value = !isExpanded.value),
});

if (props.expandOnHover) {
  const isHovered = useElementHover(titleElement);

  watch(
    () => isHovered.value,
    (value: boolean) => value && (isExpanded.value = true),
  );
}

watch(
  () => isExpanded.value,
  (value: boolean) => (value ? emit('expand') : emit('collapse')),
);
</script>

<template>
  <div class="flex flex-col">
    <h2
      ref="titleElement"
      class="cursor-pointer text-xl font-bold transition-all ease-in-out duration-100"
      :class="isExpanded ? 'text-primary' : ''"
      @click="isExpanded = !isExpanded"
    >
      <slot name="title" />
    </h2>
    <NCollapseTransition :show="isExpanded">
      <slot />
    </NCollapseTransition>
  </div>
</template>
