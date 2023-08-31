import { createTRPCNuxtClient, httpBatchLink } from 'trpc-nuxt/client';
import { createWSClient, wsLink, splitLink } from '@trpc/client';
import type { AppRouter } from '@/server/trpc/router';

export default defineNuxtPlugin(async () => {
  const userStore = useUserStore();
  const clientId = generateUUID();

  const wsClient = createWSClient({
    url: `ws://localhost:3002?clientId=${clientId}`,
    WebSocket: process.server
      ? await import('ws').then((r) => r.default || r)
      : (globalThis.WebSocket as any),
    onClose() {
      if (userStore.accessToken) client.user.setUserOnlineStatus.mutate({ online: false });
    },
  });

  const client = createTRPCNuxtClient<AppRouter>({
    links: [
      splitLink({
        condition: (op) => op.type === 'subscription',
        true: wsLink({
          client: wsClient,
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

  useEventListener(
    'beforeunload',
    () => userStore.accessToken && client.user.setUserOnlineStatus.mutate({ online: false }),
  );
  useEventListener(
    'offline',
    () => userStore.accessToken && client.user.setUserOnlineStatus.mutate({ online: false }),
  );
  useEventListener(
    'online',
    () => userStore.accessToken && client.user.setUserOnlineStatus.mutate({ online: false }),
  );

  return {
    provide: {
      client,
    },
  };
});
