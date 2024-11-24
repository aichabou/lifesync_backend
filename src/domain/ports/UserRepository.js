const pool = require('../../infrastructure/config/db');

const createUser = async (userData) => {
    const query = `
        INSERT INTO "User" (username, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING userid, username, email, role;
    `;
    const values = [userData.username, userData.email, userData.password, userData.role || 'user'];
    const result = await pool.query(query, values);
    return result.rows[0];
};

const getUserByEmail = async (email) => {
    const query = `SELECT * FROM "User" WHERE email = $1`;
    const result = await pool.query(query, [email]);
    return result.rows[0];
};

module.exports = { createUser, getUserByEmail };
