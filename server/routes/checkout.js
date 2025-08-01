const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const Cart = require('../models/Cart');
const Order = require('../models/Order'); // Add at the top
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/create-checkout-session', authenticateJWT, async (req, res) => {
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
      success_url: `${process.env.CLIENT_ORIGIN}/payment-res/success`,
      cancel_url: `${process.env.CLIENT_ORIGIN}/payment-res/cancel`,
      metadata: {
        userId: req.userId
      },
    });
    res.json({ sessionId: session.id });
  } catch (err) {
    console.error("stripe error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.use(bodyParser.json());

// Export webhook handler separately
const webhookRawMiddleware = bodyParser.raw({ type: 'application/json' });

const webhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;

      if (userId) {
        // Fetch the cart before clearing
        const cart = await Cart.findOne({ userId });
        const items = cart ? cart.items : [];
        const total = session.amount_total / 100;

        if (items.length) {
          await Order.create({ userId, items, total });
          await Cart.findOneAndUpdate({ userId }, { items: [] });
          console.log(`Order saved and cart cleared for user ${userId}`);
        } else {
          console.warn('Cart was empty, order not saved.');
        }
      } else {
        console.warn('No userId in session metadata, order not saved and cart not cleared.');
      }
    }

    res.status(200).send('Webhook received');
  } catch (err) {
    console.error('Stripe webhook error:', err.message);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

module.exports = router;
module.exports.webhookHandler = webhookHandler;
module.exports.webhookRawMiddleware = webhookRawMiddleware;