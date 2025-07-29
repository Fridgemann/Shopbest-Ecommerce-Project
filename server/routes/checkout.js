const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/Product'); // Adjust path if needed

router.post('/create-checkout-session', async (req, res) => {
  const { cartItems } = req.body;
//   console.log("cartItems:", cartItems); // Debug

  try {
    // Fetch latest product info for each cart item
    const updatedItems = await Promise.all(cartItems.map(async item => {
      const product = await Product.findById(item.productId);
      return {
        name: product ? product.title : item.name || "Product",
        image: product ? product.image : item.image,
        price: product ? product.price : item.price,
        quantity: item.quantity || 1,
      };
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: updatedItems.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Number.isFinite(Number(item.price)) ? Math.round(Number(item.price) * 100) : 100,
        },
        quantity: item.quantity,
      })),
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        metadata: {
            cartItems: JSON.stringify(cartItems),
        },
    });
    res.json({ sessionId: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;