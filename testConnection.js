const pool = require('./src/infrastructure/config/db');

(async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connexion réussie à PostgreSQL, heure actuelle :', res.rows[0]);
    } catch (err) {
        console.error('Erreur de connexion :', err);
    } finally {
        pool.end();
    }
})();
