import { TRPCError, initTRPC } from '@trpc/server';
import { Context } from './context';
import { appRouter } from './router';

export type RouterMeta = {
  auth?: boolean;
  access?: Array<'admin' | 'organization-admin' | 'client'>;
};

const t = initTRPC.context<Context>().meta<RouterMeta>().create();

const authMiddleware = t.middleware(({ ctx, next }) => {
  // if (!ctx.user) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx });
});

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(authMiddleware);
export const router = t.router;
export const middleware = t.middleware;
export const getCaller = (ctx: Context) => appRouter.createCaller(ctx);
