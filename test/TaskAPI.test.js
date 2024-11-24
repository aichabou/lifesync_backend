const request = require('supertest');
const app = require('../src/server');
const pool = require('../src/infrastructure/config/db');

let server;
beforeAll(async () => {
    server = app.listen(3000, () => {
        console.log('Test server running on http://localhost:3000');
    });
});

beforeEach(async () => {
    // Nettoyer toutes les données avant chaque test
    await pool.query('DELETE FROM "Task"');
    await pool.query('DELETE FROM "User"');
    await pool.query(`
        INSERT INTO "User" (userid, username, email, password, role)
        VALUES (1, 'TestUser', 'testuser@example.com', 'password123', 'user');
    `);
});

afterAll(async () => {
    await pool.end();
    if (server) {
        server.close();
    }
});

describe('Task API Tests', () => {
    test('POST /api/tasks should create a new task', async () => {
        const taskData = {
            userid: 1,
            description: 'Learn Jest',
            deadline: '2024-12-01T23:59:59',
            priority: 'high',
            status: 'pending',
        };

        const res = await request(app)
            .post('/api/tasks')
            .send(taskData)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('taskid');
        expect(res.body.description).toBe(taskData.description);
    });

    test('GET /api/tasks/:userid should list tasks for a user', async () => {
        const userid = 1;

        // Ajouter une tâche
        const taskData = {
            userid,
            description: 'Learn Jest',
            deadline: '2024-12-01T23:59:59',
            priority: 'high',
            status: 'pending',
        };

        await request(app)
            .post('/api/tasks')
            .send(taskData)
            .set('Content-Type', 'application/json');

        const res = await request(app)
            .get(`/api/tasks/${userid}`)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1); // Nettoyage garantit une seule tâche
        expect(res.body[0].description).toBe('Learn Jest');
    });

    test('PUT /api/tasks/:taskid should update a task', async () => {
        const taskData = {
            userid: 1,
            description: 'Learn Jest',
            deadline: '2024-12-01T23:59:59',
            priority: 'high',
            status: 'pending',
        };

        const createdTask = await request(app)
            .post('/api/tasks')
            .send(taskData)
            .set('Content-Type', 'application/json');

        const updatedTask = {
            description: 'Updated Task',
            deadline: '2024-12-10T23:59:59',
            priority: 'medium',
            status: 'done',
        };

        const res = await request(app)
            .put(`/api/tasks/${createdTask.body.taskid}`)
            .send(updatedTask)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(200);
        expect(res.body.description).toBe(updatedTask.description);
    });

    test('DELETE /api/tasks/:taskid should delete a task', async () => {
        const taskData = {
            userid: 1,
            description: 'Learn Jest',
            deadline: '2024-12-01T23:59:59',
            priority: 'high',
            status: 'pending',
        };

        const createdTask = await request(app)
            .post('/api/tasks')
            .send(taskData)
            .set('Content-Type', 'application/json');

        const res = await request(app)
            .delete(`/api/tasks/${createdTask.body.taskid}`)
            .set('Content-Type', 'application/json');

        expect(res.status).toBe(204);

        const tasks = await request(app)
            .get(`/api/tasks/${taskData.userid}`)
            .set('Content-Type', 'application/json');

        expect(tasks.body).toHaveLength(0); // La tâche est supprimée
    });
});
