const mongoose = require('mongoose');
const MenuSchema = new mongoose.Schema({
    week: { type: String, required: true }, // e.g., "Week 49, 2024"
    menu: {
      Monday: {
        breakfast: [{ type: String }],
        lunch: [{ type: String }],
        dinner: [{ type: String }]
      },
      Tuesday: {
         breakfast: [{ type: String }],
      lunch: [{ type: String }],
      dinner: [{ type: String }]},
      Wednesday: { breakfast: [{ type: String }],
      lunch: [{ type: String }],
      dinner: [{ type: String }] },
      Thursday: { breakfast: [{ type: String }],
      lunch: [{ type: String }],
      dinner: [{ type: String }] },
      Friday: { breakfast: [{ type: String }],
      lunch: [{ type: String }],
      dinner: [{ type: String }] },
      Saturday: { breakfast: [{ type: String }],
      lunch: [{ type: String }],
      dinner: [{ type: String }] },
      Sunday: { breakfast: [{ type: String }],
      lunch: [{ type: String }],
      dinner: [{ type: String }] },
    },
    basement:{type: mongoose.Schema.Types.ObjectId, ref: 'Basement', required: true}
  }, { timestamps: true });
  
  module.exports = mongoose.model('Menu', MenuSchema);  