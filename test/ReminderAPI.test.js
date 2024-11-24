const request = require('supertest');
const app = require('../src/server');
const pool = require('../src/infrastructure/config/db');

let server;

beforeAll(async () => {
    server = app.listen(3000, () => {
        console.log('Test server running on http://localhost:3000');
    });

    // Nettoyez la base de données et insérez les données nécessaires
    await pool.query('DELETE FROM "Reminder"');
    await pool.query('DELETE FROM "User"');
    await pool.query(`
        INSERT INTO "User" (userid, username, email, password, role)
        VALUES (1, 'TestUser', 'testuser@example.com', 'password123', 'user');
    `);
});

afterAll(async () => {
    if (server) {
        await server.close(); // Fermez le serveur après les tests
    }
    await pool.end();
});

describe('Reminder API Tests', () => {
    test('POST /api/reminders should create a reminder', async () => {
        const reminderData = {
            userid: 1,
            content: 'Meeting at 3PM',
            datetime: '2024-11-30T15:00:00',
        };

        const res = await request(app)
            .post('/api/reminders')
            .send(reminderData)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('reminderid');
        expect(res.body.content).toBe(reminderData.content);
    });

    test('GET /api/reminders/:userid should list reminders for a user', async () => {
        const res = await request(app)
            .get('/api/reminders/1')
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]).toHaveProperty('reminderid');
        expect(res.body[0].content).toBe('Meeting at 3PM');
    });

    test('PUT /api/reminders/:reminderid should update a reminder', async () => {
        const updatedData = {
            content: 'Updated Meeting at 4PM',
            datetime: '2024-11-30T16:00:00',
        };

        const createdReminder = await request(app)
            .post('/api/reminders')
            .send({
                userid: 1,
                content: 'Meeting at 3PM',
                datetime: '2024-11-30T15:00:00',
            })
            .set('Content-Type', 'application/json');

        const res = await request(app)
            .put(`/api/reminders/${createdReminder.body.reminderid}`)
            .send(updatedData)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(200);
        expect(res.body.content).toBe(updatedData.content);
    });

    test('DELETE /api/reminders/:reminderid should delete a reminder', async () => {
        const createdReminder = await request(app)
            .post('/api/reminders')
            .send({
                userid: 1,
                content: 'Meeting at 3PM',
                datetime: '2024-11-30T15:00:00',
            })
            .set('Content-Type', 'application/json');

        const res = await request(app)
            .delete(`/api/reminders/${createdReminder.body.reminderid}`)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(204);
    });
});
