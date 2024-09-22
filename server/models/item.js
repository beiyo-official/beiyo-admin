const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // e.g., furniture, electronics, etc.
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }, // Add price field
    pricePerQuantity:{type:Number,required:true},
    purchaseDate:{type:Date},
    totalPrice:{ type: Number, required: true },
    description: { type: String     },
    warrantyUpto:{type:String},
    warrantyDate:{type:Date}
});
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;