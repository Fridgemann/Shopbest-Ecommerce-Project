const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// register
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, password: hashed });
        console.log('Registering user:', user);
        res.status(201).json(await user.save());
    } catch (err) {
        res.status(400).json({ error: 'Username already exists' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Missing fields' });

    try {
        const user = await User.findOne({ username });
        if (!user || typeof user.password !== 'string') {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        // console.log('username:', username);
        // console.log('password (from body):', password, '| type:', typeof password);
        // console.log('user.password (from DB):', user.password, '| type:', typeof user.password);
        const isMatch = await bcrypt.compare(String(password), user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;