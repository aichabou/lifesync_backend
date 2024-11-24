const {
    addReminder,
    listRemindersByUser,
    modifyReminder,
    removeReminder,
} = require('../../src/application/services/ReminderService');
const pool = require('../../src/infrastructure/config/db');

describe('ReminderService Tests', () => {
    beforeEach(async () => {
        await pool.query('DELETE FROM "Reminder"'); // Nettoyage de la table Reminder
        await pool.query('DELETE FROM "User"'); // Nettoyage de la table User
    
        // Ajout d'un utilisateur avec userid = 1
        await pool.query(`
            INSERT INTO "User" (userid, username, email, password, role)
            VALUES (1, 'TestUser', 'testuser@example.com', 'password123', 'user')
        `);
    });
    ;
    afterAll(async () => {
        await pool.end(); // Fermer la connexion au pool PostgreSQL
    });
    
    

    test('addReminder should create a reminder', async () => {
        const reminderData = {
            userid: 1,
            content: 'Meeting at 3PM',
            datetime: '2024-11-30T15:00:00',
        };

        const result = await addReminder(reminderData);
        expect(result).toHaveProperty('reminderid');
        expect(result.content).toBe(reminderData.content);
    });

    test('listRemindersByUser should return reminders for a user', async () => {
        const userid = 1;
        await addReminder({
            userid,
            content: 'Meeting at 3PM',
            datetime: '2024-11-30T15:00:00',
        });

        const reminders = await listRemindersByUser(userid);
        expect(reminders).toHaveLength(1);
        expect(reminders[0]).toHaveProperty('reminderid');
        expect(reminders[0].content).toBe('Meeting at 3PM');
    });
});
