const pool = require('../../infrastructure/config/db');

// Ajouter un rappel
const createReminder = async (reminderData) => {
    const query = `
        INSERT INTO "Reminder" (userid, content, datetime)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [reminderData.userid, reminderData.content, reminderData.datetime];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Récupérer les rappels par utilisateur
const getRemindersByuserid = async (userid) => {
    const query = `SELECT * FROM "Reminder" WHERE userid = $1 ORDER BY datetime ASC;`;
    const result = await pool.query(query, [userid]);
    return result.rows;
};

// Mettre à jour un rappel
const updateReminder = async (reminderid, updatedData) => {
    const query = `
        UPDATE "Reminder"
        SET content = $1, datetime = $2
        WHERE reminderid = $3
        RETURNING *;
    `;
    const values = [updatedData.content, updatedData.datetime, reminderid];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Supprimer un rappel
const deleteReminder = async (reminderid) => {
    const query = `DELETE FROM "Reminder" WHERE reminderid = $1;`;
    await pool.query(query, [reminderid]);
};

module.exports = { createReminder, getRemindersByuserid, updateReminder, deleteReminder };
