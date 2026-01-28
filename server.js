

console.log("Le script server.js commence à s'exécuter...");

// On utilise le module http de base de Node.js, qui est toujours présent
const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Requête reçue pour: ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Backend is alive with pure Node.js!');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Serveur de test pur démarré et à l'écoute sur le port ${PORT}`);
});

setTimeout(() => {
  console.log("Le serveur pur est toujours en vie après 10 secondes. Le problème n'est pas Node.js.");
}, 10000);