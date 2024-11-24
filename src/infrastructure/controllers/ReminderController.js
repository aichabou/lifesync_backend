const {
    addReminder,
    listRemindersByUser,
    modifyReminder,
    removeReminder,
} = require('../../application/services/ReminderService');

// Créer un rappel
const createReminderHandler = async (req, res) => {
    try {
        const reminder = await addReminder(req.body);
        res.status(201).json(reminder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Récupérer les rappels d'un utilisateur
const getRemindersHandler = async (req, res) => {
    try {
        const { userid } = req.params;
        const reminders = await listRemindersByUser(userid);
        res.status(200).json(reminders);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Mettre à jour un rappel
const updateReminderHandler = async (req, res) => {
    try {
        const { reminderid } = req.params;
        const updatedReminder = await modifyReminder(reminderid, req.body);
        res.status(200).json(updatedReminder);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Supprimer un rappel
const deleteReminderHandler = async (req, res) => {
    try {
        const { reminderid } = req.params;
        await removeReminder(reminderid);
        res.status(204).end();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    createReminderHandler,
    getRemindersHandler,
    updateReminderHandler,
    deleteReminderHandler,
};
