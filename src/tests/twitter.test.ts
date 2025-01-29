
import { getTwitterId, getUserTweets } from '../services/twitter';
import dotenv from 'dotenv';
dotenv.config();

// Use actual Twitter API responses

describe('Twitter Service', () => {
    it('should fetch Twitter ID for a given username', async () => {
        const username = '4BD_O';
        const twitterId = await getTwitterId(username);
        console.log(`Twitter ID for ${username}:`, twitterId);
        // No expectation since we are using real data
    });

    it('should fetch tweets for a given user ID', async () => {
        const userId = '12';
        const startTime = '2023-01-01T00:00:00Z';
        const endTime = '2023-01-31T23:59:59Z';
        const tweets = await getUserTweets(userId, startTime, endTime);
        console.log(`Tweets for user ID ${userId}:`, tweets);
        // No expectation since we are using real data
    });
});
