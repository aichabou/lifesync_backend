const {
    createReminder,
    getRemindersByuserid,
    updateReminder,
    deleteReminder,
} = require('../../domain/ports/ReminderRepository');

// Ajouter un rappel
const addReminder = async (reminderData) => {
    if (!reminderData.content || !reminderData.datetime) {
        throw new Error('Le contenu et la date/heure sont obligatoires.');
    }
    return createReminder(reminderData);
};

// Lister les rappels par utilisateur
const listRemindersByUser = async (userid) => {
    return getRemindersByuserid(userid);
};

// Modifier un rappel
const modifyReminder = async (reminderid, updatedData) => {
    return updateReminder(reminderid, updatedData);
};

// Supprimer un rappel
const removeReminder = async (reminderid) => {
    await deleteReminder(reminderid);
};

module.exports = { addReminder, listRemindersByUser, modifyReminder, removeReminder };
