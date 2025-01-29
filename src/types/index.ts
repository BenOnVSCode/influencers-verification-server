interface TwitterUserResponse {
    data: {
        id: string;
        name: string;
        username: string;
    }
}

interface DateRange {
    from: string,
    to: string,
}

interface TwitterTweetsResponse {
    data: { 
        tweets: [
            {
                author_id: string,
                created_at: string,
                id: string,
                text: string,
                username: string
            }
        ]
    }
}

type Message = {
    role: "user" | "assistant" | "system";
    content: string;
};
  
interface ChatRequest {
    messages: Message[];
    model: string;
};

interface ChatResponse {
    choices: {
      message: {
        role: string;
        content: string;
      };
    }[];
};