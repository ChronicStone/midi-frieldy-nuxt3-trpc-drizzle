<script setup lang="ts">
import { GoogleMap } from 'vue3-google-map';
// import { OnboardingEvents } from "@/types/onboarding";

const props = withDefaults(
  defineProps<{
    zoom?: number;
    orgaCoordinates: { latitude: number; longitude: number };
    boundaries?: { latitude: number; longitude: number };
  }>(),
  {
    zoom: 17,
    boundaries: () => ({
      latitude: 0.004,
      longitude: 0.008,
    }),
  },
);

const appStore = useAppStore();
const mapGatewayApi = useProvideMapGateway();

const GApiKey = import.meta.env.VITE_GOOGLE_API_KEY as string;
const computedBoundaries = computed(() => ({
  north: props.orgaCoordinates.latitude + props.boundaries.latitude,
  south: props.orgaCoordinates.latitude - props.boundaries.latitude,
  east: props.orgaCoordinates.longitude + props.boundaries.longitude,
  west: props.orgaCoordinates.longitude - props.boundaries.longitude,
}));

const mapStylesConfig = computed(() => [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  ...(appStore.isDark ? [...GMapsThemeOverridesDark] : []),
]);

// const { SubscribeOnboardingEvent } = useOnboardingEvents();
// const cancelSubscription = SubscribeOnboardingEvent(
//   (event: OnboardingEvents) => {
//     if (event === OnboardingEvents.openCreateGroupForm)
//       formApi.createForm(LunchGroupFormSchema());

//     if (event === OnboardingEvents.closeCreateGroupForm)
//       (
//         document.querySelector(
//           "#sweetforms__form > div.n-card__footer > div > button.n-button.n-button--error-type.n-button--medium-type.n-button--secondary"
//         ) as HTMLButtonElement
//       )?.click();
//   }
// ) as () => void;
// onUnmounted(() => cancelSubscription());
</script>

<template>
  <NSpin :show="mapGatewayApi?.isRestaurantsLoading.value ?? true">
    <template #description> Chargement des restaurants... </template>
    <GoogleMap
      :api-key="GApiKey"
      class="h-layout w-screen"
      :center="{
        lat: orgaCoordinates.latitude,
        lng: orgaCoordinates.longitude,
      }"
      :styles="mapStylesConfig"
      :zoom="zoom"
      :clickable-icons="false"
      :restriction="{ latLngBounds: computedBoundaries }"
      disable-default-ui
    >
      <OrganizationMarker :position="orgaCoordinates" />

      <RestaurantMarker
        v-for="(restaurant, index) in mapGatewayApi.restaurants.value"
        :key="restaurant._id"
        :restaurant-id="restaurant._id"
        :index="index"
      />
      <SideControls />
    </GoogleMap>
  </NSpin>
</template>
