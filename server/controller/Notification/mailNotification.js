const nodemailer = require('nodemailer');
const User = require('./models/User');
const cron = require('node-cron');
const newMemberResident = require('../../models/newMemberResident');
class EmailNotificationService {
  constructor() {
    // Create a transporter using SMTP
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true, // Use TLS
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  // Send email to a single user
  async sendEmailNotification(email, subject, body) {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.EMAIL_SENDER,
        to: email,
        subject: subject,
        html: `
          <html>
            <body>
              <h2>${subject}</h2>
              <p>${body}</p>
            </body>
          </html>
        `
      });
      console.log('Email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      console.error('Email sending failed:', error);
      throw error;
    }
  }

  // Send rent due email reminders
  async sendRentDueReminders() {
    try {
      // Find users with email addresses
      const users = await newMemberResident.find({ 
        email: { $exists: true, $ne: null } ,
        living:"current"
      });

      // Send email to each user
      for (const user of users) {
        const subject = 'Rent Reminder';
        const body = `Dear ${user.name},\n\nThis is a friendly reminder that your rent is due soon. Please ensure timely payment to avoid any late fees.`;
        
        try {
          await this.sendEmailNotification(user.email, subject, body);
        } catch (emailError) {
          console.error(`Failed to send email to ${user.name}:`, emailError);
        }
      }
    } catch (error) {
      console.error('Rent reminder email batch failed:', error);
    }
  }

  // Schedule monthly email reminders
  scheduleRentReminders() {
   
    
    // Run on 1st of every month at 9 AM
    cron.schedule('0 9 1 * *', async () => {
      await this.sendRentDueReminders();
    });
  }
}

module.exports = new EmailNotificationService();