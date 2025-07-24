const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

router.get('/featured', async (req, res) => {
    try {
        const productsRes = await fetch('https://fakestoreapi.com/products');
        const data = await productsRes.json();
        // Sort by rating.rate descending and take top 4
        const featuredProducts = data
            .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
            .slice(0, 4);
        res.json(featuredProducts);
    } catch (error) {
        // console.error('Featured products error:', error); 
        res.status(500).json({ error: 'Server error while fetching featured products' });
    }
});


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