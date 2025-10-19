import dotenv from 'dotenv';
dotenv.config();

import { sendEmail, emailTemplates } from './src/services/emailService.js';

// Test email sending
async function testEmail() {
  console.log('Testing email service...');
  
  // Test data
  const testData = {
    userName: 'Test User',
    name: 'Electricity Bill',
    amount: 2500,
    dueDate: new Date().toISOString().split('T')[0]
  };
  
  // Test bill reminder
  const result = await sendEmail(
    process.env.TEST_EMAIL || 'test@example.com',
    emailTemplates.billReminder,
    testData
  );
  
  if (result.success) {
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
  } else {
    console.log('❌ Email failed:', result.error);
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEmail().catch(console.error);
}

export { testEmail };
