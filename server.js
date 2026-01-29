// server.js - Version minimale pour tester Railway (2026)

const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;  // Railway injecte PORT automatiquement

// Route racine de test (pour vérifier que ça répond)
app.get('/', (req, res) => {
  res.send(`Backend NEXUM est ALIVE sur Railway !<br>Port: ${PORT}<br>Heure: ${new Date().toISOString()}`);
});

// Route health (pour debug)
app.get('/health', (req, res) => {
  res.send('Health OK - Serveur tourne sur port ' + PORT);
});

// IMPORTANT : Écoute sur 0.0.0.0 + process.env.PORT
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur de test pur est en ligne sur le port ${PORT}`);
  console.log(`URL de test : http://0.0.0.0:${PORT}`);
  console.log('Processus toujours vivant... (ne pas s\'arrêter !)');
});

// Log supplémentaire pour confirmer que ça passe ici
console.log('Fin du script - si tu vois ça sans crash, c\'est bon');