const express = require('express');
const { register, login } = require('../src/infrastructure/controllers/UserController')

const app = express();
app.use(express.json());

app.post('/api/register', register);
app.post('/api/login', login);

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
}

module.exports = app;
