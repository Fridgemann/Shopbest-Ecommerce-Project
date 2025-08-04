const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const Cart = require('../models/Cart');
const Order = require('../models/Order'); // Add at the top
const authenticateJWT = require('../middleware/authenticateJWT');
const nodemailer = require('nodemailer');

router.post('/create-checkout-session', authenticateJWT, async (req, res) => {
  const { cartItems, name, address } = req.body;
  // console.log("cartItems:", cartItems); // Debug

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
        userId: req.userId,
        name,
        address
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
      const email = session.customer_details?.email || session.metadata?.email;

      if (userId) {
        // Fetch the cart before clearing
        const cart = await Cart.findOne({ userId });
        const items = cart ? cart.items : [];
        const total = session.amount_total / 100;

        if (items.length) {
          await Order.create({ 
            userId, 
            items, 
            total, 
            name: session.metadata?.name, 
            address: session.metadata?.address, 
            email 
          });
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Order Confirmation -  ShopBest',
            text: `
            Thank you for your order, ${session.metadata?.name || customer}!\n\n
            Order total: $${total}\n
            Shipping address: ${session.metadata?.address}\n\n
            We'll notify you when your order ships!
            `,
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
            } else {
              console.log('Email sent:', info.response);
            }
          });

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