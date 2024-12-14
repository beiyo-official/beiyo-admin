const mongoose = require('mongoose');



const MealSelectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  meals: {
    breakfast: { type: String, default: null },
    lunch: { type: String, default: null },
    dinner: { type: String, default: null },
  },
  skipped: {
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model('MealSelection', MealSelectionSchema);
