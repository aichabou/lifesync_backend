require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../../domain/ports/UserRepository');

const registerUser = async ({ username, email, password }) => {
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await getUserByEmail(email);
    if (existingUser) throw new Error('Email déjà utilisé');

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    return createUser({ username, email, password: hashedPassword, role: 'user' });
};


const loginUser = async ({ email, password }) => {
    const user = await getUserByEmail(email);
    if (!user) throw new Error('Utilisateur non trouvé');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Mot de passe incorrect');

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET manquant');
    
    const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token, userId: user.userId, username: user.username };
};


module.exports = { registerUser,loginUser };
