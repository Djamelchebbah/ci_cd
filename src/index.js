const express = require("express");
const path = require("path");
// On part du principe que le dossier 'modules' est dans 'src' avec ce fichier
const auth = require("./modules/authentication");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Middleware pour lire le JSON envoyé par le frontend
app.use(express.json());

// --- SERVIR LE FRONTEND ---
// On sert le fichier index.html qui doit se trouver dans le même dossier (src/)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route d'authentification (Exercice précédent)
app.get("/auth/:secret", (req, res) => {
  const { secret } = req.params;
  const response = auth(secret);
  res.status(response.status).send(response.message);
});

// --- ROUTE API POUR LE CHATBOT ---
app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({ error: "Clé API manquante sur le serveur (Variable d'environnement)" });
    }

    // Initialisation Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt || "Dis bonjour !");
    const response = await result.response;
    const text = response.text();
    
    res.json({ 
      success: true,
      reply: text 
    });
  } catch (error) {
    console.error("Erreur Gemini IA:", error);
    res.status(500).json({ success: false, error: "L'IA n'a pas pu répondre. Vérifiez la console." });
  }
});

// Lancement du serveur sur le port 3000
const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${port}`);
  });
}

module.exports = app;