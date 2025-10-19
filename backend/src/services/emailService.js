import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter for email service
const createTransporter = () => {
  // For development, we'll use Gmail SMTP
  // In production, you should use a proper email service like SendGrid, AWS SES, etc.
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS, // Your Gmail app password
    },
  });
};

// Email templates
const emailTemplates = {
  billReminder: (userName, billName, amount, dueDate) => ({
    subject: `💰 Bill Reminder: ${billName} - Due Today`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Kuber</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Personal Finance Assistant</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">📅 Bill Payment Reminder</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            This is a friendly reminder that your bill <strong>"${billName}"</strong> is due today!
          </p>
          
          <div style="background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #333; font-size: 18px;"><strong>Bill Details:</strong></p>
            <p style="margin: 5px 0; color: #666;"><strong>Amount:</strong> ₹${amount}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Due Date:</strong> ${dueDate}</p>
          </div>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Don't forget to make the payment to avoid any late fees. You can mark it as paid in your Kuber dashboard once you've completed the payment.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/bills" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              View Bills Dashboard
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            This is an automated reminder from Kuber. If you've already paid this bill, please mark it as paid in your dashboard.
          </p>
        </div>
      </div>
    `,
  }),

  subscriptionReminder: (userName, subscriptionName, amount, dueDate) => ({
    subject: `🔄 Subscription Renewal: ${subscriptionName} - Due Today`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Kuber</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Personal Finance Assistant</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">🔄 Subscription Renewal Reminder</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Your subscription <strong>"${subscriptionName}"</strong> is due for renewal today!
          </p>
          
          <div style="background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #333; font-size: 18px;"><strong>Subscription Details:</strong></p>
            <p style="margin: 5px 0; color: #666;"><strong>Amount:</strong> ₹${amount}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Due Date:</strong> ${dueDate}</p>
          </div>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Make sure to renew your subscription to continue enjoying the service. You can mark it as paid in your Kuber dashboard once you've completed the payment.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/subscriptions" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              View Subscriptions Dashboard
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            This is an automated reminder from Kuber. If you've already renewed this subscription, please mark it as paid in your dashboard.
          </p>
        </div>
      </div>
    `,
  }),

  debtReminder: (userName, debtName, amount, dueDate) => ({
    subject: `💳 Debt Payment: ${debtName} - Due Today`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Kuber</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Personal Finance Assistant</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">💳 Debt Payment Reminder</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            This is a reminder that your debt payment for <strong>"${debtName}"</strong> is due today!
          </p>
          
          <div style="background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p style="margin: 0; color: #333; font-size: 18px;"><strong>Debt Details:</strong></p>
            <p style="margin: 5px 0; color: #666;"><strong>Amount:</strong> ₹${amount}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Due Date:</strong> ${dueDate}</p>
          </div>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Make sure to make the payment on time to avoid any penalties or interest charges. You can mark it as paid in your Kuber dashboard once you've completed the payment.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/debts" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              View Debts Dashboard
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
            This is an automated reminder from Kuber. If you've already made this payment, please mark it as paid in your dashboard.
          </p>
        </div>
      </div>
    `,
  }),
};

// Send email function
export const sendEmail = async (to, template, data) => {
  try {
    const transporter = createTransporter();
    const emailContent = template(data.userName, data.name, data.amount, data.dueDate);
    
    const mailOptions = {
      from: `"Kuber" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send reminder emails
export const sendReminderEmails = async () => {
  try {
    const { Bill, Subscription, Debt, Settings } = await import('../models/FinanceModels.js');
    const User = (await import('../models/User.js')).default;
    const today = new Date().toISOString().split('T')[0];
    
    console.log(`Checking for due payments on ${today}...`);

    // Get all users with email reminders enabled
    const users = await User.find({});
    
    for (const user of users) {
      // Check if user has email reminders enabled
      const userSettings = await Settings.findOne({ userId: user._id });
      if (!userSettings || !userSettings.emailReminders) {
        console.log(`Email reminders disabled for user: ${user.email}`);
        continue;
      }
      
      const userEmail = user.email;
      const userName = user.name;
      
      // Check bills due today
      const dueBills = await Bill.find({ 
        userId: user._id, 
        dueDate: today 
      });
      
      for (const bill of dueBills) {
        await sendEmail(userEmail, emailTemplates.billReminder, {
          userName,
          name: bill.name,
          amount: bill.amount,
          dueDate: bill.dueDate,
        });
        console.log(`Bill reminder sent to ${userEmail} for ${bill.name}`);
      }
      
      // Check subscriptions due today
      const dueSubscriptions = await Subscription.find({ 
        userId: user._id, 
        nextDue: today 
      });
      
      for (const subscription of dueSubscriptions) {
        await sendEmail(userEmail, emailTemplates.subscriptionReminder, {
          userName,
          name: subscription.name,
          amount: subscription.amount,
          dueDate: subscription.nextDue,
        });
        console.log(`Subscription reminder sent to ${userEmail} for ${subscription.name}`);
      }
      
      // Check debts due today
      const dueDebts = await Debt.find({ 
        userId: user._id, 
        due: today 
      });
      
      for (const debt of dueDebts) {
        await sendEmail(userEmail, emailTemplates.debtReminder, {
          userName,
          name: debt.name,
          amount: debt.amount,
          dueDate: debt.due,
        });
        console.log(`Debt reminder sent to ${userEmail} for ${debt.name}`);
      }
    }
    
    console.log('Reminder email check completed');
  } catch (error) {
    console.error('Error in sendReminderEmails:', error);
  }
};

export { emailTemplates };
