const express = require("express");
const auth = require("./modules/authentication");
// 1. Importation du SDK Google Generative AI
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Middleware indispensable pour lire le JSON dans les requêtes POST
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/auth/:secret", (req, res) => {
  const { secret } = req.params;
  const response = auth(secret);
  res.status(response.status).send(response.message);
});

// 2. Nouvelle route pour l'IA Gemini
app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({ error: "Clé API manquante dans les variables CI/CD" });
    }

    // Initialisation de l'IA
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-lite" });

    const result = await model.generateContent(prompt || "Dis-moi quelque chose d'intéressant sur l'IA.");
    const response = await result.response;
    
    res.json({ 
      success: true,
      reply: response.text() 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening on http://localhost:${port}`);
  });
}

module.exports = app;