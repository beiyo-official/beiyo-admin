const Payment = require("../models/Payment");


const rentMapAmount = async ()=>{
    try {
        // Fetch all payments
        const payments = await Payment.find({ rent: { $exists: false } });
    
        for (let payment of payments) {
          // Update the rent to be equal to the amount
          payment.rent = payment.amount;
          await payment.save();
        }
    
        console.log(`Updated ${payments.length} payments.`);
      }catch(error){
        console.log(error);
      }
}


module.exports = rentMapAmount;