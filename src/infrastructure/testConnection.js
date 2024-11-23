const pool = require('./src/infrastructure/config/db'); // Assurez-vous que le chemin vers db.js est correct

(async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connexion réussie, heure actuelle :', res.rows[0]);
    } catch (err) {
        console.error('Erreur lors de la connexion à la base de données :', err);
    } finally {
        pool.end(); // Ferme la connexion au pool
    }
})();
