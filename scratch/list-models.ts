import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set");
    return;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  try {
    const models = await genAI.listModels();
    console.log("Available Models:");
    models.models.forEach(m => {
      console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods})`);
    });
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
