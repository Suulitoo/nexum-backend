
require('dotenv').config();
const express = require('express');
const db = require('./db');
const axios = require('axios');
const router = express.Router();

router.use(express.json());

// Récupérer les coins du joueur
router.get('/coins/:discord_id', (req, res) => {
  const discordId = req.params.discord_id;
  db.query('SELECT coins FROM users WHERE discord_id = ?', [discordId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur base de données' });
    if (results.length === 0) return res.json({ coins: 0 });
    res.json({ coins: results[0].coins });
  });
});

// Ajouter des coins après paiement PayPal
router.post('/add', (req, res) => {
  const { discord_id, amount } = req.body;
  if (!discord_id || !amount) return res.status(400).json({ error: 'Données manquantes' });

  db.query('UPDATE users SET coins = coins + ? WHERE discord_id = ?', [amount, discord_id], async err => {
    if (err) return res.status(500).json({ error: 'Erreur base de données' });

    // Envoyer les coins au serveur FiveM
    try {
      await axios.post('http://localhost:30120/addCoins', { discord_id, amount });
      console.log(`Coins ajoutés à ${discord_id} sur FiveM`);
    } catch (fivemErr) {
      console.error('Erreur envoi coins FiveM:', fivemErr.message);
    }

    res.json({ success: true, coinsAdded: amount });
  });
});

module.exports = router;


