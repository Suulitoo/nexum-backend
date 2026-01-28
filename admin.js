
const express = require("express");
const db = require("./db");
const axios = require("axios");

const router = express.Router();

router.use(express.json());

router.post("/admin/add-coins", async (req, res) => {
  const { rp_name, discord_id, coins } = req.body;

  if (!discord_id || !coins) {
    return res.status(400).send("Champs manquants");
  }

  try {
    // Ajouter les coins en base
    await db.promise().query(
      "UPDATE users SET coins = coins + ? WHERE discord_id = ?",
      [coins, discord_id]
    );

    // 🔴 IMPORTANT
    // Remplace IP_DU_SERVEUR par l'IP publique de ton serveur FiveM
    // OU commente ce bloc si ton serveur n'est pas encore accessible
    await axios.post(
      "http://IP_DU_SERVEUR:30120/nexum/addcoins",
      { discord_id, coins }
    );

    console.log(`Coins ajoutés : ${coins} pour ${discord_id}`);
    res.status(200).send("Coins ajoutés !");
  } catch (err) {
    console.error("Erreur ajout coins:", err);
    res.status(500).send("Erreur serveur");
  }
});

module.exports = router;



