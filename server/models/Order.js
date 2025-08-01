const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,
    },
    items: [
        {
            productId: { type: String, required: true },
            name: { type: String, required: true },
            image: { type: String },
            size: { type: String },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true }
        }
    ],
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);