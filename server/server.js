require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));

const { webhookHandler } = require('./routes/checkout');
app.post('/webhook', bodyParser.raw({ type: 'application/json' }), webhookHandler);

app.use(helmet({
  contentSecurityPolicy: false, // disabled csp for simplicity for now
}));
app.use(cookieParser());


app.use(express.json());

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.status(200).send('OK');
});

const productsRouter = require('./routes/products')
app.use('/api/products', productsRouter);

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

const cartRoutes = require('./routes/cart');
app.use('/', cartRoutes);

const wishlistRoutes = require('./routes/wishlist');
app.use('/', wishlistRoutes);

const checkoutRoutes = require('./routes/checkout');
app.use('/', checkoutRoutes);

const ordersRouter = require('./routes/orders');
app.use('/', ordersRouter);



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });