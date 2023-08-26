import { applyWSSHandler } from '@trpc/server/adapters/ws';
import WebSocket, { WebSocketServer as WSWebSocketServer } from 'ws';
import { consola } from 'consola';
import { appRouter } from '@/server/trpc/router';
import { createContext, Context } from '@/server/trpc/context';

export default defineNitroPlugin((nitro) => {
  consola.log('WS: NITRO RUN');
  const WebSocketServer = WebSocket.Server || WSWebSocketServer;
  const wss = new WebSocketServer({
    port: 3002,
  });

  const handler = applyWSSHandler({ wss, router: appRouter, createContext: () => ({}) as Context });

  wss.on('connection', (ws) => {
    consola.log(`➕➕ Connection (${wss.clients.size})`);
    ws.once('close', () => {
      consola.log(`➖➖ Connection (${wss.clients.size})`);
    });
  });

  consola.log('✅ WebSocket Server listening on ws://localhost:3002');

  nitro.hooks.hookOnce('close', () => {
    handler.broadcastReconnectNotification();
    wss.close();
  });
});
