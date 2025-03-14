import OpenAI from "openai";
import { env } from '$env/dynamic/private';
import dotenv from 'dotenv';

dotenv.config();



const client = new OpenAI(
  {apiKey: env.OPENAI_API_KEY
});

export async function generateThreadTitle(userPrompt: string, AIResponse: string) {

  const prompt = `Generate a simple and very short title for the discussion thread between user and AI.
  Don't use quotes or other special characters. The title should be a simple phrase or sentence that captures the essence of the conversation.
  This is the  user prompt and ai response:\n\nUser: ${userPrompt}\nAI: ${AIResponse}\nUser:`;

    const response = await client.responses.create({
        model: "gpt-4o-mini",
        input: prompt,
    });

    return response.output_text;
}
