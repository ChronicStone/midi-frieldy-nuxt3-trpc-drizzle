<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import { LunchGroupPollListItem } from '@/types/lunchGroup';

const userStore = useUserStore();
const themeVars = useThemeVars();
const gatewayApi = useMapGateway();

const props = defineProps<{ groupPoll: LunchGroupPollListItem }>();
const emit = defineEmits<{
  (
    event: 'setUserVote',
    payload: {
      groupId: string;
      voteOptions: Array<{ label: string; value: string }>;
      userCurrentVote: string | null;
    },
  ): void;
}>();

const voteCount = computed(() => props.groupPoll.pollEntries.length);
const timeLeft = useTimer(props.groupPoll.voteDeadline);
const timeLeftPercentage = useTimerPercentage(props.groupPoll.voteDeadline, props.groupPoll.createdAt);

const userHasVoted = computed(() => !!userVoteValue.value);
const userVoteValue = computed(
  () =>
    props.groupPoll.pollEntries?.find((vote) => vote.userId === userStore.user?._id)?.restaurant?._id ?? null,
);

const voteOptions = computed(() => {
  if (props.groupPoll.restaurants.length)
    return props.groupPoll.restaurants.map((restaurant) => ({
      label: restaurant.restaurant.name,
      value: restaurant.restaurantId,
    }));
  else
    return (
      gatewayApi.restaurants.value.map((restaurant) => ({ label: restaurant.name, value: restaurant._id })) ??
      []
    );
});

const voteUsers = computed(() => props.groupPoll.pollEntries.map((entry) => resolveUser(entry.userId)));

const voteState = computed(() => {
  const restaurantIds = [
    ...new Set([
      ...props.groupPoll.pollEntries.map((vote) => vote.restaurantId),
      ...(props.groupPoll?.restaurants?.map((r) => r.restaurantId) ?? []),
    ]),
  ];
  const restaurants = restaurantIds.map((id) => gatewayApi.restaurants.value.find((r) => r._id === id)!);
  return restaurants.map((restaurant) => ({
    restaurant,
    voteCount: {
      total: props.groupPoll.pollEntries.filter((entry) => entry.restaurant._id === restaurant._id).length,
      percentage:
        (props.groupPoll.pollEntries.filter((entry) => entry.restaurant._id === restaurant._id).length /
          props.groupPoll.pollEntries.length) *
        100,
    },
    users: props.groupPoll.pollEntries
      .filter((entry) => entry.restaurant._id === restaurant._id)
      .map((entry) => entry.user),
  }));
});

const timerProgressColor = computed(() => {
  if (timeLeftPercentage.value > 50) return themeVars.value.successColor;
  else if (timeLeftPercentage.value > 25) return themeVars.value.warningColor;
  else return themeVars.value.warningColor;
});

function setUserVote() {
  emit('setUserVote', {
    groupId: props.groupPoll._id,
    voteOptions: voteOptions.value,
    userCurrentVote: userVoteValue.value,
  });
}

function resolveUser(userId: string) {
  return gatewayApi.users.value.find((user) => user._id === userId)!;
}
</script>

<template>
  <NCard embedded :segmented="{ content: true, footer: true }">
    <template #header>
      <NEllipsis :style="{ maxWidth: '40%' }">
        <span>{{ groupPoll.label }}</span>
      </NEllipsis>
    </template>

    <template #header-extra>
      <UserStack size="small" :users="voteUsers" />
    </template>

    <template #footer>
      <div class="grid grid-cols-2 gap-2">
        <NButton class="w-full" type="primary" secondary @click="setUserVote">
          <template #icon>
            <i:fluent:vote-20-filled />
          </template>
          {{ userHasVoted ? 'CHANGER MON VOTE' : 'VOTER' }}
        </NButton>
      </div>
    </template>

    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <span class="font-semibold">Temps restant</span>
          <span class="font-semibold">{{ timeLeft }}</span>
        </div>
        <NProgress
          type="line"
          :percentage="timeLeftPercentage"
          :show-indicator="false"
          :color="timerProgressColor"
          :height="10"
          :border-radius="themeVars.borderRadius"
          processing
        />
      </div>
      <NDivider class="!m-0" />
      <div class="flex flex-col gap-2">
        <li class="flex items-center justify-between">
          <b class="font-medium">Heure de fin du vote:</b>
          <span>{{ formatTimeFromTimestamp(groupPoll.voteDeadline) }}</span>
        </li>

        <li class="flex items-center justify-between">
          <b class="font-medium">Heure de rendez-vous:</b>
          <span>{{ formatTimeFromTimestamp(groupPoll.meetingTime!) }}</span>
        </li>

        <li class="flex gap-2 items-start justify-between flex-col">
          <b class="font-medium">Description :</b>
          <div
            class="bg-blue-gray-500/10 w-full h-auto p-2 !pr-0.5"
            :style="{ borderRadius: themeVars.borderRadius }"
          >
            <NScrollbar class="max-h-32 italic text-gray-500 whitespace-pre pr-2">
              {{ groupPoll.description || 'N/A' }}
            </NScrollbar>
          </div>
        </li>
      </div>
      <NDivider class="!m-0" />
      <div class="flex flex-col gap-3">
        <div v-for="voteItem in voteState" :key="voteItem?.restaurant?._id" class="flex flex-col gap-1.5">
          <div class="flex items-center justify-between">
            <NEllipsis :style="{ maxWidth: '80%' }">
              <span>{{ voteItem.restaurant.name }}</span>
            </NEllipsis>
            <span class="text-xs text-gray-500"> {{ voteItem.voteCount.percentage }} % </span>
          </div>
          <NProgress
            type="line"
            :percentage="voteItem.voteCount.percentage"
            :show-indicator="false"
            :color="themeVars.primaryColor"
            :height="10"
            :border-radius="themeVars.borderRadius"
          />
        </div>
      </div>
    </div>
  </NCard>
</template>
