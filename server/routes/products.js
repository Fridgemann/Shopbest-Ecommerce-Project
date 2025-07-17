const express = require('express');
const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;