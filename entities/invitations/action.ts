import { TRPCClientError } from '@trpc/client';

export async function createUserInvitation() {
  try {
    const { $formApi, $messageApi, $client } = useNuxtApp();
    const { isCompleted, formData } = await $formApi.createForm(invitationFormSchema());

    if (!isCompleted) return false;

    if (formData.type === 'link') {
      const link = await $client.invitation.createInvitationLink.mutate({
        type: 'link',
        organizationId: formData.organizationId,
        targetApp: 'client',
        expireAt: formData.expireAt,
        maxUsage: formData?.maxUsage ?? 1,
      });
      navigator.clipboard.writeText(link);
      $messageApi.success('Invitation link copied to clipboard!');
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
