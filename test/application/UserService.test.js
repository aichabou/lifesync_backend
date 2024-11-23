const { registerUser, loginUser } = require('../../src/application/services/UserService');
const { createUser, getUserByEmail } = require('../../src/domain/ports/UserRepository');
const bcrypt = require('bcrypt');
const pool = require('../../src/infrastructure/config/db');

jest.mock('../../src/domain/ports/UserRepository');

beforeEach(async () => {
    await pool.query('DELETE FROM "User"');
});

afterAll(() => {
    pool.end();
});

describe('UserService', () => {
    test('registerUser should hash the password and create a user', async () => {
        getUserByEmail.mockResolvedValue(null);
        createUser.mockResolvedValue({ userId: 1, username: 'TestUser', email: 'test@example.com', role: 'user' });

        const user = await registerUser({ username: 'TestUser', email: 'test@example.com', password: 'password123' });
        expect(user).toHaveProperty('userId');
    });

    test('loginUser should return a token for valid credentials', async () => {
        getUserByEmail.mockResolvedValue({
            userId: 1,
            username: 'TestUser',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
        });

        const result = await loginUser({ email: 'test@example.com', password: 'password123' });
        expect(result).toHaveProperty('token');
    });
});
