const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username, email, password: hashed });
    await user.save();

    // Auto-login: create JWT and set cookie
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })
      .status(201)
      .json({ message: 'Registration successful', userId: user._id, username: user.username });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Username or email already in use." });
    }
    console.error('Registration error:', err);
    res.status(400).json({ error: 'Registration failed. Check username or email.' });
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
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
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
  if (!token) return res.json({ loggedIn: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Lax',
        secure: false,
      });
      return res.json({ loggedIn: false });
    }

    res.json({ loggedIn: true, userId: user._id, username: user.username });
  } catch (err) {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'Lax',
      secure: false,
    });
    return res.json({ loggedIn: false });
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