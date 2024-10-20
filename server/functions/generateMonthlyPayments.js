const Resident = require('../models/newMemberResident');
const Payment = require('../models/Payment')

const generateMonthlyPayments = async (userId, contractEndDate) => {
    try {
      const resident = await Resident.findById(userId);
      const startDate = dayjs(resident.dateJoined).startOf('day');
      let currentDate;
  
      // Check if the resident joined on the 1st of the month
      if (startDate.date() === 1) {
        currentDate = startDate.startOf('month'); // Start from this month
      } else {
        currentDate = startDate.add(1, 'month').startOf('month'); // Start from the next month
      }
  
      // Generate payments based on the contract term
      for (let i = 0; i < resident.contractTerm; i++) {
        const month = currentDate.format('YYYY-MM');
        const existingPayment = await Payment.findOne({ userId, month });
  
        if (!existingPayment) {
          const payment = new Payment({
            userId,
            userName: resident.name,
            rent: resident.rent,
            amount: resident.rent,
            month,
            date: currentDate.toDate(),
            status: 'due',
            type: 'rent',
          });
  
          await payment.save();
          resident.payments.push(payment._id);
        }
  
        currentDate = currentDate.add(1, 'month');
      }
  
      // Save the resident with updated payments
      await resident.save();
  
      // Update the resident's contract term based on the number of payments generated
      await Resident.findByIdAndUpdate(userId, {
        contractTerm: resident.payments.length,
      }, { new: true });
  
    } catch (error) {
      console.log(error);
    }
  };
  module.exports=generateMonthlyPayments