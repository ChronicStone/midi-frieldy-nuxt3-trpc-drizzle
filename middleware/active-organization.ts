export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore();
  if (!userStore.activeOrganization) return navigateTo('/map/select-organization');
});
