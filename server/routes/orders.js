const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authenticateJWT = require('../middleware/authenticateJWT');

router.get('/orders', authenticateJWT, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;