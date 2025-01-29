import { z } from "zod";
import { getClaimsByInfluencer, checkClaimsWithJournals } from "../../services/perplexity.js";
import { publicProcedure } from './publicProcedure.js';
import { parseClaims } from "../../utils/perplexity.js";

export const searchProcedure = publicProcedure
    .input(
        z.object({
            influencerName: z.string(),
            claimsMax: z.number(),
            notes: z.string().optional(),
            journals: z.array(z.string()),
        })
    )
    .query(async ({ input }) => {
        try {
            // 1. Get all claims
            const claims = await getClaimsByInfluencer(input.influencerName, input.claimsMax, input.notes);

            // 2. Process claims in batches of 10 and send all requests at once
            const batchPromises = [];

            for (let i = 0; i < claims.length; i += 10) {
                const claimsBatch = claims.slice(i, i + 10);
                // Push each batch processing promise into the array
                batchPromises.push(checkClaimsWithJournals(claimsBatch, input.journals));
            }

            // Wait for all promises to settle, no matter the outcome
            const results = await Promise.allSettled(batchPromises);

            // Filter out the successful results and handle errors separately
            const analyzedClaimsBatches = results
                .map((result) => {
                    if (result.status === 'fulfilled') {
                        return result.value; // Only collect successful results
                    } else {
                        console.error('Request failed:', result.reason);
                        return null; // or handle failure gracefully (e.g., return empty array, null, etc.)
                    }
                })
                .filter((batch) => batch !== null); // Remove failed batches

            const finalClaims = parseClaims(analyzedClaimsBatches);

            return {
                success: true,
                data: {
                    author: input.influencerName,
                    claims,
                    analyzedClaims: finalClaims,
                },
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    });
