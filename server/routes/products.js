const express = require('express');
const router = express.Router();

function normalize(p) {
    return {
        id: p.id,
        title: p.title,
        price: p.price,
        description: p.description,
        category: p.category,
        image: p.thumbnail,
        rating: {
            rate: p.rating,
            count: p.stock,
        },
    };
}

router.get('/', async (req, res) => {
    try {
        const response = await fetch('https://dummyjson.com/products?limit=100');
        const data = await response.json();
        res.json(data.products.map(normalize));
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

router.get('/featured', async (req, res) => {
    try {
        const productsRes = await fetch('https://dummyjson.com/products?limit=100');
        const data = await productsRes.json();
        const featuredProducts = data.products
            .map(normalize)
            .sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
            .slice(0, 4);
        res.json(featuredProducts);
    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching featured products' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await response.json();
        res.json(normalize(data));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

module.exports = router;