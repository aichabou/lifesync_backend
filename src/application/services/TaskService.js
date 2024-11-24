const {
    createTask,
    getTasksByuserid,
    updateTask,
    deleteTask,
} = require('../../domain/ports/TaskRepository');

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
    return updateTask(taskid, updatedData);
};

// Supprimer une tâche
const removeTask = async (taskid) => {
    await deleteTask(taskid);
};

module.exports = { addTask, listTasksByUser, modifyTask, removeTask };
