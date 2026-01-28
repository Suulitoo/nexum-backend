const express = require('express');
const axios = require('axios');
const db = require('./db');
const router = express.Router();

// Étape 1 : redirection vers Discord
router.get('/discord', (req, res) => {
  const redirectUri = encodeURIComponent(process.env.DISCORD_REDIRECT_URI);
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=identify`;
  res.redirect(redirectUrl);
});

// Étape 2 : callback Discord après autorisation
router.get('/discord/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send('Code manquant dans l\'URL');

  try {
    // Échanger le code contre un access token
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI,
      scope: 'identify'
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = tokenResponse.data.access_token;

    // Obtenir les infos de l'utilisateur Discord
    const userResponse = await axios.get('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const discordId = userResponse.data.id;
    const username = userResponse.data.username;

    // Ajouter ou mettre à jour l'utilisateur dans la base de données MySQL
    db.query(
      'INSERT INTO users (discord_id, username) VALUES (?, ?) ON DUPLICATE KEY UPDATE username=?',
      [discordId, username, username],
      (err) => { // Utiliser une callback classique pour gérer les erreurs
        if (err) {
          console.error('Erreur lors de l\'enregistrement en base de données:', err);
          return res.status(500).send('Erreur base de données');
        }

        // Si tout s'est bien passé, rediriger vers la boutique avec l'ID Discord
        console.log(`Utilisateur ${username} (${discordId}) connecté et redirigé.`);
        res.redirect(`https://suulitoo.github.io/Coinsnexum-clean/shop.html?discord_id=${discordId}`);
      }
    );

  } catch (err) {
    console.error('Erreur OAuth Discord:', err.message);
    res.status(500).send('Erreur lors de l\'authentification avec Discord');
  }
});

module.exports = router;