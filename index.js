// server.js (remplace tout ton contenu actuel par ça pour tester)

const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// ← Ajoute ça ici
const db = require('./db');  // ou le nom exact de ton fichier DB

const app = express();

// ... tes middlewares, routes, static, etc.

const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
});

// Pour confirmer que ça tourne (optionnel)
console.log('Processus Node toujours vivant...');