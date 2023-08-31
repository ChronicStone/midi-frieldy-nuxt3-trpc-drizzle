import { InferSelectModel } from 'drizzle-orm';
import { RouterOutput } from '@/server/trpc/router';

export type Restaurant = InferSelectModel<typeof restaurantsTable>;
export type RestaurantList = RouterOutput['restaurant']['getRestaurants'];
