import { applyWSSHandler } from '@trpc/server/adapters/ws';
import WebSocket, { WebSocketServer as WSWebSocketServer } from 'ws';
import { consola } from 'consola';
import { eq } from 'drizzle-orm';
import { appRouter } from '@/server/trpc/router';
import { Context } from '@/server/trpc/context';
import { db } from '@/db';
import { userOrganizationsTable } from '@/db/schema';
import { mapEvents } from '@/server/event';

export default defineNitroPlugin((nitro) => {
  const storage = useStorage('db');
  const WebSocketServer = WebSocket.Server || WSWebSocketServer;
  const wss = new WebSocketServer({
    port: 3002,
  });

  const handler = applyWSSHandler({
    wss,
    router: appRouter,
    createContext: ({ req }) => {
      const params = new URLSearchParams(req.url?.split('?')[1]);
      return {
        db,
        wsClientId: params.get('clientId'),
      } as Context;
    },
  });

  wss.on('connection', (ws, req) => {
    const params = new URLSearchParams(req.url?.split('?')[1]);
    const clientId = params.get('clientId');
    consola.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once('close', async () => {
      const userId = await storage.getItem<string>(`ws:${clientId}`);
      if (userId) {
        consola.log('DISCONNECTION - SETTING OFFLINE', userId);
        const userOrganizations = await db.query.userOrganizationsTable.findMany({
          where: (t, { eq, and }) => and(eq(t.userId, userId), eq(t.online, true)),
        });

        for (const access of userOrganizations) {
          await db
            .update(userOrganizationsTable)
            .set({ online: false })
            .where(eq(userOrganizationsTable._id, access._id));
          mapEvents.emit('userOnlineStatusChanged', {
            userId,
            organizationId: access.organizationId,
            online: false,
          });
        }
      }

      consola.log(`➖➖ Connection (${wss.clients.size})`);
    });
  });

  consola.log('✅ WebSocket Server listening on ws://localhost:3002');

  nitro.hooks.hookOnce('close', () => {
    handler.broadcastReconnectNotification();
    wss.close();
  });
});
