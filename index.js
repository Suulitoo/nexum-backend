
require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
// Remplace ta ligne app.listen actuelle par ça EXACTEMENT
const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend NEXUM démarré sur http://0.0.0.0:${PORT}`);
});

// ------------------------
// Middleware
// ------------------------
app.use(cors());
app.use(bodyParser.json());

// ------------------------
// MySQL
// ------------------------
const db = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

db.getConnection()
  .then(() => console.log('Connecté à MySQL'))
  .catch(err => console.error('Erreur MySQL:', err));

// ------------------------
// FRONTEND
// ------------------------
app.get('/health', (req, res) => {
  res.send('Backend NEXUM OK - ' + new Date().toISOString());
});
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'shop.html'));
});

// ------------------------
// OAuth Discord
// ------------------------
app.get('/auth/discord', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify'
  });

  res.redirect(`https://discord.com/api/oauth2/authorize?${params.toString()}`);
});

app.get('/auth/discord/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Code manquant');

  try {
    // 1. Token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI
      })
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      console.error(tokenData);
      return res.status(400).send('Token Discord invalide');
    }

    // 2. User Discord
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });

    const user = await userRes.json();

    const discordId = user.id;
    const username = user.username;
    const discriminator = user.discriminator;

    // 3. DB
    await db.query(
      `INSERT INTO users (discord_id, username, discriminator)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE username=?, discriminator=?`,
      [discordId, username, discriminator, username, discriminator]
    );

    // 4. Redirect frontend (⚠️ URL PROD)
    res.redirect(
      `https://TON-SITE-FRONTEND/shop.html?discord_id=${discordId}`
    );

  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur OAuth Discord');
  }
});

// ------------------------
// Paiement / commande
// ------------------------
app.post('/order', async (req, res) => {
  const { discord_id, username, discriminator, item, price } = req.body;
  if (!discord_id || !item || !price) {
    return res.status(400).send('Données manquantes');
  }

  try {
    await db.query(
      `INSERT INTO users (discord_id, username, discriminator)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE username=?, discriminator=?`,
      [discord_id, username, discriminator, username, discriminator]
    );

    const [rows] = await db.query(
      'SELECT id FROM users WHERE discord_id = ?',
      [discord_id]
    );

    await db.query(
      'INSERT INTO orders (user_id, item, price) VALUES (?, ?, ?)',
      [rows[0].id, item, price]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});






