const { registerUser, loginUser } = require('../../application/services/UserService');
const pool = require('../../infrastructure/config/db');

const register = async (req, res) => {
    try {
        console.log('Body reçu pour inscription :', req.body);
        const user = await registerUser(req.body);

        // Transforme `userid` en `userid` pour correspondre aux attentes des tests
        res.status(201).json({
            message: 'Utilisateur créé avec succès',
            user: {
                userid: user.userid, // Conversion explicite
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
        const { token, userid, username } = await loginUser(req.body);
        res.json({ message: 'Connexion réussie', token, user: { userid, username } });
    } catch (err) {
        console.error('Erreur dans loginUser :', err.message);
        res.status(400).json({ error: err.message });
    }
};
// Récupérer les données d'un utilisateur
const getUserData = async (req, res) => {
    try {
        const userid = req.userId; // ID utilisateur provenant de la session ou du token
        const query = 'SELECT userid, username, email FROM "User" WHERE userid = $1';
        const result = await pool.query(query, [userid]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Erreur dans getUserData :', err.message);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

// Supprimer les données d'un utilisateur
const deleteUserData = async (req, res) => {
    try {
        const userid = req.userId; // ID utilisateur provenant de la session ou du token
        await pool.query('DELETE FROM "User" WHERE userid = $1', [userid]);
        res.status(204).send();
    } catch (err) {
        console.error('Erreur dans deleteUserData :', err.message);
        res.status(500).json({ error: 'Erreur serveur.' });
    }
};

module.exports = { register, login, getUserData,deleteUserData  };
