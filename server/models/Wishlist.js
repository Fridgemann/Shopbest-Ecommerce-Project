const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: String,
        // No size, price, or quantity
    }],
});

module.exports = mongoose.model('Wishlist', wishlistSchema);