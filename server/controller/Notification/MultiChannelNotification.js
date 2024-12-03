// const SMSService = require('./SMSNotificationService');
// const EmailService = require('./EmailNotificationService');
const User = require('./models/User');
const newMemberResident = require('../../models/newMemberResident');
const smsNotification = require('./smsNotification');
const mailNotification = require('./mailNotification');

class MultiChannelNotificationService {
  constructor() {
    this.smsService = new smsNotification();
    this.emailService = new mailNotification();
  }

  // Send notifications based on user preferences
  async sendRentDueReminders() {
    try {
      // Find all users
      const users = await newMemberResident.find({
        $or: [
          { email: { $exists: true, $ne: null } },
          { mobileNumber: { $exists: true, $ne: null } },
        ],
        living:"current",
      });

      for (const user of users) {
        const notificationPromises = [];

        // Send SMS if mobile number exists
        if (user.mobileNumber) {
          const smsMessage = `Hello ${user.name}, your rent is due soon. Please make sure to pay by the due date.`;
          notificationPromises.push(
            this.smsService.sendSMSNotification(user.mobileNumber, smsMessage)
              .catch(error => console.error(`SMS failed for ${user.name}:`, error))
          );
        }

        // Send Email if email exists
        if (user.email) {
          const emailSubject = 'Rent Reminder';
          const emailBody = `Dear ${user.name},\n\nThis is a friendly reminder that your rent is due soon. Please ensure timely payment to avoid any late fees.`;
          notificationPromises.push(
            this.emailService.sendEmailNotification(user.email, emailSubject, emailBody)
              .catch(error => console.error(`Email failed for ${user.name}:`, error))
          );
        }

        // Wait for all notifications to be processed
        await Promise.allSettled(notificationPromises);
      }
    } catch (error) {
      console.error('Multi-channel notification batch failed:', error);
    }
  }

  // Schedule reminders
  scheduleRentReminders() {
    const cron = require('node-cron');
    
    // Run on 1st of every month at 9 AM
    cron.schedule('0 9 1 * *', async () => {
      await this.sendRentDueReminders();
    });
  }
}

module.exports = new MultiChannelNotificationService();