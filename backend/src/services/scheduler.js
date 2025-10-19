import cron from 'node-cron';
import { sendReminderEmails } from './emailService.js';

// Schedule email reminders to run daily at 9:00 AM
const scheduleEmailReminders = () => {
  // Run every day at 9:00 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily email reminders...');
    await sendReminderEmails();
  }, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Adjust timezone as needed
  });
  
  console.log('Email reminder scheduler started - will run daily at 9:00 AM IST');
};

// For testing purposes - run immediately if in development
const runTestReminders = async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Running test email reminders...');
    await sendReminderEmails();
  }
};

export { scheduleEmailReminders, runTestReminders };
