const http = require('http');

const server = http.createServer((req, res) => {
  console.log(`Requête reçue pour: ${req.url}`);
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Deploy works!'); // On simplifie le message pour être sûr
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Serveur de test pur est en ligne sur le port ${PORT}`);
});