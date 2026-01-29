const express = require("express");
const path = require("path");
const auth = require("./modules/authentication");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// Middleware pour lire le JSON
app.use(express.json());

// --- NOUVEAUTÉ EXERCICE 2 : SERVIR LE FRONTEND ---
// Cette route envoie le fichier index.html quand on accède à l'URL racine
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Route d'authentification (Exo précédent)
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
      return res.status(500).json({ error: "Clé API manquante sur le serveur" });
    }

    // Initialisation Gemini
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    // Utilisation d'un modèle rapide et léger
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt || "Dis bonjour !");
    const response = await result.response;
    
    res.json({ 
      success: true,
      reply: response.text() 
    });
  } catch (error) {
    console.error("Erreur IA:", error);
    res.status(500).json({ success: false, error: "L'IA n'a pas pu répondre." });
  }
});

// Lancement du serveur
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
  });
}

module.exports = app;