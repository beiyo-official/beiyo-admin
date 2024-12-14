const mongoose = require('mongoose');


const BasementSchema = new mongoose.Schema({
    name:{type:String},
    address:{type:String},
    subscriptions:[{type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true}],
    weeklyMenus:[{type: mongoose.Schema.Types.ObjectId, ref: 'Menu'}],
  }, { timestamps: true });

  module.exports = mongoose.model('Basement', BasementSchema);  