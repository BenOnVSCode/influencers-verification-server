import { initTRPC } from '@trpc/server';
import { createContext } from './context.js';
import { searchProcedure } from './procedures/search.js';
import { router } from './trpc.js';
import { influencerRouter } from './procedures/influencers.js';
import { claimRouter } from './procedures/claims.js';


// Initialize tRPC with context
export const t = initTRPC.context<typeof createContext>().create();


// Create the router and include the search procedure
export const appRouter = router({
  search: searchProcedure, // Use the searchProcedure here
  influencer: influencerRouter,
  claim: claimRouter,
});

export type AppRouter = typeof appRouter;
