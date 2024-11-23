const express = require('express');
const cors = require('cors');
const { register, login } = require('../src/infrastructure/controllers/UserController')

const app = express();
app.use(cors({
    origin: 'http://localhost:3001', // Autorise uniquement cette origine
}));
app.use(express.json());

app.get('/register', (req, res) => {
    res.send('Cette route est prévue pour gérer les inscriptions via une requête POST.');
});
app.post('/api/register', register);
app.post('/api/login', login);

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
}

module.exports = app;
