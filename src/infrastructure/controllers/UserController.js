const { registerUser, loginUser } = require('../../application/services/UserService');

const register = async (req, res) => {
    try {
        console.log('Body reçu pour inscription :', req.body);
        const user = await registerUser(req.body);

        // Transforme `userid` en `userId` pour correspondre aux attentes des tests
        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                userId: user.userid, // Conversion explicite
                username: user.username,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Erreur dans registerUser :', err.message);
        res.status(400).json({ error: err.message });
    }
};


const login = async (req, res) => {
    try {
        console.log('Données reçues pour connexion :', req.body);
        const { token, userId, username } = await loginUser(req.body);
        res.json({ message: 'Connexion réussie', token, user: { userId, username } });
    } catch (err) {
        console.error('Erreur dans loginUser :', err.message);
        res.status(400).json({ error: err.message });
    }
};


module.exports = { register, login };
