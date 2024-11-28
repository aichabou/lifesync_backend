const {
    addReminder,
    listRemindersByUser,
    modifyReminder,
    removeReminder,
} = require('../../application/services/ReminderService');
const pool = require('../../infrastructure/config/db');

// Créer un rappel
const createReminderHandler = async (req, res) => {
    try {
        const { userid, content, datetime } = req.body;

        if (!userid || !content || !datetime) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });
        }

        const query = `
            INSERT INTO "Reminder" (userid, content, datetime)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
        const values = [userid, content, datetime];
        const result = await pool.query(query, values);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erreur dans createReminderHandler :', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Récupérer tous les rappels d'un utilisateur
const getRemindersHandler = async (req, res) => {
    try {
        const { userid } = req.params;

        if (!userid) {
            return res.status(400).json({ error: "L'ID utilisateur est requis." });
        }

        const query = `SELECT * FROM "Reminder" WHERE userid = $1 ORDER BY datetime ASC;`;
        const result = await pool.query(query, [userid]);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erreur dans getRemindersHandler :', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Modifier un rappel
const updateReminderHandler = async (req, res) => {
    try {
        const { reminderid } = req.params;
        const { content, datetime } = req.body;

        if (!content || !datetime) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });
        }

        const query = `
            UPDATE "Reminder"
            SET content = $1, datetime = $2
            WHERE reminderid = $3
            RETURNING *;
        `;
        const values = [content, datetime, reminderid];
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Rappel non trouvé." });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erreur dans updateReminderHandler :', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Supprimer un rappel
const deleteReminderHandler = async (req, res) => {
    try {
        const { reminderid } = req.params;

        const query = `DELETE FROM "Reminder" WHERE reminderid = $1 RETURNING *;`;
        const result = await pool.query(query, [reminderid]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Rappel non trouvé." });
        }

        res.status(204).send();
    } catch (err) {
        console.error('Erreur dans deleteReminderHandler :', err.message);
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    createReminderHandler,
    getRemindersHandler,
    updateReminderHandler,
    deleteReminderHandler,
};
