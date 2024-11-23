// src/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

// Création d'un pool de connexion PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,       // Utilisateur de la base de données
  host: process.env.DB_HOST,       // Hôte (localhost si en local)
  database: process.env.DB_NAME,   // Nom de la base de données
  password: process.env.DB_PASS,   // Mot de passe de l'utilisateur PostgreSQL
  port: process.env.DB_PORT        // Port PostgreSQL (5432 par défaut)
});

module.exports = pool;
