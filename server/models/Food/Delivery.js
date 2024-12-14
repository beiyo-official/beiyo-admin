const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true }, // Links to the subscription
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensures tracking per user
  deliveryDate: { type: Date, required: true },
  meals: {
    breakfast: { type: String, enum: ['pending', 'delivered', 'skipped'], default: 'pending' },
    lunch: { type: String, enum: ['pending', 'delivered', 'skipped'], default: 'pending' },
    dinner: { type: String, enum: ['pending', 'delivered', 'skipped'], default: 'pending' },
  },
  notes: { type: String }, // Special instructions or issues
}, { timestamps: true });

module.exports = mongoose.model('Delivery', DeliverySchema);
