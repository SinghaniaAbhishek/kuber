import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Checking email configuration...');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL || '❌ Missing');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log('\n❌ Email configuration missing!');
  console.log('Please add to your .env file:');
  console.log('EMAIL_USER=your-email@gmail.com');
  console.log('EMAIL_PASS=your-gmail-app-password');
  process.exit(1);
}

import { sendEmail, emailTemplates } from './src/services/emailService.js';

// Test email sending
async function testEmail() {
  console.log('\n📧 Testing email service...');
  
  // Test data
  const testData = {
    userName: 'Test User',
    name: 'Electricity Bill',
    amount: 2500,
    dueDate: new Date().toISOString().split('T')[0]
  };
  
  console.log('Sending test email to:', process.env.EMAIL_USER);
  console.log('Test data:', testData);
  
  try {
    // Test bill reminder
    const result = await sendEmail(
      process.env.EMAIL_USER, // Send to yourself for testing
      emailTemplates.billReminder,
      testData
    );
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('📬 Check your inbox (and spam folder) for the test email');
    } else {
      console.log('❌ Email failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Run test
testEmail().catch(console.error);
