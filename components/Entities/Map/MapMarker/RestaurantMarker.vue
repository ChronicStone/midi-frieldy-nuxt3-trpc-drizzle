<script setup lang="ts">
import { CustomMarker } from 'vue3-google-map';
import { NBadge, useThemeVars } from 'naive-ui';

const props = defineProps<{ restaurantId: string; index: number }>();

const userStore = useUserStore();
const themeVars = useThemeVars();
const showProfile = ref<boolean>(false);

const gatewayApi = useMapGateway();
const markerElement = ref<HTMLElement>();
const isHovered = useElementHover(markerElement);

const restaurant = computed(() => gatewayApi.restaurants.value.find((r) => r._id === props.restaurantId)!);
const lunchGroups = computed(
  () => gatewayApi?.lunchGroups.value.filter((group) => group.restaurant._id === restaurant.value?._id),
);
const userLunchGroup = computed(() =>
  lunchGroups.value
    .sort((a, b) => (a.meetingTime > b.meetingTime ? 1 : -1))
    .find((group) => group.users.some((user) => user.userId === userStore.user?._id)),
);

// const { SubscribeOnboardingEvent } = useOnboardingEvents();
// const cancelSubscription = SubscribeOnboardingEvent((event: OnboardingEvents) => {
//   if (event === OnboardingEvents.openRestaurantProfile && props.index === 0) showProfile.value = true;
//   if (event === OnboardingEvents.closeRestaurantProfile && props.index === 0) showProfile.value = false;
// }) as () => void;
// onUnmounted(() => cancelSubscription());
</script>

<template>
  <CustomMarker
    :options="{
      position: {
        lat: restaurant.coordinates.latitude,
        lng: restaurant.coordinates.longitude,
      },
      anchorPoint: 'BOTTOM_CENTER',
      zIndex: isHovered ? 1000 : 10,
    }"
  >
    <NTooltip>
      <div class="flex flex-col items-center">
        <span>{{ restaurant.name }}</span>
        <span class="text-xs text-gray-400">
          {{ lunchGroups.length }} groupe{{ lunchGroups.length > 1 ? 's' : '' }}
        </span>
      </div>
      <template #trigger>
        <div ref="markerElement" class="relative !cursor-pointer" @click="showProfile = true">
          <component :is="lunchGroups.length > 0 ? NBadge : 'div'" type="warning" :value="lunchGroups.length">
            <NAvatar
              class="shadow-sm"
              :style="{
                border: `3px solid ${userLunchGroup ? themeVars.primaryColor : '#d2d2d2'}`,
              }"
              :size="50"
              :theme-overrides="{ color: 'white' }"
            >
              <i:material-symbols:restaurant class="font-bold text-lg text-black" />
            </NAvatar>
          </component>

          <NEl
            v-if="userLunchGroup"
            tag="div"
            class="bg-[var(--primary-color)] py-1 px-2 rounded-full text-white dark:text-black w-[fit-content] active_time_tag"
          >
            {{ formatTimeFromTimestamp(userLunchGroup.meetingTime) }}
          </NEl>
        </div>
      </template>
    </NTooltip>
  </CustomMarker>

  <RestaurantProfile v-model:open="showProfile" :restaurant="restaurant" />
</template>

<style lang="scss">
.active_time_tag {
  position: absolute;
  top: 100%;
  right: 50%;
  transform: translate(50%, -50%);
}
</style>
