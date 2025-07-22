const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

// register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    try {
        const user = new User({ username, email, password: hashed });
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
        res
            .cookie('token', token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: false, // Set to true in production with HTTPS
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            .json({ message: 'Login successful' }); // <-- this ends the response
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/me', async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not logged in' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      // User was deleted → clear the cookie and return 404
      res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Lax',
        secure: false, // set to true in production with HTTPS
      });
      return res.status(404).json({ message: 'User not found' });
    }

    // If user exists, return their data
    res.json({ userId: user._id, username: user.username });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});


router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Lax',
        secure: false // true if you're using HTTPS
    });
    res.json({ message: 'Logged out' });
});



module.exports = router;