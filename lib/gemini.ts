import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  // Available models for your tier:
  // - "gemini-2.0-flash" (Recommended: 4M TPM)
  // - "gemini-2.5-pro"   (High Quality: 2M TPM)
  // - "gemini-2.5-flash" (Standard: 1M TPM)
  model: "gemini-2.5-pro",
  generationConfig: {
    temperature: 0.1,
    responseMimeType: "application/json",
  },
});
