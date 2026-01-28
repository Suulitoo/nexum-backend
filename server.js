

console.log("Le script server.js commence à s'exécuter...");

// On utilise le module http de base de Node.js, qui est toujours présent
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Deploy works!');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

setTimeout(() => {
  console.log("Le serveur pur est toujours en vie après 10 secondes. Le problème n'est pas Node.js.");
}, 10000);