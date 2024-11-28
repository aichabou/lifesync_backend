const {
    createTask,
    getTasksByuserid,
    updateTask,
    deleteTask,
} = require('../../domain/ports/TaskRepository');
const pool = require('../../infrastructure/config/db');

// Ajouter une tâche
const addTask = async (taskData) => {
    if (!taskData.description || !taskData.deadline) {
        throw new Error('La description et la date limite sont obligatoires.');
    }
    return createTask(taskData);
};

// Lister les tâches d'un utilisateur
const listTasksByUser = async (userid, sortBy, order) => {
    return getTasksByuserid(userid, sortBy, order);
};

// Modifier une tâche
const modifyTask = async (taskid, updatedData) => {
    const { description, deadline, priority, status } = updatedData;

    if (!description || !deadline || !priority || !status) {
        throw new Error("Tous les champs sont obligatoires.");
    }
    console.log("Données reçues pour modification :", updatedData);
    if (!updatedData.description) {
        throw new Error("La description est obligatoire.");
    }
    const query = `
        UPDATE "Task"
        SET description = $1, deadline = $2, priority = $3, status = $4
        WHERE taskid = $5
        RETURNING *;
    `;
    const values = [description, deadline, priority, status, taskid];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
        throw new Error("Tâche non trouvée.");
    }

    return result.rows[0];
};

// Supprimer une tâche
const removeTask = async (taskid) => {
    await deleteTask(taskid);
};

module.exports = { addTask, listTasksByUser, modifyTask, removeTask };
