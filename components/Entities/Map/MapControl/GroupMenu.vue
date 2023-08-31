<script setup lang="ts">
const showMenu = ref<boolean>(false);
const { width } = useWindowSize();
const gatewayApi = useMapGateway();

const lunchGroups = computed(() =>
  gatewayApi.lunchGroups.value.sort((a, b) => {
    if (a.meetingTime > b.meetingTime) return -1;
    else if (a.meetingTime < b.meetingTime) return 1;
    else return 0;
  }),
);
</script>

<template>
  <NTooltip placement="left">
    Mes groupes actifs
    <template #trigger>
      <NButton id="group-menu-trigger" class="drop-shadow-xl" type="primary" circle @click="showMenu = true">
        <template #icon>
          <i:material-symbols:restaurant />
        </template>
      </NButton>
    </template>
  </NTooltip>

  <NDrawer
    v-model:show="showMenu"
    :width="width < 580 ? width : 580"
    :z-index="800"
    placement="right"
    mask-closable
  >
    <NDrawerContent :native-scrollbar="false" closable>
      <template #header>
        <span class="text-xl font-black"> Mes groupes actifs </span>
      </template>

      <div class="flex flex-col gap-4">
        <div v-if="!lunchGroups?.length" class="h-32 grid place-items-center">
          <NEmpty description="Aucun groupe actif" />
        </div>
        <LunchGroupProfile
          v-for="group in lunchGroups"
          :key="group._id"
          :group-id="group._id"
          :highlight-active="false"
          drawer-position="right"
          show-restaurant-info
        />
      </div>
    </NDrawerContent>
  </NDrawer>
</template>
