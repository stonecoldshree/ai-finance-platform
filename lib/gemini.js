import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const DEFAULT_MODEL_FALLBACKS = [
"gemini-2.5-flash",
"gemini-2.5-flash-lite"];

const models = (process.env.GEMINI_MODEL_FALLBACKS || DEFAULT_MODEL_FALLBACKS.join(","))
.split(",")
.map((value) => value.trim())
.filter(Boolean);

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

function buildContents(prompt, imagePart) {
  if (!imagePart) {
    return String(prompt || "");
  }

  const normalizedImagePart = imagePart?.inlineData ? { inlineData: imagePart.inlineData } : imagePart;

  return [
  {
    role: "user",
    parts: [normalizedImagePart, { text: String(prompt || "") }]
  }];
}

function extractTextFromResponse(response) {
  if (!response) return "";

  if (typeof response.text === "string") {
    return response.text;
  }

  if (typeof response.text === "function") {
    const textFromMethod = response.text();
    if (typeof textFromMethod === "string") {
      return textFromMethod;
    }
  }

  const fallbackText = response?.candidates?.[0]?.content?.parts?.find(
    (part) => typeof part?.text === "string"
  )?.text;

  return typeof fallbackText === "string" ? fallbackText : "";
}


export async function generateAIContent(prompt, imagePart = null, options = {}) {
  const { priority = "normal" } = options;

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini API key missing");
  }

  if (!models.length) {
    throw new Error("No Gemini models configured. Set GEMINI_MODEL_FALLBACKS.");
  }

  assertQuota(priority);

  for (const modelName of models) {
    try {
      const result = await genAI.models.generateContent({
        model: modelName,
        contents: buildContents(prompt, imagePart)
      });

      const text = extractTextFromResponse(result);
      if (!text) {
        throw new Error("Model returned an empty response");
      }

      recordUsage();
      return text;
    } catch (error) {
      console.log(`Model ${modelName} failed:`, error.message);

      const status = Number(error?.status || error?.code);
      if (
      status === 429 ||
      status === 404 ||
      status === 503 ||
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
