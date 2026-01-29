/* eslint-disable no-console */
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error("❌ Erreur : GOOGLE_API_KEY est absente !");
    process.exit(1);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });    
    console.log("🤖 Envoi d'un message à Gemini...");
    const result = await model.generateContent("Réponds juste 'OK' si tu reçois ce message.");
    const response = await result.response;
    
    console.log("✅ Réponse reçue :", response.text());
  } catch (error) {
    console.error("❌ Échec de la connexion à l'IA :", error.message);
    process.exit(1);
  }
}

testGemini();