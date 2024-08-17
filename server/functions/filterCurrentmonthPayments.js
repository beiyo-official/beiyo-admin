

const filterPaymentsByCurrentMonth = (payments) => {
    const currentMonth = new Date().getMonth(); // Get current month (0-11)
    const currentYear = new Date().getFullYear(); // Get current year

    return payments.filter(payment => {
        const paymentDate = new Date(payment.date); // Assuming 'date' is the payment date
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    });
};

module.exports = filterPaymentsByCurrentMonth