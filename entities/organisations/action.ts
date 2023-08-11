export async function createOrganization() {
  try {
    const { $formApi, $messageApi } = useNuxtApp();
    const { isCompleted, formData } = await $formApi.createForm(organizationFormSchema());

    if (!isCompleted) return false;

    // await OrganizationController.createOrganization(formData);

    $messageApi.success('Organization successfuly created!');
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}
