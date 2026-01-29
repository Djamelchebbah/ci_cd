# Utilise une image Node stable
FROM node:18-slim

# Définit le dossier de travail
WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

# On installe les dépendances de production EN IGNORANT les scripts (comme husky)
RUN npm install --omit=dev --ignore-scripts

# Copie le reste du code
COPY . .

# Expose le port de l'application
EXPOSE 3000

# Commande de lancement
CMD ["npm", "start"]