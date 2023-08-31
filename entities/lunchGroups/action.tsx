import { TRPCClientError } from '@trpc/client';
import { MapGatewayApi } from '@/types/system/gateway';
import { LunchGroupListItem } from '@/types/lunchGroup';

export async function createLunchGroup(restaurantId: string, setDrawerState: (state: boolean) => void) {
  const { $formApi, $client } = useNuxtApp();
  const loadingNotif = useActionNotification('Création du groupe...');
  try {
    setDrawerState(false);
    const { formData, isCompleted } = await $formApi.createForm(lunchGroupFormSchema());
    setDrawerState(true);

    if (!isCompleted) return false;

    loadingNotif.open();
    await $client.lunchGroup.createGroup.mutate({ ...formData, restaurantId });
    loadingNotif.setSuccess('Groupe créé !');
  } catch (err) {
    if (!(err instanceof TRPCClientError)) loadingNotif.setError('Une erreur est survenue');
    else loadingNotif.setError(err.message ?? 'Une erreur est survenue');
    return false;
  }
}

export async function joinLunchGroup(gatewayApi: MapGatewayApi, lunchGroup: LunchGroupListItem) {
  const { $client } = useNuxtApp();
  const userStore = useUserStore();
  const loadingNotif = useActionNotification('Ajout au groupe...');
  try {
    const existingGroup = gatewayApi?.lunchGroups.value.find(
      (group) =>
        group.users.some((user) => user.userId === userStore.user?._id) &&
        group.restaurant._id === lunchGroup.restaurant._id,
    );

    if (existingGroup) {
      const proceed = await usePromiseConfirm({
        type: 'warning',
        title: 'Quitter le groupe existant',
        content: () => (
          <div class="flex flex-col gap-2">
            <span>
              Vous êtes déjà dans un groupe pour ce restaurant, prévu à
              {formatTimeFromTimestamp(existingGroup.meetingTime)}. Voulez-vous quitter ce groupe pour
              rejoindre celui-ci ?
            </span>
            {existingGroup.owner._id === userStore.user?._id && (
              <span class="text-red-500">
                Vous êtes le propriétaire du groupe existant, si vous quittez ce groupe, il sera supprimé.
              </span>
            )}
          </div>
        ),
      });
      if (!proceed) return false;

      loadingNotif.open();
      if (existingGroup.owner._id === userStore.user?._id)
        await $client.lunchGroup.deleteGroup.mutate({ lunchGroupId: existingGroup._id });
      else await $client.lunchGroup.leaveGroup.mutate({ lunchGroupId: existingGroup._id });
    } else loadingNotif.open();

    await $client.lunchGroup.joinGroup.mutate({ lunchGroupId: lunchGroup._id });
    loadingNotif.setSuccess('Groupe rejoint');
    return true;
  } catch (err) {
    if (!(err instanceof TRPCClientError)) loadingNotif.setError('Une erreur est survenue');
    else loadingNotif.setError(err.message ?? 'Une erreur est survenue');
    return false;
  }
}

export async function leaveLunchGroup(lunchGroupId: string, setDrawerVisibility: (val: boolean) => void) {
  const { $client } = useNuxtApp();
  const loadingNotif = useActionNotification('Sortie du groupe...');
  try {
    const proceed = await usePromiseConfirm({
      type: 'warning',
      title: 'Quitter le groupe',
      content: 'Êtes-vous sûr de vouloir quitter ce groupe ?',
    });
    if (!proceed) return false;

    setDrawerVisibility(false);
    loadingNotif.open();
    await $client.lunchGroup.leaveGroup.mutate({ lunchGroupId });
    loadingNotif.setSuccess('Groupe quitté');
    return true;
  } catch (err) {
    if (!(err instanceof TRPCClientError)) loadingNotif.setError('Une erreur est survenue');
    else loadingNotif.setError(err.message ?? 'Une erreur est survenue');
    return false;
  }
}

export async function deleteLunchGroup(lunchGroupId: string, setDrawerVisibility: (val: boolean) => void) {
  const { $client } = useNuxtApp();
  const loadingNotif = useActionNotification('Suppression du groupe...');

  try {
    const proceed = await usePromiseConfirm({
      type: 'error',
      title: 'Supprimer le groupe',
      content: 'Êtes-vous sûr de vouloir supprimer ce groupe ?',
    });
    if (!proceed) return false;

    setDrawerVisibility(false);
    loadingNotif.open();
    await $client.lunchGroup.deleteGroup.mutate({ lunchGroupId });
    loadingNotif.setSuccess('Groupe supprimé');
    return true;
  } catch (err) {
    if (!(err instanceof TRPCClientError)) loadingNotif.setError('Une erreur est survenue');
    else loadingNotif.setError(err.message ?? 'Une erreur est survenue');
    return false;
  }
}

export async function createLunchGroupPoll(setDrawerVisibility: (val: boolean) => void) {
  const { $formApi, $client } = useNuxtApp();
  const loadingNotif = useActionNotification('Création du sondage...');
  try {
    setDrawerVisibility(false);
    const { formData, isCompleted } = await $formApi.createForm(lunchGroupPollFormSchema());
    setDrawerVisibility(true);
    if (!isCompleted) return false;

    loadingNotif.open();
    await $client.lunchGroup.createLunchGroupPoll.mutate(formData);
    loadingNotif.setSuccess('Sondage créé !');
  } catch (err) {
    if (!(err instanceof TRPCClientError)) loadingNotif.setError('Une erreur est survenue');
    else loadingNotif.setError(err.message ?? 'Une erreur est survenue');
    return false;
  }
}

export async function setPollUserVote(
  payload: {
    groupId: string;
    voteOptions: Array<{ label: string; value: string }>;
    userCurrentVote: string | null;
  },
  setDrawerVisibility: (value: boolean) => void,
) {
  const { $client, $formApi } = useNuxtApp();
  const loadingNotif = useActionNotification('Enregistrement du vote en cours...');
  try {
    setDrawerVisibility(false);
    const { formData, isCompleted } = await $formApi.createForm(
      lunchGroupPollVoteFormSchema(payload.voteOptions),
      payload.userCurrentVote ? { restaurant: payload.userCurrentVote } : {},
    );
    setDrawerVisibility(true);
    if (!isCompleted) return false;

    loadingNotif.open();
    await $client.lunchGroup.setGroupPollUserVote.mutate({
      restaurantId: formData.restaurant,
      pollId: payload.groupId,
    });
    loadingNotif.setSuccess('Vote enregistré !');
  } catch (err) {
    if (!(err instanceof TRPCClientError)) loadingNotif.setError('Une erreur est survenue');
    else loadingNotif.setError(err.message ?? 'Une erreur est survenue');
    return false;
  }
}
