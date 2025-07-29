const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const jwt = require('jsonwebtoken');

// Middleware to extract userId from token
function getUserIdFromToken(req) {
    const token = req.cookies?.token;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.userId;
    } catch {
        return null;
    }
};

router.get('/wishlist', async (req, res) => {
    const userId = getUserIdFromToken(req);
    if (!userId) return res.status(401).json({ message: 'Not logged in' });

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) wishlist = await Wishlist.create({ userId, items: [] });

    res.json(wishlist);
});

router.post('/wishlist', async (req, res) => {
    const userId = getUserIdFromToken(req);
    let { productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ message: 'Missing data' });    

    // Always treat productId as string for comparison and storage
    productId = String(productId);

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) wishlist = await Wishlist.create({ userId, items: [] });

    if (!wishlist.items.some(item => item.productId === productId)) {
        wishlist.items.push({ productId });
        await wishlist.save();
    }

    res.json(wishlist);
});

router.delete('/wishlist/:productId', async (req, res) => {
    const userId = getUserIdFromToken(req);
    const { productId } = req.params;

    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.items = wishlist.items.filter(item => item.productId !== productId);
    await wishlist.save();

    res.json(wishlist);
});

module.exports = router;