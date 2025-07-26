require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
require('dotenv').config();

app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      'https://shopbest-project.vercel.app',
      /^https:\/\/shopbest-project-.*\.vercel\.app$/
    ];
    if (
      allowed.some(o =>
        typeof o === 'string' ? o === origin : o.test(origin)
      )
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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