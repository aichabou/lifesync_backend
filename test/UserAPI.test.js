const request = require('supertest');
const app = require('../src/server');
const bcrypt = require('bcrypt');
const pool = require('../src/infrastructure/config/db');

beforeAll(async () => {
    // Supprime les utilisateurs existants pour éviter les conflits
    await pool.query('DELETE FROM "User"');

    // Insère un utilisateur avec un mot de passe hashé
    const hashedPassword = await bcrypt.hash('password123', 10);
    await pool.query(`
        INSERT INTO "User" (username, email, password, role)
        VALUES ('TestUser', 'test@example.com', '${hashedPassword}', 'user');
    `);
});
afterAll(async () => {
    // Nettoie les données après les tests
    await pool.query('DELETE FROM "User"');
    pool.end(); // Ferme la connexion à la base de données
});

describe('User API', () => {
    test('POST /api/register should create a user', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                username: 'TestUser',
                email: 'testuser@example.com',
                password: 'password123',
            });
        expect(res.status).toBe(201);
        expect(res.body.user).toHaveProperty('userId');
    });    

    test('POST /api/login should authenticate a user', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'test@example.com',
                password: 'password123', // Correspond au mot de passe inséré dans beforeAll
            });
    
        expect(res.status).toBe(200); // Vérifie que la réponse est OK
        expect(res.body).toHaveProperty('token'); // Vérifie que le token est présent dans la réponse
    });
    
});
