import dotenv from 'dotenv';
dotenv.config();

import { sendEmail, emailTemplates } from './src/services/emailService.js';

// Test email sending to specific address
async function testSpecificEmail() {
  console.log('📧 Sending test email to: abhisheksinghaniagca@gmail.com');
  
  // Test data
  const testData = {
    userName: 'Abhishek Singh',
    name: 'Electricity Bill',
    amount: 2500,
    dueDate: new Date().toISOString().split('T')[0]
  };
  
  console.log('Test data:', testData);
  
  try {
    // Test bill reminder
    const result = await sendEmail(
      'abhisheksinghaniagca@gmail.com',
      emailTemplates.billReminder,
      testData
    );
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('Message ID:', result.messageId);
      console.log('📬 Check abhisheksinghaniagca@gmail.com inbox (and spam folder)');
    } else {
      console.log('❌ Email failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

// Run test
testSpecificEmail().catch(console.error);
