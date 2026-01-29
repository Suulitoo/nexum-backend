// server.js (remplace tout ton contenu actuel par ça pour tester)

const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;  // Railway injecte PORT, fallback 8080 pour test local

// Route de test simple
app.get('/', (req, res) => {
  res.send('Backend NEXUM est ALIVE sur Railway ! Port: ' + PORT + ' - ' + new Date().toISOString());
});

app.get('/health', (req, res) => {
  res.send('Health OK');
});

// IMPORTANT : écoute sur 0.0.0.0 et process.env.PORT
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur de test pur est en ligne sur le port ${PORT}`);
});

// Pour confirmer que ça tourne (optionnel)
console.log('Processus Node toujours vivant...');