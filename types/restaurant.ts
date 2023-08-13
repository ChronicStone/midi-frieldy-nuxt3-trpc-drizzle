import { InferModel } from 'drizzle-orm';
import { RouterOutput } from '@/server/trpc/router';

export type Restaurant = InferModel<typeof restaurantsTable>;
export type RestaurantList = RouterOutput['restaurant']['getRestaurants'];
