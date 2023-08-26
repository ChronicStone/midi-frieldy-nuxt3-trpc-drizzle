import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client';
import { createWSClient, wsLink, splitLink } from '@trpc/client';
import type { AppRouter } from '@/server/trpc/router';

export default defineNuxtPlugin(async () => {
  const userStore = useUserStore();
  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      splitLink({
        condition: (op) => op.type === 'subscription',
        true: wsLink({
          client: createWSClient({
            url: `ws://localhost:3002`,
            WebSocket: process.server
              ? await import('ws').then((r) => r.default || r)
              : (globalThis.WebSocket as any),
          }),
        }),
        false: httpBatchLink({
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
      }),
    ],
  });

  return {
    provide: {
      client,
    },
  };
});
