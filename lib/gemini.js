import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const models = [
"gemini-2.0-flash",
"gemini-2.0-flash-lite",
"gemini-2.5-flash",
"gemini-2.5-pro"];


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
      error.message?.includes("503"))
      {
        continue;
      }

      continue;
    }
  }
  throw new Error("All Gemini models failed to generate content.");
}
