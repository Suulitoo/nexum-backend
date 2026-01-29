// db.js (ou database.js) — Connexion pool MySQL avec mysql2/promise

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  // Variables Railway (priorité aux noms officiels injectés par le plugin MySQL)
  host: process.env.MYSQLHOST || process.env.MYSQL_HOST || '127.0.0.1',
  user: process.env.MYSQLUSER || process.env.MYSQL_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'nexum_shop',
  port: Number(process.env.MYSQLPORT || process.env.MYSQL_PORT || 3306),

  // Options recommandées pour une app Express / production
  waitForConnections: true,         // Attendre une connexion libre au lieu d'erreur immédiate
  connectionLimit: 10,              // 10 connexions max simultanées (suffisant pour petite app, augmente si besoin)
  maxIdle: 10,                      // Garder max 10 connexions idle
  idleTimeout: 30000,               // Fermer connexions idle après 30s (économie ressources)
  queueLimit: 0,                    // Pas de limite de file d'attente (ou 50 si tu veux limiter les requêtes en attente)
  connectTimeout: 15000,            // Timeout connexion 15s
  multipleStatements: true,         // Permet d'exécuter plusieurs requêtes dans une seule query (utile parfois)

  // Optionnel : debug si tu veux voir les requêtes SQL dans les logs
  // debug: ['ComQueryPacket', 'RowDataPacket']
});

// Test de connexion au démarrage (exécuté une fois au lancement du serveur)
(async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✔ Connecté à MySQL avec succès ! (pool prêt)');
    
    // Petit test optionnel : version MySQL
    const [rows] = await connection.query('SELECT VERSION() as version');
    console.log(`  └─ Version MySQL : ${rows[0].version}`);

  } catch (err) {
    console.error('✘ Erreur lors du test initial de connexion MySQL :');
    console.error('  → Message :', err.message);
    console.error('  → Code erreur :', err.code);
    console.error('  → Variables utilisées :', {
      host: process.env.MYSQLHOST || '(non défini)',
      user: process.env.MYSQLUSER || '(non défini)',
      database: process.env.MYSQLDATABASE || '(non défini)',
      port: process.env.MYSQLPORT || '(non défini)'
    });
    // NE PAS process.exit() ici → on garde le serveur vivant même si DB HS
  } finally {
    if (connection) connection.release();
  }
})();

// Gestion globale des erreurs de pool (très utile en prod)
pool.on('error', (err) => {
  console.error('Erreur dans le pool MySQL :', err.message);
  // Tu peux ici logger vers Discord ou Sentry si tu veux
});

module.exports = pool;