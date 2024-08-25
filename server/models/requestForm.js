const mongoose = require('mongoose');

const requestFormSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    hostelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hostel', required: true },
    status:{type:String, enum: ['open', 'close'],default:'open'}
},
{
    timestamps: true
});

const requestForm = mongoose.model('requestForm', requestFormSchema);

module.exports = requestForm;
