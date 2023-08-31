import { mapEvents } from '@/server/event';

export type MapGatewayApi = ReturnType<typeof useMapGateway>;
export type MapGatewayEvents = Parameters<typeof mapEvents.on>[0];
