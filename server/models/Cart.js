const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: String,
        name: String,
        image: String,
        quantity: Number,
        size: String,
        price: Number,
    }],
});

module.exports = mongoose.model('Cart', cartSchema);