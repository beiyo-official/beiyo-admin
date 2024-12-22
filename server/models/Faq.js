
const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true, // Example: "Payments", "Services", "General"
  },
  questions: [
    {
      question: { type: String, required: true }, // Example: "How can I pay my rent?"
      answer: { type: String, required: true },   // Example: "You can pay via Razorpay."
    },
  ],
});

const FAQ = mongoose.model("FAQ", FAQSchema);

module.exports = FAQ;