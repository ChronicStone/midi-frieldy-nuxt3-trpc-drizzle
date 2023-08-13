<script setup lang="ts">
definePageMeta({
  auth: true,
  middleware: ['active-organization'],
});

const userStore = useUserStore();
</script>

<template>
  <InteractiveMap
    v-if="userStore.activeOrganization"
    :key="userStore.activeOrganization._id"
    :orga-coordinates="userStore.activeOrganization.coordinates"
  />
  <div v-else>No orga selected</div>
</template>
