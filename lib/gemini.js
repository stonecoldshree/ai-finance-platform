import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const models = [
"gemini-2.0-flash-lite",
"gemini-2.0-flash",
"gemini-2.5-flash"];

const usageState = globalThis.__gullakGeminiUsage || {
  dayKey: "",
  totalCount: 0,
  minuteWindowStart: Date.now(),
  minuteCount: 0
};

globalThis.__gullakGeminiUsage = usageState;

function refreshUsageWindows() {
  const now = new Date();
  const currentDayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  if (usageState.dayKey !== currentDayKey) {
    usageState.dayKey = currentDayKey;
    usageState.totalCount = 0;
  }

  const minuteAge = Date.now() - usageState.minuteWindowStart;
  if (minuteAge >= 60_000) {
    usageState.minuteWindowStart = Date.now();
    usageState.minuteCount = 0;
  }
}

function assertQuota(priority = "normal") {
  refreshUsageWindows();

  const dailyLimit = Number(process.env.GEMINI_DAILY_LIMIT || 250);
  const minuteLimit = Number(process.env.GEMINI_PER_MINUTE_LIMIT || 20);

  if (priority !== "high" && usageState.totalCount >= dailyLimit) {
    throw new Error("Gemini daily quota guard triggered");
  }

  if (priority !== "high" && usageState.minuteCount >= minuteLimit) {
    throw new Error("Gemini minute quota guard triggered");
  }
}

function recordUsage() {
  usageState.totalCount += 1;
  usageState.minuteCount += 1;
}


export async function generateAIContent(prompt, imagePart = null, options = {}) {
  const { priority = "normal" } = options;

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key missing");
  }

  assertQuota(priority);

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
      recordUsage();
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
