import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const models = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro-002",
];

export async function generateAIContent(prompt, imagePart = null) {
    for (const modelName of models) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });

            let result;
            if (imagePart) {
                result = await model.generateContent([imagePart, prompt]);
            } else {
                result = await model.generateContent(prompt);
            }

            const response = await result.response;
            const text = response.text();
            return text;
        } catch (error) {
            console.log(`Model ${modelName} failed:`, error.message);
            if (
                error.message?.includes("429") ||
                error.message?.includes("quota") ||
                error.message?.includes("404") ||
                error.message?.includes("not found") ||
                error.message?.includes("503")
            ) {
                continue;
            }
            // If we are desperate, continue even on other errors
            continue;
        }
    }
    throw new Error("All Gemini models failed to generate content.");
}
