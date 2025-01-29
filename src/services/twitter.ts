import axios, { AxiosResponse} from "axios";

export const getTwitterId = async (username: string) => {
    try {
        const response: AxiosResponse<TwitterUserResponse> = await axios.get(
            `https://api.twitter.com/2/users/by/username/${username}`,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
                }
            }
        );
        return response.data.data.id;
    } catch (error) {
        throw error;
    }
}


export const getUserTweets = async (userId: string, startTime: string, endTime: string) => {
    try {
        const response: AxiosResponse<TwitterTweetsResponse> = await axios.get(
            `https://api.x.com/2/users/${userId}/tweets`,
            {
                params: { start_time: startTime, end_time: endTime },
                headers: {
                    'Authorization': `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};