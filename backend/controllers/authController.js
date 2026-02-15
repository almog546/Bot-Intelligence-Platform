const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');

async function signup(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
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

