<script setup lang="ts">
const { open } = defineModels<{ open: boolean }>();
</script>

<template>
  <nav
    class="cursor-pointer hover:text-primary transition-all ease-in-out duration-150"
    @click="open = !open"
  >
    <NIcon :size="25">
      <i:ci-hamburger />
    </NIcon>
  </nav>
</template>
