const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

const productsRouter = require('./routes/products')
app.use('/api/products', productsRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});