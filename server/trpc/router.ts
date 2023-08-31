import { inferRouterOutputs } from '@trpc/server';
import { router } from './trpc';
import { authRouter } from './routers/auth.router';
import { invitationRouter } from './routers/invitation.router';
import { filteOptionsRouter } from './routers/filter.router';
import { organizationRouter } from './routers/organization.router';
import { restaurantRouter } from './routers/restaurant.router';
import { queueJobRouter } from './routers/queueJob.router';
import { lunchGroupRouter } from './routers/lunchGroup.router';
import { userRouter } from './routers/user.router';
import { chatRouter } from './routers/chat.router';

export const appRouter = router({
  auth: authRouter,
  invitation: invitationRouter,
  filterOptions: filteOptionsRouter,
  organization: organizationRouter,
  restaurant: restaurantRouter,
  lunchGroup: lunchGroupRouter,
  queueJob: queueJobRouter,
  chat: chatRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
