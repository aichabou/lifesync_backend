const {
    addTask,
    listTasksByUser,
    modifyTask,
    removeTask,
} = require('../../src/application/services/TaskService');
const pool = require('../../src/infrastructure/config/db');

describe('TaskService Tests', () => {
    beforeEach(async () => {
        await pool.query('DELETE FROM "Task"'); // Nettoyer les tâches
        await pool.query('DELETE FROM "User"'); // Nettoyer les utilisateurs
    
        // Insérer un utilisateur fictif
        await pool.query(`
            INSERT INTO "User" (userid, username, email, password, role)
            VALUES (1, 'TestUser', 'testuser@example.com', 'password123', 'user');
        `);
    });

    afterAll(async () => {
        await pool.end(); // Fermer la connexion à la base de données
    });

    test('addTask should create a task', async () => {
        const taskData = {
            userid: 1,
            description: 'Learn Jest',
            deadline: '2024-11-30T23:59:59',
            priority: 'high',
            status: 'pending',
        };

        const result = await addTask(taskData);
        expect(result).toHaveProperty('taskid');
        expect(result.description).toBe(taskData.description);
    });

    test('listTasksByUser should return tasks for a user', async () => {
        const userid = 1;

        // Ajouter une tâche
        await addTask({
            userid,
            description: 'Learn Jest',
            deadline: '2024-11-30T23:59:59',
            priority: 'high',
            status: 'pending',
        });

        const tasks = await listTasksByUser(userid);
        expect(tasks).toHaveLength(1);
        expect(tasks[0]).toHaveProperty('taskid');
        expect(tasks[0].description).toBe('Learn Jest');
    });

    test('modifyTask should update a task', async () => {
        const taskData = {
            userid: 1,
            description: 'Learn Jest',
            deadline: '2024-11-30T23:59:59',
            priority: 'high',
            status: 'pending',
        };

        const task = await addTask(taskData);

        const updatedTask = {
            description: 'Updated Task',
            deadline: '2024-12-10T23:59:59',
            priority: 'medium',
            status: 'done',
        };

        const result = await modifyTask(task.taskid, updatedTask);
        expect(result.description).toBe('Updated Task');
        expect(result.status).toBe('done');
    });

    test('removeTask should delete a task', async () => {
        const taskData = {
            userid: 1,
            description: 'Learn Jest',
            deadline: '2024-11-30T23:59:59',
            priority: 'high',
            status: 'pending',
        };

        const task = await addTask(taskData);
        await removeTask(task.taskid);

        const tasks = await listTasksByUser(1);
        expect(tasks).toHaveLength(0);
    });
});
