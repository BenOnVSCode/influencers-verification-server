import { initTRPC } from '@trpc/server';
import { createContext } from './context';
import { searchProcedure } from './procedures/search';
import { router } from './trpc';
import { influencerRouter } from './procedures/influencers';
import { claimRouter } from './procedures/claims';


// Initialize tRPC with context
export const t = initTRPC.context<typeof createContext>().create();


// Create the router and include the search procedure
export const appRouter = router({
  search: searchProcedure, // Use the searchProcedure here
  influencer: influencerRouter,
  claim: claimRouter,
});

export type AppRouter = typeof appRouter;
