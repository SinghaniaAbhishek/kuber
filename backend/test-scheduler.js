import dotenv from 'dotenv';
dotenv.config();

import { scheduleEmailReminders, runTestReminders } from './src/services/scheduler.js';

console.log('🕐 Testing email scheduler...');

// Start the scheduler
scheduleEmailReminders();

// Run test reminders immediately
console.log('📧 Running test reminders...');
runTestReminders().then(() => {
  console.log('✅ Scheduler test completed');
  console.log('💡 The scheduler is now running and will send emails daily at 9:00 AM');
  console.log('🔄 To test manually, you can run: node test-spotify-reminder.js');
}).catch(console.error);

// Keep the process running to test the scheduler
console.log('⏰ Scheduler is running. Press Ctrl+C to stop.');
