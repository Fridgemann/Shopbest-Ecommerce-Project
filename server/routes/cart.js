const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const jwt = require('jsonwebtoken');

// middleware to extract userId from token
function getUserIdFromToken(req) {
  const token = req.cookies?.token;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

router.get('/cart', async (req, res) => {
  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(401).json({ message: 'Not logged in' });

  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });

  res.json(cart);
});

router.post('/cart', async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { productId, quantity, size } = req.body;

  if (!userId || !productId || !quantity) return res.status(400).json({ message: 'Missing data' });

  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });

  const existingItem = cart.items.find(i => i.productId === productId && i.size === size);
  if (existingItem) existingItem.quantity += quantity;
  else cart.items.push({ productId, quantity, size });

  await cart.save();
  res.json(cart);
});

router.delete('/cart/:productId', async (req, res) => {
  const userId = getUserIdFromToken(req);
  const { productId } = req.params;
  const { size } = req.query;

  let cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(item => {
    if (size !== undefined && size !== "") {
      // Remove only if both productId and size match
      return !(item.productId === productId && item.size === size);
    } else {
      // Remove if productId matches and item has no size
      return !(item.productId === productId && (item.size === undefined || item.size === null || item.size === ""));
    }
  });

  await cart.save();
  res.json(cart);
});

module.exports = router;
