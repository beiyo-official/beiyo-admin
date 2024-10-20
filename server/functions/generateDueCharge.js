const Resident = require('../models/newMemberResident');
const Payment = require('../models/Payment')


const generateDueCharge = async(userId)=>{
    try {
      const resident = await Resident.findById(userId);
      const startDate = dayjs(resident.dateJoined).startOf('month');
        const month = startDate.format('YYYY-MM');
        const existingPayment = await Payment.findOne({ userId, month ,type:'dueCharge'});
        if(!existingPayment){
          const payment = new Payment({
            userId,
            userName:resident.name,
            amount: resident.dueAmount, // Replace with the appropriate amount
            month,
            date: startDate.toDate(),
            status: 'due',
            type:'dueCharge'
          });
    
          await payment.save();
          resident.dueChargePayment=payment._id;
          await resident.save();
        }
    } catch (error) {
      console.log(error);
    }
   }

   module.exports = generateDueCharge