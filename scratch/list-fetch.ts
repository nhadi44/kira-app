import dotenv from "dotenv";
dotenv.config();

async function listModelsFetch() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("Models available for this key:");
    if (data.models) {
      data.models.forEach((m: any) => console.log(`- ${m.name}`));
    } else {
      console.log("No models found or error:", JSON.stringify(data));
    }
  } catch (e: any) {
    console.error("Fetch error:", e.message);
  }
}

listModelsFetch();
