<script setup lang="ts">
import { LunchGroupPollListItem } from '@/types/lunchGroup';

const showMenu = ref<boolean>(false);
const { width } = useWindowSize();
const mapGatewayApi = useMapGateway();

function sortPollsByDate(polls: LunchGroupPollListItem[]) {
  return polls.sort((a, b) => {
    if (a.voteDeadline > b.voteDeadline) return -1;
    else if (a.voteDeadline < b.voteDeadline) return 1;
    else return 0;
  });
}

function setDrawerVisibility(visible: boolean) {
  showMenu.value = visible;
}

// const { SubscribeOnboardingEvent } = useOnboardingEvents();
// const cancelSubscription = SubscribeOnboardingEvent((event: OnboardingEvents) => {
//   if (event === OnboardingEvents.openPollMenu) showMenu.value = true;
//   if (event === OnboardingEvents.closePollMenu) showMenu.value = false;
// }) as () => void;
// onUnmounted(() => cancelSubscription());
</script>

<template>
  <NTooltip>
    Gérer les votes
    <template #trigger>
      <NButton id="poll-menu-trigger" type="primary" circle @click="showMenu = true">
        <template #icon>
          <i:fluent:poll-16-filled />
        </template>
      </NButton>
    </template>
  </NTooltip>

  <NDrawer
    v-model:show="showMenu"
    :width="width < 580 ? width : 580"
    placement="right"
    mask-closable
    display-directive="show"
  >
    <NDrawerContent :native-scrollbar="false" closable>
      <template #header>
        <span class="text-xl font-black"> Votes en cours </span>
      </template>

      <template #footer>
        <NButton
          :disabled="!!mapGatewayApi?.pendingOperation.value"
          :loading="mapGatewayApi?.pendingOperation.value === 'CreateGroupPoll'"
          type="primary"
          @click="createLunchGroupPoll(setDrawerVisibility)"
        >
          <template #icon>
            <i:mdi:plus />
          </template>
          Créer un groupe par vote
        </NButton>
      </template>

      <template v-if="!mapGatewayApi?.lunchGroupPolls.value.length">
        <div id="poll-menu-drawer" class="h-full grid place-items-center">
          <NEmpty description="Aucun vote en cours" />
        </div>
      </template>

      <div v-else id="poll-menu-drawer" class="flex flex-col gap-5">
        <LunchGroupPollProfile
          v-for="poll in sortPollsByDate(mapGatewayApi?.lunchGroupPolls.value ?? [])"
          :key="poll._id"
          :group-poll="poll"
          @set-user-vote="setPollUserVote($event, setDrawerVisibility)"
        />
        <!--           @set-user-vote="SetUserVote"  -->
      </div>
    </NDrawerContent>
  </NDrawer>
</template>
