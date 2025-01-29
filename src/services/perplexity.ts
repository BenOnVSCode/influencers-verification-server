import axios, { AxiosRequestConfig } from "axios";
import { checkClaimsWithJournalsPrompt, prompt }from "../LLM/prompt";
import { extractClaims } from "../utils/perplexity";




export const getClaimsByInfluencer = async (name:string, claimsMax:number, notes?:string) => {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if(!apiKey) throw new Error("PERPLEXITY_API_KEY is not set");
    const url = "https://api.perplexity.ai/chat/completions";
    const data = {
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: `Get claims that ${name} made on health get ${claimsMax} unique claims. ${notes}`,
        },
      ],
      model: "sonar-pro",
    };
  
    const config: AxiosRequestConfig = {
      method: "POST",
      url,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      data,
    };
    try {
      const response = await axios<ChatResponse>(config);
      const claimsText = response.data.choices[0]?.message.content;
      const claims = extractClaims(claimsText);
      return claims;
    } catch (error) {
      throw error;
    }
};

export const checkClaimsWithJournals = async (claims:string[], journals:string[]) => {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if(!apiKey) throw new Error("PERPLEXITY_API_KEY is not set");
    const url = "https://api.perplexity.ai/chat/completions";
    const data = {
      messages: [
        {
          role: "system",
          content: checkClaimsWithJournalsPrompt,
        },
        {
          role: "user",
          content: `Check the following claims with the following journals: Claims: ${claims.join("\n")} \n Journals: ${journals.join(",")}`,
        },
      ],
      model: "sonar-pro",
    };
    const config: AxiosRequestConfig = {
        method: "POST",
        url,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        data,
    };
    try {
        const response = await axios<ChatResponse>(config);
        const claims = response.data.choices[0]?.message.content;
        return claims;
    } catch (error) {
        throw error;
    }
}