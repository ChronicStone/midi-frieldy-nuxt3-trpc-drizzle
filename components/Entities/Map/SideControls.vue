<script setup lang="ts">
import { CustomControl } from 'vue3-google-map';
</script>

<template>
  <CustomControl position="RIGHT_TOP">
    <div class="flex flex-col gap-2 p-4">
      <UserMenu />
      <GroupMenu />
      <PollMenu />
      <!-- <MapControlGroupMenu />
      <MapControlPollMenu /> -->
    </div>
  </CustomControl>
</template>
