import { z } from 'zod';
import { router } from '../trpc.js';
import { publicProcedure } from './publicProcedure.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortByTrustScore: z.enum(['asc', 'desc']).default('desc'),
});

export const influencerRouter = router({
  getAll: publicProcedure
    .input(paginationSchema)
    .query(async ({ input }) => {
      const { page, limit, sortByTrustScore } = input;
      const skip = (page - 1) * limit;

      const influencers = await prisma.influencer.findMany({
        skip,
        take: limit,
        orderBy: {
          trustScore: sortByTrustScore,
        },
      });

      return influencers;
    }),

  getProfile: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input }) => {
      const influencer = await prisma.influencer.findUnique({
        where: { id: input.id },
        include: {
          claims: true,
        },
      });

      if (!influencer) {
        throw new Error('Influencer not found');
      }

      const uniqueCategories = [...new Set(influencer.claims.map(claim => claim.category))];

      return {
        ...influencer,
        categories: uniqueCategories,
      };
    }),
});


