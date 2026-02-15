const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');

async function signup(req, res) {
    const { username, password, name } = req.body;

    if (!username || !password || !name) {
        return res.status(400).json({ message: 'Username, password, and name are required' });
    }
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            name,
        },
    });
    req.session.userId = user.id;
    res.status(201).json({ message: 'User created successfully' });
}

async function login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }
    req.session.userId = user.id;
    res.status(200).json({ message: 'Login successful' });
}

async function logout(req, res) {
     req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to logout' });
        }

        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logout successful' });
    });
}
async function me(req, res) {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true, createdAt: true, name: true },
    });
    res.status(200).json({ user });
}

module.exports = {
    signup,
    login,
    me,
    logout,
};

