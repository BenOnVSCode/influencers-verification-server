import { z } from 'zod';
import { router } from '../trpc.js';
import { publicProcedure } from './publicProcedure.js';
import { PrismaClient, VerificationStatus } from '@prisma/client';

const prisma = new PrismaClient();

const claimSchema = z.object({
  claim_text: z.string(),
  category: z.string(),
  confidence_score: z.number().min(0).max(100),
  verification_status: z.enum(['Verified', 'Questionable', 'Debunked']),
  reasoning: z.string(),
});

const savingSchema = z.object({
  author: z.string(),
  claims: z.array(claimSchema),
});

const getMostFrequentCategory = (categories: string[]): string => {
  const frequency: Record<string, number> = {};
  let maxCount = 0;
  let mostFrequent = categories[0];

  categories.forEach(category => {
    frequency[category] = (frequency[category] || 0) + 1;
    if (frequency[category] > maxCount) {
      maxCount = frequency[category];
      mostFrequent = category;
    }
  });

  return mostFrequent;
};

const calculateAverageScore = (scores: number[]): number => {
  return scores.reduce((acc, score) => acc + score, 0) / scores.length;
};

export const claimRouter = router({
  saveClaims: publicProcedure
    .input(savingSchema)
    .mutation(async ({ input }) => {
      const { author, claims } = input;

      // Find existing influencer
      let influencer = await prisma.influencer.findFirst({
        where: { name: author },
        include: { claims: true },
      });

      const newClaimScores = claims.map(c => c.confidence_score);
      const newClaimCategories = claims.map(c => c.category);

      if (influencer) {
        // Calculate new trust score with all claims
        const allScores = [...influencer.claims.map(c => c.confidence_score), ...newClaimScores];
        const newTrustScore = calculateAverageScore(allScores);
        
        // Determine trend
        const trend = newTrustScore > influencer.trustScore;

        // Calculate most frequent category including all claims
        const allCategories = [
          ...influencer.claims.map(c => c.category),
          ...newClaimCategories
        ];
        const dominantCategory = getMostFrequentCategory(allCategories);

        // Update influencer
        influencer = await prisma.influencer.update({
          where: { id: influencer.id },
          data: {
            category: dominantCategory,
            trustScore: newTrustScore,
            trend,
          },
          include: { claims: true },
        });
      } else {
        // Create new influencer
        const initialTrustScore = calculateAverageScore(newClaimScores);
        const initialCategory = getMostFrequentCategory(newClaimCategories);

        influencer = await prisma.influencer.create({
          data: {
            name: author,
            twitter_handle: '', // Empty as specified
            category: initialCategory,
            trustScore: initialTrustScore,
            trend: true, // First time is always trending
          },
          include: { claims: true },
        });
      }

      // Save all claims
      const savedClaims = await Promise.all(
        claims.map(claim =>
          prisma.claim.create({
            data: {
              text: claim.claim_text,
              category: claim.category,
              confidence_score: claim.confidence_score,
              verification_status: claim.verification_status as VerificationStatus,
              reasoning: claim.reasoning,
              date_range: new Date().toISOString(),
              author: {
                connect: { id: influencer!.id }
              }
            },
          }) 
        )
      );

      return {
        influencer,
        claims: savedClaims,
      };
    }),
});
