const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const { cartItems } = req.body;
  //   console.log("cartItems:", cartItems); // Debug

  try {

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: cartItems.map(item => ({
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
      success_url: `${process.env.CLIENT_ORIGIN}/success`,
      cancel_url: `${process.env.CLIENT_ORIGIN}/cancel`,
      metadata: {
        cartItems: JSON.stringify(cartItems),
      },
    });
    res.json({ sessionId: session.id });
  } catch (err) {
    console.error("stripe error:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;