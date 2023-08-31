<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { CustomMarker } from 'vue3-google-map';

const props = defineProps<{
  position: { latitude: number; longitude: number };
}>();

const userStore = useUserStore();
const themeVars = useThemeVars();
</script>

<template>
  <CustomMarker
    :options="{
      position: { lat: position.latitude, lng: position.longitude },
      anchorPoint: 'BOTTOM_CENTER',
    }"
  >
    <NTooltip>
      {{ userStore.activeOrganization?.name }}
      <template #trigger>
        <NAvatar :color="themeVars.primaryColor">
          <span
            class="iconify font-bold text-[50px] text-shadow text-white"
            data-icon="mdi:office-building"
          />
        </NAvatar>
      </template>
    </NTooltip>
  </CustomMarker>
</template>
