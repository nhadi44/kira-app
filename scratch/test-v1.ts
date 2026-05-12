import dotenv from "dotenv";

dotenv.config();

async function testDirectFetch() {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  console.log("Testing direct fetch to v1 endpoint...");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Say 'Direct Success' in 2 words." }] }]
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ v1 Endpoint works!", data.candidates[0].content.parts[0].text);
    } else {
      console.log("❌ v1 Endpoint FAILED.", JSON.stringify(data));
    }
  } catch (error: any) {
    console.error("Fetch error:", error.message);
  }
}

testDirectFetch();
