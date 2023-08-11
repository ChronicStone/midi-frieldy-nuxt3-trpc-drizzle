import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client';
import type { AppRouter } from '@/server/trpc/router';

export default defineNuxtPlugin(() => {
  const userStore = useUserStore();
  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        headers: () => {
          if (!userStore.accessToken) return {};
          else
            return {
              Authorization: `Bearer ${userStore.accessToken}`,
              organizationId: userStore.activeOrganizationId ?? '',
            };
        },
      }),
    ],
  });

  return {
    provide: {
      client,
    },
  };
});
