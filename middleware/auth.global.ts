import JwtDecode from 'jwt-decode';

export default defineNuxtRouteMiddleware((to) => {
  const authEnabled = !!(to?.meta?.auth ?? to.path.startsWith('/admin'));
  if (!authEnabled) return;

  const userStore = useUserStore();
  if (!userStore.user) return navigateTo('/auth/login');

  const decodedToken = JwtDecode<{ exp: number }>(userStore.accessToken as string);

  if (decodedToken?.exp < Date.now() / 1000) {
    userStore.clearUserSession();
    if (userStore.rememberMe) return navigateTo(`/auth/login${to?.path && `?redirect=${to.path}`}`);
    else return navigateTo(`/auth/login${to?.path && `?redirect=${to.path}`}`);
  }
});
