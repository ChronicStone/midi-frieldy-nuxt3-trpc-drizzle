const [useProvideMapGateway, _useMapGateway] = createInjectionState(() => {
  const { $client } = useNuxtApp();
  const userStore = useUserStore();
  const { data: restaurants, pending: isRestaurantsLoading } = useRemoteData(
    () => $client.restaurant.getRestaurants.query(),
    { default: [] },
  );
  const { data: lunchGroups, pending: isLunchGroupsLoading } = useRemoteData(
    () => $client.lunchGroup.getLunchGroups.query({ currentDayScope: true }),
    { default: [] },
  );
  const { data: lunchGroupPolls, pending: isLunchGroupPollsLoading } = useRemoteData(
    () => $client.lunchGroup.getLunchGroupPolls.query({ currentDayScope: true }),
    { default: [] },
  );
  const { data: users, pending: isUsersLoading } = useRemoteData(
    () => $client.user.getOrganizationUsers.query(),
    { default: [] },
  );

  const pendingOperation = ref<string | null>(null);

  onMounted(() => $client.user.setUserOnlineStatus.mutate({ online: true }));
  onUnmounted(() => $client.user.setUserOnlineStatus.mutate({ online: false }));

  $client.lunchGroup.groupCreated.subscribe(
    { authToken: userStore.accessToken!, organizationId: userStore.activeOrganizationId! },
    { onData: (newGroup) => lunchGroups.value.push(newGroup) },
  );

  $client.user.userOnlineStatusChanged.subscribe(
    { organizationId: userStore.activeOrganizationId!, userId: userStore.user!._id },
    {
      onData: ({ userId, online }) => {
        const user = users.value.find((u) => u._id === userId);
        if (user) user.isOnline = online;
      },
    },
  );

  $client.lunchGroup.userJoinedGroup.subscribe(
    { authToken: userStore.accessToken!, organizationId: userStore.activeOrganizationId! },
    {
      onData: ({ userId, groupId, userEntryId }) => {
        const group = lunchGroups.value.find((g) => g._id === groupId);
        const user = users.value.find((u) => u._id === userId);
        if (group && user)
          group.users.push({
            _id: userEntryId,
            userId: user._id,
            user,
            lunchGroupId: group._id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
      },
    },
  );

  $client.lunchGroup.userLeftGroup.subscribe(
    { authToken: userStore.accessToken!, organizationId: userStore.activeOrganizationId! },
    {
      onData: ({ userId, groupId }) => {
        const group = lunchGroups.value.find((g) => g._id === groupId);
        if (group) group.users = group.users.filter((u) => u.userId !== userId);
      },
    },
  );

  $client.lunchGroup.groupDeleted.subscribe(
    { authToken: userStore.accessToken!, organizationId: userStore.activeOrganizationId! },
    {
      onData: ({ groupId }) => {
        lunchGroups.value = lunchGroups.value.filter((g) => g._id !== groupId);
      },
    },
  );

  $client.lunchGroup.groupPollCreated.subscribe(
    { authToken: userStore.accessToken!, organizationId: userStore.activeOrganizationId! },
    {
      onData: (newPoll) => lunchGroupPolls.value.push(newPoll),
    },
  );

  $client.lunchGroup.userVotedToPoll.subscribe(
    { authToken: userStore.accessToken!, organizationId: userStore.activeOrganizationId! },
    {
      onData: ({ userId, pollId, restaurantId, entryId }) => {
        const poll = lunchGroupPolls.value.find((p) => p._id === pollId);
        const user = users.value.find((u) => u._id === userId)!;
        const restaurant = restaurants.value.find((r) => r._id === restaurantId)!;
        if (poll) {
          const entry = poll.pollEntries.find((e) => e._id === entryId);
          if (!entry) {
            poll.pollEntries.push({
              _id: entryId,
              lunchGroupPollId: pollId,
              userId,
              restaurantId,
              user: pick(user, ['_id', 'firstName', 'lastName']),
              restaurant: pick(restaurant, ['_id', 'name']),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          } else {
            entry.restaurantId = restaurantId;
            entry.restaurant = pick(restaurant, ['_id', 'name']);
            entry.updatedAt = new Date().toISOString();
          }
        }
      },
    },
  );

  $client.lunchGroup.groupPollEnded.subscribe(
    { authToken: userStore.accessToken!, organizationId: userStore.activeOrganizationId! },
    {
      onData: ({ pollId }) => (lunchGroupPolls.value = lunchGroupPolls.value.filter((p) => p._id !== pollId)),
    },
  );

  return {
    restaurants,
    isRestaurantsLoading,
    lunchGroups,
    isLunchGroupsLoading,
    lunchGroupPolls,
    isLunchGroupPollsLoading,
    users,
    isUsersLoading,
    pendingOperation,
  };
});

function useMapGateway() {
  const gateway = _useMapGateway();
  if (!gateway) throw new Error('No MapGateway provider present on parent scope');

  return gateway;
}

export { useProvideMapGateway, useMapGateway };
