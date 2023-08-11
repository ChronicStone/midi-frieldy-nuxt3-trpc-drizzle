export async function createOrganization() {
  try {
    const { $formApi, $messageApi, $client } = useNuxtApp();
    const { isCompleted, formData } = await $formApi.createForm(organizationFormSchema());

    if (!isCompleted) return false;

    await $client.organization.createOrganization.mutate(formData);
    $messageApi.success('Organization successfuly created!');
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
