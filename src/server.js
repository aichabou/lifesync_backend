const express = require('express');
const cors = require('cors');
const { register, login, getUserData, deleteUserData } = require('../src/infrastructure/controllers/UserController')
const {
    createTaskHandler,
    getTasksHandler,
    updateTaskHandler,
    deleteTaskHandler,
} = require('../src/infrastructure/controllers/TaskController');
const {
    createReminderHandler,
    getRemindersHandler,
    updateReminderHandler,
    deleteReminderHandler,
} = require('../src/infrastructure/controllers/ReminderController');
// Sécurité contre attaque XSS
const xssClean = require('xss-clean');

const app = express();
app.use(cors({
    origin: 'http://localhost:3001', // Autorise uniquement cette origine
}));
app.use(express.json());
app.use(xssClean());
app.get('/register', (req, res) => {
    res.send('Cette route est prévue pour gérer les inscriptions via une requête POST.');
});
app.post('/api/register', register);
app.post('/api/login', login);

// Routes pour les tâches
app.post('/api/tasks', createTaskHandler);
app.get('/api/tasks/:userid', getTasksHandler);
app.put('/api/tasks/:taskid', updateTaskHandler);
app.delete('/api/tasks/:taskid', deleteTaskHandler);

// Routes pour les rappels
app.post('/api/reminders', createReminderHandler);
app.get('/api/reminders/:userid', getRemindersHandler);
app.put('/api/reminders/:reminderid', updateReminderHandler);
app.delete('/api/reminders/:reminderid', deleteReminderHandler);

app.get('/api/user', getUserData); // Route pour accéder aux données
app.delete('/api/user', deleteUserData); // Route pour supprimer les données

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
}

module.exports = app;
