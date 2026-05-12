import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function testModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTest = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro",
    "gemini-2.0-flash-exp",
    "gemini-pro"
  ];

  console.log("Starting model accessibility test...\n");

  for (const modelName of modelsToTest) {
    try {
      console.log(`Testing [${modelName}]...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say 'Success' in 1 word.");
      console.log(`✅ [${modelName}] is AVAILABLE. Response: ${result.response.text().trim()}`);
    } catch (error: any) {
      console.log(`❌ [${modelName}] FAILED. Error: ${error.message?.split("\n")[0]}`);
    }
    console.log("-----------------------------------");
  }
}

testModels();
