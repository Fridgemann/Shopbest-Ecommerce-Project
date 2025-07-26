require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(helmet());

const PORT = process.env.PORT;

const productsRouter = require('./routes/products')
app.use('/api/products', productsRouter);

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

const cartRoutes = require('./routes/cart');
app.use('/', cartRoutes);



mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
  });