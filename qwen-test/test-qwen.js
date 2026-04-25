import dotenv from "dotenv";
dotenv.config({ path: "../.env.local" });
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL: process.env.QWEN_BASE_URL,
});

const response = await client.chat.completions.create({
    model: process.env.QWEN_MODEL,
    messages: [
        {
            role: "system",
            content:
                "You are a scam-prevention AI. Explain fraud risk clearly and calmly.",
        },
        {
            role: "user",
            content: JSON.stringify({
                riskScore1: 78,
                amount: 5000,
                userLimit: 1000,
                recipientTrust: "low",
                firstTimePayee: true,
            }),
        },
    ],
});

console.log(response.choices[0].message.content);