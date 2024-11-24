const pool = require('../../infrastructure/config/db');

// Créer une tâche
const createTask = async (taskData) => {
    const query = `
        INSERT INTO "Task" (userid, description, deadline, priority, status)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [
        taskData.userid,
        taskData.description,
        taskData.deadline,
        taskData.priority,
        taskData.status,
    ];
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Erreur dans createTask :', err.message);
        throw new Error('Impossible de créer la tâche. Vérifiez les données.');
    }
};

// Récupérer toutes les tâches d'un utilisateur
const getTasksByuserid = async (userid, sortBy = 'deadline', order = 'ASC') => {
    const query = `
        SELECT * FROM "Task"
        WHERE userid = $1
        ORDER BY ${sortBy} ${order};
    `;
    const result = await pool.query(query, [userid]);
    return result.rows;
};

// Mettre à jour une tâche
const updateTask = async (taskid, updatedData) => {
    const query = `
        UPDATE "Task"
        SET description = $1, deadline = $2, priority = $3, status = $4
        WHERE taskid = $5
        RETURNING *;
    `;
    const values = [
        updatedData.description,
        updatedData.deadline,
        updatedData.priority,
        updatedData.status,
        taskid,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
};

// Supprimer une tâche
const deleteTask = async (taskid) => {
    const query = `DELETE FROM "Task" WHERE taskid = $1;`;
    await pool.query(query, [taskid]);
};

module.exports = { createTask, getTasksByuserid, updateTask, deleteTask };
