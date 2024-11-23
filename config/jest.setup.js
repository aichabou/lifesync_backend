// Charge les variables d'environnement pour les tests
require('dotenv').config();

// Ajoute des valeurs spécifiques pour les tests
process.env.JWT_SECRET = 'test_secret_key';
