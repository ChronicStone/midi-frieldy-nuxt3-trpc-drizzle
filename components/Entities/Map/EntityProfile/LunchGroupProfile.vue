<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
const props = withDefaults(
  defineProps<{
    groupId: string;
    showRestaurantInfo?: boolean;
    drawerPosition?: 'left' | 'right';
    highlightActive?: boolean;
  }>(),
  {
    highlightActive: true,
    showRestaurantInfo: false,
    drawerPosition: 'left',
  },
);

const userStore = useUserStore();
const themeVars = useThemeVars();
const gatewayApi = useMapGateway();

const { width } = useWindowSize();
const showDetails = ref<boolean>(false);

const lunchGroup = computed(() => gatewayApi.lunchGroups.value.find((group) => group._id === props.groupId)!);
const userOwnsGroup = computed<boolean>(() => lunchGroup.value.owner._id === userStore.user?._id);
const userBelongsToGroup = computed<boolean>(() =>
  lunchGroup.value.users.some((user) => user.userId === userStore.user?._id),
);

const restaurant = computed(
  () => gatewayApi.restaurants.value.find((r) => r._id === lunchGroup.value.restaurant._id)!,
);

const isLunchGroupExpired = computed<boolean>(() => {
  const now = new Date();
  const meetingTime = new Date(lunchGroup.value.meetingTime);
  return now > meetingTime;
});

function resolveUser(userId: string) {
  return gatewayApi.users.value.find((user) => user._id === userId)!;
}

function setDrawerVisibility(value: boolean) {
  showDetails.value = value;
}
</script>

<template>
  <NCard
    :segmented="{ content: true }"
    embedded
    :theme-overrides="userBelongsToGroup && highlightActive ? { borderColor: themeVars.primaryColor } : {}"
  >
    <template #header>
      <div v-if="showRestaurantInfo" class="flex flex-col gap-2">
        <span>{{ restaurant?.name }}</span>
      </div>
    </template>
    <div class="flex gap-4 items-center justify-between">
      <div class="flex flex-col gap-2">
        <span class="font-bold">{{ lunchGroup.label }}</span>
        <span>
          Réservation prévue pour
          <NEl tag="b" class="text-[var(--primary-color)]">
            {{ formatTimeFromTimestamp(lunchGroup.meetingTime) }}
          </NEl>
        </span>
        <UserStack :users="lunchGroup.users.map(({ userId }) => resolveUser(userId))" />
      </div>
      <div class="flex items-center gap-2">
        <NTooltip>
          Afficher les détails
          <template #trigger>
            <NButton size="small" secondary @click="showDetails = true">
              <template #icon>
                <i:material-symbols:info />
              </template>
            </NButton>
          </template>
        </NTooltip>

        <NTooltip v-if="!userBelongsToGroup">
          Rejoindre le groupe
          <template #trigger>
            <NButton
              size="small"
              secondary
              type="primary"
              :disabled="!!gatewayApi?.pendingOperation.value"
              :loading="gatewayApi?.pendingOperation.value === 'JoinGroup'"
              @click="joinLunchGroup(gatewayApi, lunchGroup)"
            >
              <template #icon>
                <i:ic:baseline-log-in />
              </template>
            </NButton>
          </template>
        </NTooltip>

        <NTooltip v-if="userBelongsToGroup && !userOwnsGroup">
          Quitte le groupe
          <template #trigger>
            <NButton
              size="small"
              secondary
              type="error"
              :disabled="!!gatewayApi?.pendingOperation.value"
              :loading="gatewayApi?.pendingOperation.value === 'LeaveGroup'"
              @click="leaveLunchGroup(lunchGroup._id, setDrawerVisibility)"
            >
              <template #icon>
                <i:ic:baseline-log-out />
              </template>
            </NButton>
          </template>
        </NTooltip>

        <NTooltip v-if="userOwnsGroup">
          Supprimer le groupe
          <template #trigger>
            <NButton
              size="small"
              secondary
              type="error"
              :disabled="!!gatewayApi?.pendingOperation.value"
              :loading="gatewayApi?.pendingOperation.value === 'DeleteGroup'"
              @click="deleteLunchGroup(lunchGroup._id, setDrawerVisibility)"
            >
              <template #icon>
                <i:mdi:trash />
              </template>
            </NButton>
          </template>
        </NTooltip>
      </div>
    </div>
  </NCard>

  <NDrawer
    v-model:show="showDetails"
    :z-index="850"
    mask-closable
    :width="width < 580 ? width : 580"
    :placement="drawerPosition"
  >
    <NDrawerContent :native-scrollbar="false" closable>
      <template #header>
        <h2 class="text-2xl font-black">
          <span>Restaurant </span>
          <NEl tag="span" class="text-[var(--primary-color)]">
            {{ restaurant?.name }}
          </NEl>
        </h2>
      </template>

      <div class="flex flex-col gap-10">
        <div class="flex flex-col gap-4">
          <h3 class="text-xl font-black">Informations sur le groupe</h3>
          <NCard embedded>
            <ul class="flex flex-col gap-4">
              <li class="flex items-center justify-between">
                <b class="font-black">Label du groupe :</b>
                <span>{{ lunchGroup.label }}</span>
              </li>

              <li class="flex items-center justify-between">
                <b class="font-black">Créateur du groupe :</b>
                <NEl
                  tag="span"
                  :class="{
                    'text-[var(--primary-color)]': lunchGroup.owner._id === userStore.user?._id,
                  }"
                >
                  {{ lunchGroup.owner.firstName }} {{ lunchGroup.owner.lastName }}
                </NEl>
              </li>

              <li class="flex items-center justify-between">
                <b class="font-black">Date de rendez-vous :</b>
                <span>{{ formatDateTime(lunchGroup.meetingTime) }}</span>
              </li>

              <li class="flex items-center justify-between">
                <b class="font-black">Date de création :</b>
                <span>{{ formatDateTime(lunchGroup.createdAt) }}</span>
              </li>

              <li class="flex items-center justify-between">
                <b class="font-black">Nom du restaurant :</b>
                <span>{{ restaurant?.name }}</span>
              </li>

              <li
                class="flex gap-2 items-start justify-between"
                :class="!lunchGroup.description ? 'flex-row' : 'flex-col'"
              >
                <b class="font-black">Description :</b>
                <div
                  class="bg-blue-gray-500/10 w-full h-auto p-2 !pr-0.5"
                  :style="{ borderRadius: themeVars.borderRadius }"
                >
                  <NScrollbar class="max-h-32 italic text-gray-500 whitespace-pre pr-2">
                    {{ lunchGroup.description || 'N/A' }}
                  </NScrollbar>
                </div>
              </li>
            </ul>
          </NCard>
        </div>

        <div class="flex flex-col gap-4">
          <h3 class="text-xl font-black">Participants</h3>
          <UserCard
            v-for="user in lunchGroup.users"
            :key="user._id"
            :user="resolveUser(user.user._id)"
            :highlight="user._id === userStore.user?._id"
          />
        </div>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>
