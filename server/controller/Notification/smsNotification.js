const twilio = require('twilio');
const Resident = require('../../models/newMemberResident');
const cron = require('node-cron');

class SMSNotificationService {
  constructor() {
    // Initialize Twilio client
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID, 
      process.env.TWILIO_AUTH_TOKEN
    );
  }

  // Send SMS to a single user
  async sendSMSNotification(phoneNumber, message) {
    try {
      const result = await this.client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });
      console.log('SMS sent successfully:', result.sid);
      return result;
    } catch (error) {
      console.error('SMS sending failed:', error);
      throw error;
    }
  }

  // Send rent reminder SMS to all users
  async sendRentDueReminders() {
    try {
      // Find users with mobile numbers
      const users = await Resident.find({ 
        mobileNumber: { $exists: true, $ne: null } ,
        living:"current"
      });

      // Send SMS to each user
      for (const user of users) {
        const message = `Hello ${user.name}, your rent is due soon. Please make sure to pay by the due date.`;
        
        try {
          await this.sendSMSNotification(user.mobileNumber, message);
        } catch (smsError) {
          console.error(`Failed to send SMS to ${user.name}:`, smsError);
        }
      }
    } catch (error) {
      console.error('Rent reminder SMS batch failed:', error);
    }
  }

  // Schedule monthly SMS reminders
  scheduleRentReminders() {
    
    
    // Run on 1st of every month at 9 AM
    cron.schedule('0 9 1 * *', async () => {
      await this.sendRentDueReminders();
    });
  }
}

module.exports = new SMSNotificationService();