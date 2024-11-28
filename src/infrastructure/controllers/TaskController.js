const {
    addTask,
    listTasksByUser,
    modifyTask,
    removeTask,
} = require('../../application/services/TaskService');
const pool = require('../../infrastructure/config/db');

// Créer une tâche
const createTaskHandler = async (req, res) => {
    try {
        const { userid, description, deadline, priority, status } = req.body;
        if (!userid || !description || !deadline || !priority || !status) {
            return res.status(400).json({ error: 'ID utilisateur manquant.' });
        }
        const query = `
            INSERT INTO "Task" (userid, description, deadline, priority, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [userid, description, deadline, priority, status];
        const result = await pool.query(query, values);

        const task = result.rows[0];
        res.status(201).json({task});
    } catch (err) {
        console.error('Erreur dans createTaskHandler :', err.message);
        res.status(500).json({ error: err.message });
    }
};

// Récupérer toutes les tâches d'un utilisateur
const getTasksHandler = async (req, res) => {
    try {
        const { userid } = req.params;
        
        if (!userid) {
            return res.status(400).json({ error: "L'ID utilisateur est requis." });
        }
        // const { sortBy, order } = req.query;
        const tasks = await listTasksByUser(userid);
        res.json(tasks);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Mettre à jour une tâche
const updateTaskHandler = async (req, res) => {
    try {
        const { taskid } = req.params;
        if (!taskid || isNaN(taskid)) {
            throw new Error('ID de tâche invalide');
        }

        const { description, deadline, priority, status } = req.body;
        if (!description) {
            return res.status(400).json({ error: "La description est obligatoire." });
        }

        const updatedTask = await modifyTask(taskid, {
            description,
            deadline,
            priority,
            status,
        });

        if (!updatedTask) {
            return res.status(404).json({ error: 'Tâche non trouvée' });
        }
        console.log("Requête reçue pour mise à jour :", req.body);
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error('Erreur dans updateTaskHandler :', err.message);
        res.status(400).json({ error: err.message });
    }
};


// Supprimer une tâche
const deleteTaskHandler = async (req, res) => {
    try {
        await removeTask(req.params.taskid);
        res.status(204).end();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    createTaskHandler,
    getTasksHandler,
    updateTaskHandler,
    deleteTaskHandler,
};
