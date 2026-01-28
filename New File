const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Backend is alive!');
});

app.get('/auth/discord', (req, res) => {
  res.send('Auth endpoint is alive!');
});

app.listen(PORT, () => {
  console.log(`Serveur de test démarré et à l'écoute sur le port ${PORT}`);
});