const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  console.log("Requête reçue pour /");
  res.send('Backend is alive!');
});

app.get('/auth/discord', (req, res) => {
  console.log("Requête reçue pour /auth/discord");
  res.send('Auth endpoint is alive!');
});

const server = app.listen(PORT, () => {
  console.log(`Serveur de test démarré et à l'écoute sur le port ${PORT}`);
});

// Ce timer va nous dire si le serveur est encore vivant après 10 secondes
setTimeout(() => {
  console.log("Le serveur est toujours en vie après 10 secondes. C'est une bonne signe !");
}, 10000);